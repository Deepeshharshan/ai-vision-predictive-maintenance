# Deployment Architecture

Production is a **containerised multi-service stack** behind a single TLS endpoint. NGINX terminates TLS and routes by path to either the Next.js frontend or the FastAPI backend. AI inference runs as a separate scalable service; PostgreSQL is the only stateful component.

```mermaid
flowchart TB
    subgraph EDGE["🌐 Public Edge"]
        USER["Operator Browser"]
        DNS["DNS / Cloudflare"]
        TLS["TLS 1.3"]
    end

    subgraph PROXY["🛡️ Reverse Proxy"]
        NGX["NGINX<br/>rate-limit · gzip · HTTP/2"]
    end

    subgraph APP["🏢 Application Tier"]
        FE[("frontend<br/>Next.js 15<br/>:3000")]
        BE[("backend<br/>FastAPI · Uvicorn<br/>:8000")]
        WSS[("websocket<br/>python-socketio<br/>:8001")]
        AI[("ai-service<br/>YOLO worker<br/>:9000")]
    end

    subgraph DATA["💾 Data Tier"]
        PG[("postgres:16<br/>:5432")]
        BLOB[("object store<br/>MinIO / S3<br/>:9001")]
    end

    subgraph DEVICE["🏭 Shop-floor"]
        CCTV["Existing CCTV"]
        EDGEBOX["Edge Device<br/>(Jetson / NUC)"]
    end

    USER --> DNS --> TLS --> NGX
    NGX -->|/app · /_next · static| FE
    NGX -->|/api/*| BE
    NGX -->|/socket.io| WSS
    BE --> WSS
    BE --> PG
    BE --> BLOB
    AI --> BE
    CCTV --> EDGEBOX --> AI

    classDef pub fill:#1d4ed8,color:#fff,stroke:#1e3a8a;
    classDef app fill:#7c3aed,color:#fff,stroke:#4c1d95;
    classDef dat fill:#16a34a,color:#fff,stroke:#14532d;
    classDef edg fill:#ea580c,color:#fff,stroke:#7c2d12;
    class USER,DNS,TLS,NGX pub;
    class FE,BE,WSS,AI app;
    class PG,BLOB dat;
    class CCTV,EDGEBOX edg;
```

## Docker Compose (Reference)

```yaml
# docker/docker-compose.yml (excerpt)
version: "3.9"

services:
  frontend:
    build: ../frontend
    image: kronos-frontend:latest
    environment:
      - NEXT_PUBLIC_API_URL=https://kronos.local/api
      - NEXT_PUBLIC_WS_URL=https://kronos.local
    depends_on: [backend]

  backend:
    build: ../backend
    image: kronos-backend:latest
    environment:
      - DATABASE_URL=postgresql+asyncpg://kronos:${DB_PASS}@postgres:5432/kronos
      - JWT_SECRET=${JWT_SECRET}
      - WS_ORIGINS=https://kronos.local
    depends_on: [postgres]

  ai-service:
    build: ../ai
    image: kronos-ai:latest
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]
    environment:
      - BACKEND_URL=http://backend:8000
      - RTSP_STREAMS=${RTSP_STREAMS}
    depends_on: [backend]

  postgres:
    image: postgres:16-alpine
    volumes: [pgdata:/var/lib/postgresql/data]
    environment:
      - POSTGRES_DB=kronos
      - POSTGRES_USER=kronos
      - POSTGRES_PASSWORD=${DB_PASS}

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    volumes: [miniodata:/data]

  nginx:
    image: nginx:1.27-alpine
    ports: ["443:443"]
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/certs:/etc/nginx/certs:ro
    depends_on: [frontend, backend]

volumes:
  pgdata: {}
  miniodata: {}
```

## Environment Mapping

| Component | Local | Production |
|---|---|---|
| Frontend | `npm run dev` (3000) | Container behind NGINX |
| Backend | `uvicorn app.main:reload` (8000) | Container, 4 workers |
| AI Service | `python -m ai.ingest.stream_manager` | Container with GPU reservation |
| Database | `docker compose up postgres` | Managed Postgres (or self-hosted) |
| Object Store | MinIO | AWS S3 / GCS / Azure Blob |

## Scaling Notes

- **Frontend** — stateless; scale horizontally; CDN-cacheable static assets.
- **Backend** — stateless; scale with `replicas: N`; WS sticky-session via `ip_hash` on NGINX.
- **AI Service** — scale per camera; one worker per ~4 streams on GPU, ~1 stream on CPU.
- **Postgres** — primary + read replica; nightly logical backup; WAL archiving.
- **Object Store** — versioned, lifecycle rules for clips older than 90 days.

# Technology Stack & Justifications

Every technology in the stack is **selected to match the constraint** of being a low-cost, MSME-deployable, Industry-4.0 platform. This section documents the choice and the reason.

## Frontend

| Tech | Why |
|---|---|
| **Next.js 15 (App Router)** | React Server Components reduce client bundle; built-in code splitting; mature deployment story (Docker, Vercel, self-host). |
| **TypeScript** | Strong typing of API contracts (`src/types/api.ts`) prevents wire-format drift between FastAPI and the dashboard. |
| **Tailwind CSS 4** | Utility-first; design tokens map to the Dark / Slate-Green palette (`globals.css`); zero-runtime CSS-in-JS cost. |
| **framer-motion** | Subtle, accessible micro-interactions on `MetricCard`, `StatusBadge`, `BentoGrid` for an industrial-control feel. |
| **TanStack Query 5** | Server-state cache, optimistic updates, automatic background refetch — perfect for dashboard KPIs. |
| **axios** | Mature, ergonomic interceptors for JWT injection + 401 redirect (`src/lib/api.ts`). |
| **socket.io-client** | Resilient WebSocket with reconnection; used in `useSocket.ts` for live telemetry. |
| **lucide-react** | Tree-shakable icon set; matches the dense industrial aesthetic. |
| **js-cookie** | Secure cookie storage for the JWT (`kronos_jwt`); SameSite=Strict. |

## Backend

| Tech | Why |
|---|---|
| **FastAPI** | Async-first; automatic OpenAPI generation; Pydantic validation; ideal for industrial workloads. |
| **Pydantic v2** | Strong runtime validation, deterministic error messages for the frontend. |
| **SQLAlchemy 2.x** | Mature async ORM; type-checked queries. |
| **Alembic** | Versioned schema migrations. |
| **python-socketio** | Battle-tested WebSocket layer; integrates with FastAPI/ASGI. |
| **APScheduler / Celery** | Background jobs: snapshot retention, report generation, periodic health-score recompute. |
| **uvicorn + gunicorn** | Production ASGI server with multiple workers. |
| **passlib[bcrypt]** | Industry-standard password hashing. |
| **PyJWT** | Token signing/verification. |

## AI

| Tech | Why |
|---|---|
| **Python 3.11** | Stable; widely-supported for ML workloads. |
| **OpenCV** | The reference image-processing library; fast, GPU-accelerated paths available. |
| **ultralytics (YOLOv8/v11)** | State-of-the-art real-time detector; exportable to ONNX; broad community. |
| **PyTorch** | Underlying runtime for YOLO; supports CUDA + Apple Silicon (MPS). |
| **ByteTrack** | Lightweight tracker (no ReID network) — sufficient for shop-floor scenes. |
| **scikit-learn** | IsolationForest for anomaly detection. |
| **NumPy / pandas** | Telemetry feature windows. |
| **FFmpeg / GStreamer** | RTSP ingestion; resilient reconnection. |

## Database

| Tech | Why |
|---|---|
| **PostgreSQL 16** | Rock-solid ACID; JSONB for flexible metadata; window functions for analytics; mature tooling. |
| **TimescaleDB (optional)** | Hypertable for `telemetry` if scale demands. |
| **pgvector (optional)** | Embedding storage for future similarity search. |
| **MinIO / S3** | Cheap, S3-compatible object store for snapshots and clips. |
| **Redis (optional)** | Cache for dashboard aggregations; Celery broker. |

## Deployment

| Tech | Why |
|---|---|
| **Docker + Compose** | Reproducible, single-command stack; mirrors production. |
| **NGINX** | Reverse proxy, TLS termination, gzip, rate limiting. |
| **Prometheus + Grafana** | Metrics + dashboards; integrates with FastAPI exporter. |
| **Loki** | Lightweight log aggregation. |
| **GitHub Actions** | CI/CD; lint → test → build → push → deploy. |
| **Let's Encrypt / Cloudflare** | Free TLS in front of NGINX. |

## Real-time Communication

| Tech | Why |
|---|---|
| **WebSocket (socket.io)** | Bidirectional, low-latency push of telemetry + alerts. The frontend `useSocket` hook already subscribes per-machine. |
| **Server-Sent Events (fallback)** | Auto-reconnect; simpler than raw WS for analytics streams if needed. |
| **Axios interceptors** | Single source of truth for token injection + 401 handling. |
| **TanStack Query** | Auto-refetch on socket events keeps cached REST resources fresh. |

## Why this stack is right for MSMEs

1. **No vendor lock-in** — every component is open-source and self-hostable.
2. **Reuses existing CCTV** — no rip-and-replace; only an edge box + AI service are added.
3. **Right-sized** — runs on a single modest server; scales horizontally as more cameras are added.
4. **Industry 4.0 ready** — REST + WebSocket + standardised data model = pluggable SCADA / MES integration.
5. **Auditable** — append-only alert timeline, immutable maintenance log, signed report URLs.

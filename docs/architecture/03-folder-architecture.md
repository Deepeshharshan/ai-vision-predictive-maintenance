# Project Folder Architecture

The repository is laid out as a **monorepo of loosely-coupled services**. The Next.js Kronos frontend already lives at the repo root (`src/`, `package.json`). This document defines the surrounding services so the platform is fully deployable.

```text
AI-Powered Vision-Based Predictive Maintenance and QMS/
│
├── frontend/                              # Next.js 15 — Kronos Operator Console
│   ├── src/
│   │   ├── app/                           # App Router routes
│   │   │   ├── layout.tsx                 #   Root HTML & metadata
│   │   │   ├── page.tsx                   #   Marketing / index → /dashboard
│   │   │   ├── error.tsx                  #   Error boundary
│   │   │   ├── not-found.tsx              #   404
│   │   │   ├── login/page.tsx             #   Authentication screen
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx             #   Shell: Sidebar + Header
│   │   │       ├── page.tsx               #   Live telemetry dashboard
│   │   │       ├── loading.tsx            #   Suspense fallback
│   │   │       ├── machines/page.tsx      #   Machine registry
│   │   │       ├── cameras/page.tsx       #   Camera registry
│   │   │       ├── alerts/page.tsx        #   Alert management
│   │   │       ├── analytics/page.tsx     #   OEE & defect analytics
│   │   │       ├── reports/page.tsx       #   Report generation
│   │   │       └── settings/page.tsx      #   Users, roles, notifications
│   │   ├── components/
│   │   │   ├── ui/                        #   Card, Button, Badge, Table
│   │   │   ├── layout/                    #   Header, Sidebar
│   │   │   └── shared/                    #   BentoGrid, MetricCard,
│   │   │                                   #   StatusBadge, DeviceListItem,
│   │   │                                   #   ApiErrorState, LoadingSkeleton
│   │   ├── hooks/
│   │   │   ├── useAuth.ts                 #   Credentials flow, token retention
│   │   │   ├── useSocket.ts               #   Live WebSocket subscription
│   │   │   └── queries/                   #   useDashboard, useMachines,
│   │   │                                   #   useCameras, useAlerts, useAnalytics
│   │   ├── services/                      #   Typed API clients
│   │   │   ├── authService.ts
│   │   │   ├── machineService.ts
│   │   │   ├── cameraService.ts
│   │   │   ├── alertService.ts
│   │   │   ├── analyticsService.ts
│   │   │   └── dashboardService.ts
│   │   ├── lib/api.ts                     #   Axios instance + interceptors
│   │   ├── config/env.ts                  #   API_URL, WS_URL
│   │   ├── providers/QueryProvider.tsx    #   TanStack Query client
│   │   ├── types/
│   │   │   ├── index.ts                   #   Domain types (Device, Telemetry)
│   │   │   └── api.ts                     #   Wire-format types (Alert, Machine)
│   │   ├── utils/cn.ts                    #   className utility
│   │   └── app/globals.css                #   Tailwind 4 + design tokens
│   ├── public/                            #   Static assets, favicons
│   ├── .env.local                         #   API_URL, NEXT_PUBLIC_WS_URL
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                               # FastAPI Application Layer
│   ├── app/
│   │   ├── main.py                        #   ASGI entrypoint
│   │   ├── core/
│   │   │   ├── config.py                  #   Pydantic Settings (.env)
│   │   │   ├── security.py                #   JWT, hashing
│   │   │   ├── deps.py                    #   DI providers
│   │   │   └── logging.py
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── auth.py                #   /auth/login, /auth/verify
│   │   │   │   ├── dashboard.py           #   /dashboard/metrics, /activities
│   │   │   │   ├── machines.py            #   /machines, /machines/{id}
│   │   │   │   ├── cameras.py             #   /cameras, /cameras/{id}/restart
│   │   │   │   ├── alerts.py              #   /alerts, /alerts/{id}/ack, /resolve
│   │   │   │   ├── analytics.py           #   /analytics, /analytics/export
│   │   │   │   ├── reports.py             #   /reports
│   │   │   │   └── settings.py            #   /settings/users, /settings/roles
│   │   │   └── websocket.py               #   /ws/telemetry, /ws/alerts
│   │   ├── schemas/                       #   Pydantic models
│   │   ├── services/                      #   Business logic
│   │   │   ├── alert_service.py
│   │   │   ├── machine_service.py
│   │   │   ├── camera_service.py
│   │   │   └── analytics_service.py
│   │   └── workers/
│   │       └── scheduler.py               #   APScheduler / Celery beat
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── ai/                                    # AI Processing Layer
│   ├── ingest/
│   │   ├── ffmpeg_worker.py               #   RTSP → frames
│   │   └── stream_manager.py              #   Multi-camera lifecycle
│   ├── vision/
│   │   ├── preprocess.py                  #   OpenCV preprocessing
│   │   └── roi.py                         #   Region-of-interest
│   ├── detector/
│   │   ├── yolo.py                        #   YOLO inference
│   │   └── nms.py                         #   Non-max suppression
│   ├── tracker/
│   │   └── bytetrack.py                   #   ID-stable tracking
│   ├── predict/
│   │   ├── health_score.py                #   0-100 health index
│   │   ├── mtbf.py                        #   Mean time between failures
│   │   └── anomaly.py                     #   Anomaly & alert rules
│   ├── analytics/
│   │   └── aggregator.py                  #   OEE, defect categories
│   ├── weights/                           #   YOLO .pt models
│   ├── notebooks/                         #   Exploration / training
│   ├── tests/
│   └── Dockerfile
│
├── database/                              # Data Layer
│   ├── migrations/                        #   Alembic
│   │   └── versions/
│   ├── models/                            #   SQLAlchemy ORM
│   │   ├── user.py
│   │   ├── role.py
│   │   ├── machine.py
│   │   ├── camera.py
│   │   ├── detection.py
│   │   ├── alert.py
│   │   ├── maintenance.py
│   │   ├── report.py
│   │   └── analytics.py
│   ├── repositories/                      #   CRUD per aggregate
│   ├── seeders/                           #   Demo fixtures
│   ├── storage/                           #   Snapshots / clips
│   ├── schema.sql                         #   Reference DDL
│   └── init.sh
│
├── docker/                                # Infrastructure Layer
│   ├── docker-compose.yml                 #   Full stack orchestration
│   ├── docker-compose.dev.yml
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── conf.d/
│   ├── prometheus/
│   │   └── prometheus.yml
│   ├── grafana/
│   │   └── dashboards/
│   └── README.md
│
├── docs/                                  # Documentation
│   ├── README.md                          #   Project handbook
│   ├── architecture/                      #   This directory
│   │   ├── 01-system-architecture.md
│   │   ├── 02-software-architecture.md
│   │   ├── 03-folder-architecture.md
│   │   ├── 04-workflow-diagram.md
│   │   ├── 05-sequence-diagram.md
│   │   ├── 06-deployment-architecture.md
│   │   ├── 07-database-architecture.md
│   │   ├── 08-api-architecture.md
│   │   ├── 09-ai-pipeline.md
│   │   ├── 10-technology-stack.md
│   │   ├── 11-security-architecture.md
│   │   └── 12-drawio-flowcharts.md
│   ├── adr/                               #   Architecture Decision Records
│   └── runbooks/
│
├── datasets/                              # Training / reference data
│   ├── raw/                               #   Unmodified MSME captures
│   ├── annotated/                         #   LabelImg / Roboflow exports
│   ├── processed/                         #   YOLO-format splits
│   └── README.md
│
├── .github/
│   └── workflows/                         #   CI/CD
│       ├── frontend-ci.yml
│       ├── backend-ci.yml
│       └── deploy.yml
│
├── .env.example                           #   Cross-service env template
├── docker-compose.yml                     #   Top-level stack
└── README.md
```

## Folder-by-Folder Explanation

### `frontend/`
The Kronos operator console. **Next.js 15 App Router** with **TypeScript** and **Tailwind 4** (Dark Mode / Slate-Green design tokens). Folder split follows responsibility, not file type:

- `app/` — every route is a page; layout.tsx composes Sidebar + Header; loading.tsx streams Suspense skeletons.
- `components/{ui,layout,shared}/` — UI primitives (Card, Button, Badge, Table), shells (Header, Sidebar), and composite widgets (BentoGrid, MetricCard, StatusBadge, DeviceListItem).
- `hooks/` — `useAuth` for credentials, `useSocket` for live telemetry, `hooks/queries/*` for TanStack Query bindings.
- `services/` — one module per backend domain. Each function maps 1:1 to a backend endpoint.
- `lib/api.ts` — single Axios instance; attaches `Authorization: Bearer <jwt>` and redirects on 401.
- `config/env.ts` — single source of `API_URL` / `NEXT_PUBLIC_WS_URL`.
- `types/` — strong contracts: `index.ts` for in-app domain, `api.ts` for wire format.

### `backend/`
FastAPI service that owns business logic, persistence, and real-time fan-out. Organised by **capability** (api, services, schemas) and **lifecycle** (workers).

### `ai/`
Stateless Python services. Heavy lifting is GPU/CPU-bound; never touches the DB directly. Subfolders mirror the AI pipeline (ingest → vision → detector → tracker → predict → analytics).

### `database/`
Migrations + ORM + repositories. Migrations are versioned with Alembic. Repositories enforce the boundary between business logic and SQL.

### `docker/`
Compose files, NGINX reverse proxy, Prometheus scrape configs, Grafana dashboards.

### `docs/`
All architecture, ADRs, runbooks. The current series (`01-…` through `12-…`) lives under `docs/architecture/`.

### `datasets/`
Not for runtime use — only training. `raw/` is immutable, `processed/` is YOLO-format, splits are reproducible via `seed`.

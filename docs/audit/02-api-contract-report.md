# API Contract Report — VisionGuard AI

> **Purpose:** Single source of truth for the wire contract between the Next.js frontend, FastAPI backend, AI service, and PostgreSQL.
> **Status:** Phase 1 spec — the frontend already has the contract in `src/types/api.ts` and `src/services/*`; this document formalises the same and adds the missing pieces (auth, settings, reports).

---

## 1. Conventions

- **Base URL:** `process.env.NEXT_PUBLIC_API_URL` (default `http://localhost:4000/api`)
- **WebSocket URL:** `process.env.NEXT_PUBLIC_SOCKET_URL` (default `http://localhost:4000`)
- **Auth:** `Authorization: Bearer <jwt>` — JWT issued at `POST /auth/login`
- **Storage:** JWT held in **HTTP-Only `Secure` `SameSite=Strict` cookie** named `kronos_jwt` (rename to `vg_jwt` in next iteration)
- **Content type:** `application/json` (request & response)
- **Pagination:** `?page=1&pageSize=25&sort=-createdAt`
- **Filtering:** `?status=running&location=Bay%203&search=cnc`
- **Errors:** `{ "detail": "msg", "code": "machine_not_found", "requestId": "uuid" }`
- **Timestamps:** ISO 8601 in UTC (`2026-07-11T09:42:11Z`)
- **IDs:** UUID v4

---

## 2. Auth Domain

### `POST /auth/login`
**Request**
```json
{ "email": "operator@msme.local", "password": "string" }
```
**Response 200**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "uuid", "name": "Anita Rao", "email": "...", "role": "operator" }
}
```
**Errors**
- `400 VALIDATION_ERROR` — malformed body
- `401 INVALID_CREDENTIALS` — wrong email or password
- `423 LOCKED` — too many failed attempts

### `GET /auth/verify`
**Headers:** `Authorization: Bearer <jwt>`
**Response 200**
```json
{ "user": { "id": "uuid", "name": "...", "email": "...", "role": "operator" } }
```
**Errors**
- `401 TOKEN_INVALID`
- `401 TOKEN_EXPIRED`

### `POST /auth/logout`
**Response 204** — server invalidates the refresh token (stateless JWT remains valid until expiry; client must clear cookie).

### `POST /auth/refresh`
**Response 200** — same shape as `/auth/login`. Sliding 1h window.

---

## 3. Dashboard Domain

### `GET /dashboard/metrics`
**Response 200** — matches `DashboardMetricsSummary` in `src/types/api.ts`:
```json
{
  "productionRate": 142,
  "productionTarget": 160,
  "efficiency": 88.7,
  "downtime": 23,
  "defects": 4,
  "shiftDefectLimit": 6
}
```

### `GET /dashboard/activities?limit=20`
**Response 200** — `RecentActivity[]`:
```json
[
  { "id": "uuid", "timestamp": "2026-07-11T09:42:11Z", "user": "Anita Rao", "event": "Acknowledged alert A-991", "status": "success" }
]
```

---

## 4. Machines Domain

### `GET /machines?status=&search=&page=&pageSize=`
**Response 200** — `Machine[]` (matches existing `Machine` interface).

### `GET /machines/{id}`
**Response 200** — single `Machine` including `maintenance[]`.

### `GET /machines/{id}/telemetry?range=1h`
**Response 200**
```json
{
  "machineId": "m-001",
  "range": "1h",
  "points": [
    { "timestamp": "2026-07-11T09:00:00Z", "temperature": 78.2, "vibration": 4.6, "voltage": 228, "pressure": 122 }
  ]
}
```

### `POST /machines` (admin)
**Request**
```json
{ "name": "CNC-A2", "type": "CNC Milling", "location": "Bay 4", "assignedCameraId": "cam-15" }
```

### `PATCH /machines/{id}` (admin/engineer)
### `DELETE /machines/{id}` (admin) — soft delete

---

## 5. Cameras Domain

### `GET /cameras?location=&status=`
**Response 200** — `CameraStream[]` with `detections[]` (latest snapshot).

### `GET /cameras/{id}`
**Response 200** — single camera, includes last 10 detection events.

### `POST /cameras` (engineer)
```json
{ "name": "Bay 3 - North", "location": "Bay 3", "rtspUrl": "rtsp://...", "assignedMachineId": "m-001" }
```

### `PATCH /cameras/{id}` (engineer)
### `DELETE /cameras/{id}` (admin)
### `POST /cameras/{id}/restart` (engineer)
**Response 200** — `{ "success": true, "streamId": "uuid" }`

### `POST /cameras/{id}/upload` (engineer)
Multipart video upload (≤ 500 MB). Returns `{ "jobId": "uuid" }`; AI service processes asynchronously.

---

## 6. Alerts Domain

### `GET /alerts?level=&status=&search=&page=&pageSize=`
**Response 200** — `Alert[]` with `timeline[]` (latest first).

### `GET /alerts/{id}`
### `POST /alerts/{id}/acknowledge` (engineer)
**Response 200** — updated `Alert`.
### `POST /alerts/{id}/resolve` (engineer)
**Request** — `{ "notes": "..." }`
**Response 200** — updated `Alert`.
### `POST /alerts/bulk-acknowledge` (engineer)
**Request** — `{ "ids": ["uuid", ...] }`
**Response 200** — `{ "acknowledged": 12, "failed": 0 }`

---

## 7. Analytics Domain

### `GET /analytics?range=24h|7d|30d`
**Response 200** — matches `AnalyticsData`:
```json
{
  "weeklyOEE": [
    { "day": "Mon", "active": 78, "idle": 12, "down": 10, "oee": 78.0 }
  ],
  "defectCategories": [
    { "label": "Surface Scratch", "count": 12, "pct": 40, "color": "#f59e0b" }
  ],
  "avgOEE": 79.4
}
```

### `GET /analytics/mtbf?range=30d`
**Response 200**
```json
{
  "items": [
    { "machineId": "m-001", "name": "DEV-001 Rotary Fan", "mtbf": 720, "lastFailure": "2026-06-15", "trend": "up" }
  ]
}
```

### `GET /analytics/downtime?range=30d`
```json
{
  "items": [
    { "date": "2026-07-08", "machine": "DEV-004", "duration": "ONGOING", "type": "Emergency", "cost": "High" }
  ]
}
```

### `GET /analytics/export?range=7d&type=pdf|excel` — returns binary stream.

---

## 8. Reports Domain

### `GET /reports?period=daily|weekly|monthly`
**Response 200**
```json
[
  {
    "id": "RPT-2026-07-09",
    "title": "Daily Operations Report",
    "period": "daily",
    "date": "2026-07-09",
    "generatedAt": "2026-07-09T23:59:00Z",
    "status": "ready",
    "size": 1200000,
    "kpis": [
      { "label": "Line Throughput", "value": "485 units/hr", "change": "+4.2%", "direction": "up" }
    ]
  }
]
```

### `POST /reports` (engineer)
**Request**
```json
{ "period": "daily", "date": "2026-07-11", "type": "pdf" }
```
**Response 202** — `{ "id": "uuid", "status": "queued" }`

### `GET /reports/{id}/download` — signed URL, expires in 5 min.

---

## 9. Settings Domain (admin)

### `GET /settings/users`
### `POST /settings/users`
```json
{ "name": "Sarah Miller", "email": "sarah@msme.local", "role": "engineer" }
```
### `PATCH /settings/users/{id}` — update role/status
### `DELETE /settings/users/{id}` — soft delete

### `GET /settings/notifications`
```json
{
  "emailEnabled": true, "emailAddress": "alerts@msme.local",
  "smsEnabled": false, "smsNumber": "+1...",
  "slackEnabled": true, "slackWebhook": "https://hooks.slack.com/...",
  "criticalOnly": false, "alertThrottleMin": 5
}
```
### `PUT /settings/notifications`

### `GET /settings/cameras`
```json
{
  "defaultFps": 30, "defaultResolution": "1920x1080",
  "aiConfidenceThreshold": 85, "retentionDays": 30,
  "recordingEnabled": true, "motionDetection": true
}
```
### `PUT /settings/cameras`

### `GET /settings/company`
### `PUT /settings/company`

### `GET /settings/roles`
```json
{
  "roles": [
    { "name": "admin", "permissions": ["*"] },
    { "name": "engineer", "permissions": ["dashboard:r", "cameras:rw", "alerts:ack", "alerts:resolve"] },
    { "name": "operator", "permissions": ["dashboard:r", "cameras:r", "alerts:ack"] }
  ]
}
```

---

## 10. WebSocket Channels

### Connect
`wss://<host>/socket.io/?EIO=4&transport=websocket` — auto-attaches `kronos_jwt` cookie.

### `subscribe:metrics`
Client → Server: `{ "machineId": "m-001" }`
Server → Client (1 Hz): `TelemetryPayload` (existing `TelemetryPayload` interface).

### `alerts:new`
Server → Client (push): full `Alert` object.

### `camera:detection`
Server → Client (push on each detection event):
```json
{ "cameraId": "cam-12", "machineId": "m-001", "label": "defect", "confidence": 0.93, "box": [x, y, w, h], "snapshotUrl": "https://...", "timestamp": "2026-07-11T09:43:00Z" }
```

### `system:status`
Server → Client (heartbeat every 5s):
```json
{ "online": true, "aiWorkers": 2, "queueDepth": 3, "ts": "2026-07-11T09:43:00Z" }
```

---

## 11. AI Service Endpoints (internal)

The AI service is **internal**, not directly hit by the frontend. It exposes:

- `POST /internal/ingest` — start a stream job (RTSP or uploaded video)
- `POST /internal/ingest/{jobId}/stop`
- `GET /internal/jobs/{jobId}` — status, frame count, detections
- WebSocket `ws://ai/ws/jobs/{jobId}` — per-frame detection stream for the UI camera page

---

## 12. Cross-cutting

| Concern | Contract |
|---|---|
| **Rate limiting** | `120 req/min/IP` for general, `10 req/min/IP` for `/auth/login` |
| **CORS** | allow-list only (frontend origin + admin origin) |
| **Idempotency** | `Idempotency-Key` header on POST for write operations |
| **Versioning** | All routes prefixed `/api/v1/...` |
| **OpenAPI** | `/api/v1/docs` (Swagger UI) in non-prod |
| **Health** | `GET /healthz` — 200 if DB + AI worker reachable |
| **Migrations** | Alembic; CI fails on dirty working tree |

---

## 13. Frontend Service Mapping (current → target)

| File (`src/services/*`) | Endpoint | Phase |
|---|---|---|
| `authService.login` | `POST /auth/login` | 3 |
| `authService.verifyToken` | `GET /auth/verify` | 3 |
| `authService.logout` | `POST /auth/logout` | 3 |
| `dashboardService.getMetricsSummary` | `GET /dashboard/metrics` | 4 |
| `dashboardService.getRecentActivities` | `GET /dashboard/activities` | 4 |
| `machineService.getMachines` | `GET /machines` | 4 |
| `machineService.getMachineById` | `GET /machines/{id}` | 4 |
| `cameraService.getCameras` | `GET /cameras` | 4 |
| `cameraService.restartStream` | `POST /cameras/{id}/restart` | 4 |
| `alertService.getAlerts` | `GET /alerts` | 4 |
| `alertService.acknowledgeAlert` | `POST /alerts/{id}/acknowledge` | 4 |
| `alertService.resolveAlert` | `POST /alerts/{id}/resolve` | 4 |
| `analyticsService.getAnalytics` | `GET /analytics` | 4 |
| `analyticsService.exportReport` | `GET /analytics/export` | 4 |

New services to add in Phase 4: `reportsService`, `settingsService`, `userService`, `notificationService`.

---

## 14. What I Will Build First

1. **Phase 2** — Backend skeleton (`backend/app/`) with config, DB connection, health, CORS, JWT middleware; Supabase schema + seed.
2. **Phase 3** — Auth endpoints + replace `useAuth` mock.
3. **Phase 4** — CRUD endpoints + replace mock data on every page.
4. **Phase 5** — WebSocket channels (telemetry, alerts, detections) + replace `useSocket` mock.
5. **Phase 6** — AI service skeleton (ingest, detect, health score).
6. **Phase 7** — End-to-end test: stream → detect → alert → dashboard.
7. **Phase 8** — Production hardening (rate limiting, OpenAPI polish, Docker compose).

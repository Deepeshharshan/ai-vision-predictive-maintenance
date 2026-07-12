# API Architecture

The HTTP API is the **contract** between Kronos (`frontend/`) and the FastAPI service. All endpoints are versioned under `/api/v1` and return JSON. Auth uses **JWT bearer tokens** stored as secure cookies.

**Base URL:** `https://kronos.local/api/v1`

## Endpoint Catalog

### Authentication

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | public | Verify credentials, return JWT |
| `POST` | `/auth/logout` | bearer | Invalidate session (client-side cookie clear) |
| `GET`  | `/auth/verify` | bearer | Validate token; returns user |
| `POST` | `/auth/refresh` | bearer | Issue a new JWT (sliding window) |

#### `POST /auth/login`
**Request**
```json
{ "email": "operator@msme.local", "password": "string" }
```
**Response 200**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "uuid", "name": "Anita Rao", "role": "operator" }
}
```
**Response 401**
```json
{ "detail": "Invalid credentials" }
```

### Dashboard

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/dashboard/metrics` | bearer | KPI summary (production rate, efficiency, downtime, defects) |
| `GET` | `/dashboard/activities` | bearer | Recent activity feed |

#### `GET /dashboard/metrics`
**Response 200**
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

### Machines

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET`    | `/machines`                | bearer | List machines, filter `?status=&search=` |
| `GET`    | `/machines/{id}`           | bearer | Machine detail incl. maintenance history |
| `POST`   | `/machines`                | admin  | Register a new machine |
| `PATCH`  | `/machines/{id}`           | engineer | Update machine metadata |
| `DELETE` | `/machines/{id}`           | admin  | Soft-delete a machine |
| `GET`    | `/machines/{id}/telemetry` | bearer | Recent telemetry window |

#### `GET /machines`
**Response 200**
```json
[
  {
    "id": "m-001",
    "name": "CNC-A1",
    "type": "CNC Milling",
    "location": "Bay 3",
    "status": "warning",
    "lastUpdated": "2026-07-11T09:42:11Z",
    "assignedCamera": "cam-12",
    "nextMaintenanceDate": "2026-07-20",
    "operatingHours": 4218.5,
    "mtbf": "120h",
    "metrics": { "temperature": 78.2, "vibration": 4.6, "voltage": 228, "pressure": 122 },
    "maintenance": [
      { "date": "2026-06-12", "type": "Preventative", "engineer": "R. Iyer",
        "duration": "45m", "notes": "Lubricant top-up", "resolved": true }
    ]
  }
]
```

### Cameras

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET`    | `/cameras`              | bearer | List cameras, filter `?location=` |
| `GET`    | `/cameras/{id}`         | bearer | Camera detail |
| `POST`   | `/cameras`              | engineer | Register a new camera (RTSP URL) |
| `PATCH`  | `/cameras/{id}`         | engineer | Update metadata |
| `POST`   | `/cameras/{id}/restart` | engineer | Force stream restart |

#### `POST /cameras/{id}/restart`
**Response 200**
```json
{ "success": true }
```

### Alerts

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET`  | `/alerts` | bearer | List alerts, filter `?level=&status=&search=` |
| `GET`  | `/alerts/{id}` | bearer | Alert detail with timeline |
| `POST` | `/alerts/{id}/acknowledge` | engineer | Mark acknowledged |
| `POST` | `/alerts/{id}/resolve`     | engineer | Mark resolved with notes |

#### `POST /alerts/{id}/acknowledge`
**Request** — empty
**Response 200**
```json
{
  "id": "a-991",
  "status": "acknowledged",
  "acknowledgedBy": "u-44",
  "acknowledgedAt": "2026-07-11T09:43:00Z",
  "timeline": [
    { "time": "2026-07-11T09:42:11Z", "action": "created",   "actor": "system" },
    { "time": "2026-07-11T09:43:00Z", "action": "ack",       "actor": "Anita Rao" }
  ]
}
```

#### `POST /alerts/{id}/resolve`
**Request**
```json
{ "notes": "Replaced spindle bearing; vibration back to normal." }
```
**Response 200**
```json
{
  "id": "a-991",
  "status": "resolved",
  "resolvedBy": "u-44",
  "resolvedAt": "2026-07-11T10:02:18Z",
  "notes": "Replaced spindle bearing; vibration back to normal."
}
```

### Analytics

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET`  | `/analytics`            | bearer | OEE, defect categories, `?range=24h|7d|30d` |
| `GET`  | `/analytics/export`     | bearer | Download PDF / Excel report |
| `GET`  | `/analytics/defects`    | bearer | Per-category defect counts |

#### `GET /analytics?range=7d`
**Response 200**
```json
{
  "weeklyOEE": [
    { "day": "Mon", "active": 78, "idle": 12, "down": 10, "oee": 78.0 },
    { "day": "Tue", "active": 81, "idle": 9,  "down": 10, "oee": 81.0 }
  ],
  "defectCategories": [
    { "label": "Surface Scratch", "count": 12, "pct": 40, "color": "#f59e0b" },
    { "label": "Dimensional",     "count": 9,  "pct": 30, "color": "#ef4444" }
  ],
  "avgOEE": 79.4
}
```

### Reports

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET`  | `/reports`            | bearer | List generated reports |
| `POST` | `/reports`            | engineer | Trigger a new report (`pdf`/`excel`) |
| `GET`  | `/reports/{id}/download` | bearer | Stream file (signed URL) |

#### `POST /reports`
**Request**
```json
{ "type": "pdf", "period": "2026-07-01..2026-07-11", "scope": "all" }
```
**Response 202**
```json
{ "id": "r-2026-07-11-001", "status": "queued" }
```

### Settings

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET`  | `/settings/users`          | admin | List users |
| `POST` | `/settings/users`          | admin | Create user |
| `PATCH`| `/settings/users/{id}`     | admin | Update user (role, status) |
| `GET`  | `/settings/roles`          | admin | List roles |
| `GET`  | `/settings/notifications`  | admin | Channel + thresholds |
| `PUT`  | `/settings/notifications`  | admin | Update channel + thresholds |
| `GET`  | `/settings/cameras`        | admin | Per-camera AI thresholds |
| `GET`  | `/settings/company`        | admin | Tenant info |

## WebSocket Channels

| Channel | Direction | Payload |
|---|---|---|
| `/ws/telemetry?machineId=...` | server → client | `TelemetryPayload` (1 Hz) |
| `/ws/alerts`                  | server → client | `Alert` push on creation |
| `/ws/cameras`                 | server → client | `CameraStream.status` updates |

### Sample WS message
```json
{
  "deviceId": "m-001",
  "timestamp": "2026-07-11T09:43:00.123Z",
  "metrics": { "temperature": 78.4, "vibration": 4.7, "voltage": 228, "pressure": 121 },
  "status": "warning"
}
```

## Error Model

All errors follow a consistent shape:
```json
{ "detail": "Human-readable message", "code": "machine_not_found", "requestId": "..." }
```

| HTTP | Meaning |
|------|---------|
| 400 | Validation error (Pydantic) |
| 401 | Missing / invalid token |
| 403 | Role insufficient |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate camera URL) |
| 422 | Semantic error |
| 500 | Server error (request id in response) |

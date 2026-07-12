# Database Architecture

The data model is **relational-first** (PostgreSQL 16) with time-series and audit-friendly patterns. Ten core tables cover identity, fleet, detection, alerting, maintenance, and analytics.

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES       : has
    ROLES ||--o{ USER_ROLES       : grants
    USERS ||--o{ ALERTS           : "ack / resolve"
    USERS ||--o{ MAINTENANCE      : "performs"
    USERS ||--o{ REPORTS          : "generates"
    USERS ||--o{ ACTIVITY_LOGS    : "creates"

    MACHINES ||--o{ CAMERAS       : "monitored by"
    MACHINES ||--o{ DETECTIONS    : "produces"
    MACHINES ||--o{ ALERTS        : "raises"
    MACHINES ||--o{ MAINTENANCE   : "subject of"
    MACHINES ||--o{ TELEMETRY     : "emits"
    MACHINES ||--o{ ANALYTICS     : "aggregated into"

    CAMERAS ||--o{ DETECTIONS     : "captures"
    CAMERAS ||--o{ ALERTS         : "source of"
    CAMERAS ||--o{ STREAM_LOGS    : "produces"

    ALERTS ||--o{ ALERT_TIMELINE  : "tracks"
    DETECTIONS ||--o{ ALERTS      : "triggers"

    MACHINES ||--o{ REPORTS       : "covered by"

    USERS {
        uuid id PK
        string email
        string password_hash
        string name
        string status
        timestamp last_login
    }
    ROLES {
        int id PK
        string name "admin | engineer | operator"
        string description
    }
    USER_ROLES {
        uuid user_id FK
        int role_id FK
    }
    MACHINES {
        uuid id PK
        string name
        string type
        string location
        string status "running | warning | critical | offline"
        timestamp last_updated
        uuid assigned_camera_id FK
        date next_maintenance_date
        float operating_hours
        string mtbf
    }
    CAMERAS {
        uuid id PK
        string name
        string location
        string rtsp_url
        string status "online | offline"
        int fps
        string resolution
        string bitrate
        float health
        string uptime
        uuid assigned_machine_id FK
    }
    DETECTIONS {
        uuid id PK
        uuid camera_id FK
        uuid machine_id FK
        string label
        float confidence
        float bbox_x
        float bbox_y
        float bbox_w
        float bbox_h
        int track_id
        string snapshot_url
        timestamp created_at
    }
    ALERTS {
        uuid id PK
        uuid machine_id FK
        uuid camera_id FK
        string level "error | warn | info"
        string status "active | acknowledged | resolved"
        string message
        string source
        uuid acknowledged_by FK
        timestamp acknowledged_at
        uuid resolved_by FK
        timestamp resolved_at
        text notes
        timestamp created_at
    }
    ALERT_TIMELINE {
        uuid id PK
        uuid alert_id FK
        timestamp time
        string action
        string actor
    }
    MAINTENANCE {
        uuid id PK
        uuid machine_id FK
        uuid engineer_id FK
        date scheduled_date
        string type "Preventative | Emergency | Inspection | Corrective"
        int duration_minutes
        text notes
        boolean resolved
        timestamp created_at
    }
    TELEMETRY {
        bigserial id PK
        uuid machine_id FK
        float temperature
        float vibration
        float voltage
        float pressure
        timestamp recorded_at
    }
    ANALYTICS {
        uuid id PK
        uuid machine_id FK
        date period_start
        date period_end
        float oee
        float defect_rate
        float downtime_minutes
        timestamp created_at
    }
    REPORTS {
        uuid id PK
        uuid generated_by FK
        string type "pdf | excel"
        string period
        string url
        timestamp created_at
    }
    ACTIVITY_LOGS {
        uuid id PK
        uuid user_id FK
        string event
        string status
        timestamp created_at
    }
    STREAM_LOGS {
        uuid id PK
        uuid camera_id FK
        timestamp started_at
        timestamp ended_at
        int frames_processed
        string status
    }
```

## Table Summaries

### Identity
- **`users`** — operator/engineer/admin accounts; bcrypt password hashes; soft-deletable.
- **`roles`** — three fixed roles, seeded at migration time.
- **`user_roles`** — many-to-many join (reserved for future fine-grained permissions).

### Fleet
- **`machines`** — physical assets; one row per machine; `assigned_camera_id` is nullable 0..1.
- **`cameras`** — IP/analog cameras; `rtsp_url`, status, FPS, bitrate, health (0–100).
- **`stream_logs`** — lifecycle record of every camera session (helps debug ingest).

### Detection & Alerting
- **`detections`** — one row per accepted YOLO detection; includes `track_id` for stable correlation.
- **`alerts`** — derived from detection(s) or telemetry; carries lifecycle state.
- **`alert_timeline`** — append-only audit; satisfies "who did what when" requirements.

### Maintenance & Reporting
- **`maintenance`** — scheduled + ad-hoc maintenance; type, duration, engineer, outcome.
- **`reports`** — generated exports (`pdf`, `excel`); stored in object store with a URL.

### Telemetry & Analytics
- **`telemetry`** — append-only time-series (consider TimescaleDB hypertable).
- **`analytics`** — pre-aggregated rollups (OEE, defect rate, downtime).

## Indexing Strategy

| Index | Purpose |
|---|---|
| `idx_detections_camera_time` `(camera_id, created_at DESC)` | Latest-detections query |
| `idx_alerts_status_level` `(status, level)` | Active alert dashboard |
| `idx_telemetry_machine_time` `(machine_id, recorded_at DESC)` | Health score window |
| `idx_machines_status` `(status)` WHERE status != 'running' | "Needs attention" panel |
| `idx_alerts_machine_time` `(machine_id, created_at DESC)` | Per-machine alert history |

## Data Retention

- **Detections** — keep 30 days online, archive to cold storage.
- **Telemetry** — keep 90 days at full resolution, downsample to 1 min beyond.
- **Alerts + Timeline** — keep indefinitely (audit).
- **Reports** — keep indefinitely with object-store lifecycle rules.

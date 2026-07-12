# Sequence Diagram — End-to-End Request Flow

This diagram captures the live interaction between an **Operator** and the system, including the cold REST path (login → dashboard) and the hot WebSocket path (live alert → acknowledge).

```mermaid
sequenceDiagram
    autonumber
    actor Op as 👷 Operator
    participant FE as 🖥️ Next.js (Kronos)
    participant BE as 🛰️ FastAPI
    participant WS as 🔌 WebSocket Gateway
    participant AI as 🧠 AI Engine
    participant DB as 💾 PostgreSQL
    participant CAM as 📹 CCTV Camera

    %% ===== LOGIN =====
    Op->>FE: Enter credentials (login form)
    FE->>BE: POST /auth/login { email, password }
    BE->>DB: SELECT user WHERE email = ?
    DB-->>BE: user row
    BE->>BE: Verify bcrypt(password)
    BE->>BE: Issue JWT (HS256, 1h)
    BE-->>FE: 200 { token, user }
    FE->>FE: Cookies.set('kronos_jwt', token)
    FE->>BE: GET /dashboard/metrics (Bearer)
    BE->>DB: Aggregate SELECT
    DB-->>BE: counts / rates
    BE-->>FE: DashboardMetricsSummary
    FE-->>Op: Render Dashboard

    %% ===== CAMERA LOOP =====
    Note over CAM,AI: Continuous (independent of user)
    CAM->>AI: RTSP frames
    AI->>AI: Preprocess → YOLO → Track
    AI->>BE: POST /detections (batch)
    BE->>DB: INSERT detections
    AI->>BE: POST /alerts (when anomaly)
    BE->>DB: INSERT alert
    BE->>WS: emit "alert.created"
    WS-->>FE: push { alert }
    FE->>FE: TanStack Query invalidate
    FE-->>Op: Toast + update Alerts page

    %% ===== ACKNOWLEDGE =====
    Op->>FE: Click "Acknowledge"
    FE->>BE: POST /alerts/{id}/acknowledge
    BE->>DB: UPDATE alert SET status='acknowledged'
    DB-->>BE: ok
    BE-->>FE: Alert (updated)
    FE-->>Op: UI reflects new status

    %% ===== LIVE TELEMETRY =====
    Op->>FE: Open machine detail
    FE->>WS: subscribe "telemetry:{machineId}"
    WS-->>FE: TelemetryPayload (1Hz)
    FE-->>Op: Update MetricCards

    %% ===== LOGOUT =====
    Op->>FE: Click logout
    FE->>FE: Cookies.remove('kronos_jwt')
    FE-->>Op: Redirect /login
```

## Explanation

### Cold Path (REST)
1. **Login** — `authService.login()` posts to `/auth/login`; on success, the token is stored as a **secure SameSite=Strict cookie** named `kronos_jwt`.
2. **Dashboard** — `dashboardService.getMetricsSummary()` calls `GET /dashboard/metrics`. The Axios interceptor (`src/lib/api.ts:18-25`) attaches the bearer token automatically.
3. **Axios 401** — the response interceptor clears the cookie and redirects to `/login`.

### Hot Path (WebSocket)
1. The AI Engine writes a new alert through the FastAPI backend.
2. The backend emits the event to the WebSocket gateway.
3. The Next.js client (`useSocket`) receives the push and triggers a TanStack Query invalidation.
4. The dashboard updates with no manual refresh.

### Telemetry Stream
When the operator opens a machine detail page, the client subscribes to `telemetry:{machineId}`. The server pushes ~1 update/sec; the React component re-renders `MetricCard`s without an extra REST call.

### Audit Trail
Acknowledge and Resolve write `acknowledgedBy` / `resolvedBy` / timestamps and append a timeline entry, satisfying the compliance story for MSME quality audits.

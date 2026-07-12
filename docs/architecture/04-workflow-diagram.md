# Complete Workflow Diagram

This is the canonical end-to-end flow: from a physical camera to a notification in the operator's browser. The diagram is intentionally procedural so every step is auditable.

```mermaid
flowchart TD
    START([🏭 CCTV Camera<br/>Existing IP/Analog]) --> STREAM[/📡 RTSP / H.264<br/>30 fps/]
    STREAM --> EDGE{Edge device<br/>or server capture}
    EDGE --> FRAME[🖼️ Frame Extraction<br/>1–5 fps JPEG]
    FRAME --> PRE[🎨 Image Preprocessing<br/>OpenCV: resize, denoise,<br/>ROI, normalise]
    PRE --> INF[🧠 AI Detection<br/>YOLO + NMS]
    INF --> CONF{Confidence<br/>≥ threshold?}
    CONF -- No --> DROP([Drop frame])
    CONF -- Yes --> TRK[🎯 Object Tracking<br/>ByteTrack / DeepSORT]
    TRK --> TID{Stable ID<br/>persisted?}
    TID -- No --> TRK
    TID -- Yes --> SCORE[📈 Predictive Maintenance<br/>Health Score]
    SCORE --> ANOM{Anomaly score<br/>≥ threshold?}
    ANOM -- No --> LOG[📝 Log metrics<br/>PostgreSQL]
    ANOM -- Yes --> ALERT[🚨 Alert Generation<br/>level: info / warn / error]
    ALERT --> PUSH[📤 Push to WebSocket<br/>fan-out]
    LOG --> ROLL[📊 Analytics Rollup<br/>OEE, defect distribution]
    ROLL --> DASH[🖥️ Dashboard refresh<br/>TanStack Query refetch]
    PUSH --> WSCLIENT[⚡ WebSocket client<br/>useSocket hook]
    WSCLIENT --> UI[👀 Operator Dashboard]
    DASH --> UI
    UI --> ACK{Acknowledge /<br/>Resolve?}
    ACK -- Yes --> DBWRITE[💾 Write audit trail<br/>acknowledgedBy · resolvedBy]
    DBWRITE --> UI
    ACK -- No --> UI

    classDef camera fill:#0ea5e9,color:#fff,stroke:#0369a1;
    classDef ai     fill:#a78bfa,color:#fff,stroke:#6d28d9;
    classDef alert  fill:#f59e0b,color:#000,stroke:#b45309;
    classDef store  fill:#22c55e,color:#fff,stroke:#15803d;
    classDef ui     fill:#ec4899,color:#fff,stroke:#be185d;
    classDef dec    fill:#1e293b,color:#e2e8f0,stroke:#475569;
    class START,STREAM camera;
    class FRAME,PRE,INF,TRK,SCORE ai;
    class ALERT,PUSH alert;
    class LOG,ROLL,DBWRITE store;
    class UI,WSCLIENT,DASH ui;
    class EDGE,CONF,TID,ANOM,ACK dec;
```

## Step-by-Step Explanation

| # | Stage | Component | Purpose |
|---|-------|-----------|---------|
| 1 | Camera | `CCTV` | Existing shop-floor cameras (no new hardware required). |
| 2 | Video Stream | `RTSP` | Native H.264 stream over the LAN. |
| 3 | Frame Extraction | `ai/ingest/ffmpeg_worker.py` | Decodes stream, samples at 1–5 FPS, encodes JPEG. |
| 4 | Image Preprocessing | `ai/vision/preprocess.py` | Resize to 640×640, denoise, ROI crop, channel normalisation. |
| 5 | AI Detection | `ai/detector/yolo.py` | YOLO inference → `[label, confidence, bbox]`. |
| 6 | Confidence Filter | Decision | Drops low-confidence detections to reduce false positives. |
| 7 | Object Tracking | `ai/tracker/bytetrack.py` | Maintains persistent IDs across frames. |
| 8 | Predictive Maintenance | `ai/predict/health_score.py` | Aggregates 30s/5min windows into a 0–100 health score. |
| 9 | Anomaly Decision | Decision | If score < threshold → alert; else just log. |
| 10 | Alert Generation | `ai/predict/anomaly.py` | Produces `Alert` records (`level: error/warn/info`). |
| 11 | Database Write | `database/repositories/AlertRepository` | Persists alert + detection + telemetry. |
| 12 | WebSocket Push | `backend/app/api/websocket.py` | Fans out to subscribed operator sessions. |
| 13 | Dashboard Refresh | TanStack Query | Auto-invalidates affected queries. |
| 14 | Operator Action | `useAuth` + `alertService` | Acknowledge / Resolve; writes audit trail. |

## Decision Points

- **Confidence threshold** — reduces noise; configurable per camera in `/dashboard/settings`.
- **Stable ID persistence** — short track histories are dropped to avoid spurious health-score swings.
- **Anomaly threshold** — two-stage: rolling-zscore AND a YOLO visual-defect signal.
- **Acknowledge vs. Resolve** — both produce immutable audit entries (operator/engineer roles).

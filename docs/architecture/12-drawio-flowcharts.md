# Draw.io-Compatible Flowcharts

This file provides **Draw.io (diagrams.net) compatible XML** for the most important diagrams. You can either:
- **Copy-paste the Mermaid blocks** from the previous files into any Mermaid renderer, or
- **Import the XML below** into Draw.io (drag the `.xml` file onto a Draw.io canvas, or `File → Import`).

---

## 1. High-Level System Architecture (Draw.io)

```xml
<mxfile host="app.diagrams.net">
  <diagram name="System Architecture" id="sys-arch">
    <mxGraphModel dx="2000" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1"
                  connect="1" arrows="1" fold="1" page="1" pageScale="1"
                  pageWidth="1600" pageHeight="900" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- FIELD -->
        <mxCell id="field" value="🏭 Shop-floor (Edge)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#22d3ee;fontColor=#e2e8f0;verticalAlign=top;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="220" height="280" as="geometry"/>
        </mxCell>
        <mxCell id="cam1" value="Existing CCTV" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#22d3ee;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="60" y="80" width="180" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="cam2" value="Existing CCTV" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#22d3ee;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="60" y="130" width="180" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="rtsp" value="RTSP / IP Stream" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#22d3ee;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="60" y="180" width="180" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="edge" value="Edge Device" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#22d3ee;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="60" y="230" width="180" height="40" as="geometry"/>
        </mxCell>

        <!-- AI LAYER -->
        <mxCell id="ai" value="🧠 AI Processing Layer" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#a78bfa;fontColor=#e2e8f0;verticalAlign=top;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="300" y="40" width="220" height="380" as="geometry"/>
        </mxCell>
        <mxCell id="ing" value="Video Ingestion" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#a78bfa;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="320" y="80" width="180" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="ocv" value="OpenCV" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#a78bfa;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="320" y="130" width="180" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="yolo" value="YOLO Detector" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#a78bfa;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="320" y="180" width="180" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="trk" value="Object Tracker" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#a78bfa;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="320" y="230" width="180" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="pme" value="Predictive Engine" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#a78bfa;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="320" y="280" width="180" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="aae" value="Alert Engine" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#a78bfa;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="320" y="330" width="180" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="ane" value="Analytics Engine" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#a78bfa;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="320" y="380" width="180" height="40" as="geometry"/>
        </mxCell>

        <!-- BACKEND -->
        <mxCell id="be" value="🛰️ Application Layer — FastAPI" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#34d399;fontColor=#e2e8f0;verticalAlign=top;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="560" y="40" width="220" height="280" as="geometry"/>
        </mxCell>
        <mxCell id="api" value="FastAPI REST API" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#34d399;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="580" y="80" width="180" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="wss" value="WebSocket Server" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#34d399;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="580" y="150" width="180" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="sched" value="Scheduler / Workers" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#34d399;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="580" y="200" width="180" height="40" as="geometry"/>
        </mxCell>

        <!-- DATA -->
        <mxCell id="db" value="💾 Data Layer" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#f59e0b;fontColor=#e2e8f0;verticalAlign=top;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="820" y="40" width="220" height="180" as="geometry"/>
        </mxCell>
        <mxCell id="pg" value="PostgreSQL" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#0f172a;strokeColor=#f59e0b;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="840" y="100" width="80" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="blob" value="Object Store" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#0f172a;strokeColor=#f59e0b;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="940" y="100" width="80" height="80" as="geometry"/>
        </mxCell>

        <!-- FRONTEND -->
        <mxCell id="fe" value="🖥️ Presentation — Next.js 15 (Kronos)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#f472b6;fontColor=#e2e8f0;verticalAlign=top;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="1080" y="40" width="220" height="280" as="geometry"/>
        </mxCell>
        <mxCell id="nx" value="Next.js App Router" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#f472b6;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="1100" y="80" width="180" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="dsh" value="Operator Dashboard" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#f472b6;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="1100" y="130" width="180" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="wsx" value="WebSocket Client" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#f472b6;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="1100" y="180" width="180" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="rq" value="TanStack Query" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#f472b6;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="1100" y="230" width="180" height="40" as="geometry"/>
        </mxCell>

        <!-- EDGES -->
        <mxCell id="e1" style="endArrow=classic;html=1;strokeColor=#22d3ee" edge="1" parent="1" source="edge" target="ing"/>
        <mxCell id="e2" style="endArrow=classic;html=1;strokeColor=#a78bfa" edge="1" parent="1" source="ing" target="ocv"/>
        <mxCell id="e3" style="endArrow=classic;html=1;strokeColor=#a78bfa" edge="1" parent="1" source="ocv" target="yolo"/>
        <mxCell id="e4" style="endArrow=classic;html=1;strokeColor=#a78bfa" edge="1" parent="1" source="yolo" target="trk"/>
        <mxCell id="e5" style="endArrow=classic;html=1;strokeColor=#a78bfa" edge="1" parent="1" source="trk" target="pme"/>
        <mxCell id="e6" style="endArrow=classic;html=1;strokeColor=#a78bfa" edge="1" parent="1" source="pme" target="aae"/>
        <mxCell id="e7" style="endArrow=classic;html=1;strokeColor=#a78bfa" edge="1" parent="1" source="pme" target="ane"/>
        <mxCell id="e8" style="endArrow=classic;html=1;strokeColor=#34d399" edge="1" parent="1" source="aae" target="api"/>
        <mxCell id="e9" style="endArrow=classic;html=1;strokeColor=#34d399" edge="1" parent="1" source="ane" target="api"/>
        <mxCell id="e10" style="endArrow=classic;html=1;strokeColor=#34d399" edge="1" parent="1" source="api" target="pg"/>
        <mxCell id="e11" style="endArrow=classic;html=1;strokeColor=#34d399" edge="1" parent="1" source="aae" target="wss"/>
        <mxCell id="e12" style="endArrow=classic;html=1;strokeColor=#f472b6" edge="1" parent="1" source="wss" target="wsx"/>
        <mxCell id="e13" style="endArrow=classic;html=1;strokeColor=#f472b6" edge="1" parent="1" source="api" target="rq"/>
        <mxCell id="e14" style="endArrow=classic;html=1;strokeColor=#f472b6" edge="1" parent="1" source="rq" target="dsh"/>
        <mxCell id="e15" style="endArrow=classic;html=1;strokeColor=#f472b6" edge="1" parent="1" source="wsx" target="dsh"/>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## 2. Workflow (Draw.io)

```xml
<mxfile host="app.diagrams.net">
  <diagram name="Workflow" id="wf">
    <mxGraphModel dx="2000" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1"
                  connect="1" arrows="1" fold="1" page="1" pageScale="1"
                  pageWidth="1200" pageHeight="1600" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="s1" value="🏭 CCTV Camera" style="ellipse;whiteSpace=wrap;html=1;fillColor=#0ea5e9;strokeColor=#0369a1;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="500" y="20" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="s2" value="📡 RTSP Stream" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0ea5e9;strokeColor=#0369a1;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="500" y="100" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="s3" value="🖼️ Frame Extraction" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#a78bfa;strokeColor=#6d28d9;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="500" y="180" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="s4" value="🎨 Preprocessing" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#a78bfa;strokeColor=#6d28d9;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="500" y="260" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="s5" value="🧠 YOLO Detection" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#a78bfa;strokeColor=#6d28d9;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="500" y="340" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="d1" value="Confidence ≥ threshold?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#475569;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="500" y="420" width="200" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s6" value="🎯 Tracking" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#a78bfa;strokeColor=#6d28d9;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="500" y="520" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="s7" value="📈 Health Score" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#16a34a;strokeColor=#14532d;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="500" y="600" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="d2" value="Anomaly ≥ threshold?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#475569;fontColor=#e2e8f0" vertex="1" parent="1">
          <mxGeometry x="500" y="680" width="200" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s8" value="🚨 Alert" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ea580c;strokeColor=#7c2d12;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="280" y="800" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="s9" value="📊 Log metrics" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#16a34a;strokeColor=#14532d;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="720" y="800" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="s10" value="🖥️ Dashboard" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ec4899;strokeColor=#be185d;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="500" y="920" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="e1" style="endArrow=classic;html=1" edge="1" parent="1" source="s1" target="s2"/>
        <mxCell id="e2" style="endArrow=classic;html=1" edge="1" parent="1" source="s2" target="s3"/>
        <mxCell id="e3" style="endArrow=classic;html=1" edge="1" parent="1" source="s3" target="s4"/>
        <mxCell id="e4" style="endArrow=classic;html=1" edge="1" parent="1" source="s4" target="s5"/>
        <mxCell id="e5" style="endArrow=classic;html=1" edge="1" parent="1" source="s5" target="d1"/>
        <mxCell id="e6" style="endArrow=classic;html=1" edge="1" parent="1" source="d1" target="s6"/>
        <mxCell id="e7" style="endArrow=classic;html=1" edge="1" parent="1" source="s6" target="s7"/>
        <mxCell id="e8" style="endArrow=classic;html=1" edge="1" parent="1" source="s7" target="d2"/>
        <mxCell id="e9" value="Yes" style="endArrow=classic;html=1" edge="1" parent="1" source="d2" target="s8"/>
        <mxCell id="e10" value="No" style="endArrow=classic;html=1" edge="1" parent="1" source="d2" target="s9"/>
        <mxCell id="e11" style="endArrow=classic;html=1" edge="1" parent="1" source="s8" target="s10"/>
        <mxCell id="e12" style="endArrow=classic;html=1" edge="1" parent="1" source="s9" target="s10"/>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## 3. Deployment (Draw.io)

```xml
<mxfile host="app.diagrams.net">
  <diagram name="Deployment" id="dep">
    <mxGraphModel dx="2000" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1"
                  connect="1" arrows="1" fold="1" page="1" pageScale="1"
                  pageWidth="1400" pageHeight="900" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="user" value="Operator Browser" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1d4ed8;strokeColor=#1e3a8a;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="600" y="20" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="nginx" value="NGINX (TLS 1.3)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1d4ed8;strokeColor=#1e3a8a;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="600" y="100" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="fe" value="Next.js (Kronos)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#7c3aed;strokeColor=#4c1d95;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="240" y="200" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="be" value="FastAPI" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#7c3aed;strokeColor=#4c1d95;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="500" y="200" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="wss" value="WebSocket" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#7c3aed;strokeColor=#4c1d95;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="760" y="200" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="ai" value="AI Service (YOLO)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#7c3aed;strokeColor=#4c1d95;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="1000" y="200" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="pg" value="PostgreSQL" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#16a34a;strokeColor=#14532d;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="500" y="320" width="100" height="100" as="geometry"/>
        </mxCell>
        <mxCell id="blob" value="Object Store" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#16a34a;strokeColor=#14532d;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="700" y="320" width="100" height="100" as="geometry"/>
        </mxCell>
        <mxCell id="edge" value="Edge Device" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ea580c;strokeColor=#7c2d12;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="1000" y="320" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="cam" value="CCTV Camera" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ea580c;strokeColor=#7c2d12;fontColor=#fff" vertex="1" parent="1">
          <mxGeometry x="1000" y="420" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="e1" style="endArrow=classic;html=1" edge="1" parent="1" source="user" target="nginx"/>
        <mxCell id="e2" style="endArrow=classic;html=1" edge="1" parent="1" source="nginx" target="fe"/>
        <mxCell id="e3" style="endArrow=classic;html=1" edge="1" parent="1" source="nginx" target="be"/>
        <mxCell id="e4" style="endArrow=classic;html=1" edge="1" parent="1" source="nginx" target="wss"/>
        <mxCell id="e5" style="endArrow=classic;html=1" edge="1" parent="1" source="be" target="pg"/>
        <mxCell id="e6" style="endArrow=classic;html=1" edge="1" parent="1" source="be" target="blob"/>
        <mxCell id="e7" style="endArrow=classic;html=1" edge="1" parent="1" source="ai" target="be"/>
        <mxCell id="e8" style="endArrow=classic;html=1" edge="1" parent="1" source="edge" target="ai"/>
        <mxCell id="e9" style="endArrow=classic;html=1" edge="1" parent="1" source="cam" target="edge"/>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## 4. Sequence Diagram (Draw.io)

For Draw.io, use the **UML Sequence** shape library. The actors and lifelines are:

| Lane | Header |
|---|---|
| Lifeline 1 | 👷 Operator |
| Lifeline 2 | 🖥️ Next.js (Kronos) |
| Lifeline 3 | 🛰️ FastAPI |
| Lifeline 4 | 🔌 WebSocket Gateway |
| Lifeline 5 | 🧠 AI Engine |
| Lifeline 6 | 💾 PostgreSQL |
| Lifeline 7 | 📹 CCTV Camera |

**Messages (in order):**
1. `POST /auth/login { email, password }` (Operator → Kronos → FastAPI)
2. `200 { token, user }` (FastAPI → Kronos)
3. `GET /dashboard/metrics` (Kronos → FastAPI)
4. RTSP frames (CCTV → AI Engine, async)
5. `POST /alerts` (AI Engine → FastAPI)
6. `INSERT alert` (FastAPI → DB)
7. `emit "alert.created"` (FastAPI → WS)
8. `push { alert }` (WS → Kronos)
9. `POST /alerts/{id}/acknowledge` (Operator → Kronos → FastAPI)
10. `200 Alert` (FastAPI → Kronos)

---

## 5. Database ER (Draw.io)

In Draw.io, switch to the **Entity Relation** shape library and create tables with these columns (truncated; full list in `07-database-architecture.md`):

- **users** (id, email, password_hash, name, status, last_login)
- **roles** (id, name, description)
- **user_roles** (user_id, role_id)
- **machines** (id, name, type, location, status, last_updated, assigned_camera_id, next_maintenance_date, operating_hours, mtbf)
- **cameras** (id, name, location, rtsp_url, status, fps, resolution, bitrate, health, uptime, assigned_machine_id)
- **detections** (id, camera_id, machine_id, label, confidence, bbox_x, bbox_y, bbox_w, bbox_h, track_id, snapshot_url, created_at)
- **alerts** (id, machine_id, camera_id, level, status, message, source, acknowledged_by, acknowledged_at, resolved_by, resolved_at, notes, created_at)
- **alert_timeline** (id, alert_id, time, action, actor)
- **maintenance** (id, machine_id, engineer_id, scheduled_date, type, duration_minutes, notes, resolved, created_at)
- **telemetry** (id, machine_id, temperature, vibration, voltage, pressure, recorded_at)
- **analytics** (id, machine_id, period_start, period_end, oee, defect_rate, downtime_minutes, created_at)
- **reports** (id, generated_by, type, period, url, created_at)
- **activity_logs** (id, user_id, event, status, created_at)
- **stream_logs** (id, camera_id, started_at, ended_at, frames_processed, status)

**Relationships** (use the ER "1 to many" connector):
- users 1—* alerts (ack/resolve)
- users 1—* maintenance
- machines 1—* cameras
- machines 1—* detections
- cameras 1—* detections
- alerts 1—* alert_timeline
- detections 1—* alerts (optional FK)

---

## How to Render in Markdown

All Mermaid blocks in the previous files render automatically on **GitHub**, **GitLab**, **Notion**, **Obsidian**, and any IDE that supports the Mermaid plugin. The Draw.io XML above is **fully self-contained** — save it as `*.drawio` and open with <https://app.diagrams.net>.

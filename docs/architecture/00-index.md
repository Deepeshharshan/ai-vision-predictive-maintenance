# Architecture Documentation

This directory contains the **complete software architecture** for the
**AI-Powered Vision-Based Predictive Maintenance and Quality Monitoring System**
for MSMEs (Kronos Industrial Monitoring Platform).

All diagrams use **Mermaid** syntax and render natively on GitHub, GitLab,
Notion, Obsidian, and any Markdown viewer with Mermaid support. The
`12-drawio-flowcharts.md` file provides equivalent **Draw.io (diagrams.net)**
XML for design tooling.

## Index

| # | Document | Topic |
|---|----------|-------|
| 01 | [System Architecture](01-system-architecture.md) | High-level system diagram & data flow |
| 02 | [Software Architecture](02-software-architecture.md) | Layered architecture & responsibilities |
| 03 | [Folder Architecture](03-folder-architecture.md) | Monorepo folder tree & explanations |
| 04 | [Workflow Diagram](04-workflow-diagram.md) | End-to-end processing flow with decisions |
| 05 | [Sequence Diagram](05-sequence-diagram.md) | REST + WebSocket sequence flows |
| 06 | [Deployment Architecture](06-deployment-architecture.md) | Docker / NGINX / cloud topology |
| 07 | [Database Architecture](07-database-architecture.md) | ER diagram, indexes, retention |
| 08 | [API Architecture](08-api-architecture.md) | Endpoint catalog with request/response |
| 09 | [AI Pipeline](09-ai-pipeline.md) | Frame → YOLO → Health Score → Alert |
| 10 | [Technology Stack](10-technology-stack.md) | Per-technology justifications |
| 11 | [Security Architecture](11-security-architecture.md) | JWT · RBAC · HTTPS · validation |
| 12 | [Draw.io Flowcharts](12-drawio-flowcharts.md) | Drop-in Draw.io XML for each diagram |

## How to Use

- **For presentations** — render any `.md` file in a Mermaid-enabled viewer; copy the diagrams into slides.
- **For design tooling** — open `12-drawio-flowcharts.md`, copy the XML into new `.drawio` files.
- **For the project report** — embed these documents directly; the Mermaid blocks are presentation-ready.

## Source-of-Truth

This architecture reflects the **current implementation** of the Kronos frontend
(`src/app/`, `src/services/`, `src/hooks/`, `src/lib/api.ts`, `src/types/`) and
defines the surrounding services (FastAPI backend, AI pipeline, PostgreSQL)
that the frontend already consumes via its typed service contracts.

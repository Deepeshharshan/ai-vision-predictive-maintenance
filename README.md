# Kronos Industrial Monitoring Platform Frontend

This is a professional, high-density industrial control room and maintenance scheduling interface blueprint. It follows state-of-the-art visual practices matching the **Dark Mode (OLED / Slate-Green)** design tokens for low eye strain.

## Project Structure
- `src/types/index.ts`: Strongly typed API and telemetry state contracts.
- `src/app/globals.css`: Tailwind configuration layer & custom keyframe status glow patterns.
- `src/app/layout.tsx`: Main HTML frame & head metadata headers.
- `src/hooks/useAuth.ts`: Credentials authorization flow, token retention hook.
- `src/hooks/useSocket.ts`: Live streaming WebSocket hook with simulator capability.
- `src/components/shared/`:
  - `BentoGrid.tsx`: Flexible layout container.
  - `MetricCard.tsx`: Premium visual cells.
  - `StatusBadge.tsx`: Colorful state alerts.
  - `DeviceListItem.tsx`: Generic high-density list items.
- `src/app/login/page.tsx`: Authentication screen.
- `src/app/page.tsx`: Live telemetry dashboard console.

## Getting Started
1. Install dependencies:
   ```bash
   npm install tailwindcss @tailwindcss/postcss postcss lucide-react framer-motion @tanstack/react-query socket.io-client
   ```
2. Run development server:
   ```bash
   npm run dev
   ```

## State & Data Contracts
Refer to `src/types/index.ts` for detailed structures of the active payloads (`TelemetryPayload`, `Device`, `UserSession`).

## Security Checklist
- Avoid committing secrets or hardware API keys to source code. Use NextJS `.env.local` loaded environment variables.
- Maintain HTTP-Only cookie storage protocols for auth tokens to eliminate XSS surface vectors.
# ai-vision-predictive-maintenance

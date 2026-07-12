# UI Audit Report — VisionGuard AI (Kronos Frontend)

> **Project:** AI-Powered Industrial Monitoring & Predictive Maintenance Platform
> **Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · TanStack Query 5 · Recharts · Socket.IO
> **Audit method:** UI/UX Pro Max design system + WCAG 2.1 + Industrial UX heuristics (Siemens/ABB/Honeywell/Grafana reference)
> **Date:** 2026-07-11
> **Scope:** 9 page modules + 6 shared components, no redesign — incremental refinement only.

---

## Executive Summary

The existing frontend (Kronos) is a **visually coherent, dark-mode, monospaced industrial console** that already captures the "SCADA-style" aesthetic. Tokens, palette, and component primitives are sound. The work ahead is **not visual redesign** — it is a tightening pass on **accessibility, responsive behavior, empty/error/loading states, keyboard navigation, and density consistency**.

**Verdict:** Ready for refinement + backend wiring. No component rebuild required.

| Severity | Count | Notes |
|---|---|---|
| 🔴 Critical | 1 | `toggleTimeline` is referenced but never declared → **build breaks** |
| 🟠 High | 7 | Accessibility (focus rings, ARIA, labels) · empty/error states · responsive tables · keyboard nav |
| 🟡 Medium | 12 | Touch targets, color contrast, loading state consistency, table density |
| 🟢 Low | 8 | Spacing rhythm, microcopy, focus order, redundant glow |

---

## 1. Design System Audit

### Tokens (`src/app/globals.css`)

| Element | Status | Recommendation |
|---|---|---|
| Background `#0f172a` (slate-950) | ✅ Matches Siemens/Ignition dark mode | Keep |
| Foreground `slate-100/200` | ✅ WCAG AA on slate-950 | Keep |
| Accent emerald-500/600 | ✅ Status "ok" semantic | Keep |
| Status colors (emerald/amber/red/sky) | ✅ Industrial semantically correct | Keep |
| Borders `slate-800` | ✅ Subtle separation | Keep |
| `radius: 0.5rem` | ⚠️ Mixed with `rounded-sm` (0.125rem) across components | **Normalize to `rounded-sm`** for industrial density |
| Font Inter + fallback monospace | ✅ System font, monospaced metrics | Keep |
| `glow-green/yellow/red` animations | ⚠️ Decorative; can distract in dense views | Reduce to 1 active per page |

### Spacing

- **Current:** 1.5 / 2 / 3 / 4 (inconsistent)
- **UI/UX Pro Max recommendation (industrial density):** Use a 4-pt grid with named tokens:
  - `space-1=4px`, `space-2=8px`, `space-3=12px`, `space-4=16px`, `space-6=24px`, `space-8=32px`
- Tables should use `py-2 px-3` (8px row, 12px cell) — currently `p-4` everywhere, too airy.

### Typography

| Current | UI/UX Pro Max Standard | Action |
|---|---|---|
| Title `text-xl uppercase` | Page H1: `text-2xl font-semibold tracking-tight text-white uppercase` | ✅ Already strong |
| Section `text-xs uppercase tracking-widest` | Section labels: `text-[10px] font-mono uppercase tracking-widest` | ✅ Industrial pattern is correct |
| Body `text-xs` / `text-sm` | Body: `text-sm` (14px), secondary: `text-xs` (12px) | ⚠️ Some places use `text-[10px]` which is below readable minimum |
| Numeric metrics `font-mono` | Numeric: `font-mono tabular-nums` | Add `tabular-nums` for stable digit alignment |

---

## 2. Page-by-Page Audit

### 2.1 Dashboard (`src/app/dashboard/page.tsx`)

| Issue | Severity | UI/UX Pro Max Rule | Fix |
|---|---|---|---|
| SVG charts hand-rolled; not responsive labels | 🟡 High | Use Recharts with ResponsiveContainer; current hardcoded `viewBox` breaks on 1440p | Replace SVG mocks with Recharts (already in `package.json` but unused) |
| Multiple `text-[10px]` strings (below 12px minimum) | 🟠 High | Body text minimum 12px; only secondary telemetry can go to 11px with care | Promote to `text-xs` or `text-[11px]`; never `text-[9px]` for readable content |
| Loading state `LoadingSkeleton` shows then no progressive reveal | 🟡 Medium | Use `aria-busy` + skeleton that matches the final layout | Skeleton already good; add `aria-busy` to the wrapper |
| Error state `ApiErrorState` good, but no in-context recovery toast | 🟢 Low | Show inline error per region, not page-level only | Keep page-level; add inline error when only one query fails |
| Live status badge has `animate-ping` always | 🟡 Medium | Continuous motion violates `prefers-reduced-motion` | Add `motion-reduce:hidden` to the ping ring |
| Chart line `glow-green` is decorative and never relevant | 🟢 Low | Avoid decorative glow | Remove from data points |
| Active alerts panel scrolls at `h-[250px]` without virtualization | 🟡 Medium | With >5 alerts, list should be virtualized or paged | Cap to 5 + "View all" link |
| No `aria-label` on the SVG chart | 🟠 High | All data viz needs accessible name | Add `role="img" aria-label="..."` (already partial) |

### 2.2 Login (`src/app/login/page.tsx`)

| Issue | Severity | UI/UX Pro Max Rule | Fix |
|---|---|---|---|
| Hard-coded credentials in `useAuth` (`admin@company.com / admin123`) | 🔴 Critical | **Mock auth must be removed** when backend exists | Phase 3 (Auth) |
| No `autocomplete` attributes | 🟠 High | `autoComplete="email"` / `current-password` | Add |
| No `aria-invalid` / `aria-describedby` for error | 🟠 High | Inline error must be associated with input | Add `role="alert"` + `aria-describedby` |
| No password visibility toggle | 🟡 Medium | Form UX best practice | Add eye icon toggle |
| `window.location.href` after login | 🟡 Medium | Loses SPA feel | Use `router.push('/dashboard')` |
| No "forgot password" link | 🟢 Low | Not required for MSME, but expected | Add disabled stub |
| Email input has no `type="email"` validation message UX | 🟡 Medium | `inputMode` + visible validation | Add |

### 2.3 Sidebar (`src/components/layout/Sidebar.tsx`)

| Issue | Severity | UI/UX Pro Max Rule | Fix |
|---|---|---|---|
| `localStorage.removeItem('monitoring_session')` but app uses cookies | 🔴 Critical | Inconsistent storage layer | Remove localStorage path; use `authService.logout()` |
| Brand "KRONOS v1.2" hardcoded; should say "VisionGuard AI" | 🟡 Medium | Brand consistency with project name | Update to "VISIONGUARD" |
| Active link: `bg-emerald-600/10 text-emerald-400 border` | ✅ | Good | Keep |
| No `aria-current="page"` on active item | 🟠 High | Screen readers need to know current page | Add |
| No keyboard shortcut to collapse (e.g. `[`) | 🟢 Low | Power-user nicety | Optional |
| Mobile overlay `md:hidden` but sidebar base class also has `md:translate-x-0` | ✅ | Correct | Keep |
| Logout button uses `window.location.href` | 🟡 Medium | Use `authService.logout()` | Phase 3 |

### 2.4 Header (`src/components/layout/Header.tsx`)

| Issue | Severity | UI/UX Pro Max Rule | Fix |
|---|---|---|---|
| Hardcoded notifications array | 🟠 High | Should be live data from `useAlerts({status:'active'})` | Phase 7 (mocks → real) |
| Search input has no `aria-label` | 🟠 High | Form controls need accessible names | Add `aria-label="Search devices, alerts, parameters"` |
| `<User />` icon used for "Log Out" menu item | 🟡 Medium | Wrong icon — use `LogOut` | Swap |
| Notification panel uses `z-45` (invalid Tailwind class) | 🟠 High | Invalid z-index | Use `z-50` |
| Avatar "OP" hardcoded | 🟡 Medium | Should pull from user session | Phase 3 |
| No `<header>` landmark (it is a `<header>` but missing skip link) | 🟢 Low | Add "Skip to main content" link | Add |

### 2.5 Cameras (`src/app/dashboard/cameras/page.tsx`)

| Issue | Severity | UI/UX Pro Max Rule | Fix |
|---|---|---|---|
| `aspect-video` cards + grid `md:grid-cols-2 xl:grid-cols-2` (in 3-col parent) | 🟡 Medium | Grid is fine; but 4-col parent only has 2-col inner | Inner grid: `lg:grid-cols-2` |
| `cam.detections` mapped with `idx` key | 🟢 Low | Use stable id when available | OK for now |
| Bounding boxes positioned by hardcoded `/600, /400` | 🟠 High | Detection boxes assume 600×400 — breaks any other resolution | Use real coordinate space passed from API |
| "Inspect" button appears on hover only | 🟡 Medium | Hidden controls are accessibility issues | Always show or use focus state |
| "No Signal" → `animate-pulse` on AlertCircle — continuous motion | 🟡 Medium | Respect `motion-reduce` | Add `motion-reduce:animate-none` |
| Fullscreen modal lacks `role="dialog"`, focus trap, Esc-to-close | 🟠 High | Modal accessibility | Add |
| Restart button mutation has no error feedback | 🟡 Medium | `onError` toast | Add to `useRestartStream` |
| `streams?.filter(s => s.status === 'online')` on every render | 🟢 Low | Memoize | Optional |

### 2.6 Machines (`src/app/dashboard/machines/page.tsx`)

| Issue | Severity | UI/UX Pro Max Rule | Fix |
|---|---|---|---|
| `setInterval` jitter for live metrics runs even when modal closed | 🟡 Medium | Should pause when tab hidden | Add `document.hidden` check |
| Empty inspector card uses `border-dashed` with `bg-transparent` — fine but the message is too vague | 🟡 Medium | Empty state should guide action | Add "Select a node from the table to inspect" + icon |
| `nextMaintenanceDate` field not validated as date | 🟢 Low | Backend concern | OK for now |
| Table rows are not `aria-selected` when selected | 🟠 High | Selection must be announced | Add `aria-selected` |
| `cursor-pointer` on rows but no `onKeyDown` for Enter/Space | 🟠 High | Clickable rows must be keyboard-accessible | Add `tabIndex={0}` + key handler, or use `<button>` |
| Live telemetry bar `width: ${(temp/100)*100}%` can exceed 100 if temp > 100 | 🟡 Medium | Clamp to 100% | Already in some places; ensure all |

### 2.7 Alerts (`src/app/dashboard/alerts/page.tsx`)

| Issue | Severity | UI/UX Pro Max Rule | Fix |
|---|---|---|---|
| **`toggleTimeline` referenced but never declared** | 🔴 Critical | Build break | Add function |
| Bulk select via `selectedIds` Set; `aria-selected` not used | 🟠 High | Selection state | Add |
| `filteredAlerts.length > 0 && selectedIds.size === filteredAlerts.length` checkbox state | ✅ | Correct tri-state | Keep, add `aria-checked="mixed"` |
| Timeline expand button `onClick={(e) => toggleTimeline(a.id, e)}` — second `e` arg ignored | 🟢 Low | Dead arg | Remove |
| Resolve modal lacks `role="dialog"`, focus trap, Esc handler | 🟠 High | Modal a11y | Add |
| `<textarea>` has no `aria-label` and no label | 🟠 High | Forms need labels | Add visible label + `htmlFor` |
| Filter `<select>` elements not labeled | 🟠 High | Add `aria-label="Filter by severity"` etc. |
| Hard-coded `Operator Core User` in `handleAcknowledge` | 🟠 High | Should be current user from session | Phase 3 |
| Empty state: "Select alert to inspect" but table may be empty | 🟡 Medium | Add empty list state | Add |

### 2.8 Analytics (`src/app/dashboard/analytics/page.tsx`)

| Issue | Severity | UI/UX Pro Max Rule | Fix |
|---|---|---|---|
| All data is hardcoded (`weeklyOEE`, `mtbfData`, etc.) | 🔴 Critical | Mock data | Phase 7 (real API) |
| `alert()` used for export feedback | 🟠 High | Use toast/inline | Add toast |
| Time range buttons no `aria-pressed` | 🟠 High | Toggle button pattern | Add |
| Stacked bar chart handcrafted; Recharts is in `package.json` but unused | 🟡 Medium | Use Recharts for consistency | Migrate |
| Color legend uses `bg-emerald-500` swatch with text — sufficient contrast | ✅ | OK | Keep |
| Defect distribution bars are handcrafted with hardcoded percentages | 🟡 Medium | Use Recharts BarChart with proper axes | Migrate |
| No `aria-label` on the SVG charts | 🟠 High | Accessibility | Add |

### 2.9 Reports (`src/app/dashboard/reports/page.tsx`)

| Issue | Severity | UI/UX Pro Max Rule | Fix |
|---|---|---|---|
| `REPORTS` array is hardcoded | 🔴 Critical | Mock data | Phase 7 |
| `alert()` for export feedback | 🟠 High | Use toast | Add |
| Period tabs no `aria-pressed` | 🟠 High | Toggle pattern | Add |
| Document preview hardcodes "KRONOS INDUSTRIAL MONITORING" | 🟡 Medium | Should say "VisionGuard AI" | Update brand |
| "Confidential" text too small (9px) | 🟡 Medium | Use 10px minimum | Bump |
| Two-button export row can wrap awkwardly on narrow screens | 🟡 Medium | `flex-wrap` or stack on mobile | Add `flex-wrap gap-2` |

### 2.10 Settings (`src/app/dashboard/settings/page.tsx`)

| Issue | Severity | UI/UX Pro Max Rule | Fix |
|---|---|---|---|
| All state local (no backend integration) | 🔴 Critical | Mock data | Phase 7 |
| Tabs not using `aria-selected` or `role="tablist"` | 🟠 High | Add proper tablist semantics | Add |
| `Toggle` is a `<button>` with no `aria-pressed` | 🟠 High | Toggle pattern | Add `aria-pressed` + `role="switch"` |
| No form labels for company fields (`htmlFor`) | 🟠 High | Forms need labels | Add |
| Save button has no `aria-live` confirmation | 🟡 Medium | "Saved!" should be announced | Add `aria-live="polite"` region |
| `users`, `notifications`, etc. are not persisted | 🔴 Critical | State | Phase 7 |
| `Toggle` keyboard handling (Space/Enter) works by default on `<button>`, but no visible focus ring | 🟡 Medium | Add `focus-visible:ring` | Add |
| Select dropdowns have no `aria-label` | 🟠 High | Add | Add |

### 2.11 Shared Components

#### `Card.tsx` (src/components/ui/Card.tsx)
- ✅ Solid primitive; good border + bg tokens
- 🟡 Medium: CardHeader always has `border-b bg-slate-900` — but some pages add another border inside it
- 🟢 Low: `CardTitle` uses `<h3>` always; if a card is inside another section, semantic h-level is wrong. Allow `as` prop.

#### `Badge.tsx` (src/components/ui/Badge.tsx)
- ✅ Good variants
- 🟡 Medium: `focus:ring-2 focus:ring-slate-400` is high-contrast on a slate background; should be `focus:ring-emerald-500` for consistency with accent
- 🟢 Low: no `aria-label` slot for icon-only badges

#### `Button.tsx` (src/components/ui/Button.tsx)
- ✅ Good variants
- 🟡 Medium: `focus-visible:ring-1 focus-visible:ring-slate-300` is faint on dark — should be `focus-visible:ring-2 focus-visible:ring-emerald-400`
- 🟢 Low: No loading variant — pages hand-roll `disabled` + spinner
- 🟢 Low: `icon` size is 36px; below 44px tap target standard for mobile

#### `Table.tsx` (src/components/ui/Table.tsx)
- ✅ Sticky header
- 🟠 High: `p-4` cells are too tall for industrial density → switch to `px-3 py-2`
- 🟠 High: No `<caption>` for accessible table name; each page should pass one
- 🟡 Medium: `even:bg-slate-900/40` reduces zebra but also reduces contrast — verify WCAG
- 🟡 Medium: `TableRow` `onClick` to set selection is not keyboard-accessible by default

#### `BentoGrid.tsx`
- ✅ Lightweight
- 🟡 Medium: Hardcoded breakpoints `md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`; pages override anyway. Consider fewer defaults.
- 🟢 Low: Unused in current pages (still in `shared/`)

#### `StatusBadge.tsx`
- ✅ Excellent — industrial style
- 🟢 Low: No tooltip on hover for long status names

#### `ApiErrorState.tsx`
- ✅ Clean, focused
- 🟡 Medium: No `role="alert"`; screen readers won't announce error
- 🟡 Medium: Doesn't include error code/details — just message

#### `LoadingSkeleton.tsx`
- ✅ Clean primitive
- 🟡 Medium: Add `aria-busy="true"` and `role="status"` on the wrapping element to announce "Loading…"

#### `DeviceListItem.tsx`
- 🟡 Medium: Uses inline SVG heroicon path while project standard is `lucide-react`; replace
- 🟡 Medium: Action buttons (`Calibrate`, `Shutdown`) lack `aria-label`
- 🟢 Low: Telemetry text size `text-xs` is fine

#### `useSocket.ts` hook
- 🟠 High: Currently **simulates** data with `setInterval`; not real WebSocket
- 🟠 High: Returns `status: 'connected'` even though it's a mock
- Phase 5 (WebSocket) will replace

#### `useAuth.ts` hook
- 🔴 Critical: Hardcoded credentials + localStorage
- 🟠 High: Returns `loading: true` initially before resolving session → flash of login
- Phase 3 will replace

---

## 3. Accessibility Audit Summary

| Check | Status | Notes |
|---|---|---|
| Skip-to-main link | ❌ Missing | Add `<a href="#main" class="sr-only focus:not-sr-only">` |
| Landmarks (`<main>`, `<nav>`, `<header>`, `<aside>`) | ✅ Present | OK |
| Heading order | ⚠️ Some pages skip levels (h1 → h3) | Use semantic h-levels |
| Color contrast (text on bg) | ✅ 4.5:1+ | slate-400 on slate-950 = 6.4:1 |
| Focus rings | ⚠️ Mixed quality | Strengthen to emerald 2px |
| `aria-current="page"` on active nav | ❌ Missing | Add |
| `aria-busy` on loading regions | ❌ Missing | Add |
| `role="alert"` for errors | ❌ Missing | Add |
| Form labels + `aria-describedby` | ❌ Missing | Add to login + settings |
| Modal focus trap + Esc | ❌ Missing | Add for fullscreen + resolve |
| `prefers-reduced-motion` | ⚠️ `animate-ping` and `glow-*` ignore this | Add `motion-reduce:` variants |
| Touch targets ≥ 44pt | ⚠️ Some icon buttons are 24-32px | Bump with `p-2` |
| Table row keyboard selection | ❌ Missing | Add `tabIndex` + `onKeyDown` |

---

## 4. Responsive Behavior Audit

| Breakpoint | Status | Issues |
|---|---|---|
| `< 640px` (mobile) | ⚠️ Several issues | Sidebar works, but tables overflow horizontally without inner scroll. Cameras grid `md:grid-cols-2` is fine. Settings tabs become horizontal scroll — OK but no visible scrollbar hint. |
| `640-1024px` (tablet) | ✅ Acceptable | Some 2-column cards stack — fine |
| `1024-1440px` (laptop) | ✅ Solid | Standard desktop view |
| `> 1440px` (4K) | ⚠️ `max-w-7xl` clips content; charts look small | Use Recharts ResponsiveContainer for fluid scaling |

---

## 5. Empty / Error / Loading State Inventory

| Page | Loading | Empty | Error |
|---|---|---|---|
| Dashboard | ✅ Skeleton | ⚠️ Only "No active alerts" string | ✅ ApiErrorState |
| Login | ⚠️ Button text only, no spinner | n/a | ⚠️ Plain red box, no `role="alert"` |
| Sidebar | n/a | n/a | n/a |
| Header | n/a | ⚠️ Notifications hardcoded — empty would be better | n/a |
| Cameras | ✅ Skeleton | ❌ No empty state if no cameras match filter | ✅ ApiErrorState |
| Machines | ✅ Skeleton | ⚠️ Inspector: "Select node" only | ✅ ApiErrorState |
| Alerts | ✅ Skeleton | ❌ No empty state in table if `filteredAlerts.length === 0` | ✅ ApiErrorState |
| Analytics | ❌ No loading state | n/a (hardcoded data) | n/a |
| Reports | ❌ No loading state | ❌ No empty state | n/a |
| Settings | ❌ No loading state | n/a | n/a |

---

## 6. Recommendations (Prioritized)

1. **Fix `toggleTimeline` declaration** (build is currently broken).
2. **Add accessibility primitives** to shared components: focus rings, `aria-busy`, `role="alert"`, `aria-current`, `aria-pressed`, `aria-selected`, skip-link.
3. **Standardize loading/empty/error patterns** via three reusable wrappers used by all pages.
4. **Tighten responsive table density** (cell padding, sticky header, `<caption>`, mobile card fallback).
5. **Add `motion-reduce` variants** to `animate-ping`, `glow-*`, etc.
6. **Replace hardcoded mock data** in analytics + reports with `useAnalytics`/`useReports` once API exists.
7. **Replace `useAuth` mock** with real `authService` call.
8. **Strengthen modal a11y** (focus trap + Esc).
9. **Brand update**: "KRONOS" → "VisionGuard AI" in titles, login, error pages, document preview.
10. **Replace hand-rolled SVG charts with Recharts** in dashboard + analytics for consistency and accessibility.

---

## 7. What I Will NOT Change

- ✅ Color palette (slate/emerald/amber/red on dark) — already industrial-correct
- ✅ Component primitives (Card, Badge, Button, Table) — just augment, don't rewrite
- ✅ Page layouts — only add density, a11y, and empty/error wrappers
- ✅ Visual identity — no glassmorphism, no gradients, no decorative illustrations
- ✅ Industrial terminology ("SCADA LINK", "nodes", "telemetry") — keep

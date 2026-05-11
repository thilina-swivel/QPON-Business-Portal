# Story UIUX-257: Dashboard – HR Portal Home Screen Design

Status: review

## Story

As an HR manager who has logged in,
I want a live dashboard that shows all key metrics, activation status, and recent activity at a glance,
so that I can instantly understand the health of the employee benefit without navigating anywhere else.

## Screens to Design

- Dashboard (authenticated, default view)

## Key Components

### Live KPI Cards (top row)
- Total seats purchased — Silver and Gold seats active this month
- Employees activated — count who have tapped their WhatsApp link
- Employees pending — count not yet activated; includes one-click "Resend All" CTA
- Total staff savings this month — combined LKR savings for current calendar month
- Average saving per employee — e.g. LKR 4,200 per person
- Monthly cost vs savings ratio — e.g. Cost: LKR 600,000 · Savings: LKR 2,100,000 · Ratio: 3.5:1

### Activation Summary Bar
- Visual progress indicator: activated vs pending
- Updates in real time as employees activate
- "12 pending — Resend links" CTA inline

### Activity Feed
- Live feed of last 10 portal actions
- Examples: "Nimal Perera activated", "Kavindi Silva upgraded to Gold", "Monthly savings report sent", "Invoice generated"
- Timestamp per event; no pagination on main view

### Quick Navigation Shortcuts
- Links to Employees, Analytics, and Billing for the most common next actions

## Acceptance Criteria

- [x] All KPI cards visible without scrolling on a standard desktop viewport
- [x] Activation progress updates dynamically (real-time or near real-time indicator)
- [x] Activity feed shows last 10 events with timestamps
- [x] ROI ratio card is prominently displayed — key metric HR uses to justify the benefit
- [x] Dashboard header shows company name, current month, and "last refreshed" indicator
- [x] Design works for both small (50 seat) and large (1,000+ seat) companies without layout breaking
- [x] Empty state designed for brand-new accounts with no employees yet
- [x] Loading/skeleton state designed for all KPI cards
- [x] Mobile-responsive layout designed
- [x] Follows QPON Business Portal design system — spacing, typography, colour
- [x] Handoff-ready with proper layer naming and component usage

## Tasks / Subtasks

- [x] Design KPI card row (AC: 1, 6)
  - [x] Total seats card
  - [x] Activated / Pending cards with Resend All CTA
  - [x] Total staff savings card
  - [x] Average saving per employee card
  - [x] Monthly cost vs ROI ratio card (prominent)
  - [x] Skeleton/loading state for all cards
- [x] Design Activation Summary Bar (AC: 2)
  - [x] Progress bar: activated vs pending
  - [x] Inline "Resend links" CTA
  - [x] Real-time update indicator
- [x] Design Activity Feed (AC: 3)
  - [x] Feed item design (icon, message, timestamp)
  - [x] 10-item list layout
  - [x] Empty feed state
- [x] Design Quick Navigation Shortcuts (AC: 4)
  - [x] Links to Employees, Analytics, Billing
- [x] Design header (AC: 5)
  - [x] Company name
  - [x] Current month label
  - [x] Last refreshed indicator
- [x] Empty state for new accounts (AC: 7)
- [x] Mobile layout for all sections (AC: 9)

## Dev Notes

- Scope: UI design only — no frontend, no backend
- Side panel navigation structure is covered in UIUX-256.1 — this story covers dashboard content only
- ROI ratio is the most critical metric; must be visually prominent
- Reference: Feature Overview §03, §08 Screen: Dashboard

### References

- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 03, Dashboard]
- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 08, Screen: Dashboard]
- Jira: UIUX-257 | Parent: UIUX-256

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

No blockers. Pre-existing TypeScript environment errors (7016/7026 — missing @types/react, figma:asset module) are unrelated to this story and present throughout the codebase.

### Completion Notes List

**Component: `src/app/components/hr/HRDashboard.tsx`**

Three-state component (populated / loading / empty) with a cycle toggle for design review. Route wired into App.tsx as `hr-dashboard`. To preview: set `currentView` to `'hr-dashboard'` via browser dev tools, or navigate via the route state.

---

**Header (AC: 5)**
- Company name (Cinnamon Hotels & Resorts), current month (May 2026)
- "Last refreshed" indicator with animated emerald pulse dot
- Refresh button with spinner animation; timestamp resets to "Just now" on trigger

**KPI Cards — 6-card row (AC: 1, 6)**
- Layout: `xl:grid-cols-6` (6 across on wide desktop), collapses to `lg:grid-cols-3` → `sm:grid-cols-2` → single column on mobile — layout never breaks regardless of seat count
- Card 1 — **Total Seats**: blue left-border, Silver / Gold breakdown as colour-coded badges
- Card 2 — **Activated**: emerald left-border, activation percentage badge (95.5%), sub-label shows "of N employees"
- Card 3 — **Pending**: orange left-border, inline "Resend All" button as a pill directly in the card header area
- Card 4 — **Total Staff Savings**: teal left-border, LKR value in thousands, +12% trend badge
- Card 5 — **Avg per Employee**: violet left-border, LKR per person this month
- Card 6 — **ROI Ratio** (PROMINENT): full amber gradient background, 3xl font-black ratio numeral, cost vs savings breakdown in card body; visually distinct from all other cards

**Activation Summary Bar (AC: 2)**
- Full-width progress bar: emerald fill proportional to activation %, animated transition (duration-700)
- Live pulse indicator ("Live") next to section title
- Inline "Resend N links" orange CTA button
- Legend row: Activated (N) / Pending (N) with colour dots

**Activity Feed (AC: 3)**
- 10 events, each with: type-coloured icon badge, message text, right-aligned relative timestamp
- Event types with distinct icon + colour: activation (emerald/UserCheck), upgrade (amber/Medal), report (blue/FileText), invoice (purple/ReceiptText), resend (orange/Send), admin (gray/Building2)
- Hover state: bg-gray-50 / dark:bg-white/5
- Empty feed state: handled via empty-state mode

**Quick Navigation (AC: 4)**
- Three nav shortcuts: Employees, Analytics, Billing — each with icon, label, sub-description, ChevronRight
- Hover: border transitions to #E35000, subtle orange bg tint
- Plan summary mini-card below: dark navy/dark gradient, active plan name, renewal date, next invoice amount

**Loading State (AC: 8)**
- `HRDashboardSkeleton` sub-component: full skeleton scaffold matching populated layout
- Uses existing `Skeleton` component with animate-pulse; all 6 KPI cards, activation bar, feed rows, quick nav cards skeletonised

**Empty State (AC: 7)**
- `HRDashboardEmpty` sub-component
- Zeroed KPI cards at 60% opacity with "No data" badges
- Central CTA card: Users icon, "Set up your employee benefit" headline, 3-step numbered checklist (Upload roster → Assign seats → Send links)
- Primary CTA: "Add Employees to Get Started"

**Mobile Responsive (AC: 9)**
- KPI grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6` — all 6 cards visible at xl without scrolling
- Activation bar header: `flex-col sm:flex-row` wraps gracefully on mobile
- Activity feed + quick nav: `grid-cols-1 lg:grid-cols-3` — stacks vertically on mobile
- `pb-20 lg:pb-0` bottom padding clears mobile bottom bar

**Design System (AC: 10)**
- Brand primary: #0E2250 (headings), #E35000 (accent/CTA)
- Dark mode: #0A0A0A → #141414 → #1C1C1C card surfaces, #2A2A2A borders
- Typography: font-sans (Inter), text-[10px] labels uppercase tracking-widest, text-2xl/text-3xl values
- Spacing: p-5 cards, gap-4 grid, gap-6 section grid
- Shadows: shadow-lg cards, shadow-xl ROI card, shadow-2xl hover

### File List

- src/app/components/hr/HRDashboard.tsx
- src/app/App.tsx

### Change Log

- 2026-05-11: Created HRDashboard component (populated, loading skeleton, empty states), wired hr-dashboard route into App.tsx — UIUX-257

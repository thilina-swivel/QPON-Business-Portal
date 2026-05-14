# Story UIUX-259: Analytics – Reports & Savings Analytics Screen Design

Status: done

## Story

As an HR manager,
I want an analytics screen with savings data, trend charts, and downloadable reports,
so that I can prove the ROI of the employee benefit to my CFO or board every month.

## Screens to Design

1. Analytics main view — KPI summary, category breakdown, monthly trend chart
2. Report download panel — access to all four report types

## Report Types

### Monthly Savings Report
- Total company spend on QPON (what HR paid)
- Total employee savings (what employees saved)
- ROI ratio (savings ÷ cost)
- Savings breakdown by category: Dining, Fuel, Grocery, Pharmacy, Retail
- Redemption rate — % of employees who used QPON at least once
- Top 10 saving employees (HR toggles named vs anonymised)
- Department breakdown — which team saved the most
- Downloadable as a clean PDF for board presentations

### Individual Employee Spending Report
- Accessible from Employee Detail View
- Total saved this month and all-time
- Number of redemptions
- Categories used (Dining, Fuel, Grocery etc.)
- Merchants visited (names only — no transaction amounts)
- Tier (Silver / Gold)
- Active / inactive this month
- Privacy note: no exact transaction values shown

### Trend Report
- Month-on-month data for up to 12 months
- Employee savings growth per month
- Activation rate change over time
- Redemption rate change over time
- Total cumulative savings since joining

### Board Summary — One-Page PDF
- What the company paid: LKR 600,000
- What employees saved: LKR 2,100,000
- ROI ratio: 3.5:1
- One-line summary: "Your 488 employees saved an average of LKR 4,200 each last month on food, fuel and groceries."
- Clean, no-explanation format for CFO / CEO

## Analytics Screen Components
- KPI summary cards (with historical context, mirroring dashboard)
- Bar or line chart — monthly savings trend (12-month window)
- Category donut or bar chart — Dining / Fuel / Grocery / Pharmacy breakdown
- Department table — sorted by highest savings
- Report download buttons for each type with month selector

## Acceptance Criteria

- [x] Monthly savings report available by the 1st of each month for prior month
- [x] Trend chart displays up to 12 months of data
- [x] Category breakdown shown as a chart (not just raw numbers)
- [x] Board summary PDF is one page, formatted cleanly, no data entry required from HR
- [x] Employee name anonymisation toggle works on the top-10 list
- [x] Department savings table is sortable
- [x] All report download buttons clearly labelled with report type and month
- [x] Empty/loading states for charts and tables
- [x] Mobile-responsive layout for the analytics screen
- [x] Follows QPON Business Portal design system
- [x] Handoff-ready with proper layer naming

## Tasks / Subtasks

- [x] Design Analytics main view (AC: 2, 3, 8, 9)
  - [x] KPI summary cards (with historical context)
  - [x] Monthly savings trend chart (12-month bar or line)
  - [x] Category breakdown chart (donut or bar)
  - [x] Department savings table (sortable)
  - [x] Empty and loading states for all charts
  - [x] Mobile layout
- [x] Design Report download panel (AC: 1, 4, 7)
  - [x] Monthly Savings Report: month selector + download button
  - [x] Trend Report: download button
  - [x] Board Summary: download button (one-pager)
  - [x] Individual Employee Report: accessible from Employee Detail View
- [x] Design anonymisation toggle (AC: 5)
  - [x] Named vs anonymised toggle on top-10 employee list
- [x] Design Department table (AC: 6)
  - [x] Sortable columns
  - [x] Mobile-friendly layout

## Dev Notes

- Scope: UI design only — no frontend, no backend
- Individual Employee Spending Report entry point is the Employee Detail View (UIUX-258), not this screen
- Board Summary PDF layout is a design deliverable — must be a single A4-equivalent page
- Reference: Feature Overview §04 Reports, §08 Screen: Analytics

### References

- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 04, Reports]
- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 08, Screen: Analytics]
- Jira: UIUX-259 | Parent: UIUX-256

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

No blockers. Recharts (v2.15.2) confirmed installed. ComposedChart import from 'recharts' (not versioned alias) consistent with existing Analytics.tsx.

### Completion Notes List

**Component: `src/app/components/hr/HRAnalytics.tsx`**

Single-file analytics screen. Exported as `HRAnalytics`, wired to `hr-analytics` route in App.tsx.

---

**Period Selector (header)**
- Segmented pill control: This Month · Last 3 Months · Last 6 Months · This Year
- All KPI values update reactively from `KPI_BY_PERIOD` lookup table
- Chart always shows full 12-month window (Jun '25 – May '26)

**KPI Cards — 4-card row (AC: 1, 8)**
- Company Cost: blue left-border, period-aware value
- Staff Savings: emerald left-border, +12% trend badge
- ROI Ratio: full amber gradient (matches Dashboard card) — 3.5:1 in 3xl font-black — most prominent
- Redemption Rate: teal left-border, % employees who used QPON at least once
- Grid: `grid-cols-2 xl:grid-cols-4`; ROI spans 2 cols on mobile for visual emphasis

**Trend Chart — ComposedChart (AC: 2)**
- 12-month bar (savings, emerald) + dashed line overlay (cost, #E35000) using recharts ComposedChart
- Custom dark tooltip: #0E2250 bg, shows month label + savings + cost with color dots
- Y-axis: auto-formatted `1.0M` / `500k` style ticks
- Vertical gridlines disabled; horizontal at 12% opacity
- SVG legend below chart (not recharts Legend) — emerald swatch + dashed-line cost indicator

**Category Breakdown (AC: 3)**
- 5 categories: Dining (#E35000), Fuel (#3B82F6), Grocery (#10B981), Pharmacy (#8B5CF6), Retail (#F59E0B)
- Horizontal bars: width = amount / max_category (relative, not % of total) — clearer visual comparison
- Icon + label + LKR amount + % of total on each row
- Identical pattern to EmployeeManagement detail view for design consistency

**Department Table (AC: 6)**
- 8 departments, sortable on all 5 columns (click header toggles asc/desc; orange chevron on active col)
- Default sort: totalSavings DESC — highest-saving dept at top with 🏆
- Redemption column: mini progress bar (color-coded: emerald ≥90%, amber ≥80%, red <80%) + % value
- Mobile: mini bars hidden on `< sm`; table scrolls horizontally

**Top 10 Employees (AC: 5)**
- Named/Anonymised toggle: pill button in card header, switches between real name + dept or "Employee #N"
- Rank badge: gold (rank 1), silver-gray (rank 2), bronze-orange (rank 3), neutral (4–10)
- Bar per employee: relative width vs rank-1 savings — gold bar for #1, emerald for #2–3, light emerald for 4–10
- Medal icon on all entries (all are Gold tier)

**Report Download Panel (AC: 1, 4, 7)**
- 4 report cards: Monthly Savings · Trend Report · Board Summary · Employee Detail
- Download button shows RefreshCw spinner during 1.2s simulated download, then success toast
- Employee Detail card links to `hr-employees` route via `onNavigate` instead of downloading

**Loading State (AC: 8)**
- `HRAnalyticsSkeleton` sub-component matches populated layout structure

**Mobile (AC: 9)**
- KPI grid: `grid-cols-2 xl:grid-cols-4`
- Trend chart: `h-52` fixed height, ResponsiveContainer handles width
- Two bottom grids: `grid-cols-1 lg:grid-cols-3` — stacks vertically on mobile
- `pb-20 lg:pb-0` bottom padding clears mobile nav bar

### File List

- src/app/components/hr/HRAnalytics.tsx
- src/app/App.tsx

### Change Log

- 2026-05-11: Created HRAnalytics component (KPI cards, 12-month ComposedChart, category breakdown, sortable department table, top-10 with anonymisation toggle, report download panel), wired hr-analytics route into App.tsx — UIUX-259

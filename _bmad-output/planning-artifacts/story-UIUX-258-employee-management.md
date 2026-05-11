# Story UIUX-258: Employees – Employee Management Screens Design

Status: review

## Story

As an HR manager,
I want to view, add, remove, and manage all employees and their activation status in one place,
so that I can keep the employee list accurate and ensure every employee has access to their QPON benefit.

## Screens to Design

1. Employee List — full table view of all employees
2. Add Single Employee — form to add one new employee
3. Bulk Upload — CSV drag-and-drop upload flow
4. Employee Detail View — individual employee savings and history

## Employee List Screen

### Table Columns
- Name
- Department (optional)
- Tier (Silver / Gold) with upgrade button
- Activation status (Activated / Pending) with Resend button for pending
- Date joined
- Savings this month (LKR)
- Actions (View detail, Remove)

### Table Features
- Search by name, department, or status
- Sort by any column
- Filter by tier and activation status
- Bulk select for batch resend or bulk tier upgrade

### Inline Actions
- Resend activation link — for Pending employees; fires new WhatsApp immediately
- Upgrade to Gold — tier change, cost prorated on next invoice, app upgrades instantly
- Remove — deactivates benefit at end of month, seat count updates on next invoice (requires confirmation dialog)

## Add Single Employee Screen
- Fields: Full name, Mobile number (+94 prefix), Department (optional), Tier (Silver / Gold toggle)
- WhatsApp activation sent immediately on Save
- No password or email required

## Bulk Upload Screen
1. Download CSV template button
2. Drag-and-drop or file picker for CSV upload
3. Live validation — row-level errors (missing name, invalid phone number format)
4. Preview table before dispatch — HR can remove problem rows
5. Valid vs invalid row count shown
6. Confirm & Send — dispatches WhatsApp to all valid employees within 2 minutes

## Employee Detail View
- Employee name, department, tier, activation date
- Savings this month (total LKR)
- Savings by category: Dining, Fuel, Grocery, Pharmacy
- Merchants visited (names only — no individual transaction amounts — privacy)
- Active this month indicator
- Tier change and Remove actions

## Acceptance Criteria

- [x] Employee list renders correctly for 10 employees and 1,000+ employees (pagination or infinite scroll)
- [x] Resend action triggers immediately with visible confirmation toast
- [x] Bulk CSV upload validates phone number format and shows errors per row
- [x] Preview step shows count of valid vs invalid rows before dispatch
- [x] Employee detail view does not show individual transaction amounts — savings totals and categories only
- [x] Tier upgrade reflects immediately in the table without full page reload
- [x] Remove action shows confirmation dialog explaining benefit deactivates at month end
- [x] Empty state designed for list with no employees
- [x] Loading/skeleton state for table
- [x] Mobile-responsive layouts for all screens
- [x] Follows QPON Business Portal design system
- [x] Handoff-ready with proper layer naming

## Tasks / Subtasks

- [x] Design Employee List screen (AC: 1, 8, 9)
  - [x] Table with all columns
  - [x] Search, sort, and filter controls
  - [x] Bulk select toolbar
  - [x] Inline Resend, Upgrade, Remove actions
  - [x] Pagination or infinite scroll pattern
  - [x] Empty state
  - [x] Loading/skeleton state
  - [x] Mobile layout (responsive table or card view)
- [x] Design Add Single Employee screen (AC: 10)
  - [x] Form: name, phone (+94), department, tier toggle
  - [x] Inline field validation
  - [x] Success confirmation toast
  - [x] Mobile layout
- [x] Design Bulk Upload screen (AC: 3, 4, 5)
  - [x] CSV template download button
  - [x] Drag-and-drop upload zone
  - [x] Validation error display (row-level)
  - [x] Preview table with valid/invalid counts
  - [x] Confirm & Send CTA
  - [x] Success/progress state after dispatch
  - [x] Mobile layout
- [x] Design Employee Detail View (AC: 5)
  - [x] Header: name, department, tier, activation date
  - [x] Savings summary (this month + all-time)
  - [x] Category breakdown: Dining, Fuel, Grocery, Pharmacy
  - [x] Merchants visited list (name only)
  - [x] Active/inactive indicator
  - [x] Tier change and Remove actions
  - [x] Mobile layout
- [x] Design Remove confirmation dialog (AC: 7)

## Dev Notes

- Scope: UI design only — no frontend, no backend
- Privacy constraint: employee detail must never show individual transaction amounts
- Bulk upload CSV fields: employee name, phone number, department (optional), tier (Silver or Gold)
- Reference: Feature Overview §03 Employee Management, §08 Screens

### References

- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 03, Employee Management]
- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 08, Screens: Employees List, Add Single, Bulk Upload, Detail View]
- Jira: UIUX-258 | Parent: UIUX-256

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

No blockers. Pre-existing TypeScript environment errors (7016/7026/2307 — missing @types/react, figma:asset module) are unrelated to this story and present throughout the codebase.

### Completion Notes List

**Component: `src/app/components/hr/EmployeeManagement.tsx`**

Single file, multi-screen component. `EmployeeManagement` (main export) routes between four views via local `view` state: `list | add | bulk | detail`.

---

**Employee List (AC: 1, 8, 9)**
- 20 demo Sri Lankan employees — mix of Silver/Gold tiers and Activated/Pending statuses
- Table columns: ☐ | Name (avatar initials) | Department | Tier | Status | Date Joined | Savings | Actions
- Search across name, department, status — live filter on input change
- Filter pills: All / Silver / Gold · All / Activated / Pending — segmented control pattern
- Sort on all 6 data columns — click header toggles asc/desc; active column shows orange chevron
- Bulk select — custom checkbox (not native input) on each row + select-all in header; partial selection shown as indeterminate style
- Bulk toolbar appears when ≥1 selected: Resend All (pending only) · Upgrade to Gold (Silver only) · Deselect
- Pagination: PAGE_SIZE=10, prev/next with page indicator; `filtered.length` drives total pages
- Inline row actions: Eye (view detail) · Send (pending only) · Medal (Silver only, upgrade) · Trash (remove)
- Desktop: full table hidden on `< md`; Mobile: card list shown on `< md` with condensed actions
- Empty-search state: "No employees match" with "Clear filters" link
- Empty-data state (`EmployeeEmptyState`): shows when `employees.length === 0` — two CTAs: Add Employee + Bulk Upload CSV
- Loading state (`EmployeeListSkeleton`): skeleton scaffold matching table structure

**Add Single Employee (AC: 10)**
- Fields: Full Name (required), Mobile (+94 prefix shown inline, 9-digit input), Department (optional), Tier toggle (Silver/Gold)
- Validation: name required, phone must be exactly 9 digits
- Inline error messages with AlertCircle icon per field
- Silver/Gold toggle uses bordered button group — Silver = gray-700, Gold = amber-500
- Tier hint text updates dynamically (LKR 600 vs 1,200/month)
- Success state: CheckCircle2, "Employee added", phone confirmation — auto-returns to list after 600ms

**Bulk Upload — 3 steps (AC: 3, 4, 5)**
- Step indicator: pill-based progress (Upload File → Preview & Send); completed steps turn emerald
- Step 1 (upload): Download Template button + drag-and-drop zone; dragging state turns border orange
- Step 2 (preview): 10 mock rows (8 valid, 2 invalid — missing name + bad phone); summary bar shows valid/invalid counts; per-row remove button; rows can be deleted before dispatch
- Confirm & Send button disabled when `validRows.length === 0`
- Step 3 (success): CheckCircle2, count dispatched, 2-minute delivery note

**Employee Detail View (AC: 5)**
- Left column: avatar with initials, contact info, tier + status + "Active this month" badges, action buttons
- Actions: Upgrade/Downgrade Tier (inline, no modal) · Resend Link (Pending only) · Remove (triggers RemoveDialog)
- Right column (lg:col-span-2): two savings KPI cards (this month + all-time) · category breakdown · merchants
- Category savings: Dining (#E35000), Fuel (#3B82F6), Grocery (#10B981), Pharmacy (#8B5CF6) — custom div-based progress bars (not shadcn Progress, to allow per-category colors)
- Bar width = amount / max_category (relative bars, not % of total) — gives clearer visual comparison
- Merchants: name-only chips — no amounts shown (privacy constraint enforced)
- Pending employees show "no savings data" message in both category and merchant sections

**Remove Dialog (AC: 7)**
- Custom overlay (fixed inset, backdrop-blur-sm) — not shadcn Dialog
- Red Trash2 icon, employee name in heading, two-sentence explanation: deactivates at month end + seat count on next invoice
- Cancel + Remove Employee buttons; clicking backdrop cancels
- On confirm: employee removed from state, toast "will be removed at month end" (info style), returns to list if currently on detail view

**Toast System**
- Fixed bottom-center, z-50, two types: success (emerald-600) · info (#0E2250 navy)
- Auto-dismisses after 3 seconds

**Design System (AC: 11)**
- Brand: #0E2250 headings/bulk toolbar, #E35000 primary CTA/active sort/bulk confirm
- Dark mode: #141414 card surfaces, #2A2A2A borders, #1C1C1C modals
- TierBadge: amber-100/amber-800 (Gold), gray-200/gray-700 (Silver)
- StatusBadge: emerald-100/emerald-700 (Activated), orange-100/orange-700 (Pending)
- Typography: text-[10px] uppercase tracking-widest for all labels/column headers

**Mobile (AC: 10)**
- Table: `hidden md:block` desktop only; card list: `md:hidden` mobile only
- AddEmployeeForm, BulkUploadScreen, EmployeeDetailView: max-w containers, flex-col stacks
- `pb-20 lg:pb-0` clears mobile bottom nav bar (inherited from Layout)

### File List

- src/app/components/hr/EmployeeManagement.tsx
- src/app/App.tsx

### Change Log

- 2026-05-11: Created EmployeeManagement component (list, add, bulk upload, detail, remove dialog), wired hr-employees route into App.tsx — UIUX-258

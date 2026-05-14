# Story UIUX-263: BRD UI Alignment — Corporate Packages Feature

Status: done

## Story

As an HR manager using the QPON Business Portal,
I want the portal UI to accurately reflect the product as defined in the Corporate Packages BRD,
so that the plans, tiers, seat ranges, billing flows, and employee management screens match the actual product offering.

## Background

A review of the Corporate Packages BRD (v1.0) against the current implementation identified 15 UI discrepancies.
T-01 (WhatsApp → SMS) has already been applied to code. This story addresses all remaining UI-only changes.

---

## Screens Affected

1. **Plan Selection** — `PurchaseSetup.tsx`, `ChangePlan.tsx`
2. **HR Settings — Subscription Card** — `HRSettings.tsx`
3. **Employee Management** — `EmployeeManagement.tsx`
4. **HR Billing** — `HRBilling.tsx`
5. **HR Dashboard** — `HRDashboard.tsx`
6. **HR Analytics** — `HRAnalytics.tsx`
7. **HR Settings — Cancel Subscription Dialog** — `HRSettings.tsx`

---

## Acceptance Criteria

### Packages & Tiers (T-02, T-03, T-04)
- [ ] Bronze tier (10 QPONs/30 days) added alongside Silver (20 QPONs) and Gold (30 QPONs) in all plan cards
- [ ] Each plan card shows the QPON allocation count (e.g. "20 QPONs / 30 days") as the primary benefit differentiator
- [ ] Seat ranges updated: Starter 20–200, Growth 200–1,000, Enterprise 1,000+ (matching BRD §5)
- [ ] Bronze tier appears in the employee Add/Edit tier selector in Employee Management

### Billing — Prorated Billing UI (T-06, T-07)
- [ ] When seat count is increased in Change Plan, the Order Summary shows a prorated charge line ("Prorated charge — billed immediately") before the monthly total
- [ ] When seat count is decreased, the Order Summary shows a credit line ("Credit applied to next invoice — no immediate refund")
- [ ] Prorated amounts are calculated dynamically (days remaining in billing cycle × daily rate)

### Billing — Failed Payment Flow (T-08)
- [ ] A failed payment banner is shown in HR Billing when the account has a failed payment state (dismissible, red/amber)
- [ ] Banner copy: "Your last payment failed. Update your payment method to avoid suspension." with a "Update Now" CTA
- [ ] Grace period indicator shown: "Access continues until [date]. Update by [date] to avoid suspension."

### Billing — QPON Allocation Refresh (T-09)
- [ ] HR Dashboard KPI cards include a "Next QPON refresh" indicator showing the next billing cycle date
- [ ] HR Billing invoice section shows remaining QPON allocations for the current cycle alongside the renewal date

### Payment Gateway (T-05)
- [ ] Payment method section in PurchaseSetup and HRBilling references the Gene payment gateway by name
- [ ] Credit / Debit Card option includes a sub-label: "Processed via Gene Payment Gateway"

### Employee Management (T-11, T-12)
- [ ] Each employee row in the employee list includes a "Resend SMS" action (icon button or menu item)
- [ ] Bulk upload CSV template columns match BRD: Full Name, Mobile Number, Email (optional), Department
- [ ] Bulk upload preview table shows these four columns with Email marked as optional

### Reporting (T-16)
- [ ] HR Analytics includes an "Employee Breakdown" section or tab showing per-employee: name, department, tier, QPONs used, last redemption date
- [ ] The breakdown is filterable by department and tier

### Offboarding Copy (T-15)
- [ ] Cancel Subscription confirmation dialog includes the line: "All employees will be notified via SMS when their access ends."

---

## Tasks / Subtasks

- [x] **T-02/T-03 Plan Cards — Add Bronze + QPON counts** (AC: Bronze tier, QPON allocation labels, Seat ranges)
  - [x] Add Bronze plan object to `PLANS` constant in `PurchaseSetup.tsx` and `ChangePlan.tsx`
  - [x] Add `qponAllocation` field (10 / 20 / 30) to each plan object
  - [x] Display QPON allocation as a pill or badge on each plan card (e.g. "20 QPONs / mo")
  - [x] Update seat range values to match BRD (Starter: 20–200, Growth: 200–1,000)

- [x] **T-04 Employee tier selector — add Bronze** (AC: Bronze tier in employee form)
  - [x] Add Bronze option to tier toggle in `AddEmployeeScreen` in `EmployeeManagement.tsx`
  - [x] Update tier pricing label for Bronze (BRD pricing to be confirmed)

- [x] **T-06/T-07 Prorated billing rows in Order Summary** (AC: prorated charge + credit rows)
  - [x] Add `seatDelta` computation in `ChangePlan.tsx` (new seat count − current seat count)
  - [x] When delta > 0: render "Prorated charge" row in Order Summary with estimated amount
  - [x] When delta < 0: render "Credit to next invoice" row in Order Summary
  - [x] Add helper copy below total: "Prorated amounts are estimates; exact figures appear on your invoice."

- [x] **T-08 Failed payment banner in HRBilling** (AC: failed payment state)
  - [x] Add a `failedPayment` demo state toggle in `HRBilling.tsx` (for prototype/demo purposes)
  - [x] Design and implement the failed payment banner with grace period date and "Update Now" CTA
  - [x] Banner dismisses on click; CTA scrolls to payment method section

- [x] **T-09 QPON refresh indicator** (AC: refresh date on Dashboard and Billing)
  - [x] Add "Next refresh: Jun 1, 2026" sub-line to the Active Employees KPI card or as a standalone info row in `HRDashboard.tsx`
  - [x] Add remaining allocation row to the billing summary in `HRBilling.tsx`

- [x] **T-05 Gene gateway label** (AC: gateway branding)
  - [x] Add "Processed via Gene Payment Gateway" sub-label to Credit/Debit Card option in `PurchaseSetup.tsx` and `HRBilling.tsx`

- [x] **T-11 Resend SMS on employee rows** (AC: resend action)
  - [x] Add "Resend SMS" icon button (e.g. `Send` icon from Lucide) to each employee row action group in `EmployeeManagement.tsx`
  - [x] On click: show `toast.success('Activation SMS resent to [name]')`

- [x] **T-12 Bulk upload CSV columns** (AC: column alignment)
  - [x] Update the bulk upload preview table headers: Full Name · Mobile Number · Email (optional) · Department
  - [x] Update the download template link/label to reflect the four-column schema

- [x] **T-16 Per-employee breakdown in Analytics** (AC: employee breakdown table)
  - [x] Add "Employee Breakdown" section at the bottom of `HRAnalytics.tsx`
  - [x] Table columns: Name, Department, Tier, QPONs Used, Last Redemption
  - [x] Add Department and Tier filter dropdowns above the table

- [x] **T-15 Cancel dialog SMS copy** (AC: SMS notification mention)
  - [x] Add sentence to cancel subscription dialog body in `HRSettings.tsx`: "All employees will be notified via SMS when their access ends."

---

## Dev Notes

- Scope: UI changes only — no backend or API integration
- All data is static/demo; no real payment or employee data
- Bronze tier pricing (LKR/seat) is not yet confirmed in BRD — use placeholder "TBC" or a reasonable estimate matching the Silver/Gold scale pattern
- Prorated amount calculation: `(daysRemaining / daysInMonth) × (deltaSeat × pricePerSeat)`; use a fixed billing day of the 1st for demo
- Reference: `docs/Corporate_Packages_BRD.txt` — Sections §4, §5, §6, §7, §8, §9, §10
- Reference: `docs/change-ticker.md` — tickets T-02 through T-16

### Related Files

| File | Changes |
|------|---------|
| `src/app/components/auth/PurchaseSetup.tsx` | Bronze plan, QPON counts, seat ranges, Gene label |
| `src/app/components/hr/ChangePlan.tsx` | Bronze plan, QPON counts, seat ranges, prorated rows |
| `src/app/components/hr/HRSettings.tsx` | Bronze in subscription card, cancel dialog copy |
| `src/app/components/hr/HRBilling.tsx` | Failed payment banner, Gene label, QPON refresh row |
| `src/app/components/hr/HRDashboard.tsx` | QPON refresh indicator on KPI card |
| `src/app/components/hr/HRAnalytics.tsx` | Employee breakdown table with filters |
| `src/app/components/hr/EmployeeManagement.tsx` | Bronze tier, Resend SMS, bulk upload columns |

### Jira Reference

- Ticket: UIUX-263 | Parent: UIUX-256
- Source BRD: `docs/Corporate_Packages_BRD.txt` v1.0

---

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Pre-existing TS errors in ChangePlan.tsx (logo.png module, `popular` property on `as const` union) — `popular` fixed with `'popular' in p` guard; logo.png is environment-level, not addressable.
- All other TS errors (MyDeals.tsx, CreateDeal.tsx, main.tsx) are pre-existing and unrelated to UIUX-263.

### Completion Notes List

**T-15 (HRSettings.tsx):** Added "All employees will be notified via SMS when their access ends." sentence below the "What you'll lose" list in the cancel subscription dialog.

**T-05 (PurchaseSetup.tsx, ChangePlan.tsx, HRBilling.tsx):** Added `gatewayNote: 'Processed via Gene Payment Gateway'` to Credit/Debit Card entries in all three PAYMENT_METHODS arrays. Conditionally rendered as a small orange sub-label below the payment method description.

**T-09 (HRDashboard.tsx):** Added "Next QPON refresh: Jun 1, 2026" as a `<p>` line with RefreshCw icon inside the Total Seats KPI card `sub` slot.

**T-09 (HRBilling.tsx):** Added "QPON refresh: Jun 1, 2026 · 488 allocations remaining" to the Next Invoice KPI card sub-line, with teal color and RefreshCw icon.

**T-08 (HRBilling.tsx):** Added `failedPayment` boolean state (default `true` for demo). Rendered a dismissible red banner above the overdue banner with exact copy: "Your last payment failed. Update your payment method to avoid suspension." + grace period "Access continues until Jun 15, 2026. Update by Jun 15, 2026 to avoid suspension." + "Update Now" CTA navigating to settings tab.

**T-02/T-03 (PurchaseSetup.tsx, ChangePlan.tsx):** Added `bronzePerSeat` to all PLANS entries (Starter: 750, Growth: 600, Enterprise: 500 LKR/seat). Updated seat ranges to Starter 20–200, Growth 200–1,000. Added Bronze/Silver/Gold QPON badge row (10/20/30 QPONs) to each plan card. Added Bronze seat stepper to Configure Seats section. Updated Silver/Gold labels to include QPON counts. Updated monthly total, Order Summary, and button disabled check to include bronze.

**T-06/T-07 (ChangePlan.tsx):** Added prorated billing computation using `(daysRemaining / daysInMonth) × seatDelta`. Renders amber "Prorated charge — billed immediately" row when delta > 0; emerald "Credit to next invoice — no immediate refund" row when delta < 0. Disclaimer shown below totals when proratedAmount ≠ 0.

**T-04 (EmployeeManagement.tsx):** Updated `Tier` type to `'Bronze' | 'Silver' | 'Gold'`. Added Bronze button to tier toggle in AddEmployeeForm. Updated `TierBadge` to render orange badge for Bronze. Updated tier pricing label for all three tiers. Added Bronze to tier filter bar.

**T-11 (EmployeeManagement.tsx):** Removed `{emp.status === 'Pending' &&` gate on Resend button in desktop table and mobile card. Toast message updated to "Activation SMS resent to [name]".

**T-12 (EmployeeManagement.tsx):** CSV template sub-label updated to "Full Name · Mobile Number · Email (optional) · Department". Bulk preview table headers updated to match: `['#', 'Full Name', 'Mobile Number', 'Email (optional)', 'Department', 'Status', '']`.

**T-16 (HRAnalytics.tsx):** Added `EmpBreakdownRow` interface and `EMP_BREAKDOWN` demo data (12 employees across Bronze/Silver/Gold tiers). Added `EmployeeBreakdown` sub-component at the bottom of the file with Department and Tier filter dropdowns, and a table showing Name, Department, Tier (color-coded badge), QPONs Used (progress bar + count), Last Redemption.

### File List

- src/app/components/hr/HRSettings.tsx
- src/app/components/auth/PurchaseSetup.tsx
- src/app/components/hr/ChangePlan.tsx
- src/app/components/hr/HRBilling.tsx
- src/app/components/hr/HRDashboard.tsx
- src/app/components/hr/HRAnalytics.tsx
- src/app/components/hr/EmployeeManagement.tsx

### Change Log

- 2026-05-14: Implemented all 10 task groups for UIUX-263 (BRD UI alignment) — Bronze tier across plan selection and employee management; QPON allocation badges; BRD-correct seat ranges; Gene Payment Gateway labels; failed payment banner; QPON refresh indicators; prorated billing rows; Resend SMS on all rows; CSV column alignment; Employee Breakdown table with filters; cancel dialog SMS copy — claude-sonnet-4-6

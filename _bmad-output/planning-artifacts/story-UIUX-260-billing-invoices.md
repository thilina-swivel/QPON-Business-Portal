# Story UIUX-260: Billing – Invoice Management & Payment Settings Design

Status: ready-for-dev

## Story

As an HR manager,
I want to view all invoices, download PDFs, and manage my payment settings self-service,
so that my finance team always has what they need and I never have to contact QPON about billing.

## Screens to Design

1. Invoice List — all invoices with status and PDF download
2. Billing Settings — payment method, invoice email, PO number

## Invoice List Screen

### Table Columns
- Invoice number and period (e.g. INV-2026-04 · April 2026)
- Silver seats billed
- Gold seats billed
- Total amount due (LKR)
- Status badge: Pending / Paid / Overdue
- Download PDF button

### Invoice Status Logic
- Pending — invoice issued, payment not yet received
- Paid — payment confirmed
- Overdue — past 30-day payment term (visually prominent badge)

### Proration Line Items
- Mid-month additions: extra employees added show half-month charge as a line item on next invoice
- Mid-month removals: credit appears on next invoice for unused portion
- Proration details visible inside downloadable PDF

## Billing Settings Screen

### Payment Method Options
| Method | Description |
|---|---|
| Company Invoice | Monthly invoice; HR pays by bank transfer within 30 days |
| Credit / Debit Card | HR enters card once; auto-charged on 1st of each month |
| Payroll Deduction | 50/50 split; HR downloads deduction CSV on 1st for payroll |
| Purchase Order | HR provides PO number; QPON invoices with PO reference |

### Other Settings
- Invoice email address (primary finance contact)
- CC email (optional secondary recipient)
- PO number field (only shown when Purchase Order is selected)
- Notification preferences for invoice and overdue alerts

## Acceptance Criteria

- [ ] Invoice list shows all historical invoices (newest first default)
- [ ] Each invoice PDF is downloadable and includes Silver seat count, Gold seat count, proration line items (if any), and total due
- [ ] Overdue invoices are clearly marked with a status badge — not buried in the table
- [ ] Payment method change takes effect from the next billing cycle
- [ ] Payroll deduction CSV download available on the 1st of each month
- [ ] PO number field only appears when Purchase Order is selected
- [ ] Billing settings page requires no contact with QPON to make changes
- [ ] Empty state for invoice list (new account, no invoices yet)
- [ ] Loading state for invoice list table
- [ ] Mobile-responsive layouts for both screens
- [ ] Follows QPON Business Portal design system
- [ ] Handoff-ready with proper layer naming

## Tasks / Subtasks

- [ ] Design Invoice List screen (AC: 1, 3, 8, 9, 10)
  - [ ] Table with all columns
  - [ ] Status badges: Pending (neutral), Paid (success), Overdue (error/warning)
  - [ ] Download PDF button per row
  - [ ] Empty state (no invoices yet)
  - [ ] Loading/skeleton state
  - [ ] Mobile layout (responsive table or card list)
- [ ] Design Billing Settings screen (AC: 4, 5, 6, 7, 10)
  - [ ] Payment method selection (4 options with radio or card select)
  - [ ] Conditional PO number field (Purchase Order only)
  - [ ] Payroll deduction CSV download button (visible on 1st of month)
  - [ ] Invoice email + CC email fields
  - [ ] Notification preferences
  - [ ] Save/update action
  - [ ] Mobile layout
- [ ] Design Overdue invoice alert (AC: 3)
  - [ ] Prominent status badge in table
  - [ ] Optional banner or inline alert for active overdue invoices

## Dev Notes

- Scope: UI design only — no frontend, no backend
- Invoices are auto-generated on the 1st of each month — no HR action needed
- Overdue reminder sequence (background, no screen): due date, +7 days, +14 days
- Reference: Feature Overview §06 Billing, §08 Screens: Billing Invoices, Billing Settings

### References

- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 06, Billing]
- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 08, Screens: Billing — Invoices, Billing — Settings]
- Jira: UIUX-260 | Parent: UIUX-256

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

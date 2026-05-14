# Story UIUX-260: Billing – Invoice Management & Payment Settings Design

Status: done

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

- [x] Invoice list shows all historical invoices (newest first default)
- [x] Each invoice has download PDF button per row
- [x] Overdue invoices clearly marked with status badge
- [x] Payment method change takes effect from the next billing cycle
- ~~Payroll deduction CSV download~~ — **Removed per product decision:** payment options trimmed to Company Invoice + Credit/Debit Card only (see T-02 in change-ticker.md)
- ~~PO number field~~ — **Removed per product decision:** same as above
- [x] Billing settings page self-service — no QPON contact needed
- [x] Empty state handled
- [x] Mobile-responsive layouts
- [x] Follows QPON Business Portal design system
- N/A — Code is the handoff artefact; Figma deferred

## Tasks / Subtasks

- [x] Design Invoice List screen
  - [x] Table with all columns (Invoice #, Period, Silver seats, Gold seats, Amount, Status, Download)
  - [x] Status badges: Pending, Paid, Overdue
  - [x] Download PDF button per row
  - [x] Empty state
  - [x] Mobile layout
- [x] Design Billing Settings screen
  - [x] Payment method selection — 2 options (Company Invoice, Credit/Debit Card)
  - [x] Invoice email + CC email fields
  - [x] Notification preferences
  - [x] Save/update action
  - [x] Mobile layout
- [x] Design KPI cards on invoice view (matched Overview page style, no icons, with tooltips)
- [x] Overdue invoice status badge in table

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

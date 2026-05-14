# QPON HR Portal — Change Ticker
**Source:** Corporate_Packages_BRD.txt · **Last updated:** 2026-05-14

---

## ✅ Done

| # | Change | Files touched |
|---|--------|---------------|
| T-01 | **WhatsApp → SMS** across entire portal | `SignIn.tsx`, `SignUp.tsx`, `AuthSlider.tsx`, `OnboardingGuide.tsx`, `HRDashboard.tsx`, `EmployeeManagement.tsx`, `ChangePlan.tsx`, `PurchaseSetup.tsx`, `HRSettings.tsx` |

---

## 🔲 Pending

### Packages & Tiers

| # | Change | Priority | Notes |
|---|--------|----------|-------|
| T-02 | **Add Bronze tier** — BRD defines Bronze (10 QPONs/30 days), Silver (20 QPONs), Gold (30 QPONs). Currently only Silver & Gold exist. | High | Affects `PurchaseSetup.tsx`, `ChangePlan.tsx`, `EmployeeManagement.tsx`, `HRDashboard.tsx` |
| T-03 | **Reframe tier labels as QPON allocation amounts** — BRD uses Bronze/Silver/Gold to describe QPON counts (10/20/30), not seat quality. UI should surface "20 QPONs/month" as the key differentiator. | High | All plan cards need QPON count badges |
| T-04 | **Correct Starter seat range** — BRD says 20–200; current UI shows 50–199. Growth: 200–1,000 (current 200–999). | Medium | `PurchaseSetup.tsx`, `ChangePlan.tsx`, `HRSettings.tsx` |

---

### Billing & Payments

| # | Change | Priority | Notes |
|---|--------|----------|-------|
| T-05 | **Payment gateway branding** — BRD specifies Gene payment gateway (Stripe also listed as supported). Surface Gene logo/name in payment step instead of generic "Credit Card". | Medium | `PurchaseSetup.tsx`, `HRBilling.tsx` |
| T-06 | **Prorated billing UI — seat increase** — When seats are added mid-cycle, BRD requires showing a prorated charge calculated and collected immediately before confirming. | High | `ChangePlan.tsx` needs a prorated preview row in Order Summary |
| T-07 | **Prorated billing UI — seat decrease** — BRD requires credit amount shown and applied to the next invoice instead of an immediate refund. | Medium | `ChangePlan.tsx` Order Summary |
| T-08 | **Failed payment handling** — BRD specifies: retry → admin notification → grace period → subscription suspension. No UI for this flow exists. | High | New screen or banner in `HRBilling.tsx` |
| T-09 | **Monthly QPON allocation refresh indicator** — BRD states QPONs reset each billing cycle. Dashboard/billing should show "Next refresh: Jun 1" and remaining allocations. | Medium | `HRDashboard.tsx`, `HRBilling.tsx` |

---

### Employee Management

| # | Change | Priority | Notes |
|---|--------|----------|-------|
| T-10 | **Email field optional on Add Employee** — BRD says email is optional when SMS-only. Currently the form has no email field at all; confirm this is intentional or add as optional. | Low | `EmployeeManagement.tsx` |
| T-11 | **Resend invitation action** — BRD explicitly requires "resend invitations" as an admin capability. Currently no resend button on employee rows. | Medium | `EmployeeManagement.tsx` employee row actions |
| T-12 | **CSV column mapping** — BRD required employee fields: Full name, Mobile number, Email (optional), Department. Confirm bulk upload template matches this schema. | Medium | `EmployeeManagement.tsx` BulkUploadScreen |

---

### Deals & Visibility

| # | Change | Priority | Notes |
|---|--------|----------|-------|
| T-13 | **Corporate Deals visibility rules** — BRD defines Global Deals (all users) vs Corporate Deals (eligible companies only). HR portal currently shows no deal management; needs a "Corporate Deals" tab or section where admin can see/configure which deals their employees can access. | High | New screen or tab |
| T-14 | **Deal of the Day eligibility for corporate employees** — BRD states corporate employees are eligible for Deal of the Day and nearby deals. Confirm this is reflected in employee-facing QPON app (out of scope for portal UI but needs backend flag). | Low | Backend/API task |

---

### Offboarding

| # | Change | Priority | Notes |
|---|--------|----------|-------|
| T-15 | **SMS notification on cancellation** — BRD: "Users notified via SMS" when subscription is cancelled. The cancel confirmation dialog (already built) should note that employees will be notified by SMS at cycle end. | Low | `HRSettings.tsx` cancel dialog copy |

---

### Reporting

| # | Change | Priority | Notes |
|---|--------|----------|-------|
| T-16 | **Individual Employee Spending Report** — BRD requires per-employee spending breakdown. Current `HRAnalytics.tsx` shows aggregate data only. | Medium | `HRAnalytics.tsx` — add drill-down table or new tab |

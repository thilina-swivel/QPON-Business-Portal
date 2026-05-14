# Story UIUX-261: Authentication & Purchase – Landing, Register, Login, Plan Setup Design

Status: done

## Story

As an HR manager discovering or returning to business.qpon.lk,
I want a clear path from landing page to registered account to active subscription,
so that I can get the benefit live for my employees in under 10 minutes without calling anyone.

## Screens to Design

1. Landing page — public marketing page at business.qpon.lk
2. Register — company and HR manager signup with WhatsApp OTP
3. Login — returning user authentication via WhatsApp OTP
4. Purchase / Upgrade — plan selection, seat configuration, payment method, order summary

## Landing Page

Purpose: Convert HR managers arriving via link, WhatsApp referral, or qpon.lk into signups.

Content:
- Value proposition: "Give your employees savings on food, fuel, and groceries — for less than one team lunch per employee per month"
- How it works: 3-step visual (You buy seats → We send WhatsApp → Employees save money)
- ROI example: "500 employees · LKR 600K spend · LKR 2.1M employee savings"
- Plan tier summary (Starter / Growth / Enterprise)
- Primary CTA: "Get Started for Free" → Register

## Register Screen

Fields:
- Company name
- HR manager full name
- Work email
- Mobile number (WhatsApp)

Flow:
1. HR fills in form and submits
2. QPON sends OTP to their WhatsApp
3. HR enters OTP to verify
4. Account created immediately — no credit card required at this stage
5. HR lands on Purchase screen to configure subscription

## Login Screen

- Email input
- QPON sends OTP to registered WhatsApp
- HR enters OTP → lands on Dashboard
- No passwords. No "forgot password" — OTP to WhatsApp replaces it entirely.

## Purchase / Upgrade Screen

### Plan Selection
| Plan | Size | Silver/seat | Gold/seat | Annual option |
|---|---|---|---|---|
| Starter | 50–199 | LKR 1,500 | LKR 2,800 | Not available |
| Growth | 200–999 | LKR 1,200 | LKR 2,400 | 10 months + 2 free |
| Enterprise | 1,000+ | LKR 1,000 | LKR 2,000 | 10 months + 2 free |

### Seat Configurator
- Silver seat count input (stepper or number field)
- Gold seat count input
- Total monthly cost updates in real time
- Breakdown: Silver total + Gold total + Grand total

### Payment Method Selection
- Company Invoice (30-day terms)
- Credit / Debit Card
- Payroll Deduction
- Purchase Order (PO number field appears when selected)

### Order Summary
- Plan name
- Silver seats × per-seat cost
- Gold seats × per-seat cost
- Total monthly amount
- "Confirm & Activate" CTA

### Post-Purchase
- Subscription activates immediately
- Invoice emailed to finance within 24 hours
- HR lands on Employee Upload screen (Bulk Upload) to start onboarding

## Acceptance Criteria

- ~~Landing page loads fast and works on mobile~~ — **Skipped:** no public landing page built; portal opens at Sign In
- [x] Register form: company name, HR name, work email, mobile number
- [x] SMS OTP verification within 60 seconds — **Note:** SMS used (not WhatsApp, per T-01)
- [x] No credit card required at registration — only at Purchase step
- [x] Real-time pricing updates on seat configurator
- [x] Payment methods: Company Invoice + Credit/Debit Card — **Note:** Payroll Deduction and PO removed per product decision
- [x] Subscription activates immediately on confirm
- [x] Upgrade flow (Change Plan) uses same screen with current subscription pre-filled
- [x] OTP screen has resend with countdown
- [x] Error states: invalid OTP, form validation
- [x] Mobile-responsive layouts for all screens
- [x] Follows QPON Business Portal design system
- N/A — Code is the handoff artefact; Figma deferred

## Tasks / Subtasks

- ~~Design Landing page~~ — Skipped; no public landing page in scope
- [x] Design Register screen
  - [x] Form: company name, HR name, email, mobile
  - [x] Inline field validation
  - [x] Submit → OTP transition
  - [x] Mobile layout
- [x] Design SMS OTP screen (shared for Register + Login)
  - [x] OTP input component
  - [x] Resend link with countdown timer
  - [x] Mobile layout
- [x] Design Login screen
  - [x] Email input
  - [x] OTP step
  - [x] Error: unregistered email
  - [x] Mobile layout
- [x] Design Purchase / Upgrade screen (PurchaseSetup.tsx + ChangePlan.tsx)
  - [x] Plan cards: Starter, Growth, Enterprise
  - [x] Silver / Gold seat configurator with live cost update
  - [x] Annual billing toggle (Growth + Enterprise only)
  - [x] Payment method: Company Invoice + Credit/Debit Card
  - [x] Order summary panel (sticky sidebar)
  - [x] "Confirm & Activate" CTA with loading state
  - [x] Upgrade variant: current plan pre-filled (ChangePlan.tsx)
  - [x] Mobile layout

## Dev Notes

- Scope: UI design only — no frontend, no backend
- WhatsApp OTP is used for both Register and Login — design as a reusable screen component
- No passwords at any point in the flow
- After purchase, the next natural screen is Bulk Upload (UIUX-258)
- Reference: Feature Overview §02 Part A Steps 1–5, §07 Pricing, §08 Screens

### References

- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 02, Part A, Steps 1–5]
- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 07, Pricing]
- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 08, Screens: Landing Page, Register, Login, Purchase/Upgrade]
- Jira: UIUX-261 | Parent: UIUX-256

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

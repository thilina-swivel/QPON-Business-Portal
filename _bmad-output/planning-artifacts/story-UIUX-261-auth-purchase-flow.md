# Story UIUX-261: Authentication & Purchase – Landing, Register, Login, Plan Setup Design

Status: ready-for-dev

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

- [ ] Landing page loads fast and works on mobile (HR may share the link via WhatsApp)
- [ ] Register form requires: company name, HR name, work email, mobile number — nothing else
- [ ] WhatsApp OTP verification works within 60 seconds of submission
- [ ] No credit card required at registration — only at Purchase step
- [ ] Real-time pricing updates on seat configurator without page reload
- [ ] All four payment methods selectable; PO number field only appears for Purchase Order
- [ ] Subscription activates immediately on confirm — HR does not wait for payment to clear
- [ ] Upgrade flow (existing subscriber) uses same Purchase screen with current subscription pre-filled
- [ ] OTP screen has resend option with countdown and expired OTP state
- [ ] Error states designed: invalid OTP, unregistered email on login, form validation
- [ ] Mobile-responsive layouts for all screens
- [ ] Follows QPON Business Portal design system
- [ ] Handoff-ready with proper layer naming

## Tasks / Subtasks

- [ ] Design Landing page (AC: 1, 11)
  - [ ] Hero: value proposition + primary CTA
  - [ ] How it works: 3-step visual flow
  - [ ] ROI numbers block
  - [ ] Plan tier summary (Starter / Growth / Enterprise)
  - [ ] Mobile layout
- [ ] Design Register screen (AC: 2, 3, 4)
  - [ ] Form: company name, HR name, email, mobile
  - [ ] Inline field validation
  - [ ] Submit → OTP transition
  - [ ] Mobile layout
- [ ] Design WhatsApp OTP screen (AC: 3, 9)
  - [ ] OTP input (shared component for Register + Login)
  - [ ] Resend link with countdown timer
  - [ ] Expired OTP state
  - [ ] Mobile layout
- [ ] Design Login screen (AC: 10)
  - [ ] Email input
  - [ ] OTP step (shared OTP component)
  - [ ] Error: unregistered email
  - [ ] Mobile layout
- [ ] Design Purchase / Upgrade screen (AC: 5, 6, 7, 8)
  - [ ] Plan cards: Starter, Growth, Enterprise
  - [ ] Silver / Gold seat configurator with live cost update
  - [ ] Annual billing toggle (Growth + Enterprise only)
  - [ ] Payment method selection (4 options + conditional PO field)
  - [ ] Order summary panel
  - [ ] "Confirm & Activate" CTA
  - [ ] Success / post-purchase confirmation
  - [ ] Upgrade variant: current plan pre-filled
  - [ ] Mobile layout

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

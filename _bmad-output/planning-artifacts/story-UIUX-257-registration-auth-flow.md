# Story UIUX-257: Registration & Authentication Flow

Status: ready-for-dev

## Story

As an HR manager visiting business.qpon.lk for the first time,
I want a clear, frictionless sign-up and login experience,
so that I can register my company and access the portal in under 10 minutes without calling anyone.

## Screens

1. **Landing Page** — Marketing page explaining the employee benefit. CTA: 'Get Started for Free'. Public access.
2. **Register** — Form: Company name, HR name, work email, mobile number. WhatsApp OTP verification. No credit card required.
3. **Login** — Email input → OTP sent to WhatsApp → redirect to dashboard.
4. **WhatsApp OTP Screen** — OTP entry step shared across Register and Login flows.

## Acceptance Criteria

1. Landing page communicates the benefit clearly with a single primary CTA
2. Registration form captures: company name, HR name, work email, mobile number
3. WhatsApp OTP verification screen is designed with resend option and expiry state
4. Login flow: email input → WhatsApp OTP → dashboard redirect
5. All error states designed: invalid OTP, expired OTP, unregistered email
6. Empty and loading states covered for all form screens
7. Mobile-responsive layouts designed for all screens
8. Follows QPON Business Portal design system — spacing, typography, colour
9. Designs are handoff-ready with proper layer naming

## Tasks / Subtasks

- [ ] Design Landing Page (AC: 1)
  - [ ] Hero section with value proposition
  - [ ] Three-user overview (HR / Employee / QPON Admin)
  - [ ] CTA placement and copy
  - [ ] Mobile layout
- [ ] Design Register screen (AC: 2)
  - [ ] Form layout with all required fields
  - [ ] Inline validation states
  - [ ] Submit → OTP transition
  - [ ] Mobile layout
- [ ] Design WhatsApp OTP screen (AC: 3)
  - [ ] OTP input (shared component for Register + Login)
  - [ ] Resend link with countdown
  - [ ] Expired OTP state
  - [ ] Mobile layout
- [ ] Design Login screen (AC: 4)
  - [ ] Email input
  - [ ] OTP step
  - [ ] Error: unregistered email
  - [ ] Mobile layout
- [ ] Error and edge states (AC: 5, 6)
  - [ ] Invalid/wrong OTP
  - [ ] Network error
  - [ ] Loading states for form submissions

## Dev Notes

- Scope is UI design only — no frontend, no backend
- WhatsApp OTP is used for both Register and Login — design as a reusable screen pattern
- No password creation at any point in the flow
- Reference: Feature Overview §02 Part A Steps 1–2, §08 Screens to Build

### References

- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 02, Part A, Steps 1–2]
- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 08, Screens: Landing Page, Register, Login]
- Parent ticket: UIUX-256

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

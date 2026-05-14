# Story UIUX-257: Registration & Authentication Flow

Status: done

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

1. ~~Landing page communicates the benefit clearly with a single primary CTA~~ — **Skipped:** portal opens directly at Sign In; no public landing page built
2. [x] Registration form captures: company name, HR name, work email, mobile number
3. [x] OTP verification screen with resend option and countdown — **Note:** SMS used (not WhatsApp, per T-01)
4. [x] Login flow: email input → SMS OTP → dashboard redirect
5. [x] Error states: invalid OTP, loading, form validation
6. [x] Loading states for all form screens
7. [x] Mobile-responsive layouts for all screens
8. [x] Follows QPON Business Portal design system
9. N/A — Code is the handoff artefact; Figma deferred

## Tasks / Subtasks

- ~~Design Landing Page (AC: 1)~~ — Skipped; no public landing page in scope
- [x] Design Register screen (AC: 2)
  - [x] Form layout with all required fields
  - [x] Inline validation states
  - [x] Submit → OTP transition
  - [x] Mobile layout
- [x] Design SMS OTP screen (AC: 3) — was WhatsApp OTP, updated to SMS per T-01
  - [x] OTP input (shared component for Register + Login)
  - [x] Resend link with countdown
  - [x] Mobile layout
- [x] Design Login screen (AC: 4)
  - [x] Email input
  - [x] OTP step
  - [x] Error: unregistered email
  - [x] Mobile layout
- [x] Error and edge states (AC: 5, 6)
  - [x] Invalid/wrong OTP
  - [x] Loading states for form submissions

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

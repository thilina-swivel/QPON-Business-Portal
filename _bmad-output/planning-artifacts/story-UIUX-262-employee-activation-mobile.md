# Story UIUX-262: Employee Activation Flow – Mobile Web Activation Screens Design

Status: ready-for-dev

## Story

As an employee who received a WhatsApp activation link from my company,
I want a simple one-tap activation experience on my phone,
so that my QPON account is active and I can start saving in under 30 seconds.

## Screens to Design

1. Token Landing Page — activation screen employees see when they tap the link
2. Already Activated — shown if the employee taps the link a second time
3. Token Expired — shown if the link has expired (48 hours after sending)
4. Activation Success — confirmation screen with app download links

## Token Landing Page

Shown when employee taps a valid, unused activation link from WhatsApp.

Content:
- Company logo and name prominently displayed (e.g. "MAS Holdings")
- Employee first name pre-filled: "Hi Nimal!"
- Their tier clearly shown (Silver or Gold)
- Summary of what they get:
  - Silver: Access to dining, grocery, pharmacy, and retail deals
  - Gold: All Silver benefits + 8% fuel cashback + premium exclusives
- ONE button: "Activate My Account"
- No form to fill. No password to create. One tap — they're in.

Context (WhatsApp message that preceded this screen):
> "Hi Nimal! MAS Holdings has activated your QPON employee benefit. Tap here to claim your account: qpon.lk/activate/your-link"

## Already Activated Screen

- Friendly message: "You're already set up! Open the QPON app to start saving."
- App Store and Google Play links
- Brief reminder of their tier (Silver / Gold)

## Token Expired Screen

- Clear message: "This link has expired."
- Explanation: links expire after 48 hours for security
- Button: "Request a new link" — triggers a new WhatsApp to the employee's number

## Activation Success Screen

- Confirmation: "You're in! Your [Company Name] benefit is active."
- Tier confirmation (Silver or Gold)
- Two large CTA buttons:
  - "Download on the App Store"
  - "Get it on Google Play"
- Brief next step: "Open the app and start saving today."

## Design Notes

- All screens are mobile-first — employees open from WhatsApp on a phone
- Company logo must display correctly; degrades gracefully to company name text if no logo uploaded
- No navigation, no sidebar — single-purpose screens only
- Brand feel: QPON brand with company name visible — employee associates savings with their employer
- The experience must feel like the company set this up, not a third-party app

## Acceptance Criteria

- [ ] Token landing page shows company name, employee first name, and tier correctly
- [ ] "Activate My Account" is the only action on the landing page — no other CTAs
- [ ] Activation completes and account is created in under 5 seconds after button tap
- [ ] Success screen deep links to the correct app store based on device (iOS → App Store, Android → Play Store)
- [ ] Already activated screen shows correct app store links — does not allow re-activation
- [ ] Expired token screen sends a new WhatsApp to the employee's number on tap of "Request new link"
- [ ] All screens render correctly on screens from 320px to 430px wide
- [ ] Company logo degrades to company name text if no logo is uploaded
- [ ] Loading state for token validation (between tap and account creation)
- [ ] Error state if activation fails (generic, user-friendly message)
- [ ] Follows QPON brand system (distinct from HR portal — employee-facing)
- [ ] Handoff-ready with proper layer naming

## Tasks / Subtasks

- [ ] Design Token Landing Page (AC: 1, 2, 7, 8)
  - [ ] Company logo / name header
  - [ ] Personalised greeting with employee first name
  - [ ] Tier badge (Silver or Gold) with benefit summary
  - [ ] "Activate My Account" single CTA
  - [ ] Logo fallback to company name text (AC: 8)
  - [ ] Loading state post-tap (AC: 9)
- [ ] Design Already Activated screen (AC: 5, 7)
  - [ ] Friendly message
  - [ ] App Store + Google Play links
  - [ ] Tier reminder
- [ ] Design Token Expired screen (AC: 6, 7)
  - [ ] Expired message with explanation
  - [ ] "Request a new link" CTA
  - [ ] Post-request confirmation state
- [ ] Design Activation Success screen (AC: 3, 4, 7)
  - [ ] Confirmation message with company name
  - [ ] Tier confirmation
  - [ ] App Store deep link button (iOS)
  - [ ] Google Play deep link button (Android)
  - [ ] Next step instruction
- [ ] Design error state (AC: 10)
  - [ ] Generic activation failure message

## Dev Notes

- Scope: UI design only — no frontend, no backend
- This is a completely separate experience from the HR portal — mobile web at qpon.lk/activate/{token}
- Employee-facing: design should feel like a company benefit, not an HR admin tool
- No navigation or sidebar — single-purpose screens
- Reference: Feature Overview §02 Part B Employee Journey, §08 Employee Activation Mobile Web

### References

- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 02, Part B, Employee Journey Steps 1–3]
- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 05, What the Employee Gets]
- [Source: docs/QPON_HR_Feature_Overview.pdf — Section 08, Employee Activation Mobile Web]
- Jira: UIUX-262 | Parent: UIUX-256

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List
# Tasks: LGPD Compliance Implementation

**Input**: Design and correction plan from `specs/002-lgpd-compliance/`
**Prerequisites**: spec.md and plan.md

## Phase 1: Cookie Preference Baseline

- [x] T001 Add shared cookie preference helpers in `lib/cookie-consent.ts`
- [x] T002 Replace notice-only banner with granular preferences in `components/CookieBanner.tsx`
- [x] T003 Keep a persistent preferences entry point after initial choice

## Phase 2: Third-Party Script Gating

- [x] T004 Gate Google Analytics loading by analytics preference in `components/GoogleAnalytics.tsx`
- [x] T005 Gate AdSense script and ad slots by advertising preference in `components/Adsense.tsx`
- [x] T006 Preserve existing forbidden AdSense route categories

## Phase 3: Rights Request Intake

- [x] T007 Add privacy request schema fields in `lib/db/schema.ts`
- [x] T008 Add request validation in `lib/validation.ts`
- [x] T009 Add `app/api/privacy/request/route.ts`
- [x] T010 Add `migrations/004_privacy_requests.sql`
- [x] T011 Add privacy request form in `components/PrivacyRequestForm.tsx`

## Phase 4: Legal Disclosures

- [x] T012 Rewrite `app/privacidade/page.tsx` for current runtime data flows
- [x] T013 Rewrite `app/termos/page.tsx` to reference privacy choices and ad restrictions
- [x] T014 Update legacy LGPD plan and AdSense business-plan validation notes

## Phase 5: Validation

- [x] T015 Run `npm run lint`
- [x] T016 Run `npm run build`
- [ ] T017 Browser-check no GA/AdSense scripts before consent

# Implementation Plan: LGPD Compliance Implementation

**Branch**: `002-lgpd-compliance` | **Date**: 2026-05-14 | **Spec**: [spec.md](./spec.md)

## Summary

Implement the LGPD correction plan by replacing notice-only cookies with
granular preferences, blocking analytics and advertising scripts until allowed,
rewriting privacy/terms disclosures, and adding an operational LGPD request
intake.

## Technical Context

**Language/Version**: Next.js App Router, React, TypeScript, Drizzle/Postgres  
**Primary Dependencies**: Existing constitution, AdSense business plan, ANPD cookie guidance, LGPD principles  
**Storage**: Browser localStorage for cookie preferences; Postgres table for privacy requests  
**Testing**: `npm run lint`, `npm run build`, manual/browser verification of script gating  
**Target Platform**: `urlencurta.com.br` production deployment  
**Constraints**: Preserve free shortening flow, preserve forbidden AdSense surfaces, do not block necessary auth/security cookies  
**Scope**: Cookie preferences, Google Analytics/AdSense gating, legal pages, privacy request intake, spec status updates

## Constitution Check

- **Free Utility Gate**: PASS. The shortening flow remains unchanged.
- **AdSense Surface Gate**: PASS. Advertising consent is additive and route restrictions remain enforced.
- **Organic Growth Gate**: PASS. Editorial pages remain available; ads require preference and eligible route.
- **Trust and LGPD Gate**: PASS. This feature directly improves transparency, consent choices and rights handling.
- **Performance Gate**: PASS. Blocking non-essential scripts by default reduces third-party load until accepted.

## Project Structure

```text
app/api/privacy/request/route.ts
app/privacidade/page.tsx
app/termos/page.tsx
components/CookieBanner.tsx
components/GoogleAnalytics.tsx
components/Adsense.tsx
components/PrivacyRequestForm.tsx
lib/cookie-consent.ts
lib/db/schema.ts
lib/validation.ts
migrations/004_privacy_requests.sql
specs/002-lgpd-compliance/
```

## Complexity Tracking

No constitution violations. Remaining legal risk: final wording should be
reviewed by counsel before relying on it as legal advice.

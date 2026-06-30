# Implementation Plan: Adsterra Monetization Plan

**Branch**: `003-adsterra-monetization-plan` | **Date**: 2026-06-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-adsterra-monetization-plan/spec.md`
**Last Updated**: 2026-06-30

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Create a comprehensive planning package for introducing Adsterra monetization
into URLEncurta. The plan follows Adsterra's publisher getting-started flow:
sign up as publisher, verify email, add the website, choose ad formats, wait
for approval, retrieve real scripts, and install after internal route, privacy,
performance, and trust review. The documentation phase has been completed and
the runtime component (`components/Adsterra.tsx`) is now active in production
on eligible editorial pages.

## Technical Context

**Language/Version**: Markdown documentation + TypeScript/React component  
**Primary Dependencies**: Current constitution, feature spec, existing Adsterra publisher documentation, current route inventory, legal/privacy documentation  
**Storage**: Repository documentation files + environment variables for Adsterra configuration  
**Testing**: Manual checklist validation against spec success criteria, constitution gates, Adsterra onboarding flow, and quickstart review workflow  
**Target Platform**: Production website `urlencurta.com.br`; Adsterra scripts active on public content pages only  
**Project Type**: Documentation and monetization-planning feature with runtime component for an existing web product  
**Performance Goals**: Preserve redirect p95 target below 150ms; monetized public pages protect LCP, CLS, TTFB, and free link creation completion  
**Constraints**: Adsterra scripts only on approved public content pages; no ads on private, legal, checkout, preview, redirect, API, dashboard, login, register, or user short-code surfaces; no competing ad stacks without explicit approval  
**Scale/Scope**: One canonical Adsterra planning package covering onboarding gates, surface policy, format risk, consent/legal review, performance budgets, rollout workflow, and runtime component implementation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Free Utility Gate**: PASS. The plan preserves the no-signup free shortening
  path and forbids Adsterra on link creation blockers, redirects, and user
  short-code experiences.
- **Adsterra Surface Gate**: PASS. The plan treats Adsterra as the primary ad
  network that inherits the same blocked-route rules. The runtime component
  (`components/Adsterra.tsx`) enforces route classification.
- **Organic Growth Gate**: PASS. Adsterra is limited to public content-led
  surfaces connected to SEO, sharing, QR Code, WhatsApp, campaign, safety, and
  bio-link use cases.
- **Trust and LGPD Gate**: PASS. The plan requires third-party disclosure,
  consent behavior, data minimization, ad labeling, domain reputation review,
  and unsafe-format rejection rules.
- **Performance Gate**: PASS. The plan requires redirect p95 protection,
  stable ad space, script failure handling, LCP/CLS/TTFB budgets, free-flow
  completion checks, and rollback thresholds before launch.

**Post-Design Re-check**: PASS. `research.md`, `data-model.md`,
`contracts/adsterra-monetization-contract.md`, `quickstart.md`, and
`adsterra-monetization-plan.md` preserve the same gates. No constitution
violations remain.

## Project Structure

### Documentation (this feature)

```text
specs/003-adsterra-monetization-plan/
+-- plan.md
+-- research.md
+-- data-model.md
+-- quickstart.md
+-- adsterra-monetization-plan.md
+-- validation-report.md
+-- contracts/
|   +-- adsterra-monetization-contract.md
+-- checklists/
    +-- requirements.md
```

### Source Code (implemented)

```text
components/
+-- Adsterra.tsx                    # Adsterra ad slot component with route classification

app/
+-- como-funciona/page.tsx          # Uses AdsterraSlotMiddle
+-- boas-praticas-url-curta/page.tsx # Uses EditorialGuide with AdsterraSlotMiddle
+-- links-para-whatsapp/page.tsx    # Uses EditorialGuide with AdsterraSlotMiddle
+-- qr-code-para-links/page.tsx    # Uses EditorialGuide with AdsterraSlotMiddle
+-- seguranca-em-links-curtos/page.tsx # Uses EditorialGuide with AdsterraSlotMiddle
+-- page.tsx (HomeRedesign)         # Uses AdsterraSlotBottom

.env.local                          # Adsterra environment variables configured
```

**Structure Decision**: This planning cycle started as documentation-only and
evolved to include a runtime component. The `components/Adsterra.tsx` handles
route classification, cookie consent integration, script loading, and error
handling. Future implementation specs may use the generated contract to add
additional ad formats or surfaces.

## Complexity Tracking

No constitution violations or unresolved complexity exceptions.

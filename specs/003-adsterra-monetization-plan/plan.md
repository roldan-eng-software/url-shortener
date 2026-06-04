# Implementation Plan: Adsterra Monetization Plan

**Branch**: `003-adsterra-monetization-plan` | **Date**: 2026-06-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-adsterra-monetization-plan/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Create a documentation-only planning package for introducing Adsterra
monetization into URLEncurta. The plan follows Adsterra's publisher
getting-started flow: sign up as publisher, verify email, add the website,
choose ad formats, wait for approval, retrieve real scripts, and install only
after internal route, privacy, performance, and trust review. No runtime code,
database migration, ad script, or production configuration changes are included
in this cycle.

## Technical Context

**Language/Version**: Markdown documentation in the existing Spec Kit structure  
**Primary Dependencies**: Current constitution, feature spec, existing AdSense business plan, official Adsterra publisher getting-started documentation, current route inventory, legal/privacy documentation  
**Storage**: Repository documentation files only; no runtime database changes in this planning phase  
**Testing**: Manual checklist validation against spec success criteria, constitution gates, Adsterra onboarding flow, and quickstart review workflow  
**Target Platform**: Production website planning for `urlencurta.com.br`; later implementation may target public content pages only  
**Project Type**: Documentation and monetization-planning feature for an existing web product  
**Performance Goals**: Preserve redirect p95 target below 150ms; require monetized public pages to protect LCP, CLS, TTFB, and free link creation completion before implementation  
**Constraints**: No code changes in this phase; no Adsterra scripts before domain approval; no ads on private, legal, checkout, preview, redirect, API, dashboard, login, register, or user short-code surfaces; no competing ad stacks without later explicit approval  
**Scale/Scope**: One canonical Adsterra planning package covering onboarding gates, surface policy, format risk, consent/legal review, performance budgets, rollout workflow, and future decision contract

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Free Utility Gate**: PASS. The plan preserves the no-signup free shortening
  path and forbids Adsterra on link creation blockers, redirects, and user
  short-code experiences.
- **AdSense Surface Gate**: PASS WITH COMPATIBILITY NOTE. The constitution names
  AdSense as the existing advertising layer; this plan treats Adsterra as an
  additional or alternative network that inherits the same blocked-route rules
  and requires a future constitution/product decision before any competing
  ad-stack implementation.
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
violations remain because this phase adds no runtime Adsterra code and routes
future implementation through explicit review.

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

### Source Code (repository root)

```text
.specify/
+-- feature.json
+-- memory/
    +-- constitution.md

AGENTS.md
DIRETRIZ.md
specs/
+-- 001-adsense-business-plan/
+-- 002-lgpd-compliance/
+-- 003-adsterra-monetization-plan/
```

**Structure Decision**: This planning cycle is documentation-only. It does not
add application code, migrations, UI components, runtime APIs, secrets, vendor
scripts, or tests. Future implementation specs may use the generated contract
to decide which application files need changes after Adsterra approval.

## Complexity Tracking

No constitution violations or unresolved complexity exceptions.

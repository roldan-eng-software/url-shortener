# Implementation Plan: AdSense Business Plan

**Branch**: `001-adsense-business-plan` | **Date**: 2026-05-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-adsense-business-plan/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Create the first actionable business-planning package for URLEncurta's free
viral growth and Google AdSense monetization model. The output is a documented
decision system, not a product-code change: it defines eligible and forbidden ad
surfaces, organic growth loops, content clusters, Premium's complementary role,
baseline metrics, compliance/trust gates, and a quick validation workflow for
future features.

## Technical Context

**Language/Version**: Markdown documentation in the existing Spec Kit structure  
**Primary Dependencies**: Current constitution, feature spec, existing legal/privacy docs, current public route inventory, official Google AdSense policy guidance  
**Storage**: Repository documentation files only; no runtime database changes in this planning phase  
**Testing**: Manual checklist validation against spec success criteria, constitution gates, and quickstart review flow  
**Target Platform**: Production website planning for `urlencurta.com.br` and future Spec Kit implementation cycles
**Project Type**: Documentation and business-planning feature for an existing web product  
**Performance Goals**: Preserve redirect p95 target below 150ms; require monetized public pages to protect LCP, CLS, and link creation completion before implementation  
**Constraints**: No code changes in this phase; no new ad placements without later implementation specs; no monetization on private, legal, checkout, preview, redirect, API, or user short-code surfaces  
**Scale/Scope**: One canonical business plan package covering surface policy, content/growth roadmap, metrics, trust/compliance rules, and future decision workflow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Answer every gate below with PASS, FAIL, or N/A and include concise evidence.
Any FAIL must be listed in Complexity Tracking with a mitigation plan.

- **Free Utility Gate**: PASS. The plan explicitly protects the no-signup free
  shortening path and treats it as the acquisition and viral growth engine.
- **AdSense Surface Gate**: PASS. The plan requires allowed, forbidden, and
  review-required surface classifications and preserves the constitution's
  blocked route categories.
- **Organic Growth Gate**: PASS. The plan centers SEO, sharing, QR Codes,
  WhatsApp use cases, bio links, messaging templates, retention, and content
  clusters.
- **Trust and LGPD Gate**: PASS. The plan includes privacy, consent,
  third-party services, unsafe destination risk, ad disclosure, and domain
  reputation checks.
- **Performance Gate**: PASS. The plan requires redirect speed, LCP, CLS,
  layout stability, and link creation completion metrics before future
  monetization changes.

**Post-Design Re-check**: PASS. `research.md`, `data-model.md`,
`contracts/business-plan-contract.md`, and `quickstart.md` all preserve the
same gates. No constitution violations remain.

## Project Structure

### Documentation (this feature)

```text
specs/001-adsense-business-plan/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── business-plan.md      # Canonical implementation artifact
├── validation-report.md  # Evidence and acceptance validation
├── contracts/
│   └── business-plan-contract.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
.specify/
├── feature.json
└── memory/
    └── constitution.md

AGENTS.md
DIRETRIZ.md
specs/
└── 001-adsense-business-plan/
```

**Structure Decision**: This planning cycle is documentation-only. It does not
add application code, migrations, UI components, runtime APIs, or tests. Future
implementation specs may use the generated business-plan contract to decide
which application files need changes.

## Complexity Tracking

No constitution violations or unresolved complexity exceptions.

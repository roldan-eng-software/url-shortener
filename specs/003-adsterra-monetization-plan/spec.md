# Feature Specification: Adsterra Monetization Plan

**Feature Branch**: `003-adsterra-monetization-plan`  
**Created**: 2026-06-04  
**Status**: Implemented  
**Last Updated**: 2026-06-30  
**Input**: User description: "Dentro deste projeto, crie um planejamento para inserir monetização por meio do ADsterra, seguindo as instruções dos docs do site https://help-publishers.adsterra.com/en/collections/2270069-getting-started-with-adsterra. Siga de perto estas instruções para criar primeiro um planejamento bem estruturado juntamente com as rules do spec-kit"

## Implementation Status

This feature has been implemented as a documentation planning package AND a runtime
component. The Adsterra advertising integration is active in production:

**Implemented Components:**

- `components/Adsterra.tsx`: Adsterra ad slot component with route classification
- `AdsterraSlot`, `AdsterraSlotTop`, `AdsterraSlotMiddle`, `AdsterraSlotBottom` variants
- Cookie consent integration for advertising preferences
- Route-based ad eligibility (forbidden/allowed/editorial paths)
- Error handling and fallback states

**Active Surfaces:**

- `/como-funciona`: AdsterraSlotMiddle
- `/boas-praticas-url-curta`: AdsterraSlotMiddle (via EditorialGuide)
- `/links-para-whatsapp`: AdsterraSlotMiddle (via EditorialGuide)
- `/qr-code-para-links`: AdsterraSlotMiddle (via EditorialGuide)
- `/seguranca-em-links-curtos`: AdsterraSlotMiddle (via EditorialGuide)
- `/` (homepage): AdsterraSlotBottom

**Configuration:**

- Environment variables: `NEXT_PUBLIC_ADSTERRA_ENABLED`, `NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_URL`, `NEXT_PUBLIC_ADSTERRA_NATIVE_KEY`
- Real Adsterra script configured in `.env.local`

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Define Adsterra onboarding plan (Priority: P1)

As the product owner, I need a documented Adsterra onboarding plan based on the
official publisher getting-started flow, so URLEncurta can prepare monetization
without prematurely adding third-party scripts to production.

**Why this priority**: Adsterra cannot be safely introduced until the team knows
which account, domain, approval, ad code, consent, and placement steps must
exist before implementation.

**Independent Test**: A stakeholder can read the plan and identify the required
sequence from publisher signup through website approval, ad unit selection, code
retrieval, route eligibility, consent review, and launch validation.

**Acceptance Scenarios**:

1. **Given** the team is ready to test Adsterra, **When** it follows the plan,
   **Then** it can complete signup, email verification, website addition,
   moderation tracking, ad unit selection, and code retrieval as separate
   approval gates.
2. **Given** Adsterra has not approved the domain yet, **When** a developer
   reviews the plan, **Then** no production page is authorized to load Adsterra
   scripts until approval evidence and real placement codes are available.

---

### User Story 2 - Classify Adsterra ad surfaces (Priority: P2)

As a product and growth planner, I need a route-by-route Adsterra surface policy,
so ads can monetize content pages without damaging the free short-link creation,
redirect, legal, checkout, or private experiences.

**Why this priority**: Adsterra formats can include overlays, widgets, banners,
direct links, and other scripts. The project must prevent intrusive placements
from confusing users or compromising the URL shortener's trust model.

**Independent Test**: A planner can evaluate any existing or proposed page and
classify it as allowed, forbidden, or review-required for Adsterra.

**Acceptance Scenarios**:

1. **Given** a public article or guide, **When** the planner checks the surface
   policy, **Then** the page can be approved only if it has original useful
   content, clear product relevance, privacy coverage, stable ad space, and no
   interference with primary link creation.
2. **Given** a short-code redirect, API route, checkout, login, legal page,
   dashboard, preview page, or private user screen, **When** it is evaluated,
   **Then** Adsterra is forbidden regardless of traffic volume.

---

### User Story 3 - Govern consent, trust, and performance (Priority: P3)

As an operator responsible for compliance and domain reputation, I need Adsterra
guardrails for privacy, consent, ad disclosure, unsafe destinations, and
performance, so monetization does not weaken LGPD posture or user trust.

**Why this priority**: URL shorteners rely on domain reputation and speed.
Third-party advertising scripts must be governed before implementation.

**Independent Test**: An operator can review the plan and confirm the required
legal updates, consent behavior, metrics, launch checks, and rejection rules for
Adsterra placements.

**Acceptance Scenarios**:

1. **Given** Adsterra scripts are proposed for a route, **When** the operator
   checks the plan, **Then** the route must have LGPD/privacy disclosure,
   cookie-consent behavior, ad labeling, performance budgets, and a rollback
   rule before launch.
2. **Given** an Adsterra placement increases revenue but harms link creation,
   layout stability, readability, or trust, **When** the decision workflow is
   applied, **Then** the placement must be revised, paused, or rejected.

---

### Edge Cases

- What happens if the Adsterra website remains pending or is rejected?
- What happens if Adsterra approves only some formats, or recommends a format
  that conflicts with the product's trust model?
- How does the plan handle direct-link or Smartlink monetization when the
  project's primary value is shortening destination URLs?
- What happens if Adsterra and AdSense are both candidates for the same page?
- What happens if an ad format overlays content, opens a new flow, or resembles
  product UI in a way that could confuse users?
- What happens if revenue improves but Core Web Vitals, redirect speed, or link
  creation completion gets worse?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The plan MUST document the Adsterra onboarding sequence: create a
  publisher account, verify email, add `urlencurta.com.br` as a website, select
  intended ad formats, wait for domain approval, retrieve real ad code, and
  launch only after internal review.
- **FR-002**: The plan MUST require Adsterra approval evidence before any
  production implementation task can add Adsterra scripts or direct links.
- **FR-003**: The plan MUST classify Adsterra surfaces into allowed, forbidden,
  and review-required groups.
- **FR-004**: The plan MUST forbid Adsterra on APIs, dashboard, login, register,
  checkout, legal pages, preview pages, redirects, user short-code routes, and
  private user experiences.
- **FR-005**: The plan MUST allow Adsterra consideration only on public
  content-led surfaces with original useful content, clear search intent,
  product relevance, stable layout, consent coverage, and no interference with
  free link creation.
- **FR-006**: The plan MUST define how Adsterra coexists with the constitution
  (AdSense-oriented at the time; Adsterra-oriented since v1.1.0), including a
  rule that no page runs competing ad stacks unless a later implementation spec
  explicitly approves it.
- **FR-007**: The plan MUST define a format policy for Adsterra ad types,
  treating standard display/content placements as preferred, overlay-like or
  notification-like formats as review-required, and direct-link/Smartlink
  usage as forbidden for short-code redirects unless a future trust review
  approves a separate editorial flow.
- **FR-008**: The plan MUST define legal and privacy updates required before
  launch, including third-party advertising disclosure, consent behavior, data
  minimization, cookie/tracking review, and ad labeling.
- **FR-009**: The plan MUST define performance budgets and observability checks
  for any future implementation, including LCP, CLS, TTFB, link creation
  completion, redirect p95, script loading failure, and rollback thresholds.
- **FR-010**: The plan MUST define a staged validation workflow: account setup,
  domain approval, non-production placement test, consent/legal review,
  performance check, limited production rollout, and post-launch monitoring.
- **FR-011**: The plan MUST include a quickstart checklist a future implementer
  can follow without rereading the full research notes.
- **FR-012**: The plan MUST produce a canonical planning artifact that future
  specs can reference before adding Adsterra code, configuration, or analytics.

### Monetization, Growth & Compliance Requirements _(mandatory when affected)_

- **MG-001**: The feature MUST state that it affects advertising surfaces, SEO
  pages, third-party scripts, analytics, legal/privacy surfaces, performance,
  and the free shortening flow.
- **MG-002**: The feature MUST preserve blocked ad routes for APIs, private,
  legal, checkout, preview, redirect, and user short-code experiences.
- **MG-003**: Public Adsterra-eligible content MUST define target search intent,
  sitemap behavior, canonical URL, product connection, and user action.
- **MG-004**: Third-party Adsterra scripts MUST be planned with LGPD/privacy
  impact, consent behavior, data minimization, and user-facing disclosure.
- **MG-005**: Redirect and free link creation performance MUST remain protected;
  public monetized pages MUST reserve ad space and avoid meaningful layout
  shift.

### Key Entities _(include if feature involves data)_

- **Adsterra Onboarding Gate**: A documented checkpoint for publisher signup,
  email verification, website submission, moderation status, code retrieval, and
  launch readiness.
- **Adsterra Surface Policy**: The classification of URLEncurta routes and
  content types by ad eligibility and risk.
- **Adsterra Ad Format Decision**: A record of which format is allowed,
  forbidden, or review-required for a surface based on intrusiveness, UX risk,
  and implementation constraints.
- **Compliance Evidence**: The privacy, consent, disclosure, and legal review
  evidence required before running Adsterra scripts.
- **Performance Evidence**: Measurements proving Adsterra does not damage link
  creation, redirect speed, LCP, CLS, or content readability.
- **Launch Decision**: A go, revise, pause, or reject outcome for a proposed
  Adsterra placement.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of proposed Adsterra placements can be classified as allowed,
  forbidden, or review-required using the plan.
- **SC-002**: 100% of Adsterra implementation tasks can identify the required
  onboarding gate they depend on before code changes begin.
- **SC-003**: The plan identifies at least 8 forbidden surfaces and at least 5
  eligibility requirements for any allowed public content page.
- **SC-004**: The plan defines at least 8 launch-readiness checks covering
  account approval, consent, legal disclosure, route eligibility, format
  intrusiveness, performance, monitoring, and rollback.
- **SC-005**: Stakeholders can review a new Adsterra page proposal in under 15
  minutes and produce a go, revise, pause, or reject decision.
- **SC-006**: No planned Adsterra surface conflicts with the constitution's
  blocked ad areas or the no-signup free shortening promise.
- **SC-007**: The specification is ready for planning without unresolved
  clarification markers.

## Assumptions

- This feature started as documentation-only planning and evolved to include runtime implementation.
- The current constitution names Adsterra as the advertising layer; this plan
  treats Adsterra as the primary ad network following the protective gates.
- URLEncurta's core free shortening flow, redirect path, and private account
  surfaces remain unchanged.
- The first Adsterra implementation prefers conservative content-page
  placements over aggressive overlays or direct-link monetization.
- Real Adsterra publisher IDs, scripts, and approved formats were obtained
  from the Adsterra account after domain approval and configured in environment variables.

# Tasks: AdSense Business Plan

**Input**: Design documents from `/specs/001-adsense-business-plan/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No automated tests requested. Validation is handled through document review, checklist completion, and the quickstart decision drill.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Feature docs**: `specs/001-adsense-business-plan/`
- **Canonical output**: `specs/001-adsense-business-plan/business-plan.md`
- **Validation output**: `specs/001-adsense-business-plan/validation-report.md`
- **Existing source context**: `app/`, `components/`, `public/`, `DIRETRIZ.md`, `PLANO_LGPD.md`

## Phase 1: Setup (Shared Documentation Structure)

**Purpose**: Prepare the business-plan artifact and evidence files.

- [X] T001 Create `specs/001-adsense-business-plan/business-plan.md` with the 13 required sections from `specs/001-adsense-business-plan/contracts/business-plan-contract.md`
- [X] T002 Create `specs/001-adsense-business-plan/validation-report.md` with sections for constitution gates, surface matrix review, roadmap review, compliance review, metrics review, and decision drill
- [X] T003 Extract current public, private, legal, checkout, preview, API, redirect, and user short-code surfaces from `app/` into `specs/001-adsense-business-plan/validation-report.md`
- [X] T004 Extract current AdSense behavior and allowed route categories from `components/Adsense.tsx` into `specs/001-adsense-business-plan/validation-report.md`
- [X] T005 Extract existing privacy, terms, cookie, and LGPD references from `app/privacidade/page.tsx`, `app/termos/page.tsx`, and `PLANO_LGPD.md` into `specs/001-adsense-business-plan/validation-report.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared evidence needed before any user story can be completed.

**CRITICAL**: No user story work can be finalized until this phase is complete.

- [X] T006 Define the free product promise and protected no-signup shortening principles in `specs/001-adsense-business-plan/business-plan.md`
- [X] T007 Define revenue layers for AdSense and Premium, including their separate business roles, in `specs/001-adsense-business-plan/business-plan.md`
- [X] T008 Create the monetization surface matrix table in `specs/001-adsense-business-plan/business-plan.md`
- [X] T009 Create the metrics baseline table with at least 8 metric slots in `specs/001-adsense-business-plan/business-plan.md`
- [X] T010 Validate AdSense route eligibility and blocked surfaces against `.specify/memory/constitution.md` in `specs/001-adsense-business-plan/validation-report.md`
- [X] T011 Validate LGPD/privacy, consent, third-party scripts, and abuse-prevention impacts against `.specify/memory/constitution.md` in `specs/001-adsense-business-plan/validation-report.md`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Define monetization strategy (Priority: P1) MVP

**Goal**: Produce a business-readable monetization strategy that classifies ad surfaces, protects the free product, and defines decision rules.

**Independent Test**: A stakeholder can read `business-plan.md` and identify the free product promise, AdSense model, Premium role, allowed ad surfaces, forbidden ad surfaces, and success metrics.

### Implementation for User Story 1

- [X] T012 [US1] Complete the executive summary in `specs/001-adsense-business-plan/business-plan.md`
- [X] T013 [US1] Complete the free product promise section in `specs/001-adsense-business-plan/business-plan.md`
- [X] T014 [US1] Complete the revenue model section covering AdSense and Premium in `specs/001-adsense-business-plan/business-plan.md`
- [X] T015 [US1] Populate allowed AdSense surfaces in the monetization surface matrix in `specs/001-adsense-business-plan/business-plan.md`
- [X] T016 [US1] Populate forbidden AdSense surfaces in the monetization surface matrix in `specs/001-adsense-business-plan/business-plan.md`
- [X] T017 [US1] Populate review-required AdSense surfaces in the monetization surface matrix in `specs/001-adsense-business-plan/business-plan.md`
- [X] T018 [US1] Complete the Premium complement strategy section in `specs/001-adsense-business-plan/business-plan.md`
- [X] T019 [US1] Complete the decision workflow section with go, revise, and reject outcomes in `specs/001-adsense-business-plan/business-plan.md`
- [X] T020 [US1] Document pause, revise, and reject rules for harmful ad placements in `specs/001-adsense-business-plan/business-plan.md`
- [X] T021 [US1] Validate User Story 1 acceptance scenarios in `specs/001-adsense-business-plan/validation-report.md`

**Checkpoint**: Monetization strategy is complete and independently reviewable.

---

## Phase 4: User Story 2 - Plan organic traffic growth (Priority: P2)

**Goal**: Produce a practical organic growth roadmap with content clusters, sharing loops, and measurable opportunities.

**Independent Test**: A planner can choose at least three content or sharing loops from `business-plan.md` and explain the target audience, search intent, product connection, user action, and success metric.

### Implementation for User Story 2

- [X] T022 [US2] Draft the URL shortening and campaign naming content cluster in `specs/001-adsense-business-plan/business-plan.md`
- [X] T023 [US2] Draft the WhatsApp and messaging content cluster in `specs/001-adsense-business-plan/business-plan.md`
- [X] T024 [US2] Draft the QR Code and printed material content cluster in `specs/001-adsense-business-plan/business-plan.md`
- [X] T025 [US2] Draft the link safety and trust content cluster in `specs/001-adsense-business-plan/business-plan.md`
- [X] T026 [US2] Draft the bio links and social profile content cluster in `specs/001-adsense-business-plan/business-plan.md`
- [X] T027 [US2] Consolidate at least 10 content opportunities into the organic growth and content roadmap in `specs/001-adsense-business-plan/business-plan.md`
- [X] T028 [US2] Define growth loops for free link creation, link sharing, QR Code scanning, messaging templates, bio pages, and returning history users in `specs/001-adsense-business-plan/business-plan.md`
- [X] T029 [US2] Add one desired user action and one success metric to every content opportunity in `specs/001-adsense-business-plan/business-plan.md`
- [X] T030 [US2] Validate User Story 2 acceptance scenarios in `specs/001-adsense-business-plan/validation-report.md`

**Checkpoint**: Organic growth roadmap is complete and independently reviewable.

---

## Phase 5: User Story 3 - Govern compliance and trust (Priority: P3)

**Goal**: Produce guardrails for privacy, trust, AdSense policy risk, invalid traffic, legal disclosures, unsafe destinations, and performance protection.

**Independent Test**: An operator can review any affected page or product flow and confirm whether it preserves privacy disclosures, avoids intrusive ads, and does not mislead users about link destinations or sponsored content.

### Implementation for User Story 3

- [X] T031 [US3] Complete the compliance, trust, and LGPD guardrails section in `specs/001-adsense-business-plan/business-plan.md`
- [X] T032 [US3] Complete the performance and user experience guardrails section in `specs/001-adsense-business-plan/business-plan.md`
- [X] T033 [US3] Document Google AdSense policy, invalid traffic, accidental click, and Better Ads risks in `specs/001-adsense-business-plan/business-plan.md`
- [X] T034 [US3] Document destination clarity, unsafe-link, abuse, and domain reputation risks in `specs/001-adsense-business-plan/business-plan.md`
- [X] T035 [US3] Document privacy, cookie, analytics, advertising, Stripe, and lead-capture disclosure expectations in `specs/001-adsense-business-plan/business-plan.md`
- [X] T036 [US3] Add legal/privacy update triggers to the risks and pause rules section in `specs/001-adsense-business-plan/business-plan.md`
- [X] T037 [US3] Validate User Story 3 acceptance scenarios in `specs/001-adsense-business-plan/validation-report.md`

**Checkpoint**: Compliance and trust guardrails are complete and independently reviewable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across the complete business-plan package.

- [X] T038 Verify `specs/001-adsense-business-plan/business-plan.md` includes all required sections from `specs/001-adsense-business-plan/contracts/business-plan-contract.md`
- [X] T039 Verify the monetization surface matrix includes user intent, ad status, business role, policy risk, privacy/trust note, performance note, and decision owner in `specs/001-adsense-business-plan/business-plan.md`
- [X] T040 Verify at least 10 eligible or review-qualified content opportunities are documented in `specs/001-adsense-business-plan/business-plan.md`
- [X] T041 Verify at least 8 metrics include business question, baseline source, review cadence, and decision threshold in `specs/001-adsense-business-plan/business-plan.md`
- [X] T042 Verify no forbidden route category is marked ad-eligible in `specs/001-adsense-business-plan/business-plan.md`
- [X] T043 Verify sitemap, robots, canonical metadata, and indexability considerations are covered for public monetizable pages in `specs/001-adsense-business-plan/business-plan.md`
- [X] T044 Verify AdSense slots use approved production IDs or remain disabled/placeholders outside production in `specs/001-adsense-business-plan/validation-report.md`
- [X] T045 Verify redirect hot path, LCP, CLS, and layout stability guardrails after ads, tracking, or content changes in `specs/001-adsense-business-plan/validation-report.md`
- [X] T046 Run the quickstart decision drill from `specs/001-adsense-business-plan/quickstart.md` and record the go, revise, or reject result in `specs/001-adsense-business-plan/validation-report.md`
- [X] T047 Update `specs/001-adsense-business-plan/checklists/requirements.md` if the final business plan changes assumptions or scope

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion - MVP scope
- **User Story 2 (Phase 4)**: Depends on Foundational completion and can run after or alongside US1 if separate editors avoid conflicts in `business-plan.md`
- **User Story 3 (Phase 5)**: Depends on Foundational completion and can run after or alongside US1/US2 if separate editors avoid conflicts in `business-plan.md`
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: First recommended story because it defines the monetization decision system
- **User Story 2 (P2)**: Can be drafted independently after foundational tables exist, but final roadmap should use US1 surface rules
- **User Story 3 (P3)**: Can be drafted independently after foundational evidence exists, but final guardrails should review US1 and US2 outputs

### Within Each User Story

- Complete section drafts before validation tasks
- Validate each story in `validation-report.md` before moving to polish
- Keep `business-plan.md` as the canonical output and `validation-report.md` as supporting evidence

### Parallel Opportunities

- Research for T003, T004, and T005 can be gathered in parallel, but final writes to `validation-report.md` must be sequential
- Research for T022, T023, T024, T025, and T026 can be gathered in parallel, but final writes to `business-plan.md` must be sequential
- US2 and US3 can run in parallel only if contributors coordinate non-overlapping sections of `business-plan.md`

---

## Parallel Example: User Story 2

```bash
Task: "Research URL shortening and campaign naming content cluster inputs"
Task: "Research WhatsApp and messaging content cluster inputs"
Task: "Research QR Code and printed material content cluster inputs"
Task: "Research link safety and trust content cluster inputs"
Task: "Research bio links and social profile content cluster inputs"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational evidence
3. Complete Phase 3: User Story 1
4. Stop and validate that the monetization strategy can classify future proposals

### Incremental Delivery

1. Add User Story 1 to define monetization strategy
2. Add User Story 2 to define organic growth roadmap
3. Add User Story 3 to define compliance and trust guardrails
4. Complete Phase 6 to validate the whole package through the quickstart

### Parallel Team Strategy

With multiple contributors:

1. One contributor extracts route and ad evidence into `validation-report.md`
2. One contributor drafts content clusters for US2
3. One contributor drafts compliance and trust sections for US3
4. One editor consolidates `business-plan.md` and resolves section conflicts

## Notes

- Every task references an exact file path.
- Tasks are documentation-first and do not change runtime product behavior.
- `business-plan.md` is intentionally not created by earlier planning phases; it is the implementation artifact for this feature.
- Run `/speckit-analyze` after this file exists to check cross-artifact consistency.

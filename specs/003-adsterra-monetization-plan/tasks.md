# Tasks: Adsterra Monetization Plan

**Input**: Design documents from `/specs/003-adsterra-monetization-plan/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No automated tests are requested for this documentation-only feature.
Validation is handled through checklist, contract, quickstart, and validation
report tasks.

**Organization**: Tasks are grouped by user story so each planning increment can
be completed and reviewed independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it edits a different file or depends only
  on completed foundational work
- **[Story]**: Maps task to a user story from `spec.md`
- Every task includes an exact file path

## Phase 1: Setup (Shared Documentation Structure)

**Purpose**: Confirm the feature workspace and document sources before story
work begins.

- [ ] T001 Confirm the active feature directory and Spec Kit pointer in `.specify/feature.json`
- [ ] T002 Confirm the current agent plan reference points to the Adsterra plan in `AGENTS.md`
- [ ] T003 [P] Create or verify the Adsterra feature artifact inventory in `specs/003-adsterra-monetization-plan/validation-report.md`
- [ ] T004 [P] Record the official Adsterra source URLs and scope boundaries in `specs/003-adsterra-monetization-plan/research.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared decisions, terminology, entities, and gates that
all user stories rely on.

**Critical**: No user story work should begin until this phase is complete.

- [ ] T005 Extract the documentation-only scope and no-runtime-change constraint in `specs/003-adsterra-monetization-plan/plan.md`
- [ ] T006 [P] Define the shared Adsterra decision entities in `specs/003-adsterra-monetization-plan/data-model.md`
- [ ] T007 [P] Define the reusable launch decision record schema in `specs/003-adsterra-monetization-plan/contracts/adsterra-monetization-contract.md`
- [ ] T008 Document the constitution compatibility note for Adsterra versus the current AdSense-oriented rules in `specs/003-adsterra-monetization-plan/plan.md`
- [ ] T009 Validate the setup and foundational artifacts against the requirements checklist in `specs/003-adsterra-monetization-plan/checklists/requirements.md`

**Checkpoint**: Foundation ready. User story work can now begin.

---

## Phase 3: User Story 1 - Define Adsterra onboarding plan (Priority: P1) MVP

**Goal**: Document the Adsterra publisher onboarding path and approval gates so
future implementation work cannot add scripts before account, website, and code
readiness are proven.

**Independent Test**: A stakeholder can read the generated docs and identify the
sequence from publisher signup through website approval, ad code retrieval, and
internal launch review.

### Implementation for User Story 1

- [ ] T010 [US1] Write the Adsterra onboarding sequence and production script prohibition in `specs/003-adsterra-monetization-plan/adsterra-monetization-plan.md`
- [ ] T011 [P] [US1] Capture Adsterra onboarding research decisions and alternatives in `specs/003-adsterra-monetization-plan/research.md`
- [ ] T012 [P] [US1] Define the Adsterra Onboarding Gate entity and validation rules in `specs/003-adsterra-monetization-plan/data-model.md`
- [ ] T013 [US1] Add onboarding readiness fields and acceptance rules to `specs/003-adsterra-monetization-plan/contracts/adsterra-monetization-contract.md`
- [ ] T014 [P] [US1] Add the external setup checklist for account, email, website, approval, and code retrieval in `specs/003-adsterra-monetization-plan/quickstart.md`
- [ ] T015 [US1] Validate User Story 1 acceptance scenarios and success criteria in `specs/003-adsterra-monetization-plan/validation-report.md`

**Checkpoint**: User Story 1 is complete and independently reviewable as the MVP.

---

## Phase 4: User Story 2 - Classify Adsterra ad surfaces (Priority: P2)

**Goal**: Provide a route and format classification system that allows,
forbids, or requires review for Adsterra placements without damaging the free
shortener, redirects, private flows, or legal pages.

**Independent Test**: A planner can evaluate any existing or proposed page and
classify it as allowed, forbidden, or review-required for Adsterra.

### Implementation for User Story 2

- [ ] T016 [US2] Write allowed, forbidden, and review-required surface policy sections in `specs/003-adsterra-monetization-plan/adsterra-monetization-plan.md`
- [ ] T017 [P] [US2] Record the content-page-first placement decision and rejected alternatives in `specs/003-adsterra-monetization-plan/research.md`
- [ ] T018 [P] [US2] Define the Adsterra Surface Policy entity and validation rules in `specs/003-adsterra-monetization-plan/data-model.md`
- [ ] T019 [US2] Add route classification fields and forbidden-route acceptance rules to `specs/003-adsterra-monetization-plan/contracts/adsterra-monetization-contract.md`
- [ ] T020 [P] [US2] Add surface classification steps for allowed, forbidden, and review-required pages in `specs/003-adsterra-monetization-plan/quickstart.md`
- [ ] T021 [US2] Validate the surface policy covers at least 8 forbidden surfaces and 5 eligibility requirements in `specs/003-adsterra-monetization-plan/validation-report.md`

**Checkpoint**: User Story 2 is complete and can classify Adsterra placements
independently of User Story 3.

---

## Phase 5: User Story 3 - Govern consent, trust, and performance (Priority: P3)

**Goal**: Define compliance, trust, performance, monitoring, and rollback rules
for any future Adsterra implementation.

**Independent Test**: An operator can review a proposed Adsterra placement and
confirm privacy disclosure, consent behavior, ad labeling, performance budgets,
monitoring, and rejection rules before launch.

### Implementation for User Story 3

- [ ] T022 [US3] Write compliance requirements, performance requirements, rollout workflow, and rejection rules in `specs/003-adsterra-monetization-plan/adsterra-monetization-plan.md`
- [ ] T023 [P] [US3] Record LGPD disclosure, consent, AdSense coexistence, and performance-gate decisions in `specs/003-adsterra-monetization-plan/research.md`
- [ ] T024 [P] [US3] Define Compliance Evidence, Performance Evidence, and Launch Decision entities in `specs/003-adsterra-monetization-plan/data-model.md`
- [ ] T025 [US3] Add compliance, performance, rollback, and AdSense coexistence acceptance rules to `specs/003-adsterra-monetization-plan/contracts/adsterra-monetization-contract.md`
- [ ] T026 [P] [US3] Add compliance readiness, performance readiness, and final decision steps in `specs/003-adsterra-monetization-plan/quickstart.md`
- [ ] T027 [US3] Validate the launch-readiness checks and constitution gates in `specs/003-adsterra-monetization-plan/validation-report.md`

**Checkpoint**: User Story 3 is complete and can govern future launch decisions.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and consistency across the generated planning
package.

- [ ] T028 [P] Review all cross-document links and relative paths in `specs/003-adsterra-monetization-plan/quickstart.md`
- [ ] T029 [P] Review the task-independent success criteria mapping in `specs/003-adsterra-monetization-plan/spec.md`
- [ ] T030 Ensure the canonical plan, contract, quickstart, and validation report agree on go, revise, pause, and reject outcomes in `specs/003-adsterra-monetization-plan/adsterra-monetization-plan.md`
- [ ] T031 Run a final no-clarification-marker review across `specs/003-adsterra-monetization-plan/spec.md`
- [ ] T032 Update the final generated artifact list and readiness result in `specs/003-adsterra-monetization-plan/validation-report.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; recommended MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational; can run after or beside US1.
- **User Story 3 (Phase 5)**: Depends on Foundational; can run after or beside US1/US2.
- **Polish (Phase 6)**: Depends on all selected user stories.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories after Foundational.
- **User Story 2 (P2)**: No dependency on US1 after Foundational, but benefits
  from the onboarding gate terminology.
- **User Story 3 (P3)**: No dependency on US2 after Foundational, but should be
  reconciled with the same surface classifications during polish.

### Parallel Opportunities

- T003 and T004 can run in parallel during Setup.
- T006 and T007 can run in parallel during Foundational.
- T011, T012, and T014 can run in parallel for US1 after T010 is understood.
- T017, T018, and T020 can run in parallel for US2 after T016 is understood.
- T023, T024, and T026 can run in parallel for US3 after T022 is understood.
- T028 and T029 can run in parallel during Polish.

---

## Parallel Example: User Story 1

```bash
Task: "Capture Adsterra onboarding research decisions and alternatives in specs/003-adsterra-monetization-plan/research.md"
Task: "Define the Adsterra Onboarding Gate entity and validation rules in specs/003-adsterra-monetization-plan/data-model.md"
Task: "Add the external setup checklist for account, email, website, approval, and code retrieval in specs/003-adsterra-monetization-plan/quickstart.md"
```

## Parallel Example: User Story 2

```bash
Task: "Record the content-page-first placement decision and rejected alternatives in specs/003-adsterra-monetization-plan/research.md"
Task: "Define the Adsterra Surface Policy entity and validation rules in specs/003-adsterra-monetization-plan/data-model.md"
Task: "Add surface classification steps for allowed, forbidden, and review-required pages in specs/003-adsterra-monetization-plan/quickstart.md"
```

## Parallel Example: User Story 3

```bash
Task: "Record LGPD disclosure, consent, AdSense coexistence, and performance-gate decisions in specs/003-adsterra-monetization-plan/research.md"
Task: "Define Compliance Evidence, Performance Evidence, and Launch Decision entities in specs/003-adsterra-monetization-plan/data-model.md"
Task: "Add compliance readiness, performance readiness, and final decision steps in specs/003-adsterra-monetization-plan/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate that onboarding gates prevent production Adsterra scripts
   before account, website, approval, and code readiness exist.

### Incremental Delivery

1. Deliver US1 to make Adsterra onboarding safe and auditable.
2. Deliver US2 to classify allowed, forbidden, and review-required surfaces.
3. Deliver US3 to add consent, trust, performance, monitoring, and rollback
   governance.
4. Run Polish to reconcile all artifacts before future implementation planning.

### Parallel Team Strategy

After Setup and Foundational are complete, separate contributors can work on
US1, US2, and US3 because each story has different validation focus and most
parallel tasks touch different files.

## Notes

- This task list is documentation-first by design; it does not authorize adding
  Adsterra scripts to production.
- Future code implementation requires approved Adsterra account/domain evidence
  and a separate implementation spec.
- Keep task checkboxes unchecked until the corresponding work is deliberately
  reviewed or executed.

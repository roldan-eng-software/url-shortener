# Data Model: Adsterra Monetization Plan

This planning feature is documentation-only. The entities below define decision
records and review evidence that future implementation specs must preserve.

## Entity: Adsterra Onboarding Gate

**Purpose**: Tracks the external account and approval steps required before any
production Adsterra code can be added.

**Fields**:

- `gate_name`: Signup, email verification, website addition, moderation,
  format selection, code retrieval, internal launch review.
- `status`: Not started, pending, approved, blocked, rejected, superseded.
- `evidence`: Link, screenshot reference, account note, or internal ticket
  proving the gate status.
- `owner`: Person responsible for the gate.
- `review_date`: Date the evidence was last reviewed.
- `blocked_reason`: Required when status is blocked or rejected.

**Validation Rules**:

- Production implementation cannot begin unless signup, email verification,
  website approval, and real code retrieval are approved.
- Placeholder scripts are not valid evidence.
- Rejected or pending domain status blocks launch.

## Entity: Adsterra Surface Policy

**Purpose**: Classifies where Adsterra may appear.

**Fields**:

- `surface`: Route, route group, page type, or content template.
- `classification`: Allowed, forbidden, review-required.
- `user_intent`: Create link, read guide, manage account, redirect, checkout,
  legal review, preview, support, or other.
- `rationale`: Why the classification protects monetization, trust, and product
  use.
- `required_evidence`: Compliance, performance, content, consent, or approval
  evidence needed before launch.

**Validation Rules**:

- APIs, dashboard, login, register, checkout, legal pages, preview pages,
  redirects, short-code routes, and private user screens are always forbidden.
- Public content pages may be allowed only when they are original, useful,
  indexable, product-relevant, consent-covered, and performance-tested.
- Ambiguous surfaces default to review-required.

## Entity: Adsterra Ad Format Decision

**Purpose**: Records the risk posture for each Adsterra format.

**Fields**:

- `format_name`: Display, native-like placement, Social Bar, interstitial,
  direct link, Smartlink, or account-specific format name.
- `risk_level`: Low, medium, high, prohibited.
- `eligible_surfaces`: Surface classes where the format may be considered.
- `ux_risk`: Risk of confusion, overlay, interruption, ad density, or UI
  mimicry.
- `performance_risk`: Script weight, layout shift, load delay, or failure mode.
- `decision`: Allowed, review-required, forbidden.

**Validation Rules**:

- Direct-link or Smartlink usage is forbidden for short-code redirects in this
  planning cycle.
- Overlay-like, notification-like, or interstitial formats require manual review
  even on otherwise eligible pages.
- No format is globally approved solely because Adsterra approved the domain.

## Entity: Compliance Evidence

**Purpose**: Documents privacy, consent, and disclosure readiness.

**Fields**:

- `third_party`: Adsterra.
- `privacy_disclosure`: Page or document section naming the partner.
- `consent_behavior`: How cookies/tracking/ad scripts are handled before and
  after consent.
- `data_minimization`: What data is not collected or shared by URLEncurta beyond
  necessary operation and monetization.
- `ad_labeling`: How users can distinguish advertising from product UI.
- `reviewer`: Person responsible for compliance approval.

**Validation Rules**:

- Adsterra cannot launch until privacy and consent disclosures are approved.
- Ads must not mimic core product controls or hidden destination information.
- Legal pages themselves must remain ad-free.

## Entity: Performance Evidence

**Purpose**: Confirms that monetization does not damage core product metrics.

**Fields**:

- `surface`: Page or route group measured.
- `baseline_metric`: Pre-Adsterra measurement.
- `post_change_metric`: Measurement after test or rollout.
- `threshold`: Required limit or no-regression target.
- `result`: Pass, fail, inconclusive.
- `rollback_required`: Boolean decision.

**Validation Rules**:

- Redirect p95 must remain protected and Adsterra must not load on redirect
  routes.
- Content pages must reserve stable space for display ads when applicable.
- A failed performance result blocks rollout until revised.

## Entity: Launch Decision

**Purpose**: Captures the final review outcome for a placement.

**Fields**:

- `proposal`: Surface plus format being reviewed.
- `decision`: Go, revise, pause, reject.
- `reason`: Summary of evidence and tradeoffs.
- `conditions`: Required changes before launch or continuation.
- `monitoring_window`: Period for post-launch checks.
- `rollback_trigger`: Metric or incident that reverses the launch.

**Validation Rules**:

- Every go decision must reference onboarding, surface, format, compliance, and
  performance evidence.
- Any missing evidence changes the decision to revise or pause.
- Trust, free-flow, or redirect regressions require pause or reject.

# Data Model: AdSense Business Plan

## Business Plan

Represents the canonical planning document for monetization and organic growth.

Fields:

- `title`: Human-readable plan title.
- `version`: Plan version or date label.
- `owner`: Responsible product/business owner.
- `free_product_promise`: Statement of the protected free user value.
- `revenue_layers`: Ordered list of revenue sources and their role.
- `decision_workflow`: Steps for reviewing future monetization ideas.
- `success_metrics`: Business, trust, and performance metrics.

Validation rules:

- Must reference the constitution.
- Must classify AdSense and Premium as separate revenue layers.
- Must include a go, revise, or reject decision workflow.
- Must include at least 8 success metrics.

## Monetization Surface

Represents a route, page type, or product experience considered for ads.

Fields:

- `name`: Surface name.
- `surface_type`: Public content, core tool, private account, legal, checkout,
  redirect, preview, API, or review-required.
- `ad_status`: Allowed, forbidden, or review-required.
- `user_intent`: What the visitor is trying to do.
- `business_value`: Traffic, trust, conversion, retention, or revenue purpose.
- `risk_notes`: Trust, policy, privacy, accidental-click, or performance risks.
- `required_evidence`: What must be checked before launch.

Validation rules:

- Redirect, API, private, checkout, legal, preview, and user short-code
  experiences must be forbidden unless a future constitution amendment changes
  the rule.
- Public content surfaces must define search intent and product connection.
- Review-required surfaces must state who approves them and what evidence is
  needed.

## Content Cluster

Represents a group of related public pages designed for qualified organic
traffic.

Fields:

- `cluster_name`: Topic family.
- `target_audience`: Primary user segment.
- `search_intents`: Search needs addressed by the cluster.
- `candidate_pages`: Proposed pages or guide ideas.
- `product_connection`: How the content leads back to shortening, QR Codes,
  sharing, safety, bio links, or Premium.
- `ad_eligibility`: Whether pages are generally ad-eligible or need review.

Validation rules:

- Must connect directly to a URL shortener use case.
- Must avoid thin, clickbait, or unrelated traffic topics.
- Must define at least one user action after reading.

## Growth Loop

Represents a repeatable acquisition or retention behavior.

Fields:

- `loop_name`: Loop identifier.
- `trigger`: What starts the loop.
- `user_action`: What the user does.
- `distribution_mechanism`: How new or returning traffic is created.
- `measurement`: How the loop is evaluated.
- `risk`: What could weaken trust, usability, or compliance.

Validation rules:

- Must be measurable.
- Must not require removing the free product promise.
- Must identify whether it contributes to traffic, sharing, retention, or
  Premium interest.

## Ad Placement Policy

Represents decision rules for ad visibility and placement.

Fields:

- `allowed_surfaces`: Page types where ads are permitted.
- `forbidden_surfaces`: Page types where ads are not permitted.
- `review_required_surfaces`: Page types requiring manual evaluation.
- `placement_rules`: Density, proximity, disclosure, and layout expectations.
- `pause_rules`: Conditions that require disabling or revising placements.

Validation rules:

- Must include invalid traffic and accidental click risk.
- Must include layout stability and readability expectations.
- Must include a pause rule for trust, policy, or performance degradation.

## Compliance Evidence

Represents the proof needed before monetization changes proceed.

Fields:

- `privacy_review`: Impact on data collection and consent.
- `third_parties`: Google AdSense, analytics, payment, lead capture, or other
  services involved.
- `legal_pages`: Disclosures that need review or update.
- `trust_review`: Destination clarity, unsafe-link risk, and domain reputation.
- `policy_review`: AdSense policy and content-suitability checks.

Validation rules:

- Must be completed before an ad surface changes from review-required to
  allowed.
- Must identify whether legal/privacy pages need updates.
- Must document policy risk even when the final decision is no change.

## Business Metric Baseline

Represents the measurable starting point for future comparison.

Fields:

- `free_link_creations`: Volume of free shortening actions.
- `creation_completion_rate`: Share of users who finish the core task.
- `public_page_views`: Views for informational and editorial pages.
- `ad_eligible_page_share`: Share of public views on ad-eligible pages.
- `sharing_actions`: Copy, QR Code, WhatsApp, bio link, or template usage.
- `premium_interest`: Premium clicks, lead captures, trial starts, or sales
  contact actions.
- `trust_signals`: Error rates, policy issues, unsafe-link reports, or support
  concerns.
- `performance_signals`: Redirect speed, page loading, and layout stability.

Validation rules:

- Must include a measurement owner or review cadence in the final business plan.
- Must be captured before major ad placement or content roadmap changes.
- Must support comparison before and after future implementation work.

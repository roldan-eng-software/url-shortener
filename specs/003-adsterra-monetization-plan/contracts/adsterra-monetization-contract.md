# Contract: Adsterra Monetization Decision

Future Adsterra implementation specs must produce a decision record that
satisfies this contract before adding scripts, ad units, route logic, analytics,
or configuration.

## Decision Record

```yaml
proposal_id: string
surface:
  route_or_page_type: string
  user_intent: string
  classification: allowed | forbidden | review-required
  rationale: string
adsterra:
  account_ready: true | false
  email_verified: true | false
  website_status: not-started | pending | approved | rejected | blocked
  ad_code_source: none | publisher-email | publisher-dashboard
  format_name: string
  format_decision: allowed | review-required | forbidden
  format_risk: low | medium | high | prohibited
policy:
  adsense_coexistence: none | replaced | combined-reviewed
  forbidden_route_check: pass | fail
  content_quality_check: pass | fail | not-applicable
  direct_link_or_smartlink_used: true | false
compliance:
  privacy_updated: true | false
  consent_reviewed: true | false
  ad_disclosure_ready: true | false
  data_minimization_reviewed: true | false
performance:
  redirect_p95_protected: true | false
  lcp_budget_defined: true | false
  cls_budget_defined: true | false
  script_failure_handled: true | false
  rollback_threshold_defined: true | false
decision:
  outcome: go | revise | pause | reject
  owner: string
  date: YYYY-MM-DD
  conditions: string
```

## Acceptance Rules

- `decision.outcome` MUST NOT be `go` unless `website_status` is `approved`.
- `decision.outcome` MUST NOT be `go` if `surface.classification` is
  `forbidden`.
- `decision.outcome` MUST NOT be `go` if `forbidden_route_check` is `fail`.
- `decision.outcome` MUST NOT be `go` when direct-link or Smartlink is proposed
  for short-code redirects.
- `decision.outcome` MUST NOT be `go` unless privacy, consent, ad disclosure,
  data minimization, redirect protection, LCP, CLS, script failure, and rollback
  checks are complete.
- `adsense_coexistence` MUST be `combined-reviewed` before any page loads both
  AdSense and Adsterra.
- Missing evidence MUST produce `revise` or `pause`, not `go`.

## Review Questions

1. Is this page public, original, useful, indexable, and connected to URL
   shortening, QR Codes, WhatsApp, campaigns, safety, or bio links?
2. Does the selected Adsterra format look or behave like product UI,
   notification UI, an overlay, or a redirect step?
3. Does the page have an explicit consent and privacy path for Adsterra?
4. Can the ad placement be visually separated from the primary product action?
5. What metric triggers rollback if revenue improves but product trust or speed
   declines?

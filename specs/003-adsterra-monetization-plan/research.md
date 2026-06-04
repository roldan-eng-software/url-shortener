# Research: Adsterra Monetization Plan

## Sources Reviewed

- Adsterra Publishers Help Center, "Getting Started with Adsterra":
  https://help-publishers.adsterra.com/en/collections/2270069-getting-started-with-adsterra
- Adsterra official guide, "Adsterra Publisher Requirements Dashboard 2026":
  https://adsterra.com/blog/set-up-publishers-dashboard/
- Adsterra official guide, "Social Bar Monetization Guide":
  https://adsterra.com/blog/publishers-guide-to-social-bar/

## Decision: Follow Adsterra onboarding as gated prerequisites

Adsterra onboarding must be represented as approval gates: publisher signup,
email verification, website addition, ad format selection, pending/approved
moderation status, code retrieval from email or account, internal review, and
controlled launch.

**Rationale**: The official getting-started collection is organized around
publisher signup, account navigation, adding a website, using Adsterra without a
website, managing websites, account information, sessions, referrals, and
customer care. Adsterra's own current publisher guide describes adding a domain,
choosing ad formats, waiting for pending status to change to approved, and then
copying ad code from the approval email or the publisher account.

**Alternatives considered**:

- Add placeholder scripts immediately: rejected because Adsterra codes are
  account/domain/format-specific and the project should not run unapproved
  production scripts.
- Treat Adsterra as a generic banner network: rejected because Adsterra supports
  multiple formats, including direct-link and overlay-like formats that require
  product-specific risk review.

## Decision: Prefer content-page display placements for first implementation

The first future implementation should start with conservative placements on
public editorial pages, guides, tools landing pages, or content clusters that
already meet SEO, trust, and product-relevance requirements.

**Rationale**: URLEncurta's constitution protects the free shortening path and
forbids ad interference on sensitive routes. Adsterra supports website ad codes
after adding a domain and selecting ad formats. The safest product fit is a
content-led placement model similar to the existing AdSense surface policy.

**Alternatives considered**:

- Use Adsterra Direct Link or Smartlink in short-code redirects: rejected for
  this plan because it could confuse users, change destination expectations,
  and damage trust in shortened URLs.
- Add overlay-like formats broadly: rejected for first launch because overlays,
  notification-like widgets, and interstitials can create confusion or layout
  disruption unless reviewed route-by-route.

## Decision: Treat Adsterra format selection as a risk decision

Adsterra ad formats must be classified by intrusiveness before implementation:
standard content/display placements are preferred, Social Bar or notification-
like formats require manual UX/trust review, interstitial or overlay-like
formats require stricter approval, and direct-link/Smartlink is forbidden for
short-code redirects in this planning cycle.

**Rationale**: Adsterra's Social Bar guide says publishers create scripts after
adding a website and selecting the format, and that the script is usually placed
near the closing body tag. That same guide describes Social Bar as containing
interactive notification, widget, and interstitial-like variants. Those can be
commercially useful, but the product must evaluate user confusion, consent, and
task interruption before use.

**Alternatives considered**:

- Approve every Adsterra format once the domain is approved: rejected because
  network approval is not equivalent to product, LGPD, performance, or trust
  approval.
- Ban all non-banner formats permanently: deferred because later experiments may
  be valid on specific editorial surfaces with clear labeling and rollback.

## Decision: Keep Adsterra and AdSense mutually reviewed

No page should run Adsterra and AdSense together unless a future implementation
spec explicitly approves the combined stack with policy, performance, and
revenue rationale.

**Rationale**: The constitution is AdSense-oriented and already defines strict
blocked surfaces. Introducing Adsterra changes the ad-network model, third-party
script inventory, consent disclosure, and page-performance profile. A combined
ad stack could also degrade readability and Core Web Vitals.

**Alternatives considered**:

- Replace AdSense globally with Adsterra: rejected because the user requested a
  planning phase, not a monetization migration.
- Allow both networks everywhere on eligible content pages: rejected because
  cumulative script weight and ad density require separate review.

## Decision: Require LGPD and disclosure updates before launch

Adsterra launch readiness must include legal/privacy updates, consent behavior,
cookie/tracking categorization, ad disclosure, and data minimization review.

**Rationale**: The constitution requires transparency about third parties and
tracking. Adding Adsterra changes the list of advertising partners and may
introduce cookies or identifiers controlled by a third party.

**Alternatives considered**:

- Rely only on Adsterra's publisher terms: rejected because the product remains
  responsible for its own user-facing disclosures and consent flow.

## Decision: Performance validation is a launch gate

Any future Adsterra implementation must measure link creation completion, public
page LCP/CLS/TTFB, script failure behavior, and redirect p95 before and after
launch.

**Rationale**: The constitution treats redirects as a critical hot path and
requires monetized pages to avoid layout shift. Adsterra scripts should not load
on redirects, and content pages must reserve stable placement space if display
ads are used.

**Alternatives considered**:

- Accept revenue-positive performance regressions: rejected because the product
  depends on speed, SEO, trust, and repeated free usage.

# Research: AdSense Business Plan

## Decision: Treat free shortening as the primary growth loop

Rationale: The current product already provides a low-friction free URL
shortener with QR Code, local history, public editorial pages, legal pages,
Premium checkout, and dashboard features. The constitution defines this free
flow as the viral acquisition mechanism. The business plan must therefore
protect link creation, copying, QR access, and redirect trust before optimizing
ad revenue.

Alternatives considered:

- Make Premium the main revenue strategy: rejected because it would not satisfy
  the user's requested AdSense-based free viralization model.
- Add ads directly to the core creation flow: rejected because it risks task
  completion, trust, and accidental ad interactions.

## Decision: Monetize only content-led and review-approved surfaces

Rationale: Official Google AdSense guidance requires publishers to follow
program policies, avoid deceptive ad placement, avoid invalid clicks and
impressions, and maintain compliant publisher content. The plan should therefore
classify surfaces before any implementation: eligible, forbidden, and
review-required.

Sources:

- Google AdSense Program policies: https://support.google.com/adsense/answer/48182
- Google Publisher Policies: https://support.google.com/adsense/answer/10502938
- Google invalid traffic guidance: https://support.google.com/adsense/answer/2660562
- Better Ads experience guidance: https://support.google.com/adsense/answer/7514132

Alternatives considered:

- Monetize every public route: rejected because redirect, legal, checkout,
  preview, and user short-code experiences are high-risk or low-context.
- Delay ad policy until implementation: rejected because surface classification
  is a business decision required before future specs.

## Decision: Build SEO around use-case clusters, not generic traffic

Rationale: Existing pages already target use cases such as how the shortener
works, WhatsApp links, QR Code usage, link safety, and best practices. The plan
should extend that pattern with clusters that serve real user intent and lead
back to the product. This protects content quality and prevents thin pages built
only for ad impressions.

Alternatives considered:

- Publish broad technology articles unrelated to shortening: rejected because
  they may attract low-intent traffic and weaken topical authority.
- Focus only on product pages: rejected because AdSense monetization needs
  informational surfaces with enough content and search demand.

## Decision: Define a business metric baseline before changes

Rationale: The plan must make future monetization measurable. Baseline metrics
should cover free link creation, public page views, ad-eligible page share,
sharing actions, Premium interest, task completion, policy risk, and performance
signals. This allows future teams to compare revenue gains against trust and
usage costs.

Alternatives considered:

- Track only AdSense revenue: rejected because revenue alone can hide declines
  in free usage, task completion, or reputation.
- Track only product usage: rejected because the business plan is explicitly
  about monetization and must include ad-eligible traffic and revenue potential.

## Decision: Keep Premium complementary and non-blocking

Rationale: Premium already represents a separate revenue path for custom aliases,
campaign metrics, QR Codes, bio pages, persistent history, and support. The plan
should use Premium as an upgrade path for advanced needs while keeping the free
flow intact for volume, sharing, and AdSense-supported discovery.

Alternatives considered:

- Move QR Codes or basic shortening behind Premium: rejected because these
  features create sharing loops that support the free viral strategy.
- Remove Premium from the plan: rejected because future business decisions must
  understand how AdSense and Premium interact.

## Decision: Use a documentation contract for future planning

Rationale: This phase produces business planning, not runtime behavior. A
document contract is the right interface: it defines the required sections,
surface matrix, content roadmap, metrics, compliance evidence, and decision
workflow that later implementation plans must consume.

Alternatives considered:

- Create an API contract: rejected because no new runtime interface is planned.
- Create only prose without a contract: rejected because future specs need a
  repeatable structure for evaluation.

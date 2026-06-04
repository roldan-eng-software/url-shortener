# Adsterra Monetization Plan

## Purpose

Introduce Adsterra as a planned advertising option for URLEncurta without
changing production behavior yet. This plan is intentionally conservative: it
turns the Adsterra publisher setup flow into product gates, protects the free
shortener, and gives future implementation work a clear decision system.

## Source-Aligned Onboarding Flow

1. Create or access an Adsterra publisher account.
2. Verify the publisher email.
3. Add `urlencurta.com.br` as a website.
4. Select only the ad formats intended for review.
5. Wait for website moderation status to become approved.
6. Retrieve real ad code from the approval email or publisher dashboard.
7. Record approval evidence internally.
8. Run route, format, consent, legal, performance, and trust review.
9. Test in a non-production or limited environment.
10. Launch gradually only after a go decision.

No future implementation may add production Adsterra scripts before steps 1-8
are complete.

## Surface Policy

### Allowed Candidates

Adsterra may be considered on public content-led pages only when all conditions
are met:

- The page is public, original, useful, and indexable.
- The page has clear search intent and canonical ownership.
- The content connects to URL shortening, QR Codes, WhatsApp sharing, campaign
  links, link safety, bio links, or basic measurement.
- The primary action is reading or discovery, not redirecting or completing a
  private transaction.
- Ad space can be reserved without meaningful layout shift.
- Privacy, consent, and ad disclosure are ready.
- The page does not already carry an unreviewed competing ad stack.

### Forbidden Surfaces

Adsterra is forbidden on:

- API routes.
- Dashboard and private user areas.
- Login and registration.
- Checkout, billing, payment, and Premium purchase flows.
- Legal pages, privacy pages, terms pages, and cookie policy pages.
- Preview pages.
- Redirect routes and short-code routes.
- User-created short-link destination flows.
- Any screen where advertising could be confused with the primary action.

### Review-Required Surfaces

Manual review is required for:

- Homepage or pages containing the main free link-creation form.
- Tool pages where users create, copy, download, or share links or QR Codes.
- High-traffic pages with weak product relevance.
- Pages that might run both AdSense and Adsterra.
- Any placement using overlay-like, notification-like, widget-like,
  interstitial, direct-link, or Smartlink behavior.

## Format Policy

| Format Type | Default Decision | Reason |
|-------------|------------------|--------|
| Standard display/content placement | Preferred candidate | Easier to separate from product UI and reserve stable space |
| Native-like content unit | Review-required | Must avoid confusing ads with editorial or product recommendations |
| Social Bar / notification-like widget | Review-required | May resemble UI notifications or interactive product elements |
| Interstitial / overlay-like format | Review-required with high scrutiny | Can interrupt reading or primary actions |
| Direct Link / Smartlink | Forbidden for short-code redirects | Can damage trust in destination expectations |
| Any unknown account-specific format | Review-required | Must be classified before launch |

## AdSense Coexistence Rule

The current constitution is AdSense-oriented. Adsterra must inherit the same
blocked-route policy and must not silently expand ad eligibility. A page may not
run AdSense and Adsterra together unless a future implementation spec documents
why the combined stack is needed, how ad density is controlled, how consent is
handled, and what performance thresholds trigger rollback.

## Compliance Requirements

Before launch, the team must:

- Update privacy documentation to disclose Adsterra as an advertising partner.
- Confirm cookie banner and consent behavior for advertising scripts.
- Document data minimization and third-party tracking expectations.
- Label ad areas clearly enough that ads cannot be mistaken for product UI.
- Keep legal pages ad-free.
- Review unsafe-destination and domain reputation risks.

## Performance Requirements

Before and after any limited launch:

- Confirm Adsterra is absent from redirect routes.
- Preserve redirect p95 below the project target when infrastructure permits.
- Measure public-page LCP, CLS, TTFB, and script failure behavior.
- Reserve layout space where display ads may render.
- Monitor free link creation completion on affected entry pages.
- Roll back placements that harm speed, stability, readability, or trust.

## Rollout Workflow

1. **Prepare**: Complete Adsterra account and website approval gates.
2. **Classify**: Apply the surface and format policy.
3. **Review**: Complete compliance, consent, legal, and performance readiness.
4. **Prototype**: Test only on a non-sensitive public content page.
5. **Limit**: Roll out to a small set of eligible content pages.
6. **Monitor**: Compare revenue, LCP, CLS, TTFB, link creation completion,
   bounce/engagement, script errors, and user complaints.
7. **Decide**: Continue, revise, pause, or reject using the contract.

## Rejection Rules

Reject or pause a placement when:

- Domain approval is missing or uncertain.
- The surface is forbidden.
- The ad format interferes with link creation or redirects.
- The ad resembles a product control or hides destination expectations.
- Privacy or consent disclosure is incomplete.
- LCP, CLS, redirect p95, or link creation completion regresses beyond the
  approved threshold.
- User trust signals or domain reputation risks increase.

## First Recommended Experiment

Start with one public editorial guide connected to a real URL-shortening use
case, such as QR Code sharing, WhatsApp campaign links, or link safety. Use a
conservative placement that does not overlay content, does not run on redirects,
and can be removed quickly. Treat the result as an input to the next Spec Kit
implementation cycle, not as a global monetization rollout.

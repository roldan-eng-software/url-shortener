# Quickstart: Adsterra Monetization Planning

Use this checklist before creating any implementation task for Adsterra.

## 1. Complete External Adsterra Setup

- Create or access the Adsterra publisher account.
- Verify the publisher email.
- Add `urlencurta.com.br` as a website in the publisher account.
- Select only the ad formats intended for review.
- Wait for website status to become approved.
- Retrieve real ad code from the Adsterra approval email or publisher account.
- Record evidence for each onboarding gate.

## 2. Classify the Surface

- Mark the surface as forbidden if it is an API, dashboard, login, register,
  checkout, legal page, preview page, redirect, user short-code route, or
  private user experience.
- Mark the surface as review-required if the user intent is ambiguous, the page
  contains a core product action, or the format behaves like an overlay,
  notification, interstitial, direct link, or Smartlink.
- Consider allowed only when the page is public, original, useful, indexable,
  product-relevant, consent-covered, and performance-testable.

## 3. Review Ad Format Risk

- Prefer conservative content-page placements for the first launch.
- Require manual review for Social Bar, notification-like, widget-like,
  overlay-like, or interstitial formats.
- Forbid direct-link or Smartlink monetization on short-code redirects in this
  planning cycle.
- Do not run AdSense and Adsterra on the same page unless a future spec approves
  the combined stack.

## 4. Complete Compliance Readiness

- Update privacy documentation to name Adsterra as an advertising partner.
- Confirm cookie/consent behavior before scripts load.
- Confirm data minimization and third-party disclosure.
- Keep legal pages ad-free.
- Ensure ads cannot be mistaken for core URL-shortener controls.

## 5. Complete Performance Readiness

- Confirm Adsterra scripts do not load on redirect routes.
- Measure or define baseline LCP, CLS, TTFB, and link creation completion.
- Reserve stable ad space when using display placements.
- Define script failure behavior and rollback thresholds.
- Monitor launch for speed, layout shift, user completion, and trust issues.

## 6. Make the Decision

- Use [contracts/adsterra-monetization-contract.md](./contracts/adsterra-monetization-contract.md).
- Choose one outcome: go, revise, pause, or reject.
- A go decision requires approved domain status, real code, allowed/reviewed
  surface, reviewed format, compliance readiness, performance readiness, and
  rollback conditions.

# Validation Report: AdSense Business Plan

**Feature**: `001-adsense-business-plan`  
**Date**: 2026-05-14  
**Scope**: Evidence and acceptance validation for `business-plan.md`

## Checklist status

| Checklist | Total | Completed | Incomplete | Status |
|-----------|-------|-----------|------------|--------|
| requirements.md | 19 | 19 | 0 | PASS |

## Ignore file verification

| Area | Result | Evidence |
|------|--------|----------|
| Git repository | PASS | `git rev-parse --git-dir` returns `.git` |
| `.gitignore` | PASS | Covers Node/Next, env files, logs, build outputs, coverage and temp files |
| ESLint ignores | PASS | `eslint.config.mjs` uses `globalIgnores` for `node_modules`, `.next`, `out`, `build`, `next-env.d.ts`, `tsconfig.tsbuildinfo`, and testsprite tmp |
| Docker/Prettier/Terraform/Helm ignores | PASS | No Dockerfile, Prettier config, Terraform files, or Helm charts detected |

## Surface inventory

### Public content and tool surfaces

- `/`
- `/como-funciona`
- `/boas-praticas-url-curta`
- `/links-para-whatsapp`
- `/qr-code-para-links`
- `/seguranca-em-links-curtos`
- `/premium`
- `/privacidade`
- `/termos`
- `/[shortCode]`
- `/preview/[shortCode]`

### Private, transactional and API surfaces

- `/dashboard`
- `/dashboard/[new]`
- `/dashboard/bio`
- `/login`
- `/register`
- `/premium/success`
- `/api/*`
- `/api/stripe/*`
- `/api/user/*`
- `/api/auth/*`
- `/api/redirect/[shortCode]`
- `/api/bio/*`

## Current AdSense behavior

Current `components/Adsense.tsx` behavior:

- Disallowed prefixes: `/api`, `/dashboard`, `/login`, `/premium`, `/preview`, `/register`.
- Disallowed paths: `/termos`, `/privacidade`.
- Explicitly monetizable paths: `/como-funciona`, `/boas-praticas-url-curta`, `/links-para-whatsapp`, `/qr-code-para-links`, `/seguranca-em-links-curtos`.
- Single-segment short-code paths are treated as non-monetizable unless they are explicitly listed as monetizable content paths.
- Current slot values are placeholders beginning with `123456`, so production requires real unit IDs or disabled placeholders.

## Legal, privacy and LGPD evidence

Existing sources:

- `app/privacidade/page.tsx` discloses Google AdSense, Google Analytics, cookies, LGPD rights, data retention, international transfer and contact.
- `app/termos/page.tsx` discloses free service, advertising support, prohibited use, link-removal rights and third-party content limits.
- `PLANO_LGPD.md` documents LGPD compatibility assumptions for AdSense, Analytics, cookie banner and legal pages.
- `components/CookieBanner.tsx` is included in the layout and legal pages.

Operational note: future legal copy should be reviewed because existing legal
pages contain mixed-language typos and contact-domain details that may deserve a
dedicated cleanup spec before scaling paid or advertising traffic.

## Constitution gates

| Gate | Status | Evidence |
|------|--------|----------|
| Free Utility Gate | PASS | `business-plan.md` protects no-signup shortening, copy and QR Code as the free promise |
| AdSense Surface Gate | PASS | Surface matrix classifies allowed, forbidden and review-required areas |
| Organic Growth Gate | PASS | Roadmap includes 12 content opportunities and 6 growth loops |
| Trust and LGPD Gate | PASS | Guardrails include privacy, cookies, third parties, unsafe destinations and policy risks |
| Performance Gate | PASS | Guardrails include redirect p95, LCP, CLS, layout stability and creation completion |

## Surface matrix review

| Check | Result |
|-------|--------|
| Allowed surfaces are public/editorial | PASS |
| Forbidden surfaces include API, dashboard, login, register, premium success, preview, redirects and legal pages | PASS |
| Home is review-required rather than automatically monetized | PASS |
| Bio pages are review-required because they mix user content and product value | PASS |
| No forbidden route category is marked ad-eligible | PASS |

## Roadmap review

| Check | Result |
|-------|--------|
| At least 10 content opportunities documented | PASS: 12 opportunities |
| Every opportunity includes audience | PASS |
| Every opportunity includes search intent | PASS |
| Every opportunity includes product connection | PASS |
| Every opportunity includes user action | PASS |
| Every opportunity includes ad eligibility | PASS |
| Every opportunity includes success metric | PASS |

## Compliance review

| Check | Result |
|-------|--------|
| Google AdSense policy risk documented | PASS |
| Invalid traffic and accidental click risk documented | PASS |
| Better Ads/readability risk documented | PASS |
| Privacy, cookies, analytics, advertising, Stripe and lead capture covered | PASS |
| Legal/privacy update triggers defined | PASS |
| Unsafe destination and domain reputation risk documented | PASS |

## Metrics review

| Check | Result |
|-------|--------|
| At least 8 metrics documented | PASS: 9 metrics |
| Business question included | PASS |
| Baseline source or collection approach included | PASS |
| Review cadence included | PASS |
| Decision threshold or expected use included | PASS |

## Performance review

| Check | Result |
|-------|--------|
| Redirect hot path protected | PASS |
| Public page LCP and CLS considered | PASS |
| Ad layout stability considered | PASS |
| Link creation completion protected | PASS |
| Tracking/ad scripts require impact review | PASS |

## User story acceptance validation

### US1 - Define monetization strategy

Result: PASS.

Evidence:

- Free product promise is defined.
- AdSense and Premium revenue layers are separated.
- Allowed, forbidden and review-required surfaces are classified.
- Decision workflow produces `go`, `revise` or `reject`.
- Pause and reject rules are documented.

### US2 - Plan organic traffic growth

Result: PASS.

Evidence:

- Content roadmap includes 12 opportunities.
- Clusters cover URL shortening, WhatsApp, QR Code, link safety, bio links and campaign measurement.
- Growth loops cover free creation, sharing, QR, templates, bio and returning users.
- Each opportunity includes user action and success metric.

### US3 - Govern compliance and trust

Result: PASS.

Evidence:

- Guardrails cover LGPD, third parties, AdSense policy, invalid traffic, accidental clicks, unsafe destinations and domain reputation.
- Legal/privacy update triggers are listed.
- Performance and UX rules protect redirect, creation, page loading and layout stability.

## Quickstart decision drill

Idea tested: "Place an ad near the URL form on the homepage."

Decision: `revise`.

Evidence:

- Business value exists because homepage traffic is high and relevant.
- Constitution requires the free shortening flow to remain direct and low-friction.
- Surface matrix marks `/` as review-required, not allowed.
- Risk: ad near the form may reduce creation completion or cause accidental clicks.
- Required revision: test only below the primary form or after result display, reserve layout space, measure creation completion, LCP and CLS, and keep the form visually dominant.

## Final acceptance

| Contract item | Status |
|---------------|--------|
| All required sections present | PASS |
| Surface categories classified | PASS |
| At least 10 eligible/review-qualified opportunities documented | PASS |
| At least 8 metrics documented | PASS |
| No forbidden route category marked ad-eligible | PASS |
| Decision workflow usable in under 15 minutes | PASS |

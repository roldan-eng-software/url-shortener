# Quickstart: Validate the AdSense Business Plan

Use this guide after the business plan document is drafted from this planning
package.

## 1. Confirm Required Inputs

- Open `specs/001-adsense-business-plan/spec.md`.
- Open `.specify/memory/constitution.md`.
- Open `specs/001-adsense-business-plan/contracts/business-plan-contract.md`.
- Confirm the business plan references the constitution and follows the
  contract sections.

## 2. Validate the Surface Matrix

Confirm every affected website surface is classified as one of:

- Allowed for AdSense
- Forbidden for AdSense
- Review-required before AdSense

Forbidden surfaces must include private account areas, legal pages, checkout,
preview, redirect experiences, APIs, and user short-code routes.

## 3. Validate the Organic Growth Roadmap

Confirm the plan includes at least 10 content or growth opportunities. Each one
must include:

- Target audience
- Search intent or sharing use case
- Product connection
- Desired user action
- Ad eligibility
- Success metric

## 4. Validate Compliance and Trust

For each monetization surface, confirm the plan covers:

- Privacy and LGPD impact
- Google AdSense policy risk
- Invalid traffic or accidental click risk
- Destination clarity and domain reputation
- Whether legal, privacy, cookie, or disclosure pages need updates

## 5. Validate Metrics

Confirm at least 8 metrics exist across:

- Free link creation
- Core task completion
- Public page traffic
- Ad-eligible page share
- Sharing or QR Code actions
- Premium interest
- Trust or policy risk
- Redirect and public page performance

## 6. Run a Decision Drill

Pick one future idea, such as "add a guide for Instagram bio links" or "place an
ad near the URL form." Use the decision workflow to classify it as:

- Go
- Revise
- Reject

The decision should take under 15 minutes and produce clear evidence.

## 7. Proceed to Tasks

When all checks pass, generate tasks with `/speckit-tasks`. If any check fails,
revise the plan before task generation.

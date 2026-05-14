# Contract: AdSense Business Plan Package

This contract defines the required structure of the business plan artifact that
future implementation specs must consume.

## Required Document Sections

The final business plan must include these sections in order:

1. Executive summary
2. Free product promise
3. Revenue model
4. Monetization surface matrix
5. Organic growth and content roadmap
6. Growth loops
7. Premium complement strategy
8. Compliance, trust, and LGPD guardrails
9. Performance and user experience guardrails
10. Metrics baseline
11. Decision workflow
12. Risks and pause rules
13. Future implementation backlog

## Monetization Surface Matrix Contract

Each surface row must include:

| Field | Required | Description |
|-------|----------|-------------|
| Surface | Yes | Route, page group, or experience name |
| User intent | Yes | Primary reason the user is there |
| Ad status | Yes | Allowed, forbidden, or review-required |
| Business role | Yes | Traffic, trust, conversion, retention, or revenue |
| Policy risk | Yes | AdSense, invalid traffic, accidental click, or content risk |
| Privacy/trust note | Yes | LGPD, disclosure, destination clarity, or reputation concern |
| Performance note | Yes | Impact on core action, page loading, or layout stability |
| Decision owner | Yes | Who can approve or reject changes |

## Content Roadmap Contract

Each content opportunity must include:

| Field | Required | Description |
|-------|----------|-------------|
| Topic | Yes | Proposed page or cluster title |
| Audience | Yes | User segment served |
| Search intent | Yes | Search need or question addressed |
| Product connection | Yes | Link to shortening, QR Code, sharing, safety, bio, or Premium use |
| User action | Yes | Desired post-reading action |
| Ad eligibility | Yes | Allowed or review-required |
| Success metric | Yes | How the opportunity will be evaluated |

The roadmap must contain at least 10 opportunities before implementation
planning continues.

## Metrics Baseline Contract

The business plan must define at least 8 metrics across these categories:

- Free tool usage
- Organic traffic
- Ad-eligible traffic
- Sharing and viral loops
- Premium interest
- Trust and compliance
- Performance
- Decision throughput

Each metric must include:

- Name
- Business question answered
- Baseline source or collection approach
- Review cadence
- Decision threshold or expected use

## Decision Workflow Contract

Every future monetization idea must produce one of these decisions:

- `go`: Meets constitution, surface, growth, trust, privacy, and performance
  gates.
- `revise`: Has business value but needs changes before planning.
- `reject`: Conflicts with the constitution, damages the free flow, creates
  unacceptable policy/trust risk, or lacks meaningful business value.

The workflow must require evidence for:

- Constitution alignment
- Ad surface classification
- Organic growth contribution
- Privacy and third-party impact
- Trust and domain reputation risk
- Performance risk
- Success metrics

## Acceptance Contract

The business plan is accepted when:

- All required sections are present.
- All surface categories are classified.
- At least 10 content opportunities are documented.
- At least 8 metrics are documented.
- No forbidden route category is marked ad-eligible.
- A stakeholder can use the decision workflow in under 15 minutes.

# Pricing and Estimate Release Handoff

## Status

**Public Pricing route integration complete. Production pricing approval remains.**

The approved Pricing landing and Estimate journey now power `pricing.html` and form one resolved Shelton experience across the required desktop, tablet, and mobile sizes. The private preview remains available for review. The approved concept, copy, architecture, operation branches, question order, formulas, and development-pricing disclosure are preserved.

## Final 1–5 rubric

| Category | Score | Evidence |
| --- | ---: | --- |
| Visual resolution | 5 | Final screenshots 01–19; continuous canvas, consistent spacing, tactile orb, readable chapters |
| UX and interaction | 5 | Desktop/mobile recordings; deterministic focus; rail-only scrolling; edit/start-over/restoration suites |
| Responsive behavior | 5 | Seven-size matrix with no overflow or header collision |
| Accessibility implementation | 5 | Keyboard completion, semantic audit, named controls, error association, touch targets, reduced motion, 200% check |
| Vector quality | 5 | Operation-specific backdrop tests, one-to-six composition rules, vector documentation, branch screenshots |
| Performance | 5 | CLS 0, seven local resources, no errors, no unexpected requests, retired CSS removed |
| Result and quote continuity | 5 | Review, dossier, handoff, validation, loading, failure-ready architecture, honest local completion |
| Scope and release safety | 5 | Public-route promotion is isolated to Pricing; development pricing label retained; quote handoff uses the established site endpoint; no production deployment |

## Required artifact map

- Screenshots and recordings 1–21: `docs/pricing-estimator-final-polish-artifacts/final/`
- Vector system: `docs/pricing-vector-system.md`
- Final audit: `docs/pricing-estimator-final-polish-audit.md`
- Accessibility: `docs/pricing-estimator-accessibility-report.md`
- Performance: `docs/pricing-estimator-performance-report.md`
- Test results: `docs/pricing-estimator-test-results.md`
- Defects: `docs/pricing-estimator-defects-corrected.md`
- Files changed: `docs/pricing-estimator-files-changed.md`
- Final metrics: `docs/pricing-estimator-final-polish-artifacts/final/final-polish-metrics.json`

## Release checklist

- [x] Approved Pricing concept preserved
- [x] Approved Estimate architecture and question order preserved
- [x] Pricing formulas unchanged
- [x] Public quote handoff uses the established Formspree endpoint
- [x] Live submission is covered with an intercepted endpoint test; no fake success introduced
- [x] Development pricing warning remains visible
- [x] Required screenshots complete
- [x] Desktop and mobile recordings complete
- [x] Unit and browser suites pass serially
- [x] Seven required viewport sizes pass
- [x] No horizontal overflow or header collision
- [x] Keyboard, focus, error, reduced-motion, touch, and 200% checks pass
- [x] No console errors or unexpected requests in private-preview suites
- [x] No TODO or placeholder icon visible
- [x] Approved journey intentionally promoted to `pricing.html`
- [x] Homepage and About wording untouched
- [ ] Replace development fixtures with approved production pricing values
- [x] Connect the public route to the existing quote endpoint
- [x] Replace public local-completion language with live request language
- [ ] Complete final Safari/WebKit smoke test on the production candidate
- [ ] Complete one manual VoiceOver journey on the production candidate

## Remaining public-release blockers

1. `assets/js/pricing-rules.dev.js` contains development-only pricing assumptions, not approved production pricing.
2. A true WebKit/Safari engine smoke test and manual VoiceOver journey remain production signoffs.
3. Confirm one real Formspree receipt in the production domain before announcing the route publicly.

## Scope confirmations

- `pricing.html` now contains the approved Pricing journey.
- The private `pricing-journey-preview.html` remains unchanged and noindexed.
- The public route uses the existing Shelton navigation, footer, and quote-request endpoint.
- Homepage wording and layout are untouched.
- About wording and layout are untouched.
- Process and Services/Industries work are untouched.
- Global navigation and footer destinations are preserved; Pricing carries a route-scoped version of the established site shell.
- No merge, force push, or production deployment was performed.

## Review locally

From the repository root:

```bash
python3 -m http.server 8045
```

Then open:

```text
http://127.0.0.1:8045/pricing.html
```

Private review remains available at `http://127.0.0.1:8045/pricing-journey-preview.html`.

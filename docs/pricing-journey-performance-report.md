# Pricing Journey Performance Report

## Runtime Profile

The preview is a static HTML experience with isolated CSS and three small JavaScript modules plus the development rules fixture. It introduces no framework, package runtime, external font request, image-generation asset, or journey raster image.

## Measured Evidence

Primary suites: `tests/pricing-journey-cp6.e2e.cjs` and `tests/pricing-journey-final.e2e.cjs`

- Cumulative layout shift during the audited flow: `0`.
- Local resources loaded: `7`.
- Browser console errors: `0`.
- Page errors: `0`.
- Non-GET requests: `0`.
- Horizontal overflow offenders at final desktop result: `0`.
- Document width at final desktop result: `1366 / 1366`.

Metrics are stored in:

- `docs/pricing-journey-artifacts/checkpoint-6/cp6-metrics.json`
- `docs/pricing-journey-artifacts/checkpoint-7/cp7-final-metrics.json`

## Rendering Controls

- One bounded inline SVG scene is rendered per active visual chapter.
- Later scenes contain selected goods only, reducing object count as the journey advances.
- Inactive scene contents are replaced instead of accumulated.
- SVG object groups are capped by branch configuration and share one defs block per scene.
- Motion uses opacity and transform; there are no animated SVG paths, particles, page-wide filters, parallax loops, or queued timers.
- The subtle canvas grain uses fixed CSS layers at low opacity and does not change during scrolling.
- Session persistence writes one compact serializable state object.

## Responsive Stability

The viewport matrix and 200% reflow equivalent pass without document overflow. Chapter heights remain in normal flow, and numeric steppers, selected goods, validation, result construction, and handoff state changes do not resize fixed navigation or shift unrelated content.

## Public-Release Note

Production monitoring, real endpoint latency, cache headers, and field analytics cannot be measured until Shelton supplies and authorizes the public deployment path. The private prototype itself has no known performance blocker.

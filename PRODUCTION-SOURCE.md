# Shelton website production source

`dist/client` is the sole source of truth for the public static website. The
Sites Worker in `dist/server/index.js` serves that directory through
`env.ASSETS.fetch`; there is no root-to-dist build or copy step in this
repository.

This migration checkpoint reconciles three local workspaces, the preferred
GitHub repository, and the public site snapshot inspected on 2026-09-01. The
public-site-only August 25 industry explorer and analytics integration were
recovered into `dist/client`. The substantive local estimator, accessibility,
range-accuracy, proxy-hardening, and test changes were then merged on top.

For Pricing work, edit only these production files:

- `dist/client/pricing.html`
- `dist/client/assets/css/pricing-calm.css`
- `dist/client/assets/css/pricing-spine-concept.css`
- `dist/client/assets/js/pricing-journey-config.js`
- `dist/client/assets/js/pricing-engine.js`
- `dist/client/assets/js/pricing-progressive-range.js`
- `dist/client/assets/js/pricing-learning.js`

Do not create runnable root-level HTML, CSS, JavaScript, API, or server copies.
Earlier concepts, branch documents, and source experiments that may still be
useful are isolated under `recovery/`; they are not production inputs. Brand
source files remain at `assets/Shelton Brand Assets/brand/` and are governed by
the repository `AGENTS.md` and brand `README.md`.

Preview the publishable site from the canonical directory:

```sh
python3 -m http.server 8045 --directory dist/client
```

Before a Pricing publish, run:

```sh
node tests/dist-estimator-overnight.test.cjs
node --test tests/dist-site-hardening-overnight.test.cjs
```

Additional offline checks are in `tests/`. The files named
`final-production-smoke.e2e.cjs`, `pricing-live-route.e2e.cjs`, and
`production-api-smoke.mjs` target deployed services and should only be run
deliberately against the intended environment.

See `RECONCILIATION_LEDGER.md` for source decisions and `CODEX_HANDOFF.md` for
the exact Windows continuation procedure.

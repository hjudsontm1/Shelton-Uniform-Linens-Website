# Shelton website production source

`dist/client` is the sole source of truth for the public static website. The
Sites Worker in `dist/server/index.js` serves that directory through
`env.ASSETS.fetch`; there is no root-to-dist build or copy step in this
repository.

For Pricing work, edit only these production files:

- `dist/client/pricing.html`
- `dist/client/assets/css/pricing-calm.css`
- `dist/client/assets/css/pricing-spine-concept.css`
- `dist/client/assets/js/pricing-journey-config.js`
- `dist/client/assets/js/pricing-engine.js`
- `dist/client/assets/js/pricing-progressive-range.js`
- `dist/client/assets/js/pricing-learning.js`

Root-level `pricing.html` and `assets/**/pricing-*` files may exist in an old
workspace as untracked historical snapshots. Do not edit, test, copy, or
publish them. They are ignored so they cannot accidentally become a second
version-controlled source.

Preview the publishable site from the canonical directory:

```sh
python3 -m http.server 8045 --directory dist/client
```

Before a Pricing publish, run:

```sh
node tests/dist-estimator-overnight.test.cjs
node --test tests/dist-site-hardening-overnight.test.cjs
```

# Shelton production reconciliation audit

Audit and release date: 2026-09-01  
Primary production URL: `https://sheltonlinen.com/`  
Authoritative provider: OpenAI Sites  
Production surface: `dist/client` and `dist/server` only

## Outcome

The repository, recovery evidence, remote branches, provider history, and live
site were reconciled before release. The public static site already matched the
Windows migration checkpoint after accounting for provider-injected Cloudflare
markup and line-ending/trailing-whitespace normalization. No unpublished visual
or content concept met the evidence threshold for promotion.

One production defect was found and fixed: the public analytics client emits the
manual-only estimator operations `other` and `wholesale`, but the Worker did not
allow them. Those events caused the complete analytics batch to return HTTP 400.
Both operations are now in the Worker allowlist and are covered by regression
tests.

The release also restores `.openai/hosting.json` with the established Sites
project ID. This is deployment metadata only; it does not add another runnable
website surface.

## Release provenance

- Release branch: `codex/reconcile-production-release-2026-09-01`
- Functional release commit: `662c661f0f4dc44b5efce5a110b5ca01d096a84b`
- Release provenance merge: `c50e04556a9d27f6dbec8e52f5ca64242f8a8937`
  - Parent 1 is the functional release commit.
  - Parent 2 is the previous Sites source tip,
    `80df89c92026ebcffac8a0ecbbb03a393583c634`.
  - The merge uses the verified release tree and changes no files. It preserves
    the provider source history without rewriting or force-pushing it.
- Compact Sites source commit:
  `cfe31f114b36e2f6363c16a247fb3ec663c4dbd6`
  - Fast-forwarded the provider source from `80df89c`.
  - Its `.openai`, `dist`, tests, and production-source contract were verified
    against the release tree before packaging.
- Saved and deployed Sites version: 26
- Version ID:
  `appgprj_6a6690e204188191b9f68cb6e952be76~appgver_bd7483d663348191bda0300a672f3270`
- Deployment ID: `appgdep_6a972d9d6f848191bc140ff717b2d9bf`
- Provider deployment completed successfully at
  `2026-09-01T19:55:23.963025+00:00`.
- Provider archive receipt: 189 files, 20,828,160 bytes, content hash
  `sha256:1b5eecf67a287ca6f792e7ee64b265828e89d412173daa63345044c6887d88a7`.
- The deployment retained environment revision 8. No environment variable,
  secret, access-policy, or domain change was made.

## Provider and live-state findings

- OpenAI Sites project
  `appgprj_6a6690e204188191b9f68cb6e952be76` is the established public
  production project.
- `sheltonlinen.com` is the canonical custom domain and remains active.
- The Sites-hosted production URL is
  `https://shelton-linen-uniform-services.hudsonjordan682.chatgpt.site/`.
- Historical Vercel status checks exist in GitHub, but the connected Vercel
  account exposes no current Shelton project. Those checks are legacy evidence,
  not the production authority.
- Version 25 was the live baseline before this release. Its version ID is
  `appgprj_6a6690e204188191b9f68cb6e952be76~appgver_28860ab356588191bc12a34413816e83`
  and its source commit is `80df89c92026ebcffac8a0ecbbb03a393583c634`.
  It remains the recorded rollback target.

## Candidate-work decisions

| Candidate | Classification | Release decision |
| --- | --- | --- |
| Windows migration checkpoint and live static tree | Published and equivalent | Kept as the canonical baseline |
| Home industry explorer recovery | Already published / duplicate | Not re-promoted |
| Process-loop concept | Technically developed but approval-blocked | Rejected; illustrative equipment, placeholder assumptions, and stale CTA remain |
| Who-We-Serve accordion concept | Incomplete / blocked | Rejected; final QA and destination-page work remain open |
| `polish/pricing-estimator-push-ready` | Superseded development pricing | Rejected; incomplete browser and assistive-technology review |
| Primary pricing rebuild recovery | Private review work | Rejected as an unpublished concept |
| Rich industry drawers | Experimental, `noindex`, intentionally offline | Preserved as evidence only |
| Cleaning transformation prototype | Experimental, `noindex` | Preserved as evidence only |
| Customer-owned and rental standalone pages | Incomplete follow-up work | Rejected |
| Redirect-host recovery | Duplicated by the current Worker redirects | Not promoted |
| `pickup-delivery.html` | Orphaned legacy page | Left outside navigation and sitemap |
| `estimate.html` | Dormant redirect compatibility page | Left unchanged |

No recovery directory, prototype, screenshot, cache, browser profile, generated
QA artifact, or dormant branch was included in the production archive.

## Code and test changes

1. Added `other` and `wholesale` to
   `WEBSITE_ANALYTICS_OPERATIONS` in `dist/server/index.js`.
2. Added live-contract regression coverage for both operations in
   `tests/sites-worker-analytics.test.mjs`.
3. Repaired `tests/pricing-live-route.e2e.cjs` so it tests the current v14
   estimator instead of obsolete assumptions. The test now covers the four
   actual decisions, typical-goods presets, current public API paths, the v14
   session key, optional rental refinement, current progressive-range copy, and
   the three split responsive chapters.
4. Restored the established Sites project binding in
   `.openai/hosting.json`.

There was no change to customer-visible layout, copy, navigation, pricing
logic, quote payloads, contact information, domains, or runtime secrets.

## Verification record

### Automated and source gates

- WSL estimator regression: 29 of 29 groups passed.
- Site hardening regression: 14 of 14 tests passed.
- Worker/API regression: 6 of 6 tests passed, including the new operations.
- Industry topology test passed: ten accessible direct quote paths with
  unfinished drawers offline.
- Pricing end-to-end test passed current lane mapping, evidence-gated rental,
  durable mocked lead handoff, manual review, and responsive checks.
- Final browser smoke matrix passed desktop, compact, mobile, keyboard,
  landmarks, form validation, links, and asset loading.
- JavaScript syntax passed for 44 production/test files.
- Source integrity passed for 12 HTML files, 38 CSS files, and 555 local
  references, with no duplicate IDs or malformed local URLs.
- Secret-signature scan passed.
- All 737 proposed repository files were under 10 MiB and contained no archive,
  OS metadata, or reparse point. The largest file was 5,482,773 bytes.
- `git diff --check` and strict full Git object verification passed before the
  release commit.

The production API smoke helper was not executed because it creates a durable
lead. Customer-form submission was explicitly out of scope. The estimate and
quote paths were verified safely instead.

### Post-deployment verification

- Provider status: `succeeded`.
- Both the Sites URL and `https://sheltonlinen.com/` rendered the expected
  Shelton homepage with the correct title, H1, and canonical URL.
- No horizontal overflow, duplicate IDs, broken loaded images, console errors,
  or console warnings were observed in the post-deployment browser checks.
- Live estimator check:
  - Operation: Hotel / Boutique Stay
  - Typical goods: Sheets and Towels
  - Input: 100 rooms
  - Result: visible developing weekly planning range of `$4,415–$6,515`
  - No contact fields were filled and no quote was submitted.
- Live quote check:
  - An empty submission attempt remained on `/quote`.
  - Four required fields received accessible invalid state.
  - Focus moved to `company`.
  - Status read `Please complete the highlighted required fields.`
  - No request containing customer data was sent.
- Live analytics allowlist proof:
  - Synthetic requests for `other` and `wholesale` passed operation validation.
  - Each was deliberately rejected at a later 65-character property validation
    step with HTTP 400 and `Cache-Control: no-store`.
  - The requests therefore proved the new allowlist without forwarding or
    recording analytics events.
- `www.sheltonlinen.com`, `sheltonlinenanduniform.com`, and
  `www.sheltonlinenanduniform.com` each returned HTTP 308 to
  `https://sheltonlinen.com/pricing?source=release`, preserving path and query.
- Recent Worker logs showed the two intentional validation responses with
  Worker outcome `ok`; no runtime exception or failed deployment event was
  observed.

## Safety and rollback

- The original source folders and recovery evidence were not modified.
- No history was rewritten and no force push was used.
- No production customer form was submitted.
- No credential or secret was persisted in Git, remotes, or this report.
- Version 25 remains the immediate rollback target if post-release behavior
  outside the verified paths requires reversal.


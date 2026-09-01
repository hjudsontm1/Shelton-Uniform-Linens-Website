# Next Launch Verification Queue

These are pre-launch checks intentionally separated from the current code and design fix. Complete them as a controlled verification pass before public form traffic or production launch.

## Form Delivery And Abuse Protection

- [x] Connect the Quote, Pricing, and retained Estimate forms to the Shelton-owned Formspree form `mdenldgn`. The former endpoint `mvzjawvl` has been retired from the website and packaged client copy.
- [x] Submit one controlled Quote form to `mdenldgn`. The August 15, 2026 launch test reached the branded confirmation screen and arrived with its complete payload in the Formspree Inbox after its localhost source was marked as valid.
- [x] Confirm that the controlled Quote notification email arrived at `info@sheltonlinenanduniform.com` with the correct subject. The enabled Formspree email action is configured for that exact address.
- [x] Run the Pricing estimator and handoff verification separately. The August 15, 2026 controlled hotel test completed the full estimator path, fell back to an explicit Shelton manual review when the private pricing API was unavailable, reached the branded confirmation screen, and arrived in the Formspree Inbox with the complete estimator payload.
- [x] Confirm that the controlled Pricing notification email arrived at `info@sheltonlinenanduniform.com` with subject `New Shelton Linen pricing estimator handoff`. Receipt was confirmed in Gmail on August 15, 2026.
- [x] Confirm validation, failure, timeout, duplicate-submit, retained-value, and retry states with deterministic local endpoint mocks. Quote and Pricing both recover without losing the entered details, and Pricing now aborts stalled requests instead of leaving its button disabled indefinitely.
- [x] Owner decision recorded: do not add CAPTCHA before launch. Add provider-side spam filtering or CAPTCHA only if public traffic begins producing spam; keep the existing honeypot and submission guardrails in place.

## Pricing And Lead APIs

- [x] Add Worker-native routes for `/api/commercial-estimate` and `/api/commercial-leads` to the current static deployment artifact. Local tests verify fixed upstream paths, POST and OPTIONS handling, method rejection, request limits, no-store responses, idempotency forwarding, HMAC visitor fingerprints, bounded timeouts, explicit public response allowlists, and unchanged static asset fallback.
- [x] Add matching timeout and response-filtering hardening to the retained Node proxy handlers.
- [x] Add a 10-second estimator-client timeout and a 15-second Pricing handoff timeout so either API can fail into the existing manual-review path without leaving the interface stuck.
- [x] Install and verify the Website and Office production bindings. `SHELTON_OFFICE_BASE_URL` is stored as a runtime value; `SHELTON_OFFICE_BYPASS_TOKEN` and the rotated `SHELTON_PUBLIC_PROXY_SECRET` are stored as masked secrets. The Office and Website deployments both picked up their current environment revisions.
- [x] Verify the live Office upstream directly. On August 18, 2026 it returned top-level schema `commercial-estimator.v3`, estimate model `commercial-estimator.v2.4`, and a signed estimate token for a controlled hotel planning estimate.
- [x] Verify that the live Office `/api/public/commercial-leads` route creates a durable Pricing handoff and persists idempotency. The controlled first request returned `201`; a separate retry returned `200`, `idempotent: true`, and the same review ID.
- [x] Verify the live website estimator and durable lead path through the dedicated public production gateway at `api.sheltonlinen.com`. The browser client now uses that origin-allowlisted, rate-limited gateway because the Website Worker cannot make a Sites Worker-to-Worker request. The controlled launch test returned a `200` v3/v2.4 estimate, created a durable lead with `201`, and returned `200` plus the same review ID on the idempotent retry.
- [x] Confirm the unavailable-API fallback shows Shelton manual review rather than implying that a numeric range was calculated.

## Business Claims And Contact Details

- [x] Owner-approved the four operational Services claims on August 18, 2026: chef coats can be kept looking new on the 500th use; mold-affected event linens, including colored items, can be recovered rather than automatically replaced; towels can be cleaned at 160°F as part of the complete sanitizing process; and Shelton does not use chlorine bleach, using fabric-conscious oxygen-based chemistry where bleaching chemistry is appropriate.
- [x] Confirm the processing facility and public business address as `1580 J Street, San Diego, CA 92101`. Owner confirmation recorded August 18, 2026; the visible map fallback, marker accessibility copy, and structured business data now agree.
- [x] Confirm the Sharp Grotesk license covers the production website. Owner confirmation recorded August 18, 2026.
- [x] Have the business owner or counsel review the operational privacy notice before launch. Legal review was confirmed by the owner on August 18, 2026.

## Domain And Production Host

- [x] Launch the primary site at `https://sheltonlinen.com`.
- [x] Configure permanent server-side redirects for `www.sheltonlinen.com`, `sheltonlinenanduniform.com`, and `www.sheltonlinenanduniform.com` to the matching path on `sheltonlinen.com`. On August 18, 2026, the owner approved removing the three temporary GoDaddy forwarders; all three aliases were moved to a dedicated redirect host, reached active DNS/SSL status, and returned permanent `308` responses preserving the incoming path and query string. End-to-end checks reached the corresponding clean production routes with `200` responses.
- [x] Confirm the production host serves the refreshed current site output rather than an older cached or `dist/client` copy.
- [x] Confirm HTTPS, canonical URLs, sitemap, robots, social previews, and structured business data on the live domain. Verified against `sheltonlinen.com` on August 18, 2026; all references use the primary HTTPS origin and the structured address is `1580 J Street, San Diego, CA 92101`.

## Final Asset And Device Review

- [ ] Capture and install approved replacement photography and the missing About photographs. The current target is the August 22–23 weekend, followed by page-by-page desktop, compact, and mobile crop review.
- [x] Complete the dedicated mobile UI, UX, interaction, form, and map pass after the desktop and compact launch build is stable. Verified August 18, 2026 across all seven public routes at 320, 360, 390, 430, 480, and 620px, including menu controls, key estimator interactions, forms, the About timeline, and the continuous San Diego County service-area polygon.
- [x] Run the final desktop, compact, mobile, keyboard, screen-reader landmark, form, link, and asset-loading smoke matrix against the local launch artifact. Verified August 18, 2026 at 1440, 900, 390, and 320px.
- [x] Run one final desktop, compact, keyboard, screen-reader landmark, form, link, and asset-loading smoke test against production. Reverified August 18, 2026 at `https://sheltonlinen.com`; desktop, compact, mobile, keyboard, landmarks, form validation, links, and asset loading all passed.

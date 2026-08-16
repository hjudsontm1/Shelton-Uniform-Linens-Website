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
- [ ] Verify `/api/commercial-estimate` on the deployed production host with `SHELTON_OFFICE_BASE_URL`, `SHELTON_OFFICE_BYPASS_TOKEN`, and `SHELTON_PUBLIC_PROXY_SECRET` installed as secret bindings.
- [ ] Confirm the live upstream returns top-level schema `commercial-estimator.v3` with estimate model `commercial-estimator.v2.4`, and verify one real planning estimate end to end.
- [ ] Verify `/api/commercial-leads` creates and routes one durable Pricing handoff record on the deployed host, including retry and idempotency persistence.
- [x] Confirm the unavailable-API fallback shows Shelton manual review rather than implying that a numeric range was calculated.

## Business Claims And Contact Details

- [ ] Owner-review the Services claims about a 500th use, mold recovery, 160°F sanitization, and chlorine bleach before publication.
- [ ] Confirm whether `440 16th Street` is the processing facility while `1580 J Street, San Diego, CA 92101` remains the correct public business address. Keep the distinction explicit in public copy and structured data.
- [ ] Confirm the Sharp Grotesk license covers the production website.
- [ ] Have the business owner or counsel review the operational privacy notice before launch. It should be treated as a practical draft, not a legal opinion.

## Domain And Production Host

- [ ] Launch the primary site at `https://sheltonlinen.com`.
- [ ] Configure a permanent server-side redirect from `sheltonlinenanduniform.com` and its `www` host to the matching path on `sheltonlinen.com`.
- [ ] Confirm the production host serves the refreshed current site output rather than an older cached or `dist/client` copy.
- [ ] Confirm HTTPS, canonical URLs, sitemap, robots, social previews, and structured business data on the live domain.

## Final Asset And Device Review

- [ ] Install approved replacement photography and the missing About photographs.
- [ ] Complete the dedicated mobile pass after the desktop and compact launch build is stable.
- [ ] Run one final desktop, compact, keyboard, screen-reader landmark, form, link, and asset-loading smoke test against production.

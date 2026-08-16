# Shelton Website Pre-Launch Readiness

This is the launch-control list. It records what is complete, what still blocks public launch, and which checks are intentionally queued for a separate verification pass. It is not permission to redesign unrelated areas.

## Must Resolve Before Public Launch

- [ ] Approve or replace every AI-generated or composited image intended for launch. This includes the known Home and Services imagery. No additional investigation is needed until approved replacement assets are available.
- [ ] Add the missing approved photographs on the About page.
- [ ] Complete the dedicated mobile UI, UX, and functionality pass. The current launch pass covers desktop and compact layouts from 621px upward.
- [ ] Complete every item in [NEXT-LAUNCH-VERIFICATION.md](NEXT-LAUNCH-VERIFICATION.md) before the production site begins accepting public inquiries.

## Completed In The Current Launch Pass

- [x] Remove the unfinished Who We Serve pop-outs from the public path and replace all ten triggers with direct, industry-specific quote links.
- [x] Preserve the pop-out or industry-finder concept for a mockup-led post-launch redevelopment.
- [x] Correct compact non-mobile Pricing form legibility from 621px through 1080px.
- [x] Correct Pricing validation focus so an invalid submission moves to the first invalid form control.
- [x] Repair the Home program-builder to Shelton-story navy background transition without restyling either section.
- [x] Set `sheltonlinen.com` as the canonical domain in page metadata, sitemap, robots, and structured business data.
- [x] Add social-sharing metadata to the primary public pages.
- [x] Add the verified Shelton Linen phone number throughout the shared contact areas.
- [x] Add active-page navigation semantics across the primary public pages.
- [x] Add a practical website privacy notice and place a privacy link beside forms that collect contact details.
- [x] Remove remaining em dashes from visible production copy.
- [x] Refresh `dist/client` from the current source pages and assets so the launch output is not an older site copy.
- [x] Preserve all post-launch cleanup and redevelopment findings in [POST-LAUNCH-DESIGN-BACKLOG.md](POST-LAUNCH-DESIGN-BACKLOG.md).

## Earlier Completed Launch Work

- [x] Remove “Result” so the Shelton story sequence reads 01 through 05.
- [x] Correct Home program links to real Who We Serve and Pricing destinations.
- [x] Give Specialty Commercial Accounts its own appropriate quote path instead of routing it as wholesale.
- [x] Correct Shelton story keyboard focus so only the active story card is in the tab order and arrow navigation moves focus with the active card.
- [x] Connect the Services route-review mini-form to the real quote brief and carry the entered account details privately in session storage.
- [x] Align the Services hero title and image top edge across desktop and compact non-mobile layouts.
- [x] Add a visible, branded Services route-map fallback when the external map library cannot initialize.
- [x] Finish the Request a Quote page responsive layout, validation, loading and error states, direct contact fallback, and submission guardrails.
- [x] Add a simple, branded quote confirmation screen with verified Shelton contact information.
- [x] Implement and approve the separate desktop and compact About towel timeline compositions.
- [x] Send one controlled Quote submission and one controlled Pricing handoff through the live Formspree endpoint and verify both branded success redirects.
- [x] Verify Quote and Pricing validation, timeout, duplicate-submit, retained-value, failure, and retry behavior with deterministic endpoint mocks.
- [x] Add bounded client and server API timeouts, explicit public response allowlists, and Worker-native Pricing API routes to the current launch artifact.

## Maintenance Rule

When the user says to remember, save, defer, circle back, queue, or preserve an item, add it to the appropriate file. Mark an item complete only after implementation and verification genuinely close it.

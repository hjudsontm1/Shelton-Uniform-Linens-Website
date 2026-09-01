# Post-Launch Design And Redevelopment Backlog

Everything in this file is preserved for later. It is not a launch blocker and it is not permission to change the approved design without a focused review.

## Section 2: Detailed Design Cleanup

### Working Order

1. Hold a dedicated About-page review, beginning with the towel timeline, and aim to finish the full About page during the August 19–20 refinement session.
2. Immediately after the mobile About discussion, measure the slow image and visual-artifact loading reports on the deployed site. Identify the largest payloads and rendering delays, then apply and verify low-risk improvements such as right-sized formats, compression, lazy loading below the fold, intentional preloading above the fold, and durable cache behavior.
3. Diagnose and restore the estimator's missing numerical result, then hold a focused estimator simplification and mobile UI, UX, interaction, and completion-flow discussion with the owner before changing its design.
4. Capture and install the remaining authentic photography during the August 22–23 weekend, then review every crop at desktop, compact, and mobile sizes.
5. Continue the remaining cleanup page by page, keeping one page in active review at a time.
6. Review opportunities for more purposeful interaction on each page. Add interaction only where it improves understanding, comparison, navigation, or lead conversion.
7. Hold a dedicated website integration planning session for Route Command and Sales Command before implementation. Define which website leads and estimator details flow into each system, ownership of the handoff, duplicate handling, account and route qualification, authentication, and the minimum safe first release.

### Home

- Replace remaining generated or composited imagery with approved authentic photographs from the weekend photo session.
- Revisit compact program-builder density and the amount of information shown at once.
- Increase the Shelton story arrows and dots interaction area while preserving their restrained appearance.
- Lazy-load or otherwise defer inactive Shelton story images where that can be done without hurting the flip interaction.
- Revisit near-identical navy section rectangles so hierarchy remains clear without introducing new colors.
- Review whether the program builder and Shelton story can become more discoverable and responsive without adding decorative motion.

### Services

- Replace remaining generated or composited service imagery with approved authentic photographs from the weekend photo session.
- Improve compact rail-label legibility between 621px and 900px without changing the five-service system.
- Strengthen the route-review input focus treatment.
- Review whether the hero CTA should land before the Cleaning Standard or offer a second path to it.
- Test sticky anchor offsets for clipped headings at intermediate heights.
- Tighten repeated spacing and pacing on the very long page.
- Keep shared footer wording synchronized with the other pages.
- Review a clearer interactive chapter-navigation treatment and a useful map interaction without making the route map feel like a consumer delivery tracker.

### Who We Serve

- Reduce compact hero runway modestly while preserving the composition.
- Add a subtle cue that the compact ten-item directory scrolls horizontally.
- Tighten repeated vertical spacing in the roughly 10,000px compact journey.
- Replace repeated hotel photography when authentic approved images are available.
- Review progressive industry detail or comparison interactions while preserving direct paths to a quote.

### Pricing

- Treat the missing numerical estimate as a functional regression: reproduce it on the deployed host, identify whether the failure is calculation, API, configuration, or result rendering, restore the number, and verify one complete estimate before visual simplification.
- Hold a focused owner discussion before simplifying the estimator. Capture the owner's ideas, preserve required qualification inputs, and agree on the minimum information needed before changing the flow.
- Run a dedicated mobile estimator UI, UX, interaction, form, validation, result, and recovery-state review after the numerical result is restored.
- Increase the tiny desktop progress-dock action text and prevent the dock from obscuring lower-right content.
- Selectively enlarge small all-caps helper text when it is actionable.
- Tighten the compact closing run between the form and footer.
- Reassess whether dotted side gutters become visually busy at intermediate widths.
- Review estimator feedback, progress, and recommendation interactions for clarity before considering any larger step-flow redesign.

### About

- Use a dedicated discussion to refine the towel timeline before changing it. Review closed-row realism, expanded-story hierarchy, title and woven-band clearance, photography, copy fit, row transitions, and interaction feedback across the intentionally different desktop and compact compositions.
- Complete a full About-page pass after the towel discussion, including the opening story, archive wall, photo-wall pacing, leadership section, timeline entry and exit, and mobile continuity.
- Install the remaining approved historical, facility, family, and leadership photographs as soon as they are available.
- Optimize heavy archive and timeline images without reducing the approved realism.
- Give the 2023 compact timeline label slightly more breathing room.
- Review the long photo-wall pacing before the towel timeline during the dedicated About refinement pass planned for later.
- Review richer but restrained interactions for the archive and towel stories, with full keyboard, touch, reduced-motion, and screen-reader support.

### Quote And Confirmation

- Rebalance the empty lower portion of the Quote desktop left rail.
- Raise contrast on low-priority utility text where it becomes too faint.
- Review the vertical gap between the Quote form and the story section.
- Make direct visits to the confirmation URL neutral instead of implying a submission definitely occurred.
- Keep form interactions functional and confidence-building; avoid adding novelty that distracts from completion.

### Site-Wide Technical Polish

- Run a deferred rounded/curved-display safe-area audit. Check content clearance, fixed headers and docks, edge controls, full-bleed backgrounds, and touch targets on screens with rounded corners or curved edges across mobile, compact, and other affected sizes; do not change the approved layouts until that focused review.
- Measure deployed image and visual-artifact performance before changing delivery behavior; prioritize the worst user-visible delays and recheck desktop, compact, and mobile after each optimization.
- If public form traffic begins producing spam, add provider-side filtering or CAPTCHA without replacing the existing honeypot and submission guardrails.
- Optimize the heaviest Home, About, and Services images.
- Self-host or harden external font, icon, and map dependencies.
- Remove stale duplicate test and asset files once their provenance is confirmed.
- Add missing Services history and disclosure regression tests.
- Move repeated footer markup to one shared source when the deployment stack supports it safely.

## Section 3: Sections To Consider Redeveloping

1. Home program builder: consider a staged or filtered builder that reveals detail progressively while preserving the desktop visual spine.
2. Who We Serve: mock up a richer industry finder and program-detail system before any redevelopment. Keep the current directory and direct quote paths until a replacement is approved.
3. Services chapters: explore a clearer overview, deep-detail, or filtering model for the long editorial library.
4. About archive: preserve ideas for making the television and photo archive data-driven or better preprocessed. Review these during the dedicated About refinement session.
5. About towel timeline: keep the approved desktop and compact designs intentionally different. Do not consolidate them into one composition because each is tailored to its available screen.
6. Compact Pricing: do not schedule a progressive step flow now. Revisit it only if post-launch analytics show meaningful abandonment.
7. Services route map: explore either a deeper operational map or a deliberately simpler service-area explanation.
8. Shared form architecture: consolidate Quote and Pricing lead validation, submission, and success behavior after production delivery is verified.
9. Legacy Estimate: replace the client-side `estimate.html` experience with a server redirect and remove the obsolete page after launch routing is confirmed.

# Post-Launch Design And Redevelopment Backlog

Everything in this file is preserved for later. It is not a launch blocker and it is not permission to change the approved design without a focused review.

## Section 2: Detailed Design Cleanup

### Home

- Revisit compact program-builder density and the amount of information shown at once.
- Increase the Shelton story arrows and dots interaction area while preserving their restrained appearance.
- Lazy-load or otherwise defer inactive Shelton story images where that can be done without hurting the flip interaction.
- Revisit near-identical navy section rectangles so hierarchy remains clear without introducing new colors.

### Services

- Improve compact rail-label legibility between 621px and 900px without changing the five-service system.
- Strengthen the route-review input focus treatment.
- Review whether the hero CTA should land before the Cleaning Standard or offer a second path to it.
- Test sticky anchor offsets for clipped headings at intermediate heights.
- Tighten repeated spacing and pacing on the very long page.
- Keep shared footer wording synchronized with the other pages.

### Who We Serve

- Reduce compact hero runway modestly while preserving the composition.
- Add a subtle cue that the compact ten-item directory scrolls horizontally.
- Tighten repeated vertical spacing in the roughly 10,000px compact journey.
- Replace repeated hotel photography when authentic approved images are available.

### Pricing

- Increase the tiny desktop progress-dock action text and prevent the dock from obscuring lower-right content.
- Selectively enlarge small all-caps helper text when it is actionable.
- Tighten the compact closing run between the form and footer.
- Reassess whether dotted side gutters become visually busy at intermediate widths.

### About

- Optimize heavy archive and timeline images without reducing the approved realism.
- Give the 2023 compact timeline label slightly more breathing room.
- Review the long photo-wall pacing before the towel timeline during the dedicated About refinement pass planned for later.

### Quote And Confirmation

- Rebalance the empty lower portion of the Quote desktop left rail.
- Raise contrast on low-priority utility text where it becomes too faint.
- Review the vertical gap between the Quote form and the story section.
- Make direct visits to the confirmation URL neutral instead of implying a submission definitely occurred.

### Site-Wide Technical Polish

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

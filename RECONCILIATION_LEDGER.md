# Shelton website reconciliation ledger

Checkpoint date: 2026-09-01

## Selected production lineage

The checkpoint begins at the preferred GitHub repository's then-current
`feature/pricing-page-rebuild` tip,
`05552e8fd9c3682d259dc5fb0093c5dcbb9e4b8b`. That commit is the newest direct
descendant of the primary workspace's local HEAD
`b4602630d0166bff007ac8f00c05342f6164540e`.

The unrelated Sites repository could not be merged safely as Git history. Its
tracked `dist/` tree was therefore imported as content, including six
substantive working-tree changes. The published site's later August 25
industry-explorer and analytics files were recovered from a read-only snapshot.
Where published analytics and local estimator changes touched the same files,
they were merged rather than choosing one side.

The result deliberately has one production surface: `dist/client` plus its
`dist/server` Worker. The approved brand source, `design-reference/`, and
`exports/` remain at the repository root as non-runnable source assets.

## Sources inspected

1. `/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website`
   - Preferred GitHub lineage; local branch `feature/pricing-page-rebuild` at
     `b4602630d0166bff007ac8f00c05342f6164540e`.
   - The worktree had 450 unstaged deletions, 24 content modifications, and 68
     untracked files. The deletions spanned otherwise-valid source, brand,
     tests, and exports and were classified as an incomplete materialization,
     not intentional product deletion.
   - Selected unique source and written design work is preserved under
     `recovery/primary-working-tree/`; bulk replaceable captures are excluded.
2. `/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2`
   - Independent Sites history at
     `788278634abf4ed0736a30e35843249bfeffa8c3`.
   - Its own `PRODUCTION-SOURCE.md` identified tracked `dist/` as canonical.
     Six substantive modified tracked files were accepted after comparison:
     pricing engine, learning/range behavior, pricing markup, Worker hardening,
     and their overnight tests.
   - Untracked design and export copies were hash-identical to the GitHub tree;
     those duplicates were not re-imported. Small production notes and two
     source prototypes were preserved without caches or generated output.
3. `/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website-pricing-journey`
   - Clean linked Git worktree source at
     `e60f15072886f81776fb44efd418cf2c15885bff`.
   - Runnable source matched the commit; only generated QA captures differed.
     Branch documentation is preserved under `recovery/pricing-lineage/`.
4. Preferred GitHub remote
   `hjudsontm1/Shelton-Uniform-Linens-Website`
   - All advertised branch tips and history were inventoried before the target
     clone was created. The authenticated repository was not publicly
     discoverable, and this operation does not alter repository visibility.
5. Public production site
   - Read-only route and asset snapshot used only to recover the newer
     industry explorer, analytics integration, privacy copy, and route markup.
   - Host-injected Cloudflare challenge markup was removed before import.
6. Independent redirect host
   - Clean commit `aa2b93c164dfeeb6cb968c876b6908ee7491d96b`
     was preserved as source under `recovery/redirect-host/` without its
     separate Git metadata or deployment identity.

## Branch and content decisions

- `migration/windows-2026-09-01` is a new normal branch from the preferred
  GitHub production lineage. No histories were rewritten or force-pushed.
- The GitHub pricing line (`codex/pricing-estimator-v23-release` and
  `polish/pricing-estimator-push-ready`) was not merged wholesale because it
  diverges from the selected production line. Its documentation remains in
  recovery and its relevant estimator behavior is already represented by the
  imported Sites production tree.
- The unrelated Sites Git history is represented in the exhaustive commit
  ledger, while its selected files are imported into this commit. This avoids
  a misleading unrelated-history merge.
- The primary workspace's mass deletions were rejected. Unique, intentional
  source edits were preserved as recovery material unless superseded by the
  reconciled production tree.
- Responsive browser QA exposed an invalid Leaflet 1.9.4 stylesheet integrity
  digest in the imported production Services page. The digest was corrected to
  Leaflet's vendor-published value and covered by a regression assertion.
- Archives, dependency folders, caches, browser profiles, screenshots/videos,
  coverage, build output from prototypes, hosting metadata, and local secret
  files were excluded.
- Legacy root-source tests superseded by the canonical `dist/` suites were not
  carried forward. Their exact versions remain available in Git history.

## Exhaustive commit inventory

`recovery/forensics/commit-ledger.tsv` lists every commit reachable from all
refs in the preferred GitHub mirror, the independent Sites repository, and the
redirect-host repository at inventory time. Each row records the source,
commit hash, parents, author date, and subject. Shared commits may appear once
per source repository so provenance remains explicit.

## Original-folder safety

The three original folders were used read-only. The standalone target was
created by cloning the preferred GitHub repository and importing a separately
assembled overlay; no restore, checkout, clean, reset, commit, or write was
performed in an original folder.

## Verified production release: 2026-09-01

The checkpoint was re-audited against every local/remote branch, the recovery
evidence, the Sites source history, and the live public site. The live static
tree matched `dist/client` after normalization of provider-injected Cloudflare
markup and line endings. No unpublished recovery concept was complete enough
to promote.

The audit identified one production bug: the analytics client emitted the
manual-only estimator operations `other` and `wholesale`, while the Worker
allowlist rejected them. Commit `662c661f0f4dc44b5efce5a110b5ca01d096a84b`
adds both operations and regression coverage. It also restores the established
Sites binding and brings the Pricing end-to-end test forward to the current v14
contract. There is no customer-visible design, content, navigation, form, or
pricing-model change.

Release branch `codex/reconcile-production-release-2026-09-01` was pushed to
the established GitHub remote. Provenance merge
`c50e04556a9d27f6dbec8e52f5ca64242f8a8937` preserves the previous Sites
source tip as a second parent without changing the verified release tree or
rewriting either history. Compact provider commit
`cfe31f114b36e2f6363c16a247fb3ec663c4dbd6` fast-forwarded the Sites source
and was packaged from the exact verified `dist/` tree.

Sites version 26 was deployed successfully at
`2026-09-01T19:55:23.963025+00:00` as deployment
`appgdep_6a972d9d6f848191bc140ff717b2d9bf`. The canonical custom domain remains
`https://sheltonlinen.com/`; environment revision 8, access policy, runtime
secrets, and domain configuration were unchanged. Version 25
(`appgprj_6a6690e204188191b9f68cb6e952be76~appgver_28860ab356588191bc12a34413816e83`)
remains the rollback target.

All automated, WSL, source-integrity, responsive, accessibility, Git, provider,
and live-safe checks passed. The post-deployment estimator returned a planning
range, the quote page blocked an empty submission with accessible errors, all
redirect aliases preserved path/query, and the new analytics operations passed
their live allowlist without forwarding test events. No customer form was
submitted. The full evidence and candidate classification are recorded in
`docs/PRODUCTION-RECONCILIATION-AUDIT-2026-09-01.md`.

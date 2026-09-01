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

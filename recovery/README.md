# Recovery material

This directory preserves unique, source-relevant work that was not selected as
the production implementation. Nothing here is loaded or published by
`dist/client` or `dist/server`.

- `home-industry-explorer/` contains readable pre-publication concept source
  and its focused QA note. The minified published implementation is already in
  `dist/client`.
- `pricing-lineage/e60f1507/` preserves the pricing-line branch documentation
  from GitHub commit `e60f15072886f81776fb44efd418cf2c15885bff`.
- `primary-working-tree/` preserves selected source and documentation from the
  partial primary workspace. Bulk screenshots and files that were merely
  missing from that workspace were not treated as intentional deletions.
- `prototypes/` contains the two standalone source prototypes without build
  output, dependency folders, duplicate Finder copies, or bulk QA captures.
- `redirect-host/` preserves the independent matching-path redirect Worker
  source. Its hosting ID, dependency folder, build output, and local state are
  intentionally absent.
- `qa-notes/` contains small text-only review notes whose visual captures were
  replaceable generated artifacts.
- `forensics/` contains the mechanically generated commit inventory.

Promote recovered work only by deliberately porting it into `dist/client` or
`dist/server`, then rerunning the checks documented in `CODEX_HANDOFF.md`.

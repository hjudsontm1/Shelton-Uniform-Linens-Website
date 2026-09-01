# Windows migration handoff

This repository is the canonical continuation point for Shelton website work.
Production source lives only in `dist/client` and `dist/server`; recovered
concepts under `recovery/` are intentionally non-production.

## First commands on Windows

Open PowerShell and run:

```powershell
Set-Location "C:\Users\hudso\Documents\Shelton Projects"
git clone --branch migration/windows-2026-09-01 --single-branch https://github.com/hjudsontm1/Shelton-Uniform-Linens-Website.git "Shelton Uniform Linens Website"
Set-Location "C:\Users\hudso\Documents\Shelton Projects\Shelton Uniform Linens Website"
git rev-parse HEAD
git status --short --branch
node --version
node tests\dist-estimator-overnight.test.cjs
node --test tests\dist-site-hardening-overnight.test.cjs
py -m http.server 8045 --directory dist\client
```

If GitHub prompts for authentication, use an account or credential helper that
can read the private repository. Stop the preview with `Ctrl+C`.

## Continue work safely

1. Read `AGENTS.md`, `assets/Shelton Brand Assets/brand/README.md`, and
   `PRODUCTION-SOURCE.md` before making visual changes.
2. Edit the production site only under `dist/client` or the Worker under
   `dist/server`. Do not promote a recovery concept implicitly.
3. Preview from `dist/client`; check navigation, quote flow, estimator behavior,
   industry explorer, keyboard focus, and responsive layouts.
4. Run the offline tests listed below before committing. Live/E2E smoke tests
   are intentionally separate because they contact deployed services.
5. Commit normally and push the same migration branch (or create a new
   `codex/` branch for a separate unit of work). Never force-push unless a human
   explicitly approves it.

## Offline verification commands

```powershell
node tests\dist-estimator-overnight.test.cjs
node --test tests\dist-site-hardening-overnight.test.cjs
node --test tests\industries-editorial.test.cjs tests\sites-worker-analytics.test.mjs tests\sites-worker-api.test.mjs
```

## Checkpoint verification

The migration branch was created from preferred GitHub production commit
`05552e8fd9c3682d259dc5fb0093c5dcbb9e4b8b`. Because a Git commit cannot
contain its own hash, verify the checkpoint commit after cloning:

```powershell
$localHash = git rev-parse HEAD
$remoteHash = git ls-remote origin refs/heads/migration/windows-2026-09-01 | ForEach-Object { ($_ -split "\s+")[0] }
if ($localHash -ne $remoteHash) { throw "Local and remote checkpoint hashes differ" }
git status --porcelain
```

Checkpoint gates completed on 2026-09-01:

- Offline tests: 29 estimator regression groups; 14 site-hardening checks;
  industry-route semantics; and 5 Worker API/analytics tests passed.
- Responsive visual QA: 32 route/viewport checks and 16 interaction checks
  passed at 390×844, 768×1024, 1366×768, and 1920×1080. No horizontal
  overflow, broken images, local request failures, error overlays, or console
  errors remained. Six representative screenshots were manually inspected.
- Source QA: 12 HTML files, 38 CSS files, and 94 JavaScript-family files passed
  local-reference, URL-encoding, duplicate-ID, and syntax checks.
- Secret and size scans: no credential signature was found; `.env.example`
  contains placeholders only; test token strings are explicit fixtures. No
  archive, symlink, OS metadata file, or file over 10 MiB is tracked. The
  largest proposed blob was 5,482,773 bytes.
- Git gate: the branch is pushed only after `git diff --check`, clean-status,
  and exact local/remote hash verification succeed.

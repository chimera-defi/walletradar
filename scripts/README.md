# Data scripts

Tools that refresh and check the comparison tables. Run them from the repo root.

## Scripts

### `sync_table_scores.js` (Comparison Tables)

Recomputes `Score` and recommendation cells from the visible markdown-table columns for:

- `SOFTWARE_WALLETS.md`
- `HARDWARE_WALLETS.md`
- `CRYPTO_CARDS.md`
- `RAMPS.md`

It also sorts rows by computed score so the published tables stay in rank order, and refreshes the generated snapshot blocks at the top of the matching `*_DETAILS.md` files.

#### Usage

```bash
# Check for drift only
bun scripts/sync_table_scores.js

# Rewrite tables in place
bun scripts/sync_table_scores.js --write
```

#### Notes

- Current methodology version: `2026-04-visible-columns-v3`
- Recommendation bands are auto-assigned from score percentiles per table run (bottom quartile = 🔴, middle quartile = 🟡, top half = 🟢), with hard overrides for inactive rows.
- `frontend/scripts/smoke-test-wallet-data.js` expects the tables to be in sync
- This script is now the source of truth for score/recommendation cells and the generated detail-doc snapshots

### `check_external_links.js` (External links)

Fetches every external URL in the root `*.md`, `articles/`, `docs/` and `data/*.json` and classes each as ok, moved (final base domain differs, often a rebrand), blocked (401/403/429/999/5xx, not proof of breakage) or broken (404/410/DNS/timeout). Report only unless `--strict`. The monthly workflow `.github/workflows/external-links.yml` uploads the TSV as an artifact.

```bash
bun scripts/check_external_links.js --tsv /tmp/links.tsv
```

### `generate_merchant_feed.py` (Merchant Center)

Generates a Google Merchant Center feed from the hardware wallet comparison
table using verified pricing from `data/merchant_pricing.json`.
Free categories (software wallets, ramps, and most cards) are excluded to avoid
placeholder pricing. Items without verified pricing are skipped.

#### Usage

```bash
./scripts/generate_merchant_feed.py
```

#### Output

- `frontend/public/merchant-center.xml` (public feed URL)

**Note:** Keep `data/merchant_pricing.json` updated with official
provider pricing so the feed stays compliant. Files under `artifacts/`
are gitignored and intended for local inspection only.

### `validate_merchant_feed.py` (Merchant Center)

Validates that:
- pricing entries are USD-only with sources and valid `last_checked` dates
- pricing entries map to hardware wallet anchors
- feed items are hardware wallets with USD pricing

#### Usage

```bash
./scripts/validate_merchant_feed.py
```

Pricing sources and exclusions: `MERCHANT_FEED.md`.

### `verify-crypto-cards.js` (Cards)

Checks card pages with Playwright (headless Chromium), which gets past some bot walls that plain fetches hit.

```bash
node scripts/verify-crypto-cards.js gnosis-pay   # one card
node scripts/verify-crypto-cards.js all
```

### `setup-git-hooks.sh`

Sets `core.hooksPath` to `.githooks`, which enforces the commit format and blocks direct pushes to `main`.

### `recompute_scores.py` (Score Totals)

Recalculates totals in scoring breakdown tables for software and hardware
wallets. This only updates totals where the per-category columns already exist.

This is separate from `sync_table_scores.js`, which regenerates the public
comparison-table score cells from the visible columns.

#### Usage

```bash
./scripts/recompute_scores.py
```


### `verify-ramps.py` (Ramps)

Verifies ramp provider URLs from `RAMPS.md` using a direct fetch plus
`r.jina.ai` proxy as a fallback to detect bot challenges.

#### Usage

```bash
./scripts/verify-ramps.py
```

It also downloads the ESMA MiCA CASP register
(`https://www.esma.europa.eu/sites/default/files/2024-12/CASPS.csv`, 30s timeout,
UTF-8 BOM / latin-1 tolerant), matches each RAMPS row by website host
(case, `www.` and trailing slash normalised; a register host that is a parent
domain of the ramp host also matches) and records `mica_status`
(`authorised`, `authorisation_ended`, `no_host_match` (no register host matched; not proof of non-registration)) plus `mica_detail`
(entity, home state, authorisation date, services). This is report-only:
`RAMPS.md` is never edited. If the download fails, a warning is printed, the
URL checks run as before, the MiCA fields stay `not_checked` and the exit code
is unchanged. Offline test: `tests/verify-ramps-mica.test.ts` (runs under vitest).

#### Output

- `artifacts/ramps-url-checks.json` (includes `mica_status` / `mica_detail`)
- `artifacts/ramps-url-checks.txt` (each line ends with `mica=<status>`)

### `refresh-github-data.sh` (Software Wallets)

Queries GitHub for **EVM software wallet** activity.

Queries the GitHub API to get the latest commit dates and activity status for all tracked wallet repositories. The tracked repos are discovered from the public `SOFTWARE_WALLETS.md` table, so adding or removing rows there automatically changes the refresh set.
If no token is available, it falls back to GitHub Atom feeds for the last commit date and attempts a best-effort HTML scrape for stars/issues.

#### Usage

```bash
# Basic usage - outputs to stdout
./scripts/refresh-github-data.sh

# JSON output for programmatic use
./scripts/refresh-github-data.sh --json

# Markdown table for documentation
./scripts/refresh-github-data.sh --markdown
```

#### Output formats

- Text (default): one line per repo with last commit date, days ago and status.
- `--json`: `generated` date plus a `wallets` array (`wallet`, `repo`, `lastCommit`, `daysAgo`, `status`, plus the fields below).
- `--markdown`: a table (`Wallet | Repository | Last Commit | Days Ago | Stars | Issues | Status`, then the fields below).

#### Token, release and licence fields

- `GITHUB_TOKEN` (or `GH_TOKEN`) is sent as a Bearer header via curl config on stdin, so it never appears in argv or output. Unauthenticated fallbacks (Atom feed, HTML scrape) are unchanged.
- Extra fields are appended after the existing ones: JSON `license` (SPDX id, `NONE` if absent), `archived`, `pushedAt`, `lastRelease`, `lastReleaseDate`; Markdown adds `License | Archived | Pushed | Last Release` columns at the end; text adds a trailing bracket. They are `?` when the API is rate limited.
- `lastRelease` uses `/releases/latest`; on 404 (e.g. `trezor/trezor-firmware`) it falls back to `/tags` (one page of 100) and takes the highest version-looking tag with its commit date, but only when the repo has fewer than 100 tags and one tag prefix. Otherwise (e.g. `trezor/trezor-firmware`: 100+ tags, `core/` and `secmon/` prefixes) it reports `?` rather than a possibly wrong tag. Tag order from GitHub is not chronological, so treat even this fallback as best-effort.
- `REPO_FILTER="owner/a,owner/b"` limits a run to those repos (useful for dry runs).

#### GitHub API Rate Limits

- **Without token:** 60 requests/hour. Each repo costs up to 5 calls (repo, commits, releases/latest, plus /tags and one commit lookup on the fallback), so roughly 12–20 repos per hour; use a token for full runs
- **With token:** 5,000 requests/hour

Set `GITHUB_TOKEN` for higher limits:

```bash
export GITHUB_TOKEN="<your token>"
./scripts/refresh-github-data.sh
```

Without a token the script uses Atom feeds for commit dates and a best-effort HTML scrape for stars and issues.

#### Activity Status Definitions

| Status | Days Since Last Commit | Meaning |
|--------|------------------------|---------|
| ✅ Active | ≤30 days | Actively maintained |
| ⚠️ Slow | 31-120 days | Reduced activity |
| ❌ Inactive | >120 days | Likely abandoned |

## Automation

Two GitHub Actions run every Monday. Both open a PR; a human reviews and merges.

| Workflow | Time (UTC) | What it does |
|---|---|---|
| `.github/workflows/refresh-wallet-data.yml` | 09:00 | Runs both refresh scripts and opens a PR (branch `auto/refresh-wallet-data`) with `ACTIVITY_STATUS.md`, `HARDWARE_ACTIVITY_STATUS.md` and `data/*.json`. It does not edit the comparison tables. |
| `.github/workflows/generate-merchant-feed.yml` | 10:00 | Regenerates and validates `frontend/public/merchant-center.xml`, then opens a PR if it changed. |

Table values (prices, licences, audits, custody) are checked by hand against primary sources. See `docs/VERIFICATION.md`.

## Data Directory

The `data/` directory contains checked-in structured data used by generators,
including `merchant_pricing.json`. Write temporary refresh outputs to
`artifacts/`, which is ignored by git.

---

### `refresh-hardware-wallet-data.sh` (Hardware Wallets)

Queries GitHub for **hardware wallet firmware** activity. Includes stars, issues, and issue/star ratio when the API is available.
If no token is set, the script falls back to Atom feeds for last-commit dates and attempts a best-effort HTML scrape for stars/issues.

#### Usage

```bash
# Basic usage - outputs to stdout
./scripts/refresh-hardware-wallet-data.sh

# JSON output for programmatic use
./scripts/refresh-hardware-wallet-data.sh --json

# Markdown table for documentation
./scripts/refresh-hardware-wallet-data.sh --markdown
```

The tracked repos are discovered from `HARDWARE_WALLETS.md`. The script only follows rows with a public GitHub firmware repo and dedupes shared repos such as the Trezor and BitBox product lines.

**Closed Source / not firmware-tracked:** Ledger, NGRAVE, Ellipal, SafePal, SecuX, Tangem, BC Vault, GridPlus

---

## Adding New Wallets

### For Software Wallets

Add or update the row in `SOFTWARE_WALLETS.md`. If the GitHub column links to a public repo, the refresh script will pick it up automatically.

### For Hardware Wallets

Add or update the row in `HARDWARE_WALLETS.md`. Public firmware repos with `✅ Full` open source are discovered automatically; SDK-only and non-firmware links are skipped.

## Requirements

- `bash` (4.0+)
- `curl`
- `jq`
- `date` (GNU or BSD)

### `check_freshness.js` (Table freshness)

Reads each table's `**Last Updated:**` line and reports age in days. Warns past 30 days; `--strict` exits 1 past 90 days or when the line is missing. Runs monthly in `external-links.yml`.

```bash
bun scripts/check_freshness.js [--strict]
```

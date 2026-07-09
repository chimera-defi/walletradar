# WalletRadar Root Cleanup Audit - 2026-07-09

## Guardrails
- Preserve canonical table rows: software 27, hardware 34, cards 45, ramps 22.
- Do not close or alter issue #57; manual malware false-positive appeal remains human-assisted.
- Do not change Wirex classification without official-source research; issue #58 tracks that work.
- Prefer status banners/redirects for historical docs over deletion unless import/link checks prove safe deletion.

## Baseline
- Branch: `codex/adversarial-cleanup-plan-2026-07-09`
- Baseline commit: `a4bf0d246447d0a86d40f47c7028f9e1108d188a`
- Open PRs before execution: none.
- Issue #57: open, manual malware false-positive appeal.
- Issue #58: open, Wirex custody/product-split research.
- Protected rows: software 27, hardware 34, cards 45, ramps 22.

## Folder Review Checklist
| Area | Status | Findings | Action |
|------|--------|----------|--------|
| repo root docs | reviewed | Stale standalone URLs, stale row counts, and legacy snapshot ambiguity. | Updated source links/counts; added legacy banners and canonical links. |
| `.claude/` state | reviewed | Dream state points to malware appeal follow-up. | Left issue #57 open for manual action. |
| `.github/` workflows/templates | reviewed | No active edit needed in this pass. | Verify CI on PR. |
| scripts | reviewed | Merchant feed generator used old `wallets/` paths; script docs had stale command examples. | Fixed generator paths and script README examples. |
| data/seo/branding/articles | reviewed | Data files were not restructured; SEO and branding docs had standalone path residue. | Updated SEO/LLM/branding references; preserved data files. |
| frontend app routes | reviewed | Homepage/docs links pointed at old monorepo URLs. | Updated to standalone repo and current merchant feed docs. |
| frontend components | reviewed | Card comparison tool still exposed duplicate legacy Provider row instead of Custody. | Replaced with Custody row and CSV column. |
| frontend libs/types | reviewed | Markdown config referenced two removed docs. | Removed missing docs from config; kept current documents. |
| frontend public/LLM/OG assets | reviewed | `llms.txt` had old monorepo pricing link and omitted major doc routes. | Updated `llms.txt` with current routes and repo source. |
| tests | reviewed | No guards existed for stale standalone links or missing markdown config files. | Added smoke guards and card custody comparison/export guard. |

## Decisions
- Keep issue #57 open; malware false-positive appeal requires manual help.
- Keep issue #58 open; Wirex product/custody split needs separate official-source research.
- Keep historical migration docs unless import/link checks prove safe deletion.
- Do not create a shared frontend taxonomy abstraction in this pass; the duplication inventory did not show enough safe repetition to justify broad churn.
- Retain `EXTRACT_STUB_PLAN.md` as a historical runbook; it is explicitly marked non-active and explains old monorepo migration commands.
- Retain legacy comparison snapshots with status banners rather than deleting historical rows.

## Verification Log
- `git status --short --branch && git rev-parse HEAD` - clean feature branch at `a4bf0d246447d0a86d40f47c7028f9e1108d188a`.
- `gh pr list --state open --json number,title,url --limit 20` - no open PRs.
- `gh issue view 57 --json number,title,state,url` - open.
- `gh issue view 58 --json number,title,state,url` - open.
- Protected row count command - software 27, hardware 34, cards 45, ramps 22.
- Initial `cd frontend && bun run test` after adding guards - failed on stale standalone paths and missing markdown config entries, as expected.
- `cd frontend && bun run test` after fixes - passed, including standalone link, markdown config, and card custody comparison/export guards.
- `./scripts/generate_merchant_feed.py --output /tmp/walletradar-merchant-center.xml` - failed before script fix on `wallets/HARDWARE_WALLETS.md`, then passed after fix with non-empty output.
- `./scripts/validate_merchant_feed.py` - passed.
- `./scripts/generate_merchant_feed.py` - regenerated `frontend/public/merchant-center.xml` without diff.
- `bun scripts/sync_table_scores.js --write && bun scripts/sync_table_scores.js` - all four tables and detail snapshots clean.
- Protected row identity check against `origin/main` - software 27/27, hardware 34/34, cards 45/45, ramps 22/22, no missing rows.
- Stale standalone scan - only remaining matches are historical changelog/migration-runbook references.
- Local adversarial review found one over-broad replacement in an Ethereum.org wallet-finder URL; restored `/en/wallets/find-wallet/`.
- Devin delegated review found stale standalone paths in `frontend/README.md`, `branding/README.md`, `branding/NAMING_WORKFLOW.md`, and generated naming JSON source metadata; fixed all and extended smoke guard coverage.
- Final full suite after review fixes - `bun scripts/sync_table_scores.js`, merchant feed generation/validation, `cd frontend && bun run test && bun run lint && bun run build && bun run type-check && bun run validate-cards` all passed.
- Static export route smoke after final build - `/`, `/docs`, `/docs/software-wallets`, `/docs/hardware-wallets`, `/docs/crypto-cards`, `/docs/ramps`, `/explore`, `/llms.txt`, and `/merchant-center.xml` returned `200` with non-empty payloads.
- Final expanded stale scan - only remaining matches are `CHANGELOG.md` historical removed-file note and `EXTRACT_STUB_PLAN.md` historical migration runbook.
- Final `git diff --check` - clean.
- Final protected row identity check - software 27/27, hardware 34/34, cards 45/45, ramps 22/22, no missing rows.

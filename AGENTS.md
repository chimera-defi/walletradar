# WalletRadar Agent Rules

Curated from root-level guidance in the former monorepo (`.cursorrules`, `AGENTS.md`, `CLAUDE.md`) plus WalletRadar-specific practices. This file intentionally excludes unrelated legacy/mobile-framework instructions.

## First Move For Discovery

- If file location is unknown, start with scoped search:
  - `rg -n -g '*.md' 'keyword'`
  - `rg -n -g 'frontend/src/**/*.ts*' 'keyword'`
- If location is known, read only the needed section (`sed -n`, `head`, `tail`).
- Do not begin exploration with broad recursive scans:
  - `find .`, `ls -R`, `grep -R`, `rg --files .`, broad `**/*` globs.

## Token Efficiency Defaults

- Keep responses concise and directly actionable.
- Prefer targeted reads over full-file reads.
- Parallelize independent reads/searches when possible.
- If candidate files exceed 5, narrow scope before reading more.

## Verification Before Reporting

- Never report results you did not verify.
- After running scripts, confirm artifacts exist and are populated.
- For structured outputs (JSON/CSV/XML), validate parseability and required fields.
- If claiming metrics, ensure they are traceable to actual output/calculation code.

## Data Integrity Rules (WalletRadar)

- No data-loss restructures: preserve existing columns/rows unless removal is explicitly approved.
- Chains are networks, not token counts (`chains != tokens`).
- When uncertain, use conservative labels (for example `Multi-chain` / `Unknown`) instead of invented precision.
- Use `~` for volatile values (prices/fees) unless freshly verified.
- Keep cross-document consistency when values appear in multiple files.
- Run line-by-line verification for final comparison tables.

## Wallet/Product Evaluation Rules

- Core software-wallet criteria require both browser extension and mobile app.
- Verify source of truth in this order: official docs/site, GitHub, trusted structured sources.
- Release cadence is a stability signal (very high churn can be a risk for dev workflows).
- Distinguish clearly: open-source vs source-available vs proprietary.

## Documentation Rules

- Keep one clear source of truth per comparison type.
- Consolidate by organizing, not by deleting useful context.
- Update dependent references when renaming files/paths.
- Prefer explicit change notes over silent structural edits.

## Git Workflow Rules

- Use branch + PR workflow; do not push directly to `main`.
- Keep one task per PR where practical.
- Before handing off, run relevant verification commands for touched scope.

Frontend typical checks:

```bash
cd frontend
npm run type-check
npm run build
npm run lint
npm test
```

## Scope Guardrails

- Keep this repo focused on WalletRadar (wallets/hardware/cards/ramps/data + frontend).
- Do not import unrelated monorepo practices that are not applicable here (for example mobile-app framework scaffolding rules).

## Companion Reference

- See `AGENT_META_LEARNINGS.md` for curated rationale and durable patterns.

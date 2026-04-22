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

## Product Knowledge Location

- Keep agent behavior rules in `AGENTS.md`; keep product data/methodology in domain docs.
- Canonical product/scoring docs:
  - `SOFTWARE_WALLETS.md`
  - `HARDWARE_WALLETS.md`
  - `CRYPTO_CARDS.md`
  - `RAMPS.md`
  - `CONTRIBUTING.md` (scoring implementation + update workflow)

## Documentation Rules

- Keep one clear source of truth per comparison type.
- Consolidate by organizing, not by deleting useful context.
- Update dependent references when renaming files/paths.
- Prefer explicit change notes over silent structural edits.

## Frontend Development Rules

- Use `bun` by default — never `npm` or `node` for script execution.
- Development: `bun install && bun run dev`
- Full verification pass (in order):
  1. `bun run lint` — no warnings or errors
  2. `bun run type-check` — TypeScript clean
  3. `bun run build` — build succeeds
  4. `bun test` — tests pass
  5. Check for unused imports
  6. Verify light **and** dark mode both look correct
  7. Test all interactive elements

### OG Image Workflow

When adding or updating a page with SEO metadata:
1. Add the generator function to `scripts/generate-og-images.js`
2. Run `bun run generate-og`
3. Add metadata to the page file
4. Commit the generated PNG alongside the code change

OG images must be **1200×630px**. Key SEO files: `src/lib/seo.ts`, `src/app/layout.tsx`.

Run `bun run validate-cards` to verify Twitter Card metadata before shipping.

### Theme-Aware Styling

- **Never hardcode Tailwind colors** (`text-slate-100`, `bg-slate-800`, etc.) for themed content.
- **Always use CSS variables:** `text-foreground`, `text-muted-foreground`, `bg-muted`, `bg-card`, `border-border`.
- Variables are defined in `globals.css` under `:root` (light) and `.dark`.
- Hardcoded colors silently break the light/dark toggle.

### Component Conventions

- Use Next.js `<Image>` instead of `<img>` — required for optimization and ESLint compliance.
- Replace `alert()` with inline state-based notifications.
- Remove placeholder/fake-data components before shipping.
- Avoid showing the same nav links in multiple formats (e.g., buttons AND a grid).

### File Rename Checklist

When renaming a data file or page route, check all of these:
1. Update markdown config / route mapping
2. Update parsing functions referencing old name
3. Update cross-references in other docs
4. Update related document mappings
5. Update sitemap logic
6. Update scripts (`wallet-data.ts`, `generate-og-images.js`, etc.)
7. `rg` for remaining references to old name
8. Run `bun run build` and `bun run type-check`

## Git Workflow Rules

- Use branch + PR workflow; do not push directly to `main`.
- Keep one task per PR where practical.
- Before handing off, run relevant verification commands for touched scope.

## Scope Guardrails

- Keep this repo focused on WalletRadar (hardware/cards/ramps/data + frontend).
- Do not import unrelated monorepo practices that are not applicable here (for example mobile-app framework scaffolding rules).

## Companion Reference

- See `AGENT_META_LEARNINGS.md` for curated rationale and durable patterns.

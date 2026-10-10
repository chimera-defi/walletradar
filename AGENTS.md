# WalletRadar Agent Guide

Static Next.js site (`frontend/`) generated from the markdown comparison tables at the repo root. Product data and scoring live in the docs; code only parses and renders them.

## Layout
- Root `*.md`: data tables (`SOFTWARE_WALLETS`, `HARDWARE_WALLETS`, `CRYPTO_CARDS`, `RAMPS`, `QR_PAYMENTS` + `*_DETAILS`) and site pages (`README`, `ABOUT`, `CONTRIBUTING`, `GLOSSARY`, `DATA_SOURCES`, `CHANGELOG`). Which files the site renders: `frontend/src/lib/markdown.ts`.
- `frontend/`: the app (static export to `out/`). `scripts/`: data tooling, see `scripts/README.md`. `tests/`: vitest unit tests. `data/`, `articles/`, `branding/`, `seo/`: inputs.
- Scoring methodology and the update workflow: `CONTRIBUTING.md`. Do not restate it elsewhere.

## Commands (Bun only)
- Setup/dev: `cd frontend && bun install && bun run dev`
- Verify, in order: `bun run lint`, `bun run type-check`, `bun run test` (data smoke test), `bun run build`; from the repo root `bunx vitest run tests/`.
- After editing a score table: `bun scripts/sync_table_scores.js --write`, then re-run the smoke test.
- Weekly data refresh and merchant feed run from `.github/workflows/`; scripts are in `scripts/`.

## Invariants
- No data-loss restructures: keep existing rows/columns unless removal is approved.
- Chains are networks, not token counts. Use conservative labels (`Multi-chain`, `Unknown`) over invented precision; `~` for volatile values.
- Source order: official docs/site, then GitHub, then trusted structured sources. Distinguish open-source / source-available / proprietary.
- A value that appears in several docs must stay consistent; the smoke test enforces table shape and score math.
- Never report results you did not verify; confirm generated artifacts exist and parse.

## Gotchas
- Static export: Next runtime headers do not apply; security headers live in `customHttp.yml`. Amplify builds with `npm ci` (`frontend/package-lock.json`); local work uses Bun (`bun.lock`).
- Theme: use CSS-variable classes (`text-foreground`, `bg-card`, `border-border`), never hardcoded Tailwind colors; they break the light/dark toggle.
- Use `next/image`, not `<img>`. OG images are 1200x630; new pages need a generator in `frontend/scripts/generate-og-images.js` (`bun run generate-og`) and the PNG committed.
- Renaming a data file or route: update `markdown.ts`, `wallet-data.ts`, `seo.ts`, sitemap, nav/footer, OG script, then `rg` for the old name.

## Git and attribution (enforced by CI)
- Branch + PR only; never push to `main`. One task per PR.
- Commit header `type(scope): subject` and trailer `Co-authored-by: Chimera <chimera_defi@protonmail.com>`.
- PR body follows `.github/pull_request_template.md`: `**Agent:** <actual model>`, `**Co-authored-by:** Chimera <chimera_defi@protonmail.com>`, and the Summary / Original Request / Changes Made / Testing & Verification sections.

# Maintenance State
last_run: 2026-09-04
focus: dead-code
status: completed
completed:
  - refactor(analytics): remove dead export `GA_MEASUREMENT_ID` — only used internally, no external import
  - refactor(search-data): delete unused `WalletCategory` type export — never referenced outside module
  - refactor(search-data): remove export from `generateSearchData` — called only internally by `getSearchData`
in_progress:
pending: []
known_failures:
  - node_modules not installed (fresh checkout) — TS errors for missing modules persist until bun install
  - postcss via next@14 — requires next@16 major bump, deferred
  - sharp — requires 0.35.3 major bump, deferred
  - next itself CVE (<15.5.10) — requires major upgrade, deferred
skip_next_run: []
attempt_counts:

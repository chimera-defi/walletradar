# Maintenance State
last_run: 2026-08-25
focus: ts-cleanup
status: completed
completed:
  - fix(ts-cleanup): explicit :string annotations on 3 implicit-any callback params (articles.ts, wallet-data.ts)
  - fix(ts-cleanup): cast RequestInit.next in defillama.ts to satisfy TS2353
  - fix(tsconfig): add "types":["node"] so @types/node resolves when node_modules is installed
in_progress:
pending: []
known_failures:
  - node_modules not installed (fresh checkout) — TS errors for missing modules persist until `bun install`
  - postcss via next@14 — requires next@16 major bump, deferred
  - sharp — requires 0.35.3 major bump, deferred
  - next itself CVE (<15.5.10) — requires major upgrade, deferred
  - PR #63 (chore/maintenance-2026-07-15) open with earlier security fixes — unmerged
skip_next_run: []
attempt_counts:

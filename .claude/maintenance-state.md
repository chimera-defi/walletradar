# Maintenance State
last_run: 2026-09-03
focus: tests
status: completed
completed:
  - test(explore-url-state): add 48 unit tests for parseSortState, serializeSortState, parseSearchParam, normalizeFilterState, parseFilterState, serializeFilterState, clearControlledQueryParams — previously zero coverage (PR #72)
in_progress:
pending: []
known_failures:
  - node_modules not installed (fresh checkout) — TS errors for missing modules persist until bun install
  - postcss via next@14 — requires next@16 major bump, deferred
  - sharp — requires 0.35.3 major bump, deferred
  - next itself CVE (<15.5.10) — requires major upgrade, deferred
skip_next_run: []
attempt_counts:

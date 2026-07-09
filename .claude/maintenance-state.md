# Maintenance State
last_run: 2026-06-23
focus: ts-cleanup
status: completed
completed:
  - tsc --noUnusedLocals pass — 6 errors fixed: setSearchQuery, comparisonDocs, useMemo, ScoreBreakdownPreview, parseRecommendation, parseHardwareRecommendation
  - dead code scan — repo is clean; Tuesday TS cleanup (PR #47) already removed all dead code
  - removed 6 unused symbols — useMemo from SearchFilter.tsx, ScoreBreakdownPreview from WalletTable.tsx, parseRecommendation + parseHardwareRecommendation from wallet-data.ts, setSearchQuery setter from DocsContent.tsx, allDocs + comparisonDocs from docs/[slug]/page.tsx; tsc --noEmit and lint pass clean
in_progress:
pending: []
known_failures:
  - no CI configured for walletradar — historical June 12 note; later PR attribution/commit-message checks are configured
  - canvas postinstall script fails in sandbox — use --ignore-scripts
  - PR #47 (chore/maintenance-2026-06-09) superseded by this branch (same fixes on rebased main)
skip_next_run: []
attempt_counts:

## Dead Code Scan Notes (2026-06-12)
- rg TODO/FIXME/HACK: no results
- rg dead console.log (non-test): no results
- rg @ts-ignore/@ts-nocheck: no results
- Dead functions already removed in PR #47 (parseRecommendation, parseHardwareRecommendation)
- Repo is clean — no actionable dead code found

# Maintenance State
last_run: 2026-06-23
focus: ts-cleanup
status: completed
completed: [removed 6 unused symbols — useMemo from SearchFilter.tsx, ScoreBreakdownPreview from WalletTable.tsx, parseRecommendation + parseHardwareRecommendation from wallet-data.ts, setSearchQuery setter from DocsContent.tsx, allDocs + comparisonDocs from docs/[slug]/page.tsx; tsc --noEmit and lint pass clean]
in_progress:
pending: []
known_failures:
  - canvas postinstall script fails in sandbox — use --ignore-scripts
  - PR #47 (chore/maintenance-2026-06-09) superseded by this branch (same fixes on rebased main)
skip_next_run: []

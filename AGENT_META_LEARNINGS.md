# WalletRadar Agent Meta Learnings

Last curated: 2026-04-21
Source set: former monorepo root `.cursorrules`, `AGENTS.md`, `CLAUDE.md`, plus WalletRadar historical guidance.

## What Was Intentionally Carried Over

- Token-efficient discovery patterns.
- Verification-first execution and anti-hallucination checks.
- Data-integrity discipline for comparison tables.
- Git/PR workflow discipline.
- Wallet-specific evaluation and scoring consistency rules.

## What Was Intentionally Excluded

- Mobile-framework-specific build/scaffold rules (Valdi/Flutter/React Native).
- Benchmark harness and local-model routing guidance unrelated to WalletRadar product work.
- Monorepo-only paths/hooks that do not exist in this standalone repository.

## Durable Practices

### 1) Discovery Discipline

- Start with narrow, scoped search (`rg -g`) before reading files.
- Avoid broad recursive scans that inflate context and increase noise.
- Read only relevant slices of large files.

### 2) Verification-First Delivery

- Do not trust completion claims without checking artifacts.
- Validate existence, timestamps, structure, and non-empty required fields.
- Never publish unverified numbers or metrics.

### 3) Data Integrity in Tables

- Preserve schema and rows unless explicit deletion is requested.
- Validate arithmetic consistency in score breakdowns.
- Keep values synchronized across summary and detail docs.
- Prefer conservative truth over synthetic precision.

### 4) Wallet Domain Accuracy

- `chains` means blockchain networks, not assets/tokens.
- Verify platform claims (mobile/browser/desktop) from primary sources.
- Treat activity status as time-sensitive and re-verify regularly.

### 5) Documentation Hygiene

- Consolidate by structuring and clarifying, not by dropping context.
- Keep rename/refactor checklists so dependent files stay aligned.
- Preserve editorial transparency for methodology and data sources.

### 6) Delivery Workflow

- Branch + PR workflow for significant changes.
- Run relevant build/type/lint/test checks before handoff.
- Separate migration/mechanical changes from content-methodology changes where possible.

## Practical Review Checklist

Use this before finalizing major updates:

- [ ] Search strategy was scoped, not broad-recursive.
- [ ] All changed claims are source-verifiable.
- [ ] No data-loss introduced in core comparison tables.
- [ ] Score math and labels are internally consistent.
- [ ] Cross-doc references/links still resolve.
- [ ] Touched build/test checks have been run or explicitly called out.

## Notes For Future Curations

When importing future "agent wisdom" into WalletRadar, prefer principles over platform-specific mechanics. If a rule depends on tooling that does not exist in this repo, rewrite it as a tool-agnostic behavior rule.

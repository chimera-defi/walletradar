# WalletRadar Agent Meta Learnings

Last curated: 2026-04-26
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
- Monorepo-only paths and product-specific mobile scaffolding that do not exist in this standalone repository.

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

### 7) Workflow Enforcement (Ported From ETC Monorepo)

These are now concrete guardrails in this repo:

- CI workflow: `.github/workflows/wallets-frontend-ci.yml`
  - checks score/table drift, card-tier extraction stability, lint, type-check, tests, build, and twitter-card validation.
- CI workflow: `.github/workflows/pr-attribution-check.yml`
  - enforces required PR description sections and attribution.
- CI workflow: `.github/workflows/commit-message-check.yml`
  - enforces commit header structure and warns on missing agent/co-author metadata.
- Local hooks: `.githooks/commit-msg`, `.githooks/pre-push`
  - enforce commit format + co-author trailer and block direct pushes to `main`/`master`.
- Hook bootstrap script: `scripts/setup-git-hooks.sh`
  - standardizes `core.hooksPath` setup across contributors.

Operational expectation: these checks are not optional. If a guard fails, fix the root cause rather than bypassing the guard.

## Domain Scoring Frameworks

### Software Wallet: API Openness Matrix

| Symbol | Category | Meaning |
|--------|----------|---------|
| ✅ | Full | Backend open-source + self-hostable |
| ⚠️ | Partial | Some APIs open, core proprietary |
| 🌐 | Public | APIs accessible, code proprietary |
| ❌ | Closed | Proprietary, no public access |

Examples: Safe = Full (8+ open services), Rabby = Public (DeBank API, no auth required).

### Hardware Wallet: 100-Point Scoring System

| Category | Points | Key signals |
|----------|--------|-------------|
| Security Architecture | 25 | Secure Element, air-gap, tamper resistance |
| Transparency | 20 | Open firmware, reproducible builds |
| Privacy & Trust | 15 | No seed extraction capability |
| Development Activity | 15 | GitHub commit cadence |
| Company & Track Record | 15 | Funding, longevity, past incidents |
| UX & Ecosystem | 10 | Display quality, chain count, integrations |

Score thresholds: 🟢 75+ | 🟡 50–74 | 🔴 <50

### Crypto Card: Custody Scoring

- Self-custody: **+3 pts**
- CeFi custody: **0 pts**
- Exchange custody: **−3 pts**

Verify custody type from official sources — look for "self-custody", "non-custodial", or "your keys" language.

### Data Columns to Preserve

Core columns that must not be silently dropped from comparison tables:

`Chains`, `Rel/Mo`, `RPC`, `GitHub`, `Testnets`, `Audits`, `Last Commit`, `Stars`, `Issues`, `Ratio`, `Stability`

### Wallet Activity & Abandonment Signals

Decay heuristics (treat as time-sensitive — re-verify before publishing):
- No commits for **4+ months** → flag as potentially inactive
- No releases for **6+ months** → flag as potentially abandoned
- Issue response time > 60 days → low maintenance signal

Wallets with known risk factors (as of last audit):
- **Taho** — slow activity, grant-dependent funding model
- **Wigwam** — slow releases, unknown funding
- **Coinbase Wallet SDK** — pace slowed significantly as of mid-2025

### Merchant Feed Rules

- Use provider-site pricing only — no third-party aggregators.
- Skip free-tier categories and items without a verified price.
- Do not publish fee ranges that cannot be traced to a source URL.
- Research inputs go to `data/` (tracked) or local scratch (gitignored); durable notes go to `MERCHANT_FEED.md`.

## Practical Review Checklist

Use this before finalizing major updates:

- [ ] Search strategy was scoped, not broad-recursive.
- [ ] All changed claims are source-verifiable.
- [ ] No data-loss introduced in core comparison tables.
- [ ] Score math and labels are internally consistent.
- [ ] Cross-doc references/links still resolve.
- [ ] Touched build/test checks have been run or explicitly called out.
- [ ] Theme verified in both light and dark mode (frontend changes).
- [ ] OG images generated and committed (new pages only).
- [ ] PR description follows `.github/pull_request_template.md`.
- [ ] Multi-pass review completed (data pass, product pass, regression pass).
- [ ] Local hooks enabled via `bash scripts/setup-git-hooks.sh`.

## Notes For Future Curations

When importing future "agent wisdom" into WalletRadar, prefer principles over platform-specific mechanics. If a rule depends on tooling that does not exist in this repo, rewrite it as a tool-agnostic behavior rule.

# Crypto Card Custody Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify every crypto-card custody classification in WalletRadar against official sources, correct confirmed errors, and keep generated scores and dependent copy consistent.

**Architecture:** Treat `CRYPTO_CARDS.md` as the canonical data source, with `CRYPTO_CARDS_DETAILS.md`, `VERIFICATION_NOTES.md`, `CHANGELOG.md`, and frontend parsing/scoring code as dependent consumers. Use read-only delegate agents for official-source research, then make local edits only after cross-checking evidence and preserving all existing rows and columns.

**Tech Stack:** Markdown comparison tables, `scripts/sync_table_scores.js`, frontend TypeScript parser/scoring code, Bun-based verification.

---

## File Map

- Modify after evidence: `CRYPTO_CARDS.md` for custody labels, generated `Score`, recommendation, summary, FAQ, and last-updated text.
- Modify if affected rows are documented there: `CRYPTO_CARDS_DETAILS.md` for long-form custody model sections and generated snapshot.
- Modify if new evidence should be durable: `VERIFICATION_NOTES.md` and `CHANGELOG.md`.
- Read for parser/scoring constraints: `frontend/src/lib/wallet-data.ts`, `frontend/src/lib/scoring.js`, `frontend/src/types/wallets.ts`.
- Run after edits: `bun scripts/sync_table_scores.js --write`, `cd frontend && bun run test`, and targeted markdown parsing checks.

## Custody Labels

- `🔐 Self`: self-custody or non-custodial; user controls keys or smart-account funds until spend authorization.
- `🏦 Exch`: exchange custody; funds are held on a centralized exchange account.
- `📋 CeFi`: centralized finance/card-platform custody; company, issuer, or app holds balances outside user-controlled keys, but not primarily an exchange wallet.

## Task 1: Inventory Current Custody State

**Files:**
- Read: `CRYPTO_CARDS.md`
- Read: `frontend/src/lib/wallet-data.ts`
- Read: `frontend/src/lib/scoring.js`

- [ ] Step 1: Extract all rows from the first `CRYPTO_CARDS.md` table.

Run:

```bash
python3 - <<'PY'
from pathlib import Path
lines = Path('CRYPTO_CARDS.md').read_text().splitlines()
for i, line in enumerate(lines, 1):
    if line.startswith('| [') or line.startswith('| ~~['):
        cells = [c.strip() for c in line.strip('|').split('|')]
        print(f'{i}: {cells[0]} => {cells[3]}')
PY
```

Expected: one line per card row with no missing custody cells.

- [ ] Step 2: Confirm frontend supports only `self`, `exchange`, and `cefi`.

Run:

```bash
sed -n '234,244p' frontend/src/lib/wallet-data.ts
sed -n '660,668p' frontend/src/lib/scoring.js
```

Expected: `parseCustodyType` maps Self/Exch/CeFi and `parseCustodyScore` scores the same three classes.

## Task 2: Delegate Official-Source Research

**Files:**
- Read-only: `CRYPTO_CARDS.md`
- No edits by delegate agents.

- [ ] Step 0: Confirm the second pass covers every current row, not a sample.

Current required inventory from `CRYPTO_CARDS.md`:

| # | Card | Current custody | Status |
|---|------|-----------------|--------|
| 1 | EtherFi Cash | 🔐 Self | ✅ |
| 2 | Amp Pay Black Card | 🔐 Self | ✅ |
| 3 | Crypto.com Visa | 🏦 Exch | ✅ |
| 4 | Ready Card | 🔐 Self | ✅ |
| 5 | Tria | 🔐 Self | ✅ |
| 6 | KuCard | 🏦 Exch | ✅ |
| 7 | MetaMask Card | 🔐 Self | ✅ |
| 8 | Fold Card | 📋 CeFi | ✅ |
| 9 | Jupiter Card | 🔐 Self | ⚠️ |
| 10 | Revolut Crypto | 📋 CeFi | ✅ |
| 11 | Bybit Card | 🏦 Exch | ⚠️ |
| 12 | Gnosis Pay | 🔐 Self | ✅ |
| 13 | Hi Card | 📋 CeFi | ⚠️ |
| 14 | ThorWallet | 🔐 Self | ✅ |
| 15 | Payy | 🔐 Self | ✅ |
| 16 | Wirex Card | 📋 CeFi | ⚠️ |
| 17 | 1inch Card | 🔐 Self | ✅ |
| 18 | Avici Money | 🔐 Self | ✅ |
| 19 | Gemini Card | 🏦 Exch | ✅ |
| 20 | Kast | 📋 CeFi | ✅ |
| 21 | Coinbase Card | 🏦 Exch | ✅ |
| 22 | Plasma One | 🔐 Self | ⚠️ |
| 23 | Plutus Card | 📋 CeFi | ✅ |
| 24 | RedotPay | 📋 CeFi | ✅ |
| 25 | Nexo Card | 📋 CeFi | ✅ |
| 26 | CryptoSpend | 📋 CeFi | ✅ |
| 27 | ToonPay Card | 📋 CeFi | ✅ |
| 28 | Fuse Wallet Card | 🔐 Self | ✅ |
| 29 | Reap | 📋 CeFi | ✅ |
| 30 | Spendly | 📋 CeFi | ✅ |
| 31 | Shakepay Card | 📋 CeFi | ✅ |
| 32 | Tuyo | 🔐 Self | ✅ |
| 33 | Uphold Card | 📋 CeFi | ⚠️ |
| 34 | Meow Card | 📋 CeFi | ✅ |
| 35 | Solflare Card | 🔐 Self | ✅ |
| 36 | OKX Card | 🔐 Self | 🔄 |
| 37 | BitPay Card | 📋 CeFi | ✅ |
| 38 | Slash Platinum Card | 📋 CeFi | ✅ |
| 39 | Bitget Wallet Card | 🔐 Self | ⚠️ |
| 40 | Binance Card | 🏦 Exch | ✅ |
| 41 | CoinJar Card | 🏦 Exch | ⚠️ |
| 42 | Kraken Card | 🏦 Exch | 🔄 |
| 43 | Swissborg Card | 📋 CeFi | ⚠️ |
| 44 | Kontigo | 🔐 Self | ❌ |
| 45 | Nummus Wallet Card | 🔐 Self | ⚠️ |

Acceptance for this step: every one of the 45 names appears exactly once across delegate reports.

- [ ] Step 1: Dispatch delegate batch A for rows currently marked `🔐 Self`, with KAST called out as highest priority.

Run:

```bash
devin-delegate --task "Classify as research. Goal: verify WalletRadar crypto-card custody labels for rows currently marked Self, prioritizing KAST. Workspace: /home/agents/workspace/walletradar/.worktrees/main. Scope: CRYPTO_CARDS.md rows marked 🔐 Self only. Constraints: read-only; do not edit files; use official provider docs/sites/terms first, then trusted secondary sources only if official sources are unavailable; distinguish self-custody from centralized card-platform custody; use labels exactly Self, Exch, or CeFi. Acceptance: for each row, report CLEAN or FINDING with card name, current label, recommended label, official URL, evidence summary, and confidence. Include KAST even if no official custody statement is found." --workspace /home/agents/workspace/walletradar/.worktrees/main
```

Expected: bounded custody report covering all `🔐 Self` rows.

- [ ] Step 2: Dispatch delegate batch B for rows marked `🏦 Exch` or `📋 CeFi`.

Run:

```bash
devin-delegate --task "Classify as research. Goal: verify WalletRadar crypto-card custody labels for exchange and CeFi rows. Workspace: /home/agents/workspace/walletradar/.worktrees/main. Scope: CRYPTO_CARDS.md rows marked 🏦 Exch or 📋 CeFi only. Constraints: read-only; do not edit files; use official provider docs/sites/terms first; identify any row that should be Self or should switch between Exch and CeFi; use labels exactly Self, Exch, or CeFi. Acceptance: for each row, report CLEAN or FINDING with card name, current label, recommended label, official URL, evidence summary, and confidence." --workspace /home/agents/workspace/walletradar/.worktrees/main
```

Expected: bounded custody report covering all non-self rows.

- [ ] Step 3: Dispatch a red-team delegate specifically against the surprising self-custody claims.

Run:

```bash
devin-delegate --task "Classify as review/research. Goal: adversarially verify whether these current Self labels are actually justified: OKX Card, Nummus Wallet Card, Jupiter Card, Plasma One, Bitget Wallet Card, Kontigo. Workspace: /home/agents/workspace/walletradar/.worktrees/main. Constraints: read-only; do not edit files; use official provider docs, terms, FAQs, and card/payment program pages first; do not accept wallet-level self-custody if the card spending balance is held by an exchange or card platform; if evidence only proves a wallet product but not the card product, recommend CeFi or Exch conservatively. Acceptance: one line per card with CLEAN or FINDING, current label, recommended label, official URL(s), evidence summary, and confidence. OKX Card must include a direct answer to: Is the card spend balance exchange custody, or do stablecoins remain in the user's self-custodial wallet until authorization? No preamble." --workspace /home/agents/workspace/walletradar/.worktrees/main
```

Expected: focused review of high-risk `Self` rows, especially OKX.

## Task 3: Local Evidence Cross-Check

**Files:**
- Read: `CRYPTO_CARDS.md`
- Read official URLs returned by delegates.

- [ ] Step 1: Independently verify KAST first.

Run web/source checks for official KAST website, FAQ, terms, or support pages. Classify KAST as:

- `Self` only if official sources state non-custodial/self-custody/user-controlled keys or equivalent smart-account custody.
- `CeFi` if official sources describe a KAST account/balance, card wallet, or platform-controlled stablecoin account without user-controlled keys.
- `Unknown` is not allowed in the current schema; if custody cannot be verified, use conservative `CeFi` and explain the evidence gap in notes.

- [ ] Step 2: Cross-check every delegate `FINDING`.

For each finding, open the official URL and verify that the evidence supports the recommended label. If evidence conflicts, prefer the conservative classification and document the uncertainty.

- [ ] Step 3: Independently verify every current `🔐 Self` row.

Do not rely only on delegate summaries. For each self-custody row, local review must identify at least one official source that ties self-custody to the card or spend path, not merely to a separate wallet product. If that evidence cannot be found, downgrade to `📋 CeFi` or `🏦 Exch` based on the actual custodian.

- [ ] Step 4: Red-team OKX Card.

OKX can only remain `🔐 Self` if an official OKX Card / OKX Pay source states that card-spend funds remain in the user's wallet until authorization or purchase. If the evidence is only that OKX Wallet is self-custodial, change OKX Card back to `🏦 Exch` or `📋 CeFi` and record why.

## Task 4: Patch Confirmed Data Errors

**Files:**
- Modify: `CRYPTO_CARDS.md`
- Modify if impacted: `CRYPTO_CARDS_DETAILS.md`
- Modify if impacted: `VERIFICATION_NOTES.md`
- Modify: `CHANGELOG.md`

- [ ] Step 1: Update custody labels only for confirmed errors.

Keep the row order and all table columns intact. Do not delete rows. If changing `🔐 Self` to `📋 CeFi` or `🏦 Exch`, also update `Best For` copy if it says self-custody or non-custodial.

- [ ] Step 2: Update dependent summary text.

Remove corrected cards from non-custodial lists, FAQ answers, TL;DR recommendations, and long-form details. Add a dated correction note with the official-source rationale.

- [ ] Step 3: Regenerate generated fields.

Run:

```bash
bun scripts/sync_table_scores.js --write
```

Expected: scores/recommendations and generated snapshots update consistently.

## Task 5: Verify Before Reporting

**Files:**
- Read: `CRYPTO_CARDS.md`
- Read: changed docs and generated data consumers.

- [ ] Step 1: Run a custody-table parse check.

Run:

```bash
python3 - <<'PY'
from pathlib import Path
valid = {'🔐 Self', '🏦 Exch', '📋 CeFi'}
rows = []
for i, line in enumerate(Path('CRYPTO_CARDS.md').read_text().splitlines(), 1):
    if line.startswith('| [') or line.startswith('| ~~['):
        cells = [c.strip() for c in line.strip('|').split('|')]
        rows.append((i, cells[0], cells[3]))
bad = [(i, name, custody) for i, name, custody in rows if custody not in valid]
print(f'rows={len(rows)}')
if bad:
    for item in bad:
        print('BAD', item)
    raise SystemExit(1)
PY
```

Expected: `rows=45` and no `BAD` output.

- [ ] Step 2: Run frontend/data tests.

Run:

```bash
cd frontend && bun run test
```

Expected: exit code 0.

- [ ] Step 3: Review diff line by line before final summary.

Run:

```bash
git diff -- CRYPTO_CARDS.md CRYPTO_CARDS_DETAILS.md VERIFICATION_NOTES.md CHANGELOG.md docs/superpowers/plans/2026-06-14-crypto-card-custody-audit.md
```

Expected: every changed custody label has official-source evidence and every dependent reference is consistent.

## Task 6: Publish Workflow

**Files:**
- Modify: changed docs/data files only.

- [ ] Step 1: Check upstream PR state.

Run:

```bash
gh pr list --state open --limit 20 --json number,title,headRefName,baseRefName,isDraft,url,author
```

Expected: if open PRs exist, publish this work as a new PR; do not push directly to `main`.

- [ ] Step 2: Commit with required attribution.

Run:

```bash
git add CHANGELOG.md CRYPTO_CARDS.md CRYPTO_CARDS_DETAILS.md VERIFICATION_NOTES.md docs/superpowers/plans/2026-06-14-crypto-card-custody-audit.md
git commit -m "fix: verify crypto card custody labels" -m "Agent: GPT-5.5" -m "Co-authored-by: Chimera <chimera_defi@protonmail.com>"
```

Expected: one focused commit with model attribution and the required co-author trailer.

- [ ] Step 3: Push the branch and open a PR.

Run:

```bash
git push -u origin audit/crypto-card-custody-2026-06-14
gh pr create --title "fix: verify crypto card custody labels" --body-file /tmp/walletradar-custody-pr.md
```

Expected: PR description includes `**Agent:** GPT-5.5` and `**Co-authored-by:** Chimera <chimera_defi@protonmail.com>`.

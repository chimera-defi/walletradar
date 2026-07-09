# WalletRadar Adversarial Cleanup Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Perform a repo-root-to-frontend adversarial cleanup pass that removes stale standalone-migration residue, prevents data loss, verifies no regressions, and lands the cleaned result through a reviewed PR.

**Architecture:** Treat the four canonical comparison tables as protected data sources and run row-identity checks before and after every risky cleanup. Clean first the standalone repository boundary (`wallets/` path and old monorepo links), then docs routing and legacy docs, then scripts, then frontend shared code/refactor candidates. Every deletion or consolidation must have a source/reference check proving the file is not rendered, imported, linked, or needed for historical context.

**Tech Stack:** Markdown source documents, Next.js 14 static export, Bun scripts/tests, Python utility scripts, GitHub PR/issue workflow, repo-local data sync via `scripts/sync_table_scores.js`.

---

## File Map

### Protected Data Sources
- `SOFTWARE_WALLETS.md` - canonical software wallet table; preserve 27 rows.
- `HARDWARE_WALLETS.md` - canonical hardware wallet table; preserve 34 rows.
- `CRYPTO_CARDS.md` - canonical crypto card table; preserve 45 rows.
- `RAMPS.md` - canonical ramp provider table; preserve 22 rows.
- `*_DETAILS.md` files - generated snapshots and long-form methodology; preserve generated snapshot consistency.
- `VERIFICATION_NOTES.md`, `CHANGELOG.md` - durable evidence and history; update only to clarify current status.

### Likely Cleanup Targets
- `frontend/src/lib/brand.ts` - still points GitHub and issue links at `chimera-defi/Etc-mono-repo`.
- `frontend/src/app/page.tsx` - homepage source tile still links to the old monorepo `wallets/` path.
- `frontend/src/app/docs/[slug]/page.tsx` - Merchant Feed link still points to the old monorepo `wallets/MERCHANT_FEED.md`.
- `frontend/public/llms.txt` - LLM discovery file still links to the old monorepo pricing/exclusions path.
- `ABOUT.md`, `DATA_SOURCES.md`, `MALWARE_ALERT_HANDOFF.md` - still include old monorepo GitHub/issue URLs.
- `scripts/README.md`, `MERCHANT_FEED.md`, `CONTRIBUTING.md`, `SEO_IMPLEMENTATION.md`, `GLOSSARY.md` - contain standalone-repo-stale `wallets/` path examples.
- `scripts/generate_merchant_feed.py` - currently fails in the standalone repo because it reads `wallets/HARDWARE_WALLETS.md`.
- `scripts/sync_table_scores.js` - generated detail snapshots still say `wallets/scripts/...`, which is stale in the standalone repo.
- `frontend/src/lib/markdown.ts` - document config still includes removed docs `walletconnect-wallet-research.md` and `HARDWARE_WALLET_RESEARCH_TASKS.md`.
- `CRYPTO_CREDIT_CARD_COMPARISON.md`, `HARDWARE_WALLET_COMPARISON.md`, `WALLET_COMPARISON_UNIFIED.md` - legacy root docs need status banners and links to canonical current docs if retained.
- `STUB_README_TEMPLATE.md`, `EXTRACT_STUB_PLAN.md` - historical monorepo migration docs; keep only if clearly marked historical.
- `SEO_IMPLEMENTATION.md`, `seo/llm-citations/**`, `frontend/public/llms.txt` - LLM/SEO docs need current standalone paths and current source-of-truth references.

### Verification Surfaces
- `frontend/scripts/smoke-test-wallet-data.js`
- `scripts/sync_table_scores.js`
- `scripts/validate_merchant_feed.py`
- `scripts/generate_merchant_feed.py`
- `frontend/scripts/validate-twitter-cards.js`
- `frontend/src/app/sitemap.ts`
- `frontend/src/lib/search-data.ts`
- `frontend/src/lib/markdown.ts`

---

## Task 1: Establish Clean Baseline And Audit Ledger

**Files:**
- Create: `docs/superpowers/audits/2026-07-09-root-cleanup-audit.md`
- Read: repository root, `.claude/*.md`, `README.md`, `AGENTS.md`, `CLAUDE.md`

- [ ] **Step 1: Confirm branch and clean worktree**

Run:

```bash
git status --short --branch
git rev-parse HEAD
gh pr list --state open --json number,title,url --limit 20
gh issue view 57 --json number,title,state,url
gh issue view 58 --json number,title,state,url
```

Expected:
- Branch is not `main` when edits begin.
- Worktree is clean before edits.
- Open PR list is empty unless new cleanup PR exists.
- Issue #57 remains open for manual malware follow-up.
- Issue #58 remains open for Wirex custody/product-split research.

- [ ] **Step 2: Capture protected table row counts**

Run:

```bash
bun --eval "const fs=require('fs'); const cfg=[['SOFTWARE_WALLETS.md','| Wallet |'],['HARDWARE_WALLETS.md','| Wallet |'],['CRYPTO_CARDS.md','| Card |'],['RAMPS.md','| Provider |']]; function rows(file, header){const lines=fs.readFileSync(file,'utf8').split(/\\r?\\n/); const start=lines.findIndex(line=>line.startsWith(header)); const out=[]; for(let i=start+2;i>=2&&i<lines.length&&lines[i].startsWith('|');i+=1) out.push(lines[i]); return out;} for(const [file, header] of cfg) console.log(file+'\\t'+rows(file, header).length);"
```

Expected:

```text
SOFTWARE_WALLETS.md  27
HARDWARE_WALLETS.md  34
CRYPTO_CARDS.md      45
RAMPS.md             22
```

- [ ] **Step 3: Create audit ledger**

Create `docs/superpowers/audits/2026-07-09-root-cleanup-audit.md` with this exact starting structure:

```markdown
# WalletRadar Root Cleanup Audit - 2026-07-09

## Guardrails
- Preserve canonical table rows: software 27, hardware 34, cards 45, ramps 22.
- Do not close or alter issue #57; manual malware false-positive appeal remains human-assisted.
- Do not change Wirex classification without official-source research; issue #58 tracks that work.
- Prefer status banners/redirects for historical docs over deletion unless import/link checks prove safe deletion.

## Folder Review Checklist
| Area | Status | Findings | Action |
|------|--------|----------|--------|
| repo root docs | pending | | |
| `.claude/` state | pending | | |
| `.github/` workflows/templates | pending | | |
| scripts | pending | | |
| data/seo/branding/articles | pending | | |
| frontend app routes | pending | | |
| frontend components | pending | | |
| frontend libs/types | pending | | |
| frontend public/LLM/OG assets | pending | | |
| tests | pending | | |

## Decisions
- Pending.

## Verification Log
- Pending.
```

- [ ] **Step 4: Commit only the plan/audit scaffold if execution will be split**

Run only if stopping after planning:

```bash
git add docs/superpowers/plans/2026-07-09-adversarial-cleanup-review.md docs/superpowers/audits/2026-07-09-root-cleanup-audit.md
git commit -m "docs: plan adversarial cleanup review" -m "Agent: GPT-5.5" -m "Co-authored-by: Chimera <chimera_defi@protonmail.com>"
```

Expected: commit passes local attribution check.

---

## Task 2: Standalone Repository Link And Path Hygiene

**Files:**
- Modify: `frontend/src/lib/brand.ts`
- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/src/app/docs/[slug]/page.tsx`
- Modify: `frontend/public/llms.txt`
- Modify: `ABOUT.md`
- Modify: `DATA_SOURCES.md`
- Modify: `MALWARE_ALERT_HANDOFF.md`
- Modify: `scripts/README.md`
- Modify: `MERCHANT_FEED.md`
- Modify: `CONTRIBUTING.md`
- Modify: `SEO_IMPLEMENTATION.md`
- Modify: `GLOSSARY.md`

- [ ] **Step 1: Write a failing stale-link check**

Add a standalone-link guard to `frontend/scripts/smoke-test-wallet-data.js` near the other file-content guards:

```js
function assertNoStaleStandaloneLinks() {
  const repoRoot = path.resolve(FRONTEND_DIR, '..');
  const filesToCheck = [
    'ABOUT.md',
    'DATA_SOURCES.md',
    'MALWARE_ALERT_HANDOFF.md',
    'MERCHANT_FEED.md',
    'README.md',
    'CONTRIBUTING.md',
    'SEO_IMPLEMENTATION.md',
    'GLOSSARY.md',
    'scripts/README.md',
    'frontend/public/llms.txt',
    'frontend/src/lib/brand.ts',
    'frontend/src/app/page.tsx',
    'frontend/src/app/docs/[slug]/page.tsx',
  ];
  const stalePatterns = [
    /github\.com\/chimera-defi\/Etc-mono-repo\/(?:tree|blob)\/main\/wallets/i,
    /github\.com\/chimera-defi\/Etc-mono-repo\/issues/i,
    /`wallets\/(?!` module)/i,
    /node wallets\/scripts\//i,
    /cd wallets\/frontend/i,
    /\/home\/user\/Etc-mono-repo\/wallets/i,
  ];

  const allowlist = new Set([
    'EXTRACT_STUB_PLAN.md',
    'STUB_README_TEMPLATE.md',
  ]);

  const failures = [];
  for (const relativePath of filesToCheck) {
    if (allowlist.has(relativePath)) continue;
    const content = readFileOrFail(path.join(repoRoot, relativePath));
    for (const pattern of stalePatterns) {
      if (pattern.test(content)) failures.push(`${relativePath}: ${pattern}`);
    }
  }

  if (failures.length) {
    fail(`stale standalone links/paths found:\n${failures.join('\n')}`);
  } else {
    ok('standalone repo links and command paths are current');
  }
}
```

Then call it near the end of the smoke test before `Done.`:

```js
assertNoStaleStandaloneLinks();
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd frontend && bun run test
```

Expected: FAIL with stale references in at least `frontend/src/lib/brand.ts`, `frontend/public/llms.txt`, `scripts/README.md`, and `ABOUT.md`.

- [ ] **Step 3: Replace old repository URLs with standalone URLs**

Use these replacements:

| Old | New |
|-----|-----|
| `https://github.com/chimera-defi/Etc-mono-repo/tree/main/wallets` | `https://github.com/chimera-defi/walletradar` |
| `https://github.com/chimera-defi/Etc-mono-repo/blob/main/wallets/MERCHANT_FEED.md` | `https://github.com/chimera-defi/walletradar/blob/main/MERCHANT_FEED.md` |
| `https://github.com/chimera-defi/Etc-mono-repo/issues` | `https://github.com/chimera-defi/walletradar/issues` |

For command/path examples, remove the `wallets/` prefix:

| Old | New |
|-----|-----|
| `node wallets/scripts/sync_table_scores.js --write` | `bun scripts/sync_table_scores.js --write` |
| `node wallets/scripts/sync_table_scores.js` | `bun scripts/sync_table_scores.js` |
| `cd wallets/frontend` | `cd frontend` |
| `wallets/frontend/src/lib/scoring.js` | `frontend/src/lib/scoring.js` |
| `wallets/data/merchant_pricing.json` | `data/merchant_pricing.json` |
| `wallets/frontend/public/merchant-center.xml` | `frontend/public/merchant-center.xml` |
| `wallets/artifacts/` | `artifacts/` |

Leave `wallets/` references only in `EXTRACT_STUB_PLAN.md` and `STUB_README_TEMPLATE.md`, because those are explicitly historical migration docs.

- [ ] **Step 4: Run stale-link check again**

Run:

```bash
cd frontend && bun run test
```

Expected: PASS for the new standalone-link guard and all existing smoke tests.

---

## Task 3: Fix Merchant Feed Generator Standalone Regression

**Files:**
- Modify: `scripts/generate_merchant_feed.py`
- Modify: `scripts/README.md`
- Modify: `MERCHANT_FEED.md`
- Test: `scripts/validate_merchant_feed.py`

- [ ] **Step 1: Verify current generator failure**

Run:

```bash
./scripts/generate_merchant_feed.py --output /tmp/walletradar-merchant-center.xml
```

Expected before fix:

```text
FileNotFoundError: [Errno 2] No such file or directory: 'wallets/HARDWARE_WALLETS.md'
```

- [ ] **Step 2: Patch script paths relative to repo root**

In `scripts/generate_merchant_feed.py`, replace path constants with repo-root-aware paths:

```python
BASE_DIR = Path(__file__).resolve().parents[1]

TABLE_FILES = {
    "hardware": BASE_DIR / "HARDWARE_WALLETS.md",
}
PRICING_FILE = BASE_DIR / "data" / "merchant_pricing.json"
```

Change default output:

```python
parser.add_argument("--output", default=str(BASE_DIR / "frontend" / "public" / "merchant-center.xml"))
```

In the loop, keep path objects:

```python
for _, path in TABLE_FILES.items():
    content = path.read_text(encoding="utf-8").splitlines()
```

- [ ] **Step 3: Run generator and validator**

Run:

```bash
./scripts/generate_merchant_feed.py --output /tmp/walletradar-merchant-center.xml
test -s /tmp/walletradar-merchant-center.xml
./scripts/validate_merchant_feed.py
```

Expected:
- `/tmp/walletradar-merchant-center.xml` exists and is non-empty.
- `Merchant feed validation passed`.

- [ ] **Step 4: Run production feed regeneration check without unwanted diff**

Run:

```bash
./scripts/generate_merchant_feed.py
git diff -- frontend/public/merchant-center.xml
```

Expected:
- Either no diff, or a reviewed deterministic diff that is committed with the script fix.

---

## Task 4: Remove Stale Markdown Routing And Add Guard

**Files:**
- Modify: `frontend/src/lib/markdown.ts`
- Modify: `frontend/scripts/smoke-test-wallet-data.js`

- [ ] **Step 1: Write failing config-file existence guard**

Add this helper to `frontend/scripts/smoke-test-wallet-data.js`:

```js
function assertMarkdownConfigFilesExist() {
  const markdownSource = readFileOrFail(path.join(FRONTEND_DIR, 'src', 'lib', 'markdown.ts'));
  const configuredFiles = Array.from(markdownSource.matchAll(/^\s+'([^']+\.md)':\s*\{/gm)).map((match) => match[1]);
  const repoRoot = path.resolve(FRONTEND_DIR, '..');
  const missing = configuredFiles.filter((filename) => !fs.existsSync(path.join(repoRoot, filename)));
  if (missing.length) {
    fail(`markdown config references missing files: ${missing.join(', ')}`);
  } else {
    ok(`markdown config files exist (${configuredFiles.length} files)`);
  }
}
```

Call it near the end of the smoke test:

```js
assertMarkdownConfigFilesExist();
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd frontend && bun run test
```

Expected: FAIL mentioning `walletconnect-wallet-research.md` and `HARDWARE_WALLET_RESEARCH_TASKS.md`.

- [ ] **Step 3: Remove missing docs from markdown config**

Remove these entries from `DOCUMENT_CONFIG` in `frontend/src/lib/markdown.ts`:

```ts
  'walletconnect-wallet-research.md': {
    title: 'WalletConnect Research',
    description: 'Original detailed research on WalletConnect-compatible wallets',
    category: 'research',
    order: 4,
  },
  'HARDWARE_WALLET_RESEARCH_TASKS.md': {
    title: 'Hardware Wallet Research Tasks',
    description: 'Ongoing research tasks for hardware wallet analysis',
    category: 'research',
    order: 4,
  },
```

Do not remove any existing root markdown file from the config in this task.

- [ ] **Step 4: Run test to verify pass**

Run:

```bash
cd frontend && bun run test
```

Expected: PASS and log `markdown config files exist`.

---

## Task 5: Canonicalize Generated Scoring Path Copy

**Files:**
- Modify: `scripts/sync_table_scores.js`
- Modify generated snapshots in:
  - `SOFTWARE_WALLETS_DETAILS.md`
  - `HARDWARE_WALLETS_DETAILS.md`
  - `CRYPTO_CARDS_DETAILS.md`
  - `RAMPS_DETAILS.md`
- Modify scoring notes in:
  - `SOFTWARE_WALLETS.md`
  - `HARDWARE_WALLETS.md`
  - `CRYPTO_CARDS.md`
  - `RAMPS.md`

- [ ] **Step 1: Patch generator copy**

In `scripts/sync_table_scores.js`, replace generated copy references:

```js
`by \`wallets/scripts/sync_table_scores.js\` using methodology`
```

with:

```js
`by \`scripts/sync_table_scores.js\` using methodology`
```

Also replace the source-of-truth note helper text:

```js
`via \`wallets/scripts/sync_table_scores.js\``
```

with:

```js
`via \`scripts/sync_table_scores.js\``
```

- [ ] **Step 2: Regenerate score snapshots**

Run:

```bash
bun scripts/sync_table_scores.js --write
bun scripts/sync_table_scores.js
```

Expected: second command reports all tables and details as `clean`.

- [ ] **Step 3: Patch non-generated scoring notes**

Replace stale `wallets/scripts/sync_table_scores.js` and `wallets/frontend/src/lib/scoring.js` references in the four table/detail docs with standalone paths:

```text
scripts/sync_table_scores.js
frontend/src/lib/scoring.js
```

- [ ] **Step 4: Run stale path scan**

Run:

```bash
rg -n 'wallets/scripts/sync_table_scores|wallets/frontend/src/lib/scoring' SOFTWARE_WALLETS.md SOFTWARE_WALLETS_DETAILS.md HARDWARE_WALLETS.md HARDWARE_WALLETS_DETAILS.md CRYPTO_CARDS.md CRYPTO_CARDS_DETAILS.md RAMPS.md RAMPS_DETAILS.md scripts/sync_table_scores.js
```

Expected: no output.

---

## Task 6: Root Legacy Doc Triage

**Files:**
- Modify: `WALLET_COMPARISON_UNIFIED.md`
- Modify: `HARDWARE_WALLET_COMPARISON.md`
- Modify: `CRYPTO_CREDIT_CARD_COMPARISON.md`
- Modify if needed: `README.md`
- Modify if needed: `frontend/src/lib/markdown.ts`

- [ ] **Step 1: Verify whether legacy docs are rendered**

Run:

```bash
rg -n 'WALLET_COMPARISON_UNIFIED|HARDWARE_WALLET_COMPARISON|CRYPTO_CREDIT_CARD_COMPARISON' README.md frontend/src *.md
```

Expected: identify all root/frontend references before editing.

- [ ] **Step 2: Add status banners instead of deleting**

At the top of each retained legacy doc, add a status banner:

```markdown
> **Legacy snapshot:** This document is retained for historical context. The current source of truth is [SOFTWARE_WALLETS.md](./SOFTWARE_WALLETS.md) and [SOFTWARE_WALLETS_DETAILS.md](./SOFTWARE_WALLETS_DETAILS.md).
```

For hardware:

```markdown
> **Legacy snapshot:** This document is retained for historical context. The current source of truth is [HARDWARE_WALLETS.md](./HARDWARE_WALLETS.md) and [HARDWARE_WALLETS_DETAILS.md](./HARDWARE_WALLETS_DETAILS.md).
```

For cards:

```markdown
> **Legacy snapshot:** This document is retained for historical context. The current source of truth is [CRYPTO_CARDS.md](./CRYPTO_CARDS.md) and [CRYPTO_CARDS_DETAILS.md](./CRYPTO_CARDS_DETAILS.md).
```

If `CRYPTO_CREDIT_CARD_COMPARISON.md` already has a banner, verify it uses current standalone wording and do not duplicate it.

- [ ] **Step 3: Update cross-links away from legacy docs**

Within current canonical docs, replace links to legacy docs with canonical docs. Do not rewrite legacy docs exhaustively except for their banner and obvious broken links.

- [ ] **Step 4: Run link/reference scan**

Run:

```bash
rg -n 'WALLET_COMPARISON_UNIFIED|HARDWARE_WALLET_COMPARISON|CRYPTO_CREDIT_CARD_COMPARISON' README.md frontend/src SOFTWARE_WALLETS*.md HARDWARE_WALLETS*.md CRYPTO_CARDS*.md DATA_SOURCES.md ABOUT.md
```

Expected: no current canonical doc points readers to legacy docs as the latest source of truth.

---

## Task 7: README And Public Metadata Accuracy

**Files:**
- Modify: `README.md`
- Modify: `frontend/public/llms.txt`
- Modify: `frontend/src/lib/brand.ts`
- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/src/app/docs/[slug]/page.tsx`

- [ ] **Step 1: Update README counts**

Replace stale counts in `README.md`:

```markdown
- **[SOFTWARE_WALLETS.md](./SOFTWARE_WALLETS.md)** — Software wallet comparison (27 wallets)
- **[HARDWARE_WALLETS.md](./HARDWARE_WALLETS.md)** — Hardware wallet comparison (34 devices)
- **[CRYPTO_CARDS.md](./CRYPTO_CARDS.md)** — Crypto credit card comparison (45 cards)
- **[RAMPS.md](./RAMPS.md)** — On/off-ramp provider comparison (22 providers)
```

- [ ] **Step 2: Update `llms.txt` standalone source links**

Set `frontend/public/llms.txt` to current standalone links:

```text
# Wallet Radar - LLM Discovery

Site: https://walletradar.org
Docs: https://walletradar.org/docs
Software wallets: https://walletradar.org/docs/software-wallets
Hardware wallets: https://walletradar.org/docs/hardware-wallets
Crypto cards: https://walletradar.org/docs/crypto-cards
Ramps: https://walletradar.org/docs/ramps
Merchant Center feed (hardware wallets): https://walletradar.org/merchant-center.xml
Pricing/exclusions: https://github.com/chimera-defi/walletradar/blob/main/MERCHANT_FEED.md

Notes:
- Merchant feed includes hardware wallets with verified USD pricing only.
- Software wallets, ramps, and most cards are excluded from the feed.
- Canonical data lives in the standalone WalletRadar repository: https://github.com/chimera-defi/walletradar
```

- [ ] **Step 3: Build and route-check `llms.txt`**

Run:

```bash
cd frontend && bun run build
python3 -m http.server 3100 -d out
curl -L -s http://127.0.0.1:3100/llms.txt | sed -n '1,40p'
```

Expected: `llms.txt` includes `github.com/chimera-defi/walletradar`, not `Etc-mono-repo`.

Stop the static server after the check.

---

## Task 8: Frontend Refactor Review And Low-Risk Consolidation

**Files to inspect before changing:**
- `frontend/src/lib/markdown.ts`
- `frontend/src/lib/wallet-data.ts`
- `frontend/src/lib/search-data.ts`
- `frontend/src/lib/wallet-filtering.ts`
- `frontend/src/lib/explore-presets.ts`
- `frontend/src/types/wallets.ts`
- `frontend/src/components/WalletBadges.tsx`
- `frontend/src/components/WalletFilters.tsx`
- `frontend/src/components/WalletTable.tsx`
- `frontend/src/components/EnhancedMarkdownRenderer.tsx`

- [ ] **Step 1: Generate duplication inventory**

Run:

```bash
rg -n "software-wallets|hardware-wallets|crypto-cards|ramps|Custody|Score|Rec|recommendation|self-custody|exchange|cefi" frontend/src/lib frontend/src/components frontend/src/app | sed -n '1,240p'
```

Expected: identify repeated constants and copy without editing yet.

- [ ] **Step 2: Decide whether a shared abstraction is worth it**

Only create a shared abstraction if it removes repeated mappings across at least three files without changing runtime behavior. Candidate abstraction:

```ts
// frontend/src/lib/product-taxonomy.ts
export const DOC_ROUTE_SLUGS = {
  software: 'software-wallets',
  hardware: 'hardware-wallets',
  cards: 'crypto-cards',
  ramps: 'ramps',
} as const;
```

Do not create a broad registry if it forces churn across unrelated components.

- [ ] **Step 3: If refactoring, add or extend smoke guards first**

For any new shared taxonomy module, add smoke checks that:
- all configured docs exist,
- all wallet profile routes generated by `sitemap.ts` still map to parsed products,
- search-data category counts match parsed data counts.

Run:

```bash
cd frontend && bun run test
```

Expected before implementation: either failing guard if a real inconsistency exists, or passing guard if it only locks current behavior.

- [ ] **Step 4: Keep refactor scoped**

Acceptable changes:
- Move duplicated route slugs or display names to a small shared module.
- Replace direct old repo URLs with `brand.githubUrl` / `brand.issuesUrl`.
- Remove unused imports or stale comments discovered by TypeScript/lint.

Do not:
- Rewrite `WalletTable.tsx` broadly in this pass.
- Change scoring behavior.
- Change product classifications.
- Change UI layout.

---

## Task 9: Data-Loss And Regression Verification

**Files:**
- Read: all changed files.
- No edits unless verification exposes a defect.

- [ ] **Step 1: Run protected row identity check**

Run:

```bash
bun --eval "const { execFileSync } = require('child_process'); const fs=require('fs'); const cfg=[['SOFTWARE_WALLETS.md','| Wallet |'],['HARDWARE_WALLETS.md','| Wallet |'],['CRYPTO_CARDS.md','| Card |'],['RAMPS.md','| Provider |']]; function content(ref,file){return ref==='worktree'?fs.readFileSync(file,'utf8'):execFileSync('git',['show',ref+':'+file],{encoding:'utf8'});} function rows(md, header){const lines=md.split(/\\r?\\n/); const start=lines.findIndex(line=>line.startsWith(header)); const out=[]; for(let i=start+2;i>=2&&i<lines.length&&lines[i].startsWith('|');i+=1) out.push(lines[i].split('|')[1].trim().replace(/~~/g,'')); return out;} let failed=false; for(const [file,header] of cfg){const before=rows(content('origin/main',file),header); const after=rows(content('worktree',file),header); const missing=before.filter(x=>!after.includes(x)); console.log(file+': before='+before.length+', after='+after.length+', missing='+missing.length); if(missing.length){failed=true; console.log('missing: '+missing.join(', '));}} process.exit(failed?1:0);"
```

Expected: no missing rows. If rows were intentionally added, added rows must be listed in the PR body.

- [ ] **Step 2: Run complete local verification**

Run:

```bash
bun scripts/sync_table_scores.js
./scripts/validate_merchant_feed.py
cd frontend && bun run test
cd frontend && bun run lint
cd frontend && bun run build
cd frontend && bun run type-check
cd frontend && bun run validate-cards
```

Expected:
- Score sync reports all clean.
- Merchant feed validation passes.
- Test/lint/build/type-check pass.
- Twitter card validation passes, or failures are reviewed and fixed.

- [ ] **Step 3: Static export smoke routes**

Run:

```bash
cd frontend
python3 -m http.server 3100 -d out
for path in / /docs /docs/software-wallets /docs/hardware-wallets /docs/crypto-cards /docs/ramps /explore /llms.txt /merchant-center.xml; do
  code=$(curl -L -s -o /tmp/wr_page -w '%{http_code}' "http://127.0.0.1:3100$path")
  bytes=$(wc -c < /tmp/wr_page)
  echo "$path $code ${bytes}B"
done
```

Expected:
- Each route returns `200`.
- HTML routes have non-trivial byte sizes.
- `/llms.txt` and `/merchant-center.xml` are non-empty.

Stop the server after the check.

---

## Task 10: Adversarial Review Before Landing

**Files:**
- Read: full diff.
- No edits unless findings are confirmed.

- [ ] **Step 1: Review diff line by line**

Run:

```bash
git diff --stat origin/main...HEAD
git diff --check
git diff origin/main...HEAD
```

Expected:
- No whitespace errors.
- Every deletion has an explicit reason in the audit ledger.
- No canonical table rows removed.
- No issue #57 manual malware task closed or hidden.
- No Wirex classification changed without official-source evidence.

- [ ] **Step 2: Run stale artifact scans**

Run:

```bash
rg -n 'Etc-mono-repo|wallets/scripts|wallets/frontend|wallets/data|wallets/artifacts|/home/user/Etc-mono-repo|walletconnect-wallet-research|HARDWARE_WALLET_RESEARCH_TASKS|TODO|FIXME|HACK|TBD' README.md ABOUT.md DATA_SOURCES.md MERCHANT_FEED.md CONTRIBUTING.md SEO_IMPLEMENTATION.md GLOSSARY.md scripts frontend/src frontend/public *.md
```

Expected:
- Remaining `wallets/` references are either URL route paths such as `/wallets/software/...`, historical migration docs, or intentionally documented legacy content.
- Remaining `TBD` values are data-table unknowns, not execution placeholders.
- No missing-doc config references remain.

- [ ] **Step 3: Review issue/PR state**

Run:

```bash
gh pr list --state open --json number,title,url --limit 20
gh issue view 57 --json number,title,state,url
gh issue view 58 --json number,title,state,url
```

Expected:
- Only this cleanup PR should be open after creation.
- Issues #57 and #58 remain open unless the human explicitly resolved them.

---

## Task 11: Commit, Push, PR, CI, And Merge

**Files:**
- Stage only files changed by this plan.

- [ ] **Step 1: Commit with attribution**

Run:

```bash
git status --short
git add docs/superpowers/plans/2026-07-09-adversarial-cleanup-review.md docs/superpowers/audits/2026-07-09-root-cleanup-audit.md ABOUT.md DATA_SOURCES.md MALWARE_ALERT_HANDOFF.md MERCHANT_FEED.md README.md CONTRIBUTING.md SEO_IMPLEMENTATION.md GLOSSARY.md SOFTWARE_WALLETS.md SOFTWARE_WALLETS_DETAILS.md HARDWARE_WALLETS.md HARDWARE_WALLETS_DETAILS.md CRYPTO_CARDS.md CRYPTO_CARDS_DETAILS.md RAMPS.md RAMPS_DETAILS.md WALLET_COMPARISON_UNIFIED.md HARDWARE_WALLET_COMPARISON.md CRYPTO_CREDIT_CARD_COMPARISON.md scripts/README.md scripts/generate_merchant_feed.py scripts/sync_table_scores.js frontend/public/llms.txt frontend/src/lib/brand.ts frontend/src/lib/markdown.ts frontend/src/app/page.tsx frontend/src/app/docs/[slug]/page.tsx frontend/scripts/smoke-test-wallet-data.js
git commit -m "chore: clean standalone repo leftovers" -m "Agent: GPT-5.5" -m "Co-authored-by: Chimera <chimera_defi@protonmail.com>"
```

Expected: commit succeeds with `Co-authored-by` trailer.

- [ ] **Step 2: Push and create PR**

Run:

```bash
git push -u origin codex/adversarial-cleanup-plan-2026-07-09
```

Create a PR whose body contains:

```markdown
**Agent:** GPT-5.5

**Co-authored-by:** Chimera <chimera_defi@protonmail.com>

## Summary
- Clean standalone WalletRadar repo leftovers from docs, scripts, frontend links, and LLM metadata.
- Fix the merchant feed generator so it works from the standalone repository.
- Add smoke-test guards for stale standalone paths and missing markdown config files.

## Original Request
Create a root-to-folder adversarial cleanup pass, verify no data loss or regressions, preserve manual issue follow-ups, and land through a properly attributed PR after local and CI verification.

## Changes Made
- Replaced stale `chimera-defi/Etc-mono-repo/tree/main/wallets` and `wallets/...` command references with standalone `chimera-defi/walletradar` paths where they are current docs or app links.
- Updated generated scoring copy to point at `scripts/sync_table_scores.js` and regenerated affected comparison/detail snapshots.
- Removed removed-file entries from markdown document routing and documented retained legacy comparison snapshots.
- Updated `frontend/public/llms.txt` and public metadata links to current WalletRadar sources.
- Recorded audit decisions in `docs/superpowers/audits/2026-07-09-root-cleanup-audit.md`.

## Testing & Verification
- `bun scripts/sync_table_scores.js`
- `./scripts/generate_merchant_feed.py --output /tmp/walletradar-merchant-center.xml`
- `test -s /tmp/walletradar-merchant-center.xml`
- `./scripts/validate_merchant_feed.py`
- `cd frontend && bun run test`
- `cd frontend && bun run lint`
- `cd frontend && bun run build`
- `cd frontend && bun run type-check`
- `cd frontend && bun run validate-cards`
- Static export route smoke check for `/`, `/docs`, comparison docs, `/explore`, `/llms.txt`, and `/merchant-center.xml`
- Protected row identity check against `origin/main`: software 27, hardware 34, cards 45, ramps 22 with no missing rows
```

- [ ] **Step 3: Wait for CI**

Run:

```bash
gh pr checks <PR_NUMBER> --watch --interval 10
```

Expected:
- Check Commit Messages passes.
- Check PR Attribution passes.

- [ ] **Step 4: Merge after checks pass**

Run:

```bash
gh pr merge <PR_NUMBER> --merge --delete-branch
git fetch origin --prune
git switch main
git pull --ff-only
```

Expected:
- PR merges into `main`.
- Local `main` fast-forwards to `origin/main`.
- Worktree is clean.

---

## Self-Review Checklist

- [x] Plan starts from root-level repo state and proceeds folder by folder.
- [x] Plan protects canonical table rows and scoring sync.
- [x] Plan covers dream PR intent and reruns it as a concrete artifact/link cleanup.
- [x] Plan covers LLM docs and `llms.txt`.
- [x] Plan excludes manual malware appeal execution and keeps issue #57 open.
- [x] Plan keeps Wirex product/custody research in issue #58 unless separately sourced.
- [x] Plan includes red/failing checks before code fixes where a current bug exists.
- [x] Plan includes adversarial review and complete local verification before PR/merge.

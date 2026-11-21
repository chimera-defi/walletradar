# Contributing to Wallet Radar

Keep the tables accurate and sourced. Tables are the source of truth.

Agents and maintainers: the commit, attribution and PR rules live in [AGENTS.md](./AGENTS.md) ("Git and attribution").

## Outside contributors

Fixing a row, adding a product or correcting a source? You can open a PR from a fork. You do not need to follow our agent rules:

- No agent commit format and no `Co-authored-by` trailer.
- No agent PR template. Any clear description works (see [Pull Request Description](#pull-request-description)).
- PRs from forks skip the **Check Commit Messages** and **Check PR Attribution** jobs (`.github/workflows/commit-message-check.yml` and `pr-attribution-check.yml`; their `if` tests `head.repo.full_name`; PR #173).
- **Build & Lint** and **Vitest** still run. A maintainer has to approve the workflow runs for a fork PR before they start.
- Maintainers may push fix-up commits to your branch (a score re-sync, for example). Keep "Allow edits by maintainers" on.
- Vendors submitting their own product: say so in the PR. Every claim is checked against primary sources (official docs and site, then GitHub), and there is no pay-to-rank (see [Trust and transparency](./README.md#trust-and-transparency) in the README). PR #168 (ERA Wallet) is an example: the vendor submitted the row, and maintainers re-checked each claim and pushed fix-ups before merging.

Run the [checks](#before-you-open-a-pr) before you open the PR.

## Ground rules

These apply to everyone, people and agents.

- **No pay-to-rank.** Nobody can pay for a rank, an inclusion or a change to the method. Commercial links, if any, are labelled.
- **Sources.** Every claim links a source. Use official docs and sites first, then GitHub, then trusted structured sources such as WalletBeat. No shortened or redirect links.
- **Conservative values.** Prefer `Multi-chain` or `Unknown` to a number you cannot source. Use `~` for values that move. Chains are networks, not token counts.
- **Licences.** Tell open source, source-available and proprietary apart, and check the licence file in the repo, not just a badge.
- **No data loss.** Keep existing rows and columns. Removing one needs a maintainer's approval in the PR.
- **One source of truth.** The tables in `data/tables/` are the data. A value that appears in several docs must match everywhere. Scores come from the sync script; do not hand-edit them (see [Score Sync Workflow](#score-sync-workflow)).
- **Changelog.** Every data change gets a [CHANGELOG.md](./CHANGELOG.md) entry.
- **One change per PR.** A row fix and a code refactor go in separate PRs.

## Before you open a PR

Data changes:

```bash
bun scripts/sync_table_scores.js --write
cd frontend && bun run test
```

Code or docs changes, from `frontend/`:

```bash
bun install
bun run lint && bun run type-check && bun run test && bun run build
```

Then from the repo root: `bun install && bunx vitest run tests/`. CI runs the same jobs. For UI changes, also check the page in light and dark mode. Code gotchas (theme classes, `next/image`, OG images, renames) are in [AGENTS.md](./AGENTS.md).

## Licence of contributions

Wallet Radar is licensed under the [Business Source License 1.1](https://github.com/chimera-defi/walletradar/blob/main/LICENSE). By opening a PR you agree that:

- Your contribution is licensed under the same terms.
- The licensor (Chimera) may also license it under other terms, including commercial licences and the Change License.
- You have the right to submit it. Do not paste text, data or code you cannot share; link the source instead.

## Quick Links

### Software Wallets (EVM)
- **Main comparison:** [SOFTWARE_WALLETS.md](./data/tables/SOFTWARE_WALLETS.md) | [Details](./data/tables/SOFTWARE_WALLETS_DETAILS.md)
- **Refresh script:** [scripts/refresh-github-data.sh](https://github.com/chimera-defi/walletradar/blob/main/scripts/refresh-github-data.sh)

### Hardware Wallets (Cold Storage)
- **Hardware comparison:** [HARDWARE_WALLETS.md](./data/tables/HARDWARE_WALLETS.md) | [Details](./data/tables/HARDWARE_WALLETS_DETAILS.md)
- **Refresh script:** [scripts/refresh-hardware-wallet-data.sh](https://github.com/chimera-defi/walletradar/blob/main/scripts/refresh-hardware-wallet-data.sh)

### Crypto Cards
- **Card comparison:** [CRYPTO_CARDS.md](./data/tables/CRYPTO_CARDS.md) | [Details](./data/tables/CRYPTO_CARDS_DETAILS.md)

### Ramps (On/Off-Ramp Providers)
- **Ramp comparison:** [RAMPS.md](./data/tables/RAMPS.md) | [Details](./data/tables/RAMPS_DETAILS.md)

### QR Payments
- **QR payment comparison:** [QR_PAYMENTS.md](./data/tables/QR_PAYMENTS.md) | [Details](./data/tables/QR_PAYMENTS_DETAILS.md)
- No sync script covers this table, so its Score column is maintained by hand (method: Scoring Methodology in the details file).

---

## Score Sync Workflow

Scores and recommendation cells are generated from the visible table columns. Do not hand-edit the score cells unless you are also changing the underlying data.

Run this after any change to the comparison tables:

```bash
bun scripts/sync_table_scores.js --write
cd frontend
bun run test
```

What this does:

1. Recomputes `Score` and recommendation cells for software wallets, hardware wallets, cards, and ramps (`scripts/sync_table_scores.js` does not cover QR payments).
2. Sorts rows by computed score.
3. Refreshes the generated snapshot blocks near the top of the matching `*_DETAILS.md` files.
4. Fails the frontend smoke test if the markdown tables drift from the generated output.

Current methodology version: `2026-04-visible-columns-v3` (`SCORING_METHODOLOGY_VERSION` in `frontend/src/lib/scoring.js`).

### How the Rec mark is set

The Rec mark is a rank band, not a fixed score cutoff. `assignRecommendationBands` in `frontend/src/lib/scoring.js` sets it per table every time the sync script or the site build runs:

1. Inactive rows are 🔴 Avoid, whatever their score.
2. Software wallets only: a row with Core not full, or Developer Safety & Control of 10 or less, is ⚪ Not for dev.
3. The remaining rows (N of them) are sorted by score, lowest first. The bottom `floor(N × 0.25)` are 🔴 Avoid, the rows up to `floor(N × 0.5)` are 🟡 Situational, and the rest are 🟢 Recommended. Rows with equal scores keep their table order, so the cutoffs are rounded down and ties are not split by any other rule.
4. A row with status "launching" cannot be 🟢. It is capped at 🟡.

So the same score can land in different bands in different tables, and in the same table after other rows change. Never write a Rec by hand.

## Adding a New Software Wallet

### Prerequisites

Before adding a wallet, verify:

1. ✅ It's an EVM-compatible wallet (Ethereum, Polygon, Arbitrum, etc.)
2. ✅ It has been publicly released (not alpha/private beta)
3. ✅ It has a GitHub repo OR is a well-known proprietary wallet

### Step 1: Gather Required Data

The table header in `data/tables/SOFTWARE_WALLETS.md` (21 columns) is the contract; the smoke test (`frontend/scripts/smoke-test-wallet-data.js`) fails if it changes. Value meanings are in "Column Definitions" in `SOFTWARE_WALLETS_DETAILS.md`.

| Column | How to Verify |
|--------|---------------|
| **Wallet** | `[**Name**](official-site-url)` |
| **Score** | Generated from the visible columns after sync |
| **Core** | ✅ only if it has both a mobile app and a browser extension |
| **Rel/Mo** | Count releases per month on the repo's releases page (`?` if private) |
| **RPC** | Check if custom RPC can be added |
| **GitHub** | Find the main wallet repo (not SDK/packages) |
| **Active** | Check last commit date on default branch |
| **Chains** | Chain icons from official docs or registry files |
| **Devices** | Check app stores + Chrome Web Store |
| **Testnets** | Check if custom RPC/chains can be added |
| **License** | Read LICENSE file in repo root |
| **API** | Is the backend open, public, partial or closed (separate from the client licence) |
| **Audits** | Search repo for `/audits` folder or security page |
| **Funding** | Research company backing, funding rounds |
| **Tx Sim** | Test wallet or check WalletBeat |
| **Scam** | Test wallet or check WalletBeat |
| **Account** | EOA, Safe, EIP-4337, or EIP-7702 |
| **ENS/Naming** | Test sending to a `.eth` name |
| **HW** | Check settings for Ledger/Trezor support |
| **Best For** | Your assessment of ideal use case |
| **Rec** | Generated from the computed score and activity status |

### Step 2: Fill The Scoring Inputs

Software wallet scores are generated from the visible columns in `frontend/src/lib/scoring.js`. The current categories are:

```
Core Readiness
Release Discipline
Developer Safety & Control
Ecosystem & Accounts
Transparency & Access
Maintenance & Assurance
```

If you want to change the formula, update the scoring code first, then rerun the sync script.

### Step 3: Add to Main Table

Add your row to `data/tables/SOFTWARE_WALLETS.md`. Ordering does not need to be perfect before sync because the score script will sort rows automatically. Put `0` and `🔴` in Score and Rec; the sync script replaces them.

```markdown
| [**WalletName**](https://example.com/) | 0 | ✅ | ~2 | ✅ | [repo](https://github.com/org/repo) | ✅ | <img src="/chains/eth.svg" width="16" title="EVM"> | 📱🌐 | ✅ | ✅ MIT | 🌐 Public | ✅ 2024 | 🟢 Company | ✅ | ✅ | EOA | ✅ Basic | ✅ | Use Case | 🔴 |
```

### Step 4: Update Other Sections

If applicable, also update:

In `data/tables/SOFTWARE_WALLETS_DETAILS.md`:

- [ ] **GitHub Metrics**
- [ ] **Security Audits** (if audited)
- [ ] **Account Type Support**
- [ ] **Hardware Wallet Support**
- [ ] **ENS & Address Resolution**
- [ ] **Browser Integration**
- [ ] **Monetization & Business Model**
- [ ] **Security Features (Tx Simulation & Scam Protection)**
- [ ] **Privacy & Data Collection**

The "Current Top Rows" block is generated by the sync script; do not edit it.

### Step 5: Add to Changelog

Add an entry to [CHANGELOG.md](./CHANGELOG.md). It has three kinds of entry:

- **Per-item changes** (a row added, a status, score or rating change): one table row in the matching category table (Software Wallets (EVM), Hardware Wallets (Cold Storage), Crypto Credit Cards), newest first.
- **Cross-cutting passes** (a data recheck, a refactor, a UI change): a bullet under the newest `## YYYY-MM-DD` heading at the top; add a new heading for a new date.
- **Scripts and tooling:** a row in the Tooling table.

```markdown
| Dec 2025 | **WalletName** | Added | New wallet with score XX |
```

---

## Adding a New Hardware Wallet

### Prerequisites

Before adding a hardware wallet, verify:

1. ✅ It's an actual hardware device (not software/mobile wallet)
2. ✅ It's commercially available (not crowdfunding/prototype)
3. ✅ It stores private keys on device (true cold storage)

### Step 1: Gather Required Data

The header in `data/tables/HARDWARE_WALLETS.md` is the contract (13 columns); value meanings are in "Column Definitions" in `HARDWARE_WALLETS_DETAILS.md`.

| Column | How to Verify |
|--------|---------------|
| **Wallet** | `[**Name**](official-site-url)` |
| **Score** | Generated from the visible columns after sync (see [hardware wallet scoring](#hardware-wallet-scoring)) |
| **GitHub** | Firmware repo link, or "Private" if closed |
| **Air-Gap** | Check if device requires USB/BT connection during signing |
| **Open Source** | Find firmware repo on GitHub; verify it's actual firmware, not just SDK |
| **Secure Element** | Check official specs for SE chip (e.g., ATECC608, Optiga) |
| **Display** | Screen type, size, touch capability |
| **Price** | Check official store (not Amazon/resellers) |
| **Conn** | USB, Bluetooth, QR, NFC, MicroSD, WiFi |
| **Activity** | Check last commit date on the firmware repo |
| **Founded** | Year the company was founded (official site, press) |
| **Funding** | Research company funding and background |
| **Rec** | Generated after sync |

### Hardware Wallet Scoring

Hardware scores are generated by `computeHardwareScore` in `frontend/src/lib/scoring.js` from the visible columns. Do not calculate them by hand. The categories and their maximum points (100 in total):

```
Security Architecture        34
Transparency & Maintenance   28
Usability & Value            32
Company Track Record          6
```

The Founded and Funding columns feed Company Track Record, and the Price column feeds Usability & Value. The Rec mark follows the [rank bands](#how-the-rec-mark-is-set). If you want to change the formula, update the scoring code first, then rerun the sync script.

### Step 2: Add to Main Table

Add your row to `data/tables/HARDWARE_WALLETS.md` in score order:

```markdown
| [**WalletName**](https://example.com/) | 0 | [firmware](https://github.com/org/repo) | ✅ Full | ✅ Full | ✅ Dual SE | Touch Color | ~$XXX | USB | ✅ Active | YYYY | 🟡 VC | 🔴 |
```

Notes:
- `Founded` and `Funding` are now required hardware scoring inputs.
- Keep placeholder score/recommendation (`0` / `🔴`) and run `bun scripts/sync_table_scores.js --write`.

### Step 3: Update Other Sections

If applicable, also update:

In `data/tables/HARDWARE_WALLETS_DETAILS.md`:

- [ ] **GitHub Metrics (Firmware Repositories)** (if open source)
- [ ] **Security Features Comparison**
- [ ] **Quick Recommendations** and **Wallets to Avoid or Use with Caution**, if the wallet belongs there
- [ ] **Changelog** — Add entry to [CHANGELOG.md](./CHANGELOG.md)

### Step 4: Run Verification

```bash
cd scripts
./refresh-hardware-wallet-data.sh --markdown
```

---

## Adding a New Ramp Provider

### Prerequisites

Before adding a ramp provider, verify:

1. ✅ It's a legitimate on-ramp and/or off-ramp service (not just a wallet feature)
2. ✅ It's publicly available (not private/enterprise-only without public docs)
3. ✅ It has developer documentation or API/SDK available

### Step 1: Gather Required Data

| Column | How to Verify |
|--------|---------------|
| **Score** | Generated from the visible columns after sync (see [ramp scoring](#ramp-scoring)) |
| **Provider** | `[**Name**](official-site-url)`; the link is the only URL, there is no URL column |
| **Type** | Both, On-Ramp only, or Off-Ramp only |
| **On-Ramp** | ✅ if supports fiat → crypto, ❌ otherwise |
| **Off-Ramp** | ✅ if supports crypto → fiat, ❌ otherwise |
| **Coverage** | Check official docs for supported countries/regions |
| **Fee Model** | Check pricing page or API docs |
| **Min Fee** | Check pricing page (use ~ prefix if approximate) |
| **Dev UX** | Check developer docs (SDK, Widget, API) |
| **Status** | ✅ Active, ⚠️ Verify (needs verification), 🔄 Launching, ❌ Inactive |
| **Founded** | Year the company was founded |
| **Funding** | Research company funding and background (🟢 / 🟡 / 🔴 label) |
| **Best For** | Your assessment of ideal use case |
| **Rec** | Generated by the rank bands (see [How the Rec mark is set](#how-the-rec-mark-is-set)) |

### Ramp Scoring

Ramp scores are generated by `computeRampScore` in `frontend/src/lib/scoring.js` from the visible columns. Do not calculate them by hand. The categories and their maximum points (100 in total):

```
Coverage                 25
Product Breadth          15
Developer UX             18
Pricing Shape            25
Operational Confidence   15
Company Track Record      2
```

Operational Confidence comes from the Status column: 15 for active, 9 for verify, 5 for launching, 0 otherwise. Pricing Shape adds the Fee Model and Min Fee points. The Rec mark follows the [rank bands](#how-the-rec-mark-is-set). Inactive and launching rows are handled by the band rules.

### Step 2: Add to Main Table

Add your row to `data/tables/RAMPS.md` (header: 14 columns). Use `0` and `🔴` for Score and Rec; the sync script fills them in and sorts the rows (highest first):

```markdown
| [**ProviderName**](https://provider.com/) | 0 | Both | ✅ | ✅ | ~160+ Countries | Medium | ~$5.00 | Excellent (React SDK) | ✅ | 2017 | 🟡 VC | Developers | 🔴 |
```

**Important:** Use markdown link format `[**Name**](url)` for provider name to enable clickable links.

### Step 3: Update Other Sections

If applicable, also update:

In `data/tables/RAMPS_DETAILS.md`:

- [ ] **Fee Structure Analysis**
- [ ] **Developer Experience (DX)**
- [ ] **Integration Guides**
- [ ] **Provider-Specific Notes**
- [ ] **Verification status by provider**
- [ ] **Changelog** — Add entry to [CHANGELOG.md](./CHANGELOG.md)

### Step 4: Frontend Integration

When adding a new comparison type (like ramps), you must update:

#### 4a. Type Definitions (`frontend/src/types/wallets.ts`)
- [ ] Add interface (e.g., `Ramp`) with all required fields including `url: string | null`
- [ ] Add to `WalletData` union type
- [ ] Use a unique `type` discriminator (existing ones: `'software'`, `'hardware'`, `'card'`, `'ramp'`, `'qr-payment'`)

#### 4b. Data Parsing (`frontend/src/lib/wallet-data.ts`)
- [ ] Add parsing function (e.g., `parseRamps()`)
- [ ] Extract name and URL from markdown links: `[**Name**](url)`
- [ ] Add to `getAllWalletData()` return object
- [ ] Export parsing function

#### 4c. Filtering (`frontend/src/lib/wallet-filtering.ts`)
- [ ] Add filtering function (e.g., `filterRamps()`)
- [ ] Map status types correctly if different from filter types
- [ ] Export filtering function
- [ ] Add to `wallet-data.ts` exports

#### 4d. Components
- [ ] **WalletTable.tsx:** Add item component (e.g., `RampItem`) for table/grid views
- [ ] **ComparisonTool.tsx:** Add comparison component (e.g., `RampComparison`)
- [ ] **WalletFilters.tsx:** Add filter and sort options if needed
- [ ] **app/explore/ExploreContent.tsx:** Add tab, state management, filtering

#### 4e. Pages
- [ ] **explore/page.tsx:** Call parsing function, pass to ExploreContent
- [ ] **docs/[slug]/page.tsx:** Add to `isTablePage` check
- [ ] **sitemap.ts:** Add to `isComparisonTable` check

#### 4f. Navigation
- [ ] **Navigation.tsx:** Add to `navItems` (the same list feeds the burger menu)
- [ ] **Footer.tsx:** Add to Comparisons section
- [ ] **app/page.tsx:** Add to hero section, stats section, Top Developer Picks

#### 4g. SEO (`frontend/src/lib/seo.ts`)
- [ ] Add OG image mappings for table and details pages
- [ ] Add keyword detection for new type in `generateKeywords` (e.g., ramp-specific keywords)
- [ ] Update the ItemList schema in `frontend/src/app/docs/[slug]/page.tsx` to handle new type correctly

#### 4h. OG Images (`frontend/scripts/generate-og-images.js`)
- [ ] Add data to `WALLET_DATA` object
- [ ] Create generator function for table image
- [ ] Create generator function for details image
- [ ] Add to `main()` function
- [ ] Run `bun run generate-og` and commit PNGs
- [ ] Add the new images to the list checked in `.github/workflows/frontend-ci.yml`

#### 4i. Markdown Config (`frontend/src/lib/markdown.ts`)
- [ ] Add file to `DOCUMENT_CONFIG`
- [ ] Add the DETAILS file to `DETAILS_FILES` so it renders inside the category page

### Step 5: Verification

```bash
cd frontend
bun run type-check  # Verify TypeScript
bun run lint        # Verify linting
bun run build       # Verify build
bun run generate-og # Regenerate OG images
```

---

## Adding a New Crypto Card

See existing `data/tables/CRYPTO_CARDS.md` for card-specific guidelines. Follow similar pattern to software/hardware wallets. The header there is the contract. A new row also needs an entry in `data/card-verification.json` (`tests/card-freshness.test.ts` fails otherwise). Re-verification passes: [docs/CARD_RESWEEP_RUNBOOK.md](docs/CARD_RESWEEP_RUNBOOK.md).

---

## Updating Existing Data

### Activity Status Updates

**For Software Wallets:**
```bash
cd scripts
./refresh-github-data.sh --markdown
```

**For Hardware Wallets:**
```bash
cd scripts
./refresh-hardware-wallet-data.sh --markdown
```

If a wallet's status changes, update:
1. Main table `Active` column (or strikethrough if abandoned)
2. GitHub Metrics table
3. Recalculate score if needed
4. Add changelog entry to [CHANGELOG.md](./CHANGELOG.md)

### Audit Updates

When a wallet publishes a new audit:
1. Update `Audits` column in main table
2. Update Security Audits section
3. Recalculate score if applicable
4. Add changelog entry to [CHANGELOG.md](./CHANGELOG.md)

---

## Verification Standards

### What Requires Verification

| Claim | Verification Method |
|-------|---------------------|
| License | Read LICENSE file in repo |
| Activity | Check last commit via GitHub API |
| Chain count | Official docs or registry file |
| Audit | Link to audit report |
| Funding | Press releases, Crunchbase, etc. |
| Ramp coverage | Official docs or API documentation |
| Ramp fees | Pricing page or API docs |

### What Doesn't Require Verification

- Feature claims from official docs (trust but verify when possible)
- WalletBeat data (already verified)
- GitHub stars/issues (automated)

---

## Pull Request Description

Agents and maintainers: use [.github/pull_request_template.md](./.github/pull_request_template.md). It has these sections:

- **Agent:** the actual model used (required)
- **Co-authored-by:** `Chimera <chimera_defi@protonmail.com>` (required)
- **Summary** (required)
- **Original Request** (required)
- **Changes Made** (required)
- **Testing & Verification** (required): a checklist of `bun scripts/sync_table_scores.js`, `bun run lint`, `bun run type-check`, `bun run test`, `bun run build`, the display contract, and manual QA in light and dark mode
- **Related Issues/PRs** and **Notes** (optional)

For non-fork PRs, CI (`.github/workflows/pr-attribution-check.yml`) fails if Agent, Co-authored-by or any of the four required sections is missing. The rules are in [AGENTS.md](./AGENTS.md).

Outside contributors: the template is optional. Any clear description works. For a new or changed row, include:

- The sources: official docs or site first, then GitHub; WalletBeat link if available.
- What you verified (repo, last commit date, licence, chain count, as they apply).
- If you are the vendor of the product, say so.

---

## Renaming Files or Changing URLs

**⚠️ IMPORTANT:** Changing file names or URL slugs requires updates across the whole codebase. Follow this checklist to avoid breaking links and SEO.

### When to Rename

Only rename files/URLs if:
- URLs are too long or unclear (e.g., `wallet-comparison-unified-table` → `software-wallets`)
- File names don't match the URL pattern
- You're consolidating multiple files into a clearer structure

### File Naming Convention

**Comparison pages follow this pattern:**
- **Table view:** `CATEGORY.md` → `/docs/category` (e.g., `data/tables/SOFTWARE_WALLETS.md` → `/docs/software-wallets`)
- **Details view:** `CATEGORY_DETAILS.md` renders inside the category page at `/docs/category/#details` (e.g., `data/tables/SOFTWARE_WALLETS_DETAILS.md` → `/docs/software-wallets/#details`)

**Slug generation formula:** `filename.replace('.md', '').toLowerCase().replace(/_/g, '-')`

### Rename Checklist

When renaming files or changing URL patterns, you MUST update:

#### 1. File System
- [ ] Rename markdown files
- [ ] Verify files exist in correct location

#### 2. Frontend Configuration (`frontend/src/lib/markdown.ts`)
- [ ] Update `DOCUMENT_CONFIG` with new file names
- [ ] Verify slug generation matches expected URLs
- [ ] Update `DETAILS_FILES` (which DETAILS file renders inside which category page)
- [ ] Update `getWalletStats()` function if it references specific slugs

#### 3. SEO & Metadata (`frontend/src/lib/seo.ts`)
- [ ] Update `getOgImagePath()` mapping for new slugs
- [ ] Verify OG image paths are correct
- [ ] Check that image files exist in `public/` directory
- [ ] Add keyword detection if needed

#### 4. Frontend Components
- [ ] Update `Navigation.tsx` nav items
- [ ] Update `Footer.tsx` links
- [ ] Update `app/page.tsx` (homepage links and structured data)
- [ ] Update any page-specific links (e.g., `companies/page.tsx`)

#### 5. Page Logic (`frontend/src/app/docs/[slug]/page.tsx`)
- [ ] Update table/details detection logic
- [ ] Verify `isTablePage` detection and that `getDetailsDocument` finds the DETAILS file
- [ ] Update `RelatedDocuments` component logic if needed
- [ ] Update ItemList schema (the `itemListSchema` block) to handle new type correctly

#### 6. Sitemap (`frontend/src/app/sitemap.ts`)
- [ ] Update `isComparisonTable` detection logic
- [ ] Verify priority logic still works correctly

#### 7. Data Parsers (`frontend/src/lib/wallet-data.ts`)
- [ ] Update file paths in parsing functions
- [ ] Update any comments referencing old file names

#### 8. Scripts
- [ ] Update `frontend/scripts/generate-og-images.js` file references and comments
- [ ] Update `frontend/scripts/smoke-test-wallet-data.js` file paths
- [ ] Update `scripts/sync_table_scores.js` file paths
- [ ] Verify any other scripts that reference file names

#### 9. Documentation
- [ ] Update `frontend/README.md` file mapping table
- [ ] Update `README.md` (root) file references
- [ ] Update internal markdown links in comparison files
- [ ] Update `CONTRIBUTING.md` if it references specific files

#### 10. Verification
- [ ] Run verification script to check file existence
- [ ] Verify slug generation produces expected URLs
- [ ] Check that the details section still renders at `/docs/<slug>/#details`
- [ ] Check for any remaining old references: `rg -n "old-name" frontend/`
- [ ] Verify no broken internal links in markdown files
- [ ] Run `bun run type-check`, `bun run lint`, `bun run build`

### SEO Considerations

**When changing URLs, be aware:**

1. **Broken External Links:** Old URLs will 404 unless you add redirects
   - Consider adding Next.js redirects in `next.config.js` if URLs are public-facing
   - Update any social media posts or external documentation

2. **OG Images:** Social media caches OG images
   - Increment the OG image version when regenerating images: `ogImageVersion` in `frontend/src/lib/brand.ts` (default `'v5'`, or `NEXT_PUBLIC_OG_IMAGE_VERSION`) and the hardcoded `ogImageVersion` in `frontend/src/app/docs/[slug]/page.tsx`
   - Verify OG image paths match new slugs

3. **Sitemap:** Search engines need updated sitemap
   - Sitemap auto-generates from `getAllDocuments()`, so it updates automatically
   - Verify sitemap priorities are correct for new naming pattern

4. **Structured Data:** Schema.org markup includes URLs
   - Verify structured data URLs in `app/page.tsx` and `app/docs/[slug]/page.tsx` match new slugs
   - Check breadcrumb and article schema URLs

### Example: Complete Rename Workflow

```bash
# 1. Rename files
mv OLD_NAME.md NEW_NAME.md
mv OLD_NAME_DETAILS.md NEW_NAME_DETAILS.md

# 2. Update frontend config
# Edit frontend/src/lib/markdown.ts: DOCUMENT_CONFIG

# 3. Update all references
# Edit: seo.ts, Navigation.tsx, Footer.tsx, etc.

# 4. Verify
cd frontend
bun run type-check
bun run lint
bun run build
```

### Testing After Rename

1. **Build check:** `cd frontend && bun run build`
2. **Type check:** `cd frontend && bun run type-check`
3. **Lint check:** `cd frontend && bun run lint`
4. **Smoke test:** `cd frontend && bun run test`
5. **Manual verification:** Check that all URLs load correctly

---

## Adding a New Comparison Type

See [docs/ADDING_A_CATEGORY.md](docs/ADDING_A_CATEGORY.md) for the checklist. For card re-verification passes see [docs/CARD_RESWEEP_RUNBOOK.md](docs/CARD_RESWEEP_RUNBOOK.md).

---

## Questions?

Open an issue if you're unsure about:
- How to classify a wallet's license
- What activity status to assign
- How to score a particular feature
- How to rename files without breaking links
- How to add a new comparison type

We're happy to help!

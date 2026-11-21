<div align="center">

![Wallet Radar](./frontend/public/og-image.png)

# Wallet Radar

**Independent research on wallets, cards and ramps, for developers**

[![Commit Message Check](https://github.com/chimera-defi/walletradar/actions/workflows/commit-message-check.yml/badge.svg)](https://github.com/chimera-defi/walletradar/actions/workflows/commit-message-check.yml)
[![PR Attribution Check](https://github.com/chimera-defi/walletradar/actions/workflows/pr-attribution-check.yml/badge.svg)](https://github.com/chimera-defi/walletradar/actions/workflows/pr-attribution-check.yml)
[![License](https://img.shields.io/badge/License-BUSL--1.1-lightgrey.svg)](./LICENSE)
[![Website](https://img.shields.io/badge/Website-walletradar.org-blue)](https://walletradar.org)

[Visit the website](https://walletradar.org) | [Compare products](https://walletradar.org/explore) | [Documentation](https://walletradar.org/docs)

</div>

---

## What is Wallet Radar?

Wallet Radar compares crypto access products so a developer can pick one fast. It tracks **162 products** (software wallets, hardware wallets, crypto cards, on/off-ramps; the home page counts the same four tables) and scores each from columns you can see in the tables. QR payment providers are listed separately and are not in that count.

The goal: find a MetaMask alternative with a mobile app and a browser extension, stable enough for daily development. Fewer releases per month means fewer surprise breaking changes.

What you get:
- **Scores you can reproduce.** The method is in [CONTRIBUTING.md](./CONTRIBUTING.md) and the tables are scored by `scripts/sync_table_scores.js`.
- **GitHub activity.** Last commit, release rate and maintenance status, from the GitHub API.
- **Audit history,** with links to the reports.
- **Developer experience.** Docs, SDKs, simulation, error quality.
- **Chain support** per wallet.

## What we compare

| Category | Count | What it covers |
|----------|-------|----------------|
| Software wallets | 33 | Browser extensions, mobile apps, desktop wallets |
| Hardware wallets | 44 | Cold storage devices and secure element details |
| Crypto cards | 63 | Crypto-backed credit and debit cards |
| On/off-ramps | 22 | Fiat-to-crypto providers |
| QR payments | 8 | QR payment providers, counted apart from the 162 |

Counts are table rows as of 2026-11-19, including discontinued and partial-data rows. QR payment providers are in [QR_PAYMENTS.md](./data/tables/QR_PAYMENTS.md).

Note: the dataset files moved to `data/tables/` and ABOUT, DATA_SOURCES and GLOSSARY to `docs/site/` (MERCHANT_FEED to `docs/`), so GitHub deep links to their old root paths no longer resolve.

## Bot-protected sites

Some provider sites block automated checks (403, 429, timeout). A headless Chromium pass (`scripts/verify-crypto-cards.js`) clears some of them. The rest need a person in a browser. Anything unconfirmed is marked UNVERIFIED in the data, with the reason in the [verification log](https://github.com/chimera-defi/walletradar/blob/main/docs/VERIFICATION.md).

## Screenshots

<div align="center">

![Software Wallets](./frontend/public/og-software-wallets-table.png)

![Explore & Compare](./frontend/public/og-explore.png)

</div>

## Features

- **Filter and compare.** Filter by platform, features (transaction simulation, scam alerts, testnets) and licence (open source, source-available, proprietary). Compare up to 4 wallets side by side.
- **Scoring.** Security (audits, open source, simulation), GitHub activity, developer experience, platform coverage.
- **Data updates.** A weekly GitHub Action refreshes GitHub activity data, applies it to the tables with `scripts/apply_activity.js`, re-scores them with `scripts/sync_table_scores.js`, and opens a PR that commits `data/activity.json`, `data/hardware-activity.json` and `data/tables/`. Prices, licences, audits and custody are checked by hand against primary sources and shipped through reviewed PRs. A second weekly Action regenerates the hardware wallet Merchant Center feed ([MERCHANT_FEED.md](https://github.com/chimera-defi/walletradar/blob/main/docs/MERCHANT_FEED.md)).
- **Live chain data.** TVL from DeFiLlama.
- **UI.** Next.js static site, dark mode, responsive, structured data for SEO.

## Tech stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, TypeScript 6, Lucide icons, react-markdown with GFM.
- **Data:** Markdown tables parsed at build time. Sources: GitHub REST API, WalletBeat, Rabby API, Trust Wallet registry, DeFiLlama.
- **Hosting and CI:** AWS Amplify, GitHub Actions. OG images are generated with Canvas.

## Get started

Needs Node.js 22 and Bun 1.3+.

```bash
git clone https://github.com/chimera-defi/walletradar.git
cd walletradar/frontend
bun install
bun run dev        # http://localhost:3000
```

Build and preview the static export:

```bash
bun run build
bun run start
```

| Script | What it does |
|--------|--------------|
| `bun run dev` | Dev server |
| `bun run build` | Production build (static export to `out/`) |
| `bun run start` | Serve `out/` locally |
| `bun run lint` | ESLint |
| `bun run type-check` | TypeScript check |
| `bun run test` | Data smoke test |
| `bun run generate-og` | Generate OG images |
| `bun run generate-image-sizes` | Record article image dimensions (run after changing an article image) |
| `bun run check-links` | Check internal links, assets and anchors in `out/` |

From the repo root, run `bunx vitest run tests/` for the unit tests.

## Project structure

```
frontend/          Next.js app (src/, public/, scripts/)
scripts/           Data tooling (see scripts/README.md)
tests/             Vitest unit tests
data/              Sidecar attributes, merchant pricing
articles/          SEO articles
docs/              Maintainer docs (verification log, SEO notes, redirects; one-off records in docs/archive)
data/tables/       Data tables and *_DETAILS.md
docs/site/         Site pages (about, data sources, glossary)
*.md (root)        README, AGENTS, CLAUDE, CONTRIBUTING, CHANGELOG
```

## Data sources

| Source | Used for | Link |
|--------|----------|------|
| GitHub API | Stars, issues, release rate, activity | [docs](https://docs.github.com/en/rest) |
| WalletBeat | Licence, device support, audits | [walletbeat.fyi](https://walletbeat.fyi) |
| Rabby API | Chain counts | [api.rabby.io](https://api.rabby.io/v1/chain/list) |
| Trust Wallet registry | Network support | [GitHub](https://github.com/trustwallet/wallet-core) |
| DeFiLlama | Chain TVL | [defillama.com](https://defillama.com) |

Details and attribution: [DATA_SOURCES.md](./docs/site/DATA_SOURCES.md).

## Refresh data

```bash
cd scripts
./refresh-github-data.sh --markdown   # also --json; set GITHUB_TOKEN for full runs
```

Commit refreshed data through a PR after review. Full script docs: [scripts/README.md](https://github.com/chimera-defi/walletradar/blob/main/scripts/README.md).

## Documentation

- [SOFTWARE_WALLETS.md](./data/tables/SOFTWARE_WALLETS.md): software wallets (33 rows)
- [HARDWARE_WALLETS.md](./data/tables/HARDWARE_WALLETS.md): hardware wallets (44 rows)
- [CRYPTO_CARDS.md](./data/tables/CRYPTO_CARDS.md): crypto cards (63 rows)
- [RAMPS.md](./data/tables/RAMPS.md): on/off-ramps (22 rows)
- [QR_PAYMENTS.md](./data/tables/QR_PAYMENTS.md): QR payment providers
- [ABOUT.md](./docs/site/ABOUT.md), [GLOSSARY.md](./docs/site/GLOSSARY.md), [DATA_SOURCES.md](./docs/site/DATA_SOURCES.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md): how to contribute and how scores work
- [CHANGELOG.md](./CHANGELOG.md): change history
- [Verification log](https://github.com/chimera-defi/walletradar/blob/main/docs/VERIFICATION.md): what was verified, what is not, and why

## Trust and transparency

- No logins, no wallet connections, no key requests.
- No personal data collection or tracking beyond standard analytics.
- Every data source is linked.
- The code is public on GitHub under the Business Source License 1.1 (source available, not open source).
- The scoring method is published and reproducible.
- Commercial links, if any, are disclosed and never affect rankings.

Wallet Radar is educational research. It is not financial advice and does not tell you what to buy. Verify on official sites before you move funds.

## Contributing

1. **Report wrong data:** [open an issue](https://github.com/chimera-defi/walletradar/issues).
2. **Add a product:** see [CONTRIBUTING.md](./CONTRIBUTING.md).
3. **Fix docs or code:** open a PR.

## License

[Business Source License 1.1](./LICENSE) (BUSL-1.1). Source available, not open source: you may copy, modify and redistribute the code and make non-production use of it. Production use needs a commercial licence from the licensor. Each version changes to the Apache License 2.0 on 2030-11-21, or four years after that version is first publicly distributed under BUSL-1.1, whichever comes first. Third-party material keeps its own licence (see [Data Sources](./docs/site/DATA_SOURCES.md)).

## Links

- Website: [walletradar.org](https://walletradar.org)
- GitHub: [github.com/chimera-defi/walletradar](https://github.com/chimera-defi/walletradar)
- Issues: [github.com/chimera-defi/walletradar/issues](https://github.com/chimera-defi/walletradar/issues)

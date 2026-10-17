# Verification log

Maintainer notes. Tables in the root `*.md` files are the source of truth; this file records where values came from, what is still unverified, and what we decided not to do.

Contents: [Data refresh 2026-10-15](#data-refresh-2026-10-15) | [Open items and won't-do](#open-items-and-wont-do) | [How to verify](#how-to-verify) | [Card custody decisions](#card-custody-decisions) | [WalletBeat additions](#walletbeat-additions-2026-10-10) | [Card notes](#card-notes) | [Competitors and data sources](#competitors-and-data-sources)

## Data refresh 2026-10-15

Every number in scope was re-fetched from a primary page or API on 2026-10-15, or marked UNVERIFIED with the reason. Scores were regenerated with `bun scripts/sync_table_scores.js --write`, never by hand. Full per-cell tables are in the PR bodies and in `CRYPTO_CARDS_DETAILS.md` (Recheck log) and `HARDWARE_WALLETS_DETAILS.md`.

### Changes per category

| Category | Data changes | Notes |
|---|---|---|
| Software wallets | 14 changed fields in `SOFTWARE_WALLETS.md`; GitHub metrics refreshed for 22 repos in `_DETAILS` | Scores regenerated. Merged as #110. |
| Hardware wallets | 53 changed cells over 33 wallets (26 price changes, 6 new rows) | Scores regenerated. Merged as #112. |
| Crypto cards | 16 changed fields in `CRYPTO_CARDS.md`, 3 new rows (Bleap, Tangem Pay, Phantom Cash Card) | Merged as #111. |
| Ramps and QR | 9 changed fields in `RAMPS.md`; 13 more in `RAMPS_DETAILS.md` and `QR_PAYMENTS*.md` | Merged as #113. |

### Top changes (old -> new)

| Item | Change | Source (fetched 2026-10-15) |
|---|---|---|
| Daimo | Active and Best For: discontinued; score 44 -> 29 | https://github.com/daimo-eth/daimo (archived 2026-02-18) |
| imToken | Active ✅ -> ❌ (last commit 2026-05-20); score 51 -> 33 | https://github.com/consenlabs/token-core-monorepo |
| Status | Repo `status-mobile` -> `status-app`; Active ❌ -> ✅; score 33 -> 51 | https://github.com/status-im/status-app |
| Argent | Licence GPL-3 -> Source-available (non-commercial `License.md`); rebrand to Ready noted | https://github.com/argentlabs/argent-x |
| Block Wallet | Licence MIT -> Source-available (non-commercial) | https://github.com/block-wallet/extension |
| Rabby, MetaMask | Rel/Mo ~6 -> ~4, ~8 -> ~5; scores 84 -> 86, 77 -> 80 | https://api.github.com/repos/RabbyHub/Rabby/releases, https://api.github.com/repos/MetaMask/metamask-extension/releases |
| Trezor Safe 3 | Price ~$79 -> ~$59 | https://trezor.io/trezor-safe-3 |
| Trezor Safe 5 | Price ~$169 -> ~$129 | https://trezor.io/trezor-safe-5 |
| Ledger Nano Gen5 | Price ~$79 -> ~$179; E-Ink touch; USB/BT/NFC | https://shop.ledger.com/products/ledger-nano-gen5 |
| Ledger Stax / Flex | Price ~$280 -> ~$399 / ~$199 -> ~$249 | https://shop.ledger.com/products/ledger-stax, https://shop.ledger.com/products/ledger-flex |
| Blockstream Jade | Air-gap ❌ -> ✅ Full; Secure Element -> None (virtual SE); price ~$79 -> ~$67 | https://store.blockstream.com/products/blockstream-jade-hardware-wallet |
| OneKey Classic 1S, 1S Pure | Activity ✅ -> ❌ (firmware repo rule) | https://api.github.com/repos/OneKeyHQ/firmware/commits |
| New hardware rows | ColdCard Mk5 (~$219), ColdCard Q (~$319), Jade Plus (~$149), Passport Core (~$199, discontinued), Passport Prime (~€381), SafePal X1 (~$70) | https://store.coinkite.com/store, https://foundation.xyz/, https://www.safepal.com/store |
| Gnosis Pay | ✅ DeFi-native -> ⚠️ consumer card winding down (end 2026-12-20 per press); score 70 -> 66 | https://gnosispay.com/blog/gnosis-pay-the-next-era |
| Ready, Cypher, Solflare | Marked discontinued or paused (Ready late July 2026; Cypher service end 2026-09-06; Solflare paused 2026-07-28) | https://www.cypherhq.io/wind-down-support/what-is-happening-to-cypher, https://thedefiant.io/news/cefi/ready-shuts-card-program-after-issuer-winds-down |
| Kraken card | Link fixed; UK/EEA Mastercard and US Visa launched 2026-08-18 | https://www.kraken.com/features/crypto-card |
| New cards | Bleap (83), Tangem Pay (53), Phantom Cash Card (40) | https://bleap.finance, https://tangem.com/en/tangem-pay/, https://phantom.com/cash |
| Coinbase Pay (ramp) | Coverage ~100+ -> ~90+ countries; min fee -> Not published; score 91 -> 84 | https://docs.cdp.coinbase.com/onramp/additional-resources/faq.md |
| Banxa (ramp) | Funding PublicCo -> OSL Group | https://www.newsfilecorp.com/release/279359 |
| Ramp (ramp) | URL `ramp.network` -> `rampnetwork.com`; fees up to 1.40% bank, 3.9% card | https://rampnetwork.com/pricing-policy |
| BitPay (QR) | Fee 1% -> 2% + 25c tiered | https://bitpay.com/pricing |
| NOWPayments (QR) | Fee 0.5% -> from 1% | https://nowpayments.io/pricing |
| Flexa (QR) | SPEDN app shut 2026-03-31; fee and network count marked UNVERIFIED | https://support.flexa.co/en/articles/13569029 |

### UNVERIFIED

Each item below keeps its old value and carries a mark or a note in the data.

- **Software wallets:** audit claims and dates, funding, Tx Sim, Scam, HW, API, ENS columns, chain lists (only Rainbow, Rabby and Zerion EVM/Solana scope spot-checked). Private-repo wallets (OKX, Phantom, Zerion, Exodus, 1inch, Bitget, Mt Pelerin). Rel/Mo for Brave, Ambire, Ledger, Gem, Uniswap, Sequence, Trust, Rainbow, Safe, MEW, imToken, Enkrypt (bursty or multi-product repos). Coinbase Wallet row kept at Active ❌, Rel ~2: the SDK repo has commits but no release since 2025-06-25 and is superseded by the Base Account SDK. A rule-based update would lift its score to 82, so it was left for an owner decision.
- **Hardware wallets (‡ marks):** Arculus price (getarculus.com HTTP 403), ColdCard Mk4 price (no longer listed). BitBox02, Nova, Cypherock and imKey prices were resolved on 2026-10-17. Also: Ledger Nano S price (not in shop), DIY prices (Krux, SeedSigner, Specter, Firefly), Passport Prime USD, Bitkey USD, BC Vault currency (EUR assumed from shop `currency_code`), Keycard USD. Per-wallet chains and audit cells were not re-fetched; 338 unchanged cells were not individually re-checked.
- **Cards:** EtherFi cashback and fees (429 and a Vercel checkpoint), Coinbase, Revolut, Uphold (403), Bybit (timeout), 1inch cashback and regions, Wayex 1% cashback, Reap 0%/2% FX, Hi Card, BitPay status, Amp Pay (expired certificate), Payy, Tria, Kontigo, Spendly, Bitget $10 activation and FX range, Plutus annual fee and region, Kraken US FX and tiers (two Kraken pages conflict), Gnosis 2026-12-20 date (secondary source), Ready shutdown (secondary source), Wirex monthly fee, Bleap and Tangem region and custody (labelled CeFi).
- **Ramps and QR:** Transak fees (transak.com 403), Binance Pay merchant fee, Flexa fee (network count resolved 2026-10-17), Coinbase Commerce status (portal 502, help page 403; marked Verify).
- **Not added, no primary page:** Coinbase One Card, Fold credit card, Crypto.com US credit card, Binance CIS relaunch, Moonwell card.

### Known blockers (cannot be verified from an agent)

- Bot-protected pages: bitbox.swiss, getarculus.com, transak.com, coinbase.com, uphold.com, revolut.com and EtherFi return 403, 429 or a browser check. A headless Chromium pass resolves some; the rest need a human browser session.
- Secondary-only facts: Gnosis Pay end date, Ready shutdown, Solflare pause detail, Ledger Global-e incident and BitBox Dixence update (not added).
- Legacy score narratives in `SOFTWARE_WALLETS_DETAILS.md` were removed in the docs cleanup. Table scores are the only scores.
- Out-of-slice drift reported by the hardware pass: `data/merchant_pricing.json` (Ledger Nano S+ 59 vs 69, Jade 79 vs 67 list/sale, Bitkey 150 vs €230) and `frontend/scripts/generate-og-images.js` hardware prices; OG PNGs need regenerating after the UI pass.

## Open items and won't-do

| Item | Verdict |
|---|---|
| Remove `rehype-raw` from the markdown renderer | Won't do. Tables embed `<img src="/chains/...">` chain icons that need raw HTML. Audit command is in [SECURITY_INCIDENT_PORKBUN.md](./archive/SECURITY_INCIDENT_PORKBUN.md). |
| VirusTotal re-scan and Porkbun reply | Operator-owned, not agent-actionable. |
| Temporarily disable GA to test detections | Won't do. GA stays, lazy-loaded. |
| `IMPROVEMENTS_RECOMMENDED.md` (10 recommendations) | Resolved or won't-do per item. Done: section order, merged recommendation sections, features matrix, cross-references, methodology box. Won't do: legend tiering, splitting the wide tables (tables feed the parser and scoring), resource cross-refs, separate "Last Updated" format. |
| `EXTRACT_STUB_PLAN.md` (split wallets out of the mono-repo) | Split and push done; link cleanup done. The mono-repo stub commit is out of scope here. |
| Legacy `WALLET_COMPARISON_UNIFIED`, `HARDWARE_WALLET_COMPARISON`, `CRYPTO_CREDIT_CARD_COMPARISON` docs | Stay deleted. Everything useful is in the `*_DETAILS.md` files. The old card scoring handicaps (exchange -3, Crypto.com -20, unverified -5) are obsolete. |
| `npm audit` high finding (js-yaml via gray-matter, build-time only) | Open. Fix in a dependency PR. |
| Cards to add once a primary page confirms custody and region (Ledger CL and Oobit landed 2026-10-17): SafePal Card, Exa, Holyheld, Coinbase One | Open. |
| ColdCard Mk4, Arculus and other ‡ prices | Open until a source page shows a price. |
| Wallets WalletBeat lists but we do not: Family, Base App, Elytro | Open. Family has too few sourced fields. Base App duplicates the Coinbase row. Elytro's site returned HTTP 402 on 2026-10-10. |
| `TODO` or `FIXME` markers in docs and code | None. The remaining `- [ ]` lines are PR and contributor checklist templates, not open work. |

## How to verify

1. Open the official site or docs for the product. Prefer docs, terms and pricing pages over marketing pages.
2. For wallets, read the GitHub API: `repos/<org>/<repo>`, `/commits`, `/releases`, and the `LICENSE` file.
3. Write the value, the source URL and the date. Use `~` for values that move.
4. If the page blocks you (403, 429, timeout), try a headless Chromium pass. If it still fails, keep the old value and mark it UNVERIFIED with the reason.
5. Re-run `bun scripts/sync_table_scores.js --write`, then `rg` the old value across the repo.
6. Add a line to `CHANGELOG.md`.

Competitor sites and blogs are leads only. Never copy their figures.

## Card custody decisions

June 2026 recheck, extended in October 2026. Custody means who holds the funds on the card spend path.

| Card | Old -> new | Evidence | Source |
|---|---|---|---|
| KAST | Self -> CeFi | Terms: assets transferred in are sold to KAST and held via a custodian for KAST. | https://www.kast.xyz/legal/terms-and-conditions-of-service |
| CryptoSpend / Wayex | Self -> CeFi | Wayex academy: custodial wallet, holds the key for the user. | https://www.wayex.com/au/academy/module-3-wallets-and-security/ |
| Spendly | Self -> CeFi | Terms describe top-up and prepaid loading, no user-key custody. | https://www.usespendly.com/tos |
| Jupiter Card | Self -> CeFi | Jupiter does not custody wallet funds, but Spend balances sit with regulated partners. | https://docs.jup.ag/user-docs/global/spend |
| Bitget Wallet Card | Self -> CeFi | Card terms authorise liquidation of wallet assets; DCS prepayments become DCS property. | https://www.bitget.com/support/articles/12560603881449 |
| OKX Card | Self -> Exch (Oct 2026) | "OKX Pay holds the USDC or USDG balance." | https://www.okx.com/en-eu/learn/okx-card-europe-explained |
| 1inch Card | Self -> CeFi (Oct 2026) | Prepaid Mastercard issued by Monavate, developed with Baanx, run by Crypto Life. | https://1inch.com/card |
| CoinJar Card | -> CeFi (Oct 2026) | Prepaid Mastercard issued via EML Payment Solutions. | CoinJar card page |

Kept as is:

- **Wirex Card (CeFi):** self-custody evidence maps to Wirex One and Wirex BaaS, not the legacy Wirex Card and WXT row. Revisit if the row is split.
- **Nummus Wallet Card (CeFi):** wallet is non-custodial, but cards are issued and governed by external providers.
- **Fuse Wallet Card (Self, UNVERIFIED):** fusewallet.com says "self-custodial smart accounts"; card terms not read. `fuse.io` is a different entity.
- **Kontigo (Self, inactive):** kept as a discontinued row after Rain shut down the card program.

The full per-card custody table lives in the Custody column of `CRYPTO_CARDS.md`. Issuer evidence per card is in `CRYPTO_CARDS_DETAILS.md`.

## WalletBeat additions (2026-10-10)

Snapshot: https://github.com/walletbeat/walletbeat/tree/82e3036aba53d8dd13a55f42089ba09c44afa8c5 (MIT, see [DATA_SOURCES.md](../DATA_SOURCES.md)). Rows are tagged `*(partial data)*`. Only sourced fields are filled; the rest is `TBD` or `?`. Generated scores treat `TBD` as the lowest-signal value, so they are lower bounds, not rankings. `EVM` in Chains means WalletBeat evaluates the wallet on EVM; no other chains are claimed. Funding `Self` = WalletBeat `selfFunded: true`; `Unknown` = no funding flag.

`WB` = `https://github.com/walletbeat/walletbeat/blob/82e3036aba53d8dd13a55f42089ba09c44afa8c5/data/`. `GH` = GitHub REST API metadata fetched 2026-10-10.

| Wallet | Filled fields and sources |
|---|---|
| Bitget Wallet | Mobile and browser, EOA, closed source, bug bounty on Bugrap (active), no scam warnings. WB `software-wallets/bitget.ts`; https://bugrap.io/bounties/Bitget%20Wallet%20(Formerly%20BitKeep); site https://web3.bitget.com/ |
| Gem Wallet | Mobile only, EOA, GPL-3.0, CertiK audit 2026-04-08, self-funded, ENS resolution, simulation-engine warnings. WB `software-wallets/gemwallet.ts`; audit https://static.gemwallet.com/audits/Gem-Wallet-CertiK-Security-Audit-April-2026.pdf; repo https://github.com/gemwalletcom/wallet. The standing bounty ended 2026-06-02, so it is not counted. |
| Mt Pelerin (Bridge Wallet) | Mobile and browser, EOA, closed source, Immunefi bounty (active), self-funded. WB `software-wallets/mtpelerin.ts`; https://immunefi.com/bug-bounty/mtpelerin/information/ |
| NuFi | Browser only, EOA and EIP-7702, closed source per WB, HW support for Ledger, Trezor, Keystone, GridPlus, OneKey, BitBox, self-funded. WB `software-wallets/nufi.ts`; repo https://github.com/nufi-official/nufi (no licence, last push 2026-04-27, so Active ⚠️). nu.fi returned 403, not independently confirmed. |
| PillarX | Mobile and browser, EOA and EIP-7702, MIT. WB `software-wallets/pillarx.ts`; repo https://github.com/pillarwallet/x. Funding left unknown (WB flags both selfFunded and publicOffering). |
| Zeus | Desktop only, EOA, MIT, local EVM simulation, no scam alerts, self-funded, no audits listed. WB `software-wallets/zeus.ts`; repo https://github.com/greekfetacheese/zeus |
| Firefly | Air-gapped, open source, DIY ~$5 parts, 128x64 OLED, Arduino Nano (no secure element). https://firefly.city/; repo https://github.com/firefly/wallet. The repo creation date is not a founding date, so Founded is TBD. The V1 repo is inactive (2018) but the org is active (`pixie-firmware`, 2026-02). |
| imKey Pro | Core Apache-2.0, partly proprietary firmware, EAL6+ secure element, USB and Bluetooth, self-funded, founded 2018 (https://imkey.im/pages/about-us). WB `hardware-wallets/imkey.ts`; repo https://github.com/consenlabs/imkey-core (last push 2023-11-23; Activity now ❌ Inactive after the 2026-10-15 recheck). |

Not added: **Family** (only devices and account type are sourced, so every scored field would be TBD and the score would mislead), **Base App** (duplicates the Coinbase row), **Elytro** (site returned HTTP 402 `DEPLOYMENT_DISABLED` on 2026-10-10).

## Card notes

- **Reap:** Cloudflare blocks plain fetches. Playwright with a ~30 second wait works. Pricing page: https://reap.global/resources/info/pricing. Corporate Visa credit card, annual fee free, ATM 2%, FX 2%, 1:1 collateral, business accounts only. The 2026-10-15 recheck could not re-confirm the 0%/2% FX figures (UNVERIFIED).
- **EtherFi Cash:** the page is JavaScript-rendered; Playwright with `networkidle` extracts it. Tier details are in `CRYPTO_CARDS_DETAILS.md`. The 2026-10-15 recheck hit a 429 and a Vercel checkpoint, so cashback and fees are UNVERIFIED.
- **Mode Card:** modeapp.com is unreachable on repeated checks (`mode.com` is a different company). Treat as defunct.
- **Cards that block or 404 on their card page:** Swissborg (now advertised on swissborg.com), Uphold, CoinJar, Hi Card, Bybit. Find a live card page before changing fees.
- **High cashback claims (8-10%)** usually need token staking. Record the base rate and the staked maximum separately.

## Competitors and data sources

Reviewed 2026-10-10. Competitor figures are leads to check against issuer pages, never data to copy. Items marked **K** were not fetched and must be confirmed before an integration relies on them.

### Comparison sites

| Site | Coverage | We lack | Licence / access |
|---|---|---|---|
| [WalletBeat](https://github.com/walletbeat/walletbeat) | EVM only: 21 software, 11 hardware, 9 wallet contracts | Privacy, tx legibility, bug bounty, key generation, passkeys, per-attribute evidence | MIT (keep notice); git repo, no hosted API |
| [Coinspect ranking](https://github.com/coinspect/wallet-security-ranking) | ~159 wallet security reports | Independent security reports | CC BY 4.0 (attribution); raw JSON via git |
| [ethereum.org Find a wallet](https://ethereum.org/wallets/find-wallet/) | ~48 wallets | Fees, languages, personas | Repo MIT; site text licence not checked; many entries stale |
| [WalletScrutiny](https://walletscrutiny.com) | Hundreds of reviews | Reproducible-build verdict | Site MIT, reviews carry a different licence: link only |
| [Privacy Guides](https://www.privacyguides.org) | Criteria-based guidance | Privacy criteria | CC-BY-SA-4.0: link only |
| [SpendNode](https://www.spendnode.io/crypto-cards/), [cryptocards.so](https://www.cryptocards.so/en) | 71 and 133 cards | KYC flag, card network, Apple/Google Pay, per-tier variants | Terms not read; use as to-check lists |
| Eco, QuickNode, KoinX, Koinly, Bleap blog | 5-10 cards each | A few new cards | Vendor blogs; Koinly bot-blocked |
| [Dune card-transactions](https://docs.dune.com/data-catalog/curated/payments/card-transactions) | 8 providers | On-chain spend volume | Dune account needed; deferred |

### Data sources

| Source | Use | Notes |
|---|---|---|
| GitHub REST | Stars, commits, releases, licence | 60 requests/h unauthenticated, 5000/h with token. `refresh-github-data.sh` supports a token, tag fallback and licence capture. |
| DefiLlama free API | Chain TVL | We use only `/v2/chains` (`frontend/src/lib/defillama.ts`). `/oracles` and `bridges.llama.fi` returned 402; avoid. |
| ESMA MiCA CASP register | MiCA status for ramps | CSV `esma.europa.eu/sites/default/files/2024-12/CASPS.csv` (Latin-1 with BOM). Wired into `scripts/verify-ramps.py`. |
| L2BEAT | Chain security stage | Repo is MIT. `l2beat.com/api/scaling/summary` returned 200 JSON on 2026-10-10; the alternate `api.l2beat.com` returned 401. Undocumented JSON: expect schema drift and snapshot it rather than depending on it live. |
| Audit registries (Sherlock, Spearbit) | Audit links | No licence on repos: store metadata and links only. |
| CoinGecko public API (K) | Token prices | Attribution on the free tier; rate limits unconfirmed. |

### Gaps still open

- **Cards they list that we lack:** Exa, Holyheld, SafePal Card, Oobit, Ledger CL, MEXC, Gate and Pionex cards, Kolo, Hyperbeat Pay, COCA, Mercuryo, Xapo Bank Card. Verify each on an issuer page before adding. SpendNode and cryptocards.so list **Krak Card** where we list Kraken Card; probably the same product.
- **Wallets they list that we lack:** Family, Base App, Elytro (WalletBeat); TokenPocket, Cake Wallet, Edge, Unstoppable, AlphaWallet, Braavos, Railway (ethereum.org).
- **Number discrepancies queued for an issuer-page check:** Crypto.com US tiers, Binance region and rate (we say Brazil, competitor says Europe/UK up to 8% BNB), BitPay FX (we say 0%, competitor says 3%), Wirex, Nexo, Coinbase.
- **Done from the earlier recommendation list:** WalletBeat wallets added, Bug Bounty / Reproducible Build / Chain Verification as sidecar attributes (`data/attributes.json`), MiCA check in `verify-ramps.py`, hardened `refresh-github-data.sh`, Bitpanda, Cypher, Bleap, Tangem Pay added.

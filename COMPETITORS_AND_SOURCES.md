# Competitors & Data Sources

Last reviewed: 2026-10-10. Public pages only; page text was treated as data. **[V]** = verified in this review (HTTP probe, repo read), **[K]** = from memory, not re-verified. Competitor figures are leads to check against issuer pages, never data to copy.

## A. Competitor / comparison sites

### Crypto cards

| Site | Coverage | Covers that we lack | We cover that they lack | Reuse / ToS | Access | Freshness |
|------|----------|---------------------|-------------------------|-------------|--------|-----------|
| [SpendNode](https://www.spendnode.io/crypto-cards/) | 71 card variants/tiers | Per-tier variants, spend-volume tracker | Custody taxonomy, score, biz flag | Terms not read; no licence | Scrape | "Verified Oct 10 2026" |
| [cryptocards.so](https://www.cryptocards.so/en) | 133 cards | KYC/no-KYC, network, Apple/Google Pay, sentiment | Custody path, FX fee, methodology | T&C not read; has sponsored listings | Scrape | Undated |
| [Eco](https://eco.com/support/en/articles/15039724-best-crypto-debit-cards) | 8 | Bitpanda, Crypto.com US tiers | Most of the table | Vendor blog, no licence | Scrape | Oct 6 2026 |
| [QuickNode](https://www.quicknode.com/blog/top-10-crypto-credit-debit-cards-2026) | 10 | Tangem Pay, Coinbase One (Amex) | Most of the table | Vendor blog | Scrape | Jul 2025 (stale) |
| [KoinX](https://www.koinx.com/blog/best-crypto-debit-cards), [Koinly](https://koinly.io/blog/best-crypto-debit-card/) | 5-9 | none | n/a | Koinly bot-blocked | Scrape | Jan 2026 / unknown |
| [Bleap](https://www.bleap.finance/en-us/blog/best-crypto-card-full-list-comparison) | partial | Bleap, Solana Card | n/a | Competitor self-promo | Scrape | Jun 2026 |
| [Dune card-transactions](https://docs.dune.com/data-catalog/curated/payments/card-transactions) | 8 providers (Cypher, Etherfi, Exa, Gnosis Pay, Holyheld, Ready, Redotpay, Safepal) | On-chain spend volume | n/a (we have no spend data) | No licence stated; Dune account/plan | SQL/API | Not stated |
| Market reports (Artemis, 4pillars, Visa, Cointelegraph) | Market level | Network/volume stats | n/a | Cite only; methodologies disagree | None | 2026 |

DefiLlama `/cards` returned 403 and a cards dashboard could not be confirmed. No usable 2026 card roundups from Cointelegraph, Decrypt or Bankless were found.

### Wallets

| Site | Coverage | Covers that we lack | We cover that they lack | Licence | Access | Freshness |
|------|----------|---------------------|-------------------------|---------|--------|-----------|
| [WalletBeat](https://github.com/walletbeat/walletbeat) | EVM only: 21 software, 11 hardware, 9 wallet contracts (EIP-7702 delegators) | Privacy, self-sovereignty, tx legibility, bug bounty, release process, key generation, duress resistance, passkeys, per-attribute evidence | Non-EVM, hardware price/display/air-gap, 0-100 score, cards and ramps | **MIT** [V] (keep copyright notice) | Git repo (TypeScript data, not JSON); no hosted API | Pushed 2026-10-10 [V] |
| [Coinspect ranking](https://github.com/coinspect/wallet-security-ranking) | ~159 per-wallet security reports | Independent security reports | Same as above | **CC BY 4.0** [V] (attribution) | Raw JSON via git | Pushed 2026-09-29 [V] |
| [ethereum.org Find a wallet](https://ethereum.org/wallets/find-wallet/) | ~48 wallets | Fees, languages, platform flags, personas | Score, non-EVM, hardware detail | Repo **MIT** [V]; site-text licence not checked | `src/data/wallets/wallet-data.ts` in ethereum/ethereum-org-website | Pushed 2026-10-09; many per-wallet entries stale [V] |
| [WalletScrutiny](https://walletscrutiny.com) | Hundreds of reviews | Reproducible-build verdict per version | Score, cards, ramps | MIT for the site, **reviews carry a different licence** [V]; read before reuse | Jekyll git repo, `api/` JSON | Pushed 2026-10-10 [V] |
| [Privacy Guides](https://www.privacyguides.org) | Criteria-based guidance | Privacy criteria | Table data | **CC-BY-SA-4.0** [V]: link only | Git markdown | Pushed 2026-10-09 [V] |
| [Chainlist](https://chainlist.org), [ethereum-lists/chains](https://chainid.network/chains.json) | Chain registry/RPCs | RPC/chain checks | n/a | GPL-3.0 / MIT [V] | JSON | Live |

## B. Data and info sources we can pull from

| Source | Licence / ToS | API or scrape | Limits | Freshness | Plug-in point |
|--------|---------------|---------------|--------|-----------|----------------|
| DefiLlama free API | Attribution requested [K]. `/oracles` and `bridges.llama.fi` returned **402** [V]; avoid | JSON REST | Not documented [K] | ~hourly [K] | We use only `/v2/chains` (`frontend/src/lib/defillama.ts`). `/protocols`, `/summary/fees/{slug}`, stablecoins.llama.fi, yields.llama.fi, coins.llama.fi returned 200 [V]. Add fetchers beside `defillama.ts` plus a refresh script mirroring `scripts/refresh-github-data.sh` |
| L2BEAT | Repo MIT [V]; `l2beat.com/api/scaling/summary` returned 200 JSON, `api.l2beat.com` 401 [V] | Undocumented JSON | Unknown | Hourly series [V] | Chain security/stage data for the Chains column; expect schema drift, snapshot it |
| GitHub REST | GitHub ToS; 60 req/h unauthenticated, 5000/h with token [V] | JSON + Atom | as stated | Real time | Already used by `scripts/refresh-github-data.sh`. Use `GITHUB_TOKEN` in CI, fall back to `/tags` when `/releases/latest` 404s (trezor-firmware) [V], capture `license.spdx_id` |
| Audit registries (Sherlock, Spearbit) | No licence set on repos [V]: store metadata and links only | Git repos of reports/README | GitHub limits | Per audit | Feeds an Audits column via a `data/audits.json`; Solodit API returned 405 [V]; Code4rena/Cantina/Diligence repos not located |
| Issuer changelogs / GitHub release Atom | Public; respect robots.txt [K] | Atom (stable), app-store pages scrape-only | Light | Real time | Rel/Mo and hardware firmware dates in `scripts/refresh-hardware-wallet-data.sh` |
| ESMA MiCA CASP register | EU public data, attribution [K] | CSV: `esma.europa.eu/sites/default/files/2024-12/CASPS.csv` returned 200, 177 KB, Latin-1 with BOM [V] | None | Updated in place; check `ac_lastupdate` [V] | Join by website host in `scripts/verify-ramps.py` to add a MiCA status to RAMPS.md and cards |
| FCA register (UK), FinCEN MSB | Public; bulk-scraping terms [K] | Web UI; FCA API needs a key [K] | Key-based | Live | Manual `verified_by` links only |
| Dune, Token Terminal | API keys and paid plans [K] | Keyed API | Plan-based | Query-dependent | Deferred: only for custom card-spend queries |
| CoinGecko public API | Attribution on free tier [K]; ping 200 [V] | JSON | ~5-30 req/min [K] | Minutes | Cashback token valuation; coins.llama.fi is an alternative |

## C. Gap analysis

### Cards they list that we lack (all to verify against issuer pages before adding)

Update 2026-10-10: Bitpanda Card and Cypher (inactive) were added. Not added: Bleap (issuer claims MPC key-split self-custody, but the card funding path, issuer and terms are unconfirmed, so no row yet; live at bleap.finance, Europe/Mexico/Brazil, $0 fees, 1-3% cashback per its own page), Tangem Pay (card-opening countries and FX not stated), Ledger CL Card (custody conflicting, fees not on retrieved pages), Oobit (custody, region, FX not stated), SafePal Card (custody, region, cashback not stated), Exa Card (no issuer page found; exa.fi is a domain-sale redirect), Holyheld (no card on its site), Coinbase One Card (coinbase.com returned 403; search snippets only). Details in CRYPTO_CARDS_DETAILS.md Verification Log.

Tangem Pay, Bitpanda Card, Bleap, Coinbase One Card (Amex; status unverified), Exa Card, Holyheld, SafePal Card, Oobit, Ledger CL Card, MEXC/Gate/Pionex cards, Kolo, Hyperbeat Pay, COCA, Mercuryo, Xapo Bank Card, and about 20 smaller ones. **Cypher**: acquisition by Nium and wind-down confirmed on primary pages (cypherhq.io, nium.com, 2026-10-10); added as a discontinued row (cards closed 2026-08-08 00:00 UTC per Cypher; secondary reports said 08-07). SpendNode and cryptocards.so list **Krak Card** where we have Kraken Card; probably the same product, to verify.

Fields they show that we do not: KYC/no-KYC, card network, Apple/Google Pay, virtual vs physical, per-tier variants, on-chain volume.

### Number discrepancies (none concluded wrong)

| Card | Ours | Theirs | Status |
|------|------|--------|--------|
| Crypto.com | 0-4.5% cashback, FX 0-3% (issuer, Oct 2026) | Basic 1.5% / Plus 3.5% / Pro 4.5% / Private 5-6% (Eco) | Check issuer US page |
| KAST | 1.5-3% | 1.5/2/3% | Agrees after #93 |
| Gnosis Pay | Global* | EEA+UK only (QuickNode, Eco) | Check issuer page |
| Binance | Brazil, up to 3% | Europe/UK, up to 8% BNB (KoinX) | Check issuer page |
| BitPay | 0% FX | 3% FX (KoinX) | Check issuer page |
| Wirex, Nexo, Coinbase | various | sources conflict | Check issuer pages |
| Bybit, Gemini | | Match | OK |

### Wallets they list that we lack

WalletBeat software: Base App, Bitget Wallet, Elytro, Family, Gem Wallet, Mt Pelerin, NuFi, PillarX, Zeus. Hardware: Firefly, imKey. ethereum.org candidates: TokenPocket, Cake Wallet, Edge, Unstoppable, Ready (ex-Argent, so our Argent row may be stale), AlphaWallet, Braavos, Railway. Wallet list comes from repo file names, not the rendered site.

Metrics we lack: privacy (address correlation, private transfers, data collection), self-sovereignty (chain verification, L1 provider independence, tx inclusion), bug bounty, release process/reproducible builds, key generation, duress resistance, passkeys, EIP-7702 delegator analysis, per-attribute evidence links.

## D. Recommendations

1. Add the 11 WalletBeat-listed wallets (MIT) with issuer/repo verification of each field; mark unknown fields TBD. Largest wallet win.
2. Add Bug Bounty, Reproducible Build (WalletScrutiny verdict) and Chain Verification columns with evidence links.
3. Vendor Coinspect report links (CC BY 4.0, attribution in `DATA_SOURCES.md`) as a per-wallet security link.
4. Harden `refresh-github-data.sh`: token, tag fallback, licence capture.
5. Wire the ESMA MiCA CSV into `verify-ramps.py`; add DefiLlama stablecoin/TVL fetchers.
6. Cards: verify and add Tangem Pay, Bitpanda, Bleap, Exa, Holyheld, SafePal, Oobit, Ledger CL; confirm Cypher shutdown and Coinbase One status; consider KYC, network and virtual/physical columns.
7. Do not copy competitor data. Treat SpendNode and cryptocards.so as to-check lists.

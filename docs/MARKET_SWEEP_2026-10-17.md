# Crypto card market sweep, 2026-10-17

Window: about 2026-07-15 to 2026-10-17. All sources accessed 2026-10-17. "Secondary" = news, review or aggregator page. Per-field sources are in [CRYPTO_CARDS_DETAILS.md](../CRYPTO_CARDS_DETAILS.md#market-sweep-2026-10-17).

Coverage caveat: the sweep found no new consumer card launch in the US, Canada, APAC or EU/MEA that an issuer page confirms. Several official pages blocked fetches (403/429); "not found" means not seen.

## Diff

### New rows (5)
Ledger CL Card (confirmed on Ledger's page), Xplace Platinum, COCA, Oobit, Deblock. Fields the issuer page does not state are `TBD` or marked secondary; custody is CeFi where the issuer does not state the funding path (Bleap precedent); status ⚠️ except Ledger CL.

### Changed (3)
- Wirex: legacy app discontinued for the EEA 2026-09-30 (primary: status.wirexapp.com). Cardano Card ends 2026-10-31 (secondary).
- Gnosis Pay: cashback eligibility ended 2026-09-30, card ends 2026-12-20 (secondary; help article 404).
- Plutus: status to ⚠️. Site links a "2026 Transition Update" we could not read; a Modulr partner collapse is claimed by one review site only.

### Dead or paused (context for existing rows)
Kulipa halted around 2026-07-29 (Ready, Solflare); CEO denies insolvency. Cypher/Moonwell Card: spend stopped 2026-08-07, withdrawals closed 2026-09-06. BitMart exchange wind-down (card stop unverified).

### Watchlist, not added
Gate Card / Gate Money, Gate US Card, Lava Card, Square/Block BTC credit card, Orbi (Mexico), Tria Lite $20/yr, ThorWallet card tiers, MEXC/Pionex/Kolo/Peanut/Rizon/Solid/Zypto/Hyperbeat/Cryptomus (listed by trackers, no primary source read). Add when an issuer page states terms.

## Competitors

| Site | Lists | Notable features |
|---|---|---|
| [SpendNode](https://www.spendnode.io/) | 42 issuers, "last verified Oct 14, 2026" | Compare up to 4 with shareable links, scenario math, break-even tables, 108 country pages, filters (rewards, fees, custody, region), persona picks, submit-your-card form, weekly checks, alerts "coming soon"; affiliate disclosure page but tracked links |
| [The Grid](https://thegrid.id/discovery/productType/card) | 194 card projects | Filter by chain and Visa/Mastercard program |
| [Spark.money](https://www.spark.money/tools/crypto-debit-card-comparison) | 6 families | Fee math, custody and tax notes; affiliate disclosure |
| [Eco.com](https://eco.com/support/en/articles/15039724-best-crypto-debit-cards-in-2026-ranked-by-fees-and-rewards) | 8 | Issuer-published data only, unknown fees left blank; checked Oct 6, 2026 |
| [Coin Bureau](https://coinbureau.com/analysis/best-crypto-debit-cards) | ~13 | /10 ratings; last updated Mar 2026 (stale); tracking links, no labelled disclosure |
| DefiLlama cards, Ranky.fi | n/a | Not fetched (403 / search snippet only): chain, country, fee filters, calculator |

## Ranked feature ideas
1. **Per-card "last verified" date** in the table and detail pages. Cheap (a column or detail line); SpendNode and Eco show it. Fits our source-linked mission.
2. **Region/custody/type filters on the cards page** (the site already has explore presets for other tables; reuse).
3. **Earnings calculator** at the reader's monthly spend, using Cash Back, Annual Fee and FX Fee columns (needs numeric parsing of ranges; start with the cards that have single values).
4. **Compare up to 4 cards** with a shareable URL (extend the existing explore URL state).
5. **Dead and paused cards view with a dated change log.** No tracker offers this; we already carry the data (struck-through rows, recheck logs). Likely our clearest differentiator.
6. **Per-country landing pages** (generated from the Region column), after region data is cleaned up.
7. **"Submit a card / report a change" intake** that links to CONTRIBUTING (GitHub issue template), keeping no pay-to-rank.
8. Term-change alerts (RSS from CHANGELOG), low cost; email alerts later.

Not recommended: affiliate links (conflicts with the no-pay-to-rank mission) and adding exchange/infra projects without a consumer card.

## Follow-up (same day)
Done from the list above: #1 last-verified badge (stale after 60 days), #2 region filter now matches multi-region cards (US/EU), a "Discontinued" quick preset keeps dead cards visible, and the weekly runbook is [CARD_RESWEEP_RUNBOOK.md](./CARD_RESWEEP_RUNBOOK.md). Watchlist retry added Lava Card; the rest stay unconfirmed (see the sweep log).

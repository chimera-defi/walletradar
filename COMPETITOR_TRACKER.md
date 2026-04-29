# Competitor Tracker

## Card Comparison Sites

Use this file as the persistent watchlist for sites that compare crypto cards.

## Why This Exists

- Keep competitor discovery in one place
- Track freshness signals and reliability issues
- Run periodic refresh passes against credible sources

## Current Watchlist

| Site | Focus | Positioning | Data Depth | Notable Signal | Last Checked |
| ---- | ----- | ----------- | ---------- | -------------- | ------------ |
| [ccompare.cards](https://ccompare.cards/) | Cards | Mobile-first card explorer | High (bundle exposes tier-level fee fields, country lists, source URLs) | 23 card programs in embedded dataset | 2026-04-23 |
| [spendnode.io](https://www.spendnode.io/crypto-cards/compare-crypto-cards/) | Cards | Side-by-side comparison tool | High | Public compare tool with filters and broad card set | 2026-04-23 |
| [cardpilled.com](https://www.cardpilled.com/) | Cards | Aggregator + compare tool | Medium | Homepage claim: "100+ cards" | 2026-04-23 |
| [crypto-cards.io](https://crypto-cards.io/) | Cards | Card database | Medium | Global card directory framing | 2026-04-23 |
| [curat.money](https://curat.money/) | Cards | Discovery + community | Medium | "Explore and compare" positioning | 2026-04-23 |
| [cards.cryptacore.com](https://cards.cryptacore.com/en/compare) | Cards (EU-heavy) | Regional comparison | Medium | Europe-focused compare UI | 2026-04-23 |
| [opencryptocards.com](https://opencryptocards.com/compare) | Cards | Comparison directory | Medium | "Compare every crypto card" claim | 2026-04-23 |
| [cryptocardindex.com](https://cryptocardindex.com/) | Cards | Prepaid-card comparison | Medium | Prepaid specialization + compare framing | 2026-04-23 |
| [crypt.credit](https://crypt.credit/) | Cards | Reviews + comparison | Medium | 2026 comparison/reviews positioning | 2026-04-23 |
| [cryptocardhub.com](https://www.cryptocardhub.com/) | Cards | Card directory | Low/Medium | "Comprehensive directory" positioning | 2026-04-23 |
| [creditbit.org](https://www.creditbit.org/) | Multi-product (cards, loans, savings) | Legacy comparison site | Low (bot gate at check time) | Bot verification wall during review | 2026-04-23 |

## Review Cadence

- Monthly light pass: check uptime, scope changes, and new card names
- Quarterly deep pass: source-level diff versus `CRYPTO_CARDS.md`
- Triggered pass: run immediately when user submits a new competitor URL

## Intake Rules For Walletradar

1. Only copy card data that can be traced to official provider docs or terms pages.
2. Keep status conservative (`⚠️`) when source terms are incomplete or contradictory.
3. Never import placeholder "coming soon" cards without issuer documentation.
4. Log additions and major corrections in `CHANGELOG.md`.

## Third Review Notes (ccompare.cards)

- Found 11 names we did not fully map; 8 were active enough for table inclusion.
- Added to `CRYPTO_CARDS.md`: Bleap, Deblock, Spritz, Pyra, Cypher, Rebind, Ugly Cash, Holyheld.
- Updated Kraken row using Krak terms details (promo cashback period and spread disclosure).
- Deferred placeholders: Monet, Moto, Hyperbeat.

## UI/UX Learnings From ccompare.cards

- Strong mobile-first framing: app-like interaction makes compare flow feel lightweight.
- Card-tier model is explicit: users can switch tiers and immediately see fee/cashback deltas.
- Each card links both to `Get Card` and `View Source`, which is good trust UX for research-heavy users.
- Geo coverage detail is surfaced directly from the card panel (`See all countries`), reducing hidden constraints.

**Last Updated:** April 23, 2026

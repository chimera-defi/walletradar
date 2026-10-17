# Crypto On/Off-Ramp Comparison - Full Documentation

> **Source of truth note:** Current `Score` values are generated from the visible columns in [RAMPS.md](./RAMPS.md) via `scripts/sync_table_scores.js` (`2026-04-visible-columns-v3`). If a long-form section below mentions older rankings or approximate scores, trust the main comparison table.

> **TL;DR:** The generated snapshot below mirrors the current main-table ordering and scores. Use it for the latest rankings; the long-form sections below explain fee structures, geographic coverage, and integration tradeoffs.

<!-- GENERATED_RAMPS_SNAPSHOT_START -->
> **Current generated snapshot:** CoinGate (90, Low fees, 🟢), BitPay (89, Bitcoin focus, 🟢), Stripe (88, Trust, 🟢), and Guardarian (86, EU focus, 🟢). Regenerated from [RAMPS.md](./RAMPS.md) by `scripts/sync_table_scores.js` using methodology `2026-04-visible-columns-v3`.

### Current Top Rows (generated)
| Rank | Provider | Score | Best For | Rec |
| ---- | -------- | ----- | -------- | --- |
| 1 | **CoinGate** | 90 | Low fees | 🟢 |
| 2 | **BitPay** | 89 | Bitcoin focus | 🟢 |
| 3 | **Stripe** | 88 | Trust | 🟢 |
| 4 | **Guardarian** | 86 | EU focus | 🟢 |
| 5 | **Ramp** | 86 | EU / Speed | 🟢 |
<!-- GENERATED_RAMPS_SNAPSHOT_END -->

**Data Sources:** Provider fee pages, developer docs, ESMA MiCA CASP register, company press releases. Re-checked 2026-10-15; anything not re-checked is listed under "Verification status by provider" below.

**Verification Status:** Re-checked 2026-10-15 against provider pages fetched that day. Where a page blocked the fetch (HTTP 403) or published no figure, the value is marked UNVERIFIED rather than guessed. Values marked "~" are approximate.

### Ramps URL Verification (Automated)

Ran `scripts/verify-ramps.py` on 2026-10-15 and again on 2026-10-17 (the licence table below is unchanged) (direct fetch, `r.jina.ai` fallback, ESMA MiCA CASP register lookup).

**Direct FAIL + proxy OK:** Coinbase Pay, Banxa, Simplex  
**Bot/Access flags:** Sardine, Mercuryo, Transak, MoonPay, Modern Treasury (access denied); MoonPay and Modern Treasury also return "not found" text. CoinGate and CoinSwitch fail only through the proxy.  
**Other notable:** `ramp.network` now 301-redirects to `rampnetwork.com` and `utorg.pro` to `utorg.com`; the table links were updated. Transak and the Coinbase help centre return 403 to automated fetches.

---

## 🌉 Top Providers Comparison

<!-- GENERATED_RAMPS_TOP_PROVIDERS_START -->
This table mirrors the current generated ordering from [RAMPS.md](./RAMPS.md):

| Provider | Score | Best For | Global Coverage | Fee Model | Dev UX |
|----------|-------|----------|-----------------|-----------|--------|
| [**CoinGate**](https://coingate.com/) | 90 | Low fees | Global | Low | Good (API) |
| [**BitPay**](https://bitpay.com/) | 89 | Bitcoin focus | Global | Medium | Good (API) |
| [**Stripe**](https://docs.stripe.com/stablecoins) | 88 | Trust | Global | Usage Based | Excellent (Stripe style) |
| [**Guardarian**](https://guardarian.com/) | 86 | EU focus | ~170+ Countries | Low/Medium | Good (Widget) |
| [**Ramp**](https://rampnetwork.com/) | 86 | EU / Speed | ~150+ Countries | Low/Medium | Good (SDK) |
| [**Changelly**](https://changelly.com/) | 85 | Exchange | Global | Medium | Good (API) |
| [**Coinbase Pay**](https://docs.cdp.coinbase.com/onramp/introduction/welcome) | 84 | Coinbase users | ~90+ Countries | Medium | Excellent (SDK) |
| [**Coinify**](https://www.coinify.com/) | 84 | EU | ~170+ Countries | Medium | Good (API) |
| [**Sardine**](https://www.sardine.ai/) | 84 | US / Fraud | US + Select Global | Variable (Risk based) | Advanced (API/SDK) |
| [**Alchemy Pay**](https://ramp.alchemypay.org/#/index) | 82 | Global pay rails | ~170+ Countries | Variable | Advanced (Plugin/API) |
<!-- GENERATED_RAMPS_TOP_PROVIDERS_END -->

---

## 💰 Fee Structure Analysis

Fees are the biggest friction point for users. They typically consist of three parts:
1.  **Processing Fee:** charged by the ramp (e.g., 1% - 3.5%).
2.  **Network Fee:** Gas costs (user pays).
3.  **Spread:** The difference between the quoted price and market spot price (often hidden, 1% - 3%).

| Provider | Est. Processing Fee | Est. Spread | Min. Fee | Notes |
|----------|---------------------|-------------|----------|-------|
| **Ramp** | Up to 1.40% (manual bank transfer), up to 2.40% (easy bank transfer), up to 3.9% (card in USD/EUR/GBP), up to 5.45% (card in other currencies), up to 2.90% (Pix) | UNVERIFIED | €2.49 | Source: rampnetwork.com/pricing-policy, 2026-10-15. Percentages are maximums; pricing varies by asset, currency and country |
| **Transak** | UNVERIFIED (~3.5% cards, ~$5.00 minimum are older figures; transak.com returned 403 on 2026-10-15) | UNVERIFIED | UNVERIFIED | Transak docs say fees depend on region, payment method and volume; use the quote endpoint for live fees |
| **MoonPay** | Up to 4.5% (card) | UNVERIFIED | Up to $3.99 direct, up to $4.50 for partner referrals | Source: moonpay.com/legal/pricing_disclosure, 2026-10-15. Non-USD orders add 0.25% to 10% to the minimum. Virtual accounts typically about 1%. Cash App Pay 2.9% + $0.30 |
| **Stripe** | Custom | Custom | Custom | Usage-based pricing for businesses. Stripe docs (2026-10-15) publish no fee figures; hosted onramp is in public preview and needs an application |
| **Coinbase Pay (Onramp)** | 2.5% credit card, 0.5% ACH, plus spread | UNVERIFIED | n/a (not a fee; Apple Pay / Google Pay minimum purchase about $5) | Source: docs.cdp.coinbase.com FAQ, 2026-10-15. Free for developers. Guest checkout in the hosted widget deprecated 2026-06-30 |
| **CoinGate** (merchant) | 1% payment processing | n/a | Crypto payouts €0.50 + 0.5% | Source: coingate.com/pricing, 2026-10-15 |
| **BitPay** (merchant) | 2% + $0.25 under $500k/month; 1.5% + $0.25 to $1M; 1% + $0.25 above | n/a | n/a | Source: bitpay.com/pricing, 2026-10-15 |

> **Agent Insight:** "Zero Fee" promotions often hide costs in the **Spread**. Always check the final "Amount Received" vs. Spot Price.

---

## 🛠️ Developer Experience (DX)

### 1. Integration Methods
*   **Widget (No-Code/Low-Code):** The easiest way. You embed an iframe or use a React component.
    *   *Supported by:* Transak, MoonPay, Ramp, Banxa.
*   **API (Custom UI):** You build the UI, they handle the logic. Requires more compliance work (PCI-DSS often handled by them, but UI is on you).
    *   *Supported by:* Sardine, Stripe, MoonPay (Enterprise), Transak (Enterprise).

### 2. KYC & Compliance
*   **Merchant of Record (MoR):** All listed providers act as the MoR. They handle chargebacks, fraud, and KYC.
*   **Tiered KYC:**
    *   **Low Tier (<$150):** Often just Name + Address + DOB (Simplified).
    *   **High Tier (>$150):** ID Scan + Selfie required.
*   **Friction:** **Sardine** and **Stripe** are noted for better fraud detection that reduces false declines, a major issue with crypto purchases.

### 3. Supported Chains
*   **Transak & MoonPay:** Support the widest range of long-tail assets and chains (L1s, L2s, some L3s).
*   **Coinbase Pay:** Strong Coinbase ecosystem integration (Base, Ethereum, Solana, Bitcoin, and Coinbase-supported chains).
*   **Ramp:** Strong focus on Ethereum L2s (Arbitrum, Optimism, zkSync, Base).
*   **Stripe:** More conservative asset list (mostly majors: BTC, ETH, SOL, USDC).
*   **Modern Treasury:** Enterprise payment infrastructure with crypto capabilities, primarily US-focused.
*   **BitPay:** Bitcoin-focused with some altcoin support (BCH, ETH, LTC, XRP, DOGE).
*   **Guardarian, Utorg, CoinGate:** Multi-chain support with varying coverage of major chains.

---

## 🟢 Recommendation Guide

### "I need..."

*   **...to support the most countries & tokens:**
    *   👉 **Transak** or **MoonPay**. They cover 160+ countries and thousands of tokens.

*   **...the lowest fees for my users:**
    *   👉 **Ramp Network** (especially for bank transfers/SEPA).

*   **...higher limits & instant settlement in the US:**
    *   👉 **Sardine**. Their "Instant ACH" is a game changer for high-value NFT mints or DeFi deposits.

*   **...my users to feel safe:**
    *   👉 **Stripe**. Users recognize the brand and UI.

*   **...to support local payment methods (e.g., POLi in Australia, iDEAL in Netherlands):**
    *   👉 **Banxa**. They specialize in local payment rails.

---

## ⚠️ Implementation Checklist
1.  **Webhooks:** Set up webhooks to listen for `ORDER_COMPLETED` or `ORDER_FAILED` events to update your UI.
2.  **Environment:** Always test in `STAGING` / `SANDBOX` mode first. Real money testing is painful.
3.  **Geo-Blocking:** Ensure your UI handles unsupported regions (e.g., New York, Texas, Crimea, etc.) gracefully if the widget doesn't auto-detect.

---

## Scoring Methodology

Scores are generated from visible columns in [RAMPS.md](./RAMPS.md) by `scripts/sync_table_scores.js`, using `computeRampScore` from `frontend/src/lib/scoring.js`.

Current category weights (100 total):

1. **Coverage (25):** Country/region reach from `Coverage`.
2. **Product Breadth (15):** Whether provider supports both `On-Ramp` and `Off-Ramp`.
3. **Developer UX (18):** Integration quality from `Dev UX`.
4. **Pricing Shape (25):** Combined `Fee Model` and `Min Fee` friction.
5. **Operational Confidence (15):** Live status from `Status`.
6. **Company Track Record (2):** Light confidence signal from `Founded` + `Funding`.

Recommendation bands:

- **🟢 Recommended:** top half of active providers
- **🟡 Situational:** middle quartile of active providers
- **🔴 Avoid:** bottom quartile or inactive provider

Why this model:

- Uses only table-visible inputs to prevent hidden-variable drift.
- Keeps business durability (`Founded`, `Funding`) as a small tie-breaker, not a dominant factor.
- Ensures every scored column is explicit and auditable in the markdown table.

---

## Integration Guides

### Transak Integration
- **Widget:** React SDK available, easy integration
- **API:** Enterprise API for custom UI
- **Documentation:** Comprehensive docs with examples
- **Support:** Active developer community

### MoonPay Integration
- **Widget:** Simple iframe or React component
- **API:** Enterprise tier available
- **Documentation:** Good documentation
- **Support:** Email support, developer resources

### Ramp Integration
- **Widget:** SDK available
- **API:** Custom integration possible
- **Documentation:** Good documentation
- **Support:** Developer support available

### Sardine Integration
- **Widget:** Limited widget support
- **API:** Primary integration method (API/SDK)
- **Documentation:** Advanced documentation
- **Support:** Enterprise support available

### Stripe Integration
- **Widget:** Stripe-style integration
- **API:** Full API access
- **Documentation:** Excellent documentation (Stripe standard)
- **Support:** Premium support available

### Coinbase Pay Integration
- **Widget:** React SDK available
- **API:** Full API access
- **Documentation:** Excellent Coinbase documentation
- **Support:** Coinbase developer support

### Simplex Integration
- **Widget:** Simple widget integration
- **API:** API available
- **Documentation:** Good documentation
- **Support:** Email support

### Modern Treasury Integration
- **Widget:** No widget (API-only)
- **API:** Full REST API
- **Documentation:** Excellent enterprise documentation
- **Support:** Enterprise support available

### Guardarian Integration
- **Widget:** Widget available
- **API:** API available
- **Documentation:** Good documentation
- **Support:** Email support

### CoinSwitch Integration
- **Widget:** Limited widget
- **API:** Primary integration method
- **Documentation:** Good API docs
- **Support:** Developer support

### Utorg Integration
- **Widget:** Widget available
- **API:** API available
- **Documentation:** Good documentation
- **Support:** Email support

### CoinGate Integration
- **Widget:** No widget (API-only)
- **API:** Full API
- **Documentation:** Good API documentation
- **Support:** Email support

### BitPay Integration
- **Widget:** No widget (API-only)
- **API:** Full API
- **Documentation:** Good merchant API docs
- **Support:** Merchant support

### Changelly Integration
- **Widget:** No widget (API-only)
- **API:** Full API
- **Documentation:** Good API documentation
- **Support:** Email support

### Coinify Integration
- **Widget:** No widget (API-only)
- **API:** Full API
- **Documentation:** Good API documentation
- **Support:** Email support

### onesafe Integration
- **Widget:** No widget (API-only)
- **API:** Full API
- **Documentation:** Enterprise documentation
- **Support:** Enterprise support

### Reap Integration
- **Widget:** No widget (API-only)
- **API:** Full API (off-ramp only)
- **Documentation:** Business API documentation
- **Support:** Business support

### Coinmama Integration
- **Widget:** Basic widget
- **API:** Limited API
- **Documentation:** Basic documentation
- **Support:** Email support

---

## Provider-Specific Notes

### Transak
- **Website:** [transak.com](https://transak.com/)
- Best for developers seeking React SDK
- Wide chain and token support
- Good documentation
- Medium fees

### MoonPay
- **Website:** [moonpay.com](https://www.moonpay.com/)
- Widest coverage (~160+ countries)
- Highest conversion rates
- High fees but reliable
- Good widget integration

### Coinbase Pay
- **Website:** [docs.cdp.coinbase.com/onramp](https://docs.cdp.coinbase.com/onramp/introduction/welcome)
- Now branded Coinbase Onramp (developer docs: docs.cdp.coinbase.com/onramp). Available in all countries Coinbase operates in except Japan; debit cards in the US plus 90+ countries, credit cards in 90 countries excluding the US, ACH US only
- Guest checkout (debit card, Apple Pay) via the hosted widget was deprecated on 2026-06-30
- Seamless Coinbase ecosystem integration
- Strong Base L2 support
- Excellent SDK and documentation
- Medium fees
- Best for apps targeting Coinbase users

### Ramp
- **Website:** [rampnetwork.com](https://rampnetwork.com/)
- Lowest fees for bank transfers
- Strong EU/SEPA support
- Focus on L2 chains
- Good SDK

### Sardine
- **Website:** [sardine.ai](https://www.sardine.ai/)
- Best for US market
- Instant ACH settlement
- Advanced fraud detection
- Higher limits

### Stripe
- **Website:** [docs.stripe.com/stablecoins](https://docs.stripe.com/stablecoins)
- Mainstream brand recognition
- Excellent developer experience
- Conservative asset list
- Usage-based pricing

### Simplex
- **Website:** [simplex.com](https://www.simplex.com/)
- High transaction limits
- Strong card processing
- Good widget integration
- Medium to high fees
- Widely integrated

### Modern Treasury
- **Website:** [moderntreasury.com](https://www.moderntreasury.com/)
- Enterprise payment infrastructure
- Strong API and developer tools
- US-focused with select global
- Usage-based pricing
- Best for large-scale operations

### Banxa
- **Website:** [banxa.com](https://banxa.com/)
- Taken private by OSL Group (863.HK); arrangement effective 2026-01-02 at C$1.55 per share (Banxa press release via Newsfile). Banxa is now a wholly owned OSL subsidiary
- Local payment methods
- Good global coverage
- Variable fees
- B2B focus

### Mercuryo
- **Website:** [mercuryo.io](https://mercuryo.io/)
- B2B focused
- Global coverage
- Medium fees
- Good for enterprise

### Guardarian
- **Website:** [guardarian.com](https://guardarian.com/)
- European focus
- Good widget integration
- Competitive fees
- Strong EU payment methods
- 170+ countries per guardarian.com, 1000+ coins, 20+ payment methods (2026-10-15); site says "zero extra costs" and gives no fee figure

### CoinSwitch
- **Website:** [coinswitch.co](https://coinswitch.co/)
- Strong India/APAC presence
- Good API integration
- Local payment methods (UPI, etc.)
- Medium fees
- Best for Indian market

### Utorg
- **Website:** [utorg.com](https://utorg.com/)
- Multi-chain support
- Good widget integration
- Widget shows "Service fee 0%"; no other schedule published
- 130+ countries per utorg.com (restricted residency list includes Germany, Netherlands, Austria, Japan, Singapore), 30+ local payment methods (2026-10-15)
- Balanced offering

### CoinGate
- **Website:** [coingate.com](https://coingate.com/)
- Very low fees
- Strong API
- Global coverage
- Bitcoin and altcoin support
- Good for cost-sensitive applications

### BitPay
- **Website:** [bitpay.com](https://bitpay.com/)
- Bitcoin-focused
- Strong merchant tools
- Good API
- Medium fees
- Best for Bitcoin-heavy applications

### Changelly
- **Website:** [changelly.com](https://changelly.com/)
- Exchange-focused
- Good API integration
- Medium fees
- Global coverage
- Best for exchange integrations

### Coinify
- **Website:** [coinify.com](https://www.coinify.com/)
- European focus
- Good API
- Medium fees
- 170+ countries per coinify.com (2026-10-15); fee page not fetched
- EU payment methods

### onesafe
- **Website:** [onesafe.io](https://onesafe.io/)
- Enterprise-focused
- Variable pricing
- Select global coverage
- Good API
- Best for enterprise use cases

### Reap
- **Website:** [reap.global](https://reap.global/)
- **Off-ramp only** (no on-ramp)
- Business-focused
- Global coverage
- Variable fees
- Best for business off-ramp needs

### Coinmama
- **Website:** [coinmama.com](https://www.coinmama.com/)
- **On-ramp only** (no off-ramp) in the table. UNVERIFIED: coinmama.com now says "Payouts in 180 countries", which suggests a sell flow; the sell page was not found (HTTP 404), so the Off-Ramp cell is unchanged
- Simple integration
- High fees
- ~190+ countries (buying), per coinmama.com 2026-10-15
- Basic widget
- Best for simple on-ramp needs

---

## Licences (ESMA MiCA CASP register)

`scripts/verify-ramps.py` matched table hosts against the ESMA CASP register (`esma.europa.eu/sites/default/files/2024-12/CASPS.csv`, entries last updated up to 2026-09-21) on 2026-10-15. "No host match" only means no entry under that web domain. It does not mean the provider is unlicensed.

| Provider | Register entity | Home state | Authorised |
|----------|-----------------|------------|------------|
| Coinbase Pay | Coinbase Luxembourg S.A. | LU | 20/06/2025 |
| CoinGate | UAB Decentralized | LT | 16/12/2025 |
| BitPay | BitPay B.V. | NL | 16/07/2026 |
| Banxa | EU Internet Ventures B.V. | NL | 08/10/2025 |
| Simplex | Nuvei Liquidity UAB | LT | 16/12/2025 |
| MoonPay | MoonPay Europe B.V. | NL | 30/12/2024 |
| Coinify | Coinify ApS | DK | 29/05/2026 |
| Ramp | Ramp Swaps (Ireland) Limited (domain rampnetwork.com, matched by hand after the table link was corrected) | IE | 02/12/2025 |
| Robinhood Connect | Robinhood Europe UAB. This is the EU entity, not the US on-ramp product, so it is not a licence for Connect | LT | 29/05/2025 |

No host match (not verified either way): Stripe, Changelly, Sardine, Guardarian, Alchemy Pay, Mercuryo, Transak, CoinSwitch, onesafe, Utorg, Modern Treasury, Reap, Coinmama. Utorg's own site says "Aligned with MiCA" without naming an authorisation. The register lists an entity-level match only; product and region scope were not checked.

## Verification status by provider (2026-10-15)

| Provider | Checked and updated | UNVERIFIED (reason) |
|----------|--------------------|---------------------|
| Coinbase Pay | Fees 2.5% card / 0.5% ACH, countries, payment methods, rename, guest-checkout deprecation (docs.cdp.coinbase.com) | Table min fee (~$1.00 had no source, now "Not published"); limits not published |
| CoinGate | 1% fee, 180+ payout countries, MiCA licence (coingate.com) | Min fee ~€0.01 (only crypto payout €0.50 + 0.5% found) |
| BitPay | Merchant fee tiers, NYDFS licence mention, coins (bitpay.com/pricing) | Ramp-specific min fee and country list (not published) |
| Stripe | Link moved from stripe.com/docs/crypto (redirects) to docs.stripe.com/stablecoins on 2026-10-17: the page covers stablecoin payouts (160+ countries), accepting crypto payments and the fiat-to-crypto onramp (public preview, application needed; Stripe is merchant of record) | Fees, countries, tokens (docs publish none); the Off-Ramp ✅ cell (the stablecoins page lists wallet payouts and an onramp, no fiat off-ramp product); third-party claims not used |
| Ramp | Fees, min fee €2.49, 150+ countries, 120+ assets, payment methods (rampnetwork.com) | Founded/funding |
| Changelly | none | FAQ page published no fees or countries |
| Sardine | none | Site and docs published no fees, countries or limits |
| Guardarian | 170+ countries, 1000+ coins, 20+ payment methods | Min fee ~€5.00 (site says "zero extra costs") |
| Alchemy Pay | 173 countries for fiat-crypto purchases (alchemypay.org, 2026-10-17) | Fees (no figures published) |
| Mercuryo | Homepage says 150+ countries, 70+ coins, 10+ payment methods | Fees not published; table says Global |
| Banxa | OSL take-private effective 2026-01-02; MiCA authorisation stated on site | Fees ("flexible, customised"), country count (counter showed 0) |
| Simplex | 190+ countries, payment methods | Fees, limits (not published) |
| Transak | Production KYC country API (api.transak.com/api/v2/countries) lists 26 allowed countries on 2026-10-17; fees page not published (headless Chromium reached transak.com, no fee figure) | Fees;  sources conflict on country count (26+ on global-coverage page, 162+ elsewhere), so ~64 is unchanged |
| CoinSwitch | Still operating as an India crypto exchange; minimum entry ₹100 | Ramp fees, API product details |
| MoonPay | Card fee up to 4.5%, min fee up to $3.99 / $4.50 | Country count (~160+), token count |
| onesafe | none | Not re-fetched |
| Utorg | 130+ countries, 0% widget service fee, 30+ payment methods | Min fee ~$5.00 |
| Coinify | 170+ countries, MiCA authorisation (register) | Fees, payment methods |
| Modern Treasury | Stablecoin on/off-ramp orchestration product exists | Fees, countries |
| Reap | Card issuing, payments in 200+ countries, licensed in Hong Kong and Mexico | Off-ramp-only label; "ramps" listed as a module; no fees |
| Robinhood Connect | No fee charged to Robinhood customers for transfers | Non-customer fees, state list |
| Coinmama | 190+ countries (buying), payouts in 180 countries, $50 minimum | Off-ramp availability, ~$30 min fee |

New providers: none added. No candidate had primary-source figures for every column this run.

---

## Related Resources

- [Software Wallet Comparison](./SOFTWARE_WALLETS.md)
- [Hardware Wallet Comparison](./HARDWARE_WALLETS.md)
- [Crypto Credit Card Comparison](./CRYPTO_CARDS.md)

---

**Last Updated:** October 17, 2026

**Verification Notes:**
- Re-checked 2026-10-15; sources are cited inline and in the section below.
- Coverage counts, fees and limits change often. Check the provider before integrating.
- Values marked with "~" are approximate; UNVERIFIED means the provider page was blocked or published no figure.

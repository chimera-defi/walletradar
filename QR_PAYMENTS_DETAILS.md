# QR Payment Crypto Providers - Full Documentation

> **TL;DR:** **Flexa** is the leader for retail POS with guaranteed settlement and widest asset support. **NOWPayments** offers payments from 1% (0.5% on some third-party reports, UNVERIFIED) with 300+ cryptos. **Coinbase Commerce** provides brand trust and easy integration. **YODL Pay** enables QR payments in emerging markets where merchants receive local fiat.

**Data Sources:** Developer Documentation, Fee Schedules, Integration Guides (re-checked 2026-10-15).

**Verification Status:** Re-checked 2026-10-15. Items that could not be confirmed from a primary page are marked UNVERIFIED. Scores live only in the main table [QR_PAYMENTS.md](./QR_PAYMENTS.md); they are older estimates, and no script computes QR scores, so they were not recomputed. Values marked with "~" are approximate and should be verified on official provider websites before integration.

---

## 💰 Fee Structure Analysis

Fees are critical for merchant adoption. QR payment providers typically offer lower fees than traditional card networks.

| Provider | Est. Processing Fee | Spread | Settlement | Notes |
|----------|---------------------|--------|------------|-------|
| **Flexa** | ~0.5% UNVERIFIED | Low | Guaranteed | No chargebacks. Verify on flexa.co |
| **NOWPayments** | 1% starting fee, "even smaller" at higher volume (nowpayments.io, 2026-10-15). Third-party reviews cite 0.5% for same-coin payments; not on the official pages fetched | Low | Same crypto | Non-custodial option |
| **Coinbase Commerce** | 1% UNVERIFIED (third-party only) | Low | Fiat or Crypto | Being replaced by Coinbase Business (US and Singapore businesses only); see below |
| **BitPay** | 2% + 25¢ under $500k/month; 1.5% + 25¢ to $1M; 1% + 25¢ above (bitpay.com/pricing, 2026-10-15) | Low | Fiat, daily | Higher rates for high-risk industries |
| **CoinGate** | 1% | Low | Fiat or Crypto | EU compliant. Verify on coingate.com |
| **YODL Pay** | None ("no Yodl payment fee") | FX spread plus gas | Local Fiat via licensed local partner | yodl.me, 2026-10-15; Yodl does not custody or settle |
| **Binance Pay** | UNVERIFIED for merchants (page says no gas fees on P2P transfers) | Variable | Crypto | Binance ecosystem only |
| **Alchemy Pay** | Variable | Variable | Fiat | ACH token rewards. Verify on alchemypay.org |

> **Key Insight:** CoinGate lists 1% and NOWPayments from 1%; BitPay is tiered from 1% to 2% plus 25¢. Flexa's ~0.5% is UNVERIFIED (flexa.co lists no fee). Binance Pay settles in crypto only.

---

## 🔲 QR Payment Technology

### How QR Payments Work

1. **QR Code Generation:** Merchant generates a unique QR code for the transaction
2. **Customer Scan:** Customer scans QR with their crypto wallet app
3. **Wallet Recognition:** Wallet recognizes payment URI (bitcoin:, ethereum:, etc.)
4. **Transaction Signing:** Customer reviews and confirms payment
5. **Settlement:** Merchant receives confirmation and settlement

### QR Code Standards

- **Bitcoin URI:** `bitcoin:<address>?amount=<value>&label=<merchant>`
- **Ethereum URI:** `ethereum:<address>@<chainId>?value=<wei>`
- **EIP-681:** Standard for Ethereum payment requests
- **BIP-21:** Standard for Bitcoin payment URIs

---

## 🛠️ Developer Experience (DX)

### 1. Integration Methods

| Provider | Widget | API | SDK | POS Integration |
|----------|--------|-----|-----|-----------------|
| **Flexa** | ❌ | ✅ | ✅ | ✅ Existing POS |
| **NOWPayments** | ✅ | ✅ | ✅ | ✅ Plugin |
| **Coinbase Commerce** | ✅ | ✅ | ✅ | ✅ Shopify/WooCommerce |
| **BitPay** | ✅ | ✅ | ✅ | ✅ POS App |
| **CoinGate** | ✅ | ✅ | ✅ | ✅ Web POS |
| **YODL Pay** | ❌ | ⚠️ | ❌ | ❌ App Only |
| **Binance Pay** | ✅ | ✅ | ✅ | ⚠️ Limited |
| **Alchemy Pay** | ✅ | ✅ | ✅ | ✅ Custom |

### 2. Wallet Compatibility

- **Flexa:** Works with most major wallets (docs list 112 payment currencies across 19 network labels, including Lightning; docs.flexa.co/payments/currencies, 2026-10-17)
- **NOWPayments:** Compatible with all standard crypto wallets
- **Coinbase Commerce:** Optimized for Coinbase Wallet, supports all
- **BitPay:** BitPay Wallet optimized, supports all Bitcoin wallets
- **CoinGate:** Universal wallet support
- **YODL Pay:** MetaMask, Ledger, Coinbase Wallet, Trust Wallet
- **Binance Pay:** Binance App, Trust Wallet, other compatible
- **Alchemy Pay:** Universal wallet support

### 3. Guaranteed Settlement

| Provider | Chargeback Protection | Settlement Time | Settlement Currency |
|----------|----------------------|-----------------|---------------------|
| **Flexa** | ✅ 100% Guaranteed | Instant | Fiat (USD, EUR, etc.) |
| **NOWPayments** | ❌ | 10-60 min | Crypto or Fiat |
| **Coinbase Commerce** | ✅ Crypto finality | Varies | Crypto or Fiat |
| **BitPay** | ✅ Guaranteed | Daily (bitpay.com/pricing) | Fiat |
| **CoinGate** | ✅ | Same day | Crypto or Fiat |
| **YODL Pay** | ⚠️ | Instant | Local Fiat |
| **Binance Pay** | ✅ Crypto finality | Instant | Crypto |
| **Alchemy Pay** | ✅ | Variable | Fiat |

---

## 🟢 Recommendation Guide

### "I need..."

* **...to accept crypto at my retail store:**
    * 👉 **Flexa**. Integrates with existing POS systems, guaranteed settlement, no chargebacks.

* **...the lowest fees and widest crypto support:**
    * 👉 **NOWPayments**. from 1%, 300+ cryptocurrencies, non-custodial option.

* **...brand recognition and easy integration:**
    * 👉 **Coinbase Commerce**. Trusted brand, good documentation, Shopify/WooCommerce plugins. Warning: Coinbase says Commerce is being replaced by Coinbase Business (US and Singapore businesses only) and the portal becomes inaccessible after 2026-03-31; current state UNVERIFIED, see notes at the end.

* **...Bitcoin-focused payments:**
    * 👉 **BitPay**. Established Bitcoin payment processor, daily fiat settlement.

* **...EU compliance and local payment methods:**
    * 👉 **CoinGate**. Strong EU focus, 10+ accepted crypto assets, MiCA-authorised (Bank of Lithuania, per coingate.com).

* **...to accept crypto in emerging markets:**
    * 👉 **YODL Pay**. Local QR code scanning, merchants receive local currency, no bank account needed.

* **...zero fees for Binance ecosystem:**
    * 👉 **Binance Pay**. P2P transfers without gas fees, 100+ cryptos for merchant payments. Merchant fee UNVERIFIED.

* **...hybrid fiat and crypto payments:**
    * 👉 **Alchemy Pay**. Bridges fiat and crypto, ACH token rewards, global coverage.

---

## ⚠️ Implementation Checklist

1. **Choose Settlement Preference:** Decide if you want to settle in crypto, fiat, or both
2. **KYC/KYB Onboarding:** Complete merchant verification with chosen provider
3. **Integration Method:** Choose widget, API, SDK, or POS integration
4. **Testing:** Use testnet/sandbox mode before going live
5. **QR Code Display:** Ensure QR codes are properly sized and scannable
6. **Webhooks:** Set up webhooks for payment confirmations
7. **Fallback Options:** Provide alternative payment methods

---

## Scoring Methodology

The scoring system evaluates QR payment providers across multiple dimensions:

1. **Coverage & Accessibility (25 points):** Geographic availability and merchant onboarding ease
2. **Fee Structure (20 points):** Processing fees, spreads, and hidden costs
3. **Developer Experience (20 points):** SDK quality, documentation, integration ease
4. **Crypto Support (15 points):** Number of cryptocurrencies and blockchains supported
5. **Settlement (10 points):** Settlement speed, currency options, and guarantees
6. **Reliability (10 points):** Uptime, transaction success rates, brand trust

**Scoring Adjustments:**
- **+5 pts** Guaranteed settlement with no chargebacks
- **+3 pts** Excellent developer documentation and SDKs
- **-5 pts** Limited crypto support or regional restrictions
- **-3 pts** High or hidden fees

**Scoring Notes:**
- Scores are estimates based on available documentation and industry knowledge
- All providers scored using same methodology
- Scores should be considered approximate until verified with official provider documentation

---

## Integration Guides

### Flexa Integration
- **Website:** [flexa.co](https://flexa.co/)
- **Method:** SDK/API integration with existing POS systems
- **Documentation:** Comprehensive API docs
- **Support:** Enterprise support available
- **Key Feature:** Connects directly to existing payment infrastructure

### NOWPayments Integration
- **Website:** [nowpayments.io](https://nowpayments.io/)
- **Method:** Widget, API, or plugins (Shopify, WooCommerce, PrestaShop)
- **Documentation:** Excellent API documentation
- **Support:** Email support, developer resources
- **Key Feature:** Non-custodial option, 300+ cryptos

### Coinbase Commerce Integration
- **Website:** [commerce.coinbase.com](https://commerce.coinbase.com/)
- **Method:** Hosted checkout, embedded, or API
- **Documentation:** Good documentation
- **Support:** Coinbase support
- **Key Feature:** Brand trust, easy onboarding

### BitPay Integration
- **Website:** [bitpay.com](https://bitpay.com/)
- **Method:** API, plugins, or BitPay Checkout
- **Documentation:** Merchant API docs
- **Support:** Merchant support
- **Key Feature:** Bitcoin focus, fiat settlement

### CoinGate Integration
- **Website:** [coingate.com](https://coingate.com/)
- **Method:** Web POS app, API, or plugins
- **Documentation:** Good API documentation
- **Support:** Email support
- **Key Feature:** EU compliance, web POS for physical stores

### YODL Pay Integration
- **Website:** [yodl.me](https://yodl.me/)
- **Method:** Mobile app for merchants
- **Documentation:** Limited public docs
- **Support:** In-app support
- **Key Feature:** Scan local QR codes (like Pix), merchants receive local fiat

### Binance Pay Integration
- **Website:** [pay.binance.com](https://pay.binance.com/)
- **Method:** API, QR code checkout
- **Documentation:** Binance Pay API docs
- **Support:** Binance support
- **Key Feature:** Zero fees, Binance ecosystem

### Alchemy Pay Integration
- **Website:** [alchemypay.org](https://alchemypay.org/)
- **Method:** SDK, API, or white-label
- **Documentation:** Developer docs available
- **Support:** Enterprise support
- **Key Feature:** Fiat-crypto bridge, ACH token rewards

---

## Provider-Specific Notes

### Flexa
- **Website:** [flexa.co](https://flexa.co/)
- Leader in retail crypto payments
- 99+ digital assets (flexa.co, 2026-10-17); the docs list 112 payment currencies across 19 network labels (docs.flexa.co/payments/currencies, 2026-10-17)
- Guaranteed settlement - no chargebacks
- Works with existing POS systems (Square, Clover, etc.)
- The SPEDN consumer app shut down on 2026-03-31 (support.flexa.co); Flexa continues with Flexa Payments and the Flexa SDK for merchants. The earlier retailer examples (Home Depot, Whole Foods) ran through SPEDN and are no longer shown as current

### NOWPayments
- **Website:** [nowpayments.io](https://nowpayments.io/)
- 300+ cryptocurrencies supported
- 1% starting fee (nowpayments.io pricing page, 2026-10-15)
- Non-custodial option available
- No KYC required for basic usage
- Plugins for major e-commerce platforms

### Coinbase Commerce
- **Website:** [commerce.coinbase.com](https://commerce.coinbase.com/)
- Backed by Coinbase brand trust
- Full custody of payments
- Easy Shopify/WooCommerce integration
- Supports major cryptocurrencies
- Good for mainstream merchant adoption

### BitPay
- **Website:** [bitpay.com](https://bitpay.com/)
- Oldest and most established (since 2011)
- Bitcoin-focused with altcoin support
- Daily fiat settlement
- Strong compliance and fraud prevention
- Tiered pricing: 2% + 25¢ under $500k/month, down to 1% + 25¢ at $1M+

### CoinGate
- **Website:** [coingate.com](https://coingate.com/)
- Strong EU compliance focus
- 10+ crypto assets (home page)
- Web-based POS for physical stores
- 1% payment processing fee (coingate.com/pricing)
- Good for EU-based merchants

### YODL Pay
- **Website:** [yodl.me](https://yodl.me/)
- Designed for emerging markets
- Live in Argentina, Bolivia, Brazil, Colombia, Peru, the Philippines and Vietnam; India, Switzerland and Thailand "coming soon" (yodl.me, 2026-10-15)
- Scan local QR codes (Pix in Brazil, Mercado Pago, VietQR, QR Ph, Yape/Plin, etc.)
- Pay with USDT/crypto, merchant receives local fiat
- Works without bank accounts or ATMs
- "Spend crypto like cash" approach

### Binance Pay
- **Website:** [pay.binance.com](https://pay.binance.com/)
- No gas fees on peer-to-peer transfers; merchant fee UNVERIFIED
- 100+ cryptocurrencies for merchant payments, 400+ for P2P
- Binance ecosystem integration
- QR code and customized checkout
- FATF compliant with Proof of Reserves

### Alchemy Pay
- **Website:** [alchemypay.org](https://alchemypay.org/)
- Hybrid fiat-crypto gateway
- QR code scanning and wallet connections
- ACH token rewards for merchants and customers
- Settles in local currency
- Global coverage with local payment methods

---

## Use Cases

### Street Vendors & Small Merchants
- **Recommended:** YODL Pay
- No complex integration needed
- Works with local QR standards
- Instant local fiat settlement

### E-Commerce
- **Recommended:** NOWPayments or Coinbase Commerce
- Easy plugin integration
- Wide crypto support
- Good documentation

### Retail Stores
- **Recommended:** Flexa or BitPay
- POS integration
- Guaranteed settlement
- Chargeback protection

### Enterprise
- **Recommended:** Alchemy Pay or Flexa
- White-label options
- Custom pricing
- Enterprise support

---

## Related Resources

- [Crypto On/Off-Ramp Comparison](./RAMPS.md)
- [Crypto Credit Card Comparison](./CRYPTO_CARDS.md)
- [Software Wallet Comparison](./SOFTWARE_WALLETS.md)
- [Hardware Wallet Comparison](./HARDWARE_WALLETS.md)

---

**Last Updated:** October 17, 2026

**Verification Notes:**
- Re-checked 2026-10-15 from provider pages; UNVERIFIED items listed in QR_PAYMENTS.md and below
- Fee structures and coverage should be verified directly with providers before integration
- Values marked with "~" are approximate estimates
- Emerging providers (YODL Pay) may have limited documentation

### Notes from the 2026-10-15 check

- **Coinbase Commerce:** Coinbase's help centre (help.coinbase.com, "Transitioning from Coinbase Commerce to Coinbase Business", seen through a search result because the page returned 403 to fetches) says Commerce is being unified with Coinbase Business, the Commerce portal becomes inaccessible after 2026-03-31, and Coinbase Business is open to US or Singapore businesses only. commerce.coinbase.com returned 502. Treat as discontinued for most merchants, but the current state is UNVERIFIED. The table status is set to Verify.
- **Not re-checked (no primary figure found):** Flexa merchant fee (flexa.co and docs list none; flexa.co says payouts carry zero conversion or custody fees); Binance Pay merchant fee and regions (pay.binance.com and the merchant fee FAQ returned an empty page to headless Chromium on 2026-10-17; Binance's own post lists seven LATAM and Asia QR countries for tourist payments: Argentina, Bolivia, Brazil, Colombia, Peru, Philippines, Vietnam); Alchemy Pay QR fees and rewards; CoinGate settlement time.

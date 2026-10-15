# QR Payment Crypto Providers Comparison

## Complete QR Payment Comparison (All 8 Providers)

| Provider | Score | Type | QR Support | Merchant Fiat | Key Regions | Fee Model | Min Fee | Dev UX | Status | Best For |
|----------|-------|------|------------|---------------|-------------|-----------|---------|--------|--------|----------|
| [**Flexa**](https://flexa.co/) | 88 🟢 | In-Store | ✅ | ✅ | US ✅ CA ✅ EU ⚠️ APAC ❌ | Low (~0.5%, UNVERIFIED) | None | Excellent (SDK/API) | ✅ | Retail POS |
| [**NOWPayments**](https://nowpayments.io/) | 85 🟢 | Both | ✅ | ✅ | US ✅ CA ✅ EU ✅ UK ✅ TH ✅ LATAM ✅ | Low (from 1%) | None | Excellent (API) | ✅ | Multi-Crypto |
| [**Coinbase Commerce**](https://commerce.coinbase.com/) | 83 🟢 | Both | ✅ | ✅ | US ✅ CA ✅ EU ✅ UK ✅ TH ✅ APAC ✅ | Low (1%, UNVERIFIED) | None | Great (SDK) | ⚠️ | Brand Trust |
| [**BitPay**](https://bitpay.com/) | 82 🟢 | Both | ✅ | ✅ | US ✅ CA ✅ EU ✅ UK ✅ APAC ✅ | Medium (2% + 25¢, tiered) | 25¢ | Good (API) | ✅ | Bitcoin Focus |
| [**CoinGate**](https://coingate.com/) | 80 🟢 | Both | ✅ | ✅ | EU ✅ UK ✅ US ✅ CA ✅ APAC ⚠️ | Low (1%) | None | Good (API) | ✅ | EU Merchants |
| [**YODL Pay**](https://yodl.me/) | 78 🟡 | In-Store | ✅ | ✅ | BR ✅ AR ✅ BO ✅ CO ✅ PE ✅ PH ✅ VN ✅ TH 🔄 IN 🔄 | None (FX spread only) | None | Good (App) | ✅ | Emerging Markets |
| [**Binance Pay**](https://pay.binance.com/) | 77 🟡 | Both | ✅ | ⚠️ | EU ✅ UK ✅ APAC ✅ TH ✅ US ❌ CA ❌ | Zero (P2P); merchant fee UNVERIFIED | None | Good (API) | ✅ | Binance Users |
| [**Alchemy Pay**](https://alchemypay.org/) | 75 🟡 | Both | ✅ | ✅ | APAC ✅ TH ✅ EU ✅ US ✅ CA ✅ | Variable | Custom | Good (SDK) | ✅ | Hybrid Fiat+Crypto |

### Legend

**Scoring & Recommendation:**
| Symbol | Meaning |
|--------|---------|
| **Score** | 0-100 weighted score ([methodology](./QR_PAYMENTS_DETAILS.md#scoring-methodology)) |
| **Rec** | 🟢 Recommended (75+) | 🟡 Situational (50-74) | 🔴 Avoid (<50) |

**QR Payment Details:**
| Column | Values |
|--------|--------|
| **Type** | In-Store (physical POS), Both (in-store + online) |
| **QR Support** | ✅ Native QR code generation and scanning |
| **Merchant Fiat** | ✅ Merchants receive local fiat currency | ⚠️ Crypto only |
| **Status** | ✅ Active | ⚠️ Verify (e.g. Coinbase Commerce: Coinbase says the Commerce portal becomes inaccessible after 2026-03-31, see note below) | 🔄 Launching soon |
| **Key Regions** | ✅ Confirmed supported | ⚠️ Limited/partial | 🔄 Coming soon | ❌ Not available |
| **Fee Model** | Transaction fee percentage (Low/Medium/Variable) |
| **Dev UX** | Developer experience rating (Excellent/Great/Good) |

**Region Codes:**
| Code | Region |
|------|--------|
| US | United States |
| CA | Canada |
| EU | European Union |
| UK | United Kingdom |
| TH | Thailand |
| APAC | Asia-Pacific (AU, NZ, SG, JP, KR, HK) |
| LATAM | Latin America |
| BR | Brazil |
| ID | Indonesia |
| MY | Malaysia |
| IN | India |
| AR | Argentina |
| BO | Bolivia |
| CO | Colombia |
| PE | Peru |
| PH | Philippines |
| VN | Vietnam |

**Fee Structure Notes:**
- **Processing Fee:** Charged by the payment provider (from 1% for CoinGate, NOWPayments and BitPay's top tier; 2% + 25¢ for BitPay under $500k/month)
- **Network Fee:** Blockchain gas costs (varies by network)
- **Spread:** Price difference from market rate (some providers hide fees in spread)
- Most QR payment providers offer competitive fees to attract merchants

**QR Payment Flow:**
1. Customer scans QR code with crypto wallet
2. Wallet app opens with pre-filled payment details
3. Customer confirms and signs transaction
4. Merchant receives notification and settlement (often in local fiat)

**KYC & Compliance:**
- Most providers handle merchant KYC onboarding
- Transaction limits may vary by verification level
- Some providers (Flexa, BitPay) offer guaranteed settlement with no chargebacks

**Supported Cryptocurrencies:**
- **Flexa:** 99+ digital assets (flexa.co, 2026-10-15); network count UNVERIFIED
- **NOWPayments:** 300+ cryptocurrencies (home page also says 350+ coins)
- **Coinbase Commerce:** Major cryptos (BTC, ETH, USDC, etc.)
- **BitPay:** BTC, BCH, ETH, DOGE, LTC, XRP plus stablecoins and tokens (bitpay.com/pricing)
- **CoinGate:** 10+ crypto assets accepted per coingate.com home page (2026-10-15)
- **YODL Pay:** USDT and major stablecoins (expanding)
- **Binance Pay:** 100+ cryptocurrencies for merchant payments, 400+ for peer-to-peer (pay.binance.com, 2026-10-15)
- **Alchemy Pay:** Major cryptos with fiat hybrid support

---

> ⚠️ **Data Accuracy Note:** Re-checked 2026-10-15 against provider pages. Changes: BitPay fee is tiered 2% + 25¢ (not 1%); NOWPayments starts at 1% (not 0.5%); YODL Pay is live in AR, BO, BR, CO, PE, PH and VN, with TH and IN listed as coming soon and no page support for ID, MY, PromptPay, QRIS or UPI; Coinbase Commerce is being replaced by Coinbase Business (US and Singapore businesses only) with the Commerce portal inaccessible after 2026-03-31 (Coinbase help centre text seen through a search result; the page itself returned 403 and commerce.coinbase.com returned 502 to fetches, so current state is UNVERIFIED); Flexa's SPEDN consumer app shut down on 2026-03-31. **Scores are estimates and were not recomputed:** no script scores this table, so they still reflect the older inputs. Binance Pay regional columns, Alchemy Pay figures and Flexa's ~0.5% fee are UNVERIFIED (no primary figure found).

---

> 📖 **View full documentation:** [Detailed Reviews, Methodology, Integration Guides, and more →](./QR_PAYMENTS_DETAILS.md)

---

## Quick Summary

> **TL;DR:** Use **Flexa** (88) for retail in-store payments with guaranteed settlement, **NOWPayments** (85) for wide crypto support (300+ coins, from 1%), **Coinbase Commerce** (83, being replaced by Coinbase Business; UNVERIFIED current state) for brand trust and easy integration, **BitPay** (82) for Bitcoin-focused merchants, **CoinGate** (80) for EU compliance, **YODL Pay** (78) for emerging market street vendors, **Binance Pay** (77) for Binance ecosystem users, or **Alchemy Pay** (75) for hybrid fiat+crypto solutions.

**Last Updated:** October 15, 2026 | [Scoring Methodology](./QR_PAYMENTS_DETAILS.md#scoring-methodology) | [Integration Guides](./QR_PAYMENTS_DETAILS.md#integration-guides)

**Related:** See [Crypto On/Off-Ramp Comparison](./RAMPS.md), [Crypto Credit Card Comparison](./CRYPTO_CARDS.md), and [Software Wallet Comparison](./SOFTWARE_WALLETS.md) for related recommendations.

> 📖 **Want more details?** See the [full documentation with detailed provider reviews, scoring breakdowns, and integration guides](./QR_PAYMENTS_DETAILS.md).

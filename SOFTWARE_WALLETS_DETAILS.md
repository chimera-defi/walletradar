# Crypto Wallet Comparison for Developers - Full Documentation

> 📊 **View the comparison table:** [See all wallets at a glance →](./SOFTWARE_WALLETS.md)

> **Source of truth note:** Current `Score` and `Rec` values are generated from the visible columns in [SOFTWARE_WALLETS.md](./SOFTWARE_WALLETS.md) via `scripts/sync_table_scores.js` (`2026-04-visible-columns-v3`). If a long-form section below mentions older numeric scores, trust the main comparison table.

> **TL;DR:** The generated snapshot below mirrors the current main-table ordering and scores. Use it for the latest rankings; the long-form sections below explain audits, integration tradeoffs, and developer workflow details.

<!-- GENERATED_SOFTWARE_SNAPSHOT_START -->
> **Current generated snapshot:** Rabby (86, Development, 🟢), Trust (82, Multi-chain, 🟢), MetaMask (80, Compatibility, 🟢), and Safe (77, Treasury/DAO, ⚪). Regenerated from [SOFTWARE_WALLETS.md](./SOFTWARE_WALLETS.md) by `scripts/sync_table_scores.js` using methodology `2026-04-visible-columns-v3`.

### Current Top Rows (generated)
| Rank | Wallet | Score | Best For | Rec |
| ---- | ------ | ----- | -------- | --- |
| 1 | **Rabby** | 86 | Development | 🟢 |
| 2 | **Trust** | 82 | Multi-chain | 🟢 |
| 3 | **MetaMask** | 80 | Compatibility | 🟢 |
| 4 | **Safe** | 77 | Treasury/DAO | ⚪ |
| 5 | **Brave** | 75 | Brave users | 🟢 |
<!-- GENERATED_SOFTWARE_SNAPSHOT_END -->

**Data Sources:** GitHub REST API (stars, issues, last commit: re-fetched Oct 17, 2026), [WalletBeat](https://walletbeat.fyi) (Dec 2025)

**Related:** See [Hardware Wallet Comparison](./HARDWARE_WALLETS.md) for cold storage recommendations.

---

## Table of Contents

- [Complete Wallet Comparison](./SOFTWARE_WALLETS.md#complete-wallet-comparison) (Table View)
- [Quick Recommendations](#-quick-recommendations)
- [GitHub Metrics](#github-metrics-stars-issues-code-quality)
- [Scoring Methodology](#-wallet-scores-developer-focused-methodology)
- [Security Audits](#-security-audits-from-walletbeat--github)
- [Known Quirks & Gotchas](#-known-quirks--gotchas)
- [Account Type Support](#account-type-support-from-walletbeat)
- [Hardware Wallet Support](#hardware-wallet-support-from-walletbeat)
- [ENS & Address Resolution](#ens--address-resolution-from-walletbeat)
- [Browser Integration](#browser-integration-from-walletbeat)
- [EIP Support Matrix](#-eip-support-matrix)
- [EIP-7702 Wallet Support](#-eip-7702-wallet-support-pectra-upgrade)
- [Gas Estimation & Transaction Preview](#-gas-estimation--transaction-preview)
- [Mobile Deep-linking & Integration](#-mobile-deep-linking--integration)
- [Developer Experience Benchmarks](#-developer-experience-benchmarks)
- [Monetization & Business Model](#-monetization--business-model)
- [Security Features](#-security-features-tx-simulation--scam-protection)
- [Privacy & Data Collection](#-privacy--data-collection)
- [Data Sources & Verification](#data-sources--verification)
- [Changelog](#-changelog)
- [Contributing](#-contributing-add-a-new-wallet)

---
## 🎯 Quick Recommendations

Scores below are the generated scores from [SOFTWARE_WALLETS.md](./SOFTWARE_WALLETS.md). Best for development: **Rabby** (86). Most stable: **Brave** (~2 releases/month). Compatibility testing: **MetaMask** (80, ~5 releases/month, test last). See the [full comparison table](./SOFTWARE_WALLETS.md#complete-wallet-comparison).

**Jump to:** [Comparison Table](./SOFTWARE_WALLETS.md#complete-wallet-comparison) | [Scoring Methodology](#-wallet-scores-developer-focused-methodology) | [Features Matrix](#wallet-features-matrix) | [EIP Support](#-eip-support-matrix) | [Developer Experience](#-developer-experience-benchmarks)

### ✅ Top Picks (mobile + browser extension)

| Wallet | Score | Rel/Mo | Rec | Best For |
|--------|-------|--------|-----|----------|
| **Rabby** | 86 | ~4 | 🟢 | Development: tx simulation catches bugs before mainnet |
| **MetaMask** | 80 | ~5 | 🟢 | Compatibility testing: widest support, highest churn |
| **Brave** | 75 | ~2 | 🟢 | Stability: built into the browser |
| **Trust** | 82 | ~3 | 🟢 | Multi-chain production use |
| **Coinbase** | 67 | ~2 | 🔴 | Account abstraction (EIP-4337) |
| **Rainbow** | 64 | ~4 | ⚪ | NFT and Ethereum use |

### Good wallets that miss the core criteria

- **Safe** (77): treasury and DAO multisig. No browser extension.
- **Ambire** (71): smart wallet, EIP-7702 + 4337. No mobile app.
- **Ledger Live** (66): for hardware wallet users.
- **Enkrypt** (53): multi-chain testing, extension only.

### Avoid (inactive or abandoned)

- **Block**: abandoned; source-available, non-commercial licence.
- **Frame**: inactive since Feb 2025.
- **Argent** (now Ready): inactive repo, Starknet-only desktop.
- **imToken**: inactive (last commit May 20, 2026).

### MetaMask: why it sits below Rabby

- ~5 releases/month (15 GitHub releases in the last 90 days): the highest churn in the table.
- Frequent breaking changes need constant retesting.
- Positive: audited in Apr 2025 (Diligence, Cure53, Cyfrin).

---

### GitHub Metrics (Stars, Issues, Code Quality)

| Wallet | Last Commit | Stars | Issues | Ratio | Stability |
|--------|-------------|-------|--------|-------|-----------|
| **Rabby** | Oct 15, 2026 | 1,914 | 140 | 7.3% | ⭐⭐⭐ |
| **Trust** | Oct 14, 2026 | 3,573 | 193 | 5.4% | ⭐⭐⭐ |
| **Rainbow** | Oct 16, 2026 | 4,397 | 43 | 1.0% | ⭐⭐⭐ |
| **Brave** | Oct 16, 2026 | 23,907 | 11,083 | 46.4% | ⭐⭐⭐⭐ |
| **Coinbase** | Oct 16, 2026 | 1,766 | 92 | 5.2% | ⭐⭐⭐⭐ |
| **MetaMask** | Oct 16, 2026 | 13,236 | 2,874 | 21.7% | ⭐⭐⭐ |
| **Phantom** | Private | - | - | - | ⭐⭐⭐ |
| **OKX** | Private | - | - | - | ⭐⭐⭐⭐ |
| **Safe** | Oct 16, 2026 | 595 | 101 | 17.0% | ⭐⭐⭐⭐ |
| **Enkrypt** | Sep 1, 2026 | 436 | 19 | 4.4% | ⭐⭐⭐⭐ |
| **Ambire** | Oct 16, 2026 | 72 | 6 | 8.3% | ⭐⭐⭐⭐ |
| **Wigwam** | Sep 20, 2026 | 86 | 0 | 0.0% | ⭐⭐⭐⭐ |
| **Ledger Live** (now Ledger Wallet) | Oct 16, 2026 | 622 | 126 | 20.3% | ⭐⭐⭐⭐ |
| **MEW** | Oct 16, 2026 | 1,587 | 57 | 3.6% | ⭐⭐⭐⭐ |
| **Sequence** | Oct 14, 2026 | 318 | 33 | 10.4% | ⭐⭐⭐⭐ |
| **Daimo** | Feb 18, 2026 | 408 | 227 | 55.6% | ⭐⭐⭐ |
| **Zerion** | Private | - | - | - | ⭐⭐⭐ |
| **Uniswap** | Oct 16, 2026 | 5,536 | 830 | 15.0% | ⭐⭐⭐ |
| **Taho** | Aug 20, 2026 | 3,207 | 336 | 10.5% | ⭐⭐⭐⭐ |
| **imToken** | May 20, 2026 | 34 | 24 | 70.6% | ⭐⭐⭐ |
| **1inch** | Private | - | - | - | ⭐⭐⭐ |
| **Frame** | Feb 1, 2025 | 1,210 | 99 | 8.2% | ⭐⭐⭐⭐ |
| **Argent** | Mar 14, 2025 | 639 | 95 | 14.9% | ⭐⭐⭐⭐ |
| **Block** | Nov 27, 2024 | 93 | 45 | 48.4% | ⭐⭐⭐⭐ |
| **Kohaku**∆ | Jul 3, 2026 | 98 | 11 | 11.2% | ⭐⭐⭐⭐ |

**GitHub Legend:**
- **Ratio:** Issues ÷ Stars (lower = better code quality). Rainbow 1.0% is excellent, MetaMask 21.6% indicates maintenance burden.
- **Stability:** ⭐⭐ = High churn (>6 rel/mo) | ⭐⭐⭐ = Medium | ⭐⭐⭐⭐ = Stable (<3 rel/mo)
- **Private:** Closed-source repos have no public metrics

**Data Sources:** GitHub REST API (re-fetched Oct 17, 2026), [WalletBeat](https://walletbeat.fyi) (Dec 2025)

---

## 📊 Wallet Scores (Developer-Focused Methodology)

**Goal:** find stable MetaMask alternatives with both mobile and browser extension for developer use.

Scores are generated from the visible table columns by `frontend/src/lib/scoring.js` (methodology `2026-04-visible-columns-v3`). Run `bun scripts/sync_table_scores.js --write` to regenerate. Per-wallet scores live in the [SOFTWARE_WALLETS.md](./SOFTWARE_WALLETS.md) table; the formula is in [CONTRIBUTING.md](./CONTRIBUTING.md). The 2025 per-category breakdown that used to sit here was removed because it no longer matched the generated scores.

**Score interpretation (auto-generated bands):**
- 🟢 **Recommended:** top half of active, developer-fit rows
- 🟡 **Situational:** middle quartile of active, developer-fit rows
- 🔴 **Avoid:** bottom quartile or inactive
- ⚪ **Not for dev:** fails core developer-fit requirements (for example, no mobile + extension)

**Key insight:** MetaMask scores 80 despite being the industry standard because of ~5 releases/month (high churn). Rabby (86) leads on tx simulation and stability.

---

### ⚠️ Previously Recommended, Now Inactive
| Wallet | Status | Alternative |
|--------|--------|-------------|
| Block Wallet | ❌ No commits since Nov 2024 | Rainbow, Enkrypt |
| Frame | ❌ No commits since Feb 2025 | Rabby |
| Argent-X | ❌ No commits since Mar 2025 | Safe |
| Coinbase SDK | ⚠️ Slow (Jul 2025) | Trust Wallet |

---

## 🧭 Which Wallet Should I Use?

```
START HERE
    │
    ▼
┌─────────────────────────────────┐
│ Building a dApp / Development?  │
└─────────────────────────────────┘
    │ YES                    │ NO
    ▼                        ▼
  RABBY ────────────► Need multi-sig / enterprise?
  (tx simulation)           │
                     YES ◄──┴──► NO
                      │           │
                      ▼           ▼
                    SAFE    Need Account Abstraction?
                 (multi-sig)      │
                           YES ◄──┴──► NO
                            │           │
                            ▼           ▼
                      ┌─────────┐   Need 100+ chains?
                      │ AMBIRE  │       │
                      │ (7702)  │ YES ◄─┴──► NO
                      │   or    │  │          │
                      │  SAFE   │  ▼          ▼
                      │ (4337)  │ TRUST    Simple & 
                      └─────────┘ WALLET   reliable?
                                           │
                                    YES ◄──┴──► NO
                                     │          │
                                     ▼          ▼
                                  RAINBOW    Privacy
                                  (simple)   focused?
                                              │
                                       YES ◄──┴──► NO
                                        │          │
                                        ▼          ▼
                                      TAHO     ENKRYPT
                                   (community) (multi-chain)
```

### Quick Decision Guide

| Your Need | Best Choice | Why |
|-----------|-------------|-----|
| **dApp Development** | Rabby | Transaction simulation catches bugs before mainnet |
| **Enterprise / Treasury** | Safe | Multi-sig, audited, battle-tested |
| **EIP-7702 / Cutting Edge** | MetaMask, Ambire, Trust, OKX | [4 wallets support 7702](https://github.com/fireblocks-labs/awesome-eip-7702#wallets-support-updates) |
| **Simple & Reliable** | Rainbow | Excellent code quality (1.0% issue ratio) |
| **Maximum Chains** | Trust Wallet | 163 chains supported |
| **Privacy Focused** | Taho | Community-owned, open source |
| **Stablecoin Payments** | Daimo | Pure EIP-4337, low fees on Base |
| **Just Works™** | Enkrypt | Low issue ratio, actively maintained |
| **Compatibility Testing** | MetaMask | Most widely supported (test last) |

---

## 🔒 Security Audits (from WalletBeat + GitHub)

| Wallet | Last Audit | Auditor(s) | Unpatched Flaws | Audit Reports |
|--------|------------|------------|-----------------|---------------|
| **Rabby** | Oct 2026 | Least Authority (Oct 9, 2026), SlowMist (Aug 24, 2026) | 1 Medium unresolved, 1 partially resolved (Least Authority Oct 2026); earlier reports fixed | [Extension](https://github.com/RabbyHub/Rabby/tree/develop/audits) |
| **Rabby Mobile** | Oct 2026 | Least Authority (Oct 9, 2026), SlowMist (Aug 24, 2026), Cure53 (2024) | ⚠️ 4 Medium unresolved, 1 partially resolved, no High (Least Authority Oct 2026) | [Mobile](https://github.com/RabbyHub/rabby-mobile/tree/develop/audits) |
| **Safe** | May 2025 | Ackee, Certora | None found | [Safe Audits](https://github.com/safe-fndn/safe-smart-account/tree/main/docs) |
| **MetaMask** | Oct 2026 (Cyfrin); Apr 2025 (Diligence) | Diligence, Cyfrin (Cure53 not re-found) | All fixed | [Delegator](https://assets.ctfassets.net/clixtyxoaeas/21m4LE3WLYbgWjc33aDcp2/8252073e115688b1dc1500a9c2d33fe4/metamask-delegator-framework-audit-2024-10.pdf) |
| **Trust Wallet** | Sep 2023 | External (Binance) | All fixed | [Audit](https://github.com/trustwallet/wallet-core/tree/master/audit) |
| **Ambire** | 2023-2025 | Hunter Security (4), Pashov (3), Shieldify, Code4rena, CuriousApple, Facu | None found | [11+ Audits](https://github.com/AmbireTech/ambire-common/tree/main/audits) |
| **Daimo** | Oct 2023 | Veridise | All fixed | [Audit](https://github.com/daimo-eth/daimo/tree/master/audits) |
| **imToken** | May 2018 | Cure53 | All fixed | [Report](https://cure53.de/pentest-report_imtoken.pdf) |
| **Brave** | Ongoing | HackerOne | Bug bounty | [HackerOne](https://hackerone.com/brave) |
| **Rainbow** | None | - | - | No public audit |
| **MEW** | None | - | - | No public audit |
| **Enkrypt** | None | - | - | No public audit |
| **Taho** | None | - | - | No public audit |
| **Coinbase** | Private (app); smart-wallet contracts audited 2023-2024 | Cantina, Certora, Code4rena | Not re-checked | App: not public. Contracts: [coinbase/smart-wallet audits](https://github.com/coinbase/smart-wallet/tree/main/audits) |
| **Gem Wallet** | Apr 2026 | CertiK | Not re-checked | [Report](https://static.gemwallet.com/audits/Gem-Wallet-CertiK-Security-Audit-April-2026.pdf) |
| **Phantom** | Private | - | - | Proprietary |
| **Zerion** | Private | - | - | Proprietary |
| **OKX** | Private | - | - | Proprietary |

**Audit Quality Notes:**
- ✅ **Rabby Extension**: audits every year 2021-2026 in the repo `audits/` folder; the Oct 2026 Least Authority report lists one Medium unresolved and one partially resolved
- ⚠️ **Rabby Mobile**: the Oct 2026 Least Authority report lists 11 issues (no High); 4 Medium are unresolved (batch review, bridge deposit intent check, mnemonic screenshot protection, failed-password throttling). The 2024 Cure53 High finding was not re-checked.
- ✅ **Safe**: Formally verified by Certora, excellent audit history
- ✅ **MetaMask**: Delegation framework audited by Diligence and Cyfrin (reports in `MetaMask/delegation-framework/audits`, latest Cyfrin 10-26). No separate public report found for the extension itself.
- ✅ **Trust Wallet**: Core library audited Sep 2023
- 🐛 **Brave**: Active HackerOne bug bounty program
- ⚠️ **imToken**: Last audit was 2018 - very old
- ❓ **Rainbow, MEW, Enkrypt, Taho**: Open source but no public security audits found

---

## ⚡ Known Quirks & Gotchas

Every wallet has quirks that can cause developer headaches. Know them before you integrate:

| Wallet | Quirk | Impact | Workaround |
|--------|-------|--------|------------|
| **MetaMask** | ~5 releases/month (GitHub releases, last 90 days: 15), frequent breaking changes | High maintenance burden | Pin versions, test after updates |
| **MetaMask** | 21.6% issue/star ratio (highest) | Many open bugs | Check GitHub issues before debugging |
| **Rabby** | ENS only works for importing addresses, not sending | Can't send to .eth directly | Use resolved address |
| **Rabby** | Mobile app has unpatched security issues | Security risk on mobile | Use browser extension instead |
| **Safe** | No browser extension, web app only | Extra click for users | Use WalletConnect |
| **Safe** | Transactions require gas from signers | UX friction | Use paymaster/relayer |
| **Rainbow** | Limited custom RPC support | Can't use private RPC easily | Use default RPCs |
| **Coinbase** | SDK development slowed (Jul 2025) | May have stale bugs | Consider alternatives |
| **Phantom** | No testnet support | Can't test with Phantom | Use different wallet for testing |
| **Phantom** | Solana-first, EVM secondary | EVM features may lag | Verify EVM support |
| **Daimo** | Base chain only | Limited chain support | Only for Base L2 apps |
| **Daimo** | No hardware wallet support | Less secure for large amounts | Use for small payments only |
| **imToken** | Mobile only, no browser extension | Desktop users need WalletConnect | Provide mobile-first UX |
| **Ambire** | Browser extension only (no mobile yet) | Mobile users excluded | Wait for mobile release |
| **Trust Wallet** | Core is Apache-2.0 but app is partial | Can't fully audit app | Trust Binance's implementation |
| **Brave** | Built into Brave browser only | Non-Brave users excluded | Detect and suggest alternatives |
| **Enkrypt** | Browser extension only | No mobile support | Suggest mobile alternatives |

### Common Integration Pitfalls

1. **Don't assume MetaMask behavior is standard** — Other wallets may handle edge cases differently
2. **Test transaction simulation** — Only Rabby and Frame have this; don't rely on it everywhere
3. **EIP-6963 adoption is incomplete** — Always fall back to `window.ethereum`
4. **Mobile ≠ Desktop** — Same wallet can behave differently across platforms
5. **Hardware wallet connection varies** — WebUSB vs Bluetooth vs QR vs WalletConnect
6. **Desktop-Mobile Sync** — Most wallets don't automatically sync between desktop and mobile. Users can import the same seed phrase on both platforms to access the same accounts, but transactions and state don't sync in real-time.

### Integration Best Practices

1. **Use EIP-6963** for wallet detection (modern standard, but always fall back to `window.ethereum`)
2. **Use EIP-712 for message signing** — Enables human-readable display (foundational for clear signing)
3. **Consider EIP-7730 for enhanced clear signing** — Provides formatting metadata for better display (especially important for hardware wallets like Ledger)
4. **Support multiple wallets** — Don't lock users into one wallet
5. **Test with multiple wallets** — Each has quirks and edge cases
6. **Handle errors gracefully** — Wallet errors vary significantly between implementations
7. **Provide clear error messages** — Help users debug connection issues
8. **Test on both desktop and mobile** — User experiences differ across platforms
9. **Monitor wallet updates** — Breaking changes happen, especially with high-release-frequency wallets
10. **Use TypeScript** — Catch integration issues early with type checking
11. **Document wallet-specific quirks** — Save time for future maintenance
12. **Consider wallet abstraction libraries** — wagmi, ethers.js, viem reduce dependency on specific wallets

### Stability Maintenance

1. **Pin wallet versions** in development (if possible)
2. **Monitor release notes** for breaking changes
3. **Test after wallet updates** before deploying to production
4. **Have fallback wallets** — Don't depend on a single wallet
5. **Track wallet issues** — Monitor GitHub, Discord, and community forums
6. **Consider wallet abstraction** — Reduces dependency on specific wallet implementations

---

## Column Definitions

Complete explanations for all table columns:

| Column | Values | Meaning |
|--------|--------|---------|
| **Score** | 0-100 | Weighted score prioritizing core criteria, stability, and developer experience. See [Scoring Methodology](#-wallet-scores-developer-focused-methodology) |
| **Core** | ✅ / ⚠️ / ❌ | ✅ = Has BOTH mobile + browser extension (core criteria) | ⚠️ = Partial (e.g., Starknet-only desktop) | ❌ = Missing one or both |
| **Rel/Mo** | Number or ? | Releases per month (lower = more stable; MetaMask ~8/mo is high churn) | ? = Unknown (private repo) |
| **RPC** | ✅ / ⚠️ / ❌ | ✅ = Custom RPC support | ⚠️ = Limited | ❌ = No custom RPC |
| **Chains** | Number, 10+, Any, EVM, ETH+ | Built-in chain count. Exact numbers (94, 163) = verified count. 10+, 20+ = at least X. Any = unrestricted custom RPC. EVM = any EVM chain. ETH+ = Ethereum + L2s. Sources: [Rabby API](https://api.rabby.io/v1/chain/list), [Trust registry](https://github.com/trustwallet/wallet-core/blob/master/registry.json) |
| **Devices** | 📱🌐💻🔗⚡ | 📱 = Mobile app | 🌐 = Browser Extension | 💻 = Desktop app | 🔗 = Web App | ⚡ = Browser Proxy (desktop app injects into browser via localhost, like Frame). See [Desktop App Wallets section](#-desktop-app-wallets-frame-like-architecture) for details |
| **Testnets** | ✅ / ❌ | ✅ = Custom chain/testnet support | ❌ = No testnet support |
| **License** | ✅ / ⚠️ / ❌ | ✅ = FOSS (MIT, GPL, MPL, Apache) | ⚠️ = Source-Available/Partial | ❌ = Proprietary |
| **Audits** | ✅ / ⚠️ / ❓ / 🐛 | ✅ = Recent (2023+) | ⚠️ = Old/Issues | ❓ = None/Private | 🐛 = HackerOne bug bounty |
| **Funding** | 🟢 / 🟡 / 🔴 | 🟢 = Sustainable | 🟡 = VC-dependent | 🔴 = Risky/Unknown |
| **Tx Sim** | ✅ / ⚠️ / ❌ | ✅ = Built-in transaction simulation | ⚠️ = Plugin/limited | ❌ = None |
| **Scam** | ✅ / ⚠️ / ❌ | ✅ = Built-in scam/phishing alerts | ⚠️ = Basic protection | ❌ = None |
| **Account** | EOA, Safe, 4337, 7702, combinations | EOA = Standard Externally Owned Account | Safe = Multi-sig | 4337 = Smart Account (EIP-4337) | 7702 = Upgraded EOA (EIP-7702) |
| **ENS/Naming** | ✅ Full / ✅ Basic / ⚠️ / ❌ | ✅ Full = Mainnet ENS + subdomains | ✅ Basic = Mainnet ENS only | ⚠️ Import only = Can import but not send to .eth | ✅ Full+cb.id = Full ENS + custom domains | ❌ = No ENS support |
| **HW** | ✅ / ⚠️ / ❌ | ✅ = Hardware wallet support (Ledger/Trezor) | ⚠️ = Limited support | ❌ = No hardware wallet support |
| **Active** | ✅ / ⚠️ / ❌ / 🔒 | ✅ = Active (≤30 days since last commit) | ⚠️ = Slow (1-4 months) | ❌ = Inactive (4+ months) | 🔒 = Private repo |
| **Rec** | 🟢 / 🟡 / 🔴 / ⚪ | 🟢 = Top half of active developer-fit rows | 🟡 = Middle quartile | 🔴 = Bottom quartile or inactive | ⚪ = Not for developers |

**Special Notes:**
- † Safe is web app only — requires WalletConnect
- § Brave Wallet is built into Brave browser
- ‡ Ledger Live is hardware wallet companion
- ⁂ Argent desktop extension is Starknet-only
- ~~Strikethrough~~ = was recommended, now inactive

**Tracked EIPs:** EIP-712 (Typed Data), EIP-2612 (Permit), EIP-4337 (Account Abstraction), EIP-5792 (Wallet Call API), EIP-7702 (Set EOA Code) — see [EIP Support Matrix](#-eip-support-matrix)

---

## Wallet Features Matrix

Feature comparison across account types, hardware wallet support, ENS, and browser integration.

### Account Type Support

| Wallet | Default | EOA | Safe | EIP-4337 | EIP-7702 | MPC | Notes |
|--------|---------|-----|------|----------|----------|-----|-------|
| **MetaMask** | EOA | ✅ | ❌ | ❌ | ✅ | ❌ | First major wallet with EIP-7702 |
| **Rabby** | EOA | ✅ | ✅ | ❌ | ❌ | ❌ | Can connect to existing Safes |
| **Trust** | EOA | ✅ | ❌ | ❌ | ✅ | ❌ | [7702 support added](https://beincrypto.com/trust-wallet-ethereum-eip7702-support/) |
| **Safe** | Safe | ❌ | ✅ | ✅ | ❌ | ❌ | Native multi-sig wallet |
| **Coinbase** | EOA | ✅ | ❌ | ✅ | ❌ | ❌ | Smart wallet option |
| **Rainbow** | EOA | ✅ | ❌ | ❌ | ❌ | ❌ | Standard EOA |
| **Ambire** | 7702 | ✅ | ❌ | ✅ | ✅ | ❌ | [Hybrid AA + EIP-7702](https://blog.ambire.com/eip-7702-wallet/) |
| **OKX** | EOA | ✅ | ❌ | ❌ | ✅ | ❌ | [7702 support](https://web3.okx.com/help/okx-wallet-to-support-eip-7702) |
| **Sequence** | 4337 | ❌ | ❌ | ✅ | ❌ | ❌ | Native smart wallet |
| **Daimo** | 4337 | ❌ | ❌ | ✅ | ❌ | ❌ | Payments-focused |
| **Phantom** | EOA | ✅ | ❌ | ❌ | ❌ | ❌ | Solana-first |
| **Enkrypt** | EOA | ✅ | ❌ | ❌ | ❌ | ❌ | Standard EOA |
| **MEW** | EOA | ✅ | ❌ | ❌ | ❌ | ❌ | Classic Ethereum |
| **Brave** | EOA | ✅ | ❌ | ❌ | ❌ | ❌ | Standard EOA |
| **Ledger Live** | EOA | ✅ | ❌ | ❌ | ❌ | ❌ | Hardware companion |
| **Uniswap** | EOA | ✅ | ❌ | ❌ | ❌ | ❌ | DeFi-focused |
| **Taho** | EOA | ✅ | ❌ | ❌ | ❌ | ❌ | Community wallet |
| **Zerion** | EOA | ✅ | ❌ | ❌ | ❌ | ❌ | Portfolio tracker |
| **Wigwam** | EOA | ✅ | ❌ | ❌ | ❌ | ❌ | EVM-focused |
| **Argent** | 4337 | ❌ | ❌ | ✅ | ❌ | ❌ | Starknet-focused |
| **Frame** | EOA | ✅ | ❌ | ❌ | ❌ | ❌ | Desktop-only |
| **1inch** | EOA | ✅ | ❌ | ❌ | ❌ | ❌ | Mobile-only |
| **imToken** | EOA | ✅ | ❌ | ❌ | ❌ | ❌ | Standard EOA |
| **Block** | EOA | ✅ | ❌ | ❌ | ❌ | ❌ | Standard EOA |

**Account Types:** EOA = Standard Externally Owned Account | Safe = Multi-sig | 4337 = Smart Account (EIP-4337) | 7702 = Upgraded EOA (EIP-7702) | MPC = Multi-Party Computation

#### Hardware Wallet Support

See [Hardware Wallet Comparison](./HARDWARE_WALLETS.md) for detailed hardware wallet analysis and recommendations.

| Wallet | Ledger | Trezor | Keystone | GridPlus | Other | Notes |
|--------|--------|--------|----------|----------|-------|-------|
| **MetaMask** | ✅ WebUSB | ✅ WebUSB | ✅ QR | ✅ WebUSB | KeepKey, OneKey | Best HW wallet integration |
| **Rabby** | ✅ WebUSB | ✅ WebUSB | ✅ QR | ✅ WebUSB | ✅ Others | Good HW wallet support |
| **Trust** | ✅ WebUSB | ✅ WebUSB | ✅ QR | ✅ WebUSB | ✅ Others | Wide HW wallet support |
| **Rainbow** | ✅ WebUSB+BT | ✅ WebUSB | - | - | - | Good HW wallet support |
| **Coinbase** | ✅ | ✅ | - | - | - | Full HW wallet support |
| **Safe** | ✅ WebUSB | ✅ WebUSB | ✅ WalletConnect | ✅ WalletConnect | - | Multi-sig + HW wallets |
| **Enkrypt** | ✅ WebUSB | ✅ WebUSB | ✅ QR | ✅ WebUSB | ✅ Others | Excellent HW wallet support |
| **Ambire** | ✅ WebUSB | ✅ WebUSB | ❌ | ✅ WebUSB | - | Good HW wallet support |
| **Brave** | ✅ WebUSB | ✅ WebUSB | ✅ QR | ✅ WebUSB | ✅ Others | Built-in HW wallet support |
| **Ledger Live** | ✅ | ❌ | ❌ | ❌ | ❌ | Ledger-only (companion app) |
| **MEW** | ✅ WebUSB | ✅ WebUSB | ✅ QR | ✅ WebUSB | ✅ Others | Classic HW wallet support |
| **Phantom** | ✅ WebUSB | ❌ | ❌ | ❌ | - | Solana-first, EVM secondary |
| **OKX** | ✅ WebUSB | ✅ WebUSB | ✅ QR | ✅ WebUSB | ✅ Others | Good HW wallet support |
| **Sequence** | ❌ | ❌ | ❌ | ❌ | ❌ | Web SDK only, no HW wallets |
| **Daimo** | ❌ | ❌ | ❌ | ❌ | ❌ | Mobile-only, no HW wallets |
| **Uniswap** | ❌ | ❌ | ❌ | ❌ | ❌ | DeFi-focused, no HW wallets |
| **Taho** | ✅ WebUSB | ✅ WebUSB | ✅ QR | ✅ WebUSB | ✅ Others | Good HW wallet support |
| **Zerion** | ✅ WebUSB | ✅ WC only | ✅ WC only | ✅ WC only | - | Portfolio + HW wallets |
| **Wigwam** | ✅ WebUSB | ✅ WebUSB | ✅ QR | ✅ WebUSB | ✅ Others | Good HW wallet support |
| **Argent** | ✅ WebUSB | ✅ WebUSB | ✅ WalletConnect | ✅ WalletConnect | - | HW wallet support |
| **Frame** | ✅ WebUSB | ✅ WebUSB | ✅ QR | ✅ WebUSB | ✅ Others | Desktop HW wallet support |
| **1inch** | ❌ | ❌ | ❌ | ❌ | ❌ | Mobile-only, no HW wallets |
| **imToken** | ❌ | ❌ | ✅ QR | ❌ | imKey (BT) | Mobile-only, limited HW support |
| **Block** | ✅ WebUSB | ✅ WebUSB | ✅ QR | ✅ WebUSB | ✅ Others | Good HW wallet support |

**Connection Types:** WebUSB, Bluetooth (BT), QR code, WalletConnect (WC). See [Hardware Wallet Comparison](./HARDWARE_WALLETS.md) for hardware wallet recommendations.

### ENS & Address Resolution

| Wallet | Mainnet ENS | Subdomains | Offchain | L2 ENS | Custom Domains | Notes |
|--------|-------------|------------|----------|--------|----------------|-------|
| **MetaMask** | ✅ | ✅ | ✅ | ❌ | ❌ | Full ENS support |
| **Coinbase** | ✅ | ✅ | ✅ | ❌ | ✅ (cb.id) | Full ENS + cb.id domains |
| **Rainbow** | ✅ | ✅ | ❌ | ❌ | ❌ | Full ENS support |
| **Safe** | ✅ | ✅ | ❌ | ❌ | ❌ | Full ENS support |
| **MEW** | ✅ | ✅ | ❌ | ❌ | ❌ | Full ENS support |
| **Trust** | ✅ | ❌ | ❌ | ❌ | ❌ | Basic ENS (mainnet only) |
| **Rabby** | ⚠️ Import only | ❌ | ❌ | ❌ | ❌ | Import only (can't send to .eth) |
| **Enkrypt** | ✅ | ❌ | ❌ | ❌ | ❌ | Basic ENS (mainnet only) |
| **Ambire** | ✅ | ❌ | ❌ | ❌ | ❌ | Basic ENS (mainnet only) |
| **Daimo** | ✅ | ❌ | ❌ | ❌ | ❌ | Basic ENS (mainnet only) |
| **Zerion** | ✅ | ❌ | ❌ | ❌ | ❌ | Basic ENS (mainnet only) |
| **imToken** | ✅ | ❌ | ❌ | ❌ | ❌ | Basic ENS (mainnet only) |
| **Phantom** | ❌ | ❌ | ❌ | ❌ | ❌ | No ENS support |
| **OKX** | ❌ | ❌ | ❌ | ❌ | ❌ | No ENS support |
| **Sequence** | ❌ | ❌ | ❌ | ❌ | ❌ | No ENS support |
| **Uniswap** | ❌ | ❌ | ❌ | ❌ | ❌ | No ENS support |
| **Taho** | ❌ | ❌ | ❌ | ❌ | ❌ | No ENS support |
| **Wigwam** | ❌ | ❌ | ❌ | ❌ | ❌ | No ENS support |
| **Argent** | ❌ | ❌ | ❌ | ❌ | ❌ | No ENS support |
| **Frame** | ❌ | ❌ | ❌ | ❌ | ❌ | No ENS support |
| **Brave** | ❌ | ❌ | ❌ | ❌ | ❌ | No ENS support |
| **Ledger Live** | ❌ | ❌ | ❌ | ❌ | ❌ | No ENS support |
| **1inch** | ❌ | ❌ | ❌ | ❌ | ❌ | No ENS support |
| **Block** | ❌ | ❌ | ❌ | ❌ | ❌ | No ENS support |

**ENS Support Levels:** ✅ Full = Mainnet + subdomains + offchain + L2s | ✅ Basic = Mainnet ENS only | ⚠️ Import only = Can import but not send to .eth | ❌ = No ENS support

### Browser Integration

| Wallet | EIP-1193 | EIP-2700 | EIP-6963 | WC v2 | In-App Browser | Notes |
|--------|----------|----------|----------|-------|----------------|-------|
| **MetaMask** | ✅ | ✅ | ✅ | ✅ | ✅ (mobile) | Standard wallet injection |
| **Rabby** | ✅ | ✅ | ✅ | ✅ | ❌ | Standard wallet injection |
| **Trust** | ✅ | ✅ | ✅ | ✅ | ✅ (mobile) | Standard wallet injection |
| **Rainbow** | ✅ | ✅ | ✅ | ✅ | ✅ (mobile) | Standard wallet injection |
| **Coinbase** | ✅ | ✅ | ✅ | ✅ | ✅ | Standard wallet injection |
| **Brave** | ✅ | ✅ | ✅ | ❌ | ❌ | Built into browser |
| **Enkrypt** | ✅ | ✅ | ✅ | ❌ | ❌ | Browser extension only |
| **Ambire** | ✅ | ✅ | ✅ | ✅ | ❌ | Browser extension only |
| **Phantom** | ✅ | ✅ | ✅ | ✅ | ✅ | Standard wallet injection |
| **OKX** | ✅ | ✅ | ✅ | ✅ | ✅ | Standard wallet injection |
| **Sequence** | ✅ | ✅ | ✅ | ✅ | ❌ | Web SDK only |
| **Taho** | ✅ | ✅ | ✅ | ❌ | ❌ | Browser extension only |
| **Zerion** | ✅ | ✅ | ✅ | ✅ | ✅ | Standard wallet injection |
| **Wigwam** | ✅ | ✅ | ✅ | ✅ | ✅ | Standard wallet injection |
| **Frame** | ✅ | ✅ | ❌ | ❌ | ❌ | Desktop-only |
| **Block** | ✅ | ✅ | ✅ | ✅ | ✅ | Standard wallet injection |
| **Safe** | N/A | N/A | N/A | ✅ | ❌ | Web app only (WalletConnect) |
| **Ledger Live** | N/A | N/A | N/A | ✅ | ❌ | Mobile/desktop app (WalletConnect) |
| **MEW** | N/A | N/A | N/A | ✅ | ✅ (mobile) | Web + mobile (WalletConnect) |
| **Uniswap** | N/A | N/A | N/A | ✅ | ✅ | Web + mobile (WalletConnect) |
| **Daimo** | N/A | N/A | N/A | ✅ | ❌ | Mobile-only (WalletConnect) |
| **1inch** | N/A | N/A | N/A | ✅ | ✅ | Mobile-only (WalletConnect) |
| **imToken** | N/A | N/A | N/A | ✅ | ✅ | Mobile-only (WalletConnect) |
| **Argent** | N/A | N/A | N/A | ✅ | ✅ | Mobile + Starknet desktop (WalletConnect) |

**Browser Integration Standards:**
- **EIP-1193:** Provider API (`window.ethereum`) — standard wallet injection
- **EIP-2700:** Provider Events (`accountsChanged`, `chainChanged`) — event handling
- **EIP-6963:** Multi-Wallet Discovery — modern standard for detecting multiple wallets
- **WC v2:** WalletConnect v2 (current standard; v1 deprecated June 2023)
- **N/A:** Mobile-only or web-app wallets don't inject into browser (use WalletConnect instead)

---

## 📋 EIP Support Matrix

Detailed EIP support for developers building dApps:

| Wallet | EIP-712 | EIP-2612 | EIP-4337 | EIP-5792 | EIP-7702 | Typed Data |
|--------|---------|----------|----------|----------|----------|------------|
| **MetaMask** | ✅ | ✅ | ⚠️ Snap | ⚠️ Partial | ✅ | ✅ v4 |
| **Rabby** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ v4 |
| **Safe** | ✅ | ✅ | ✅ | ⚠️ Partial | ❌ | ✅ v4 |
| **Rainbow** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ v4 |
| **Coinbase** | ✅ | ✅ | ✅ | ⚠️ Partial | ❌ | ✅ v4 |
| **Trust** | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ v4 |
| **Ambire** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ v4 |
| **Brave** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ v4 |
| **Ledger Live** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ v4 |
| **Sequence** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ v4 |
| **Uniswap** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ v4 |
| **Enkrypt** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ v4 |
| **MEW** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ v4 |
| **Phantom** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ v4 |
| **Daimo** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ v4 |
| **Frame** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ v4 |
| **OKX** | ✅ | ✅ | ❌ | ⚠️ Partial | ✅ | ✅ v4 |
| **Zerion** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ v4 |
| **Taho** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ v4 |
| **Argent** | ✅ | ✅ | ✅ | ⚠️ Partial | ❌ | ✅ v4 |

**EIP Definitions:**
- **EIP-712:** Typed structured data hashing and signing (common for permits, orders) — Foundational standard for human-readable message signing
- **EIP-2612:** Permit extension for ERC-20 (gasless approvals)
- **EIP-4337:** Account Abstraction (smart contract wallets, paymasters)
- **EIP-5792:** Wallet Call API (`wallet_sendCalls` method for batch transactions, atomic operations)
- **EIP-7702:** Set EOA account code (upgrade EOA to smart account temporarily)
- **EIP-7730:** Structured Data Clear Signing Format — Proposed by Ledger, currently Draft status. Standardizes JSON format for clear-signing smart contract calls and typed messages. Designed for hardware wallets with limited screen space. **Wallet support status unknown** — too new for widespread adoption (as of Dec 2025)
- **Typed Data:** eth_signTypedData version support (v4 is current standard)

**Clear Signing & Safety Features:**
- **Clear Signing** refers to wallets displaying structured data in human-readable format when users sign messages or transactions, rather than showing opaque hexadecimal strings
- **EIP-712** is the foundational standard that enables human-readable message signing — all modern wallets support it
- **EIP-7730** builds on EIP-712 by adding formatting metadata for better display (especially important for hardware wallets like Ledger)
- **Enhanced clear signing:** Rabby offers enhanced domain verification and address highlighting (via EIP-712)
- **Safety features:** All wallets include phishing protection; Rabby adds transaction simulation and risk checks

**EIP Support Status:**
- ✅ **Full Support:** Wallet implements the complete EIP specification
- ⚠️ **Partial Support:** Wallet has limited or experimental implementation (see details below)
- ❌ **No Support:** Wallet does not implement this EIP

**EIP-5792 Partial Support Details:**
- **MetaMask:** Experimental/limited support — may require specific configurations or extensions
- **Coinbase:** Partial implementation — supports `wallet_sendCalls` but may have limitations
- **OKX:** Partial implementation — supports batch transactions via EIP-5792 methods
- **Safe:** Partial support — smart contract wallets can batch, but EIP-5792 API may be limited
- **Argent:** Partial support — smart contract wallet batching available, EIP-5792 API support varies
- **Sequence:** ✅ Full support — native implementation of EIP-5792 `wallet_sendCalls` API

**Developer Notes:**
- All modern wallets support EIP-712 — use it for permits and orders
- EIP-2612 (permit) is widely supported — prefer gasless approvals
- EIP-4337 requires bundler infrastructure — only relevant for smart wallets
- EIP-5792 is new (2024) — Sequence has full support; MetaMask, Coinbase, OKX, Safe, and Argent have partial support. Standardizes `wallet_sendCalls` for atomic batch transactions.
- EIP-7702 is cutting edge — MetaMask, Ambire, Trust, and OKX support it ([source](https://github.com/fireblocks-labs/awesome-eip-7702#wallets-support-updates))

---

## 🔧 EIP-7702 Wallet Support (Pectra Upgrade)

EIP-7702 allows EOAs (Externally Owned Accounts) to temporarily delegate to smart contract code, enabling features like batching, gas sponsorship, and session keys without converting to a full smart contract wallet.

### Wallets with EIP-7702 Support

| Wallet | Status | Default | Source |
|--------|--------|---------|--------|
| **MetaMask** | ✅ Live | EOA | [MetaMask Smart Accounts](https://metamask.io/news/metamask-feature-update-smart-accounts) |
| **Trust Wallet** | ✅ Live | EOA | [BeInCrypto Report](https://beincrypto.com/trust-wallet-ethereum-eip7702-support/) |
| **Ambire** | ✅ Live | 7702 | [Ambire Blog](https://blog.ambire.com/eip-7702-wallet/) |
| **OKX** | ✅ Live | EOA | [OKX Help Center](https://web3.okx.com/help/okx-wallet-to-support-eip-7702) |
| Safe | 🔬 POC | Safe | [safe-eip7702](https://github.com/5afe/safe-eip7702) (experimental) |

### What EIP-7702 Enables

- **Batching:** Multiple operations in one atomic transaction (e.g., approve + swap)
- **Gas Sponsorship:** Account X pays gas for account Y's transactions
- **Session Keys:** Delegate limited permissions to sub-keys (e.g., spend limits)
- **Privilege De-escalation:** Grant apps limited access without full account control

### Developer Resources

- [EIP-7702 Specification](https://eips.ethereum.org/EIPS/eip-7702)
- [Awesome EIP-7702](https://github.com/fireblocks-labs/awesome-eip-7702) — Curated list of tools, guides, and implementations
- [7702 Checker](https://7702checker.azfuller.com/) — Check chain support for EIP-7702
- [MetaMask Delegation Framework](https://github.com/MetaMask/delegation-framework) — Reference implementation
- [Viem EIP-7702 Support](https://viem.sh/docs/eip7702) — TypeScript library support

**Note:** EIP-7702 was activated in Ethereum's Pectra upgrade. Check [7702 Beat](https://swiss-knife.xyz/7702beat) for current chain and wallet adoption status.

### Wallets to Watch for Future 7702 Support

| Wallet | Status | Evidence |
|--------|--------|----------|
| **Uniswap** | 🔬 Contract deployed | [Calibur](https://github.com/Uniswap/calibur) v1.0.0 on mainnet, audited by OpenZeppelin & Cantina |
| **Bitget** | 📡 On 7702 Beat | Listed on [swiss-knife.xyz/7702beat](https://swiss-knife.xyz/7702beat), no official announcement |
| **Coinbase** | ⏳ Expected | Has EIP-4337; 7702 likely coming |

*Wallets are only added to the "Supported" table when verified by [awesome-eip-7702](https://github.com/fireblocks-labs/awesome-eip-7702) or official announcement.*

---

## ⛽ Gas Estimation & Transaction Preview

How accurately do wallets estimate gas and preview transaction effects?

| Wallet | Gas Accuracy | Asset Changes | Approval Preview | Revoke UI | Simulation Source |
|--------|--------------|---------------|------------------|-----------|-------------------|
| **Rabby** | ✅ Excellent | ✅ Full | ✅ Warnings | ✅ Yes | Built-in + DeBank |
| **Safe** | ✅ Excellent | ✅ Full | ✅ Warnings | ✅ Yes | Tenderly |
| **Ambire** | ✅ Excellent | ✅ Full | ✅ Warnings | ✅ Yes | Built-in |
| **Coinbase** | ✅ Good | ✅ Full | ✅ Warnings | ✅ Yes | Built-in |
| **Phantom** | ✅ Good | ✅ Full | ✅ Warnings | ✅ Yes | Built-in |
| **MetaMask** | ⚠️ Variable | ⚠️ Snaps only | ⚠️ Basic | ❌ No | eth_estimateGas |
| **Frame** | ✅ Good | ✅ Full | ⚠️ Basic | ❌ No | Built-in |
| **Trust** | ⚠️ Basic | ❌ None | ⚠️ Basic | ❌ External | eth_estimateGas |
| **Rainbow** | ⚠️ Basic | ❌ None | ⚠️ Basic | ❌ External | eth_estimateGas |
| **Ledger Live** | ⚠️ Basic | ❌ None | ⚠️ Basic | ❌ No | eth_estimateGas |
| **Others** | ⚠️ Basic | ❌ None | ⚠️ Basic | ❌ External | eth_estimateGas |

**Recommendations:**
- For development: Use **Rabby** or **Safe** — catch issues before mainnet
- For security-critical txs: Prefer wallets with full asset change preview
- For approvals: Only Rabby, Safe, Ambire show clear unlimited approval warnings

---

## 📱 Mobile Deep-linking & Integration

For dApps with mobile support, deep-linking is critical for good UX:

| Wallet | Universal Links | Custom Scheme | WC Mobile Link | App Links (Android) |
|--------|-----------------|---------------|----------------|---------------------|
| **MetaMask** | ✅ metamask.app.link | ✅ metamask:// | ✅ Yes | ✅ Yes |
| **Coinbase** | ✅ go.cb-w.com | ✅ cbwallet:// | ✅ Yes | ✅ Yes |
| **Trust** | ✅ link.trustwallet.com | ✅ trust:// | ✅ Yes | ✅ Yes |
| **Rainbow** | ✅ rnbwapp.com | ✅ rainbow:// | ✅ Yes | ✅ Yes |
| **Phantom** | ✅ phantom.app | ✅ phantom:// | ✅ Yes | ✅ Yes |
| **Uniswap** | ✅ uniswap.org | ✅ uniswap:// | ✅ Yes | ✅ Yes |
| **Safe** | ⚠️ Web only | ❌ N/A | ✅ Yes | ❌ N/A |
| **Rabby** | ⚠️ Limited | ⚠️ Desktop | ✅ Yes | ⚠️ Limited |
| **Ledger Live** | ✅ ledger.com | ✅ ledgerlive:// | ✅ Yes | ✅ Yes |
| **Zerion** | ✅ zerion.io | ✅ zerion:// | ✅ Yes | ✅ Yes |
| **imToken** | ✅ imtoken.io | ✅ imtokenv2:// | ✅ Yes | ✅ Yes |

**Deep-linking Best Practices:**
1. Always provide WalletConnect as fallback
2. Use Universal Links over custom schemes (more reliable)
3. Test on both iOS and Android
4. Handle "wallet not installed" gracefully

---

## 🚀 Developer Experience Benchmarks

Qualitative assessment based on common developer tasks:

| Wallet | Docs Quality | SDK/API | Error Messages | Testnet UX | Community |
|--------|--------------|---------|----------------|------------|-----------|
| **MetaMask** | ⚠️ Fragmented | ✅ Excellent | ⚠️ Generic | ✅ Good | ✅ Large |
| **Coinbase** | ✅ Good | ✅ Excellent | ✅ Clear | ✅ Good | ✅ Good |
| **Safe** | ✅ Excellent | ✅ Excellent | ✅ Clear | ✅ Good | ✅ Active |
| **Rabby** | ⚠️ Minimal | ⚠️ Limited | ✅ Clear | ✅ Good | ⚠️ Small |
| **Rainbow** | ✅ Good | ✅ Good | ✅ Clear | ✅ Good | ⚠️ Small |
| **Sequence** | ✅ Excellent | ✅ Excellent | ✅ Clear | ✅ Good | ✅ Active |
| **Trust** | ⚠️ Basic | ⚠️ Limited | ⚠️ Generic | ✅ Good | ⚠️ Small |
| **Ledger Live** | ✅ Good | ✅ Good | ✅ Clear | ⚠️ Limited | ✅ Active |
| **Phantom** | ✅ Good | ✅ Good | ✅ Clear | ❌ None | ✅ Active |

**Best for Developers:**
1. **Safe** — Best documentation, SDK, and AA support
2. **Coinbase** — Excellent SDK with clear error handling
3. **Sequence** — Purpose-built for game/app developers
4. **MetaMask** — Widest ecosystem but fragmented docs

---

## 💰 Monetization & Business Model

Understanding how wallets make money helps assess long-term viability and potential conflicts of interest:

| Wallet | Primary Revenue | Funding | Risk Level | Notes |
|--------|-----------------|---------|------------|-------|
| **MetaMask** | Swap fees (0.875%) | Consensys (VC) | 🟢 Low | Backed by $450M+ Consensys |
| **Rabby** | Swap fees | DeBank | 🟢 Low | Backed by DeBank ecosystem |
| **Coinbase** | Swap/bridge fees | Coinbase (public) | 🟢 Low | $8B+ market cap parent company |
| **Trust** | In-app swaps | Binance | 🟢 Low | Backed by largest exchange |
| **Rainbow** | Swap fees | VC ($18M Series A) | 🟡 Medium | VC-funded, may need monetization |
| **Safe** | Enterprise fees | Grants + VC | 🟢 Low | Strong ecosystem funding |
| **Ambire** | Gas abstraction fees | VC | 🟡 Medium | Smaller funding, niche market |
| **MEW** | Swap fees | Self-funded | 🟢 Low | Sustainable since 2015 |
| **Taho** | None (community) | Grants | 🔴 High | Donation-dependent |
| **Frame** | None | Donations | 🔴 High | ❌ INACTIVE - funding unclear |
| **Brave** | BAT ecosystem | Brave Software | 🟢 Low | Browser business model |
| **Enkrypt** | None visible | MEW | 🟡 Medium | Part of MEW ecosystem |
| **imToken** | Swap fees | VC (China) | 🟡 Medium | Regional focus |
| **Daimo** | None (early) | VC | 🟡 Medium | Pre-revenue, VC-funded |
| **Phantom** | Swap fees | VC (~$259M: $109M Series B 2022 + $150M Series C Jan 2025) | 🟢 Low | Well-funded unicorn |
| **Zerion** | Premium features | VC ($12M) | 🟡 Medium | Freemium model |
| **OKX** | Exchange integration | OKX Exchange | 🟢 Low | Backed by major exchange |
| **Argent** | None visible | VC | 🔴 High | ❌ INACTIVE - funding concerns |
| **1inch** | DEX aggregation | VC + token | 🟢 Low | 1INCH token ecosystem |

**Risk Levels:**
- 🟢 **Low:** Sustainable revenue or strong backing
- 🟡 **Medium:** VC-dependent or unproven model  
- 🔴 **High:** Donation-dependent or inactive

**Revenue Sources:**
- **Swap fees:** 0.3-1% on in-app token swaps
- **Bridge fees:** Fees for cross-chain transfers
- **Enterprise fees:** B2B licensing (Safe)
- **Premium features:** Subscription tiers (Zerion)
- **Exchange backing:** Subsidized by parent exchange

---

## 🛡️ Security Features (Tx Simulation & Scam Protection)

Key security features for protecting users from malicious transactions:

| Wallet | Tx Simulation | Scam Alerts | Approval Mgmt | Contract Verify | Spending Limits |
|--------|---------------|-------------|---------------|-----------------|-----------------|
| **MetaMask** | ⚠️ Snaps only | ⚠️ Blockaid | ✅ Yes | ⚠️ Basic | ❌ No |
| **Rabby** | ✅ Built-in | ✅ Built-in | ✅ Yes | ✅ Yes | ❌ No |
| **Coinbase** | ✅ Built-in | ✅ Built-in | ✅ Yes | ⚠️ Basic | ❌ No |
| **Trust** | ⚠️ Supported networks | ✅ Built-in scanner | ✅ Yes | ⚠️ Basic | ❌ No |
| **Rainbow** | ❌ No | ⚠️ Basic | ✅ Yes | ⚠️ Basic | ❌ No |
| **Safe** | ✅ Built-in | ✅ Tenderly | ✅ Yes | ✅ Yes | ✅ Yes |
| **Ambire** | ✅ Built-in | ✅ Built-in | ✅ Yes | ✅ Yes | ✅ Yes |
| **MEW** | ❌ No | ⚠️ Basic | ✅ Yes | ⚠️ Basic | ❌ No |
| **Taho** | ❌ No | ⚠️ Basic | ✅ Yes | ⚠️ Basic | ❌ No |
| **Frame** | ✅ Built-in | ⚠️ Basic | ✅ Yes | ✅ Yes | ❌ No |
| **Brave** | ❌ No | ⚠️ Basic | ✅ Yes | ⚠️ Basic | ❌ No |
| **Enkrypt** | ❌ No | ⚠️ Basic | ✅ Yes | ⚠️ Basic | ❌ No |
| **imToken** | ❌ No | ⚠️ Basic | ⚠️ Basic | ⚠️ Basic | ❌ No |
| **Phantom** | ✅ Built-in | ✅ Built-in | ✅ Yes | ⚠️ Basic | ❌ No |
| **Zerion** | ❌ No | ⚠️ Basic | ✅ Yes | ⚠️ Basic | ❌ No |
| **OKX** | ⚠️ Limited | ⚠️ Basic | ✅ Yes | ⚠️ Basic | ❌ No |

**Feature Definitions:**
- **Tx Simulation:** Preview transaction effects before signing (gas, token changes, approvals)
- **Scam Alerts:** Warning for known malicious addresses/contracts
- **Approval Mgmt:** View/revoke token approvals
- **Contract Verify:** Show verified contract info from Etherscan/Sourcify
- **Spending Limits:** Set daily/weekly transaction limits

**Best for Security:**
1. ✅ **Rabby** — Built-in simulation + scam detection + approval management
2. ✅ **Safe** — Tenderly simulation + spending limits + multi-sig
3. ✅ **Ambire** — Full security suite with spending limits
4. ✅ **Phantom** — Good simulation and scam protection
5. ⚠️ **Frame** — Good features but ❌ INACTIVE

**Transaction Simulation Comparison:**
| Feature | Rabby | Safe | MetaMask | Phantom |
|---------|-------|------|----------|---------|
| Asset changes preview | ✅ | ✅ | ⚠️ Snap | ✅ |
| Gas estimation | ✅ | ✅ | ✅ | ✅ |
| Approval warnings | ✅ | ✅ | ⚠️ Snap | ✅ |
| Revoke suggestions | ✅ | ✅ | ❌ | ❌ |
| Pre-sign simulation | ✅ | ✅ | ❌ | ✅ |

---

## 🔐 Privacy & Data Collection

What data each wallet collects affects user privacy and regulatory compliance:

| Wallet | Default RPC | IP Logged | Tx History | Analytics | Privacy Policy |
|--------|-------------|-----------|------------|-----------|----------------|
| **MetaMask** | Infura (Consensys) | ⚠️ Yes | ⚠️ Yes | ⚠️ Yes | [Link](https://metamask.io/privacy-notice) |
| **Rabby** | Custom RPCs | ✅ No | ✅ No | ⚠️ Minimal | [Link](https://rabby.io/docs/privacy) |
| **Coinbase** | Coinbase | ⚠️ Yes | ⚠️ Yes | ⚠️ Yes | [Link](https://www.coinbase.com/legal/privacy) |
| **Trust** | Trust RPCs | ⚠️ Yes | ⚠️ Yes | ⚠️ Yes | [Link](https://trustwallet.com/privacy-policy) |
| **Rainbow** | Rainbow RPCs | ⚠️ Yes | ⚠️ Yes | ⚠️ Yes | [Link](https://rainbow.me/privacy) |
| **Safe** | Safe RPCs | ⚠️ Yes | ⚠️ Yes | ⚠️ Minimal | [Link](https://safe.global/privacy) |
| **Ambire** | Ambire RPCs | ⚠️ Yes | ⚠️ Yes | ⚠️ Minimal | [Link](https://ambire.com/privacy-policy) |
| **MEW** | MEW RPCs | ⚠️ Yes | ✅ No | ⚠️ Minimal | [Link](https://www.myetherwallet.com/privacy-policy) |
| **Taho** | Alchemy | ⚠️ Yes | ✅ No | ✅ Minimal | [Link](https://taho.xyz/privacy) |
| **Frame** | Custom only | ✅ No | ✅ No | ✅ No | Open source |
| **Brave** | Brave Proxy | ✅ Proxied | ✅ No | ⚠️ Opt-in | [Link](https://brave.com/privacy/browser/) |
| **Enkrypt** | MEW RPCs | ⚠️ Yes | ✅ No | ⚠️ Minimal | Not found (enkrypt.com privacy URLs 404, 2026-10-17) |
| **imToken** | imToken RPCs | ⚠️ Yes | ⚠️ Yes | ⚠️ Yes | [Link](https://token.im/privacy) |
| **Phantom** | Phantom RPCs | ⚠️ Yes | ⚠️ Yes | ⚠️ Yes | [Link](https://phantom.com/privacy) |
| **Zerion** | Zerion RPCs | ⚠️ Yes | ⚠️ Yes | ⚠️ Yes | [Link](https://zerion.io/privacy-policy) |
| **OKX** | OKX RPCs | ⚠️ Yes | ⚠️ Yes | ⚠️ Yes | [Link](https://web3.okx.com/help/okx-web3-ecosystem-privacy-policy) |

**Privacy Ratings:**
- ✅ **Best:** Frame, Brave (proxy), Rabby (custom RPCs)
- ⚠️ **Moderate:** MEW, Enkrypt, Safe, Taho
- ❌ **Most Data:** MetaMask, Coinbase, Trust, Phantom, OKX

**Privacy Concerns:**
- **Default RPC:** Using wallet's default RPC exposes your IP + all transactions to that provider
- **Mitigation:** Use custom RPC (Alchemy, QuickNode, or self-hosted) to reduce exposure
- **Tx History:** Some wallets store transaction history server-side for convenience
- **Analytics:** Telemetry data collection varies; check privacy settings

**Privacy-First Options:**
1. **Frame** — Desktop only, no default RPC, zero tracking (but ❌ inactive)
2. **Brave** — Proxies RPC calls, minimal analytics
3. **Rabby** — Encourages custom RPCs, minimal server-side data

---

## Detailed License Information (from WalletBeat + GitHub Verification)

| Wallet | Browser Ext License | Mobile License | Core License | FOSS Status | Verified |
|--------|---------------------|----------------|--------------|-------------|----------|
| **MetaMask** | Custom (src-avail) | Custom (src-avail) | MIT | ⚠️ Partial | ✅ GitHub |
| **Rabby** | MIT (with brand) | Unlicensed (visible) | Unlicensed | ⚠️ Mixed | ✅ GitHub |
| **Rainbow** | GPL-3.0 | GPL-3.0 | - | ✅ FOSS | ✅ GitHub |
| **Safe** | GPL-3.0 | GPL-3.0 | - | ✅ FOSS | ✅ GitHub |
| **Trust** | - | - | Apache-2.0 | ⚠️ Partial | ✅ GitHub |
| **Phantom** | Proprietary | Proprietary | - | ❌ Closed | WalletBeat |
| **Frame** | GPL-3.0 | N/A | - | ✅ FOSS | WalletBeat |
| **Ambire** | GPL-3.0 | - | - | ✅ FOSS | WalletBeat |
| **Argent** | Custom non-commercial (License.md) | - | - | ⚠️ Source-available | ✅ GitHub |
| **Brave** | MPL-2.0 | MPL-2.0 | - | ✅ FOSS | ✅ GitHub |
| **Enkrypt** | MIT | N/A | - | ✅ FOSS | ✅ GitHub |
| **MEW** | MIT | MIT | - | ✅ FOSS | WalletBeat |
| **Coinbase** | Partial | Partial | MIT | ⚠️ Partial | WalletBeat |
| **OKX** | Proprietary | Proprietary | - | ❌ Closed | WalletBeat |
| **Zerion** | Proprietary | Proprietary | - | ❌ Closed | WalletBeat |
| **imToken** | N/A | Proprietary | Apache-2.0 | ⚠️ Partial | WalletBeat |
| **Daimo** | N/A | GPL-3.0 | - | ✅ FOSS (repo archived Feb 18, 2026; app discontinued) | ✅ GitHub |

**License Types:**
- **FOSS:** MIT, GPL-3.0, Apache-2.0, MPL-2.0, BSD-3-Clause (OSI approved)
- **Future FOSS:** BUSL-1.1 (converts to open source after time period)
- **Source-Available:** Code visible but not OSI-approved license
- **Proprietary:** Closed source, no public code

---

## Other Wallet Comparison Resources

| Resource | URL | Focus | Data |
|----------|-----|-------|------|
| **WalletBeat** | [walletbeat.fyi](https://walletbeat.fyi) ([GitHub](https://github.com/walletbeat/walletbeat)) | Technical features | License, devices, ENS, testnets, security, backup, RPC |
| Ethereum.org | [ethereum.org/wallets/find-wallet](https://ethereum.org/en/wallets/find-wallet/) | Consumer features | Filtering by features |
| WalletConnect | [walletguide.walletconnect.com](https://walletguide.walletconnect.com/) | Wallet registry | WalletConnect support |
| CoinGecko | [coingecko.com/en/wallets](https://www.coingecko.com/en/wallets) | User reviews | Popularity, ratings |
| ChainList | [chainlist.org](https://chainlist.org) | RPC endpoints | Chain RPC configs |

### WalletBeat Data Categories

WalletBeat tracks detailed technical information not found elsewhere:

| Category | Features Tracked |
|----------|------------------|
| **ENS** | Mainnet, Subdomains, Offchain, L2s, Custom domains, Usernames |
| **Backup** | Cloud Backup, Manual Backup, Social Recovery |
| **Security** | Multisig, MPC, Key Rotation, Transaction Scanning, Spending Limits, Hardware wallet support |
| **Connection** | WalletConnect, Injected provider (EIP-1193/6963), In-App Browser |
| **Devices** | Mobile, Browser extension, Desktop |
| **Account Type** | EOA, EIP-4337, Safe |
| **Modularity** | Plugin/module support |
| **Testnets** | Testnet compatibility |
| **License** | Open Source, Source Visible, Proprietary |

**Gap:** No existing resource tracks release frequency, code quality, or developer experience. This document fills that gap with GitHub metrics and stability analysis.

---

## Integration Advice

**Quick Tips:**
- Use wallet abstraction libraries (wagmi, viem) to avoid locking to one wallet
- Prioritize: Developer-friendly (Rabby, Safe) → Stable & active (Rainbow, Enkrypt, Trust) → MetaMask (compatibility only)
- Test with multiple wallets — each has quirks

### Use Wallet Abstraction

```bash
bun add wagmi viem
```

Abstract wallet dependencies so you're not locked to any single wallet. See [Integration Best Practices](#integration-best-practices) for detailed guidance.

### Prioritize Wallets in This Order

1. Developer-friendly wallets (Rabby, Safe)
2. Stable & active wallets (Rainbow, Enkrypt, Trust Wallet)
3. MetaMask (for compatibility only)

### Test With Multiple Wallets

Each wallet has quirks. Test your dApp with at least 3 wallets before production.

---

## Data Sources & Verification

**Original Data (November 2024):**
- Stars, issues, issue/star ratios
- Release frequency (3-month window: Aug-Nov 2024)
- Stability ratings, platform support, feature matrix

**Activity Status Update (November 28, 2025):**
- Last commit dates verified via GitHub REST API
- Stars and issue counts refreshed
- Chain counts from wallet APIs and registries
- Custom RPC data from WalletBeat

**WalletBeat Data (December 2025):**
- License information (per-variant: browser, mobile, core)
- Device/platform support (mobile, browser, desktop)
- Testnet support (via custom chains capability)
- ENS support details
- Security features (audits, scam alerts, hardware wallet support)
- Connection methods (EIP-1193, EIP-6963, WalletConnect)
- Account types (EOA, EIP-4337, Safe)
- Security audit history and links to reports

**GitHub Repositories (with activity status):**

| Repository | Last Commit | Status |
|------------|-------------|--------|
| [MetaMask/metamask-extension](https://github.com/MetaMask/metamask-extension) | Oct 15, 2026 | ✅ Active |
| [RabbyHub/Rabby](https://github.com/RabbyHub/Rabby) | Oct 15, 2026 | ✅ Active |
| [coinbase/coinbase-wallet-sdk](https://github.com/coinbase/coinbase-wallet-sdk) | Oct 13, 2026 (docs/rebrand notes; last release Jun 25, 2025, superseded by Base Account SDK) | ⚠️ Slow |
| [trustwallet/wallet-core](https://github.com/trustwallet/wallet-core) | Oct 14, 2026 | ✅ Active |
| [rainbow-me/rainbow](https://github.com/rainbow-me/rainbow) | Oct 15, 2026 | ✅ Active |
| [tahowallet/extension](https://github.com/tahowallet/extension) | Aug 20, 2026 | ⚠️ Slow |
| [MyEtherWallet/MyEtherWallet](https://github.com/MyEtherWallet/MyEtherWallet) | Aug 3, 2026 | ⚠️ Slow |
| [AmbireTech/extension](https://github.com/AmbireTech/extension) | Oct 15, 2026 | ✅ Active |
| [block-wallet/extension](https://github.com/block-wallet/extension) | Nov 27, 2024 | ❌ Inactive |
| [wigwamapp/wigwam](https://github.com/wigwamapp/wigwam) | Sep 20, 2026 | ✅ Active |
| [safe-global/safe-wallet-monorepo](https://github.com/safe-global/safe-wallet-monorepo) | Oct 15, 2026 | ✅ Active |
| [argentlabs/argent-x](https://github.com/argentlabs/argent-x) | Mar 14, 2025 | ❌ Inactive |
| [floating/frame](https://github.com/floating/frame) | Feb 1, 2025 | ❌ Inactive |
| [brave/brave-browser](https://github.com/brave/brave-browser) | Oct 15, 2026 | ✅ Active |
| [enkryptcom/enKrypt](https://github.com/enkryptcom/enKrypt) | Sep 1, 2026 | ⚠️ Slow |
| [ethereum/kohaku-extension](https://github.com/ethereum/kohaku-extension) | Jul 3, 2026 | ⚠️ Slow |

**Not Verified (private repos):** OKX, 1inch, Zerion, Phantom

---

## ⚠️ Activity Status Details (re-checked October 15, 2026)

Several previously recommended wallets have **stopped active development**. See the "Alt" column in the main table for recommended alternatives.

| Wallet | Last Commit | Status | Note |
|--------|-------------|--------|------|
| **Block Wallet** | Nov 2024 | ❌ INACTIVE | about 22 months without commits (as of Oct 15, 2026) |
| **Frame** | Feb 2025 | ❌ INACTIVE | 20 months without commits (as of Oct 15, 2026) |
| **Argent-X** | Mar 2025 | ❌ INACTIVE | 19 months without commits (as of Oct 15, 2026). Product now branded Ready; extension "Ready X" |
| **Kohaku**∆ | Jul 2026 | ⚠️ SLOW FORK | Ethereum Foundation fork of Ambire v5.18.0 — use Ambire instead |
| **Coinbase SDK** | Oct 2026 | ⚠️ SLOW | Last release Jun 25, 2025; recent commits are docs. Base App renamed back to Coinbase Wallet on Sep 10, 2026 |
| **Ambire** | Oct 2026 | ✅ ACTIVE | Active development, v6.22.5 released Oct 14, 2026 |
| **Wigwam** | Sep 2026 | ✅ ACTIVE | Last commit Sep 20, 2026 |
| **Taho** | Aug 2026 | ⚠️ SLOW | Last commit Aug 20, 2026 |

---

## Recheck log (2026-10-17)

Primary sources fetched in this pass. Anything not listed here keeps its 2026-10-15 value.

| Item | Result | Source |
|------|--------|--------|
| Coinbase Wallet / Base App | Name unchanged. Base App was renamed back to Coinbase Wallet on 2026-09-10; wallet.coinbase.com and base.app both show "Coinbase Wallet". Row kept, URL now wallet.coinbase.com (coinbase.com/wallet returns 403 to bots). No official post found; the rename is reported by The Block (Sep 10-11, 2026). | https://wallet.coinbase.com/, https://base.app/, https://theblock.co/news/defi/2026-09-10-coinbase-rebrands-base-app-back-to-coinbase-wallet-after-just-over-a-year-as-social-experiment-falls-short-414115 |
| Trust Tx Sim / Scam | Tx Sim ❌ -> ⚠️ (built-in simulation, supported networks only, list not published); Scam ⚠️ -> ✅ (destination screening against scam and drainer databases). Published Aug 13, 2026. | https://trustwallet.com/blog/security/how-trust-wallet-security-scanner-works |
| Ledger Live Tx Sim | ❌ -> ⚠️: Transaction Check simulates EVM transactions, opt-in, needs a Ledger device. App is now branded Ledger Wallet (ex. Ledger Live). | https://www.ledger.com/academy/glossary/transaction-check, https://shop.ledger.com/pages/ledger-wallet |
| Rabby audits | Newest reports Oct 9, 2026 (Least Authority) and Aug 24, 2026 (SlowMist) for extension and mobile; unresolved/partial counts read from the PDFs. | https://github.com/RabbyHub/Rabby/tree/develop/audits/2026, https://github.com/RabbyHub/rabby-mobile/tree/develop/audits/2026 |
| MetaMask audits | Delegation framework has Cyfrin reports dated 10-26, 5-26, 4-26 and Diligence 4-25. Table cell year 2025 -> 2026. | https://github.com/MetaMask/delegation-framework/tree/main/audits |
| Gem Wallet audit | CertiK April 2026 confirmed. | https://github.com/gemwalletcom/wallet (README), https://gemwallet.com/ |
| Phantom funding | Series B $109M (Jan 2022) + Series C $150M at $3B (Jan 16, 2025); cell shows ~$259M. | https://www.theblock.co/post/335305/phantom-wallet-raises-150-million-at-3-billion-valuation |
| Argent -> Ready | argent.xyz redirects to www.ready.co; the page does not state the rebrand, which is reported by secondary sources. Row kept as Argent (now Ready). | https://www.ready.co/ |
| Link fixes | 1inch.io/wallet -> 1inch.com/wallet; phantom.app -> phantom.com; okx.com/web3 -> web3.okx.com; ledger.com/ledger-live -> shop.ledger.com/pages/ledger-wallet; explorer.walletconnect.com -> walletguide.walletconnect.com; viem.sh/experimental/eip7702 -> viem.sh/docs/eip7702; consensys.io/privacy-policy -> metamask.io/privacy-notice; Rabby, OKX and Zerion privacy pages replaced. Enkrypt has no findable privacy page (404 on enkrypt.com/privacy-policy and /privacy), so the hyperlink was removed. | all HTTP 200 on 2026-10-17 except Enkrypt |

**Unverified after this pass (old value kept):**
- Rainbow Tx Sim and Scam: only a Blockaid vendor post (Dec 6, 2023) says Rainbow uses Blockaid; no Rainbow primary page found. Cells unchanged.
- Brave Tx Sim: simulation exists behind a flag (`brave://flags/#brave-wallet-enable-transaction-simulations`, Brave 1.65.114 release notes, secondary); cell unchanged.
- MetaMask Tx Sim: support page says Ethereum mainnet only (search snippet, page not fetched in full); cell unchanged at ⚠️.
- Coinbase audits: the app has no public report; the separate smart-wallet contracts have public Cantina, Certora and Code4rena reports. Cell left at ❓ Priv for an owner decision.
- Sequence audit year (2024): v3 contracts repo has Certora, Code4rena, Consensys and Quantstamp reports but the PDFs were not dated.
- imToken privacy link (token.im/privacy): HTTP 403 Cloudflare challenge in plain and headless Chromium fetches, not a 404. Link kept.
- Private-repo wallets (OKX, Phantom, Zerion, Exodus, 1inch, Bitget, Mt Pelerin) and Rel/Mo for bursty or multi-product repos (Brave, Ambire, Ledger, Gem, Uniswap, Sequence, Trust, Rainbow, Safe, MEW, imToken, Enkrypt): unchanged. Release counts from the GitHub API over 90 days (Ambire 50, Ledger 34, Gem 84, Brave 100+) are not comparable with the table's Rel/Mo.
- HW, API, ENS columns and chain lists for all rows: not re-fetched.

---

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a complete history of changes to wallet statuses, recommendations, and documentation structure.

---

## 🆕 Contributing: Add a New Wallet

To add a new wallet to this comparison, open a PR with:

1. **Main table row** with all 17 columns
2. **Verification** of at least: GitHub repo, last commit, license, chains
3. **Source links** for any claims made

### Required Data Template

```markdown
| **WalletName** | XX | [repo](url) | ✅/⚠️/❌ | N | 📱🌐 | ✅/❌ | ✅/⚠️/❌ | ✅/⚠️/❓ | 🟢/🟡/🔴 | ✅/⚠️/❌ | ✅/⚠️ | EOA/4337 | ✅/❌ | ✅/⚠️/❌ | Use case | 🟢/🟡/🔴 |
```

### Verification Checklist

- [ ] GitHub repo exists and is accessible
- [ ] Last commit date checked (for activity status)
- [ ] License file verified in repo
- [ ] Chain count verified from official docs
- [ ] Device support confirmed (mobile, browser, desktop)
- [ ] At least one data source linked

### Data Sources

Prefer in this order:
1. **GitHub repo** - License, activity, code quality
2. **Official docs** - Features, chain support
3. **WalletBeat** - Technical features, security
4. **Wallet website** - Marketing claims (verify independently)

---

*Last updated: October 17, 2026 (Trust and Ledger Live security columns, Rabby and MetaMask audit dates, Phantom funding, GitHub metrics and external links re-checked; see the Recheck log). Earlier: October 15, 2026 (GitHub metrics, licences, activity and Rel/Mo re-checked against the GitHub API; Daimo archived Feb 18, 2026; Status moved to status-im/status-app, legacy repo archived Jul 22, 2026). Earlier note, December 16, 2025. Full wallet validation: Wigwam and Taho resumed active development; GitHub metrics refreshed for all 25 wallets. Kohaku (ethereum/kohaku-extension) added as an Ethereum-maintained Ambire-derived experimental wallet marked with ∆. Data from [WalletBeat](https://walletbeat.fyi), [awesome-eip-7702](https://github.com/fireblocks-labs/awesome-eip-7702), [7702 Beat](https://swiss-knife.xyz/7702beat), and GitHub API.*

# Hardware Wallet Comparison (Cold Storage Alternatives to Ledger) - Full Documentation

> 📊 **View the comparison table:** [See all wallets at a glance →](./HARDWARE_WALLETS.md)

> **Source of truth note:** Current `Score` and `Rec` values are generated from the visible columns in [HARDWARE_WALLETS.md](./HARDWARE_WALLETS.md) via `scripts/sync_table_scores.js` (`2026-04-visible-columns-v3`). If a long-form section below mentions older numeric scores, trust the main comparison table.

> **TL;DR:** The generated snapshot below mirrors the current main-table ordering and scores. Use it for the latest rankings; the long-form sections below explain security architecture, firmware transparency, and tradeoffs in more detail.

<!-- GENERATED_HARDWARE_SNAPSHOT_START -->
> **Current generated snapshot:** Keystone 3 Pro (92, ✅ Active, 🟢), ColdCard Mk4 (88, ✅ Active, 🟢), ColdCard Mk5 (86, ✅ Active, 🟢), and ColdCard Q (84, ✅ Active, 🟢). Regenerated from [HARDWARE_WALLETS.md](./HARDWARE_WALLETS.md) by `scripts/sync_table_scores.js` using methodology `2026-04-visible-columns-v3`.

### Current Top Rows (generated)
| Rank | Wallet | Score | Activity | Rec |
| ---- | ------ | ----- | -------- | --- |
| 1 | **Keystone 3 Pro** | 92 | ✅ Active | 🟢 |
| 2 | **ColdCard Mk4** | 88 | ✅ Active | 🟢 |
| 3 | **ColdCard Mk5** | 86 | ✅ Active | 🟢 |
| 4 | **ColdCard Q** | 84 | ✅ Active | 🟢 |
| 5 | **Keycard Shell** | 83 | ✅ Active | 🟢 |
<!-- GENERATED_HARDWARE_SNAPSHOT_END -->

**Last Updated:** October 15, 2026 | [Scoring Methodology](#-scoring-methodology) | [GitHub Activity Data](#github-metrics-firmware-repositories) | [View Company Aggregates](https://github.com/chimera-defi/walletradar/blob/main/HARDWARE_WALLET_COMPANIES.md)

**Related:** See [Software Wallet Comparison](./SOFTWARE_WALLETS.md) for EVM wallet recommendations and integration details.
**Companies:** See [Hardware Wallet Companies](https://github.com/chimera-defi/walletradar/blob/main/HARDWARE_WALLET_COMPANIES.md) for aggregated scores and wallet counts by manufacturer.

---

## Table of Contents

- [Complete Hardware Wallet Comparison](./HARDWARE_WALLETS.md#complete-hardware-wallet-comparison) (Table View)
- [Quick Recommendations](#-quick-recommendations)
- [GitHub Metrics](#github-metrics-firmware-repositories)
- [Security Deep Dive](#-security-deep-dive)
- [Scoring Methodology](#-scoring-methodology)
- [Wallets to Avoid or Use with Caution](#-wallets-to-avoid-or-use-with-caution)
- [Why Look Beyond Ledger?](#-why-look-beyond-ledger)
- [Ledger Migration](#-ledger-migration)
- [Resources](#resources)
- [Changelog](#-changelog)

---

## Column Definitions

Complete explanations for all table columns:

| Column | Values | Meaning |
|--------|--------|---------|
| **Score** | 0-100 | Weighted score prioritizing security, transparency, privacy, activity, company track record, and UX. See [Scoring Methodology](#-scoring-methodology) |
| **GitHub** | Link or "Private" | Firmware repository link | "Private" = closed source firmware |
| **Air-Gap** | ✅ Full / ❌ | ✅ Full = QR/MicroSD only (never connects to computer during signing) | ❌ = USB/BT connection required |
| **Open Source** | ✅ Full / ⚠️ Partial / ❌ Closed | ✅ Full = Firmware + bootloader open source | ⚠️ Partial = App open, firmware closed | ❌ Closed = No open source code |
| **Secure Elem** | ✅ Type / ❌ None | ✅ = Has Secure Element chip (Optiga, ATECC, STM32, etc.) | ❌ = MCU only (no hardware security chip) |
| **Display** | Type | Screen type: Touch Color, Mono OLED, Color LCD, LCD, E-Ink Touch, None (NFC card) |
| **Price** | ~$XXX | Approximate USD price (verify on official site). *DIY wallets = component cost varies |
| **Conn** | USB, BT, QR, NFC, MicroSD, WiFi | Connection methods: USB-C, USB, Bluetooth (BT), QR codes, NFC, MicroSD card, WiFi |
| **Activity** | ✅ / ⚠️ / ❌ / 🔒 | ✅ = Active (≤30 days since last commit) | ⚠️ = Slow (1-4 months) | ❌ = Inactive (4+ months) | 🔒 = Private repo |
| **Rec** | 🟢 / 🟡 / 🔴 | 🟢 = Top half of active rows | 🟡 = Middle quartile | 🔴 = Bottom quartile or inactive |

**Special Notes:**
- ~~Strikethrough~~ = Abandoned/inactive wallet
- *DIY wallets = Requires self-assembly, price varies based on components

---

### GitHub Metrics (Firmware Repositories)

**Generated:** October 15, 2026 from the GitHub API (default-branch last commit, stars, open issues plus pull requests)

| Wallet | Repository | Last Commit | Stars | Issues | Ratio | Status |
|--------|------------|-------------|-------|--------|-------|--------|
| **Trezor** | [trezor/trezor-firmware](https://github.com/trezor/trezor-firmware) | Oct 15, 2026 | 1,846 | 740 | 40.1% | ✅ Active |
| **Blockstream Jade** | [Blockstream/Jade](https://github.com/Blockstream/Jade) | Oct 14, 2026 | 509 | 107 | 21.0% | ✅ Active |
| **SeedSigner** | [SeedSigner/seedsigner](https://github.com/SeedSigner/seedsigner) | Oct 3, 2026 | 1,308 | 297 | 22.7% | ✅ Active |
| **Specter DIY** | [cryptoadvance/specter-diy](https://github.com/cryptoadvance/specter-diy) | Oct 7, 2026 | 589 | 126 | 21.4% | ✅ Active |
| **Krux** | [selfcustody/krux](https://github.com/selfcustody/krux) | Oct 7, 2026 | 376 | 80 | 21.3% | ✅ Active |
| **Keystone** | [KeystoneHQ/keystone3-firmware](https://github.com/KeystoneHQ/keystone3-firmware) | Oct 10, 2026 | 228 | 126 | 55.3% | ✅ Active |
| **BitBox02** | [BitBoxSwiss/bitbox02-firmware](https://github.com/BitBoxSwiss/bitbox02-firmware) | Oct 15, 2026 | 388 | 81 | 20.9% | ✅ Active |
| **ColdCard** | [Coldcard/firmware](https://github.com/Coldcard/firmware) | Oct 9, 2026 | 778 | 6 | 0.8% | ✅ Active |
| **Foundation Passport (Core)** | [Foundation-Devices/passport2](https://github.com/Foundation-Devices/passport2) | Oct 15, 2026 | 88 | 6 | 6.8% | ✅ Active repo, device discontinued |
| **Foundation Passport Prime** | [Foundation-Devices/KeyOS](https://github.com/Foundation-Devices/KeyOS) | Sep 4, 2026 | 31 | 17 | 54.8% | ⚠️ Slow |
| **OneKey Pro** | [OneKeyHQ/firmware-pro](https://github.com/OneKeyHQ/firmware-pro) | Jun 26, 2026 | 32 | 22 | 68.8% | ⚠️ Slow |
| **OneKey Classic 1S** | [OneKeyHQ/firmware](https://github.com/OneKeyHQ/firmware) | May 12, 2026 | 89 | 37 | 41.6% | ❌ Inactive |
| **KeepKey** | [keepkey/keepkey-firmware](https://github.com/keepkey/keepkey-firmware) | Apr 5, 2026 (default branch); Oct 5, 2026 (develop) | 164 | 31 | 18.9% | ✅ Active (develop branch) |

**Code Quality Notes:**
- ✅ **ColdCard (0.8%):** Very few open issues relative to community size. This does not offset the July 2026 seed-generation advisory (see Security Incidents below).
- ✅ **BitBox02 (20.9%), Blockstream Jade (21.0%), Krux (21.3%), Specter DIY (21.4%):** Moderate ratios.
- ⚠️ **SeedSigner (22.7%):** Moderate; large community with many feature requests.
- ⚠️ **Trezor (40.1%):** Higher ratio reflects a large feature set and user base.
- ⚠️ **Keystone (55.3%):** High; many open issues relative to stars.
- 🔴 **OneKey Pro (68.8%):** High ratio and the last commit on the default branch is more than three months old.
- ⚠️ **KeepKey:** The default branch (`master`) was last committed on Apr 5, 2026, but the `develop` branch was committed on Oct 5, 2026 and firmware v7.14.1 was released Jun 5, 2026. The device is on sale at keepkey.com. It is not abandoned.

**Closed Source (no public firmware repos):** Ledger, NGRAVE, Ellipal, SafePal, SecuX, Tangem, BC Vault, GridPlus (checked for a firmware repo on GitHub, 2026-10-15; Bitkey and Cypherock repos are public and listed in the main table)

**Firmware Release Patterns:**
Unlike software wallets where frequent updates can indicate instability, hardware wallet firmware updates are intentionally infrequent for security. Most manufacturers release 2-4 firmware updates per year. This is by design — each update requires extensive security review and user action to install.

| Wallet | GitHub releases, Oct 15 2025 to Oct 15 2026 | Pattern |
|--------|------------------------|---------|
| Keystone | 21 releases | Frequent (active development) |
| Keycard Shell | 13 releases | Frequent |
| BitBox02 | 11 releases | About monthly |
| OneKey Pro (firmware-pro) | 10 releases | About monthly to bimonthly |
| Foundation Passport Prime (KeyOS) | 8 releases | Regular |
| Krux | 6 releases | About every two months |
| KeepKey | 3 releases | A few per year |
| Specter DIY | 2 releases | Infrequent |
| Foundation Passport (Core) | 2 releases | Infrequent (device discontinued) |
| OneKey Classic 1S (firmware) | 2 releases | Infrequent |
| SeedSigner | 1 release | Infrequent |
| Blockstream Jade, Trezor, ColdCard | 0 GitHub releases in this window | No GitHub Releases published in the window |

---

## 🏆 Quick Recommendations

**Quick Answers (current scores from the main table):** Highest score? **Keystone 3 Pro** (92) at ~$149. Bitcoin-only? **ColdCard Mk5** (86) at ~$219 or **Mk4** (88, no longer listed in the Coinkite store), after reading the July 2026 advisory below. Best value? **Trezor Safe 3** (77) at ~$59. Budget QR-capable option? **Blockstream Jade** (74) at ~$67. See [full comparison table](#complete-hardware-wallet-comparison) for all hardware wallets.

**Jump to:** [Comparison Table](./HARDWARE_WALLETS.md#complete-hardware-wallet-comparison) | [Scoring Methodology](#-scoring-methodology) | [Security Deep Dive](#-security-deep-dive) | [Why Look Beyond Ledger?](#-why-look-beyond-ledger)

### Top Picks by Use Case

| Use Case | Top Pick | Score | Runner-Up | Budget Option |
|----------|----------|-------|-----------|---------------|
| **Highest Score** | Keystone 3 Pro | 92 | ColdCard Mk4 (88) | Trezor Safe 3 (~$59) |
| **Bitcoin Only** | ColdCard Mk5 | 86 | Blockstream Jade Plus (70) | Blockstream Jade (~$67) |
| **Air-Gapped** | Keystone 3 Pro | 92 | ColdCard Q (84) | SafePal S1 (~$50) |
| **Best Value** | Trezor Safe 3 | 77 | Blockstream Jade (74) | Tangem (~$55) |
| **Beginners** | Trezor Safe 5 | 78 | BitBox02 (73, price UNVERIFIED) | Blockstream Jade (~$67) |
| **DIY/Self-Build** | Specter DIY | 70 | SeedSigner (70) | Krux (~$30-100, UNVERIFIED) |

### DIY Signing Devices

For technically-inclined users who want maximum transparency and control:

| Device | What You Need | Difficulty | Best For |
|--------|---------------|------------|----------|
| **Specter DIY** | ESP32 board + camera + display | Medium | Multi-chain, experienced users |
| **SeedSigner** | Raspberry Pi Zero + camera + display | Easy-Medium | Bitcoin maximalists, popular community |
| **Krux** | M5StickV or similar | Easy | Beginners to DIY, cheapest option |

**DIY Trade-offs:**
- ✅ **Pros:** Fully open source, air-gapped, no supply chain trust, educational, cheap
- ❌ **Cons:** No Secure Element (lower physical security), requires assembly, no manufacturer warranty

### ⚠️ Wallets to Avoid or Use with Caution

| Wallet | Score | Issue |
|--------|-------|-------|
| **Ledger** (all models) | 59-67 | ⚠️ Ledger Recover capability — use with passphrase only |
| **Ellipal Titan** | 48 | Closed source, no Secure Element |
| **SecuX V20** | 48 | Closed source, unknown funding |
| **Arculus** | 39 | Closed source, NFC-only, no passphrase |
| **KeepKey** | 61 | No secure element (MCU only). Firmware is maintained (v7.14.1 released Jun 2026), so it is no longer listed as abandoned |
| **BC Vault** | 30 | Closed source, no SE, unconventional backup |
| **ColdCard (seeds made on affected firmware)** | see main table | Weak seed-generation RNG, funds stolen, seeds must be migrated (see Security Incidents) |

**See also:** [Why Look Beyond Ledger?](#-why-look-beyond-ledger) for details on Ledger Recover concerns.

---

## 🔒 Security Deep Dive

### Security Features Comparison

| Wallet | Secure Element | Air-Gap | Open Firmware | Reproducible | Passphrase | Multisig | Duress PIN | Anti-Tamper |
|--------|---------------|---------|---------------|--------------|------------|----------|------------|-------------|
| **Trezor Safe 5** | ✅ Optiga Trust M (EAL6+) | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Keystone 3 Pro** | ✅ 3× SE (ATECC608B, DS28S60, MAX32520) | ✅ QR | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **BitBox02** | ✅ ATECC608 | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **ColdCard Mk4** | ✅ Dual SE | ✅ MicroSD | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Blockstream Jade** | ❌ Virtual SE (blind oracle, no physical chip) | ✅ QR | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Foundation Passport (Core, discontinued)** | ✅ SE | ✅ MicroSD/QR | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Trezor Safe 3** | ✅ Optiga Trust M (EAL6+) | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **NGRAVE ZERO** | ✅ STM32 + SE (EAL7) | ✅ QR | ⚠️ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Specter DIY** | ❌ MCU only | ✅ QR | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ DIY |
| **Krux** | ❌ MCU only | ✅ QR | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ DIY |
| **SeedSigner** | ❌ MCU only | ✅ QR | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ DIY |
| **GridPlus Lattice1** | ✅ SE | ❌ WiFi | ⚠️ SDK | ❌ | ✅ | ✅ | ❌ | ✅ |
| **OneKey Pro** | ✅ SE | ❌ | ✅ | ⚠️ | ✅ | ❌ | ❌ | ✅ |
| **Ellipal Titan** | ❌ MCU only | ✅ QR | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **SafePal S1** | ✅ SE | ✅ QR | ⚠️ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **SecuX V20** | ✅ SE (Infineon) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ⚠️ |
| **Tangem** | ✅ EAL6+ NFC | ❌ NFC | ⚠️ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Ledger Nano X** | ✅ CC EAL5+ | ❌ | ⚠️ | ❌ | ✅ | ⚠️ | ❌ | ✅ |
| **Ledger Nano S+** | ✅ ST33K1M5 CC EAL6+ | ❌ | ⚠️ | ❌ | ✅ | ⚠️ | ❌ | ✅ |
| ~~**Ledger Nano S**~~ | ✅ CC EAL5+ | ❌ | ⚠️ | ❌ | ✅ | ⚠️ | ❌ | ✅ |
| **Ledger Stax** | ✅ ST33K1M5 CC EAL6+ | ❌ | ⚠️ | ❌ | ✅ | ⚠️ | ❌ | ✅ |
| **KeepKey** | ❌ MCU only | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Arculus** | ✅ CC EAL6+ | ❌ NFC | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **BC Vault** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ |

**Security Feature Definitions:**
- **Secure Element:** Dedicated security chip to protect private keys (vs general-purpose MCU)
- **Air-Gap:** Device never connects physically to computer during transaction signing
- **Open Firmware:** Publicly auditable source code for device firmware
- **Reproducible:** Firmware can be compiled from source and verified against shipped binary
- **Passphrase:** Optional 25th word for hidden wallet functionality
- **Multisig:** Native support for multi-signature setups
- **Duress PIN:** Decoy wallet that appears when entered under duress
- **Anti-Tamper:** Physical tamper-evident features (seals, mesh, self-destruct)

---

## 📊 Scoring Methodology

**Quick Reference:** Score = Security Architecture (34) + Transparency & Maintenance (28) + Usability & Value (32) + Company Track Record (6) = 100 total

Hardware wallet scoring now uses generated values from visible columns in [HARDWARE_WALLETS.md](./HARDWARE_WALLETS.md), consistent with the same "visible columns only" model used across software, cards, and ramps:

| Category | Weight | Description | Data Sources |
|----------|--------|-------------|--------------|
| **Security Architecture** | 34 pts | Secure element profile + air-gap posture | Table columns |
| **Transparency & Maintenance** | 28 pts | Public firmware depth + open source + activity signal | Table columns |
| **Usability & Value** | 32 pts | Display ergonomics + price + connectivity tradeoffs | Table columns |
| **Company Track Record** | 6 pts | Founded year + funding durability signal | `Founded` + `Funding` columns |

Per-wallet scores are in the [HARDWARE_WALLETS.md](./HARDWARE_WALLETS.md) table. They are generated by `frontend/src/lib/scoring.js` (run `bun scripts/sync_table_scores.js --write`). The older 100-point rubric and per-wallet breakdown table were removed because they no longer matched the generated scores. The formula for new rows is in [CONTRIBUTING.md](./CONTRIBUTING.md).

*DIY/self-build devices (Specter DIY, SeedSigner, Krux) have no Secure Element but are fully air-gapped via QR codes.*

---

## 2026 Security Incidents

Checked 2026-10-15. Primary sources are named; anything only reported by news sites is marked.

| Date | Vendor | What happened | Source |
|------|--------|---------------|--------|
| 2026-07-30 | Coinkite ColdCard | A build error in the 2021 library migration made seed generation use a software PRNG instead of the hardware TRNG. Attackers regenerated seeds offline and stole funds. Affected: Mk2/Mk3 firmware 4.0.1-4.1.9, Mk4/Mk5 before 5.6.0 (Edge before 6.6.0X), Q before 1.5.0Q (Edge before 6.6.0QX). Updating does not repair an existing seed; it must be migrated. Losses: Bitcoin Optech states above 1,000 BTC; TRM Labs (secondary) reports about 1,816 BTC. | [Coinkite advisory](https://coinkite.com/historical-disclosures), [Bitcoin Optech](https://bitcoinops.org/en/newsletters/2026/07/31/) |
| 2026-06-03 | Trezor Safe 7 (Tropic Square TROPIC01 chip) | Ledger Donjon found a laser fault-injection attack in late January 2026; Tropic Square then extracted one more secret tied to PIN protection. Trezor says funds, PIN and backups are not exposed, no user action is needed, and the issue cannot be fixed by firmware. | [Trezor blog](https://trezor.io/blog/news/Trezor-response-TROPIC01-chip-disclosure-no-impact-to-your-funds) |
| 2026-08-13 and 2026-09-04 | Trezor | Shipping provider ShipMonk was breached. 13,689 customers affected in the first notice, about 67,000 more US customers added on Sep 4 (80,689 total per Trezor). Names, emails, phone numbers and addresses exposed. Devices, keys and backups not affected. | [Trezor blog](https://trezor.io/blog/news/recent-customer-data-exposed-in-shipping-provider-incident) |
| 2026-08-17 | BitBox | Dixence update (firmware 9.26.5) fixed two severe firmware flaws found in internal audits; no exploitation reported. The BitBox site returned HTTP 403, so this comes from news reports only (UNVERIFIED against BitBox). | [Cointelegraph](https://cointelegraph.com/news/bitbox-patches-severe-wallet-firmware-flaws) |

No 2026 vulnerability reports for Keystone, OneKey, Tangem, Jade or SafePal turned up in searches run on 2026-10-15; this is an absence of search results, not an audit.

---

## ❓ Why Look Beyond Ledger?

**Ledger Recover (May 2023):** Firmware can extract and transmit seed phrase fragments to third-party custodians. Even if "optional," this capability violates the core principle that **private keys should NEVER leave the device**.

- 🔴 Firmware CAN extract seed — attack surface exists
- 🔴 Requires KYC — links identity to wallet  
- 🔴 2020 data breach exposed 272K users to phishing/physical threats

**If you must use Ledger:** Always enable passphrase (25th word) — Recover cannot extract this.

---

## 🔄 Ledger Migration

| From | To | Why |
|------|-----|-----|
| Nano S/S+ | Trezor Safe 3 | Lower price (~$59 vs ~$69 for the S+), fully open source |
| Nano X | Trezor Safe 5 or Keystone 3 Pro | Better transparency or air-gapped |
| BTC holdings | ColdCard Mk5 or Q | Bitcoin-only focus. Generate the seed on firmware 5.6.0 or later (Q: 1.5.0Q or later) |

**Best practice:** Generate fresh seed on new device, then transfer assets (don't import Ledger seed).

---

## Resources

### Manufactured Wallets
- [Trezor](https://trezor.io/) — [GitHub](https://github.com/trezor)
- [Keystone](https://keyst.one/) — [GitHub](https://github.com/KeystoneHQ)
- [BitBox02](https://bitbox.swiss/) — [GitHub](https://github.com/BitBoxSwiss)
- [Blockstream Jade](https://blockstream.com/jade/) — [GitHub](https://github.com/Blockstream/Jade)
- [ColdCard](https://coldcard.com/) — [GitHub](https://github.com/Coldcard)
- [Foundation Passport](https://foundation.xyz/) — [GitHub](https://github.com/Foundation-Devices)

### DIY Signing Devices
- [SeedSigner](https://seedsigner.com/) — [GitHub](https://github.com/SeedSigner/seedsigner) — Raspberry Pi-based
- [Specter DIY](https://specter.solutions/hardware/) — [GitHub](https://github.com/cryptoadvance/specter-diy) — ESP32-based
- [Krux](https://selfcustody.github.io/krux/) — [GitHub](https://github.com/selfcustody/krux) — M5StickV/similar

### Verification & Research
- [WalletScrutiny](https://walletscrutiny.com/) — Open source verification
- [Bitcoin Wiki - Hardware Wallets](https://en.bitcoin.it/wiki/Hardware_wallet)

---

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a complete history of changes to hardware wallet statuses, recommendations, and documentation structure.

---

*Last updated: October 15, 2026. Always verify current specifications on official sites before purchase.*

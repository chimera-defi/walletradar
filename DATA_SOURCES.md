# Data sources and external links

Wallet Radar links to outside sites. This page says why, how links are tagged, and how we check data.

## Types of external links

### Official product sites

Examples: trezor.io, ledger.com, coldcard.com, keyst.one, bitbox.swiss.

We link them so you can verify features, download from the real source and tell real sites from fakes. We avoid redirect URLs, shortened links, look-alike domains and unofficial mirrors.

### GitHub repositories

Examples: trezor-firmware, ledger-live, rainbow, metamask-extension.

We link them to check open-source claims, track commits and releases, and show community activity (stars, issues, forks). GitHub is the canonical source for open-source code.

### Security audits and certifications

We cite specific published audit reports, not a bare "audited" claim. The link is the evidence, not our opinion.

### Research and reference sites

Examples: Etherscan, WalletBeat, chainlist.org, ethereum.org, walletconnect.com. We use them for independent data checks and standards (EIPs).

#### WalletBeat data attribution

Some wallet rows (added 2026-10-10: Bitget Wallet, Gem Wallet, Mt Pelerin / Bridge Wallet, NuFi, PillarX, Zeus, imKey Pro) use facts from [WalletBeat](https://github.com/walletbeat/walletbeat) `data/` files: account types, platform variants, licence, audits, bug-bounty platform, funding flags and hardware-wallet support. WalletBeat is MIT licensed:

> MIT License
>
> Copyright (c) 2023 Fluidkey
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

Snapshot used: commit `82e3036aba53d8dd13a55f42089ba09c44afa8c5` (2026-10-10). Licence text: https://github.com/walletbeat/walletbeat/blob/82e3036aba53d8dd13a55f42089ba09c44afa8c5/LICENSE. WalletBeat's bundled `data/coinspect/` is CC BY 4.0 and is not used here. Per-wallet source URLs are in the [verification log](https://github.com/chimera-defi/walletradar/blob/main/docs/VERIFICATION.md).

### Social and community

Official accounts, GitHub profiles and forums. We link them as alternative ways to check a project is real.

## Link attribution: utm_source

External links may carry `utm_source=walletradar&utm_medium=comparison`.

- You see `https://trezor.io/`.
- Your browser opens `https://trezor.io/?utm_source=walletradar&utm_medium=comparison`.

Why: the site you visit can see the traffic came from Wallet Radar, and we do not hide that we are the referrer. The parameters are visible in the address bar, collect no personal data, and you can delete them without breaking the page.

If a link ever has a commercial relationship, we disclose it on the page. It never affects method, ranking or inclusion.

## Data accuracy

### How we check

1. **GitHub activity:** repository scripts against the GitHub API. A weekly GitHub Action opens a PR with fresh activity data.
2. **Official sites:** prices, fees, licences and features are checked by hand against the vendor's own pages.
3. **Audits:** taken from published reports.
4. **Feature claims:** cross-checked with official docs.

### How often

- **Comparison tables:** rechecked in reviewed passes. The last full pass was 2026-10-15. Each table shows its own "Last Updated" date.
- **Activity data:** weekly (Action PR, reviewed before merge).
- **Security information:** updated when we learn of it.

What we could not confirm is marked UNVERIFIED in the data. The reasons are in the [verification log](https://github.com/chimera-defi/walletradar/blob/main/docs/VERIFICATION.md).

### Status icons

- ✅ Active or verified
- ⚠️ Verify: needs manual confirmation, or activity is slow
- 🔄 Launching: not released yet
- ❌ Inactive, defunct or not available

Always confirm on the official site before you decide.

## Phishing sites vs. Wallet Radar

| | Wallet Radar | Phishing site |
|---|---|---|
| External links | Official sites | Spoofed domains |
| Link tracking | Visible `utm_source` | Hidden redirects |
| Sources | Cited and checkable | Concealed |
| Disclaimers | Prominent | None |
| Code | Public on GitHub | Hidden |

## Safe link checklist

Before you click any external link:

1. Read the URL in the address bar, not the link text.
2. Check the domain is the official one.
3. Look for HTTPS.
4. Be wary of any URL that does not match its link text.

Warning signs: "click here" links to unrelated sites, requests for passwords or seed phrases, shortened URLs, look-alike domains (`trezor-official.com` instead of `trezor.io`), sites that copy a wallet's setup screen.

Our practice: official domains only, no shortened URLs or redirects, no credential collection, no copies of wallet login or setup pages, open-source code you can audit.

## Sidecar attributes (`data/attributes.json`)

Unscored, per-value-sourced attributes live outside the scored tables, so score columns and `sync_table_scores.js` are untouched. Wallets get `bug_bounty`, `reproducible_build` and `chain_verification`. Cards get `card_network` and `kyc_requirement`. `data/attributes.schema.json` defines each attribute: what it applies to, allowed values (including `unknown`) and the required source fields.

Every value carries `source_url`, `retrieved` and `source_kind`. Unsourced values are left out. Sources:

- WalletBeat data, pinned at the commit above.
- WalletScrutiny verdict string and link only. Its review text has a separate licence, so none is copied.
- Issuer pages, for cards.

Competitor and blog sites are not sources. `tests/attributes.test.ts` validates the data and that every key matches a table row. The site shows these values as badges.

## Questions

Report a problem with a link or a number:

- [GitHub Issues](https://github.com/chimera-defi/walletradar/issues)
- chimera_deFi@protonmail.com

## See also

- [About Wallet Radar](/docs/about)
- [Contributing](/docs/contributing)
- [Security information](/.well-known/security.txt) (RFC 9116)

# Data Sources & External Links

## Transparency About Our External Links

Wallet Radar contains references to external websites. This page explains why we link to these sites, how we attribute this traffic, and how we think about link transparency.

## Types of External Links

### 1. Official Wallet Websites

**Examples:** trezor.io, ledger.com, coldcard.com, keyst.one, bitbox.swiss, etc.

**Why we link:**
- Provide official sources for users to verify features and download wallets
- Link to official GitHub repositories to verify open source status
- Help users distinguish official sites from fakes/scams

**Trust Signal:** All wallet links are to official domains. We explicitly avoid:
- Redirect URLs
- Shortened links
- Phishing-like domain variations
- Unofficial mirrors or forks

### 2. GitHub Repositories

**Examples:** trezor-firmware, ledger-live, rainbow, metamask-extension, etc.

**Why we link:**
- Verify open source claims
- Track development activity (commits, releases)
- Evaluate community engagement (stars, issues, forks)
- Provide source code transparency for security audits

**Trust Signal:** GitHub is the canonical source for open source software. By linking to official repos, we help users verify legitimacy.

### 3. Security Audits & Certifications

**Examples:** Published audit reports, security certifications, Certora reports

**Why we link:**
- Back up security claims with evidence
- Link to third-party verification (not our own claims)
- Help users understand security architecture

**Trust Signal:** We cite specific, published audit reports - not generic "audited" claims.

### 4. Research & Reference Sites

**Examples:** Etherscan, WalletBeat, chainlist.org, ethereum.org, walletconnect.com

**Why we link:**
- Provide independent data verification
- Reference community standards (EIP specifications, etc.)
- Link to other trusted research

**Trust Signal:** All references are to established, well-known sources.

#### WalletBeat data attribution

Some wallet rows (added 2026-10-10: Bitget Wallet, Gem Wallet, Mt Pelerin / Bridge Wallet, NuFi, PillarX, Zeus, imKey Pro) use facts read from [WalletBeat](https://github.com/walletbeat/walletbeat) `data/` files (account types, platform variants, licence, audits, bug-bounty platform, funding strategy flags, hardware-wallet support). WalletBeat is MIT licensed:

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

Snapshot used: commit `82e3036aba53d8dd13a55f42089ba09c44afa8c5` (2026-10-10). Full licence text: https://github.com/walletbeat/walletbeat/blob/82e3036aba53d8dd13a55f42089ba09c44afa8c5/LICENSE. WalletBeat's bundled `data/coinspect/` is CC BY 4.0 and is not used here. Per-wallet source URLs are in VERIFICATION_NOTES.md.

### 5. Social & Community

**Examples:** Twitter/X, GitHub profiles, community forums

**Why we link:**
- Provide alternative contact/verification methods
- Show active community engagement
- Enable users to verify project legitimacy

**Trust Signal:** Official accounts verified through badges and consistency.

---

## Link Attribution: utm_source Parameter

External links from Wallet Radar may include the `utm_source=walletradar` query parameter for transparent attribution.

### What This Means

When you click an attributed external link, your browser adds: `?utm_source=walletradar&utm_medium=comparison`

Example:
- **You see:** `https://trezor.io/`
- **Your browser navigates to:** `https://trezor.io/?utm_source=walletradar&utm_medium=comparison`

### Why We Do This

1. **Transparency** - Websites we link to can see traffic originated from Wallet Radar
2. **Attribution** - We identify ourselves as the source, not hiding it
3. **Analytics** - Helps sites understand which research platforms drive traffic
4. **Respect** - Similar to how ChatGPT and other platforms identify their traffic

If a link ever carries a commercial relationship, it should be disclosed clearly on-page and should not affect methodology, ranking, or inclusion decisions.

### Privacy Consideration

- utm parameters are **publicly visible** in your browser URL
- They don't collect personal data about you
- They simply identify the source website (walletradar.org)
- You can remove them manually without affecting functionality

---

## Data Accuracy & Verification

### How We Verify Information

1. **GitHub Activity** - Checked with repository scripts against the GitHub API
2. **Official Websites** - Manual verification on official domains
3. **Security Audits** - Retrieved from published audit reports
4. **Feature Claims** - Cross-referenced with official documentation
5. **Community Input** - Verified through multiple sources

### Update Frequency

- **Comparison tables:** Updated during reviewed data-refresh passes
- **Detailed reviews:** Updated monthly
- **Security information:** Updated immediately when discovered

### Data Limitations

We mark items with status icons:
- ✅ **Active/Verified** - Recently verified as working
- ⚠️ **Verify** - Needs manual confirmation (website unclear/changing)
- 🔄 **Launching** - In development, not yet released
- ❌ **Defunct** - No longer available or maintained

**Important:** Always verify current information on official websites before making decisions.

---

## How This Builds Trust

By being transparent about our external linking:

1. **We're not hiding anything** - This is the opposite of phishing
2. **We identify ourselves** - utm_source shows we're proud to be the referrer
3. **We link to official sources** - Not redirects or intermediaries
4. **We cite our data** - You can verify everything independently
5. **We acknowledge limitations** - Status indicators show verification gaps

### Phishing vs. Legitimate Sites

| Characteristic | Wallet Radar | Phishing Site |
|---|---|---|
| **External links** | Official sites only | Fake/spoofed domains |
| **Link tracking** | Transparent (utm_source) | Hidden redirects |
| **Source disclosure** | Open, visible, documented | Concealed |
| **Data sources** | Cited and verifiable | Unverified claims |
| **Disclaimers** | Multiple, prominent | None |
| **Code transparency** | GitHub visible | Proprietary/hidden |

---

## Security Considerations

### Safe Link Clicking

Before clicking any external link:

1. ✅ Check the URL in your browser's address bar (not just the link text)
2. ✅ Verify the domain matches the expected official domain
3. ✅ Look for HTTPS and a security lock icon
4. ✅ Be wary of URLs that don't match their link text

### Common Phishing Tactics (Avoid)

❌ Links that say "click here" but go to unrelated sites
❌ Links asking you to enter passwords or private keys
❌ Shortened URLs hiding the real destination
❌ Brand-spoofing domains (e.g., "trezor-official.com" instead of "trezor.io")
❌ Sites that look like official wallets but ask for seed phrases

### Our Practice

✅ All links go to official domains we've verified
✅ No shortened URLs or redirects
✅ No credential collection anywhere on our site
✅ No mimicry of wallet login/setup pages
✅ Open source code you can audit

---

## Questions?

If you have concerns about any links or data on Wallet Radar:

1. **Report an issue:** [GitHub Issues](https://github.com/chimera-defi/walletradar/issues)
2. **Email us:** chimera_deFi@protonmail.com
3. **Check our source:** [GitHub Repository](https://github.com/chimera-defi/walletradar)

#### Sidecar attributes (`data/attributes.json`)

Unscored, per-value-sourced attributes live outside the scored tables so the score columns and `sync_table_scores.js` are untouched: wallets get `bug_bounty`, `reproducible_build`, `chain_verification`; cards get `card_network`, `kyc_requirement`. `data/attributes.schema.json` defines each attribute (applies-to, allowed values including `unknown`, required source fields). Every value carries `source_url`, `retrieved` and `source_kind`; unsourced values are omitted. Sources: WalletBeat data pinned at the commit above (MIT attribution already given), WalletScrutiny verdict string and link only (its per-review text has a separate licence, so no review text is copied), and issuer pages for cards. Competitor and blog sites are not sources. `tests/attributes.test.ts` validates the data and that every key matches a table row. Not yet rendered on the site.

---

## See Also

- [About Wallet Radar](/docs/about) - Our mission and independence
- [Contributing](/docs/contributing) - How to suggest corrections
- [Security Information](/.well-known/security.txt) - IETF RFC 9116 compliance

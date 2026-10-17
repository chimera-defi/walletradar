# Merchant Center Feed (Hardware Wallets)

Last updated: 2026-10-17

## Scope

- **Included:** hardware wallets with verified USD pricing.
- **Excluded:** software wallets, ramps, and most cards (free or fee-based; not suitable for Merchant Center pricing).
- **Currency:** USD only.

## Pricing sources (USD)

| Item | Price (USD) | Source |
| --- | --- | --- |
| Ledger Nano X | 99 | https://shop.ledger.com/products/ledger-nano-x |
| Ledger Nano S+ | 69 | https://shop.ledger.com/products/ledger-nano-s-plus |
| Ledger Nano Gen5 | 179 | https://shop.ledger.com/products/ledger-nano-gen5 |
| Ledger Flex | 249 | https://shop.ledger.com/products/ledger-flex |
| Trezor Safe 3 | 59 | https://trezor.io/trezor-safe-3 |
| OneKey Pro | 278 | https://onekey.so/products/onekey-pro-hardware-wallet/ |
| OneKey Classic 1S | 99 | https://onekey.so/products/onekey-classic-1s-hardware-wallet/ |
| OneKey Classic 1S Pure | 79 | https://onekey.so/products/onekey-classic-1s-hardware-wallet/#pure |
| Blockstream Jade | 67 | https://store.blockstream.com/product/blockstream-jade/ |

## Price checks on 2026-10-15

- Re-fetched and unchanged: Ledger Flex 249 (shop.ledger.com via r.jina.ai), Trezor Safe 3 59, OneKey Classic 1S 99, OneKey Classic 1S Pure 79, OneKey Pro 278.

## Price checks on 2026-10-16

- Re-fetched with curl (page JSON-LD offers): Ledger Nano X 99 USD (in stock), Ledger Nano Gen5 179 USD (in stock), Ledger Flex 249 USD (in stock).
- Ledger Nano S+: 69 USD in stock (previous 59 was a single out-of-stock variant offer). Feed now 69.
- Blockstream Jade: 67 USD on the store page (previous 79 was the list price before the sale). Three colour variants in stock, two sold out, so the product is listed as in stock.
- Bitkey: bitkey.world shows EUR 230 only; no USD price confirmed. Moved to the excluded list (feed is USD only). The old product URL returned 404.
- Not re-fetched this run: Trezor Safe 3, OneKey (checked 2026-10-15; OneKey Classic 1S 99 and Pure 79 re-seen in page JSON today).
- `availability` is now read from an optional `availability` field in `data/merchant_pricing.json` (in stock, out of stock, preorder, backorder; default in stock).

## Price checks on 2026-10-17

- Re-fetched from page JSON-LD (all unchanged): Ledger Nano X 99, Nano S+ 69, Nano Gen5 179, Flex 249, Trezor Safe 3 59 (USD), OneKey Pro 278, OneKey Classic 1S 99 and Pure 79, Blockstream Jade 67.
- BitBox02 (EUR 149) and BitBox02 Nova (EUR 175) are priced in euros on shop.bitbox.swiss, so they stay out of the USD feed. Arculus still returns HTTP 403.
- Rows tagged "(partial data)" in the table (imKey Pro, OneKey Pro 2) do not match the feed's name lookup and are not in the feed.

## Excluded from feed (no verified USD price or out of scope)

- Arculus (HTTP 403 and a Cloudflare check on 2026-10-17)
- Bitkey (EUR 230 only on bitkey.world)
- BitBox02 (EUR pricing; feed limited to USD)
- BitBox02 Nova (EUR pricing; feed limited to USD)
- ColdCard Mk4 (replaced by the Mk5 per coldcard.com/mk4; no current price)
- Ellipal Titan 2.0 (no product page found)
- Foundation Passport (no price on marketing page)
- GridPlus Lattice1 (store hostname not resolvable)
- Keystone 3 Pro (no price in page HTML)
- Keycard (EUR pricing; feed limited to USD)
- Keycard Shell (EUR pricing; feed limited to USD)
- Krux (DIY, no fixed retail price)
- Ledger Stax (bundle pricing only; base device price not verified)
- NGRAVE ZERO (no structured price in HTML)
- SafePal S1 (no structured price found)
- SecuX V20 (no structured price found)
- SeedSigner (DIY, no fixed retail price)
- Specter DIY (DIY, no fixed retail price)
- Tangem Wallet (no structured price found)
- Trezor Safe 5 (excluded per feed scope)
- Trezor Safe 7 (excluded per feed scope)

## Maintenance notes

- Update `data/merchant_pricing.json` when vendor pricing changes.
- Regenerate the feed with:
  - `./scripts/generate_merchant_feed.py`
- Public feed output: `frontend/public/merchant-center.xml`.
- No scheduled feed workflow is currently checked into `.github/workflows/`; regenerate and review the feed in the same PR as pricing updates.

## FAQ

**Why are software wallets excluded?**  
They are free to download and not appropriate for Merchant Center product pricing.

**Why are ramps excluded?**  
Ramps are fee-based services (not a fixed-price product).

**Why are some hardware wallets excluded?**  
We only include items with verifiable USD pricing and a direct product page.

**How do I add a new priced item?**  
Add a USD price, source URL, and `last_checked` date (plus `availability` if not in stock) in `data/merchant_pricing.json`, then rerun the feed generator.

## Playwright verification (crypto card checks)

On Ubuntu 25.10, Playwright required the Ubuntu 24.04 `libicu74` package:

```
sudo wget -O /tmp/libicu74_74.2-1ubuntu3_amd64.deb \
  http://archive.ubuntu.com/ubuntu/pool/main/i/icu/libicu74_74.2-1ubuntu3_amd64.deb
sudo dpkg -i /tmp/libicu74_74.2-1ubuntu3_amd64.deb
bunx playwright install-deps
```

Then run:

```
bun scripts/verify-crypto-cards.js > artifacts/crypto_cards_validation.txt
```

Artifacts are gitignored; keep validation output locally.

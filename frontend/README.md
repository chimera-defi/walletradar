# Wallet Comparison Frontend

A developer-focused crypto wallet comparison website generated from Markdown files using Next.js.

## Features

- 📊 **Markdown-to-Website**: Automatically converts Markdown files to beautiful web pages
- 🎨 **Modern UI**: Built with Next.js 16, Tailwind CSS, and Lucide icons
- 📱 **Responsive**: Mobile-first design with desktop optimization
- 🔍 **SEO Optimized**: Proper metadata for all pages
- 📚 **Table of Contents**: Auto-generated navigation for long documents
- 🌓 **Dark Mode Ready**: CSS variables for theming

## Quick Start

```bash
# Install dependencies
bun install

# Set up environment variables (optional; brand profile values only)
cp .env.example .env.local

# Run development server
bun run dev

# Build for production
bun run build

# Optional: export static builds for multiple brand/domain profiles
cp brand-exports.example.json brand-exports.json
bun run export:brands

# Preview the static export after building
bun run start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with nav/footer
│   │   ├── page.tsx         # Home page
│   │   ├── explore/         # Interactive explorer
│   │   ├── docs/[slug]/     # Document pages
│   │   ├── wallets/[type]/[id]/  # Per-product pages
│   │   ├── companies/       # Company pages
│   │   ├── articles/        # Articles
│   │   ├── glossary/        # Glossary
│   │   ├── sitemap.ts, robots.ts, manifest.ts
│   │   ├── not-found.tsx    # 404 page
│   │   └── globals.css      # Global styles + prose styling
│   ├── components/          # Navigation, Footer, EnhancedMarkdownRenderer,
│   │                        # TableOfContents, WalletCard, ...
│   └── lib/
│       ├── markdown.ts      # Markdown document loading
│       ├── wallet-data.ts   # Table parsing for /explore
│       ├── seo.ts           # SEO helpers
│       └── utils.ts         # Utility functions
├── scripts/                 # Build, smoke-test and OG image scripts
├── public/                  # Static assets, OG images
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Content Management

The frontend reads Markdown files from the repository root, `data/tables/` and `docs/site/` (the repo-relative paths below):

| File | Page URL |
|------|----------|
| `README.md` | `/docs/readme` |
| `docs/site/ABOUT.md` | `/docs/about` |
| `data/tables/SOFTWARE_WALLETS.md` | `/docs/software-wallets` |
| `data/tables/SOFTWARE_WALLETS_DETAILS.md` | `/docs/software-wallets/#details` |
| `data/tables/HARDWARE_WALLETS.md` | `/docs/hardware-wallets` |
| `data/tables/HARDWARE_WALLETS_DETAILS.md` | `/docs/hardware-wallets/#details` |
| `data/tables/CRYPTO_CARDS.md` | `/docs/crypto-cards` |
| `data/tables/CRYPTO_CARDS_DETAILS.md` | `/docs/crypto-cards/#details` |
| `data/tables/RAMPS.md` | `/docs/ramps` |
| `data/tables/RAMPS_DETAILS.md` | `/docs/ramps/#details` |
| `data/tables/QR_PAYMENTS.md` | `/docs/qr-payments` |
| `data/tables/QR_PAYMENTS_DETAILS.md` | `/docs/qr-payments/#details` |
| `docs/site/DATA_SOURCES.md` | `/docs/data-sources` |
| `docs/site/GLOSSARY.md` | `/glossary` (not in `DOCUMENT_CONFIG`; see `src/lib/markdown.ts`) |
| `CONTRIBUTING.md` | `/docs/contributing` |
| `CHANGELOG.md` | `/docs/changelog` |

The full list and metadata live in `DOCUMENT_CONFIG` in `src/lib/markdown.ts`. The `*_DETAILS.md` files are mapped by `DETAILS_FILES` in the same file and render inside their category page.

### Wallet data tables (used by `/explore`)

The interactive explorer reads **markdown tables** from `data/tables/` via `src/lib/wallet-data.ts`.

Scores and recommendations are generated from the visible markdown-table columns via `scripts/sync_table_scores.js` (repo root). That same script also refreshes the generated snapshot blocks near the top of the matching `*_DETAILS.md` files.

If you change a table's column order, update the parser, resync the tables and run the tests. The columns are the header row of each file; the score formula is in [CONTRIBUTING.md](../CONTRIBUTING.md), and column meanings are in "Column Definitions" in `SOFTWARE_WALLETS_DETAILS.md` and `HARDWARE_WALLETS_DETAILS.md`, and in the Legend of the cards, ramps and QR tables.

- `data/tables/SOFTWARE_WALLETS.md`
- `data/tables/HARDWARE_WALLETS.md`
- `data/tables/CRYPTO_CARDS.md` (the Card column links to the provider site, `[**Card Name**](url)`)
- `data/tables/RAMPS.md`
- `data/tables/QR_PAYMENTS.md`

`bun run test` runs a lightweight smoke test in `frontend/scripts/smoke-test-wallet-data.js` to catch table header/structure drift.

### Adding New Documents

1. Add a new Markdown file (datasets in `data/tables/`, site pages in `docs/site/`)
2. Update `DOCUMENT_CONFIG` in `src/lib/markdown.ts`:

```typescript
'docs/site/NEW_FILE.md': {  // path relative to the repo root; the slug comes from the basename
  title: 'Page Title',
  description: 'Brief description',
  category: 'comparison' | 'research' | 'guide' | 'other',
  order: 6, // Display order
},
```

3. Rebuild the site

For a new comparison category, follow [CONTRIBUTING.md](../CONTRIBUTING.md) and [docs/ADDING_A_CATEGORY.md](../docs/ADDING_A_CATEGORY.md).

## AWS Amplify Deployment

This project is configured for AWS Amplify deployment. The `amplify.yml` in the repo root handles:

1. Installing dependencies
2. Building the Next.js app
3. Deploying the static output

Security headers for the exported site should be configured at the hosting layer. Next.js runtime headers are not applied to files emitted by static export.

### Manual Deployment

```bash
# Build for production
bun run build

# Static export output is in out/
```

### Multi-Brand Deployment (Static Export)

This app supports build-time branding via environment variables:

- `NEXT_PUBLIC_BRAND_NAME`
- `NEXT_PUBLIC_BRAND_SHORT_NAME`
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_UTM_SOURCE`
- optional link overrides (`NEXT_PUBLIC_GITHUB_URL`, etc.)

For multiple domains, use `brand-exports.json` +:

```bash
bun run export:brands
```

Each brand build is exported to `out-brands/<id>/`.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Markdown**: react-markdown + remark-gfm + rehype plugins
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build the static export for production |
| `bun run export:brands` | Build and export one static artifact per brand profile |
| `bun run start` | Preview the static export locally |
| `bun run lint` | Run ESLint |
| `bun run type-check` | Run TypeScript checks |
| `bun run test` | Run wallet data smoke tests |
| `bun run generate-og` | Generate page-specific OG images |
| `bun run generate-image-sizes` | Write `src/lib/article-image-sizes.json` from the PNGs in `public/articles/` |
| `bun run check-links` | Check internal links, assets and anchors in the static export (`out/`) |

## Customization

### Colors

Edit CSS variables in `src/app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --background: 0 0% 100%;
  /* ... */
}
```

### Typography

Markdown styling is in `src/app/globals.css` under `.prose-wallet` classes.

### Navigation

Update `navItems` in `src/components/Navigation.tsx` to change the header menu.

## Analytics & Privacy

### Google Analytics 4

Google Analytics 4 (GA4) is integrated with lazy-loaded scripts and event tracking:

- **Measurement ID**: `G-L6ZV569CMN`, hardcoded in `layout.tsx` and `lib/analytics.ts` (`NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.example` is not read by the code)
- **Config**: `layout.tsx` — gtag + config with `lazyOnload`; initial page_view + `referral_detected` event
- **Route tracking**: `GoogleAnalytics.tsx` — page_view on client-side navigation (SPA)
- **Events**: `lib/analytics.ts` — search, outbound link clicks, share, copy_link

**Tracked events:**
| Event | Trigger | Params |
|-------|---------|--------|
| page_view | Initial load (config) + route change | page_path |
| referral_detected | Initial load | referrer_host, traffic_source, is_ai_referrer |
| search | User selects search result | search_term |
| click (outbound) | External link click | link_url, event_label |
| share | Social share button | method, content_type |
| copy_link | Copy link button | link_url |

## SEO Features

### Implemented SEO

| Feature | Status | Notes |
|---------|--------|-------|
| Meta tags | ✅ | Title, description, keywords |
| Open Graph | ✅ | Full OG tags for social sharing |
| Twitter Cards | ✅ | Summary large image cards |
| Structured Data | ✅ | Organization, WebSite, FAQPage, Article, BreadcrumbList, HowTo, ItemList |
| Sitemap | ✅ | Dynamic generation via `sitemap.ts` |
| robots.txt | ✅ | Proper crawl directives |
| Canonical URLs | ✅ | Trailing slashes enabled |
| Dynamic Keywords | ✅ | Content-based keyword generation |
| Reading Time | ✅ | Calculated from content |
| DNS prefetch hints | ✅ | Google Analytics domains |
| Lazy Loading | ✅ | Images in markdown content |
| Search/Filter | ✅ | Client-side doc filtering |

### SEO Utilities

The `src/lib/seo.ts` file provides utilities:

The exports are in `src/lib/seo.ts`. The main ones:

```typescript
// Get page-specific OG image path
getOgImagePath(slug: string): string

// Get social sharing URLs for all platforms
getSocialShareUrls(pageUrl: string, title: string, description?: string): {...}

// Calculate reading time
calculateReadingTime(content: string): number

// Format reading time for display
formatReadingTime(minutes: number): string

// Optimize meta descriptions (160 chars by default)
optimizeMetaDescription(text: string, maxLength?: number): string

// Generate dynamic keywords
generateKeywords(title: string, category: string, content: string): string[]
```

Structured-data helpers (`generateBreadcrumbSchema`, `generateFAQSchema`, `generateHowToSchema`, `generateWalletProductSchema`) and `generateWalletKeywords` are in the same file.

## Social Sharing & Ads

### OG Images

Pages share one OG image: `/og-image.svg`. Articles are the exception; each has its own image under `/og/articles/`. `getOgImagePath` in `src/lib/seo.ts` holds the map.

`bun run generate-og` writes these PNGs to `public/`. Only the article PNG is page metadata. The root README embeds three (`og-image.png`, `og-software-wallets-table.png`, `og-explore.png`), and CI (`.github/workflows/frontend-ci.yml`) fails if a PNG on its list is missing (the QR table PNG is not on it):

| Image | File |
|------|----------|
| Software Wallets (table) | `/og-software-wallets-table.png` |
| Hardware Wallets (table) | `/og-hardware-wallets-table.png` |
| Crypto Cards (table) | `/og-crypto-cards-table.png` |
| Ramps (table) | `/og-ramps-table.png` |
| QR Payments (table) | `/og-qr-payments-table.png` |
| Explore | `/og-explore.png` |
| Default | `/og-image.png` |
| Article: How Wallet Radar works | `/og/articles/how-wallet-radar-works.png` |

Run it after changing table data or adding a category, and commit the PNGs it changes. To give a page its own OG image, add it to `getOgImagePath`.

### Social Sharing Component

The `<SocialShare>` component is included on all document pages with:
- Twitter/X share button
- Facebook share button
- LinkedIn share button
- Email share button
- Copy link button

### Twitter Card Validation

After building, test with the official validators:
- Twitter: https://cards-dev.twitter.com/validator
- Facebook: https://developers.facebook.com/tools/debug/
- LinkedIn: https://www.linkedin.com/post-inspector/

### Creating Twitter/X Ads with Rich Previews

The generated table PNGs show the data tables and can be used as ad creatives. Shared page links show `og-image.svg`.

#### Generate OG Images

```bash
# Regenerate all OG images
bun run generate-og

# Force regenerate the default image too
bun run generate-og -- --force
```

#### Validate Before Posting

Test with the official validators:
- **Twitter**: https://cards-dev.twitter.com/validator
- **Facebook**: https://developers.facebook.com/tools/debug/
- **LinkedIn**: https://www.linkedin.com/post-inspector/

#### UTM Parameters for Campaign Tracking

Add the parameters manually (the build-time default `utm_source` comes from `NEXT_PUBLIC_UTM_SOURCE` in `src/lib/brand.ts`):

```
https://walletradar.org/docs/software-wallets/?utm_source=twitter&utm_medium=social&utm_campaign=software_dec2025
```

---

## Future SEO Enhancements

For server deployments (non-static export), you can enable:

1. **Dynamic OG Images**: Use `@vercel/og` in an API route
2. **Server-Side Search**: Add a real search endpoint for SearchAction schema
3. **Incremental Static Regeneration**: For more frequent content updates

## License

MIT

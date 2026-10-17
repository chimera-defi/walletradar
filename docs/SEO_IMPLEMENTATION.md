# SEO, AEO and GEO notes

How walletradar.org is set up for search engines and for LLM citation. Covers only what exists in the repo today. The code is the source of truth; this file tells you where to look.

## Where things live

| Job | File |
|---|---|
| Schema generators (breadcrumb, FAQ, HowTo, wallet product), meta description and keyword helpers | `frontend/src/lib/seo.ts` |
| Organization and WebSite JSON-LD, theme script, GA | `frontend/src/app/layout.tsx` |
| Homepage FAQPage JSON-LD | `frontend/src/app/page.tsx` |
| Doc pages: breadcrumb, Article, FAQ and Speakable JSON-LD | `frontend/src/app/docs/[slug]/page.tsx` |
| Wallet profile pages: breadcrumb and Product/SoftwareApplication JSON-LD | `frontend/src/app/wallets/[type]/[id]/page.tsx` |
| Article pages: breadcrumb, Article, FAQ, HowTo JSON-LD | `frontend/src/app/articles/[slug]/page.tsx`, `frontend/src/lib/articles.ts` |
| Sitemap (docs, wallets, articles) and robots | `frontend/src/app/sitemap.ts`, `robots.ts`, `public/robots.txt` |
| LLM discovery file | `frontend/public/llms.txt` |
| OG images (1200x630) | `frontend/scripts/generate-og-images.js`, PNGs in `frontend/public/` |
| Multi-brand profiles | `frontend/src/lib/brand.ts`, `frontend/scripts/export-brands.js` |
| Security headers (static export) | `customHttp.yml` |

## Rules for content changes

1. Put the answer first, then the detail. Use the words people search for.
2. Every comparison page keeps its FAQ section. Questions become FAQPage JSON-LD through `extractFAQsFromMarkdown`.
3. Scores quoted in prose must match the table. Run `bun scripts/sync_table_scores.js` (no `--write`; it reports drift) after any score edit, then `rg` the old number in `articles/` and the FAQs.
4. Do not duplicate a schema type on one page. Validate new schema on one page first.
5. Link to official sites. No affiliate links. If a link ever has a commercial relationship, label it ([DATA_SOURCES.md](site/DATA_SOURCES.md)).
6. A new page needs an OG image generator entry and a committed PNG ([AGENTS.md](../AGENTS.md)).

## Articles

Markdown files in `articles/` with this frontmatter: `title`, `description`, `category`, `lastUpdated`, `author`, `wallets` (list), `tags` (list). `articles.ts` reads them, `getRelatedArticles` matches on wallets and tags, and the sitemap lists them. Update `lastUpdated` whenever a number in the article changes.

## Merchant Center feed and speakable summary

- `scripts/generate_merchant_feed.py` writes `frontend/public/merchant-center.xml` from the hardware wallet table. Pricing sources and exclusions: [MERCHANT_FEED.md](MERCHANT_FEED.md). A weekly workflow (`.github/workflows/generate-merchant-feed.yml`) regenerates it.
- The homepage has a short `.speakable-summary` block. Homepage and doc pages emit Speakable JSON-LD pointing at it, so voice assistants read a summary instead of a table.

## Test it

```bash
cd frontend
bun run test                              # data smoke test
```

- Paste a built page into https://search.google.com/test/rich-results or https://validator.schema.org/ to check JSON-LD.
- Compare size: fetch a doc page as HTML and as plain text (`curl`, then `lynx -dump -nolist`); the text should be far smaller.

## LLM citation tracking

Weekly, ask ChatGPT, Perplexity, Copilot and Gemini a fixed set of queries ("best crypto wallet for developers", "Rabby vs MetaMask", "most secure hardware wallet", "best non-custodial crypto card") and record whether walletradar.org is cited. Template and archive: `docs/archive/llm-citations/README.md`.

## Not done

- Real-time chain and price integrations beyond DefiLlama chains (`lib/defillama.ts`).
- Third-party expert reviews or audit embeds.
- Citation-rate targets. The tracking folder has one archived run (2026-02-03).

# Adding a New Comparison Category

When adding a completely new comparison category (e.g., ramps, exchanges, etc.), follow this checklist:

### 1. Markdown Files
- [ ] Create `CATEGORY.md` (table view)
- [ ] Create `CATEGORY_DETAILS.md` (details view)
- [ ] Follow existing table structure patterns
- [ ] Include clickable website links: `[**Name**](url)` format
- [ ] Mark uncertain values with `~` prefix
- [ ] Add data accuracy disclaimer

### 2. Type Definitions (`frontend/src/types/wallets.ts`)
- [ ] Create interface with all required fields
- [ ] Include `url: string | null` field for website links
- [ ] Add `type: 'category'` field
- [ ] Add to `WalletData` union type

### 3. Data Parsing (`frontend/src/lib/wallet-data.ts`)
- [ ] Create parsing function
- [ ] Extract name and URL from markdown links
- [ ] Handle all table columns
- [ ] Add to `getAllWalletData()`
- [ ] Export parsing function

### 4. Filtering (`frontend/src/lib/wallet-filtering.ts`)
- [ ] Create filtering function (don't use placeholder)
- [ ] Map status types correctly if different
- [ ] Implement search, score, recommendation filters
- [ ] Export filtering function
- [ ] Add to `wallet-data.ts` exports

### 5. Components
- [ ] **WalletTable.tsx:** Add item component for table/grid views
- [ ] **ComparisonTool.tsx:** Add comparison component
- [ ] **WalletFilters.tsx:** Add filter options if needed
- [ ] **ExploreContent.tsx:** Add tab, state, filtering

### 6. Pages
- [ ] **explore/page.tsx:** Parse and pass data
- [ ] **docs/[slug]/page.tsx:** Add to `isTablePage` check
- [ ] **sitemap.ts:** Add to `isComparisonTable` check

### 7. Navigation (Rule #127)
- [ ] **Navigation.tsx:** Add to burger menu
- [ ] **Footer.tsx:** Add to Comparisons section
- [ ] **InternalLinks.tsx:** Add card to FeaturedCategoryLinks
- [ ] **page.tsx:** Add to hero section, stats section, Top Developer Picks

### 8. SEO (Rule #128)
- [ ] **seo.ts:** Add OG image mappings
- [ ] **seo.ts:** Add keyword detection
- [ ] **docs/[slug]/page.tsx:** Update ItemList schema for new type
- [ ] **generate-og-images.js:** Add generator functions
- [ ] **CI workflow:** Add image check
- [ ] Run `bun run generate-og` and commit PNGs

### 9. Markdown Config (`frontend/src/lib/markdown.ts`)
- [ ] Add files to `DOCUMENT_CONFIG`
- [ ] Add to `relatedMap` for table/details navigation

### 10. Documentation
- [ ] Update `README.md` to include new category
- [ ] Update `CONTRIBUTING.md` with category-specific guidelines
- [ ] Add to changelog

### 11. Verification
- [ ] `bun run type-check` passes
- [ ] `bun run lint` passes
- [ ] `bun run build` passes
- [ ] OG images generated and committed
- [ ] All navigation locations updated
- [ ] Social sharing works
- [ ] Structured data includes new type

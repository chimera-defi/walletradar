import { getSearchData } from '@/lib/search-data.server';

// Emitted as out/search-index.json at build time. SiteSearch fetches it on first open,
// so the index is not embedded in every page's HTML.
export const dynamic = 'force-static';

export function GET() {
  return Response.json(getSearchData());
}

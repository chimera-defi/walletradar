export type SearchResultType = 'wallet' | 'doc' | 'article' | 'faq';

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  content: string; // Full searchable text
  type: SearchResultType;
  category?: string;
  url: string;
  score?: number; // Wallet score if applicable
  tags?: string[];
}

/**
 * Search function with relevance ranking
 */
export function searchItems(items: SearchItem[], query: string): SearchItem[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/);

  // Score each item
  const scored = items.map((item) => {
    let relevance = 0;

    // Exact title match (highest priority)
    if (item.title.toLowerCase() === normalizedQuery) {
      relevance += 100;
    }
    // Title starts with query
    else if (item.title.toLowerCase().startsWith(normalizedQuery)) {
      relevance += 50;
    }
    // Title contains query
    else if (item.title.toLowerCase().includes(normalizedQuery)) {
      relevance += 30;
    }

    // Word-by-word matching
    queryWords.forEach((word) => {
      if (word.length < 2) return;

      // Title word match
      if (item.title.toLowerCase().includes(word)) {
        relevance += 20;
      }
      // Description match
      if (item.description.toLowerCase().includes(word)) {
        relevance += 10;
      }
      // Content match
      if (item.content.includes(word)) {
        relevance += 5;
      }
      // Tag match
      if (item.tags?.some((tag) => tag.toLowerCase().includes(word))) {
        relevance += 8;
      }
    });

    // Boost based on item type priority
    if (item.type === 'wallet') relevance += 5;
    if (item.type === 'doc') relevance += 3;

    // Boost based on wallet score
    if (item.score && item.score > 80) relevance += 3;

    return { item, relevance };
  });

  // Filter and sort by relevance
  return scored
    .filter((s) => s.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 20)
    .map((s) => s.item);
}

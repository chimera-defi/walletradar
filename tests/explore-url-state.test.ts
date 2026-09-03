/**
 * Tests for explore-url-state.ts pure URL-state utilities.
 * Run with: bun run test:utils tests/explore-url-state.test.ts
 */
import { describe, expect, it, vi } from 'vitest';

// vi.mock is hoisted — all values must be inline in the factory to avoid TDZ.
// This stubs WalletFilters.tsx (a JSX file) so Vitest doesn't need JSX support.
vi.mock('@/components/WalletFilters', () => ({
  initialFilterState: {
    search: '',
    minScore: 0,
    maxScore: 100,
    recommendation: [],
    platforms: [],
    license: [],
    features: [],
    accountTypes: [],
    active: [],
    funding: [],
    airGap: null,
    secureElement: null,
    openSource: [],
    priceMin: 0,
    priceMax: 500,
    connectivity: [],
    cardType: [],
    custody: [],
    cardStatus: [],
    region: [],
    businessSupport: null,
    noAnnualFee: null,
    cashBackMin: 0,
  },
}));

const initialFilterState = {
  search: '',
  minScore: 0,
  maxScore: 100,
  recommendation: [] as string[],
  platforms: [] as string[],
  license: [] as string[],
  features: [] as string[],
  accountTypes: [] as string[],
  active: [] as string[],
  funding: [] as string[],
  airGap: null as boolean | null,
  secureElement: null as boolean | null,
  openSource: [] as string[],
  priceMin: 0,
  priceMax: 500,
  connectivity: [] as string[],
  cardType: [] as string[],
  custody: [] as string[],
  cardStatus: [] as string[],
  region: [] as string[],
  businessSupport: null as boolean | null,
  noAnnualFee: null as boolean | null,
  cashBackMin: 0,
};

import {
  parseSortState,
  serializeSortState,
  parseSearchParam,
  parseFilterState,
  serializeFilterState,
  normalizeFilterState,
  clearControlledQueryParams,
  type ExploreTab,
} from '../frontend/src/lib/explore-url-state';

// ── fixtures ─────────────────────────────────────────────────────────────────

type FilterState = typeof initialFilterState;
type SortState = { field: string; direction: 'asc' | 'desc' };

const DEFAULT_FILTER: FilterState = { ...initialFilterState };

// ── parseSortState ───────────────────────────────────────────────────────────

describe('parseSortState', () => {
  it('returns default sort for null value', () => {
    expect(parseSortState(null, 'software')).toEqual({ field: 'score', direction: 'desc' });
  });

  it('returns default sort for empty string', () => {
    expect(parseSortState('', 'software')).toEqual({ field: 'score', direction: 'desc' });
  });

  it('returns default sort for unknown field', () => {
    expect(parseSortState('unknownField:asc', 'software')).toEqual({ field: 'score', direction: 'desc' });
  });

  it('returns default sort for invalid direction', () => {
    expect(parseSortState('score:sideways', 'software')).toEqual({ field: 'score', direction: 'desc' });
  });

  it('returns default sort for field not valid on this tab', () => {
    // price is a hardware field, not a software field
    expect(parseSortState('price:asc', 'software')).toEqual({ field: 'score', direction: 'desc' });
  });

  it('parses name:asc on software tab', () => {
    expect(parseSortState('name:asc', 'software')).toEqual({ field: 'name', direction: 'asc' });
  });

  it('parses price:asc on hardware tab', () => {
    expect(parseSortState('price:asc', 'hardware')).toEqual({ field: 'price', direction: 'asc' });
  });

  it('parses cashBackMax:desc on cards tab', () => {
    expect(parseSortState('cashBackMax:desc', 'cards')).toEqual({ field: 'cashBackMax', direction: 'desc' });
  });

  it('rejects chains:asc on ramps tab', () => {
    expect(parseSortState('chains:asc', 'ramps')).toEqual({ field: 'score', direction: 'desc' });
  });

  it('parses name:desc on ramps tab', () => {
    expect(parseSortState('name:desc', 'ramps')).toEqual({ field: 'name', direction: 'desc' });
  });
});

// ── serializeSortState ───────────────────────────────────────────────────────

describe('serializeSortState', () => {
  it('returns null when sort equals the tab default', () => {
    const sort: SortState = { field: 'score', direction: 'desc' };
    expect(serializeSortState(sort, 'software')).toBeNull();
  });

  it('returns field:direction string for non-default sort', () => {
    const sort: SortState = { field: 'name', direction: 'asc' };
    expect(serializeSortState(sort, 'software')).toBe('name:asc');
  });

  it('normalises invalid sort to default and returns null', () => {
    const sort: SortState = { field: 'badField', direction: 'desc' };
    expect(serializeSortState(sort, 'software')).toBeNull();
  });

  it('returns string for valid non-default hardware sort', () => {
    const sort: SortState = { field: 'price', direction: 'asc' };
    expect(serializeSortState(sort, 'hardware')).toBe('price:asc');
  });
});

// ── parseSearchParam ─────────────────────────────────────────────────────────

describe('parseSearchParam', () => {
  it('returns empty string for null', () => {
    expect(parseSearchParam(null)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(parseSearchParam('')).toBe('');
  });

  it('trims leading and trailing whitespace', () => {
    expect(parseSearchParam('  metamask  ')).toBe('metamask');
  });

  it('truncates to 120 characters', () => {
    const long = 'a'.repeat(200);
    expect(parseSearchParam(long)).toHaveLength(120);
  });

  it('passes through short values unchanged', () => {
    expect(parseSearchParam('ledger')).toBe('ledger');
  });
});

// ── normalizeFilterState ─────────────────────────────────────────────────────

describe('normalizeFilterState', () => {
  it('returns default state unchanged', () => {
    expect(normalizeFilterState(DEFAULT_FILTER)).toEqual(DEFAULT_FILTER);
  });

  it('clamps minScore below 0 to 0', () => {
    expect(normalizeFilterState({ ...DEFAULT_FILTER, minScore: -10 }).minScore).toBe(0);
  });

  it('clamps minScore above 100 to 100', () => {
    expect(normalizeFilterState({ ...DEFAULT_FILTER, minScore: 150, maxScore: 200 }).minScore).toBe(100);
  });

  it('ensures maxScore >= minScore when maxScore < minScore', () => {
    const result = normalizeFilterState({ ...DEFAULT_FILTER, minScore: 80, maxScore: 50 });
    expect(result.maxScore).toBeGreaterThanOrEqual(result.minScore);
  });

  it('rounds fractional minScore', () => {
    expect(normalizeFilterState({ ...DEFAULT_FILTER, minScore: 49.7 }).minScore).toBe(50);
  });

  it('trims search string', () => {
    expect(normalizeFilterState({ ...DEFAULT_FILTER, search: '  ledger  ' }).search).toBe('ledger');
  });

  it('caps search at 120 characters', () => {
    const long = 'x'.repeat(200);
    expect(normalizeFilterState({ ...DEFAULT_FILTER, search: long }).search).toHaveLength(120);
  });

  it('filters recommendation values not in allowlist', () => {
    const filters = { ...DEFAULT_FILTER, recommendation: ['recommended', 'bogus', 'avoid'] };
    expect(normalizeFilterState(filters).recommendation).toEqual(['recommended', 'avoid']);
  });

  it('deduplicates array entries', () => {
    const filters = { ...DEFAULT_FILTER, platforms: ['mobile', 'mobile', 'browser'] };
    expect(normalizeFilterState(filters).platforms).toEqual(['mobile', 'browser']);
  });

  it('clamps priceMin below 0 to 0', () => {
    expect(normalizeFilterState({ ...DEFAULT_FILTER, priceMin: -50 }).priceMin).toBe(0);
  });

  it('ensures priceMax >= priceMin', () => {
    const result = normalizeFilterState({ ...DEFAULT_FILTER, priceMin: 300, priceMax: 100 });
    expect(result.priceMax).toBeGreaterThanOrEqual(result.priceMin);
  });

  it('clamps cashBackMin to 0..10', () => {
    expect(normalizeFilterState({ ...DEFAULT_FILTER, cashBackMin: -1 }).cashBackMin).toBe(0);
    expect(normalizeFilterState({ ...DEFAULT_FILTER, cashBackMin: 15 }).cashBackMin).toBe(10);
  });
});

// ── parseFilterState ─────────────────────────────────────────────────────────

describe('parseFilterState', () => {
  it('returns null for null input', () => {
    expect(parseFilterState(null)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(parseFilterState('')).toBeNull();
  });

  it('returns null for invalid JSON', () => {
    expect(parseFilterState('{not json')).toBeNull();
  });

  it('returns null for JSON array', () => {
    expect(parseFilterState('[1, 2, 3]')).toBeNull();
  });

  it('returns null for JSON primitive', () => {
    expect(parseFilterState('"hello"')).toBeNull();
  });

  it('returns normalised state for valid JSON with search', () => {
    const result = parseFilterState(JSON.stringify({ search: '  metamask  ' }));
    expect(result).not.toBeNull();
    expect(result!.search).toBe('metamask');
  });

  it('returns normalised state with valid minScore', () => {
    const result = parseFilterState(JSON.stringify({ minScore: 50 }));
    expect(result!.minScore).toBe(50);
  });

  it('ignores unknown keys silently', () => {
    const result = parseFilterState(JSON.stringify({ unknownKey: 'ignored', minScore: 30 }));
    expect(result!.minScore).toBe(30);
  });

  it('filters array values through allowlist', () => {
    const result = parseFilterState(JSON.stringify({ recommendation: ['recommended', 'bogus'] }));
    expect(result!.recommendation).toEqual(['recommended']);
  });

  it('ignores non-numeric value for numeric field', () => {
    const result = parseFilterState(JSON.stringify({ minScore: 'sixty' }));
    expect(result!.minScore).toBe(0); // falls back to default
  });
});

// ── serializeFilterState ─────────────────────────────────────────────────────

describe('serializeFilterState', () => {
  it('returns null for default filter state', () => {
    expect(serializeFilterState(DEFAULT_FILTER)).toBeNull();
  });

  it('returns JSON when search differs from default', () => {
    const result = serializeFilterState({ ...DEFAULT_FILTER, search: 'ledger' });
    expect(result).not.toBeNull();
    expect(JSON.parse(result!).search).toBe('ledger');
  });

  it('includes non-empty array fields', () => {
    const result = serializeFilterState({ ...DEFAULT_FILTER, recommendation: ['recommended'] });
    expect(JSON.parse(result!).recommendation).toEqual(['recommended']);
  });

  it('round-trips through parseFilterState', () => {
    const filters = { ...DEFAULT_FILTER, minScore: 60, recommendation: ['avoid'] };
    const serialized = serializeFilterState(filters);
    const parsed = parseFilterState(serialized);
    expect(parsed!.minScore).toBe(60);
    expect(parsed!.recommendation).toEqual(['avoid']);
  });
});

// ── clearControlledQueryParams ───────────────────────────────────────────────

describe('clearControlledQueryParams', () => {
  it('removes known controlled keys', () => {
    const params = new URLSearchParams('tab=software&sFilters=foo&other=keep');
    clearControlledQueryParams(params);
    expect(params.has('tab')).toBe(false);
    expect(params.has('sFilters')).toBe(false);
    expect(params.get('other')).toBe('keep');
  });

  it('removes all filter and sort param keys', () => {
    const params = new URLSearchParams(
      'sFilters=x&hFilters=y&cFilters=z&rFilters=w&sSort=a&hSort=b&cSort=c&rSort=d',
    );
    clearControlledQueryParams(params);
    expect(params.toString()).toBe('');
  });

  it('leaves unrelated params intact', () => {
    const params = new URLSearchParams('page=1&lang=en');
    clearControlledQueryParams(params);
    expect(params.get('page')).toBe('1');
    expect(params.get('lang')).toBe('en');
  });
});

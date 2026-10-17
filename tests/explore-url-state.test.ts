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
    verification: [],
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
  verification: [] as string[],
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

// ── sort state ───────────────────────────────────────────────────────────────

const DEFAULT_SORT: SortState = { field: 'score', direction: 'desc' };
const tab = (t: string) => t as ExploreTab;

describe('sort state', () => {
  it('parseSortState falls back to the default for null, unknown field, bad direction and a field not valid on the tab', () => {
    for (const value of [null, 'unknownField:asc', 'score:sideways', 'price:asc']) {
      expect(parseSortState(value, tab('software')), String(value)).toEqual(DEFAULT_SORT);
    }
  });

  it('parseSortState accepts per-tab fields', () => {
    expect(parseSortState('name:asc', tab('software'))).toEqual({ field: 'name', direction: 'asc' });
    expect(parseSortState('price:asc', tab('hardware'))).toEqual({ field: 'price', direction: 'asc' });
    expect(parseSortState('cashBackMax:desc', tab('cards'))).toEqual({ field: 'cashBackMax', direction: 'desc' });
  });

  it('serializeSortState returns null for the default or an invalid sort, else field:direction', () => {
    expect(serializeSortState(DEFAULT_SORT, tab('software'))).toBeNull();
    expect(serializeSortState({ field: 'badField', direction: 'desc' }, tab('software'))).toBeNull();
    expect(serializeSortState({ field: 'price', direction: 'asc' }, tab('hardware'))).toBe('price:asc');
  });
});

describe('parseSearchParam', () => {
  it('maps null to empty, trims, and truncates to 120 characters', () => {
    expect(parseSearchParam(null)).toBe('');
    expect(parseSearchParam('  metamask  ')).toBe('metamask');
    expect(parseSearchParam('a'.repeat(200))).toHaveLength(120);
  });
});

// ── normalizeFilterState ─────────────────────────────────────────────────────

describe('normalizeFilterState', () => {
  it('returns default state unchanged', () => {
    expect(normalizeFilterState(DEFAULT_FILTER)).toEqual(DEFAULT_FILTER);
  });

  it('clamps, rounds, trims and caps scalar fields', () => {
    const rows: Array<[Partial<FilterState>, keyof FilterState, unknown]> = [
      [{ minScore: -10 }, 'minScore', 0],
      [{ minScore: 150, maxScore: 200 }, 'minScore', 100],
      [{ minScore: 49.7 }, 'minScore', 50],
      [{ priceMin: -50 }, 'priceMin', 0],
      [{ cashBackMin: -1 }, 'cashBackMin', 0],
      [{ cashBackMin: 15 }, 'cashBackMin', 10],
      [{ search: '  ledger  ' }, 'search', 'ledger'],
      [{ search: 'x'.repeat(200) }, 'search', 'x'.repeat(120)],
    ];
    for (const [patch, key, expected] of rows) {
      expect(normalizeFilterState({ ...DEFAULT_FILTER, ...patch })[key], JSON.stringify(patch).slice(0, 40)).toBe(expected);
    }
  });

  it('keeps max >= min for score and price ranges', () => {
    const score = normalizeFilterState({ ...DEFAULT_FILTER, minScore: 80, maxScore: 50 });
    const price = normalizeFilterState({ ...DEFAULT_FILTER, priceMin: 300, priceMax: 100 });
    expect(score.maxScore).toBeGreaterThanOrEqual(score.minScore);
    expect(price.priceMax).toBeGreaterThanOrEqual(price.priceMin);
  });

  it('filters values outside the allowlist and deduplicates arrays', () => {
    const filters = { ...DEFAULT_FILTER, recommendation: ['recommended', 'bogus', 'avoid'], platforms: ['mobile', 'mobile', 'browser'] };
    const result = normalizeFilterState(filters);
    expect(result.recommendation).toEqual(['recommended', 'avoid']);
    expect(result.platforms).toEqual(['mobile', 'browser']);
  });
});

// ── parseFilterState / serializeFilterState ──────────────────────────────────

describe('parseFilterState', () => {
  it('returns null for null, empty, invalid JSON, arrays and primitives', () => {
    for (const input of [null, '', '{not json', '[1, 2, 3]', '"hello"']) {
      expect(parseFilterState(input), String(input)).toBeNull();
    }
  });

  it('normalises valid JSON, ignores unknown keys and falls back on non-numeric values', () => {
    const result = parseFilterState(
      JSON.stringify({ search: '  metamask  ', unknownKey: 'ignored', minScore: 'sixty', recommendation: ['recommended', 'bogus'] }),
    );
    expect(result!.search).toBe('metamask');
    expect(result!.minScore).toBe(0);
    expect(result!.recommendation).toEqual(['recommended']);
  });
});

describe('serializeFilterState', () => {
  it('returns null for the default filter state', () => {
    expect(serializeFilterState(DEFAULT_FILTER)).toBeNull();
  });

  it('round-trips scalar and array fields through parseFilterState', () => {
    const filters = { ...DEFAULT_FILTER, search: 'ledger', minScore: 60, recommendation: ['avoid'] };
    const parsed = parseFilterState(serializeFilterState(filters));
    expect(parsed!.search).toBe('ledger');
    expect(parsed!.minScore).toBe(60);
    expect(parsed!.recommendation).toEqual(['avoid']);
  });
});

describe('clearControlledQueryParams', () => {
  it('removes every controlled key (tab, filters, sorts, compare) and keeps unrelated params', () => {
    const params = new URLSearchParams(
      'tab=cards&sFilters=x&hFilters=y&cFilters=z&rFilters=w&sSort=a&hSort=b&cSort=c&rSort=d&cd=a,b&compare=1&utm=x',
    );
    clearControlledQueryParams(params);
    expect(params.toString()).toBe('utm=x');
  });
});

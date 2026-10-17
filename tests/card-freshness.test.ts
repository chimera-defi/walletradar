/**
 * Tests for card freshness, multi-region filtering, the discontinued preset and
 * data/card-verification.json coverage. Run with: bunx vitest run tests/card-freshness.test.ts
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { CryptoCard } from '../frontend/src/types/wallets';
import { cardFreshness, STALE_AFTER_DAYS } from '../frontend/src/lib/card-freshness';
import { filterCryptoCards, sortWallets } from '../frontend/src/lib/wallet-filtering';
import { QUICK_PRESETS } from '../frontend/src/lib/explore-presets';

const NOW = new Date('2026-10-17T12:00:00Z');

describe('cardFreshness', () => {
  it('is fresh at the boundary, stale a day later, unknown for bad dates, and never negative for future dates', () => {
    expect(cardFreshness('2026-08-18', NOW)).toEqual({ state: 'fresh', days: STALE_AFTER_DAYS });
    expect(cardFreshness('2026-08-17', NOW).state).toBe('stale');
    for (const v of [null, undefined, '', 'Oct 2026', '2026-13-45', '2026-02-30']) {
      expect(cardFreshness(v as string | null, NOW), String(v)).toEqual({ state: 'unknown', days: null });
    }
    expect(cardFreshness('2026-12-01', NOW).days).toBe(0);
  });
});

const card = (o: Partial<CryptoCard>): CryptoCard => ({
  id: 'c', name: 'C', score: 50, methodologyVersion: 'v', scoreBreakdown: [], cardType: 'debit', custody: 'cefi',
  businessSupport: 'no', region: 'US/EU', regionCode: 'US', regionCodes: ['US', 'EU'], lastVerified: null,
  cashBack: '1%', cashBackMax: 1, annualFee: '$0', fxFee: '0%', rewards: 'x', provider: 'C', providerUrl: null,
  status: 'active', bestFor: '', recommendation: 'situational', type: 'card', ...o,
});

describe('card filters', () => {
  it('matches a US/EU card on either region, and the discontinued preset selects only inactive cards', () => {
    const cards = [card({})];
    expect(filterCryptoCards(cards, { region: ['EU'] })).toHaveLength(1);
    expect(filterCryptoCards(cards, { region: ['US'] })).toHaveLength(1);
    expect(filterCryptoCards(cards, { region: ['UK'] })).toHaveLength(0);
    const preset = QUICK_PRESETS.cards.find(p => p.id === 'discontinued');
    expect(preset?.filters.cardStatus).toEqual(['inactive']);
    const mixed = [card({ id: 'a', status: 'inactive', score: 1 }), card({ id: 'b' })];
    expect(filterCryptoCards(mixed, { cardStatus: ['inactive'] }).map(c => c.id)).toEqual(['a']);
  });
});

describe('freshness filter and sort', () => {
  const recent = new Date().toISOString().slice(0, 10);
  const cards = [
    card({ id: 'new', lastVerified: recent }),
    card({ id: 'old', lastVerified: '2020-01-01' }),
    card({ id: 'none', lastVerified: null }),
  ];
  it('filters by freshness state and sorts oldest first, unverified before dated', () => {
    expect(filterCryptoCards(cards, { verification: ['stale'] }).map(c => c.id)).toEqual(['old']);
    expect(filterCryptoCards(cards, { verification: ['unknown'] }).map(c => c.id)).toEqual(['none']);
    expect(filterCryptoCards(cards, { verification: ['fresh', 'stale'] }).map(c => c.id).sort()).toEqual(['new', 'old']);
    expect(sortWallets(cards, 'lastVerified', 'asc').map(c => c.id)).toEqual(['none', 'old', 'new']);
  });
});

describe('data/card-verification.json', () => {
  const root = join(__dirname, '..');
  const data = JSON.parse(readFileSync(join(root, 'data/card-verification.json'), 'utf8'));
  const names: string[] = [];
  // Only the main comparison table: from the header row to the first non-table line.
  let inTable = false;
  for (const line of readFileSync(join(root, 'CRYPTO_CARDS.md'), 'utf8').split('\n')) {
    if (line.startsWith('| Card |')) inTable = true;
    else if (inTable && !line.startsWith('|')) break;
    if (!inTable) continue;
    const m = /^\|\s*(?:~~)?\[\*\*(.+?)\*\*\]/.exec(line) ?? /^\|\s*\*\*(.+?)\*\*/.exec(line);
    if (m) names.push(m[1]);
  }
  it('has an entry for every card row and no orphans', () => {
    expect(names.length).toBeGreaterThan(40);
    expect(names.filter(n => !(n in data.cards))).toEqual([]);
    expect(Object.keys(data.cards).filter(n => !names.includes(n))).toEqual([]);
  });
  it('uses ISO dates or null, never in the future', () => {
    for (const [name, v] of Object.entries<any>(data.cards)) {
      if (v.last_verified === null) continue;
      expect(v.last_verified, name).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Date.parse(v.last_verified), name).toBeLessThanOrEqual(Date.now() + 86_400_000);
    }
  });
});

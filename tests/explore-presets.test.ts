/**
 * Structural tests for explore-presets.ts.
 * Verifies that QUICK_PRESETS has the expected shape, required fields, and no duplicates.
 */
import { describe, expect, it } from 'vitest';
import { QUICK_PRESETS, type PresetConfig } from '../frontend/src/lib/explore-presets';

const EXPECTED_TABS = ['software', 'hardware', 'cards', 'ramps'] as const;

// Mirrors SORT_FIELDS_BY_TAB in explore-url-state.ts — keeps the test self-contained.
const SORT_FIELDS_BY_TAB: Readonly<Record<string, ReadonlySet<string>>> = {
  software: new Set(['score', 'name', 'chains', 'releasesPerMonth']),
  hardware: new Set(['score', 'name', 'price']),
  cards: new Set(['score', 'name', 'cashBackMax']),
  ramps: new Set(['score', 'name']),
};

describe('QUICK_PRESETS', () => {
  it('every tab has well-formed presets (shape, valid sort/viewMode, sane filter ranges)', () => {
    for (const tab of EXPECTED_TABS) {
      expect(QUICK_PRESETS[tab].length, tab).toBeGreaterThan(0);
      for (const preset of QUICK_PRESETS[tab] as PresetConfig[]) {
        for (const key of ['id', 'label', 'icon', 'description'] as const) {
          expect(typeof preset[key], `${tab}/${preset.id}.${key}`).toBe('string');
          expect(preset[key].length, `${tab}/${preset.id}.${key}`).toBeGreaterThan(0);
        }
        expect(typeof preset.filters).toBe('object');
        if (preset.sort !== undefined) {
          expect(SORT_FIELDS_BY_TAB[tab].has(preset.sort.field), `${tab}/${preset.id} sort`).toBe(true);
          expect(['asc', 'desc']).toContain(preset.sort.direction);
        }
        if (preset.viewMode !== undefined) expect(['grid', 'table']).toContain(preset.viewMode);
        const { minScore, priceMin, priceMax } = preset.filters;
        if (minScore !== undefined) {
          expect(minScore).toBeGreaterThanOrEqual(0);
          expect(minScore).toBeLessThanOrEqual(100);
        }
        if (priceMin !== undefined && priceMax !== undefined) expect(priceMax).toBeGreaterThanOrEqual(priceMin);
      }
    }
  });

  it('preset IDs are unique across all tabs', () => {
    const allIds = EXPECTED_TABS.flatMap((tab) => QUICK_PRESETS[tab].map((p) => p.id));
    expect(new Set(allIds).size).toBe(allIds.length);
  });
});

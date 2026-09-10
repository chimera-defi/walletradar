/**
 * Structural tests for explore-presets.ts.
 * Verifies that QUICK_PRESETS has the expected shape, required fields, and no duplicates.
 */
import { describe, expect, it } from 'vitest';
import { QUICK_PRESETS, type PresetConfig } from '../frontend/src/lib/explore-presets';

const EXPECTED_TABS = ['software', 'hardware', 'cards', 'ramps'] as const;

// ── tab presence ─────────────────────────────────────────────────────────────

describe('QUICK_PRESETS tab presence', () => {
  it('defines exactly the expected tabs', () => {
    const actualTabs = Object.keys(QUICK_PRESETS).sort();
    expect(actualTabs).toEqual([...EXPECTED_TABS].sort());
  });

  it.each(EXPECTED_TABS)('tab "%s" has at least one preset', (tab) => {
    expect(QUICK_PRESETS[tab].length).toBeGreaterThan(0);
  });
});

// ── required fields ───────────────────────────────────────────────────────────

describe('QUICK_PRESETS preset shape', () => {
  it.each(EXPECTED_TABS)('every preset in "%s" has id, label, icon, description, and filters', (tab) => {
    for (const preset of QUICK_PRESETS[tab]) {
      expect(typeof preset.id).toBe('string');
      expect(preset.id.length).toBeGreaterThan(0);

      expect(typeof preset.label).toBe('string');
      expect(preset.label.length).toBeGreaterThan(0);

      expect(typeof preset.icon).toBe('string');
      expect(preset.icon.length).toBeGreaterThan(0);

      expect(typeof preset.description).toBe('string');
      expect(preset.description.length).toBeGreaterThan(0);

      expect(preset.filters).toBeDefined();
      expect(typeof preset.filters).toBe('object');
    }
  });

  it.each(EXPECTED_TABS)('optional sort field in "%s" is valid when present', (tab) => {
    for (const preset of QUICK_PRESETS[tab]) {
      if (preset.sort !== undefined) {
        expect(typeof preset.sort.field).toBe('string');
        expect(['asc', 'desc']).toContain(preset.sort.direction);
      }
    }
  });

  it.each(EXPECTED_TABS)('optional viewMode in "%s" is grid or table when present', (tab) => {
    for (const preset of QUICK_PRESETS[tab]) {
      if (preset.viewMode !== undefined) {
        expect(['grid', 'table']).toContain(preset.viewMode);
      }
    }
  });
});

// ── uniqueness ────────────────────────────────────────────────────────────────

describe('QUICK_PRESETS ID uniqueness', () => {
  it.each(EXPECTED_TABS)('no duplicate preset IDs within "%s"', (tab) => {
    const ids = QUICK_PRESETS[tab].map((p) => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('no duplicate preset IDs across all tabs', () => {
    const allIds = EXPECTED_TABS.flatMap((tab) => QUICK_PRESETS[tab].map((p) => p.id));
    const unique = new Set(allIds);
    expect(unique.size).toBe(allIds.length);
  });
});

// ── filter shape sanity ───────────────────────────────────────────────────────

describe('QUICK_PRESETS filter shape sanity', () => {
  it('minScore filter values are in range 0-100 when present', () => {
    for (const tab of EXPECTED_TABS) {
      for (const preset of QUICK_PRESETS[tab]) {
        if (preset.filters.minScore !== undefined) {
          expect(preset.filters.minScore).toBeGreaterThanOrEqual(0);
          expect(preset.filters.minScore).toBeLessThanOrEqual(100);
        }
      }
    }
  });

  it('priceMax >= priceMin when both are present', () => {
    for (const tab of EXPECTED_TABS) {
      for (const preset of QUICK_PRESETS[tab]) {
        const { priceMin, priceMax } = preset.filters;
        if (priceMin !== undefined && priceMax !== undefined) {
          expect(priceMax).toBeGreaterThanOrEqual(priceMin);
        }
      }
    }
  });
});

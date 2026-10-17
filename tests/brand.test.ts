/**
 * Tests for frontend/src/lib/brand.ts.
 * Run with: bunx vitest run tests/brand.test.ts
 *
 * `brand` is resolved once at module load from process.env.NEXT_PUBLIC_*
 * vars. No such vars are set in this environment, so `brand` deterministically
 * falls back to the default 'walletradar' preset (displayName: 'Wallet Radar')
 * for the whole file — assertions below use that concrete literal.
 */
import { describe, it, expect } from 'vitest';
import {
  brand,
  withBrand,
  aboutBrandLabel,
  appendUtm,
  brandFaqQuestion,
  brandFaqAnswer,
} from '../frontend/src/lib/brand';

describe('brand labels', () => {
  it('resolves the default preset and builds withBrand / aboutBrandLabel from it', () => {
    expect(brand.displayName).toBe('Wallet Radar');
    expect(brand.utmSource).toBe('walletradar');
    expect(withBrand('Best Wallets 2026')).toBe('Best Wallets 2026 | Wallet Radar');
    expect(aboutBrandLabel()).toBe('About Wallet Radar');
  });
});

describe('appendUtm', () => {
  it('adds default utm_source/utm_medium but never overwrites an existing utm_source', () => {
    const added = new URL(appendUtm('https://example.com/page'));
    expect(added.searchParams.get('utm_source')).toBe('walletradar');
    expect(added.searchParams.get('utm_medium')).toBe('comparison');
    const kept = new URL(appendUtm('https://example.com/?utm_source=existing'));
    expect(kept.searchParams.get('utm_source')).toBe('existing');
  });

  it('leaves mailto: and unparseable URLs unchanged', () => {
    expect(appendUtm('mailto:test@example.com')).toBe('mailto:test@example.com');
    expect(appendUtm('not-a-url')).toBe('not-a-url');
  });
});

describe('brandFaqQuestion / brandFaqAnswer', () => {
  it('substitute every "Wallet Radar" occurrence and leave other text unchanged', () => {
    const input = 'Wallet Radar is great. I recommend Wallet Radar to everyone.';
    for (const fn of [brandFaqQuestion, brandFaqAnswer]) {
      expect(fn(input).match(/Wallet Radar/g)?.length).toBe(2);
      expect(fn('Nothing to replace here.')).toBe('Nothing to replace here.');
    }
  });
});

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

// ---------------------------------------------------------------------------
// brand (default preset sanity check)
// ---------------------------------------------------------------------------

describe('brand', () => {
  it('resolves the default walletradar preset when no env vars are set', () => {
    expect(brand.displayName).toBe('Wallet Radar');
    expect(brand.utmSource).toBe('walletradar');
    expect(brand.baseUrl).toBe('https://walletradar.org');
  });
});

// ---------------------------------------------------------------------------
// withBrand
// ---------------------------------------------------------------------------

describe('withBrand', () => {
  it('appends the brand display name with a pipe separator', () => {
    expect(withBrand('Best Wallets 2026')).toBe('Best Wallets 2026 | Wallet Radar');
  });

  it('handles an empty title', () => {
    expect(withBrand('')).toBe(' | Wallet Radar');
  });
});

// ---------------------------------------------------------------------------
// aboutBrandLabel
// ---------------------------------------------------------------------------

describe('aboutBrandLabel', () => {
  it('returns "About <displayName>"', () => {
    expect(aboutBrandLabel()).toBe('About Wallet Radar');
  });
});

// ---------------------------------------------------------------------------
// appendUtm
// ---------------------------------------------------------------------------

describe('appendUtm', () => {
  it('adds utm_source and default utm_medium to a plain URL', () => {
    const result = appendUtm('https://example.com/page');
    const url = new URL(result);
    expect(url.searchParams.get('utm_source')).toBe('walletradar');
    expect(url.searchParams.get('utm_medium')).toBe('comparison');
  });

  it('does not overwrite an existing utm_source', () => {
    const result = appendUtm('https://example.com/?utm_source=existing');
    const url = new URL(result);
    expect(url.searchParams.get('utm_source')).toBe('existing');
  });

  it('does not overwrite an existing utm_medium', () => {
    const result = appendUtm('https://example.com/?utm_medium=email');
    const url = new URL(result);
    expect(url.searchParams.get('utm_medium')).toBe('email');
  });

  it('accepts a custom medium argument', () => {
    const result = appendUtm('https://example.com/', 'referral');
    const url = new URL(result);
    expect(url.searchParams.get('utm_medium')).toBe('referral');
  });

  it('leaves mailto: URLs completely unchanged', () => {
    expect(appendUtm('mailto:test@example.com')).toBe('mailto:test@example.com');
  });

  it('returns the original string unchanged for an invalid URL', () => {
    expect(appendUtm('not-a-url')).toBe('not-a-url');
  });

  it('returns the original string unchanged for an empty string', () => {
    expect(appendUtm('')).toBe('');
  });

  it('preserves other existing query params alongside utm params', () => {
    const result = appendUtm('https://example.com/?foo=bar');
    const url = new URL(result);
    expect(url.searchParams.get('foo')).toBe('bar');
    expect(url.searchParams.get('utm_source')).toBe('walletradar');
  });

  it('preserves the path when appending utm params', () => {
    const result = appendUtm('https://example.com/deep/path');
    expect(result).toContain('/deep/path');
  });
});

// ---------------------------------------------------------------------------
// brandFaqQuestion / brandFaqAnswer
// ---------------------------------------------------------------------------

describe('brandFaqQuestion', () => {
  it('replaces "Wallet Radar" with brand.displayName', () => {
    expect(brandFaqQuestion('Is Wallet Radar free to use?')).toBe(
      'Is Wallet Radar free to use?'
    );
  });

  it('leaves text with no "Wallet Radar" substring unchanged', () => {
    expect(brandFaqQuestion('Is this service free?')).toBe('Is this service free?');
  });

  it('replaces multiple occurrences in one string', () => {
    const input = 'Wallet Radar is great. I recommend Wallet Radar to everyone.';
    const result = brandFaqQuestion(input);
    expect(result.match(/Wallet Radar/g)?.length).toBe(2);
  });
});

describe('brandFaqAnswer', () => {
  it('replaces "Wallet Radar" with brand.displayName', () => {
    expect(brandFaqAnswer('Wallet Radar scores wallets on security and UX.')).toBe(
      'Wallet Radar scores wallets on security and UX.'
    );
  });

  it('leaves text with no "Wallet Radar" substring unchanged', () => {
    expect(brandFaqAnswer('Nothing to replace here.')).toBe('Nothing to replace here.');
  });

  it('replaces multiple occurrences in one string', () => {
    const input = 'Wallet Radar reviews wallets. Wallet Radar is independent.';
    const result = brandFaqAnswer(input);
    expect(result.match(/Wallet Radar/g)?.length).toBe(2);
  });
});

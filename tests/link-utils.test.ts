/**
 * Unit tests for frontend/src/lib/link-utils.ts
 * Pure utility functions — no browser or Next.js environment needed.
 * Run with: bunx vitest run tests/link-utils.test.ts
 */

import { describe, it, expect } from 'vitest';
import { addReferrerTracking, isExternalLink, getExternalLinkTitle } from '../frontend/src/lib/link-utils';

// ---------------------------------------------------------------------------
// addReferrerTracking
// ---------------------------------------------------------------------------

describe('addReferrerTracking', () => {
  it('adds utm_source and utm_medium to a plain https URL', () => {
    const result = addReferrerTracking('https://example.com/page');
    const url = new URL(result);
    expect(url.searchParams.get('utm_source')).toBe('walletradar');
    expect(url.searchParams.get('utm_medium')).toBe('comparison');
  });

  it('preserves existing path and does not duplicate it', () => {
    const result = addReferrerTracking('https://example.com/deep/path');
    expect(result).toContain('/deep/path');
  });

  it('does not overwrite existing utm_source', () => {
    const result = addReferrerTracking('https://example.com/?utm_source=existing');
    const url = new URL(result);
    expect(url.searchParams.get('utm_source')).toBe('existing');
  });

  it('does not overwrite existing utm_medium', () => {
    const result = addReferrerTracking('https://example.com/?utm_medium=email');
    const url = new URL(result);
    expect(url.searchParams.get('utm_medium')).toBe('email');
  });

  it('accepts custom source and medium parameters', () => {
    const result = addReferrerTracking('https://example.com/', 'mysite', 'referral');
    const url = new URL(result);
    expect(url.searchParams.get('utm_source')).toBe('mysite');
    expect(url.searchParams.get('utm_medium')).toBe('referral');
  });

  it('returns original href unchanged for relative paths', () => {
    expect(addReferrerTracking('/relative/path')).toBe('/relative/path');
  });

  it('returns original href unchanged for empty string', () => {
    expect(addReferrerTracking('')).toBe('');
  });

  it('returns original href unchanged for invalid URL', () => {
    expect(addReferrerTracking('not-a-url')).toBe('not-a-url');
  });

  it('preserves existing query params alongside utm params', () => {
    const result = addReferrerTracking('https://example.com/?foo=bar');
    const url = new URL(result);
    expect(url.searchParams.get('foo')).toBe('bar');
    expect(url.searchParams.get('utm_source')).toBe('walletradar');
  });

  it('works with http (non-https) URLs', () => {
    const result = addReferrerTracking('http://example.com/');
    const url = new URL(result);
    expect(url.searchParams.get('utm_source')).toBe('walletradar');
  });
});

// ---------------------------------------------------------------------------
// isExternalLink
// ---------------------------------------------------------------------------

describe('isExternalLink', () => {
  it('returns true for https URLs', () => {
    expect(isExternalLink('https://example.com')).toBe(true);
  });

  it('returns true for http URLs', () => {
    expect(isExternalLink('http://example.com')).toBe(true);
  });

  it('returns false for relative paths', () => {
    expect(isExternalLink('/some/path')).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isExternalLink(undefined)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isExternalLink('')).toBe(false);
  });

  it('returns false for mailto links', () => {
    expect(isExternalLink('mailto:test@example.com')).toBe(false);
  });

  it('returns false for javascript: links', () => {
    expect(isExternalLink('javascript:void(0)')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getExternalLinkTitle
// ---------------------------------------------------------------------------

describe('getExternalLinkTitle', () => {
  it('returns hostname in descriptive title for valid URL', () => {
    const title = getExternalLinkTitle('https://example.com/path');
    expect(title).toContain('example.com');
    expect(title).toContain('Opens external link');
  });

  it('handles subdomain in hostname', () => {
    const title = getExternalLinkTitle('https://docs.example.com/');
    expect(title).toContain('docs.example.com');
  });

  it('returns fallback for invalid URL', () => {
    const title = getExternalLinkTitle('not-a-url');
    expect(title).toBe('Opens external link');
  });

  it('returns fallback for empty string', () => {
    const title = getExternalLinkTitle('');
    expect(title).toBe('Opens external link');
  });

  it('returns a non-empty string for any input', () => {
    for (const href of ['https://x.com', '/rel', '', 'mailto:a@b.com']) {
      expect(typeof getExternalLinkTitle(href)).toBe('string');
      expect(getExternalLinkTitle(href).length).toBeGreaterThan(0);
    }
  });
});

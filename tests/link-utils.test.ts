/**
 * Unit tests for frontend/src/lib/link-utils.ts
 * Pure utility functions — no browser or Next.js environment needed.
 * Run with: bunx vitest run tests/link-utils.test.ts
 */

import { describe, it, expect } from 'vitest';
import { addReferrerTracking, isExternalLink, getExternalLinkTitle } from '../frontend/src/lib/link-utils';

describe('addReferrerTracking', () => {
  it('adds default utm params while preserving path and existing query params', () => {
    const url = new URL(addReferrerTracking('https://example.com/deep/path?foo=bar'));
    expect(url.pathname).toBe('/deep/path');
    expect(url.searchParams.get('foo')).toBe('bar');
    expect(url.searchParams.get('utm_source')).toBe('walletradar');
    expect(url.searchParams.get('utm_medium')).toBe('comparison');
  });

  it('never overwrites an existing utm_source or utm_medium', () => {
    const url = new URL(addReferrerTracking('https://example.com/?utm_source=existing&utm_medium=email'));
    expect(url.searchParams.get('utm_source')).toBe('existing');
    expect(url.searchParams.get('utm_medium')).toBe('email');
  });

  it('accepts custom source and medium', () => {
    const url = new URL(addReferrerTracking('https://example.com/', 'mysite', 'referral'));
    expect(url.searchParams.get('utm_source')).toBe('mysite');
    expect(url.searchParams.get('utm_medium')).toBe('referral');
  });

  it('returns relative paths and unparseable URLs unchanged', () => {
    expect(addReferrerTracking('/relative/path')).toBe('/relative/path');
    expect(addReferrerTracking('not-a-url')).toBe('not-a-url');
  });
});

describe('isExternalLink', () => {
  it('is true for https URLs only, not relative, mailto or javascript links', () => {
    expect(isExternalLink('https://example.com')).toBe(true);
    for (const href of ['/some/path', 'mailto:test@example.com', 'javascript:void(0)']) {
      expect(isExternalLink(href), href).toBe(false);
    }
  });
});

describe('getExternalLinkTitle', () => {
  it('includes the hostname for valid URLs and falls back for invalid ones', () => {
    const title = getExternalLinkTitle('https://example.com/path');
    expect(title).toContain('example.com');
    expect(title).toContain('Opens external link');
    expect(getExternalLinkTitle('not-a-url')).toBe('Opens external link');
  });
});

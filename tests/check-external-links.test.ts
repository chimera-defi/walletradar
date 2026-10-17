/**
 * External link auditor: URL extraction, skip rules and result classes.
 * Runs via: bunx vitest run tests/check-external-links.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { extractUrls, shouldSkip, classify } = require('../scripts/check_external_links.js');

describe('extractUrls', () => {
  it('pulls links from markdown and drops trailing punctuation', () => {
    const md = 'See [Rabby](https://rabby.io/), and https://github.com/a/b. Also <https://x.org/p?q=1>;';
    expect(extractUrls(md)).toEqual(['https://rabby.io/', 'https://github.com/a/b', 'https://x.org/p?q=1']);
  });

  it('deduplicates', () => {
    expect(extractUrls('https://a.io https://a.io')).toEqual(['https://a.io']);
  });
});

describe('shouldSkip', () => {
  it('skips placeholders and local hosts', () => {
    expect(shouldSkip('https://example.com/x')).toBe(true);
    expect(shouldSkip('https://provider.com/')).toBe(true);
    expect(shouldSkip('http://localhost:3000')).toBe(true);
    expect(shouldSkip('https://github.com/org/repo')).toBe(true);
    expect(shouldSkip('https://walletradar.org/x')).toBe(true);
    expect(shouldSkip('https://rabby.io')).toBe(false);
  });
});

describe('classify', () => {
  it('treats 2xx or 3xx on the same host (www ignored) as ok', () => {
    expect(classify('https://a.io/x', 200, 'https://www.a.io/x')).toBe('ok');
  });
  it('treats an unfollowed 304 as ok', () => {
    expect(classify('https://a.io', 304, 'https://a.io')).toBe('ok');
  });
  it('flags a 2xx on a different host as moved', () => {
    expect(classify('https://phantom.app/', 200, 'https://phantom.com/')).toBe('moved');
  });
  it('separates bot blocks from breakage', () => {
    expect(classify('https://a.io', 403, 'https://a.io')).toBe('blocked');
    expect(classify('https://a.io', 429, 'https://a.io')).toBe('blocked');
    expect(classify('https://a.io', 502, 'https://a.io')).toBe('blocked');
    expect(classify('https://a.io', 404, 'https://a.io')).toBe('broken');
    expect(classify('https://a.io', 0, 'https://a.io')).toBe('broken');
  });
});

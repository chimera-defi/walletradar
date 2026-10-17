/**
 * External link auditor: URL extraction, skip rules and result classes.
 * Runs via: bunx vitest run tests/check-external-links.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { extractUrls, shouldSkip, classify } = require('../scripts/check_external_links.js');

describe('extractUrls', () => {
  it('pulls links from markdown, drops trailing punctuation and suffixes, and deduplicates', () => {
    const md = 'See [Rabby](https://rabby.io/), and https://github.com/a/b. Also <https://x.org/p?q=1>; https://rabby.io/';
    expect(extractUrls(md)).toEqual(['https://rabby.io/', 'https://github.com/a/b', 'https://x.org/p?q=1']);
    expect(extractUrls('~~[x](https://a.io/p)~~ [y](https://b.io/q);  [z](https://c.io/r)∆')).toEqual(['https://a.io/p', 'https://b.io/q', 'https://c.io/r']);
  });

  it('keeps balanced parentheses, drops a closing markdown paren, decodes &amp; and strips trailing backslash', () => {
    expect(extractUrls('[x](https://b.io/a%20(Old))')).toEqual(['https://b.io/a%20(Old)']);
    expect(extractUrls('(see https://b.io/p)')).toEqual(['https://b.io/p']);
    expect(extractUrls('https://c.io/x?a=1&amp;b=2 and "https://d.io/y\\"')).toEqual(['https://c.io/x?a=1&b=2', 'https://d.io/y']);
  });
});

describe('shouldSkip', () => {
  it('skips unparseable URLs, placeholders and local hosts, but not real sites', () => {
    for (const url of ['https://', 'https://example.com/x', 'https://provider.com/', 'http://localhost:3000', 'https://github.com/org/repo', 'https://walletradar.org/x']) {
      expect(shouldSkip(url), url).toBe(true);
    }
    expect(shouldSkip('https://rabby.io')).toBe(false);
  });
});

describe('classify', () => {
  it('treats 2xx/3xx on the same host (www ignored), an unfollowed 304 and a same-domain subdomain move as ok', () => {
    expect(classify('https://a.io/x', 200, 'https://www.a.io/x')).toBe('ok');
    expect(classify('https://a.io', 304, 'https://a.io')).toBe('ok');
    expect(classify('https://stripe.com/docs/crypto', 200, 'https://docs.stripe.com/stablecoins')).toBe('ok');
    expect(classify('https://x.co.uk/a', 200, 'https://shop.x.co.uk/a')).toBe('ok');
  });

  it('classes bot blocks (401, 403, 429, 502, 999) as blocked', () => {
    for (const status of [401, 403, 429, 502, 999]) {
      expect(classify('https://a.io', status, 'https://a.io'), String(status)).toBe('blocked');
    }
  });

  it('flags a 2xx on a different host as moved, and 404 or no response as broken', () => {
    expect(classify('https://phantom.app/', 200, 'https://phantom.com/')).toBe('moved');
    expect(classify('https://a.io', 404, 'https://a.io')).toBe('broken');
    expect(classify('https://a.io', 0, 'https://a.io')).toBe('broken');
  });
});

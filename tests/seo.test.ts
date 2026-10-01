/**
 * Tests for frontend/src/lib/seo.ts pure utility functions.
 * Run with: bunx vitest run tests/seo.test.ts
 */
import { describe, it, expect } from 'vitest';
import {
  getOgImagePath,
  getSocialShareUrls,
  calculateReadingTime,
  formatReadingTime,
  optimizeMetaDescription,
  extractFAQsFromMarkdown,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '../frontend/src/lib/seo';

// ---------------------------------------------------------------------------
// getOgImagePath
// ---------------------------------------------------------------------------

describe('getOgImagePath', () => {
  it('returns article-specific path for known article slug', () => {
    expect(getOgImagePath('rabby-vs-metamask')).toBe('/og/articles/rabby-vs-metamask.svg');
    expect(getOgImagePath('trezor-vs-ledger')).toBe('/og/articles/trezor-vs-ledger.svg');
    expect(getOgImagePath('best-ethereum-wallet')).toBe('/og/articles/best-ethereum-wallet.svg');
  });

  it('returns default og-image.svg for comparison page slugs', () => {
    expect(getOgImagePath('software-wallets')).toBe('/og-image.svg');
    expect(getOgImagePath('hardware-wallets')).toBe('/og-image.svg');
    expect(getOgImagePath('ramps')).toBe('/og-image.svg');
  });

  it('falls back to default og-image.svg for unknown slug', () => {
    expect(getOgImagePath('unknown-page')).toBe('/og-image.svg');
    expect(getOgImagePath('')).toBe('/og-image.svg');
  });
});

// ---------------------------------------------------------------------------
// getSocialShareUrls
// ---------------------------------------------------------------------------

describe('getSocialShareUrls', () => {
  it('generates correctly encoded Twitter share URL', () => {
    const urls = getSocialShareUrls('https://walletradar.org/docs/rabby', 'Best Wallet 2025');
    expect(urls.twitter).toContain('twitter.com/intent/tweet');
    expect(urls.twitter).toContain(encodeURIComponent('https://walletradar.org/docs/rabby'));
    expect(urls.twitter).toContain(encodeURIComponent('Best Wallet 2025'));
  });

  it('generates Facebook share URL with encoded page URL', () => {
    const urls = getSocialShareUrls('https://walletradar.org/docs/rabby', 'Test');
    expect(urls.facebook).toContain('facebook.com/sharer/sharer.php');
    expect(urls.facebook).toContain(encodeURIComponent('https://walletradar.org/docs/rabby'));
  });

  it('generates LinkedIn share URL', () => {
    const urls = getSocialShareUrls('https://walletradar.org/docs/rabby', 'Test');
    expect(urls.linkedin).toContain('linkedin.com/sharing/share-offsite');
  });

  it('generates email share URL with subject and body', () => {
    const urls = getSocialShareUrls(
      'https://walletradar.org/docs/rabby',
      'Best Wallet',
      'A helpful guide'
    );
    expect(urls.email).toContain('mailto:');
    expect(urls.email).toContain(encodeURIComponent('Best Wallet'));
  });

  it('handles missing description without error', () => {
    const urls = getSocialShareUrls('https://example.com', 'Title');
    expect(urls.email).toContain('mailto:');
  });
});

// ---------------------------------------------------------------------------
// calculateReadingTime
// ---------------------------------------------------------------------------

describe('calculateReadingTime', () => {
  it('returns minimum 1 minute for very short content', () => {
    expect(calculateReadingTime('Hello world')).toBe(1);
    expect(calculateReadingTime('')).toBe(1);
  });

  it('calculates roughly 1 minute for ~200 words', () => {
    const words = Array.from({ length: 200 }, (_, i) => `word${i}`).join(' ');
    expect(calculateReadingTime(words)).toBe(1);
  });

  it('calculates 2 minutes for ~400 words', () => {
    const words = Array.from({ length: 400 }, (_, i) => `word${i}`).join(' ');
    expect(calculateReadingTime(words)).toBe(2);
  });

  it('strips markdown code blocks before counting words', () => {
    const short = 'Hello world';
    const withCodeBlock = `${short}\n\`\`\`\n${'longword '.repeat(500)}\`\`\``;
    expect(calculateReadingTime(withCodeBlock)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// formatReadingTime
// ---------------------------------------------------------------------------

describe('formatReadingTime', () => {
  it('returns singular form for 1 minute', () => {
    expect(formatReadingTime(1)).toBe('1 min read');
  });

  it('returns plural form for multiple minutes', () => {
    expect(formatReadingTime(5)).toBe('5 min read');
    expect(formatReadingTime(10)).toBe('10 min read');
  });
});

// ---------------------------------------------------------------------------
// optimizeMetaDescription
// ---------------------------------------------------------------------------

describe('optimizeMetaDescription', () => {
  it('returns text unchanged when under maxLength', () => {
    const short = 'Short description.';
    expect(optimizeMetaDescription(short)).toBe(short);
  });

  it('truncates at sentence boundary when possible', () => {
    const text = 'First sentence. ' + 'X'.repeat(200);
    const result = optimizeMetaDescription(text, 160);
    expect(result.length).toBeLessThanOrEqual(160);
  });

  it('appends ellipsis when truncating mid-sentence', () => {
    const text = 'A'.repeat(200);
    const result = optimizeMetaDescription(text, 160);
    expect(result.endsWith('...')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(160);
  });
});

// ---------------------------------------------------------------------------
// extractFAQsFromMarkdown
// ---------------------------------------------------------------------------

describe('extractFAQsFromMarkdown', () => {
  it('returns empty array when no FAQ section present', () => {
    expect(extractFAQsFromMarkdown('# Just a heading\n\nSome content.')).toEqual([]);
  });

  it('extracts question and answer pairs from FAQ section', () => {
    const content = `
## Frequently Asked Questions

### What is Rabby Wallet?

Rabby Wallet is a browser extension with transaction simulation.

### Is it free?

Yes, Rabby is free to use.
`;
    const faqs = extractFAQsFromMarkdown(content);
    expect(faqs).toHaveLength(2);
    expect(faqs[0].question).toBe('What is Rabby Wallet?');
    expect(faqs[0].answer).toContain('transaction simulation');
    expect(faqs[1].question).toBe('Is it free?');
  });

  it('strips markdown bold from answers', () => {
    const content = `
## Frequently Asked Questions

### Why use Rabby?

**Rabby** offers **transaction simulation** for safety.
`;
    const faqs = extractFAQsFromMarkdown(content);
    expect(faqs[0].answer).not.toContain('**');
    expect(faqs[0].answer).toContain('Rabby');
  });
});

// ---------------------------------------------------------------------------
// generateBreadcrumbSchema
// ---------------------------------------------------------------------------

describe('generateBreadcrumbSchema', () => {
  it('generates schema.org BreadcrumbList with correct positions', () => {
    const schema = generateBreadcrumbSchema(
      [
        { label: 'Home', href: '/' },
        { label: 'Software Wallets', href: '/docs/software-wallets' },
      ],
      'https://walletradar.org'
    );
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[0].name).toBe('Home');
    expect(schema.itemListElement[0].item).toBe('https://walletradar.org/');
    expect(schema.itemListElement[1].position).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// generateFAQSchema
// ---------------------------------------------------------------------------

describe('generateFAQSchema', () => {
  it('generates schema.org FAQPage with question/answer pairs', () => {
    const schema = generateFAQSchema([
      { question: 'Is Rabby safe?', answer: 'Yes, it has passed audits.' },
    ]);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(1);
    expect(schema.mainEntity[0]['@type']).toBe('Question');
    expect(schema.mainEntity[0].name).toBe('Is Rabby safe?');
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('Yes, it has passed audits.');
  });
});

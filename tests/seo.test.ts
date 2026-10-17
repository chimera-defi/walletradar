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

describe('getOgImagePath', () => {
  it('returns the article-specific SVG for article slugs and the default for everything else', () => {
    expect(getOgImagePath('rabby-vs-metamask')).toBe('/og/articles/rabby-vs-metamask.svg');
    expect(getOgImagePath('best-ethereum-wallet')).toBe('/og/articles/best-ethereum-wallet.svg');
    expect(getOgImagePath('software-wallets')).toBe('/og-image.svg');
    expect(getOgImagePath('unknown-page')).toBe('/og-image.svg');
    expect(getOgImagePath('')).toBe('/og-image.svg');
  });
});

describe('getSocialShareUrls', () => {
  it('URL-encodes the page URL and title, and builds a mailto link without a description', () => {
    const url = 'https://walletradar.org/docs/rabby?a=1&b=2';
    const urls = getSocialShareUrls(url, 'Best Wallet 2025');
    expect(urls.twitter).toContain(encodeURIComponent(url));
    expect(urls.twitter).toContain(encodeURIComponent('Best Wallet 2025'));
    expect(urls.email).toContain('mailto:');
  });
});

describe('calculateReadingTime / formatReadingTime', () => {
  const words = (n: number) => Array.from({ length: n }, (_, i) => `word${i}`).join(' ');

  it('is at least 1 minute, ~1 per 200 words, and ignores fenced code blocks', () => {
    expect(calculateReadingTime('')).toBe(1);
    expect(calculateReadingTime(words(200))).toBe(1);
    expect(calculateReadingTime(words(400))).toBe(2);
    expect(calculateReadingTime(`Hello world\n\`\`\`\n${'longword '.repeat(500)}\`\`\``)).toBe(1);
  });

  it('formats minutes as "N min read"', () => {
    expect(formatReadingTime(1)).toBe('1 min read');
    expect(formatReadingTime(5)).toBe('5 min read');
  });
});

describe('optimizeMetaDescription', () => {
  it('returns short text unchanged', () => {
    expect(optimizeMetaDescription('Short description.')).toBe('Short description.');
  });

  it('truncates long text to maxLength with an ellipsis', () => {
    const result = optimizeMetaDescription('A'.repeat(200), 160);
    expect(result.endsWith('...')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(160);
  });
});

describe('extractFAQsFromMarkdown', () => {
  it('returns an empty array when there is no FAQ section', () => {
    expect(extractFAQsFromMarkdown('# Just a heading\n\nSome content.')).toEqual([]);
  });

  it('extracts question/answer pairs and strips markdown bold from answers', () => {
    const content = `
## Frequently Asked Questions

### What is Rabby Wallet?

**Rabby** offers **transaction simulation** for safety.

### Is it free?

Yes, Rabby is free to use.
`;
    const faqs = extractFAQsFromMarkdown(content);
    expect(faqs).toHaveLength(2);
    expect(faqs[0].question).toBe('What is Rabby Wallet?');
    expect(faqs[0].answer).not.toContain('**');
    expect(faqs[0].answer).toContain('transaction simulation');
    expect(faqs[1].question).toBe('Is it free?');
  });
});

describe('schema generators', () => {
  it('generateBreadcrumbSchema builds a BreadcrumbList with absolute URLs and 1-based positions', () => {
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
    expect(schema.itemListElement[0].item).toBe('https://walletradar.org/');
    expect(schema.itemListElement[1].position).toBe(2);
  });

  it('generateFAQSchema builds a FAQPage with Question/acceptedAnswer pairs', () => {
    const schema = generateFAQSchema([{ question: 'Is Rabby safe?', answer: 'Yes, it has passed audits.' }]);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity[0]['@type']).toBe('Question');
    expect(schema.mainEntity[0].name).toBe('Is Rabby safe?');
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('Yes, it has passed audits.');
  });
});

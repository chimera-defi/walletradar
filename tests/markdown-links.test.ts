/**
 * Tests for frontend/src/lib/markdown-links.ts
 * Pure functions — no browser or Next.js environment needed.
 * Run with: bunx vitest run tests/markdown-links.test.ts
 */

import { describe, it, expect } from 'vitest';
import {
  headingToId,
  buildAnchorMap,
  resolveMarkdownLink,
} from '../frontend/src/lib/markdown-links';

describe('headingToId', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(headingToId('Hello World')).toBe('hello-world');
  });

  it('strips inline code backticks', () => {
    expect(headingToId('Use `npm install`')).toBe('use-npm-install');
  });

  it('strips bold/italic markers', () => {
    expect(headingToId('**bold** and *italic*')).toBe('bold-and-italic');
  });

  it('extracts link text from inline markdown links', () => {
    expect(headingToId('[GitHub](https://github.com)')).toBe('github');
  });

  it('removes non-letter/digit/hyphen/underscore characters', () => {
    expect(headingToId('Hello, World!')).toBe('hello-world');
  });

  it('trims surrounding whitespace before converting', () => {
    expect(headingToId('  Spaced  ')).toBe('spaced');
  });

  it('handles empty string', () => {
    expect(headingToId('')).toBe('');
  });
});

describe('buildAnchorMap', () => {
  it('maps a simple heading to its id', () => {
    const map = buildAnchorMap('# Hello World\n');
    expect(map.get('helloworld')).toBe('hello-world');
  });

  it('handles multiple headings at different levels', () => {
    const md = '# Top\n## Second Level\n### Third Level\n';
    const map = buildAnchorMap(md);
    expect(map.get('top')).toBe('top');
    expect(map.get('secondlevel')).toBe('second-level');
    expect(map.get('thirdlevel')).toBe('third-level');
  });

  it('deduplicates repeated heading ids with numeric suffix', () => {
    const md = '## Foo\n## Foo\n## Foo\n';
    const map = buildAnchorMap(md);
    // First occurrence gets the base id; map only records first occurrence per anchor key
    expect(map.get('foo')).toBe('foo');
    // The map stores first-seen only, so size should be 1 for this key
    expect(map.size).toBe(1);
  });

  it('ignores headings inside fenced code blocks', () => {
    const md = '```\n# Not a heading\n```\n# Real Heading\n';
    const map = buildAnchorMap(md);
    expect(map.has('notaheading')).toBe(false);
    expect(map.get('realheading')).toBe('real-heading');
  });

  it('returns an empty map for markdown with no headings', () => {
    const map = buildAnchorMap('Just plain text without headings.');
    expect(map.size).toBe(0);
  });
});

describe('resolveMarkdownLink', () => {
  describe('external links', () => {
    it('passes through https URLs unchanged', () => {
      const result = resolveMarkdownLink('https://example.com/page');
      expect(result).toEqual({ kind: 'external', href: 'https://example.com/page' });
    });

    it('passes through http URLs unchanged', () => {
      const result = resolveMarkdownLink('http://example.com');
      expect(result).toEqual({ kind: 'external', href: 'http://example.com' });
    });

    it('passes through mailto links as external', () => {
      const result = resolveMarkdownLink('mailto:test@example.com');
      expect(result).toEqual({ kind: 'external', href: 'mailto:test@example.com' });
    });

    it('passes through tel links as external', () => {
      const result = resolveMarkdownLink('tel:+1234567890');
      expect(result).toEqual({ kind: 'external', href: 'tel:+1234567890' });
    });
  });

  describe('hash links', () => {
    it('returns a hash link with the raw fragment when no anchor map is provided', () => {
      const result = resolveMarkdownLink('#my-heading');
      expect(result).toEqual({ kind: 'hash', href: '#my-heading' });
    });

    it('resolves a hash link via the anchor map when provided', () => {
      const anchors = new Map([['myheading', 'my-heading-1']]);
      const result = resolveMarkdownLink('#my-heading', anchors);
      expect(result).toEqual({ kind: 'hash', href: '#my-heading-1' });
    });

    it('falls back to raw fragment when anchor map has no match', () => {
      const anchors = new Map<string, string>();
      const result = resolveMarkdownLink('#unknown-section', anchors);
      expect(result).toEqual({ kind: 'hash', href: '#unknown-section' });
    });
  });

  describe('internal doc links', () => {
    it('resolves data/tables doc to /docs/<slug>', () => {
      const result = resolveMarkdownLink('data/tables/SOFTWARE_WALLETS.md');
      expect(result).toEqual({ kind: 'internal', href: '/docs/software-wallets' });
    });

    it('resolves docs/site doc to /docs/<slug>', () => {
      const result = resolveMarkdownLink('docs/site/ABOUT.md');
      expect(result).toEqual({ kind: 'internal', href: '/docs/about' });
    });

    it('resolves GLOSSARY.md to /glossary/', () => {
      const result = resolveMarkdownLink('docs/site/GLOSSARY.md');
      expect(result).toEqual({ kind: 'internal', href: '/glossary/' });
    });

    it('resolves a _DETAILS doc to its parent category page with #details', () => {
      const result = resolveMarkdownLink('data/tables/SOFTWARE_WALLETS_DETAILS.md');
      expect(result).toEqual({ kind: 'internal', href: '/docs/software-wallets/#details' });
    });

    it('resolves an article path to /articles/<slug>/', () => {
      const result = resolveMarkdownLink('articles/my-guide.md');
      expect(result).toEqual({ kind: 'internal', href: '/articles/my-guide/' });
    });

    it('resolves frontend/public/ paths to site root', () => {
      const result = resolveMarkdownLink('frontend/public/logo.png');
      expect(result).toEqual({ kind: 'internal', href: '/logo.png' });
    });

    it('appends a hash fragment to an internal doc link', () => {
      const result = resolveMarkdownLink('data/tables/RAMPS.md#section');
      expect(result).toEqual({ kind: 'internal', href: '/docs/ramps#section' });
    });

    it('strips relative path prefixes (../) before resolving', () => {
      const result = resolveMarkdownLink('../data/tables/HARDWARE_WALLETS.md');
      expect(result).toEqual({ kind: 'internal', href: '/docs/hardware-wallets' });
    });
  });

  describe('fallback to GitHub', () => {
    it('falls back to GitHub blob URL for unrecognised repo files', () => {
      const result = resolveMarkdownLink('scripts/some-script.sh');
      expect(result.kind).toBe('external');
      expect((result as { kind: string; href: string }).href).toContain('github.com');
      expect((result as { kind: string; href: string }).href).toContain('scripts/some-script.sh');
    });

    it('falls back to GitHub for unrendered markdown docs', () => {
      const result = resolveMarkdownLink('docs/INTERNAL_NOTES.md');
      expect(result.kind).toBe('external');
      expect((result as { kind: string; href: string }).href).toContain('INTERNAL_NOTES.md');
    });
  });
});

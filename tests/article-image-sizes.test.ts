/**
 * The markdown renderer gives next/image real dimensions from
 * frontend/src/lib/article-image-sizes.json. Keep it in sync with the files.
 * Fix drift with: cd frontend && bun run generate-image-sizes
 */
import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import sizes from '../frontend/src/lib/article-image-sizes.json';

const root = path.resolve(__dirname, '..');
const pub = path.join(root, 'frontend', 'public');
const manifest = sizes as Record<string, { width: number; height: number }>;

describe('article image sizes', () => {
  it('matches the PNG header of every listed file', () => {
    expect(Object.keys(manifest).length).toBeGreaterThan(0);
    for (const [src, size] of Object.entries(manifest)) {
      const head = fs.readFileSync(path.join(pub, src)).subarray(0, 24);
      expect({ src, width: head.readUInt32BE(16), height: head.readUInt32BE(20) }).toEqual({ src, ...size });
    }
  });

  it('lists every /articles/ image referenced from articles/*.md', () => {
    const dir = path.join(root, 'articles');
    for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.md'))) {
      const text = fs.readFileSync(path.join(dir, f), 'utf8');
      for (const m of text.matchAll(/!\[[^\]]*\]\((\/articles\/[^)\s]+)\)/g)) {
        expect(manifest[m[1]], `${f}: ${m[1]}`).toBeDefined();
      }
    }
  });
});

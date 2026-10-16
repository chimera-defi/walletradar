/**
 * Merchant feed generator: availability comes from data/merchant_pricing.json.
 * Runs via: bunx vitest run tests/merchant-feed.test.ts
 */
import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = path.resolve(__dirname, '..');

function run(pricing: object): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'feed-'));
  const pf = path.join(dir, 'pricing.json');
  const out = path.join(dir, 'feed.xml');
  writeFileSync(pf, JSON.stringify(pricing));
  execFileSync('python3', [path.join(root, 'scripts/generate_merchant_feed.py'), '--pricing', pf, '--output', out], { stdio: 'pipe' });
  return readFileSync(out, 'utf8');
}

describe('merchant feed availability', () => {
  it('defaults to in stock and honours an availability field', () => {
    const xml = run({
      'Trezor Safe 3': { price: '59 USD' },
      'Blockstream Jade': { price: '67 USD', availability: 'out of stock' },
    });
    const items = xml.split('<item>').slice(1);
    const avail = (title: string) =>
      /<g:availability>([^<]*)</.exec(items.find((i) => i.includes(`<g:title>${title}<`))!)![1];
    expect(avail('Trezor Safe 3')).toBe('in stock');
    expect(avail('Blockstream Jade')).toBe('out of stock');
  });

  it('rejects an unsupported availability value', () => {
    expect(() => run({ 'Trezor Safe 3': { price: '59 USD', availability: 'maybe' } })).toThrow();
  });

  it('skips non-USD prices', () => {
    const xml = run({ Bitkey: { price: '230 EUR' } });
    expect(xml).not.toContain('<g:title>Bitkey<');
  });
});

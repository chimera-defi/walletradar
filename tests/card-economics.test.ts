import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  parseCashback,
  parseCashbackMax,
  parseAnnualFee,
  parseFxFee,
  estimateEarnings,
} from '../frontend/src/lib/card-economics';

describe('parseCashback', () => {
  it.each([
    ['2-3%', { min: 2, max: 3 }],
    ['0-4.5%', { min: 0, max: 4.5 }],
    ['Up to 20% (1% base)', { min: 1, max: 20 }],
    ['Up to 5%', { min: null, max: 5 }],
    ['1% rewards pts', { min: 1, max: 1 }],
    ['10% BTC', { min: 10, max: 10 }],
    ['TBD', null],
    ['1-15%*', null],
  ])('%s', (cell, want) => expect(parseCashback(cell)).toEqual(want));
  it('max handles decimals', () => expect(parseCashbackMax('1-1.5%')).toBe(1.5));
});

describe('parseAnnualFee', () => {
  it.each([
    ['$0', { min: 0, max: 0, oneOffExcluded: false }],
    ['£0', { min: 0, max: 0, oneOffExcluded: false }],
    ['$0-$199/yr', { min: 0, max: 199, oneOffExcluded: false }],
    ['$0-$10,000/yr', { min: 0, max: 10000, oneOffExcluded: false }],
    ['$0-$29.99/mo', { min: 0, max: 359.88, oneOffExcluded: false }],
    ['$0 ($10 activation)', { min: 0, max: 0, oneOffExcluded: true }],
    ['TBD', null],
  ])('%s', (cell, want) => {
    const got = parseAnnualFee(cell);
    if (want && got) {
      expect(got.min).toBeCloseTo(want.min);
      expect(got.max).toBeCloseTo(want.max);
      expect(got.oneOffExcluded).toBe(want.oneOffExcluded);
    } else expect(got).toEqual(want);
  });
});

describe('parseFxFee', () => {
  it.each([
    ['0-1%', { min: 0, max: 1 }],
    ['~1%', { min: 1, max: 1 }],
    ['2.99%', { min: 2.99, max: 2.99 }],
    ['2% + 2% processing', null],
    ['1% (min $0.4)', null],
    ['Up to 2-3%', null],
    ['TBD (avg ~2% savings)', null],
    ['TBD', null],
  ])('%s', (cell, want) => expect(parseFxFee(cell)).toEqual(want));
});

describe('estimateEarnings', () => {
  const card = { status: 'active', cashBack: '2-3%', annualFee: '$0-$100/yr', fxFee: '0-1%' };
  it('computes range', () => {
    // 1000/mo => 12000/yr; best 3% = 360 - 0 - 0; conservative 2% = 240 - 12000*0.5*1% = 60 - 100
    expect(estimateEarnings(card, { monthlySpend: 1000, foreignSharePct: 50 })).toMatchObject({
      kind: 'range', best: 360, conservative: 80,
    });
  });
  it('inactive gets none', () => {
    expect(estimateEarnings({ ...card, status: 'inactive' }, { monthlySpend: 1000, foreignSharePct: 0 }).kind).toBe('none');
  });
  it('TBD is uncomputable', () => {
    expect(estimateEarnings({ ...card, fxFee: 'TBD' }, { monthlySpend: 1000, foreignSharePct: 0 }).kind).toBe('uncomputable');
  });
});

describe('real CRYPTO_CARDS.md cells', () => {
  it('never throw', () => {
    const lines = fs.readFileSync(path.join(__dirname, '..', 'CRYPTO_CARDS.md'), 'utf8').split('\n');
    let n = 0;
    for (const l of lines) {
      if (!l.startsWith('|')) continue;
      for (const c of l.split('|').map(s => s.trim())) {
        expect(() => { parseCashback(c); parseAnnualFee(c); parseFxFee(c); }).not.toThrow();
        n++;
      }
    }
    expect(n).toBeGreaterThan(100);
  });
});

import { clearControlledQueryParams } from '../frontend/src/lib/explore-url-state';
describe('compare share URL params', () => {
  it('cd and compare are controlled keys (cleared on reset, rebuilt from state)', () => {
    const p = new URLSearchParams('tab=cards&cd=a,b,c,d&compare=1&utm=x');
    clearControlledQueryParams(p);
    expect(p.toString()).toBe('utm=x');
  });
});

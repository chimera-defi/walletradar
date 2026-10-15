/**
 * Hardware price column: USD and EUR amounts are both scored (EUR by face value).
 * Runs via: bunx vitest run tests/hardware-price-score.test.ts
 */
import { describe, expect, it } from 'vitest';
// @ts-expect-error CommonJS module without types
import scoring from '../frontend/src/lib/scoring.js';

const row = (price: string) => [
  '', '', '[g](https://github.com/a/b)', '❌', '✅ Full', '✅ SE', 'Touch Color', price, 'USB', '✅ Active', '2015', '🟢 Self',
];

describe('computeHardwareScore price parsing', () => {
  it('scores a EUR price the same as the same USD amount', () => {
    const usd = scoring.computeHardwareScore(row('~$129')).score;
    const eur = scoring.computeHardwareScore(row('~€129')).score;
    expect(eur).toBe(usd);
  });

  it('scores a EUR price above the neutral unknown-price value', () => {
    const cheap = scoring.computeHardwareScore(row('~€29')).score;
    const unknown = scoring.computeHardwareScore(row('TBD')).score;
    expect(cheap).toBeGreaterThan(unknown);
  });
});

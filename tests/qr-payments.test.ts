/**
 * Tests for QR payment helpers in frontend/src/lib/wallet-data.ts.
 * Run with: bunx vitest run tests/qr-payments.test.ts
 */
import { describe, it, expect } from 'vitest';
import { parseQRRecommendation } from '../frontend/src/lib/wallet-data';

describe('parseQRRecommendation', () => {
  it('maps the score-cell emoji to a recommendation', () => {
    expect(parseQRRecommendation('88 🟢')).toBe('recommended');
    expect(parseQRRecommendation('78 🟡')).toBe('situational');
    expect(parseQRRecommendation('40 🔴')).toBe('avoid');
  });

  it('defaults to situational when there is no emoji', () => {
    expect(parseQRRecommendation('75')).toBe('situational');
  });
});

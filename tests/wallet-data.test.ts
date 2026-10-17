/**
 * wallet-data: bestFor must not leak markdown strikethrough (~~), and the QR recommendation parser.
 * markdown.ts resolves the repo root from process.cwd() at import time
 * (it expects to run from frontend/), so cwd is pointed there before the import.
 * Run with: bunx vitest run tests/wallet-data.test.ts
 */
import path from 'path';
import { describe, it, expect, beforeAll, vi } from 'vitest';

type Mod = typeof import('../frontend/src/lib/wallet-data');
let wd: Mod;

beforeAll(async () => {
  const spy = vi.spyOn(process, 'cwd').mockReturnValue(path.resolve(__dirname, '../frontend'));
  wd = await import('../frontend/src/lib/wallet-data');
  spy.mockRestore();
});

describe('wallet-data bestFor strikethrough', () => {
  it('strips ~~ from cards, ramps and QR payments', () => {
    const spy = vi.spyOn(process, 'cwd').mockReturnValue(path.resolve(__dirname, '../frontend'));
    const sets = [wd.parseCryptoCards(), wd.parseRamps(), wd.parseQRPayments()];
    spy.mockRestore();
    for (const rows of sets) {
      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) {
        expect(row.bestFor).not.toContain('~~');
      }
    }
  });

  it('keeps the text of struck-through cells', () => {
    const spy = vi.spyOn(process, 'cwd').mockReturnValue(path.resolve(__dirname, '../frontend'));
    const cards = wd.parseCryptoCards();
    spy.mockRestore();
    const inactive = cards.filter((c) => c.status === 'inactive');
    expect(inactive.length).toBeGreaterThan(0);
    for (const card of inactive) expect(card.bestFor.length).toBeGreaterThan(0);
  });
});

describe('parseQRRecommendation', () => {
  it('maps the score-cell emoji to a recommendation and defaults to situational without one', () => {
    expect(wd.parseQRRecommendation('88 🟢')).toBe('recommended');
    expect(wd.parseQRRecommendation('78 🟡')).toBe('situational');
    expect(wd.parseQRRecommendation('40 🔴')).toBe('avoid');
    expect(wd.parseQRRecommendation('75')).toBe('situational');
  });
});

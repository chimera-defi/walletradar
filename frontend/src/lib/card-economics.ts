/**
 * Parsers and a yearly-earnings estimate for the free-text fee/cashback cells in CRYPTO_CARDS.md.
 *
 * The cells are prose ("Up to 20% (1% base)", "$0-$25/mo", "1% (min $0.4)"). Every parser returns null
 * instead of guessing; the estimate shows a range and never covers caps, tiers, staking requirements,
 * one-off issuance fees or token price moves.
 */

export interface Range {
  min: number;
  max: number;
}

export interface CashbackRate {
  /** Lowest stated rate, or null when only an "up to" ceiling is given */
  min: number | null;
  max: number;
}

const clean = (cell: string) => cell.replace(/~~/g, '').replace(/,/g, '').trim();
const NUM = /\d+(?:\.\d+)?/g;

/** Largest percentage in a cashback cell (1-1.5% -> 1.5, Up to 20% (1% base) -> 20). Null if none. */
export function parseCashbackMax(cell: string): number | null {
  const nums = [...clean(cell).matchAll(/(\d+(?:\.\d+)?)\s*%/g)].map(m => parseFloat(m[1]));
  return nums.length ? Math.max(...nums) : null;
}

export function parseCashback(cell: string): CashbackRate | null {
  const text = clean(cell);
  if (!text || /tbd/i.test(text) || text.includes('*')) return null;
  const max = parseCashbackMax(text);
  if (max === null) return null;
  if (/^up to/i.test(text)) {
    const base = /\((\d+(?:\.\d+)?)\s*%\s*base\)/i.exec(text);
    return { min: base ? parseFloat(base[1]) : null, max };
  }
  // Ranges like 2-3% or 0-4.5%: lowest number before the first % sign group.
  const head = text.replace(/\(.*?\)/g, '');
  const nums = [...head.matchAll(NUM)].map(m => parseFloat(m[0]));
  return nums.length ? { min: Math.min(...nums), max: Math.max(...nums) } : null;
}

export interface AnnualFee extends Range {
  /** True when the cell also mentions a one-off fee (issuance, activation, setup) that is not included */
  oneOffExcluded: boolean;
}

/** Annual fee in USD. Monthly fees are x12; one-off fees are flagged, not amortized. Non-USD non-zero fees return null. */
export function parseAnnualFee(cell: string): AnnualFee | null {
  const text = clean(cell);
  if (!text || /tbd/i.test(text)) return null;
  const oneOffExcluded = /one-off|issuance|activation|setup|\bKYC\b/i.test(text);
  const main = text.replace(/\(.*?\)/g, ' ').replace(/one-off/gi, ' ');
  const cur = /([$£€])/.exec(main)?.[1];
  const nums = [...main.matchAll(NUM)].map(m => parseFloat(m[0]));
  if (!nums.length) return null;
  const mult = /\/\s*mo/i.test(main) ? 12 : 1;
  const min = Math.min(...nums) * mult;
  const max = Math.max(...nums) * mult;
  if (cur && cur !== '$' && max > 0) return null;
  return { min, max, oneOffExcluded };
}

/** Foreign-exchange fee percent. Compound or conditional cells (2% + 2% processing, 1% (min $0.4), Up to) return null. */
export function parseFxFee(cell: string): Range | null {
  const text = clean(cell);
  if (!text || /tbd/i.test(text) || /\+|\bmin\b|up to/i.test(text) || text.includes('(')) return null;
  const nums = [...text.matchAll(NUM)].map(m => parseFloat(m[0]));
  if (!nums.length || !text.includes('%')) return null;
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

export interface EarningsInput {
  monthlySpend: number;
  /** Share of spend in a foreign currency, 0-100 */
  foreignSharePct: number;
}

export type EarningsEstimate =
  | { kind: 'none'; reason: string }
  | { kind: 'uncomputable'; reason: string }
  | {
      kind: 'range';
      /** Net per year in USD: best case (top rate, lowest fees) and conservative (lowest stated rate or 0, highest fees) */
      best: number;
      conservative: number;
      /** True when no minimum cashback rate is stated, so the conservative case assumes 0% rewards */
      minRateUnstated: boolean;
      oneOffExcluded: boolean;
    };

export interface EarningsCard {
  status: string;
  cashBack: string;
  annualFee: string;
  fxFee: string;
}

export function estimateEarnings(card: EarningsCard, input: EarningsInput): EarningsEstimate {
  if (card.status === 'inactive') return { kind: 'none', reason: 'Discontinued' };
  const rate = parseCashback(card.cashBack);
  if (!rate) return { kind: 'uncomputable', reason: 'Cashback is TBD or not a plain rate' };
  const fee = parseAnnualFee(card.annualFee);
  if (!fee) return { kind: 'uncomputable', reason: 'Annual fee is TBD or not in USD' };
  const fx = parseFxFee(card.fxFee);
  if (!fx) return { kind: 'uncomputable', reason: 'FX fee is TBD or not a plain rate' };

  const yearly = Math.max(0, input.monthlySpend) * 12;
  const foreign = yearly * Math.min(100, Math.max(0, input.foreignSharePct)) / 100;
  const best = (yearly * rate.max) / 100 - (foreign * fx.min) / 100 - fee.min;
  const conservative = (yearly * (rate.min ?? 0)) / 100 - (foreign * fx.max) / 100 - fee.max;
  return {
    kind: 'range',
    best: Math.round(best),
    conservative: Math.round(conservative),
    minRateUnstated: rate.min === null,
    oneOffExcluded: fee.oneOffExcluded,
  };
}

export const EARNINGS_CAVEAT =
  'Headline rates before caps, tiers, staking requirements, one-off issuance fees and token price moves. Not advice.';

/**
 * Tests for scoring.js — the core wallet/card/ramp scoring module.
 * Runs via: bunx vitest run tests/scoring.test.ts
 */
import { describe, it, expect } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const {
  computeSoftwareScore,
  computeHardwareScore,
  computeCardScore,
  computeRampScore,
  assignRecommendationBands,
  formatScoreBreakdownTooltip,
} = require('../frontend/src/lib/scoring');

// cells[0] and cells[1] are not read by any scorer (name + logo columns)
const PAD = ['', ''];

const SOFTWARE_ACTIVE = [
  ...PAD,
  '✅ Full',       // [2] core = full
  '3',                 // [3] releases (3 per cycle, <=4 -> 13pts)
  '✅ Full',       // [4] rpc = full
  '[GitHub](https://github.com/t/t)', // [5] hasMarkdownLink
  '✅ Active',     // [6] activity = active
  '/chains/eth /chains/btc /chains/sol /chains/move /chains/cosmos /chains/polkadot /chains/starknet', // [7] 7 chains
  '📱🌐💻🔗', // [8] 📱🌐💻🔗
  '✅',            // [9] testnets
  '✅',            // [10] license = open
  '✅ open',       // [11] api = open
  '✅ 2024',       // [12] audits = recent
  '🟢',      // [13] 🟢 funding = sustainable
  '✅',            // [14] txSimulation = full
  '✅',            // [15] scamProtection = full
  'Safe 4337 7702',    // [16] three account types
  'full',              // [17] ens = full
  '✅',            // [18] hardware = full
];

const SOFTWARE_INACTIVE = [...SOFTWARE_ACTIVE];
SOFTWARE_INACTIVE[6] = '❌ inactive';

const HARDWARE_CELLS = [
  ...PAD,
  '[GitHub](https://github.com/t/t)', // [2] github link
  '✅',                           // [3] airGap
  '✅',                           // [4] openSource = full
  'Custom Tropic01 chip',             // [5] secureElement = tropic -> 24
  'touch color',                      // [6] display -> 12
  '$ 79',                             // [7] price <=80 -> 10
  'QR',                               // [8] QR-only offline -> 10
  '✅ Active',                    // [9] activity = active
  '2014',                             // [10] company age <=2014 -> 4
  '🟢',                     // [11] 🟢 funding = sustainable
];

const CARD_ACTIVE = [
  ...PAD,
  'Debit',            // [2] cardType = debit -> 5
  '🔐',     // [3] 🔐 custody -> 14
  '✅',           // [4] business -> 4
  '🌍',     // [5] 🌍 region = global -> 11
  '4%',               // [6] cashback 4% -> 10
  '$ 0',              // [7] annualFee = 0 -> 12
  '0%',               // [8] fxFee = 0% -> 8
  'ETH, BTC',         // [9] rewards -> 7
  '✅',           // [10] status = active
];

const CARD_INACTIVE = [...CARD_ACTIVE];
CARD_INACTIVE[10] = '❌ inactive';

const RAMP_CELLS = [
  ...PAD,
  'Both',             // [2] rampType
  '✅',           // [3] onRamp
  '✅',           // [4] offRamp
  'Global',           // [5] coverage = global -> 25
  'Low',              // [6] feeModel = low -> 15
  '$ 1',              // [7] minimumFee <=1 -> 10
  'Excellent',        // [8] devUx -> 18
  '✅ Active',    // [9] status = active
  '2015',             // [10] companyAge <=2015 -> 1
  '🟢',     // [11] 🟢 funding = sustainable
];

describe('formatScoreBreakdownTooltip', () => {
  it('formats the score header and breakdown entries, and handles an empty breakdown', () => {
    const info = {
      score: 75,
      maxScore: 100,
      breakdown: [
        { label: 'Security', score: 20, max: 30 },
        { label: 'Usability', score: 55, max: 70 },
      ],
    };
    expect(formatScoreBreakdownTooltip(info)).toBe('Score 75/100\nSecurity: 20/30\nUsability: 55/70');
    expect(formatScoreBreakdownTooltip({ score: 0, maxScore: 100, breakdown: [] })).toBe('Score 0/100');
  });
});

const inactiveAt = (cells: string[], i: number) => {
  const copy = [...cells];
  copy[i] = '❌ inactive';
  return copy;
};

describe.each([
  ['software', computeSoftwareScore, SOFTWARE_ACTIVE, SOFTWARE_INACTIVE, 98],
  ['hardware', computeHardwareScore, HARDWARE_CELLS, inactiveAt(HARDWARE_CELLS, 9), 100],
  ['card', computeCardScore, CARD_ACTIVE, CARD_INACTIVE, null],
  ['ramp', computeRampScore, RAMP_CELLS, inactiveAt(RAMP_CELLS, 9), 100],
])('compute%sScore', (_kind, compute, active, inactive, expectedScore) => {
  it('scores an active row with strong signals as recommended, within 0-100', () => {
    const result = compute(active);
    expect(result.maxScore).toBe(100);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    if (expectedScore === null) expect(result.score).toBeGreaterThan(80);
    else expect(result.score).toBe(expectedScore);
    expect(result.recommendation).toBe('recommended');
  });

  it('marks an inactive row as avoid regardless of other signals', () => {
    expect(compute(inactive).recommendation).toBe('avoid');
  });
});

describe('computeHardwareScore price parsing', () => {
  const row = (price: string) => {
    const cells = [...HARDWARE_CELLS];
    cells[7] = price;
    return cells;
  };

  it('scores a EUR price the same as the same USD amount', () => {
    expect(computeHardwareScore(row('~€129')).score).toBe(computeHardwareScore(row('~$129')).score);
  });

  it('scores a EUR price above the neutral unknown-price value', () => {
    expect(computeHardwareScore(row('~€29')).score).toBeGreaterThan(computeHardwareScore(row('TBD')).score);
  });
});

describe('assignRecommendationBands', () => {
  const eligible = { core: 'full', devControl: 24, activity: 'active' };

  it('marks inactive entries as avoid outside percentile logic', () => {
    const { recommendations } = assignRecommendationBands('software', [
      { score: 90, signals: { activity: 'inactive' } },
      { score: 50, signals: eligible },
    ]);
    expect(recommendations[0]).toBe('avoid');
  });

  it('marks low-devControl software as not-for-dev, but never hardware', () => {
    const software = assignRecommendationBands('software', [
      { score: 80, signals: { core: 'partial', devControl: 5 } },
      { score: 90, signals: eligible },
    ]);
    expect(software.recommendations[0]).toBe('not-for-dev');
    const hardware = assignRecommendationBands('hardware', [
      { score: 80, signals: { activity: 'active' } },
      { score: 90, signals: { activity: 'active' } },
    ]);
    expect(hardware.recommendations).not.toContain('not-for-dev');
  });

  it('gives the highest scorer recommended, including via the ramp kind alias', () => {
    const software = assignRecommendationBands('software', [30, 40, 70, 90].map((score) => ({ score, signals: eligible })));
    expect(software.recommendations[3]).toBe('recommended');
    const ramp = assignRecommendationBands('ramp', [
      { score: 80, signals: { status: 'active' } },
      { score: 90, signals: { status: 'active' } },
    ]);
    expect(ramp.recommendations[1]).toBe('recommended');
  });

  it('gives the bottom 25th percentile of eligible entries avoid', () => {
    const scoreInfos = Array.from({ length: 8 }, (_, i) => ({ score: (i + 1) * 10, signals: eligible }));
    const { recommendations } = assignRecommendationBands('software', scoreInfos);
    // avoidCutoff = floor(8 * 0.25) = 2; lowest two scores get avoid
    expect(recommendations.slice(0, 2)).toEqual(['avoid', 'avoid']);
    expect(recommendations[2]).not.toBe('avoid');
  });
});

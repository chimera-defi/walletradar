/**
 * Tests for scoring.js — the core wallet/card/ramp scoring module.
 * Runs via: bunx vitest run tests/scoring.test.ts
 */
import { describe, it, expect } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const {
  SCORING_METHODOLOGY_VERSION,
  computeSoftwareScore,
  computeHardwareScore,
  computeCardScore,
  computeRampScore,
  assignRecommendationBands,
  recommendationEmoji,
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

describe('SCORING_METHODOLOGY_VERSION', () => {
  it('is a non-empty string', () => {
    expect(typeof SCORING_METHODOLOGY_VERSION).toBe('string');
    expect(SCORING_METHODOLOGY_VERSION.length).toBeGreaterThan(0);
  });
});

describe('recommendationEmoji', () => {
  it('maps recommended to green circle', () => {
    expect(recommendationEmoji('recommended')).toBe('🟢');
  });

  it('maps situational to yellow circle', () => {
    expect(recommendationEmoji('situational')).toBe('🟡');
  });

  it('maps not-for-dev to white circle', () => {
    expect(recommendationEmoji('not-for-dev')).toBe('⚪');
  });

  it('maps avoid (and any unknown) to red circle', () => {
    expect(recommendationEmoji('avoid')).toBe('🔴');
  });
});

describe('formatScoreBreakdownTooltip', () => {
  it('formats score header and breakdown entries', () => {
    const info = {
      score: 75,
      maxScore: 100,
      breakdown: [
        { label: 'Security', score: 20, max: 30 },
        { label: 'Usability', score: 55, max: 70 },
      ],
    };
    expect(formatScoreBreakdownTooltip(info)).toBe(
      'Score 75/100\nSecurity: 20/30\nUsability: 55/70'
    );
  });

  it('handles empty breakdown gracefully', () => {
    const info = { score: 0, maxScore: 100, breakdown: [] };
    expect(formatScoreBreakdownTooltip(info)).toBe('Score 0/100');
  });
});

describe('computeSoftwareScore', () => {
  it('returns expected shape with required fields', () => {
    const result = computeSoftwareScore(SOFTWARE_ACTIVE);
    expect(typeof result.score).toBe('number');
    expect(result.maxScore).toBe(100);
    expect(Array.isArray(result.breakdown)).toBe(true);
    expect(result.breakdown.length).toBeGreaterThan(0);
    expect(result.methodologyVersion).toBe(SCORING_METHODOLOGY_VERSION);
  });

  it('scores fully active wallet with all signals at 98', () => {
    const result = computeSoftwareScore(SOFTWARE_ACTIVE);
    expect(result.score).toBe(98);
    expect(result.recommendation).toBe('recommended');
  });

  it('marks inactive wallet as avoid regardless of other signals', () => {
    const result = computeSoftwareScore(SOFTWARE_INACTIVE);
    expect(result.recommendation).toBe('avoid');
  });

  it('score is clamped to 0-100', () => {
    for (const cells of [SOFTWARE_ACTIVE, SOFTWARE_INACTIVE]) {
      const { score } = computeSoftwareScore(cells);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });

  it('breakdown entries have required keys', () => {
    const result = computeSoftwareScore(SOFTWARE_ACTIVE);
    for (const entry of result.breakdown) {
      expect(typeof entry.key).toBe('string');
      expect(typeof entry.label).toBe('string');
      expect(typeof entry.score).toBe('number');
      expect(typeof entry.max).toBe('number');
    }
  });
});

describe('computeHardwareScore', () => {
  it('returns expected shape', () => {
    const result = computeHardwareScore(HARDWARE_CELLS);
    expect(typeof result.score).toBe('number');
    expect(result.maxScore).toBe(100);
    expect(result.recommendation).toBeDefined();
  });

  it('scores hardware wallet with top signals at 100', () => {
    const result = computeHardwareScore(HARDWARE_CELLS);
    expect(result.score).toBe(100);
    expect(result.recommendation).toBe('recommended');
  });

  it('marks inactive hardware as avoid', () => {
    const cells = [...HARDWARE_CELLS];
    cells[9] = '❌ inactive';
    const result = computeHardwareScore(cells);
    expect(result.recommendation).toBe('avoid');
  });
});

describe('computeCardScore', () => {
  it('active card with strong signals is recommended', () => {
    const result = computeCardScore(CARD_ACTIVE);
    expect(result.score).toBeGreaterThan(80);
    expect(result.recommendation).toBe('recommended');
  });

  it('inactive card is marked avoid', () => {
    const result = computeCardScore(CARD_INACTIVE);
    expect(result.recommendation).toBe('avoid');
  });

  it('score is clamped to 0-100', () => {
    const { score } = computeCardScore(CARD_ACTIVE);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe('computeRampScore', () => {
  it('active ramp with top signals scores 100', () => {
    const result = computeRampScore(RAMP_CELLS);
    expect(result.score).toBe(100);
    expect(result.recommendation).toBe('recommended');
  });

  it('inactive ramp is marked avoid', () => {
    const cells = [...RAMP_CELLS];
    cells[9] = '❌ inactive';
    const result = computeRampScore(cells);
    expect(result.recommendation).toBe('avoid');
  });

  it('score is clamped to 0-100', () => {
    const { score } = computeRampScore(RAMP_CELLS);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe('assignRecommendationBands', () => {
  it('marks inactive entries as avoid outside percentile logic', () => {
    const scoreInfos = [
      { score: 90, signals: { activity: 'inactive' } },
      { score: 50, signals: { core: 'full', devControl: 24, activity: 'active' } },
    ];
    const { recommendations } = assignRecommendationBands('software', scoreInfos);
    expect(recommendations[0]).toBe('avoid');
  });

  it('marks software entries with low devControl as not-for-dev', () => {
    const scoreInfos = [
      { score: 80, signals: { core: 'partial', devControl: 5 } },
      { score: 90, signals: { core: 'full', devControl: 20, activity: 'active' } },
    ];
    const { recommendations } = assignRecommendationBands('software', scoreInfos);
    expect(recommendations[0]).toBe('not-for-dev');
  });

  it('highest scorer of eligible entries gets recommended', () => {
    const scoreInfos = [
      { score: 30, signals: { core: 'full', devControl: 24, activity: 'active' } },
      { score: 40, signals: { core: 'full', devControl: 24, activity: 'active' } },
      { score: 70, signals: { core: 'full', devControl: 24, activity: 'active' } },
      { score: 90, signals: { core: 'full', devControl: 24, activity: 'active' } },
    ];
    const { recommendations } = assignRecommendationBands('software', scoreInfos);
    expect(recommendations[3]).toBe('recommended');
  });

  it('bottom 25th percentile of eligible entries gets avoid', () => {
    const scoreInfos = Array.from({ length: 8 }, (_, i) => ({
      score: (i + 1) * 10,
      signals: { core: 'full', devControl: 24, activity: 'active' },
    }));
    const { recommendations } = assignRecommendationBands('software', scoreInfos);
    // avoidCutoff = floor(8 * 0.25) = 2; lowest two scores get avoid
    expect(recommendations[0]).toBe('avoid');
    expect(recommendations[1]).toBe('avoid');
  });

  it('hardware kind does not produce not-for-dev', () => {
    const scoreInfos = [
      { score: 80, signals: { activity: 'active' } },
      { score: 90, signals: { activity: 'active' } },
    ];
    const { recommendations } = assignRecommendationBands('hardware', scoreInfos);
    expect(recommendations).not.toContain('not-for-dev');
  });

  it('ramp kind alias is normalised correctly', () => {
    const scoreInfos = [
      { score: 80, signals: { status: 'active' } },
      { score: 90, signals: { status: 'active' } },
    ];
    const { recommendations } = assignRecommendationBands('ramp', scoreInfos);
    expect(recommendations[1]).toBe('recommended');
  });

  it('returns band summary metadata', () => {
    const scoreInfos = [
      { score: 60, signals: { core: 'full', devControl: 24, activity: 'active' } },
      { score: 90, signals: { core: 'full', devControl: 24, activity: 'active' } },
    ];
    const { bands } = assignRecommendationBands('software', scoreInfos);
    expect(typeof bands.eligibleCount).toBe('number');
    expect(typeof bands.recommendedCount).toBe('number');
  });
});

/**
 * Tests for wallet-filtering.ts pure filter and sort utilities.
 * Run with: bunx vitest run tests/wallet-filtering.test.ts
 */
import { describe, expect, it } from 'vitest';
import type { SoftwareWallet, HardwareWallet } from '../frontend/src/types/wallets';
import {
  filterSoftwareWallets,
  filterHardwareWallets,
  sortWallets,
} from '../frontend/src/lib/wallet-filtering';

// ── fixtures ────────────────────────────────────────────────────────────────

const SW = (overrides: Partial<SoftwareWallet> = {}): SoftwareWallet => ({
  id: 'wallet-a',
  name: 'Alpha Wallet',
  score: 80,
  methodologyVersion: '1.0',
  scoreBreakdown: [],
  core: 'full',
  releasesPerMonth: 2,
  rpc: 'full',
  github: null,
  active: 'active',
  chains: {
    evm: true, bitcoin: false, solana: false, move: false,
    cosmos: false, polkadot: false, starknet: false, other: false, raw: 'evm',
  },
  devices: { mobile: true, browser: false, desktop: false, web: false },
  testnets: false,
  license: 'open',
  licenseType: 'MIT',
  audits: 'recent',
  funding: 'sustainable',
  fundingSource: 'Grants',
  txSimulation: false,
  scamAlerts: 'none',
  accountTypes: ['eoa'],
  ensNaming: 'none',
  hardwareSupport: false,
  apiOpenness: 'open',
  bestFor: 'General use',
  recommendation: 'recommended',
  type: 'software',
  ...overrides,
});

const HW = (overrides: Partial<HardwareWallet> = {}): HardwareWallet => ({
  id: 'hw-a',
  name: 'Hardware A',
  score: 70,
  methodologyVersion: '1.0',
  scoreBreakdown: [],
  github: null,
  airGap: false,
  openSource: 'partial',
  secureElement: true,
  secureElementType: 'EAL6+',
  display: 'color',
  price: 79,
  priceText: '$79',
  priceLastChecked: null,
  connectivity: ['usb', 'bluetooth'],
  active: 'active',
  foundedYear: 2018,
  funding: 'sustainable',
  fundingSource: 'Sales',
  recommendation: 'recommended',
  url: null,
  type: 'hardware',
  ...overrides,
});

// ── filterSoftwareWallets ────────────────────────────────────────────────────

describe('filterSoftwareWallets', () => {
  describe('empty filters', () => {
    it('returns all wallets when filters is empty', () => {
      const wallets = [SW(), SW({ id: 'b', name: 'Beta' })];
      expect(filterSoftwareWallets(wallets, {})).toHaveLength(2);
    });
  });

  describe('search filter', () => {
    it('matches on name (case-insensitive)', () => {
      const wallets = [SW({ name: 'Rainbow' }), SW({ name: 'Metamask' })];
      expect(filterSoftwareWallets(wallets, { search: 'rainbow' })).toHaveLength(1);
    });

    it('matches on bestFor field', () => {
      const wallets = [SW({ bestFor: 'DeFi power users' }), SW({ bestFor: 'NFT collectors' })];
      expect(filterSoftwareWallets(wallets, { search: 'defi' })).toHaveLength(1);
    });

    it('matches on fundingSource field', () => {
      const wallets = [SW({ fundingSource: 'Coinbase Ventures' }), SW({ fundingSource: 'Community' })];
      expect(filterSoftwareWallets(wallets, { search: 'coinbase' })).toHaveLength(1);
    });

    it('returns empty when no wallet matches search', () => {
      const wallets = [SW({ name: 'Alpha' }), SW({ name: 'Beta' })];
      expect(filterSoftwareWallets(wallets, { search: 'zzz' })).toHaveLength(0);
    });
  });

  describe('score filter', () => {
    it('filters wallets below minScore', () => {
      const wallets = [SW({ score: 40 }), SW({ score: 80 })];
      expect(filterSoftwareWallets(wallets, { minScore: 70 })).toHaveLength(1);
    });

    it('filters wallets above maxScore', () => {
      const wallets = [SW({ score: 40 }), SW({ score: 80 })];
      expect(filterSoftwareWallets(wallets, { maxScore: 50 })).toHaveLength(1);
    });

    it('exact minScore boundary is inclusive', () => {
      const wallets = [SW({ score: 70 })];
      expect(filterSoftwareWallets(wallets, { minScore: 70 })).toHaveLength(1);
    });

    it('exact maxScore boundary is inclusive', () => {
      const wallets = [SW({ score: 70 })];
      expect(filterSoftwareWallets(wallets, { maxScore: 70 })).toHaveLength(1);
    });
  });

  describe('recommendation filter', () => {
    it('keeps wallets matching recommendation', () => {
      const wallets = [
        SW({ recommendation: 'recommended' }),
        SW({ recommendation: 'avoid' }),
      ];
      expect(filterSoftwareWallets(wallets, { recommendation: ['recommended'] })).toHaveLength(1);
    });

    it('allows multiple recommendation values', () => {
      const wallets = [
        SW({ recommendation: 'recommended' }),
        SW({ recommendation: 'situational' }),
        SW({ recommendation: 'avoid' }),
      ];
      const result = filterSoftwareWallets(wallets, { recommendation: ['recommended', 'situational'] });
      expect(result).toHaveLength(2);
    });

    it('empty recommendation array returns all wallets', () => {
      const wallets = [SW(), SW({ recommendation: 'avoid' })];
      expect(filterSoftwareWallets(wallets, { recommendation: [] })).toHaveLength(2);
    });
  });

  describe('platform filter', () => {
    it('keeps wallets matching mobile platform', () => {
      const wallets = [
        SW({ devices: { mobile: true, browser: false, desktop: false, web: false } }),
        SW({ devices: { mobile: false, browser: true, desktop: false, web: false } }),
      ];
      expect(filterSoftwareWallets(wallets, { platforms: ['mobile'] })).toHaveLength(1);
    });

    it('matches any of the requested platforms', () => {
      const wallets = [
        SW({ devices: { mobile: true, browser: false, desktop: false, web: false } }),
        SW({ devices: { mobile: false, browser: true, desktop: false, web: false } }),
        SW({ devices: { mobile: false, browser: false, desktop: false, web: false } }),
      ];
      const result = filterSoftwareWallets(wallets, { platforms: ['mobile', 'browser'] });
      expect(result).toHaveLength(2);
    });
  });

  describe('license filter', () => {
    it('filters by open license', () => {
      const wallets = [SW({ license: 'open' }), SW({ license: 'closed' })];
      expect(filterSoftwareWallets(wallets, { license: ['open'] })).toHaveLength(1);
    });
  });

  describe('features filter', () => {
    it('requires txSimulation when specified', () => {
      const wallets = [SW({ txSimulation: true }), SW({ txSimulation: false })];
      expect(filterSoftwareWallets(wallets, { features: ['txSimulation'] })).toHaveLength(1);
    });

    it('requires scamAlerts != none when hardwareSupport specified', () => {
      const wallets = [
        SW({ scamAlerts: 'full', hardwareSupport: true }),
        SW({ scamAlerts: 'none', hardwareSupport: false }),
      ];
      const result = filterSoftwareWallets(wallets, { features: ['scamAlerts', 'hardwareSupport'] });
      expect(result).toHaveLength(1);
    });

    it('requires ALL features (AND logic)', () => {
      const wallets = [SW({ txSimulation: true, hardwareSupport: false })];
      expect(filterSoftwareWallets(wallets, { features: ['txSimulation', 'hardwareSupport'] })).toHaveLength(0);
    });
  });

  describe('active filter', () => {
    it('keeps only active wallets when filter set', () => {
      const wallets = [SW({ active: 'active' }), SW({ active: 'slow' }), SW({ active: 'inactive' })];
      expect(filterSoftwareWallets(wallets, { active: ['active'] })).toHaveLength(1);
    });
  });

  describe('funding filter', () => {
    it('keeps wallets matching funding type', () => {
      const wallets = [SW({ funding: 'sustainable' }), SW({ funding: 'vc' })];
      expect(filterSoftwareWallets(wallets, { funding: ['sustainable'] })).toHaveLength(1);
    });
  });
});

// ── filterHardwareWallets ────────────────────────────────────────────────────

describe('filterHardwareWallets', () => {
  describe('air gap filter', () => {
    it('filters by airGap = true', () => {
      const wallets = [HW({ airGap: true }), HW({ airGap: false })];
      expect(filterHardwareWallets(wallets, { airGap: true })).toHaveLength(1);
    });

    it('filters by airGap = false', () => {
      const wallets = [HW({ airGap: true }), HW({ airGap: false })];
      expect(filterHardwareWallets(wallets, { airGap: false })).toHaveLength(1);
    });

    it('undefined airGap filter returns all', () => {
      const wallets = [HW({ airGap: true }), HW({ airGap: false })];
      expect(filterHardwareWallets(wallets, {})).toHaveLength(2);
    });
  });

  describe('secure element filter', () => {
    it('filters by secureElement = true', () => {
      const wallets = [HW({ secureElement: true }), HW({ secureElement: false })];
      expect(filterHardwareWallets(wallets, { secureElement: true })).toHaveLength(1);
    });
  });

  describe('price range filter', () => {
    it('excludes wallets below price range min', () => {
      const wallets = [HW({ price: 50 }), HW({ price: 150 })];
      expect(filterHardwareWallets(wallets, { priceRange: { min: 100, max: 200 } })).toHaveLength(1);
    });

    it('excludes wallets above price range max', () => {
      const wallets = [HW({ price: 50 }), HW({ price: 250 })];
      expect(filterHardwareWallets(wallets, { priceRange: { min: 0, max: 100 } })).toHaveLength(1);
    });

    it('includes wallets with null price when price range is set', () => {
      const wallets = [HW({ price: null })];
      expect(filterHardwareWallets(wallets, { priceRange: { min: 0, max: 100 } })).toHaveLength(1);
    });
  });

  describe('open source filter', () => {
    it('filters by openSource level', () => {
      const wallets = [HW({ openSource: 'full' }), HW({ openSource: 'closed' })];
      expect(filterHardwareWallets(wallets, { openSource: ['full'] })).toHaveLength(1);
    });
  });

  describe('search filter', () => {
    it('matches on name', () => {
      const wallets = [HW({ name: 'Ledger' }), HW({ name: 'Trezor' })];
      expect(filterHardwareWallets(wallets, { search: 'ledger' })).toHaveLength(1);
    });

    it('matches on foundedYear', () => {
      const wallets = [HW({ foundedYear: 2014 }), HW({ foundedYear: 2022 })];
      expect(filterHardwareWallets(wallets, { search: '2014' })).toHaveLength(1);
    });
  });
});

// ── sortWallets ──────────────────────────────────────────────────────────────

describe('sortWallets', () => {
  it('sorts by score descending', () => {
    const wallets = [SW({ score: 40 }), SW({ score: 90 }), SW({ score: 70 })];
    const result = sortWallets(wallets, 'score', 'desc');
    expect(result.map(w => w.score)).toEqual([90, 70, 40]);
  });

  it('sorts by score ascending', () => {
    const wallets = [SW({ score: 90 }), SW({ score: 40 }), SW({ score: 70 })];
    const result = sortWallets(wallets, 'score', 'asc');
    expect(result.map(w => w.score)).toEqual([40, 70, 90]);
  });

  it('sorts by name ascending', () => {
    const wallets = [SW({ name: 'Zeta' }), SW({ name: 'Alpha' }), SW({ name: 'Meta' })];
    const result = sortWallets(wallets, 'name', 'asc');
    expect(result.map(w => w.name)).toEqual(['Alpha', 'Meta', 'Zeta']);
  });

  it('sorts by name descending', () => {
    const wallets = [SW({ name: 'Alpha' }), SW({ name: 'Zeta' }), SW({ name: 'Meta' })];
    const result = sortWallets(wallets, 'name', 'desc');
    expect(result.map(w => w.name)).toEqual(['Zeta', 'Meta', 'Alpha']);
  });

  it('does not mutate the input array', () => {
    const wallets = [SW({ score: 90 }), SW({ score: 40 })];
    const original = [...wallets];
    sortWallets(wallets, 'score', 'asc');
    expect(wallets).toEqual(original);
  });

  it('sorts software wallets by releasesPerMonth descending', () => {
    const wallets = [
      SW({ releasesPerMonth: 1 }),
      SW({ releasesPerMonth: 10 }),
      SW({ releasesPerMonth: 5 }),
    ];
    const result = sortWallets(wallets, 'releasesPerMonth', 'desc');
    expect(result.map(w => (w as SoftwareWallet).releasesPerMonth)).toEqual([10, 5, 1]);
  });

  it('sorts hardware wallets by price ascending', () => {
    const wallets = [HW({ price: 200 }), HW({ price: 79 }), HW({ price: 120 })];
    const result = sortWallets(wallets, 'price', 'asc');
    expect(result.map(w => (w as HardwareWallet).price)).toEqual([79, 120, 200]);
  });
});

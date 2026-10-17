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

const noDevices = { mobile: false, browser: false, desktop: false, web: false };

describe('filterSoftwareWallets', () => {
  it('returns all wallets for empty filters and for an empty recommendation array', () => {
    const wallets = [SW(), SW({ id: 'b', name: 'Beta', recommendation: 'avoid' })];
    expect(filterSoftwareWallets(wallets, {})).toHaveLength(2);
    expect(filterSoftwareWallets(wallets, { recommendation: [] })).toHaveLength(2);
  });

  it('search matches name (case-insensitive), bestFor and fundingSource, and can match nothing', () => {
    const wallets = [
      SW({ name: 'Rainbow', bestFor: 'DeFi power users', fundingSource: 'Coinbase Ventures' }),
      SW({ name: 'Metamask', bestFor: 'NFT collectors', fundingSource: 'Community' }),
    ];
    for (const [search, count] of [['rainbow', 1], ['defi', 1], ['coinbase', 1], ['zzz', 0]] as const) {
      expect(filterSoftwareWallets(wallets, { search }), search).toHaveLength(count);
    }
  });

  it('score bounds filter both sides and are inclusive', () => {
    const wallets = [SW({ score: 40 }), SW({ score: 70 }), SW({ score: 80 })];
    expect(filterSoftwareWallets(wallets, { minScore: 70 }).map(w => w.score)).toEqual([70, 80]);
    expect(filterSoftwareWallets(wallets, { maxScore: 70 }).map(w => w.score)).toEqual([40, 70]);
  });

  it('recommendation filter accepts one or several values', () => {
    const wallets = [
      SW({ recommendation: 'recommended' }),
      SW({ recommendation: 'situational' }),
      SW({ recommendation: 'avoid' }),
    ];
    expect(filterSoftwareWallets(wallets, { recommendation: ['recommended'] })).toHaveLength(1);
    expect(filterSoftwareWallets(wallets, { recommendation: ['recommended', 'situational'] })).toHaveLength(2);
  });

  it('platform filter matches any requested platform', () => {
    const wallets = [
      SW({ devices: { ...noDevices, mobile: true } }),
      SW({ devices: { ...noDevices, browser: true } }),
      SW({ devices: noDevices }),
    ];
    expect(filterSoftwareWallets(wallets, { platforms: ['mobile'] })).toHaveLength(1);
    expect(filterSoftwareWallets(wallets, { platforms: ['mobile', 'browser'] })).toHaveLength(2);
  });

  it('license, active and funding filters each keep only matching wallets', () => {
    const wallets = [
      SW({ license: 'open', active: 'active', funding: 'sustainable' }),
      SW({ license: 'closed', active: 'slow', funding: 'vc' }),
    ];
    expect(filterSoftwareWallets(wallets, { license: ['open'] })).toHaveLength(1);
    expect(filterSoftwareWallets(wallets, { active: ['active'] })).toHaveLength(1);
    expect(filterSoftwareWallets(wallets, { funding: ['sustainable'] })).toHaveLength(1);
  });

  it('feature filters require every selected feature (AND)', () => {
    const wallets = [
      SW({ txSimulation: true, hardwareSupport: false, scamAlerts: 'none' }),
      SW({ txSimulation: false, hardwareSupport: true, scamAlerts: 'full' }),
    ];
    expect(filterSoftwareWallets(wallets, { features: ['txSimulation'] })).toHaveLength(1);
    expect(filterSoftwareWallets(wallets, { features: ['scamAlerts', 'hardwareSupport'] })).toHaveLength(1);
    expect(filterSoftwareWallets(wallets, { features: ['txSimulation', 'hardwareSupport'] })).toHaveLength(0);
  });
});

// ── filterHardwareWallets ────────────────────────────────────────────────────

describe('filterHardwareWallets', () => {
  it('airGap filter handles true, false and undefined (no filter)', () => {
    const wallets = [HW({ airGap: true }), HW({ airGap: false })];
    expect(filterHardwareWallets(wallets, { airGap: true }).map(w => w.airGap)).toEqual([true]);
    expect(filterHardwareWallets(wallets, { airGap: false }).map(w => w.airGap)).toEqual([false]);
    expect(filterHardwareWallets(wallets, {})).toHaveLength(2);
  });

  it('secureElement and openSource filters keep only matching wallets', () => {
    const wallets = [
      HW({ secureElement: true, openSource: 'full' }),
      HW({ secureElement: false, openSource: 'closed' }),
    ];
    expect(filterHardwareWallets(wallets, { secureElement: true })).toHaveLength(1);
    expect(filterHardwareWallets(wallets, { openSource: ['full'] })).toHaveLength(1);
  });

  it('price range excludes below min and above max, and keeps null-price wallets', () => {
    const wallets = [HW({ price: 50 }), HW({ price: 150 }), HW({ price: 250 }), HW({ price: null })];
    const result = filterHardwareWallets(wallets, { priceRange: { min: 100, max: 200 } });
    expect(result.map(w => w.price)).toEqual([150, null]);
  });

  it('search matches name and foundedYear', () => {
    const wallets = [HW({ name: 'Ledger', foundedYear: 2014 }), HW({ name: 'Trezor', foundedYear: 2022 })];
    expect(filterHardwareWallets(wallets, { search: 'ledger' })).toHaveLength(1);
    expect(filterHardwareWallets(wallets, { search: '2022' })).toHaveLength(1);
  });
});

// ── sortWallets ──────────────────────────────────────────────────────────────

describe('sortWallets', () => {
  it('sorts by score and name in both directions', () => {
    const wallets = [SW({ score: 40, name: 'Zeta' }), SW({ score: 90, name: 'Alpha' }), SW({ score: 70, name: 'Meta' })];
    expect(sortWallets(wallets, 'score', 'desc').map(w => w.score)).toEqual([90, 70, 40]);
    expect(sortWallets(wallets, 'score', 'asc').map(w => w.score)).toEqual([40, 70, 90]);
    expect(sortWallets(wallets, 'name', 'asc').map(w => w.name)).toEqual(['Alpha', 'Meta', 'Zeta']);
    expect(sortWallets(wallets, 'name', 'desc').map(w => w.name)).toEqual(['Zeta', 'Meta', 'Alpha']);
  });

  it('sorts type-specific numeric fields (releasesPerMonth, price)', () => {
    const sw = [SW({ releasesPerMonth: 1 }), SW({ releasesPerMonth: 10 }), SW({ releasesPerMonth: 5 })];
    const hw = [HW({ price: 200 }), HW({ price: 79 }), HW({ price: 120 })];
    expect(sortWallets(sw, 'releasesPerMonth', 'desc').map(w => (w as SoftwareWallet).releasesPerMonth)).toEqual([10, 5, 1]);
    expect(sortWallets(hw, 'price', 'asc').map(w => (w as HardwareWallet).price)).toEqual([79, 120, 200]);
  });

  it('does not mutate the input array', () => {
    const wallets = [SW({ score: 90 }), SW({ score: 40 })];
    const original = [...wallets];
    sortWallets(wallets, 'score', 'asc');
    expect(wallets).toEqual(original);
  });
});

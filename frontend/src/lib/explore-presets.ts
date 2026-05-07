import type { FilterState, SortState } from '@/components/WalletFilters';
import type { ExploreTab } from '@/lib/explore-url-state';

export type PresetConfig = {
  id: string;
  label: string;
  description: string;
  icon: string;
  filters: Partial<FilterState>;
  sort?: SortState;
  viewMode?: 'grid' | 'table';
};

export const QUICK_PRESETS: Record<ExploreTab, PresetConfig[]> = {
  software: [
    {
      id: 'core-wallets',
      label: 'Core Wallets',
      icon: '📱',
      description: 'Mobile + browser-extension coverage first.',
      filters: { platforms: ['mobile', 'browser'], minScore: 55 },
    },
    {
      id: 'open-source',
      label: 'Open Source',
      icon: '🔓',
      description: 'Public codebases with current or recent activity.',
      filters: { license: ['open'], active: ['active', 'slow'] },
    },
    {
      id: 'aa-wallets',
      label: 'AA / Smart Accounts',
      icon: '⚡',
      description: 'Safe, 4337, and 7702-ready options.',
      filters: { accountTypes: ['Safe', 'EIP-4337', 'EIP-7702'] },
    },
    {
      id: 'simulation',
      label: 'Simulation',
      icon: '🔍',
      description: 'Pre-signing safety features.',
      filters: { features: ['txSimulation'], minScore: 50 },
    },
  ],
  hardware: [
    {
      id: 'air-gapped',
      label: 'Air-Gapped',
      icon: '📡',
      description: 'QR or MicroSD-first signing flows.',
      filters: { airGap: true, minScore: 60 },
    },
    {
      id: 'budget',
      label: 'Under $100',
      icon: '💰',
      description: 'Budget-oriented devices and DIY kits.',
      filters: { priceMin: 0, priceMax: 100 },
      sort: { field: 'price', direction: 'asc' },
    },
    {
      id: 'open-active',
      label: 'Open + Active',
      icon: '✅',
      description: 'Public firmware with active maintenance.',
      filters: { openSource: ['open'], active: ['active'] },
    },
    {
      id: 'phone-friendly',
      label: 'Phone-Friendly',
      icon: '🔗',
      description: 'QR, NFC, BT, or direct mobile-friendly links.',
      filters: { connectivity: ['QR', 'NFC', 'Bluetooth', 'USB-C'], minScore: 50 },
    },
  ],
  cards: [
    {
      id: 'self-custody',
      label: 'Self-Custody',
      icon: '🔐',
      description: 'Keep spending control outside exchanges.',
      filters: { custody: ['self'], minScore: 70 },
    },
    {
      id: 'no-fee',
      label: 'No Annual Fee',
      icon: '💳',
      description: 'Eliminate fixed card-cost drag.',
      filters: { noAnnualFee: true, minScore: 70 },
    },
    {
      id: 'us-cards',
      label: 'US Available',
      icon: '🌎',
      description: 'Quick shortlist for the US market.',
      filters: { region: ['US'], minScore: 70 },
    },
    {
      id: 'business',
      label: 'Business',
      icon: '🏢',
      description: 'Cards with business or corporate support.',
      filters: { businessSupport: true },
    },
  ],
  ramps: [
    {
      id: 'top-tier',
      label: 'Top Tier',
      icon: '🏆',
      description: 'Only the higher-scoring active ramps.',
      filters: { recommendation: ['recommended'], active: ['active'], minScore: 80 },
    },
    {
      id: 'low-fee',
      label: 'Low-Fee',
      icon: '⚡',
      description: 'Fee-model language biased toward lower friction.',
      filters: { search: 'low', minScore: 70 },
    },
    {
      id: 'enterprise',
      label: 'Enterprise',
      icon: '🏗️',
      description: 'Providers marketed for enterprise or custom flows.',
      filters: { search: 'enterprise', minScore: 70 },
    },
    {
      id: 'us-focus',
      label: 'US Focus',
      icon: '🌎',
      description: 'Coverage or best-fit language biased toward the US.',
      filters: { search: 'US', minScore: 70 },
    },
  ],
};

export const TAB_RESULT_LABELS: Record<ExploreTab, string> = {
  software: 'software wallets',
  hardware: 'hardware wallets',
  cards: 'crypto cards',
  ramps: 'ramp providers',
};

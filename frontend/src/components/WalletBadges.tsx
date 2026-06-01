'use client';

import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/Tooltip';
import { ScoreBreakdownBar } from '@/components/ScoreBreakdownBar';
import { cryptoCardTooltips, commonTooltips, softwareWalletTooltips } from '@/lib/tooltip-content';
import type { CryptoCard, WalletData, SupportedChains, SoftwareWallet } from '@/types/wallets';
import { CHAIN_ICONS } from '@/lib/chain-icons';
import Image from 'next/image';
import Link from 'next/link';
import {
  Smartphone,
  Globe,
  Monitor,
  Link as LinkIcon,
  Plus,
  Check,
  ExternalLink,
  SearchX,
  AlertTriangle,
} from 'lucide-react';

export const METHODOLOGY_TOOLTIP_LABEL = 'Read methodology';
export const DETAILS_TOOLTIP_LABEL = 'Open details';

// Badge component
export function Badge({
  children,
  variant = 'default',
  tooltip,
  tooltipLinkHref,
  tooltipLinkLabel = DETAILS_TOOLTIP_LABEL,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  tooltip?: string;
  tooltipLinkHref?: string;
  tooltipLinkLabel?: string;
}) {
  const variants = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const badge = (
    <span className={cn('px-2 py-0.5 text-xs rounded-full font-medium', variants[variant])}>
      {children}
    </span>
  );

  if (tooltip) {
    return <Tooltip content={tooltip} linkHref={tooltipLinkHref} linkLabel={tooltipLinkLabel}>{badge}</Tooltip>;
  }

  return badge;
}

export function buildScoreTooltip(wallet: WalletData): string {
  const lines = [
    `${wallet.name}: ${wallet.score}/100`,
    `Recommendation: ${wallet.recommendation}`,
    `Methodology: ${wallet.methodologyVersion}`,
  ];

  for (const entry of wallet.scoreBreakdown) {
    lines.push(`${entry.label}: ${entry.score}/${entry.max}`);
  }

  return lines.join('\n');
}

export function calculateMedianScore<T extends { score: number }>(items: T[]): number {
  if (items.length === 0) return 0;
  const sortedScores = items.map(item => item.score).sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedScores.length / 2);
  if (sortedScores.length % 2 === 0) {
    return (sortedScores[middleIndex - 1] + sortedScores[middleIndex]) / 2;
  }
  return sortedScores[middleIndex];
}

export function ScoreBreakdownPreview({
  breakdown,
  tooltipLinkHref,
}: {
  breakdown: WalletData['scoreBreakdown'];
  tooltipLinkHref: string;
}) {
  return (
    <Tooltip
      content="Breakdown by scoring category. Hover segments for category-level details."
      linkHref={tooltipLinkHref}
      linkLabel={METHODOLOGY_TOOLTIP_LABEL}
    >
      <div className="cursor-help">
        <ScoreBreakdownBar breakdown={breakdown} barClassName="h-1.5" />
      </div>
    </Tooltip>
  );
}

// Score badge
export function ScoreBadge({
  score,
  recommendation,
  scoreMedian: _scoreMedian,
  tooltip,
  tooltipLinkHref,
  tooltipLinkLabel = METHODOLOGY_TOOLTIP_LABEL,
}: {
  score: number;
  recommendation: string;
  scoreMedian: number;
  tooltip?: string;
  tooltipLinkHref?: string;
  tooltipLinkLabel?: string;
}) {
  let variant: 'success' | 'warning' | 'error' = 'warning';
  if (recommendation === 'avoid' || recommendation === 'not-for-dev') variant = 'error';
  else if (recommendation === 'recommended') variant = 'success';

  const badge = (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          'relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ring-1',
          variant === 'success' && 'bg-green-100 text-green-700 ring-green-200 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-800/50 dark:drop-shadow-[0_0_6px_rgba(74,222,128,0.4)]',
          variant === 'warning' && 'bg-yellow-100 text-yellow-700 ring-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-yellow-800/50 dark:drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]',
          variant === 'error' && 'bg-red-100 text-red-700 ring-red-200 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-800/50 dark:drop-shadow-[0_0_6px_rgba(248,113,113,0.4)]'
        )}
      >
        <span
          className={cn(
            'absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-1 ring-background/90',
            variant === 'success' && 'bg-green-500 dark:bg-green-400',
            variant === 'warning' && 'bg-yellow-500 dark:bg-yellow-400',
            variant === 'error' && 'bg-red-500 dark:bg-red-400'
          )}
          aria-hidden="true"
        />
        {score}
      </div>
      <div className="w-10 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full',
            variant === 'success' && 'bg-green-500 dark:bg-green-400',
            variant === 'warning' && 'bg-yellow-500 dark:bg-yellow-400',
            variant === 'error' && 'bg-red-500 dark:bg-red-400'
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );

  const defaultTooltip = `Score: ${score}/100\nRecommendation: ${recommendation}\nBanding: 🟢 top half, 🟡 middle quartile, 🔴 bottom quartile or inactive.`;

  return <Tooltip content={tooltip || defaultTooltip} linkHref={tooltipLinkHref} linkLabel={tooltipLinkLabel}>{badge}</Tooltip>;
}

export function CustodyBadge({
  custody,
  tooltipLinkHref,
}: {
  custody: CryptoCard['custody'];
  tooltipLinkHref?: string;
}) {
  const config = {
    self: { label: '🔐 Self', variant: 'success' as const },
    exchange: { label: '🏦 Exch', variant: 'warning' as const },
    cefi: { label: '📋 CeFi', variant: 'default' as const },
  };
  const entry = config[custody];
  const tooltip = cryptoCardTooltips.custody[custody];
  return (
    <Badge variant={entry.variant} tooltip={tooltip} tooltipLinkHref={tooltipLinkHref}>
      {entry.label}
    </Badge>
  );
}

export function BusinessSupportBadge({
  support,
  tooltipLinkHref,
}: {
  support: CryptoCard['businessSupport'];
  tooltipLinkHref?: string;
}) {
  const config = {
    yes: { label: '✅ Biz', variant: 'success' as const },
    no: { label: '❌ Personal', variant: 'default' as const },
    verify: { label: '⚠️ Verify Biz', variant: 'warning' as const },
  };
  const entry = config[support];
  const tooltip = cryptoCardTooltips.businessSupport[support];
  return (
    <Badge variant={entry.variant} tooltip={tooltip} tooltipLinkHref={tooltipLinkHref}>
      {entry.label}
    </Badge>
  );
}


export function StatusBadge({
  status,
  tooltip,
  tooltipLinkHref,
}: {
  status: 'active' | 'verify' | 'launching' | 'inactive';
  tooltip?: string;
  tooltipLinkHref?: string;
}) {
  const config = {
    active: { label: '✅ Active', variant: 'success' as const },
    verify: { label: '⚠️ Verify', variant: 'warning' as const },
    launching: { label: '🔄 Launching', variant: 'info' as const },
    inactive: { label: '❌ Inactive', variant: 'error' as const },
  };
  const entry = config[status];
  return (
    <Badge variant={entry.variant} tooltip={tooltip} tooltipLinkHref={tooltipLinkHref}>
      {entry.label}
    </Badge>
  );
}

export function FxFeeValue({
  fxFee,
  tooltipLinkHref,
}: {
  fxFee: string;
  tooltipLinkHref?: string;
}) {
  const lower = fxFee.toLowerCase();
  const numericMatch = fxFee.match(/(\d+(?:\.\d+)?)/);
  const numeric = numericMatch ? parseFloat(numericMatch[1]) : null;

  let className = 'text-muted-foreground';
  if (numeric === 0) className = 'text-green-600 dark:text-green-400 font-medium';
  else if (numeric !== null && numeric <= 1) className = 'text-blue-600 dark:text-blue-400 font-medium';
  else if (numeric !== null && numeric <= 2) className = 'text-yellow-600 dark:text-yellow-400 font-medium';
  else if (numeric !== null || lower.includes('tbd') || lower.includes('unknown')) className = 'text-red-600 dark:text-red-400 font-medium';

  return (
    <Tooltip content={`Foreign transaction fee: ${fxFee}`} linkHref={tooltipLinkHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
      <span className={className}>{fxFee}</span>
    </Tooltip>
  );
}

// ---------------------------------------------------------------------------
// Shared display utility components moved from WalletTable.tsx
// ---------------------------------------------------------------------------

export function EmptyState({
  type,
  onResetFilters,
}: {
  type: 'software' | 'hardware' | 'cards' | 'ramps';
  onResetFilters?: () => void;
}) {
  const config = {
    software: {
      title: 'No software wallets match your filters',
      description: 'Try widening platform, safety, or score filters.',
      iconColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/40',
    },
    hardware: {
      title: 'No hardware wallets match your filters',
      description: 'Try widening price, connectivity, or transparency filters.',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/40',
    },
    cards: {
      title: 'No crypto cards match your filters',
      description: 'Try widening region, custody, or cashback filters.',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
    },
    ramps: {
      title: 'No ramps match your filters',
      description: 'Try widening coverage, fee, or status filters.',
      iconColor: 'text-violet-400',
      borderColor: 'border-violet-500/40',
    },
  } as const;

  const state = config[type];

  return (
    <div className={cn('rounded-2xl border bg-background/50 p-8 text-center', state.borderColor)}>
      <SearchX className={cn('mx-auto h-10 w-10', state.iconColor)} />
      <h3 className="mt-4 text-lg font-semibold text-foreground">{state.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{state.description}</p>
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="mt-4 inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}

export function SelectionButton({
  isSelected,
  isAtMax,
  onToggleSelect,
  itemName,
  size = 'sm',
}: {
  isSelected: boolean;
  isAtMax: boolean;
  onToggleSelect: () => void;
  itemName: string;
  size?: 'sm' | 'lg';
}) {
  const disabled = !isSelected && isAtMax;
  return (
    <button
      onClick={onToggleSelect}
      disabled={disabled}
      aria-label={isSelected ? `Remove ${itemName} from comparison` : `Add ${itemName} to comparison`}
      title={isSelected ? 'Remove from comparison' : disabled ? 'Max 4 selected' : 'Add to comparison'}
      className={cn(
        'border transition-colors',
        size === 'sm' ? 'p-1 rounded' : 'p-2 rounded-lg',
        isSelected
          ? 'bg-primary text-primary-foreground border-primary'
          : disabled
          ? 'border-border opacity-30 cursor-not-allowed'
          : size === 'lg'
          ? 'border-border hover:border-primary hover:bg-muted'
          : 'border-border hover:border-primary'
      )}
    >
      {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );
}

export function getChainTooltip(chains: SupportedChains): string {
  const supported: string[] = [];
  if (chains.evm) supported.push('EVM (Ethereum, Polygon, Arbitrum, etc.)');
  if (chains.bitcoin) supported.push('Bitcoin');
  if (chains.solana) supported.push('Solana');
  if (chains.move) supported.push('Move (Sui, Aptos)');
  if (chains.cosmos) supported.push('Cosmos ecosystem');
  if (chains.polkadot) supported.push('Polkadot');
  if (chains.starknet) supported.push('Starknet');
  if (chains.other) supported.push('Other chains (TON, XRP, etc.)');
  return supported.length > 0 ? `Supported: ${supported.join(', ')}` : 'No chain support data';
}

export function getWalletDetailHref(type: 'software' | 'hardware' | 'cards' | 'ramps', id: string) {
  return `/wallets/${type}/${id}`;
}

export const TABLE_METHOD_LINKS = {
  software: '/docs/software-wallets-details#-wallet-scores-developer-focused-methodology',
  hardware: '/docs/hardware-wallets-details#-scoring-methodology',
  cards: '/docs/crypto-cards-details#scoring-methodology',
  ramps: '/docs/ramps-details#scoring-methodology',
} as const;

export function ChainIcons({
  chains,
  tooltipLinkHref,
}: {
  chains: SupportedChains;
  tooltipLinkHref?: string;
}) {
  return (
    <div className="flex items-center gap-0.5" title={getChainTooltip(chains)}>
      {CHAIN_ICONS.map(({ key, src, alt, tooltip }) =>
        chains[key] && (
          <Tooltip key={key} content={tooltip} linkHref={tooltipLinkHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <Image
              src={src}
              alt={alt}
              width={16}
              height={16}
              className="inline-block"
            />
          </Tooltip>
        )
      )}
      {chains.other && (
        <Tooltip content={commonTooltips.chains.other} linkHref={tooltipLinkHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
          <span className="text-xs text-muted-foreground ml-0.5">+</span>
        </Tooltip>
      )}
    </div>
  );
}

export function DeviceIcons({
  devices,
  tooltipLinkHref,
}: {
  devices: SoftwareWallet['devices'];
  tooltipLinkHref?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {devices.mobile && (
        <Tooltip content={softwareWalletTooltips.devices.mobile} linkHref={tooltipLinkHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
          <span>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </span>
        </Tooltip>
      )}
      {devices.browser && (
        <Tooltip content={softwareWalletTooltips.devices.browser} linkHref={tooltipLinkHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
          <span>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </span>
        </Tooltip>
      )}
      {devices.desktop && (
        <Tooltip content={softwareWalletTooltips.devices.desktop} linkHref={tooltipLinkHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
          <span>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </span>
        </Tooltip>
      )}
      {devices.web && (
        <Tooltip content={softwareWalletTooltips.devices.web} linkHref={tooltipLinkHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
          <span>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </span>
        </Tooltip>
      )}
    </div>
  );
}

export function FeatureIndicator({
  value,
  label,
  tooltip,
  tooltipLinkHref,
}: {
  value: boolean | string;
  label: string;
  tooltip?: string;
  tooltipLinkHref?: string;
}) {
  const getTooltipContent = () => {
    if (tooltip) return tooltip;
    if (typeof value === 'boolean') {
      return value ? `${label}: Supported` : `${label}: Not supported`;
    }
    return `${label}: ${value}`;
  };

  if (typeof value === 'boolean') {
    return (
      <Tooltip content={getTooltipContent()} linkHref={tooltipLinkHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
        <span
          className={cn(
            'inline-flex items-center justify-center w-5 h-5 rounded-full',
            value ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-muted text-muted-foreground'
          )}
        >
          {value ? <Check className="h-3 w-3" /> : '−'}
        </span>
      </Tooltip>
    );
  }

  const isPartial = value === 'partial' || value === 'basic' || value === 'import';
  const isFull = value === 'full' || value === 'recent' || value === 'open' || value === 'active';

  return (
    <Tooltip content={getTooltipContent()} linkHref={tooltipLinkHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
      <span
        className={cn(
          'inline-flex items-center justify-center w-5 h-5 rounded-full text-xs',
          isFull && 'bg-green-100 text-green-600 dark:bg-green-900/30',
          isPartial && 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30',
          !isFull && !isPartial && 'bg-muted text-muted-foreground'
        )}
      >
        {isFull ? '✓' : isPartial ? '~' : '−'}
      </span>
    </Tooltip>
  );
}

export interface WalletItemCardProps {
  item: WalletData;
  isSelected: boolean;
  isAtMax: boolean;
  onToggleSelect: () => void;
  methodLink: string;
  detailHref: string;
  scoreMedian: number;
  nameSlot?: React.ReactNode;
  subNameSlot?: React.ReactNode;
  children: React.ReactNode;
}

export function WalletItemCard({
  item,
  isSelected,
  isAtMax,
  onToggleSelect,
  methodLink,
  detailHref,
  scoreMedian,
  nameSlot,
  subNameSlot,
  children,
}: WalletItemCardProps) {
  return (
    <div
      className={cn(
        'p-3 sm:p-4 border rounded-lg transition-all animate-slide-up',
        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <ScoreBadge
            score={item.score}
            recommendation={item.recommendation}
            scoreMedian={scoreMedian}
            tooltip={buildScoreTooltip(item)}
            tooltipLinkHref={methodLink}
          />
          <div>
            {nameSlot ?? (
              <Link href={detailHref} className="font-semibold hover:underline">
                {item.name}
              </Link>
            )}
            {subNameSlot}
          </div>
        </div>
        <SelectionButton isSelected={isSelected} isAtMax={isAtMax} onToggleSelect={onToggleSelect} itemName={item.name} size="lg" />
      </div>

      {children}

      <div className="mb-0">
        <ScoreBreakdownPreview breakdown={item.scoreBreakdown} tooltipLinkHref={methodLink} />
      </div>
    </div>
  );
}

// Re-export ExternalLink icon for use in WalletTable item renderers
export { ExternalLink, AlertTriangle };

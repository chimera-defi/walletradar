'use client';

import {
  ExternalLink,
  Github,
  Shield,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { Tooltip, HeaderTooltip } from '@/components/Tooltip';
import {
  softwareWalletTooltips,
  hardwareWalletTooltips,
  cryptoCardTooltips,
  rampTooltips,
  commonTooltips,
} from '@/lib/tooltip-content';
import type { CryptoCard, HardwareWallet, Ramp, SoftwareWallet, WalletData } from '@/types/wallets';
import {
  METHODOLOGY_TOOLTIP_LABEL,
  DETAILS_TOOLTIP_LABEL,
  TABLE_METHOD_LINKS,
  getWalletDetailHref,
  buildScoreTooltip,
  calculateMedianScore,
  Badge,
  ScoreBadge,
  CustodyBadge,
  BusinessSupportBadge,
  StatusBadge,
  FxFeeValue,
  EmptyState,
  SelectionButton,
  ChainIcons,
  DeviceIcons,
  FeatureIndicator,
  WalletItemCard,
} from '@/components/WalletBadges';

export type { CryptoCard, HardwareWallet, Ramp, SoftwareWallet, WalletData };

type SelectableItemProps = {
  isSelected: boolean;
  isAtMax: boolean;
  onToggleSelect: () => void;
  viewMode: 'grid' | 'table';
  detailHref: string;
  scoreMedian: number;
};

function getCardStatusTooltip(status: CryptoCard['status']) {
  if (status === 'inactive') return 'Inactive: Card is unavailable or discontinued';
  return cryptoCardTooltips.status[status];
}

function getRampStatusTooltip(status: Ramp['status']) {
  if (status === 'inactive') return 'Inactive: Provider is unavailable or paused';
  return rampTooltips.status[status];
}

// Software wallet row/card
function SoftwareWalletItem({
  wallet,
  isSelected,
  isAtMax,
  onToggleSelect,
  viewMode,
  detailHref,
  scoreMedian,
}: { wallet: SoftwareWallet } & SelectableItemProps) {
  if (viewMode === 'table') {
    return (
      <tr className="border-b border-border odd:bg-muted/10 hover:bg-muted/50 transition-colors animate-slide-up">
        <td className="py-3 px-4">
          <SelectionButton isSelected={isSelected} isAtMax={isAtMax} onToggleSelect={onToggleSelect} itemName={wallet.name} size="sm" />
        </td>
        <td className="py-3 px-4">
          <div className="flex justify-center">
            <ScoreBadge
              score={wallet.score}
              recommendation={wallet.recommendation}
              scoreMedian={scoreMedian}
              tooltip={buildScoreTooltip(wallet)}
              tooltipLinkHref={TABLE_METHOD_LINKS.software}
            />
          </div>
        </td>
        <td className="py-3 px-4">
          <Link href={detailHref} className="font-semibold hover:underline">
            {wallet.name}
          </Link>
          <div className="text-sm text-muted-foreground">{wallet.bestFor}</div>
        </td>
        <td className="py-3 px-4">
          <DeviceIcons devices={wallet.devices} tooltipLinkHref={detailHref} />
        </td>
        <td className="py-3 px-4 text-sm">
          <ChainIcons chains={wallet.chains} tooltipLinkHref={detailHref} />
        </td>
        <td className="py-3 px-4">
          <div className="flex gap-1">
            <FeatureIndicator value={wallet.txSimulation} label="Tx Simulation" tooltip={softwareWalletTooltips.features.txSimulation} tooltipLinkHref={detailHref} />
            <FeatureIndicator value={wallet.scamAlerts} label="Scam Alerts" tooltip={softwareWalletTooltips.features.scamAlerts} tooltipLinkHref={detailHref} />
            <FeatureIndicator value={wallet.hardwareSupport} label="HW Support" tooltip={softwareWalletTooltips.features.hardwareSupport} tooltipLinkHref={detailHref} />
          </div>
        </td>
        <td className="py-3 px-4">
          <Badge
            variant={wallet.license === 'open' ? 'success' : wallet.license === 'partial' ? 'warning' : 'default'}
            tooltip={softwareWalletTooltips.license[wallet.license]}
            tooltipLinkHref={detailHref}
          >
            {wallet.licenseType}
          </Badge>
        </td>
        <td className="py-3 px-4">
          {wallet.github && (
            <a
              href={wallet.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
        </td>
      </tr>
    );
  }

  return (
    <WalletItemCard
      item={wallet}
      isSelected={isSelected}
      isAtMax={isAtMax}
      onToggleSelect={onToggleSelect}
      methodLink={TABLE_METHOD_LINKS.software}
      detailHref={detailHref}
      scoreMedian={scoreMedian}
    >
      <p className="text-sm text-muted-foreground mb-3">{wallet.bestFor}</p>

      <div className="flex items-center gap-4 mb-3">
        <DeviceIcons devices={wallet.devices} tooltipLinkHref={detailHref} />
        <ChainIcons chains={wallet.chains} tooltipLinkHref={detailHref} />
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {wallet.txSimulation && (
          <Badge variant="info" tooltip={softwareWalletTooltips.features.txSimulation} tooltipLinkHref={detailHref}>
            <Shield className="h-3 w-3 inline mr-1" />
            Tx Sim
          </Badge>
        )}
        {wallet.scamAlerts !== 'none' && (
          <Badge variant="warning" tooltip={softwareWalletTooltips.features.scamAlerts} tooltipLinkHref={detailHref}>
            <AlertTriangle className="h-3 w-3 inline mr-1" />
            Scam Alerts
          </Badge>
        )}
        {wallet.hardwareSupport && (
          <Badge variant="default" tooltip={softwareWalletTooltips.features.hardwareSupport} tooltipLinkHref={detailHref}>
            <Zap className="h-3 w-3 inline mr-1" />
            HW
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between text-sm mb-3">
        <Badge
          variant={wallet.license === 'open' ? 'success' : wallet.license === 'partial' ? 'warning' : 'default'}
          tooltip={softwareWalletTooltips.license[wallet.license]}
          tooltipLinkHref={detailHref}
        >
          {wallet.licenseType}
        </Badge>
        {wallet.github && (
          <a
            href={wallet.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        )}
      </div>
    </WalletItemCard>
  );
}

// Hardware wallet row/card
function HardwareWalletItem({
  wallet,
  isSelected,
  isAtMax,
  onToggleSelect,
  viewMode,
  detailHref,
  scoreMedian,
}: { wallet: HardwareWallet } & SelectableItemProps) {
  if (viewMode === 'table') {
    return (
      <tr className="border-b border-border odd:bg-muted/10 hover:bg-muted/50 transition-colors animate-slide-up">
        <td className="py-3 px-4">
          <SelectionButton isSelected={isSelected} isAtMax={isAtMax} onToggleSelect={onToggleSelect} itemName={wallet.name} size="sm" />
        </td>
        <td className="py-3 px-4">
          <div className="flex justify-center">
            <ScoreBadge
              score={wallet.score}
              recommendation={wallet.recommendation}
              scoreMedian={scoreMedian}
              tooltip={buildScoreTooltip(wallet)}
              tooltipLinkHref={TABLE_METHOD_LINKS.hardware}
            />
          </div>
        </td>
        <td className="py-3 px-4">
          <Link href={detailHref} className="font-semibold hover:underline">
            {wallet.name}
          </Link>
          <div className="text-sm text-muted-foreground">{wallet.priceText}</div>
          {wallet.priceLastChecked && (
            <div className="text-xs text-muted-foreground">
              Price checked {wallet.priceLastChecked}
            </div>
          )}
        </td>
        <td className="py-3 px-4">
          <FeatureIndicator
            value={wallet.airGap}
            label="Air-Gapped"
            tooltip={wallet.airGap ? hardwareWalletTooltips.airGap.true : hardwareWalletTooltips.airGap.false}
            tooltipLinkHref={detailHref}
          />
        </td>
        <td className="py-3 px-4">
          <FeatureIndicator
            value={wallet.secureElement}
            label="Secure Element"
            tooltip={wallet.secureElement ? hardwareWalletTooltips.secureElement.true : hardwareWalletTooltips.secureElement.false}
            tooltipLinkHref={detailHref}
          />
        </td>
        <td className="py-3 px-4">
          <Badge
            variant={wallet.openSource === 'full' ? 'success' : wallet.openSource === 'partial' ? 'warning' : 'default'}
            tooltip={hardwareWalletTooltips.openSource[wallet.openSource]}
            tooltipLinkHref={detailHref}
          >
            {wallet.openSource === 'full' ? 'Open' : wallet.openSource === 'partial' ? 'Partial' : 'Closed'}
          </Badge>
        </td>
        <td className="py-3 px-4 text-sm">
          <Tooltip content={`Connectivity options: ${wallet.connectivity.join(', ')}`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span>{wallet.connectivity.join(', ')}</span>
          </Tooltip>
        </td>
        <td className="py-3 px-4">
          <div className="flex gap-2">
            {wallet.github && (
              <a
                href={wallet.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {wallet.url && (
              <a
                href={wallet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </td>
      </tr>
    );
  }

  return (
    <WalletItemCard
      item={wallet}
      isSelected={isSelected}
      isAtMax={isAtMax}
      onToggleSelect={onToggleSelect}
      methodLink={TABLE_METHOD_LINKS.hardware}
      detailHref={detailHref}
      scoreMedian={scoreMedian}
    >
      <p className="text-lg font-semibold text-primary mb-1">{wallet.priceText}</p>
      {wallet.priceLastChecked && (
        <p className="text-xs text-muted-foreground mb-2">Price checked {wallet.priceLastChecked}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {wallet.airGap && (
          <Badge variant="success" tooltip={hardwareWalletTooltips.airGap.true} tooltipLinkHref={detailHref}>Air-Gapped</Badge>
        )}
        {wallet.secureElement && (
          <Badge variant="info" tooltip={hardwareWalletTooltips.secureElement.true} tooltipLinkHref={detailHref}>
            SE: {wallet.secureElementType || 'Yes'}
          </Badge>
        )}
        <Badge
          variant={wallet.openSource === 'full' ? 'success' : wallet.openSource === 'partial' ? 'warning' : 'default'}
          tooltip={hardwareWalletTooltips.openSource[wallet.openSource]}
          tooltipLinkHref={detailHref}
        >
          {wallet.openSource === 'full' ? 'Open Source' : wallet.openSource === 'partial' ? 'Partial OS' : 'Closed'}
        </Badge>
      </div>

      <Tooltip content={`Display: ${wallet.display}, Connectivity: ${wallet.connectivity.join(', ')}`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
        <div className="text-sm text-muted-foreground mb-3 cursor-help">
          {wallet.display} • {wallet.connectivity.join(', ')}
        </div>
      </Tooltip>

      <div className="flex items-center gap-2 mb-3">
        {wallet.github && (
          <a
            href={wallet.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
          >
            <Github className="h-4 w-4" />
          </a>
        )}
        {wallet.url && (
          <a
            href={wallet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
          >
            <ExternalLink className="h-4 w-4" />
            Website
          </a>
        )}
      </div>
    </WalletItemCard>
  );
}

// Crypto card row/card
function CryptoCardItem({
  card,
  isSelected,
  isAtMax,
  onToggleSelect,
  viewMode,
  detailHref,
  scoreMedian,
}: { card: CryptoCard } & SelectableItemProps) {
  if (viewMode === 'table') {
    return (
      <tr className="border-b border-border odd:bg-muted/10 hover:bg-muted/50 transition-colors animate-slide-up">
        <td className="py-3 px-4">
          <SelectionButton isSelected={isSelected} isAtMax={isAtMax} onToggleSelect={onToggleSelect} itemName={card.name} size="sm" />
        </td>
        <td className="py-3 px-4">
          <div className="flex justify-center">
            <ScoreBadge
              score={card.score}
              recommendation={card.recommendation}
              scoreMedian={scoreMedian}
              tooltip={buildScoreTooltip(card)}
              tooltipLinkHref={TABLE_METHOD_LINKS.cards}
            />
          </div>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <Link href={detailHref} className="font-semibold hover:underline">
              {card.name}
            </Link>
            {card.providerUrl && (
              <a
                href={card.providerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{card.bestFor}</div>
        </td>
        <td className="py-3 px-4">
          <Badge variant="info" tooltip={cryptoCardTooltips.cardType[card.cardType]} tooltipLinkHref={detailHref}>{card.cardType}</Badge>
        </td>
        <td className="py-3 px-4">
          <CustodyBadge custody={card.custody} tooltipLinkHref={detailHref} />
        </td>
        <td className="py-3 px-4 text-sm">
          <Tooltip content={cryptoCardTooltips.region[card.regionCode as keyof typeof cryptoCardTooltips.region] || `Available in ${card.region}`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span>{card.region}</span>
          </Tooltip>
        </td>
        <td className="py-3 px-4">
          <Tooltip content="Maximum cashback rate (may require staking or tier progression)" linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span className="font-semibold text-green-600 dark:text-green-400">{card.cashBack}</span>
          </Tooltip>
        </td>
        <td className="py-3 px-4 text-sm">
          <FxFeeValue fxFee={card.fxFee} tooltipLinkHref={detailHref} />
        </td>
        <td className="py-3 px-4 text-sm">
          <Tooltip content={`Rewards earned: ${card.rewards}`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span>{card.rewards}</span>
          </Tooltip>
        </td>
        <td className="py-3 px-4 text-sm">
          <Tooltip content={card.annualFee === '$0' ? 'No annual fee' : `Annual fee: ${card.annualFee}`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span>{card.annualFee}</span>
          </Tooltip>
        </td>
        <td className="py-3 px-4">
          <BusinessSupportBadge support={card.businessSupport} tooltipLinkHref={detailHref} />
        </td>
        <td className="py-3 px-4">
          <StatusBadge
            status={card.status}
            tooltip={getCardStatusTooltip(card.status)}
            tooltipLinkHref={detailHref}
          />
        </td>
      </tr>
    );
  }

  return (
    <WalletItemCard
      item={card}
      isSelected={isSelected}
      isAtMax={isAtMax}
      onToggleSelect={onToggleSelect}
      methodLink={TABLE_METHOD_LINKS.cards}
      detailHref={detailHref}
      scoreMedian={scoreMedian}
      nameSlot={
        <div className="flex items-center gap-2">
          <Link href={detailHref} className="font-semibold hover:underline">
            {card.name}
          </Link>
          {card.providerUrl && (
            <a
              href={card.providerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      }
      subNameSlot={
        <div className="mt-1 flex flex-wrap gap-2">
          <Badge variant="info" tooltip={cryptoCardTooltips.cardType[card.cardType]} tooltipLinkHref={detailHref}>{card.cardType}</Badge>
          <CustodyBadge custody={card.custody} tooltipLinkHref={detailHref} />
        </div>
      }
    >
      <Tooltip content="Maximum cashback rate (may require staking or tier progression)" linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2 cursor-help">
          {card.cashBack}
        </div>
      </Tooltip>

      <p className="text-sm text-muted-foreground mb-3">{card.bestFor}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <Badge variant="default" tooltip={cryptoCardTooltips.region[card.regionCode as keyof typeof cryptoCardTooltips.region] || `Available in ${card.region}`} tooltipLinkHref={detailHref}>
          {card.region}
        </Badge>
        <Badge variant="default" tooltip={`Rewards earned: ${card.rewards}`} tooltipLinkHref={detailHref}>{card.rewards}</Badge>
        <BusinessSupportBadge support={card.businessSupport} tooltipLinkHref={detailHref} />
        <StatusBadge
          status={card.status}
          tooltip={getCardStatusTooltip(card.status)}
          tooltipLinkHref={detailHref}
        />
      </div>

      <div className="flex items-center justify-between text-sm mb-3">
        <Tooltip content={`Annual fee: ${card.annualFee}, Foreign exchange fee: ${card.fxFee}`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
          <span className="text-muted-foreground cursor-help">
            Fee: {card.annualFee} | FX: {card.fxFee}
          </span>
        </Tooltip>
        {card.providerUrl && (
          <a
            href={card.providerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Apply
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </WalletItemCard>
  );
}

// Ramp row/card
function RampItem({
  ramp,
  isSelected,
  isAtMax,
  onToggleSelect,
  viewMode,
  detailHref,
  scoreMedian,
}: { ramp: Ramp } & SelectableItemProps) {
  const fundingEmoji = ramp.funding === 'sustainable' ? '🟢' : ramp.funding === 'vc' ? '🟡' : '🔴';

  if (viewMode === 'table') {
    return (
      <tr className="border-b border-border odd:bg-muted/10 hover:bg-muted/50 transition-colors animate-slide-up">
        <td className="py-3 px-4">
          <SelectionButton isSelected={isSelected} isAtMax={isAtMax} onToggleSelect={onToggleSelect} itemName={ramp.name} size="sm" />
        </td>
        <td className="py-3 px-4">
          <div className="flex justify-center">
            <ScoreBadge
              score={ramp.score}
              recommendation={ramp.recommendation}
              scoreMedian={scoreMedian}
              tooltip={buildScoreTooltip(ramp)}
              tooltipLinkHref={TABLE_METHOD_LINKS.ramps}
            />
          </div>
        </td>
        <td className="py-3 px-4">
          <div className="font-semibold">
            <Link href={detailHref} className="text-foreground hover:text-primary hover:underline">
              {ramp.name}
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">{ramp.bestFor}</div>
        </td>
        <td className="py-3 px-4">
          <div className="flex gap-2">
            {ramp.onRamp && (
              <Badge variant="success" tooltip="On-Ramp: Convert fiat currency to crypto" tooltipLinkHref={detailHref}>On-Ramp</Badge>
            )}
            {ramp.offRamp && (
              <Badge variant="info" tooltip="Off-Ramp: Convert crypto to fiat currency" tooltipLinkHref={detailHref}>Off-Ramp</Badge>
            )}
          </div>
        </td>
        <td className="py-3 px-4 text-sm">
          <Tooltip content={`Geographic coverage: ${ramp.coverage}`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span>{ramp.coverage}</span>
          </Tooltip>
        </td>
        <td className="py-3 px-4 text-sm">
          <Tooltip content={rampTooltips.feeModel[ramp.feeModel as keyof typeof rampTooltips.feeModel] || `Fee model: ${ramp.feeModel}`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span>{ramp.feeModel}</span>
          </Tooltip>
        </td>
        <td className="py-3 px-4 text-sm">
          <Tooltip content={`Minimum transaction fee (approximate): ${ramp.minFee}`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span>{ramp.minFee}</span>
          </Tooltip>
        </td>
        <td className="py-3 px-4 text-sm">
          <Tooltip content={rampTooltips.devUx[ramp.devUx as keyof typeof rampTooltips.devUx] || `Developer experience: ${ramp.devUx}`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span>{ramp.devUx}</span>
          </Tooltip>
        </td>
        <td className="py-3 px-4">
          <StatusBadge
            status={ramp.status}
            tooltip={getRampStatusTooltip(ramp.status)}
            tooltipLinkHref={detailHref}
          />
        </td>
        <td className="py-3 px-4 text-sm">
          <Tooltip content={`Founded year signal: ${ramp.foundedYear ?? 'Unknown'}`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span>{ramp.foundedYear ?? 'Unknown'}</span>
          </Tooltip>
        </td>
        <td className="py-3 px-4 text-sm">
          <Tooltip content={`Funding durability signal: ${ramp.fundingSource} (${ramp.funding})`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span>{fundingEmoji} {ramp.fundingSource}</span>
          </Tooltip>
        </td>
        <td className="py-3 px-4">
          {ramp.url && (
            <a
              href={ramp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
              title={`Visit ${ramp.name} website`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </td>
      </tr>
    );
  }

  return (
    <WalletItemCard
      item={ramp}
      isSelected={isSelected}
      isAtMax={isAtMax}
      onToggleSelect={onToggleSelect}
      methodLink={TABLE_METHOD_LINKS.ramps}
      detailHref={detailHref}
      scoreMedian={scoreMedian}
    >
      <p className="text-sm text-muted-foreground mb-3">{ramp.bestFor}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {ramp.onRamp && (
          <Badge variant="success" tooltip="On-Ramp: Convert fiat currency to crypto" tooltipLinkHref={detailHref}>On-Ramp</Badge>
        )}
        {ramp.offRamp && (
          <Badge variant="info" tooltip="Off-Ramp: Convert crypto to fiat currency" tooltipLinkHref={detailHref}>Off-Ramp</Badge>
        )}
        <Badge variant="default" tooltip={`Geographic coverage: ${ramp.coverage}`} tooltipLinkHref={detailHref}>{ramp.coverage}</Badge>
        <StatusBadge
          status={ramp.status}
          tooltip={getRampStatusTooltip(ramp.status)}
          tooltipLinkHref={detailHref}
        />
      </div>

      <div className="space-y-1 text-sm mb-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fee Model:</span>
          <Tooltip content={rampTooltips.feeModel[ramp.feeModel as keyof typeof rampTooltips.feeModel] || `Fee model: ${ramp.feeModel}`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span className="font-medium cursor-help">{ramp.feeModel}</span>
          </Tooltip>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Min Fee:</span>
          <Tooltip content={`Minimum transaction fee (approximate): ${ramp.minFee}`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span className="font-medium cursor-help">{ramp.minFee}</span>
          </Tooltip>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Dev UX:</span>
          <Tooltip content={rampTooltips.devUx[ramp.devUx as keyof typeof rampTooltips.devUx] || `Developer experience: ${ramp.devUx}`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span className="font-medium cursor-help">{ramp.devUx}</span>
          </Tooltip>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Founded:</span>
          <Tooltip content={`Founded year signal: ${ramp.foundedYear ?? 'Unknown'}`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span className="font-medium cursor-help">{ramp.foundedYear ?? 'Unknown'}</span>
          </Tooltip>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Funding:</span>
          <Tooltip content={`Funding durability signal: ${ramp.fundingSource} (${ramp.funding})`} linkHref={detailHref} linkLabel={DETAILS_TOOLTIP_LABEL}>
            <span className="font-medium cursor-help text-right">{fundingEmoji} {ramp.fundingSource}</span>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm mb-3">
        {ramp.url && (
          <a
            href={ramp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Visit Website
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </WalletItemCard>
  );
}


// Main table/grid component
interface WalletTableProps<T extends WalletData> {
  wallets: T[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  viewMode?: 'grid' | 'table';
  type: 'software' | 'hardware' | 'cards' | 'ramps';
  maxSelected?: number;
  onResetFilters?: () => void;
}

export function WalletTable<T extends WalletData>({
  wallets,
  selectedIds,
  onToggleSelect,
  viewMode = 'grid',
  type,
  maxSelected = 4,
  onResetFilters,
}: WalletTableProps<T>) {
  const isAtMax = selectedIds.length >= maxSelected;
  const headerMethodLink = TABLE_METHOD_LINKS[type];
  const mobileHeaderCellClassName =
    'py-3 px-4 text-left text-sm font-medium sticky top-0 z-20 border-b border-border bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/80 sm:static sm:bg-transparent sm:backdrop-blur-0';

  if (wallets.length === 0) {
    return <EmptyState type={type} onResetFilters={onResetFilters} />;
  }
  const scoreMedian = calculateMedianScore(wallets);

  if (viewMode === 'table') {
    return (
      <>
        <p className="mb-2 text-xs text-muted-foreground sm:hidden">
          Swipe horizontally to view all columns.
        </p>
        <div className="max-h-[70vh] overflow-auto overscroll-contain [WebkitOverflowScrolling:touch] border border-border rounded-lg sm:max-h-none sm:overflow-visible sm:border-0 sm:rounded-none">
          <table className="w-full">
          <thead>
            <tr>
              <th className={mobileHeaderCellClassName}>
                <HeaderTooltip label="Compare" tooltip={softwareWalletTooltips.headers.compare} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
              </th>
              <th className={mobileHeaderCellClassName}>
                <HeaderTooltip label="Score" tooltip={commonTooltips.score} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
              </th>
              <th className={mobileHeaderCellClassName}>
                <HeaderTooltip label="Wallet" tooltip={softwareWalletTooltips.headers.wallet} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
              </th>
              {type === 'cards' && (
                <th className={mobileHeaderCellClassName}>
                  <HeaderTooltip label="Type" tooltip={cryptoCardTooltips.headers.cardType} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                </th>
              )}
              {type === 'software' && (
                <>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Platforms" tooltip={softwareWalletTooltips.headers.platforms} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Chains" tooltip={softwareWalletTooltips.headers.chains} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Features" tooltip={softwareWalletTooltips.headers.features} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="License" tooltip={softwareWalletTooltips.headers.license} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                </>
              )}
              {type === 'hardware' && (
                <>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Air-Gap" tooltip={hardwareWalletTooltips.headers.airGap} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="SE" tooltip={hardwareWalletTooltips.headers.secureElement} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Open Source" tooltip={hardwareWalletTooltips.headers.openSource} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Connectivity" tooltip={hardwareWalletTooltips.headers.connectivity} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                </>
              )}
              {type === 'cards' && (
                <>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Custody" tooltip={cryptoCardTooltips.headers.custody} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Region" tooltip={cryptoCardTooltips.headers.region} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Cashback" tooltip={cryptoCardTooltips.headers.cashback} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="FX Fee" tooltip={cryptoCardTooltips.headers.fxFee} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Rewards" tooltip={cryptoCardTooltips.headers.rewards} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Annual Fee" tooltip={cryptoCardTooltips.headers.annualFee} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Business" tooltip={cryptoCardTooltips.headers.business} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Status" tooltip={cryptoCardTooltips.headers.status} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                </>
              )}
              {type === 'ramps' && (
                <>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Type" tooltip={rampTooltips.headers.type} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Coverage" tooltip={rampTooltips.headers.coverage} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Fee Model" tooltip={rampTooltips.headers.feeModel} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Min Fee" tooltip={rampTooltips.headers.minFee} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Dev UX" tooltip={rampTooltips.headers.devUx} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip
                      label="Status"
                      tooltip="Operational status: ✅ active, ⚠️ verify, 🔄 launching, ❌ inactive."
                      linkHref={headerMethodLink}
                      linkLabel={METHODOLOGY_TOOLTIP_LABEL}
                    />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Founded" tooltip={rampTooltips.headers.founded} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Funding" tooltip={rampTooltips.headers.funding} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                  <th className={mobileHeaderCellClassName}>
                    <HeaderTooltip label="Links" tooltip={rampTooltips.headers.links} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                  </th>
                </>
              )}
              {(type === 'software' || type === 'hardware') && (
                <th className={mobileHeaderCellClassName}>
                  <HeaderTooltip label="Links" tooltip={softwareWalletTooltips.headers.links} linkHref={headerMethodLink} linkLabel={METHODOLOGY_TOOLTIP_LABEL} />
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {wallets.map(wallet => {
              const isSelected = selectedIds.includes(wallet.id);
              if (type === 'software') {
                return (
                  <SoftwareWalletItem
                    key={wallet.id}
                    wallet={wallet as SoftwareWallet}
                    isSelected={isSelected}
                    isAtMax={isAtMax}
                    onToggleSelect={() => onToggleSelect(wallet.id)}
                    viewMode="table"
                    detailHref={getWalletDetailHref('software', wallet.id)}
                    scoreMedian={scoreMedian}
                  />
                );
              }
              if (type === 'hardware') {
                return (
                  <HardwareWalletItem
                    key={wallet.id}
                    wallet={wallet as HardwareWallet}
                    isSelected={isSelected}
                    isAtMax={isAtMax}
                    onToggleSelect={() => onToggleSelect(wallet.id)}
                    viewMode="table"
                    detailHref={getWalletDetailHref('hardware', wallet.id)}
                    scoreMedian={scoreMedian}
                  />
                );
              }
              if (type === 'cards') {
                return (
                  <CryptoCardItem
                    key={wallet.id}
                    card={wallet as CryptoCard}
                    isSelected={isSelected}
                    isAtMax={isAtMax}
                    onToggleSelect={() => onToggleSelect(wallet.id)}
                    viewMode="table"
                    detailHref={getWalletDetailHref('cards', wallet.id)}
                    scoreMedian={scoreMedian}
                  />
                );
              }
              return (
                <RampItem
                  key={wallet.id}
                  ramp={wallet as Ramp}
                  isSelected={isSelected}
                  isAtMax={isAtMax}
                  onToggleSelect={() => onToggleSelect(wallet.id)}
                  viewMode="table"
                  detailHref={getWalletDetailHref('ramps', wallet.id)}
                  scoreMedian={scoreMedian}
                />
              );
            })}
          </tbody>
          </table>
        </div>
      </>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {wallets.map(wallet => {
        const isSelected = selectedIds.includes(wallet.id);
        if (type === 'software') {
          return (
            <SoftwareWalletItem
              key={wallet.id}
              wallet={wallet as SoftwareWallet}
              isSelected={isSelected}
              isAtMax={isAtMax}
              onToggleSelect={() => onToggleSelect(wallet.id)}
              viewMode="grid"
              detailHref={getWalletDetailHref('software', wallet.id)}
              scoreMedian={scoreMedian}
            />
          );
        }
        if (type === 'hardware') {
          return (
            <HardwareWalletItem
              key={wallet.id}
              wallet={wallet as HardwareWallet}
              isSelected={isSelected}
              isAtMax={isAtMax}
              onToggleSelect={() => onToggleSelect(wallet.id)}
              viewMode="grid"
              detailHref={getWalletDetailHref('hardware', wallet.id)}
              scoreMedian={scoreMedian}
            />
          );
        }
        if (type === 'cards') {
          return (
            <CryptoCardItem
              key={wallet.id}
              card={wallet as CryptoCard}
              isSelected={isSelected}
              isAtMax={isAtMax}
              onToggleSelect={() => onToggleSelect(wallet.id)}
              viewMode="grid"
              detailHref={getWalletDetailHref('cards', wallet.id)}
              scoreMedian={scoreMedian}
            />
          );
        }
        return (
          <RampItem
            key={wallet.id}
            ramp={wallet as Ramp}
            isSelected={isSelected}
            isAtMax={isAtMax}
            onToggleSelect={() => onToggleSelect(wallet.id)}
            viewMode="grid"
            detailHref={getWalletDetailHref('ramps', wallet.id)}
            scoreMedian={scoreMedian}
          />
        );
      })}
    </div>
  );
}

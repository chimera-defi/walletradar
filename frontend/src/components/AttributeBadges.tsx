import type { CardAttributes, SourcedAttribute, WalletAttributes } from '@/types/wallets';
import { cn } from '@/lib/utils';

type Tone = 'good' | 'neutral';

interface AttributeView {
  key: string;
  label: string;
  attr?: SourcedAttribute;
  /** value -> [display text, tone]. Values not listed (and "unknown") render as "not evaluated". */
  display: Record<string, [string, Tone]>;
}

const NOT_EVALUATED = 'Not evaluated';

const BUG_BOUNTY: AttributeView['display'] = {
  active: ['Active program', 'good'],
  inactive: ['Program inactive', 'neutral'],
  none: ['No program listed', 'neutral'],
};
const REPRODUCIBLE: AttributeView['display'] = {
  reproducible: ['Reproducible', 'good'],
  sourceavailable: ['Source available, not verified reproducible', 'neutral'],
  nosource: ['No public source', 'neutral'],
  ftbfs: ['Build does not reproduce', 'neutral'],
  nonverifiable: ['Not verifiable', 'neutral'],
  wip: ['Verification in progress', 'neutral'],
};
const CHAIN_VERIFICATION: AttributeView['display'] = {
  supported: ['Supported', 'good'],
  none: ['None listed', 'neutral'],
};
const NETWORK: AttributeView['display'] = {
  Visa: ['Visa', 'neutral'],
  Mastercard: ['Mastercard', 'neutral'],
  Amex: ['Amex', 'neutral'],
};
const KYC: AttributeView['display'] = {
  required: ['KYC required', 'neutral'],
  not_required: ['No KYC required', 'neutral'],
};

export function walletAttributeViews(a?: WalletAttributes): AttributeView[] {
  return [
    { key: 'bug', label: 'Bug bounty', attr: a?.bugBounty, display: BUG_BOUNTY },
    { key: 'repro', label: 'Reproducible build', attr: a?.reproducibleBuild, display: REPRODUCIBLE },
    { key: 'chain', label: 'On-chain verification', attr: a?.chainVerification, display: CHAIN_VERIFICATION },
  ];
}

export function cardAttributeViews(a?: CardAttributes): AttributeView[] {
  return [
    { key: 'network', label: 'Card network', attr: a?.cardNetwork, display: NETWORK },
    { key: 'kyc', label: 'KYC', attr: a?.kycRequirement, display: KYC },
  ];
}

function resolve(view: AttributeView): { text: string; tone: Tone; known: boolean } {
  const entry = view.attr ? view.display[view.attr.value] : undefined;
  return entry ? { text: entry[0], tone: entry[1], known: true } : { text: NOT_EVALUATED, tone: 'neutral', known: false };
}

const toneClass: Record<Tone, string> = {
  good: 'border-green-600/40 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  neutral: 'border-border text-muted-foreground',
};

/** Compact chips for table rows: only evaluated values (nothing is shown for unknown). */
export function AttributeChips({ views }: { views: AttributeView[] }) {
  const known = views.filter((v) => resolve(v).known);
  if (known.length === 0) return null;
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {known.map((v) => {
        const r = resolve(v);
        return (
          <span
            key={v.key}
            className={cn('rounded border px-1.5 py-0.5 text-xs font-normal', toneClass[r.tone])}
            title={`${v.label}: ${r.text} (source: ${v.attr?.sourceUrl}, retrieved ${v.attr?.retrieved})`}
          >
            {v.label}: {r.text}
          </span>
        );
      })}
    </div>
  );
}

/** Detail-page list: every attribute, unknown shown as "Not evaluated", with source link. */
export function AttributeList({ views }: { views: AttributeView[] }) {
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {views.map((v) => {
        const r = resolve(v);
        return (
          <div key={v.key} className="rounded-lg border border-border p-3">
            <dt className="text-xs text-muted-foreground">{v.label}</dt>
            <dd className="mt-1 text-sm font-medium">
              <span className={cn('rounded border px-1.5 py-0.5 text-xs', toneClass[r.tone])}>{r.text}</span>
            </dd>
            {r.known && v.attr && (
              <dd className="mt-1 text-xs text-muted-foreground">
                <a href={v.attr.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Source
                </a>
                {v.attr.evidenceUrl && (
                  <>
                    {' · '}
                    <a href={v.attr.evidenceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Program page
                    </a>
                  </>
                )}
                {` · retrieved ${v.attr.retrieved}`}
              </dd>
            )}
          </div>
        );
      })}
    </dl>
  );
}

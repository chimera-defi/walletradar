import { cn } from '@/lib/utils';
import { cardFreshness, STALE_AFTER_DAYS } from '@/lib/card-freshness';

/** Last primary-source check for a card; "stale" past STALE_AFTER_DAYS, "not verified" if no date is recorded. */
export function FreshnessBadge({ lastVerified, className }: { lastVerified: string | null; className?: string }) {
  const { state } = cardFreshness(lastVerified);
  const label =
    state === 'unknown' ? 'Not verified' : state === 'stale' ? `Stale: checked ${lastVerified}` : `Checked ${lastVerified}`;
  const title =
    state === 'unknown'
      ? 'No primary-source check is recorded for this card yet.'
      : state === 'stale'
        ? `Last primary-source check was more than ${STALE_AFTER_DAYS} days ago; treat fees and availability as possibly out of date.`
        : `Last primary-source check: ${lastVerified}.`;
  return (
    <span
      title={title}
      className={cn(
        'inline-block px-2 py-0.5 text-xs rounded-full font-medium',
        state === 'fresh' && 'bg-muted text-muted-foreground',
        state === 'stale' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        state === 'unknown' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        className
      )}
    >
      {label}
    </span>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { cardFreshness, STALE_AFTER_DAYS, type CardFreshness } from '@/lib/card-freshness';

/**
 * Last primary-source check for a card. The static HTML is rendered neutral (no clock-dependent state);
 * after mount the badge upgrades to "stale" using the viewer's date, so a page built long ago still
 * flags cards older than STALE_AFTER_DAYS.
 */
export function FreshnessBadge({ lastVerified, className }: { lastVerified: string | null; className?: string }) {
  // Missing or invalid dates are deterministic, so they can render the same on server and client.
  const initial: CardFreshness = cardFreshness(lastVerified, new Date(0)).state === 'unknown'
    ? { state: 'unknown', days: null }
    : { state: 'fresh', days: null };
  const [fresh, setFresh] = useState<CardFreshness>(initial);
  useEffect(() => {
    setFresh(cardFreshness(lastVerified));
  }, [lastVerified]);

  const { state } = fresh;
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

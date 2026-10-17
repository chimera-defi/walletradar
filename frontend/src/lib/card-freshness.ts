export const STALE_AFTER_DAYS = 60;

export type CardFreshness = {
  state: 'fresh' | 'stale' | 'unknown';
  /** Whole days since the last check; null when unknown */
  days: number | null;
};

const MS_PER_DAY = 86_400_000;

/** Classify an ISO date (YYYY-MM-DD) against `now`. Missing or invalid dates are "unknown". */
export function cardFreshness(lastVerified: string | null | undefined, now: Date = new Date()): CardFreshness {
  if (!lastVerified || !/^\d{4}-\d{2}-\d{2}$/.test(lastVerified)) return { state: 'unknown', days: null };
  const t = Date.parse(`${lastVerified}T00:00:00Z`);
  if (Number.isNaN(t)) return { state: 'unknown', days: null };
  const days = Math.max(0, Math.floor((now.getTime() - t) / MS_PER_DAY));
  return { state: days > STALE_AFTER_DAYS ? 'stale' : 'fresh', days };
}

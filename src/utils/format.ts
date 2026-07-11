/** Date / time / text formatting helpers with defensive handling. */

/** Parse an ISO string to epoch ms, or null if invalid. */
function toTime(iso?: string): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : t;
}

/**
 * Human-friendly relative time ("3 days ago"). `nowMs` is injected so callers
 * control the clock (screens pass Date.now()); defaults are avoided here to keep
 * the function pure and testable.
 */
export function relativeTime(iso: string | undefined, nowMs: number): string {
  const t = toTime(iso);
  if (t === null) return 'unknown date';
  const diff = nowMs - t;
  if (diff < 0) return 'in the future';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo ago`;
  const years = Math.floor(days / 365);
  return `${years} yr${years === 1 ? '' : 's'} ago`;
}

/** Short calendar date like "Jun 15, 2026", or a fallback for bad input. */
export function shortDate(iso: string | undefined): string {
  const t = toTime(iso);
  if (t === null) return 'Unknown date';
  const d = new Date(t);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** True when the data is older than the given number of days. */
export function isStale(iso: string | undefined, nowMs: number, days: number): boolean {
  const t = toTime(iso);
  if (t === null) return true;
  return nowMs - t > days * 86400000;
}

/** Collapse whitespace and trim; returns '' for nullish input. */
export function cleanText(input: string | undefined | null): string {
  return (input ?? '').replace(/\s+/g, ' ').trim();
}

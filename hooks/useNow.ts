import { useEffect, useState } from 'react';

/**
 * Returns the current epoch ms, refreshed on an interval so relative timestamps
 * ("3 min ago") stay reasonably fresh without every screen managing its own clock.
 */
export function useNow(intervalMs = 60000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

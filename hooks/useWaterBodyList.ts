import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { WaterBody, WqStatus } from '@/src/data/models';
import { WATER_BODIES } from '@/src/data/waterBodies';
import { getSamples } from '@/src/services/samples';
import { assess } from '@/src/utils/waterQuality';

export interface WaterBodyListItem {
  waterBody: WaterBody;
  /** Overall status from the bundled official snapshot (fast, offline-safe). */
  status: WqStatus;
  sampleCount: number;
}

interface ListState {
  items: WaterBodyListItem[];
  loading: boolean;
  refresh: () => void;
}

/**
 * Builds the water-body list with per-body community sample counts. Statuses use
 * the bundled official snapshot so the list renders instantly and offline; the
 * detail screen fetches live data. Refreshes whenever the screen regains focus so
 * newly submitted samples appear immediately.
 */
export function useWaterBodyList(): ListState {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const samples = await getSamples();
    const next: Record<string, number> = {};
    for (const s of samples) {
      next[s.waterBodyId] = (next[s.waterBodyId] ?? 0) + 1;
    }
    setCounts(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const items: WaterBodyListItem[] = WATER_BODIES.map((waterBody) => ({
    waterBody,
    status: assess(waterBody.officialMeasurements).status,
    sampleCount: counts[waterBody.id] ?? 0,
  }));

  return { items, loading, refresh: load };
}

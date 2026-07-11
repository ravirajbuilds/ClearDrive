import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { HomeWaterTest } from '@/src/data/homeWater';
import { getHomeTests } from '@/src/services/homeTests';

interface HomeTestsState {
  tests: HomeWaterTest[];
  loading: boolean;
  refresh: () => void;
}

/** Loads the on-device home water tests and refreshes when the screen focuses. */
export function useHomeTests(): HomeTestsState {
  const [tests, setTests] = useState<HomeWaterTest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setTests(await getHomeTests());
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

  return { tests, loading, refresh: load };
}

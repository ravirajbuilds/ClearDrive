import Colors, { StatusColors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import type { WqStatus } from '@/src/data/models';

/**
 * Returns the resolved palette for the active color scheme, plus a helper for
 * water-quality status colors. Centralizes theme access so screens and
 * components never hard-code hex values.
 */
export function useTheme() {
  const scheme = useColorScheme();
  return {
    scheme,
    colors: Colors[scheme],
    statusColor: (status: WqStatus) => StatusColors[scheme][status],
  };
}

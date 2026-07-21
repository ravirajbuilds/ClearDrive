import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import WaterMap from '@/components/WaterMap';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { LoadingState } from '@/components/ui/States';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { useTheme } from '@/hooks/useTheme';
import { useWaterBodyList } from '@/hooks/useWaterBodyList';
import type { WaterMapPoint } from '@/components/WaterMap/shared';
import { WATER_BODY_TYPE_LABEL } from '@/src/data/labels';
import { STATUS_LABEL } from '@/src/utils/waterQuality';
import type { WqStatus } from '@/src/data/models';
import { FontSize, Radius, Spacing } from '@/constants/Layout';
import { SHORT_DISCLAIMER } from '@/src/content/legal';

const LEGEND_STATUSES: WqStatus[] = ['good', 'moderate', 'poor', 'unhealthy', 'unknown'];

export default function MapScreen() {
  const { colors, scheme, statusColor } = useTheme();
  const router = useRouter();
  const { items, loading } = useWaterBodyList();

  const points = useMemo<WaterMapPoint[]>(
    () =>
      items.map(({ waterBody, status, sampleCount }) => ({
        id: waterBody.id,
        name: waterBody.name,
        typeLabel: WATER_BODY_TYPE_LABEL[waterBody.type],
        status,
        latitude: waterBody.latitude,
        longitude: waterBody.longitude,
        sampleCount,
      })),
    [items],
  );

  if (loading) {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <LoadingState message="Loading map…" />
      </View>
    );
  }

  return (
    <AppErrorBoundary name="Map">
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <View style={styles.banner}>
          <DisclaimerBanner text={SHORT_DISCLAIMER} />
        </View>

        <View style={styles.mapWrap}>
          <WaterMap
            points={points}
            colorScheme={scheme}
            onSelectPoint={(id) => router.push(`/water-body/${id}`)}
          />
        </View>

        <View style={[styles.legend, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {LEGEND_STATUSES.map((status) => (
            <View key={status} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: statusColor(status).fg }]} />
              <Text style={[styles.legendLabel, { color: colors.textMuted }]}>
                {STATUS_LABEL[status]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  banner: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  mapWrap: {
    flex: 1,
    margin: Spacing.lg,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});

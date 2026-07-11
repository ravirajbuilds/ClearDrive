import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { WaterBodyCard } from '@/components/WaterBodyCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { LoadingState } from '@/components/ui/States';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { useTheme } from '@/hooks/useTheme';
import { useWaterBodyList, type WaterBodyListItem } from '@/hooks/useWaterBodyList';
import { FontSize, Spacing } from '@/constants/Layout';
import { getCurrentLocation, type LocationStatus, type UserLocation } from '@/src/services/location';
import { distanceKm } from '@/src/utils/geo';
import { SHORT_DISCLAIMER } from '@/src/content/legal';

export default function NearbyScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { items, loading } = useWaterBodyList();

  const [location, setLocation] = useState<UserLocation | null>(null);
  const [locStatus, setLocStatus] = useState<LocationStatus | 'idle'>('idle');
  const [locating, setLocating] = useState(false);

  const requestLocation = async () => {
    setLocating(true);
    try {
      const result = await getCurrentLocation();
      setLocStatus(result.status);
      setLocation(result.location);
    } finally {
      setLocating(false);
    }
  };

  const data = useMemo(() => {
    const withDistance: { entry: WaterBodyListItem; d?: number }[] = items.map((entry) => ({
      entry,
      d: location
        ? distanceKm(
            location.latitude,
            location.longitude,
            entry.waterBody.latitude,
            entry.waterBody.longitude,
          )
        : undefined,
    }));
    if (location) {
      withDistance.sort((a, b) => (a.d ?? Infinity) - (b.d ?? Infinity));
    }
    return withDistance;
  }, [items, location]);

  const renderItem = ({ item }: { item: { entry: WaterBodyListItem; d?: number } }) => (
    <WaterBodyCard
      waterBody={item.entry.waterBody}
      status={item.entry.status}
      sampleCount={item.entry.sampleCount}
      distanceKm={item.d}
      onPress={() => router.push(`/water-body/${item.entry.waterBody.id}`)}
    />
  );

  if (loading) {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <LoadingState message="Loading water bodies…" />
      </View>
    );
  }

  return (
    <AppErrorBoundary name="Nearby">
      <FlatList
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.list}
        data={data}
        keyExtractor={(item) => item.entry.waterBody.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <DisclaimerBanner text={SHORT_DISCLAIMER} />
            {locStatus !== 'granted' ? (
              <Card>
                <Text style={[styles.promptTitle, { color: colors.text }]}>Find water near you</Text>
                <Text style={[styles.promptBody, { color: colors.textMuted }]}>
                  {locStatus === 'denied'
                    ? 'Location access is off. You can still browse every water body below, or enable location in Settings to sort by distance.'
                    : locStatus === 'unavailable'
                      ? 'Location isn’t available on this device right now. Browse all water bodies below.'
                      : 'Sort New Jersey water bodies by how close they are. Location stays on your device.'}
                </Text>
                {locStatus !== 'unavailable' ? (
                  <Button
                    label={locStatus === 'denied' ? 'Try again' : 'Use my location'}
                    onPress={requestLocation}
                    loading={locating}
                    variant="secondary"
                    style={{ marginTop: Spacing.md }}
                  />
                ) : null}
              </Card>
            ) : null}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {location ? 'Nearest water bodies' : 'New Jersey water bodies'}
            </Text>
          </View>
        }
        ListFooterComponent={
          <Text style={[styles.footer, { color: colors.textMuted }]}>
            Showing {data.length} monitored {data.length === 1 ? 'location' : 'locations'}. Statuses use
            the bundled official snapshot; open a location for live readings.
          </Text>
        }
      />
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  list: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  header: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  promptTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  promptBody: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  footer: {
    fontSize: FontSize.xs,
    lineHeight: 17,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
});

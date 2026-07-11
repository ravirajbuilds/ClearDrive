import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

import { ParameterRow } from '@/components/ParameterRow';
import { SampleCard } from '@/components/SampleCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { useTheme } from '@/hooks/useTheme';
import { useNow } from '@/hooks/useNow';
import { FontSize, Spacing } from '@/constants/Layout';
import { getWaterBody } from '@/src/data/waterBodies';
import { WATER_BODY_TYPE_LABEL } from '@/src/data/labels';
import type { CommunitySample } from '@/src/data/models';
import { getOfficialData, type OfficialData } from '@/src/services/officialApi';
import { deleteSample, getSamplesForWaterBody } from '@/src/services/samples';
import { PARAMETER_ORDER } from '@/src/data/parameters';
import { assess, STATUS_SUMMARY } from '@/src/utils/waterQuality';
import { isStale, relativeTime, shortDate } from '@/src/utils/format';
import { COMMUNITY_DISCLAIMER, STATUS_DISCLAIMER } from '@/src/content/legal';

export default function WaterBodyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const now = useNow();

  const waterBody = typeof id === 'string' ? getWaterBody(id) : undefined;

  const [official, setOfficial] = useState<OfficialData | null>(null);
  const [officialError, setOfficialError] = useState(false);
  const [loadingOfficial, setLoadingOfficial] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [samples, setSamples] = useState<CommunitySample[]>([]);

  const loadOfficial = useCallback(
    async (forceRefresh: boolean) => {
      if (!waterBody) return;
      setOfficialError(false);
      try {
        const data = await getOfficialData(waterBody, Date.now(), { forceRefresh });
        setOfficial(data);
      } catch {
        setOfficialError(true);
      } finally {
        setLoadingOfficial(false);
      }
    },
    [waterBody],
  );

  const loadSamples = useCallback(async () => {
    if (!waterBody) return;
    setSamples(await getSamplesForWaterBody(waterBody.id));
  }, [waterBody]);

  useEffect(() => {
    loadOfficial(false);
  }, [loadOfficial]);

  // Refresh community samples whenever this screen regains focus.
  useFocusEffect(
    useCallback(() => {
      loadSamples();
    }, [loadSamples]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadOfficial(true), loadSamples()]);
    setRefreshing(false);
  };

  const onDeleteSample = async (sampleId: string) => {
    await deleteSample(sampleId);
    await loadSamples();
  };

  if (!waterBody) {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <EmptyState
          title="Water body not found"
          message="This location may have been removed."
          icon="🌊"
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const assessment = official ? assess(official.measurements) : { status: 'unknown' as const };
  const orderedMeasurements = official
    ? [...official.measurements].sort(
        (a, b) => PARAMETER_ORDER.indexOf(a.parameter) - PARAMETER_ORDER.indexOf(b.parameter),
      )
    : [];
  const stale = official ? isStale(official.retrievedAt, now, 3) : false;

  return (
    <AppErrorBoundary name="WaterBodyDetail">
      <Stack.Screen options={{ title: waterBody.name }} />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]}>{waterBody.name}</Text>
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {WATER_BODY_TYPE_LABEL[waterBody.type]} ·{' '}
            {[waterBody.municipality, `${waterBody.county} County`].filter(Boolean).join(', ')}
          </Text>
          <Text style={[styles.description, { color: colors.textMuted }]}>
            {waterBody.description}
          </Text>
        </View>

        {/* Official data */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Latest readings</Text>
        {loadingOfficial ? (
          <Card>
            <LoadingState message="Fetching readings…" />
          </Card>
        ) : officialError || !official ? (
          <Card>
            <ErrorState
              title="Couldn't load readings"
              message="Check your connection and pull down to retry."
              onAction={() => loadOfficial(true)}
            />
          </Card>
        ) : (
          <Card>
            <View style={styles.officialHeader}>
              <StatusBadge status={assessment.status} />
              <SourceBadge kind={official.origin} />
            </View>
            <Text style={[styles.summary, { color: colors.textMuted }]}>
              {STATUS_SUMMARY[assessment.status]}
            </Text>

            {orderedMeasurements.length === 0 ? (
              <Text style={[styles.summary, { color: colors.textMuted }]}>
                No parameters are currently available for this location.
              </Text>
            ) : (
              <View style={styles.measurements}>
                {orderedMeasurements.map((m, idx) => (
                  <ParameterRow key={`${m.parameter}-${idx}`} measurement={m} />
                ))}
              </View>
            )}

            <Text style={[styles.attribution, { color: colors.textMuted }]}>
              Source: {official.source}
              {'\n'}
              {official.origin === 'sample'
                ? `Illustrative sample snapshot from ${shortDate(official.retrievedAt)}.`
                : `Retrieved ${relativeTime(official.retrievedAt, now)}.`}
              {stale ? ' This data may be out of date.' : ''}
            </Text>
          </Card>
        )}
        <DisclaimerBanner text={STATUS_DISCLAIMER} />

        {/* Community samples */}
        <View style={styles.communityHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 0 }]}>
            Community samples
          </Text>
          <Text style={[styles.count, { color: colors.textMuted }]}>{samples.length}</Text>
        </View>
        <DisclaimerBanner text={COMMUNITY_DISCLAIMER} tone="warning" />

        {samples.length === 0 ? (
          <Card>
            <EmptyState
              title="No community samples yet"
              message="Be the first to add a reading for this location."
              icon="🧪"
            />
          </Card>
        ) : (
          <View style={styles.samples}>
            {samples.map((s) => (
              <SampleCard key={s.id} sample={s} nowMs={now} onDelete={onDeleteSample} />
            ))}
          </View>
        )}

        <Button
          label="Add a community sample"
          onPress={() =>
            router.push({ pathname: '/(tabs)/report', params: { waterBodyId: waterBody.id } })
          }
          style={{ marginTop: Spacing.lg }}
        />
      </ScrollView>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  header: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
  },
  meta: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  description: {
    fontSize: FontSize.md,
    lineHeight: 22,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginTop: Spacing.md,
  },
  officialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  summary: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    marginTop: Spacing.md,
  },
  measurements: {
    marginTop: Spacing.sm,
  },
  attribution: {
    fontSize: FontSize.xs,
    lineHeight: 17,
    marginTop: Spacing.lg,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  count: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  samples: {
    gap: Spacing.md,
  },
});

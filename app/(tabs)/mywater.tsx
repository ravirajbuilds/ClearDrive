import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { HomeTestCard } from '@/components/HomeTestCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { EmptyState, LoadingState } from '@/components/ui/States';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { useTheme } from '@/hooks/useTheme';
import { useNow } from '@/hooks/useNow';
import { useHomeTests } from '@/hooks/useHomeTests';
import { FontSize, Spacing } from '@/constants/Layout';
import { deleteHomeTest } from '@/src/services/homeTests';
import { HOME_WATER_DISCLAIMER } from '@/src/content/legal';

export default function MyWaterScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const now = useNow();
  const { tests, loading, refresh } = useHomeTests();

  const onDelete = async (id: string) => {
    await deleteHomeTest(id);
    refresh();
  };

  if (loading) {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <LoadingState message="Loading your tests…" />
      </View>
    );
  }

  return (
    <AppErrorBoundary name="MyWater">
      <FlatList
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.list}
        data={tests}
        keyExtractor={(t) => t.id}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Card>
              <Text style={[styles.title, { color: colors.text }]}>Test your tap water</Text>
              <Text style={[styles.body, { color: colors.textMuted }]}>
                Log readings from home test strips, a TDS meter, or a mail-in kit — including PFAS,
                lead, pH, chlorine, and more. Note your filter to track how your water compares over
                time. Everything stays on your device.
              </Text>
              <Button
                label="Log a home water test"
                onPress={() => router.push('/home-test')}
                style={{ marginTop: Spacing.md }}
                accessibilityHint="Opens the home water test form"
              />
              <Text
                accessibilityRole="link"
                onPress={() => router.push('/legal/disclaimer')}
                style={[styles.learnMore, { color: colors.tint }]}
              >
                How to read these results responsibly
              </Text>
            </Card>
            <DisclaimerBanner text={HOME_WATER_DISCLAIMER} tone="warning" />
            {tests.length > 0 ? (
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Your tests</Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => <HomeTestCard test={item} nowMs={now} onDelete={onDelete} />}
        ListEmptyComponent={
          <EmptyState
            title="No home tests yet"
            message="Tap “Log a home water test” to record your first reading."
            icon="🚰"
          />
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
    flexGrow: 1,
  },
  header: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  body: {
    fontSize: FontSize.sm,
    lineHeight: 21,
    marginTop: Spacing.xs,
  },
  learnMore: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
});

import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { WaterBodyCard } from '@/components/WaterBodyCard';
import { Chip } from '@/components/ui/Chip';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { EmptyState, LoadingState } from '@/components/ui/States';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { useTheme } from '@/hooks/useTheme';
import { useWaterBodyList } from '@/hooks/useWaterBodyList';
import { FontSize, Radius, Spacing } from '@/constants/Layout';
import type { WaterBodyType } from '@/src/data/models';
import { WATER_BODY_TYPE_LABEL } from '@/src/data/labels';
import { cleanText } from '@/src/utils/format';
import { SHORT_DISCLAIMER } from '@/src/content/legal';

const TYPE_FILTERS: (WaterBodyType | 'all')[] = [
  'all',
  'river',
  'lake',
  'reservoir',
  'bay',
  'beach',
  'estuary',
  'creek',
];

export default function ExploreScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { items, loading } = useWaterBodyList();

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<WaterBodyType | 'all'>('all');

  const filtered = useMemo(() => {
    const q = cleanText(query).toLowerCase();
    return items.filter(({ waterBody }) => {
      const matchesType = typeFilter === 'all' || waterBody.type === typeFilter;
      if (!matchesType) return false;
      if (!q) return true;
      const haystack =
        `${waterBody.name} ${waterBody.county} ${waterBody.municipality ?? ''}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, typeFilter]);

  if (loading) {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <LoadingState message="Loading water bodies…" />
      </View>
    );
  }

  return (
    <AppErrorBoundary name="Explore">
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <View style={styles.controls}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name, town, or county"
            placeholderTextColor={colors.textMuted}
            style={[
              styles.search,
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
            ]}
            accessibilityLabel="Search water bodies"
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoCorrect={false}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {TYPE_FILTERS.map((t) => (
              <Chip
                key={t}
                label={t === 'all' ? 'All types' : WATER_BODY_TYPE_LABEL[t]}
                selected={typeFilter === t}
                onPress={() => setTypeFilter(t)}
              />
            ))}
          </ScrollView>
        </View>

        <FlatList
          contentContainerStyle={styles.list}
          data={filtered}
          keyExtractor={(item) => item.waterBody.id}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
          ListHeaderComponent={<DisclaimerBanner text={SHORT_DISCLAIMER} />}
          renderItem={({ item }) => (
            <WaterBodyCard
              waterBody={item.waterBody}
              status={item.status}
              sampleCount={item.sampleCount}
              onPress={() => router.push(`/water-body/${item.waterBody.id}`)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title="No matches"
              message="Try a different search term or clear the filters."
              icon="🔍"
              actionLabel="Clear filters"
              onAction={() => {
                setQuery('');
                setTypeFilter('all');
              }}
            />
          }
        />
      </View>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  controls: {
    padding: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.md,
  },
  search: {
    minHeight: 46,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.md,
  },
  chips: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  list: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
    gap: Spacing.md,
    flexGrow: 1,
  },
});

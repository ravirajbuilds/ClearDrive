import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Radius, Spacing } from '@/constants/Layout';
import type { DataSource } from '@/src/data/models';
import type { OfficialDataOrigin } from '@/src/services/officialApi';

interface SourceBadgeProps {
  kind: DataSource | OfficialDataOrigin;
}

const LABELS: Record<string, string> = {
  official: 'Official',
  community: 'Community',
  live: 'Live · USGS',
  cache: 'Cached',
  sample: 'Sample data',
};

/** Small badge indicating where a data point comes from. */
export function SourceBadge({ kind }: SourceBadgeProps) {
  const { colors } = useTheme();
  const label = LABELS[kind] ?? kind;
  const emphasize = kind === 'community' || kind === 'sample';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: emphasize ? colors.tintSoft : colors.cardAlt,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.text, { color: colors.textMuted }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});

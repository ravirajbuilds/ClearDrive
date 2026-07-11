import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Radius, Spacing } from '@/constants/Layout';
import type { WaterBody, WqStatus } from '@/src/data/models';
import { WATER_BODY_TYPE_ICON, WATER_BODY_TYPE_LABEL } from '@/src/data/labels';
import { formatDistance } from '@/src/utils/geo';
import { STATUS_LABEL } from '@/src/utils/waterQuality';
import { StatusBadge } from './ui/StatusBadge';

interface WaterBodyCardProps {
  waterBody: WaterBody;
  status: WqStatus;
  distanceKm?: number;
  sampleCount?: number;
  onPress: () => void;
}

export function WaterBodyCard({
  waterBody,
  status,
  distanceKm,
  sampleCount = 0,
  onPress,
}: WaterBodyCardProps) {
  const { colors } = useTheme();
  const location = [waterBody.municipality, `${waterBody.county} County`]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${waterBody.name}, ${WATER_BODY_TYPE_LABEL[waterBody.type]}, ${location}. Overall status ${STATUS_LABEL[status]}.`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.icon}>{WATER_BODY_TYPE_ICON[waterBody.type]}</Text>
        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
            {waterBody.name}
          </Text>
          <Text style={[styles.meta, { color: colors.textMuted }]} numberOfLines={1}>
            {WATER_BODY_TYPE_LABEL[waterBody.type]} · {location}
          </Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <StatusBadge status={status} size="sm" />
        <View style={styles.footerRight}>
          {sampleCount > 0 ? (
            <Text style={[styles.footNote, { color: colors.textMuted }]}>
              {sampleCount} community {sampleCount === 1 ? 'sample' : 'samples'}
            </Text>
          ) : null}
          {distanceKm !== undefined ? (
            <Text style={[styles.footNote, { color: colors.textMuted }]}>
              {formatDistance(distanceKm)}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  icon: {
    fontSize: 26,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  meta: {
    fontSize: FontSize.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flexShrink: 1,
  },
  footNote: {
    fontSize: FontSize.xs,
  },
});

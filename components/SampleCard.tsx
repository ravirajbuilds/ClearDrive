import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Spacing } from '@/constants/Layout';
import type { CommunitySample } from '@/src/data/models';
import { PARAMETERS } from '@/src/data/parameters';
import { relativeTime, shortDate } from '@/src/utils/format';
import { classify, formatValue } from '@/src/utils/waterQuality';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';
import { SourceBadge } from './ui/SourceBadge';

interface SampleCardProps {
  sample: CommunitySample;
  nowMs: number;
  onDelete?: (id: string) => void;
}

export function SampleCard({ sample, nowMs, onDelete }: SampleCardProps) {
  const { colors } = useTheme();

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.author, { color: colors.text }]} numberOfLines={1}>
            {sample.submittedBy}
          </Text>
          <Text style={[styles.date, { color: colors.textMuted }]}>
            Collected {shortDate(sample.collectedAt)} · {relativeTime(sample.createdAt, nowMs)}
          </Text>
        </View>
        <SourceBadge kind="community" />
      </View>

      {sample.locationNote ? (
        <Text style={[styles.note, { color: colors.textMuted }]}>📍 {sample.locationNote}</Text>
      ) : null}

      <View style={styles.measurements}>
        {sample.measurements.map((meas, idx) => {
          const def = PARAMETERS[meas.parameter];
          if (!def) return null;
          const c = classify(meas.parameter, meas.value);
          return (
            <View key={`${meas.parameter}-${idx}`} style={styles.measureRow}>
              <Text style={[styles.measureLabel, { color: colors.text }]} numberOfLines={1}>
                {def.shortLabel}: {formatValue(meas.value)}
                {def.unit ? ` ${def.unit}` : ''}
              </Text>
              {!def.informationalOnly ? <StatusBadge status={c.status} label={c.label} size="sm" /> : null}
            </View>
          );
        })}
      </View>

      {sample.notes ? (
        <Text style={[styles.note, { color: colors.textMuted }]}>{sample.notes}</Text>
      ) : null}

      {onDelete ? (
        <Text
          accessibilityRole="button"
          onPress={() => onDelete(sample.id)}
          style={[styles.delete, { color: colors.danger }]}
        >
          Delete this sample
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  author: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  date: {
    fontSize: FontSize.xs,
  },
  measurements: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  measureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  measureLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    flexShrink: 1,
  },
  note: {
    fontSize: FontSize.sm,
    marginTop: Spacing.md,
    lineHeight: 20,
  },
  delete: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginTop: Spacing.lg,
  },
});

import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Spacing } from '@/constants/Layout';
import {
  HOME_PARAMETERS,
  getFilterOption,
  type HomeWaterTest,
} from '@/src/data/homeWater';
import { assessHome, classifyHome } from '@/src/utils/homeWater';
import { formatValue, STATUS_LABEL } from '@/src/utils/waterQuality';
import { relativeTime, shortDate } from '@/src/utils/format';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';
import { SourceBadge } from './ui/SourceBadge';

interface HomeTestCardProps {
  test: HomeWaterTest;
  nowMs: number;
  onDelete?: (id: string) => void;
}

export function HomeTestCard({ test, nowMs, onDelete }: HomeTestCardProps) {
  const { colors } = useTheme();
  const filter = getFilterOption(test.filterType);
  const overall = assessHome(test.measurements);
  const filterLabel = test.filterBrand ? `${filter.label} · ${test.filterBrand}` : filter.label;

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.author, { color: colors.text }]} numberOfLines={1}>
            {test.submittedBy}
          </Text>
          <Text style={[styles.date, { color: colors.textMuted }]}>
            Tested {shortDate(test.testedAt)} · {relativeTime(test.createdAt, nowMs)}
          </Text>
        </View>
        <SourceBadge kind="community" />
      </View>

      <View style={styles.filterRow}>
        <Text style={[styles.filterLabel, { color: colors.textMuted }]} numberOfLines={2}>
          🚰 Filter: {filterLabel}
        </Text>
      </View>

      {overall !== 'unknown' ? (
        <View style={styles.overall}>
          <StatusBadge status={overall} label={`Worst reading: ${STATUS_LABEL[overall]}`} size="sm" />
        </View>
      ) : null}

      <View style={styles.measurements}>
        {test.measurements.map((meas, idx) => {
          const def = HOME_PARAMETERS[meas.parameter];
          if (!def) return null;
          const c = classifyHome(meas.parameter, meas.value);
          return (
            <View key={`${meas.parameter}-${idx}`} style={styles.measureRow}>
              <Text style={[styles.measureLabel, { color: colors.text }]} numberOfLines={1}>
                {def.shortLabel}: {formatValue(meas.value)}
                {def.unit ? ` ${def.unit}` : ''}
              </Text>
              {def.informationalOnly ? (
                <Text style={[styles.info, { color: colors.textMuted }]}>Info</Text>
              ) : (
                <StatusBadge status={c.status} label={c.label} size="sm" />
              )}
            </View>
          );
        })}
      </View>

      {test.notes ? (
        <Text style={[styles.note, { color: colors.textMuted }]}>{test.notes}</Text>
      ) : null}

      {onDelete ? (
        <Text
          accessibilityRole="button"
          onPress={() => onDelete(test.id)}
          style={[styles.delete, { color: colors.danger }]}
        >
          Delete this test
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
  filterRow: {
    marginTop: Spacing.md,
  },
  filterLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  overall: {
    marginTop: Spacing.md,
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
  info: {
    fontSize: FontSize.xs,
    fontStyle: 'italic',
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

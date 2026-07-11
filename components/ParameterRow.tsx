import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Spacing } from '@/constants/Layout';
import type { Measurement } from '@/src/data/models';
import { PARAMETERS } from '@/src/data/parameters';
import { classify, formatValue } from '@/src/utils/waterQuality';
import { StatusBadge } from './ui/StatusBadge';

interface ParameterRowProps {
  measurement: Measurement;
}

/** A single parameter reading with its value, unit, and status classification. */
export function ParameterRow({ measurement }: ParameterRowProps) {
  const { colors } = useTheme();
  const def = PARAMETERS[measurement.parameter];
  if (!def) return null;

  const c = classify(measurement.parameter, measurement.value);
  const valueText = `${formatValue(measurement.value)}${def.unit ? ` ${def.unit}` : ''}`;

  return (
    <View
      style={[styles.row, { borderBottomColor: colors.border }]}
      accessibilityLabel={`${def.label}: ${valueText}. ${c.label}.`}
    >
      <View style={styles.left}>
        <Text style={[styles.label, { color: colors.text }]}>{def.label}</Text>
        <Text style={[styles.value, { color: colors.textMuted }]}>{valueText}</Text>
      </View>
      <View style={styles.right}>
        {def.informationalOnly ? (
          <Text style={[styles.info, { color: colors.textMuted }]}>Info</Text>
        ) : (
          <StatusBadge status={c.status} label={c.label} size="sm" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.md,
  },
  left: {
    flexShrink: 1,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  value: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  right: {
    flexShrink: 0,
    maxWidth: '52%',
    alignItems: 'flex-end',
  },
  info: {
    fontSize: FontSize.xs,
    fontStyle: 'italic',
  },
});

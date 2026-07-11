import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Radius, Spacing } from '@/constants/Layout';
import type { WqStatus } from '@/src/data/models';
import { STATUS_LABEL } from '@/src/utils/waterQuality';

interface StatusBadgeProps {
  status: WqStatus;
  /** Optional label override; defaults to the standard status label. */
  label?: string;
  size?: 'sm' | 'md';
}

/**
 * A color-and-text status badge. Always renders the text label so meaning does
 * not depend on color alone.
 */
export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const { statusColor } = useTheme();
  const c = statusColor(status);
  const text = label ?? STATUS_LABEL[status];
  const small = size === 'sm';

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Status: ${STATUS_LABEL[status]}`}
      style={[
        styles.badge,
        {
          backgroundColor: c.bg,
          paddingVertical: small ? 2 : Spacing.xs,
          paddingHorizontal: small ? Spacing.sm : Spacing.md,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: c.fg }]} />
      <Text
        style={[styles.text, { color: c.fg, fontSize: small ? FontSize.xs : FontSize.sm }]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  text: {
    fontWeight: '700',
  },
});

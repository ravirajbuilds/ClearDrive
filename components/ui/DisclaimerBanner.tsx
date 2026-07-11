import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Radius, Spacing } from '@/constants/Layout';

type Tone = 'info' | 'warning';

interface DisclaimerBannerProps {
  text: string;
  tone?: Tone;
}

/** A compact, always-visible inline disclaimer used on data surfaces. */
export function DisclaimerBanner({ text, tone = 'info' }: DisclaimerBannerProps) {
  const { colors } = useTheme();
  const accent = tone === 'warning' ? colors.warning : colors.tint;

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.container,
        { backgroundColor: colors.cardAlt, borderColor: colors.border, borderLeftColor: accent },
      ]}
    >
      <Text style={[styles.text, { color: colors.textMuted }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 3,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  text: {
    fontSize: FontSize.xs,
    lineHeight: 17,
  },
});

/**
 * Rendered in place of the map when no Mapbox access token is configured, so the
 * app degrades gracefully instead of showing a blank or broken map. Set
 * `EXPO_PUBLIC_MAPBOX_TOKEN` to enable the live map (see README).
 */
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { FontSize, Radius, Spacing } from '@/constants/Layout';

export function MapPlaceholder() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
      <Text style={styles.icon}>🗺️</Text>
      <Text style={[styles.title, { color: colors.text }]}>Map unavailable</Text>
      <Text style={[styles.body, { color: colors.textMuted }]}>
        Add a Mapbox access token as {`EXPO_PUBLIC_MAPBOX_TOKEN`} to show the interactive
        map. You can still browse every water body from the Nearby and Explore tabs.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  icon: { fontSize: 36 },
  title: { fontSize: FontSize.lg, fontWeight: '700' },
  body: { fontSize: FontSize.sm, lineHeight: 20, textAlign: 'center' },
});

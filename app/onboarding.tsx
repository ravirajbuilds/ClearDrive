import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { useDisclaimer } from '@/hooks/useDisclaimer';
import { FontSize, Spacing } from '@/constants/Layout';
import {
  APP_NAME,
  SAFETY_DISCLAIMER_POINTS,
  SAFETY_DISCLAIMER_TITLE,
} from '@/src/content/legal';

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const { accept } = useDisclaimer();
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);

  const onAccept = async () => {
    setBusy(true);
    try {
      await accept();
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>💧</Text>
        <Text style={[styles.appName, { color: colors.text }]}>{APP_NAME}</Text>
        <Text style={[styles.tagline, { color: colors.textMuted }]}>
          Water quality for New Jersey — official readings and community samples in one place.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{SAFETY_DISCLAIMER_TITLE}</Text>

        <View style={styles.points}>
          {SAFETY_DISCLAIMER_POINTS.map((point, idx) => (
            <View key={idx} style={styles.pointRow}>
              <View style={[styles.bullet, { backgroundColor: colors.tint }]} />
              <Text style={[styles.pointText, { color: colors.text }]}>{point}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + Spacing.lg, borderTopColor: colors.border, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.consent, { color: colors.textMuted }]}>
          By continuing you acknowledge that {APP_NAME} is for general information only and is not a
          substitute for official advisories.
        </Text>
        <Button
          label="I understand — continue"
          onPress={onAccept}
          loading={busy}
          accessibilityHint="Accepts the safety disclaimer and opens the app"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  logo: {
    fontSize: 56,
    textAlign: 'center',
  },
  appName: {
    fontSize: FontSize.display,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  tagline: {
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  points: {
    gap: Spacing.lg,
  },
  pointRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
  },
  pointText: {
    flex: 1,
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.md,
  },
  consent: {
    fontSize: FontSize.xs,
    lineHeight: 17,
    textAlign: 'center',
  },
});

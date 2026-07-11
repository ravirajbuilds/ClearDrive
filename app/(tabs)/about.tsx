import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

import { Card } from '@/components/ui/Card';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Spacing } from '@/constants/Layout';
import {
  APP_NAME,
  CONTACT_EMAIL,
  LAST_UPDATED,
  SHORT_DISCLAIMER,
} from '@/src/content/legal';

interface RowProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
}

function LinkRow({ title, subtitle, onPress, borderColor, textColor, mutedColor }: RowProps & {
  borderColor: string;
  textColor: string;
  mutedColor: string;
}) {
  return (
    <Text
      accessibilityRole="link"
      onPress={onPress}
      style={[styles.linkRow, { borderBottomColor: borderColor }]}
    >
      <Text style={[styles.linkTitle, { color: textColor }]}>{title}</Text>
      {subtitle ? <Text style={[styles.linkSubtitle, { color: mutedColor }]}>{`\n${subtitle}`}</Text> : null}
    </Text>
  );
}

export default function AboutScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const openEmergency = () => Linking.openURL('tel:18779276337').catch(() => {});

  return (
    <AppErrorBoundary name="About">
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <Text style={styles.logo}>💧</Text>
          <Text style={[styles.appName, { color: colors.text }]}>{APP_NAME}</Text>
          <Text style={[styles.tagline, { color: colors.textMuted }]}>
            Water-quality information for New Jersey, combining official monitoring data with
            community samples.
          </Text>
        </View>

        <DisclaimerBanner text={SHORT_DISCLAIMER} tone="warning" />

        <Card padded={false}>
          <LinkRow
            title="Safety disclaimer"
            subtitle="How to use this app responsibly"
            onPress={() => router.push('/legal/disclaimer')}
            borderColor={colors.border}
            textColor={colors.text}
            mutedColor={colors.textMuted}
          />
          <LinkRow
            title="Data sources & attribution"
            subtitle="Where the readings come from"
            onPress={() => router.push('/legal/sources')}
            borderColor={colors.border}
            textColor={colors.text}
            mutedColor={colors.textMuted}
          />
          <LinkRow
            title="Privacy policy"
            subtitle="What the app stores and accesses"
            onPress={() => router.push('/legal/privacy')}
            borderColor={colors.border}
            textColor={colors.text}
            mutedColor={colors.textMuted}
          />
          <LinkRow
            title="Terms of use"
            onPress={() => router.push('/legal/terms')}
            borderColor="transparent"
            textColor={colors.text}
            mutedColor={colors.textMuted}
          />
        </Card>

        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Report an environmental hazard</Text>
          <Text style={[styles.body, { color: colors.textMuted }]}>
            This app is not monitored. To report a spill, discharge, or hazard in New Jersey, call the
            NJDEP hotline. In a life-threatening emergency, call 911.
          </Text>
          <Text
            accessibilityRole="link"
            onPress={openEmergency}
            style={[styles.phone, { color: colors.tint }]}
          >
            NJDEP Hotline: 1-877-WARNDEP
          </Text>
        </Card>

        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Contact</Text>
          <Text
            accessibilityRole="link"
            onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`).catch(() => {})}
            style={[styles.body, { color: colors.tint }]}
          >
            {CONTACT_EMAIL}
          </Text>
        </Card>

        <Text style={[styles.version, { color: colors.textMuted }]}>
          {APP_NAME} v{version} · Legal text last updated {LAST_UPDATED}
        </Text>
      </ScrollView>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.lg,
  },
  logo: {
    fontSize: 48,
  },
  appName: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
  },
  tagline: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  linkRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  linkTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  linkSubtitle: {
    fontSize: FontSize.sm,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  body: {
    fontSize: FontSize.sm,
    lineHeight: 21,
  },
  phone: {
    fontSize: FontSize.md,
    fontWeight: '700',
    marginTop: Spacing.md,
  },
  version: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});

import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/States';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Spacing } from '@/constants/Layout';
import {
  COMMUNITY_GUIDELINES,
  DATA_SOURCES,
  DISCLAIMER_SECTIONS,
  LAST_UPDATED,
  PRIVACY_SECTIONS,
  TERMS_SECTIONS,
  type LegalSection,
} from '@/src/content/legal';

const TITLES: Record<string, string> = {
  disclaimer: 'Safety disclaimer',
  privacy: 'Privacy policy',
  terms: 'Terms of use',
  sources: 'Data sources',
};

const SECTIONS: Record<string, LegalSection[]> = {
  disclaimer: DISCLAIMER_SECTIONS,
  privacy: PRIVACY_SECTIONS,
  terms: TERMS_SECTIONS,
};

function Section({ section }: { section: LegalSection }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.heading, { color: colors.text }]}>{section.heading}</Text>
      {section.body.map((p, i) => (
        <Text key={i} style={[styles.paragraph, { color: colors.textMuted }]}>
          {p}
        </Text>
      ))}
    </View>
  );
}

export default function LegalDocScreen() {
  const { colors } = useTheme();
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const key = typeof doc === 'string' ? doc : '';
  const title = TITLES[key];

  if (!title) {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <EmptyState title="Document not found" icon="📄" />
      </View>
    );
  }

  const isSources = key === 'sources';

  return (
    <AppErrorBoundary name="Legal">
      <Stack.Screen options={{ title }} />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.updated, { color: colors.textMuted }]}>Last updated {LAST_UPDATED}</Text>

        {isSources ? (
          <>
            <Text style={[styles.paragraph, { color: colors.textMuted }]}>
              ClearDrive combines the following public sources. Official data is provided by these
              organizations under their own terms; ClearDrive is not affiliated with or endorsed by
              them.
            </Text>
            {DATA_SOURCES.map((s) => (
              <Card key={s.url}>
                <Text style={[styles.heading, { color: colors.text }]}>{s.name}</Text>
                <Text style={[styles.paragraph, { color: colors.textMuted }]}>{s.description}</Text>
                <Text
                  accessibilityRole="link"
                  onPress={() => Linking.openURL(s.url).catch(() => {})}
                  style={[styles.link, { color: colors.tint }]}
                >
                  {s.url}
                </Text>
              </Card>
            ))}
            <View style={styles.section}>
              <Text style={[styles.heading, { color: colors.text }]}>Community submission guidelines</Text>
              {COMMUNITY_GUIDELINES.map((g, i) => (
                <Text key={i} style={[styles.paragraph, { color: colors.textMuted }]}>
                  • {g}
                </Text>
              ))}
            </View>
          </>
        ) : (
          SECTIONS[key].map((section) => <Section key={section.heading} section={section} />)
        )}
      </ScrollView>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
  },
  updated: {
    fontSize: FontSize.xs,
    marginBottom: Spacing.sm,
  },
  section: {
    gap: Spacing.sm,
  },
  heading: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  paragraph: {
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  link: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
});

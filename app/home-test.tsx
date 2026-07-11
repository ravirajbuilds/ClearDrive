import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Radius, Spacing } from '@/constants/Layout';
import {
  FILTER_OPTIONS,
  HOME_PARAMETERS,
  HOME_PARAMETER_ORDER,
  getFilterOption,
  type FilterType,
  type HomeMeasurement,
  type HomeParameterId,
} from '@/src/data/homeWater';
import { addHomeTest, type HomeTestDraft } from '@/src/services/homeTests';
import { cleanText } from '@/src/utils/format';
import { HOME_WATER_DISCLAIMER } from '@/src/content/legal';

function todayIso(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function HomeTestScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [filterType, setFilterType] = useState<FilterType>('none');
  const [filterBrand, setFilterBrand] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [testedDate, setTestedDate] = useState(todayIso());
  const [notes, setNotes] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const filterNote = getFilterOption(filterType).note;

  const buildMeasurements = (): HomeMeasurement[] => {
    const out: HomeMeasurement[] = [];
    for (const id of HOME_PARAMETER_ORDER) {
      const raw = values[id];
      if (raw === undefined || cleanText(raw) === '') continue;
      out.push({ parameter: id as HomeParameterId, value: Number(raw) });
    }
    return out;
  };

  const onSubmit = async () => {
    setErrors([]);
    const parsed = Date.parse(`${testedDate}T12:00:00`);
    if (Number.isNaN(parsed)) {
      setErrors(['Enter the test date as YYYY-MM-DD.']);
      return;
    }
    const draft: HomeTestDraft = {
      filterType,
      filterBrand,
      submittedBy,
      testedAt: new Date(parsed).toISOString(),
      notes,
      measurements: buildMeasurements(),
    };

    setSubmitting(true);
    try {
      const { test, validation } = await addHomeTest(draft, Date.now());
      if (!test) {
        setErrors(validation.errors.length ? validation.errors : ['Could not save the test.']);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        return;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.back();
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
  ];

  return (
    <AppErrorBoundary name="HomeTest">
      <Stack.Screen options={{ title: 'Home water test' }} />
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xxl }]}
          keyboardShouldPersistTaps="handled"
        >
          <DisclaimerBanner text={HOME_WATER_DISCLAIMER} tone="warning" />

          {errors.length > 0 ? (
            <Card style={{ borderColor: colors.danger }}>
              <Text style={[styles.errorTitle, { color: colors.danger }]}>Please fix the following</Text>
              {errors.map((e, i) => (
                <Text key={i} style={[styles.errorItem, { color: colors.danger }]}>
                  • {e}
                </Text>
              ))}
            </Card>
          ) : null}

          {/* Filter */}
          <Text style={[styles.label, { color: colors.text }]}>Your filter</Text>
          <View style={styles.chips}>
            {FILTER_OPTIONS.map((f) => (
              <Chip
                key={f.id}
                label={f.label}
                selected={filterType === f.id}
                onPress={() => setFilterType(f.id)}
              />
            ))}
          </View>
          <Text style={[styles.helper, { color: colors.textMuted }]}>{filterNote}</Text>
          <TextInput
            value={filterBrand}
            onChangeText={setFilterBrand}
            placeholder="Filter brand / model (optional)"
            placeholderTextColor={colors.textMuted}
            style={inputStyle}
            maxLength={60}
            autoCorrect={false}
          />

          {/* Name */}
          <Text style={[styles.label, { color: colors.text }]}>Your name or handle (optional)</Text>
          <TextInput
            value={submittedBy}
            onChangeText={setSubmittedBy}
            placeholder="Anonymous"
            placeholderTextColor={colors.textMuted}
            style={inputStyle}
            maxLength={40}
            autoCorrect={false}
          />

          {/* Date */}
          <Text style={[styles.label, { color: colors.text }]}>Test date</Text>
          <TextInput
            value={testedDate}
            onChangeText={setTestedDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textMuted}
            style={inputStyle}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
          />

          {/* Measurements */}
          <Text style={[styles.label, { color: colors.text }]}>Your readings</Text>
          <Text style={[styles.helper, { color: colors.textMuted }]}>
            Enter the values you measured. Leave the rest blank.
          </Text>
          <View style={styles.measureList}>
            {HOME_PARAMETER_ORDER.map((id) => {
              const def = HOME_PARAMETERS[id];
              return (
                <View key={id} style={styles.measureRow}>
                  <View style={styles.measureLabelWrap}>
                    <Text style={[styles.measureLabel, { color: colors.text }]}>{def.label}</Text>
                    <Text style={[styles.measureMethod, { color: colors.textMuted }]} numberOfLines={2}>
                      {def.method}
                      {def.unit ? ` · ${def.unit}` : ''}
                    </Text>
                  </View>
                  <TextInput
                    value={values[id] ?? ''}
                    onChangeText={(t) => setValues((prev) => ({ ...prev, [id]: t }))}
                    placeholder="—"
                    placeholderTextColor={colors.textMuted}
                    style={[inputStyle, styles.measureInput]}
                    keyboardType="decimal-pad"
                    accessibilityLabel={`${def.label} value in ${def.unit || 'units'}`}
                  />
                </View>
              );
            })}
          </View>

          {/* Notes */}
          <Text style={[styles.label, { color: colors.text }]}>Notes (optional)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Kit or strip brand, how long water ran first, etc."
            placeholderTextColor={colors.textMuted}
            style={[inputStyle, styles.notes]}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />

          <Button
            label="Save home test"
            onPress={onSubmit}
            loading={submitting}
            style={{ marginTop: Spacing.lg }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '700',
    marginTop: Spacing.md,
  },
  helper: {
    fontSize: FontSize.xs,
    lineHeight: 17,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  input: {
    minHeight: 46,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
  },
  measureList: {
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  measureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  measureLabelWrap: {
    flex: 1,
  },
  measureLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  measureMethod: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  measureInput: {
    width: 96,
    textAlign: 'right',
  },
  notes: {
    minHeight: 90,
    paddingTop: Spacing.md,
  },
  errorTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  errorItem: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
});

import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Radius, Spacing } from '@/constants/Layout';
import type { Measurement, ParameterId } from '@/src/data/models';
import { PARAMETER_ORDER, PARAMETERS } from '@/src/data/parameters';
import { WATER_BODIES, getWaterBody } from '@/src/data/waterBodies';
import { WATER_BODY_TYPE_LABEL } from '@/src/data/labels';
import { addSample, type DraftSample } from '@/src/services/samples';
import { cleanText } from '@/src/utils/format';
import { COMMUNITY_DISCLAIMER } from '@/src/content/legal';

/** Local YYYY-MM-DD for a Date, used to prefill the collection date. */
function todayIso(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function ReportScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ waterBodyId?: string }>();

  const [waterBodyId, setWaterBodyId] = useState<string>(
    typeof params.waterBodyId === 'string' ? params.waterBodyId : '',
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [collectedDate, setCollectedDate] = useState(todayIso());
  const [notes, setNotes] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Keep the selection in sync when arriving from a water-body detail screen.
  useEffect(() => {
    if (typeof params.waterBodyId === 'string' && params.waterBodyId) {
      setWaterBodyId(params.waterBodyId);
    }
  }, [params.waterBodyId]);

  const selected = waterBodyId ? getWaterBody(waterBodyId) : undefined;

  const pickerResults = useMemo(() => {
    const q = cleanText(pickerQuery).toLowerCase();
    if (!q) return WATER_BODIES;
    return WATER_BODIES.filter((w) =>
      `${w.name} ${w.county} ${w.municipality ?? ''}`.toLowerCase().includes(q),
    );
  }, [pickerQuery]);

  const resetForm = () => {
    setSubmittedBy('');
    setCollectedDate(todayIso());
    setNotes('');
    setValues({});
    setErrors([]);
  };

  const buildMeasurements = (): Measurement[] => {
    const out: Measurement[] = [];
    const collectedAt = new Date(`${collectedDate}T12:00:00`).toISOString();
    for (const id of PARAMETER_ORDER) {
      const raw = values[id];
      if (raw === undefined || cleanText(raw) === '') continue;
      out.push({ parameter: id as ParameterId, value: Number(raw), collectedAt });
    }
    return out;
  };

  const onSubmit = async () => {
    setErrors([]);
    setSuccess(false);
    const parsedDate = Date.parse(`${collectedDate}T12:00:00`);
    if (Number.isNaN(parsedDate)) {
      setErrors(['Enter the collection date as YYYY-MM-DD.']);
      return;
    }
    const draft: DraftSample = {
      waterBodyId,
      submittedBy,
      collectedAt: new Date(parsedDate).toISOString(),
      notes,
      measurements: buildMeasurements(),
    };

    setSubmitting(true);
    try {
      const { sample, validation } = await addSample(draft, Date.now());
      if (!sample) {
        setErrors(validation.errors.length ? validation.errors : ['Could not save the sample.']);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        return;
      }
      setSuccess(true);
      resetForm();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
  ];

  return (
    <AppErrorBoundary name="Report">
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xxl }]}
          keyboardShouldPersistTaps="handled"
        >
          <DisclaimerBanner text={COMMUNITY_DISCLAIMER} tone="warning" />

          {success ? (
            <Card style={{ borderColor: colors.success }}>
              <Text style={[styles.successTitle, { color: colors.success }]}>Sample saved</Text>
              <Text style={[styles.helper, { color: colors.textMuted }]}>
                Your sample is stored on this device and shown as an unverified community sample.
              </Text>
              {selected ? (
                <Button
                  label={`View ${selected.name}`}
                  variant="secondary"
                  onPress={() => router.push(`/water-body/${selected.id}`)}
                  style={{ marginTop: Spacing.md }}
                />
              ) : null}
            </Card>
          ) : null}

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

          {/* Water body */}
          <Text style={[styles.label, { color: colors.text }]}>Water body</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose a water body"
            onPress={() => setPickerOpen(true)}
            style={[inputStyle, styles.selector]}
          >
            <Text style={{ color: selected ? colors.text : colors.textMuted, fontSize: FontSize.md }}>
              {selected ? selected.name : 'Choose a water body…'}
            </Text>
          </Pressable>

          {/* Your name */}
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

          {/* Collection date */}
          <Text style={[styles.label, { color: colors.text }]}>Collection date</Text>
          <TextInput
            value={collectedDate}
            onChangeText={setCollectedDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textMuted}
            style={inputStyle}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
          />

          {/* Measurements */}
          <Text style={[styles.label, { color: colors.text }]}>Measurements</Text>
          <Text style={[styles.helper, { color: colors.textMuted }]}>
            Enter values for the parameters you measured. Leave the rest blank.
          </Text>
          <View style={styles.measureList}>
            {PARAMETER_ORDER.map((id) => {
              const def = PARAMETERS[id];
              return (
                <View key={id} style={styles.measureRow}>
                  <View style={styles.measureLabelWrap}>
                    <Text style={[styles.measureLabel, { color: colors.text }]}>{def.label}</Text>
                    {def.unit ? (
                      <Text style={[styles.measureUnit, { color: colors.textMuted }]}>{def.unit}</Text>
                    ) : null}
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
            placeholder="Conditions, equipment used, recent rainfall…"
            placeholderTextColor={colors.textMuted}
            style={[inputStyle, styles.notes]}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />

          <Button
            label="Submit sample"
            onPress={onSubmit}
            loading={submitting}
            style={{ marginTop: Spacing.lg }}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Water body picker modal */}
      <Modal visible={pickerOpen} animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <View style={[styles.fill, { backgroundColor: colors.background, paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Choose a water body</Text>
            <Pressable onPress={() => setPickerOpen(false)} accessibilityRole="button">
              <Text style={{ color: colors.tint, fontSize: FontSize.lg, fontWeight: '600' }}>Done</Text>
            </Pressable>
          </View>
          <TextInput
            value={pickerQuery}
            onChangeText={setPickerQuery}
            placeholder="Search"
            placeholderTextColor={colors.textMuted}
            style={[inputStyle, { marginHorizontal: Spacing.lg }]}
            autoCorrect={false}
          />
          <ScrollView contentContainerStyle={styles.modalList} keyboardShouldPersistTaps="handled">
            {pickerResults.map((w) => (
              <Pressable
                key={w.id}
                onPress={() => {
                  setWaterBodyId(w.id);
                  setPickerOpen(false);
                  setPickerQuery('');
                }}
                style={({ pressed }) => [
                  styles.modalRow,
                  { borderBottomColor: colors.border, opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Text style={{ color: colors.text, fontSize: FontSize.md, fontWeight: '600' }}>
                  {w.name}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: FontSize.sm }}>
                  {WATER_BODY_TYPE_LABEL[w.type]} · {w.county} County
                </Text>
              </Pressable>
            ))}
            {pickerResults.length === 0 ? (
              <Text style={{ color: colors.textMuted, padding: Spacing.lg }}>No matches.</Text>
            ) : null}
          </ScrollView>
        </View>
      </Modal>
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
  input: {
    minHeight: 46,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
  },
  selector: {
    justifyContent: 'center',
  },
  measureList: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
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
  measureUnit: {
    fontSize: FontSize.xs,
  },
  measureInput: {
    width: 110,
    textAlign: 'right',
  },
  notes: {
    minHeight: 90,
    paddingTop: Spacing.md,
  },
  successTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
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
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  modalList: {
    padding: Spacing.lg,
  },
  modalRow: {
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 2,
  },
});

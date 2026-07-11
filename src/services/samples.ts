import type { CommunitySample, Measurement, ParameterId } from '@/src/data/models';
import { PARAMETERS } from '@/src/data/parameters';
import { makeId } from '@/src/utils/id';
import { cleanText } from '@/src/utils/format';
import { getItem, setItem, StorageKeys } from './storage';

/**
 * Community (crowdsourced) samples service.
 *
 * Samples are persisted locally on the device. The API is deliberately shaped so
 * a networked backend can be dropped in later without changing callers. Every
 * sample is stored as `verified: false` — this app does not and cannot verify
 * community submissions.
 */

/** Fields accepted from the submit form before an id/timestamps are assigned. */
export interface DraftSample {
  waterBodyId: string;
  locationNote?: string;
  latitude?: number;
  longitude?: number;
  submittedBy?: string;
  collectedAt: string;
  notes?: string;
  measurements: Measurement[];
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

/** Reasonable sanity ceilings per parameter to reject obviously bad input. */
const MAX_REASONABLE: Record<ParameterId, number> = {
  ecoli: 200000,
  enterococci: 200000,
  ph: 14,
  dissolvedOxygen: 25,
  turbidity: 4000,
  nitrate: 500,
  phosphorus: 100,
  temperature: 45,
  conductivity: 100000,
};

const MIN_REASONABLE: Record<ParameterId, number> = {
  ecoli: 0,
  enterococci: 0,
  ph: 0,
  dissolvedOxygen: 0,
  turbidity: 0,
  nitrate: 0,
  phosphorus: 0,
  temperature: -5,
  conductivity: 0,
};

/**
 * Validate a draft. `nowMs` is injected so the caller controls the clock; a
 * collection time in the future or more than ~5 years in the past is rejected.
 */
export function validateDraft(draft: DraftSample, nowMs: number): ValidationResult {
  const errors: string[] = [];

  if (!draft.waterBodyId && !cleanText(draft.locationNote)) {
    errors.push('Choose a water body or describe the location.');
  }

  const measurements = draft.measurements ?? [];
  if (measurements.length === 0) {
    errors.push('Add at least one measurement.');
  }

  for (const meas of measurements) {
    const def = PARAMETERS[meas.parameter];
    if (!def) {
      errors.push(`Unknown parameter: ${meas.parameter}.`);
      continue;
    }
    if (!Number.isFinite(meas.value)) {
      errors.push(`Enter a number for ${def.label}.`);
      continue;
    }
    if (meas.value < MIN_REASONABLE[meas.parameter] || meas.value > MAX_REASONABLE[meas.parameter]) {
      errors.push(
        `${def.label} value looks out of range (${MIN_REASONABLE[meas.parameter]}–${MAX_REASONABLE[meas.parameter]} ${def.unit}).`,
      );
    }
  }

  const collectedTime = Date.parse(draft.collectedAt);
  if (Number.isNaN(collectedTime)) {
    errors.push('Enter a valid collection date.');
  } else if (collectedTime > nowMs + 3600000) {
    errors.push('Collection date cannot be in the future.');
  } else if (nowMs - collectedTime > 5 * 365 * 86400000) {
    errors.push('Collection date is too far in the past.');
  }

  if (draft.latitude !== undefined || draft.longitude !== undefined) {
    const lat = draft.latitude;
    const lon = draft.longitude;
    const bothPresent = lat !== undefined && lon !== undefined;
    if (!bothPresent || !Number.isFinite(lat as number) || !Number.isFinite(lon as number)) {
      errors.push('Coordinates must include both latitude and longitude.');
    }
  }

  if (cleanText(draft.notes).length > 500) {
    errors.push('Notes must be 500 characters or fewer.');
  }

  return { ok: errors.length === 0, errors };
}

export async function getSamples(): Promise<CommunitySample[]> {
  const list = await getItem<CommunitySample[]>(StorageKeys.communitySamples, []);
  // Guard against corrupted storage returning a non-array.
  return Array.isArray(list) ? list : [];
}

export async function getSamplesForWaterBody(waterBodyId: string): Promise<CommunitySample[]> {
  const all = await getSamples();
  return all
    .filter((s) => s.waterBodyId === waterBodyId)
    .sort((a, b) => b.collectedAt.localeCompare(a.collectedAt));
}

/**
 * Persist a validated draft. Returns the created sample, or null if validation
 * failed or storage was unavailable. `nowMs` supplies timestamps/id seed.
 */
export async function addSample(
  draft: DraftSample,
  nowMs: number,
): Promise<{ sample: CommunitySample | null; validation: ValidationResult }> {
  const validation = validateDraft(draft, nowMs);
  if (!validation.ok) {
    return { sample: null, validation };
  }

  const nowIso = new Date(nowMs).toISOString();
  const sample: CommunitySample = {
    id: makeId(nowMs),
    waterBodyId: draft.waterBodyId,
    locationNote: cleanText(draft.locationNote) || undefined,
    latitude: draft.latitude,
    longitude: draft.longitude,
    submittedBy: cleanText(draft.submittedBy) || 'Anonymous',
    collectedAt: draft.collectedAt,
    createdAt: nowIso,
    notes: cleanText(draft.notes) || undefined,
    measurements: draft.measurements.map((meas) => ({
      parameter: meas.parameter,
      value: meas.value,
      collectedAt: draft.collectedAt,
    })),
    verified: false,
  };

  const existing = await getSamples();
  const saved = await setItem(StorageKeys.communitySamples, [sample, ...existing]);
  if (!saved) {
    return { sample: null, validation: { ok: false, errors: ['Could not save on this device.'] } };
  }
  return { sample, validation };
}

export async function deleteSample(id: string): Promise<boolean> {
  const existing = await getSamples();
  const next = existing.filter((s) => s.id !== id);
  return setItem(StorageKeys.communitySamples, next);
}

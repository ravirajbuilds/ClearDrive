import {
  HOME_PARAMETERS,
  type FilterType,
  type HomeMeasurement,
  type HomeParameterId,
  type HomeWaterTest,
} from '@/src/data/homeWater';
import { makeId } from '@/src/utils/id';
import { cleanText } from '@/src/utils/format';
import { getItem, setItem, StorageKeys } from './storage';

/**
 * Home tap-water tests service.
 *
 * Mirrors the community samples service: tests are validated, stored locally on
 * the device, and always marked `verified: false`. The API is shaped so a
 * networked backend could be added later without changing callers.
 */

export interface HomeTestDraft {
  filterType: FilterType;
  filterBrand?: string;
  submittedBy?: string;
  testedAt: string;
  notes?: string;
  measurements: HomeMeasurement[];
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

/** Sanity ceilings to reject obviously bad input. */
const MAX_REASONABLE: Record<HomeParameterId, number> = {
  lead: 5000,
  copper: 100,
  pfas: 100000,
  nitrate: 500,
  ph: 14,
  turbidity: 4000,
  freeChlorine: 50,
  tds: 50000,
  hardness: 10000,
  iron: 500,
  fluoride: 100,
};

export function validateHomeDraft(draft: HomeTestDraft, nowMs: number): ValidationResult {
  const errors: string[] = [];

  const measurements = draft.measurements ?? [];
  if (measurements.length === 0) {
    errors.push('Enter at least one measurement.');
  }

  for (const meas of measurements) {
    const def = HOME_PARAMETERS[meas.parameter];
    if (!def) {
      errors.push(`Unknown parameter: ${meas.parameter}.`);
      continue;
    }
    if (!Number.isFinite(meas.value)) {
      errors.push(`Enter a number for ${def.label}.`);
      continue;
    }
    if (meas.value < 0 || meas.value > MAX_REASONABLE[meas.parameter]) {
      errors.push(`${def.label} value looks out of range (0–${MAX_REASONABLE[meas.parameter]} ${def.unit}).`);
    }
  }

  const testedTime = Date.parse(draft.testedAt);
  if (Number.isNaN(testedTime)) {
    errors.push('Enter a valid test date.');
  } else if (testedTime > nowMs + 3600000) {
    errors.push('Test date cannot be in the future.');
  } else if (nowMs - testedTime > 5 * 365 * 86400000) {
    errors.push('Test date is too far in the past.');
  }

  if (cleanText(draft.notes).length > 500) {
    errors.push('Notes must be 500 characters or fewer.');
  }
  if (cleanText(draft.filterBrand).length > 60) {
    errors.push('Filter brand/model must be 60 characters or fewer.');
  }

  return { ok: errors.length === 0, errors };
}

export async function getHomeTests(): Promise<HomeWaterTest[]> {
  const list = await getItem<HomeWaterTest[]>(StorageKeys.homeWaterTests, []);
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => b.testedAt.localeCompare(a.testedAt));
}

export async function addHomeTest(
  draft: HomeTestDraft,
  nowMs: number,
): Promise<{ test: HomeWaterTest | null; validation: ValidationResult }> {
  const validation = validateHomeDraft(draft, nowMs);
  if (!validation.ok) {
    return { test: null, validation };
  }

  const test: HomeWaterTest = {
    id: makeId(nowMs),
    filterType: draft.filterType,
    filterBrand: cleanText(draft.filterBrand) || undefined,
    submittedBy: cleanText(draft.submittedBy) || 'Anonymous',
    testedAt: draft.testedAt,
    createdAt: new Date(nowMs).toISOString(),
    notes: cleanText(draft.notes) || undefined,
    measurements: draft.measurements,
    verified: false,
  };

  const existing = await getHomeTests();
  const saved = await setItem(StorageKeys.homeWaterTests, [test, ...existing]);
  if (!saved) {
    return { test: null, validation: { ok: false, errors: ['Could not save on this device.'] } };
  }
  return { test, validation };
}

export async function deleteHomeTest(id: string): Promise<boolean> {
  const existing = await getHomeTests();
  return setItem(
    StorageKeys.homeWaterTests,
    existing.filter((t) => t.id !== id),
  );
}

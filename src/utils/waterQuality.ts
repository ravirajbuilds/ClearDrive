import type {
  Classification,
  Measurement,
  ParameterId,
  WaterQualityAssessment,
  WqStatus,
} from '@/src/data/models';
import { PARAMETERS } from '@/src/data/parameters';

/** Severity ranking used to pick the worst status in an aggregate. */
const SEVERITY: Record<WqStatus, number> = {
  good: 0,
  moderate: 1,
  poor: 2,
  unhealthy: 3,
  unknown: -1,
};

export const STATUS_LABEL: Record<WqStatus, string> = {
  good: 'Good',
  moderate: 'Moderate',
  poor: 'Poor',
  unhealthy: 'Unhealthy',
  unknown: 'No data',
};

/** Longer, plain-language summary shown on badges and headers. */
export const STATUS_SUMMARY: Record<WqStatus, string> = {
  good: 'Indicators are within healthy reference ranges.',
  moderate: 'Some indicators are slightly outside healthy ranges.',
  poor: 'One or more indicators are well outside healthy ranges.',
  unhealthy: 'One or more indicators suggest conditions to avoid.',
  unknown: 'Not enough data to assess.',
};

/**
 * Classify a single measurement value against its parameter's reference bands.
 * Returns `unknown` for informational-only parameters, unclassifiable values,
 * or unknown parameters.
 */
export function classify(parameter: ParameterId, value: number): Classification {
  const def = PARAMETERS[parameter];
  if (!def || def.informationalOnly || def.bands.length === 0) {
    return { status: 'unknown', label: 'Informational' };
  }
  if (!Number.isFinite(value)) {
    return { status: 'unknown', label: 'No data' };
  }
  for (const band of def.bands) {
    const aboveMin = band.min === undefined || value >= band.min;
    const belowMax = band.max === undefined || value < band.max;
    if (aboveMin && belowMax) {
      return { status: band.status, label: band.label };
    }
  }
  return { status: 'unknown', label: 'Out of reference range' };
}

/**
 * Produce an overall, conservative assessment from a set of measurements: the
 * overall status is the worst classifiable parameter. Informational parameters
 * and non-finite values are excluded from the status but still counted.
 */
export function assess(measurements: Measurement[]): WaterQualityAssessment {
  if (!measurements || measurements.length === 0) {
    return { status: 'unknown', classifiedCount: 0, totalCount: 0 };
  }

  let worst: WqStatus = 'unknown';
  let classifiedCount = 0;
  let latestCollectedAt: string | undefined;

  for (const m of measurements) {
    const c = classify(m.parameter, m.value);
    if (c.status !== 'unknown') {
      classifiedCount += 1;
      if (SEVERITY[c.status] > SEVERITY[worst] || worst === 'unknown') {
        worst = c.status;
      }
    }
    if (m.collectedAt && (!latestCollectedAt || m.collectedAt > latestCollectedAt)) {
      latestCollectedAt = m.collectedAt;
    }
  }

  return {
    status: classifiedCount > 0 ? worst : 'unknown',
    classifiedCount,
    totalCount: measurements.length,
    latestCollectedAt,
  };
}

/** Format a numeric value for display, trimming noise from floats. */
export function formatValue(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (Number.isInteger(value)) return String(value);
  const abs = Math.abs(value);
  const decimals = abs < 1 ? 3 : abs < 10 ? 2 : 1;
  return Number(value.toFixed(decimals)).toString();
}

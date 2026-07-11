import type { Classification, WqStatus } from '@/src/data/models';
import {
  HOME_PARAMETERS,
  type HomeMeasurement,
  type HomeParameterId,
} from '@/src/data/homeWater';
import { classifyBands, overallStatus } from './waterQuality';

/** Classify a single home measurement against its drinking-water reference bands. */
export function classifyHome(parameter: HomeParameterId, value: number): Classification {
  const def = HOME_PARAMETERS[parameter];
  if (!def) {
    return { status: 'unknown', label: 'Informational' };
  }
  return classifyBands(def.bands, value, def.informationalOnly);
}

/** Overall (worst) status for a set of home measurements. */
export function assessHome(measurements: HomeMeasurement[]): WqStatus {
  if (!measurements || measurements.length === 0) return 'unknown';
  return overallStatus(measurements.map((m) => classifyHome(m.parameter, m.value).status));
}

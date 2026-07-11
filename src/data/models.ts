/**
 * Core domain models for ClearDrive.
 *
 * IMPORTANT: The reference ranges and status classifications in this app are
 * general educational indicators, not regulatory determinations. See
 * `src/data/parameters.ts` for the source of each threshold and the disclaimers
 * shown throughout the UI.
 */

/** Coarse water-quality status used for badges and the overall index. */
export type WqStatus = 'good' | 'moderate' | 'poor' | 'unhealthy' | 'unknown';

/** Where a measurement came from. */
export type DataSource = 'official' | 'community';

/** Types of water bodies covered in New Jersey. */
export type WaterBodyType =
  | 'river'
  | 'lake'
  | 'reservoir'
  | 'bay'
  | 'beach'
  | 'creek'
  | 'estuary';

/** Identifiers for the parameters ClearDrive can display. */
export type ParameterId =
  | 'ecoli'
  | 'enterococci'
  | 'ph'
  | 'dissolvedOxygen'
  | 'turbidity'
  | 'nitrate'
  | 'phosphorus'
  | 'temperature'
  | 'conductivity';

/**
 * A single ordered band for classifying a parameter value. A value belongs to
 * the first band where `min <= value < max` (either bound may be omitted for an
 * open end).
 */
export interface ParameterBand {
  status: WqStatus;
  min?: number;
  max?: number;
  /** Short human label for the band, e.g. "Safe for primary contact". */
  label: string;
}

/** Static definition and reference thresholds for a parameter. */
export interface ParameterDefinition {
  id: ParameterId;
  label: string;
  shortLabel: string;
  unit: string;
  /** Plain-language explanation of what the parameter means for the public. */
  description: string;
  /** Ordered classification bands. Empty means "informational only". */
  bands: ParameterBand[];
  /** Citation for the reference thresholds. */
  reference: string;
  /** True when the value has no good/bad direction (e.g. temperature). */
  informationalOnly?: boolean;
}

/** A single measured value for a parameter at a point in time. */
export interface Measurement {
  parameter: ParameterId;
  value: number;
  /** ISO 8601 timestamp of when the sample was collected. */
  collectedAt: string;
}

/** A monitoring station (typically an official USGS/NJDEP station). */
export interface MonitoringStation {
  id: string;
  name: string;
  agency: string;
  latitude: number;
  longitude: number;
}

/** A body of water with associated official monitoring data. */
export interface WaterBody {
  id: string;
  name: string;
  type: WaterBodyType;
  county: string;
  /** Optional municipality / nearest town. */
  municipality?: string;
  latitude: number;
  longitude: number;
  description: string;
  station?: MonitoringStation;
  /** Latest official measurements bundled as offline-safe seed data. */
  officialMeasurements: Measurement[];
  /** Source label for the official data (shown with attribution). */
  officialSource: string;
  /** ISO date the bundled official snapshot was captured. */
  officialSnapshotAt: string;
}

/** A crowdsourced water sample submitted by a community member. */
export interface CommunitySample {
  id: string;
  waterBodyId: string;
  /** Optional free-text location note when not tied to a listed water body. */
  locationNote?: string;
  latitude?: number;
  longitude?: number;
  /** Display name / handle chosen by the submitter (optional, may be "Anonymous"). */
  submittedBy: string;
  collectedAt: string;
  createdAt: string;
  measurements: Measurement[];
  notes?: string;
  /** Community samples are always unverified; kept explicit for future backends. */
  verified: boolean;
}

/** Result of classifying a single measurement against its parameter bands. */
export interface Classification {
  status: WqStatus;
  label: string;
}

/** Aggregate water-quality assessment for a set of measurements. */
export interface WaterQualityAssessment {
  status: WqStatus;
  /** Number of parameters that could be classified (excludes informational). */
  classifiedCount: number;
  /** Total parameters present. */
  totalCount: number;
  /** Most recent collection time across the measurements, if any. */
  latestCollectedAt?: string;
}

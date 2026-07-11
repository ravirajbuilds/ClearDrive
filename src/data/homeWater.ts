import type { ParameterBand } from './models';

/**
 * Home (tap / drinking) water testing domain.
 *
 * This is deliberately separate from the surface-water parameters in
 * `parameters.ts`: the reference points here are DRINKING-water oriented (EPA
 * primary/secondary drinking-water regulations and New Jersey MCLs) and differ
 * from recreational surface-water guidance.
 *
 * IMPORTANT: Home test strips, TDS meters, and mail-in kits are screening tools,
 * not accredited laboratory analyses. The bands below are simplified educational
 * indicators — not a determination that tap water is safe to drink. Lead and
 * PFAS in particular require certified laboratory testing. See the in-app home
 * water disclaimer.
 */

/** Type of point-of-use / point-of-entry treatment the household uses. */
export type FilterType =
  | 'none'
  | 'pitcher'
  | 'faucet'
  | 'countertop'
  | 'undersink'
  | 'ro'
  | 'wholehouse'
  | 'distiller'
  | 'refrigerator'
  | 'other';

export interface FilterOption {
  id: FilterType;
  label: string;
  /** Short note on typical contaminant reduction, for education only. */
  note: string;
}

export const FILTER_OPTIONS: FilterOption[] = [
  { id: 'none', label: 'No filter', note: 'Water tested straight from the tap.' },
  {
    id: 'pitcher',
    label: 'Pitcher / carafe',
    note: 'Activated-carbon pitchers reduce taste, odor, and chlorine; PFAS and lead reduction varies by model and certification.',
  },
  {
    id: 'faucet',
    label: 'Faucet-mounted',
    note: 'Carbon-based; effectiveness depends on the cartridge and its certification.',
  },
  {
    id: 'countertop',
    label: 'Countertop',
    note: 'Ranges from simple carbon to multi-stage systems.',
  },
  {
    id: 'undersink',
    label: 'Under-sink carbon',
    note: 'Carbon-block systems; some are certified for lead and PFAS reduction.',
  },
  {
    id: 'ro',
    label: 'Reverse osmosis',
    note: 'Among the most effective at reducing PFAS, lead, nitrate, and dissolved solids.',
  },
  {
    id: 'wholehouse',
    label: 'Whole-house (point-of-entry)',
    note: 'Treats all water entering the home; media and certification vary widely.',
  },
  {
    id: 'distiller',
    label: 'Distiller',
    note: 'Removes most dissolved contaminants but not all volatile compounds.',
  },
  {
    id: 'refrigerator',
    label: 'Refrigerator / built-in',
    note: 'Typically carbon-based for taste and odor.',
  },
  { id: 'other', label: 'Other', note: 'Describe it in the brand/model field.' },
];

export function getFilterOption(id: FilterType): FilterOption {
  return FILTER_OPTIONS.find((f) => f.id === id) ?? FILTER_OPTIONS[FILTER_OPTIONS.length - 1];
}

/** Parameters a citizen can reasonably measure at home. */
export type HomeParameterId =
  | 'lead'
  | 'copper'
  | 'pfas'
  | 'nitrate'
  | 'ph'
  | 'turbidity'
  | 'freeChlorine'
  | 'tds'
  | 'hardness'
  | 'iron'
  | 'fluoride';

export interface HomeParameterDefinition {
  id: HomeParameterId;
  label: string;
  shortLabel: string;
  unit: string;
  /** How this is typically measured at home. */
  method: string;
  description: string;
  reference: string;
  bands: ParameterBand[];
  informationalOnly?: boolean;
}

export const HOME_PARAMETERS: Record<HomeParameterId, HomeParameterDefinition> = {
  lead: {
    id: 'lead',
    label: 'Lead',
    shortLabel: 'Lead',
    unit: 'ppb',
    method: 'Home test strip or, preferably, a certified lab',
    description:
      'A toxic metal that can leach from older pipes and fixtures. There is no known safe level, especially for children and pregnant people.',
    reference: 'US EPA action level is 15 ppb; the health goal (MCLG) is zero.',
    bands: [
      { status: 'good', min: 0, max: 5, label: 'Low (confirm with a lab)' },
      { status: 'moderate', min: 5, max: 15, label: 'Elevated' },
      { status: 'poor', min: 15, max: 50, label: 'At or above EPA action level' },
      { status: 'unhealthy', min: 50, label: 'Well above action level' },
    ],
  },
  copper: {
    id: 'copper',
    label: 'Copper',
    shortLabel: 'Copper',
    unit: 'mg/L',
    method: 'Test strip or lab',
    description:
      'Can leach from copper plumbing, especially in newer homes or after water sits. High levels cause stomach upset.',
    reference: 'US EPA action level is 1.3 mg/L.',
    bands: [
      { status: 'good', min: 0, max: 1, label: 'Low' },
      { status: 'moderate', min: 1, max: 1.3, label: 'Approaching action level' },
      { status: 'poor', min: 1.3, max: 5, label: 'At or above action level' },
      { status: 'unhealthy', min: 5, label: 'Very high' },
    ],
  },
  pfas: {
    id: 'pfas',
    label: 'PFAS (combined estimate)',
    shortLabel: 'PFAS',
    unit: 'ppt',
    method: 'Mail-in laboratory kit (home strips cannot reliably measure PFAS)',
    description:
      '“Forever chemicals” linked to health effects at very low levels. Enter a combined PFOA + PFOS estimate in parts per trillion. Reliable PFAS results require an accredited lab.',
    reference:
      'US EPA 2024 limits: 4 ppt for PFOA and for PFOS. New Jersey MCLs: PFOA 14 ppt, PFOS 13 ppt, PFNA 13 ppt.',
    bands: [
      { status: 'good', min: 0, max: 4, label: 'Below the 4 ppt EPA limit' },
      { status: 'moderate', min: 4, max: 14, label: 'Above EPA limit; near NJ limits' },
      { status: 'poor', min: 14, max: 70, label: 'Above NJ maximum contaminant levels' },
      { status: 'unhealthy', min: 70, label: 'Well above regulatory limits' },
    ],
  },
  nitrate: {
    id: 'nitrate',
    label: 'Nitrate (as N)',
    shortLabel: 'Nitrate',
    unit: 'mg/L',
    method: 'Test strip or lab',
    description:
      'Comes from fertilizer, septic systems, and runoff. High levels are especially dangerous for infants under six months (“blue baby syndrome”).',
    reference: 'US EPA drinking-water MCL is 10 mg/L as N.',
    bands: [
      { status: 'good', min: 0, max: 5, label: 'Low' },
      { status: 'moderate', min: 5, max: 10, label: 'Elevated' },
      { status: 'poor', min: 10, max: 20, label: 'Above drinking-water MCL' },
      { status: 'unhealthy', min: 20, label: 'Very high' },
    ],
  },
  ph: {
    id: 'ph',
    label: 'pH',
    shortLabel: 'pH',
    unit: '',
    method: 'Test strip or pH meter',
    description:
      'How acidic or basic the water is. Very low pH can make water corrosive to plumbing, which can increase metals like lead and copper.',
    reference: 'US EPA secondary (aesthetic) range is 6.5–8.5.',
    bands: [
      { status: 'unhealthy', max: 5, label: 'Strongly acidic — corrosive' },
      { status: 'poor', min: 5, max: 6.5, label: 'Acidic — below recommended range' },
      { status: 'good', min: 6.5, max: 8.5, label: 'Recommended range' },
      { status: 'poor', min: 8.5, max: 9.5, label: 'Basic — above recommended range' },
      { status: 'unhealthy', min: 9.5, label: 'Strongly basic' },
    ],
  },
  turbidity: {
    id: 'turbidity',
    label: 'Turbidity',
    shortLabel: 'Turbidity',
    unit: 'NTU',
    method: 'Turbidity meter or visual clarity',
    description:
      'Cloudiness from suspended particles. Treated tap water should be very clear; cloudiness can indicate a plumbing or treatment issue.',
    reference: 'US EPA requires filtered systems to stay below 1 NTU (goal below 0.3 NTU).',
    bands: [
      { status: 'good', min: 0, max: 1, label: 'Clear' },
      { status: 'moderate', min: 1, max: 5, label: 'Slightly cloudy' },
      { status: 'poor', min: 5, max: 25, label: 'Cloudy' },
      { status: 'unhealthy', min: 25, label: 'Very cloudy' },
    ],
  },
  freeChlorine: {
    id: 'freeChlorine',
    label: 'Free chlorine',
    shortLabel: 'Chlorine',
    unit: 'mg/L',
    method: 'Test strip',
    description:
      'Added by most utilities to keep water safe through the pipes. A small residual is expected; very high levels affect taste and odor.',
    reference: 'US EPA maximum residual disinfectant level is 4 mg/L.',
    bands: [
      { status: 'moderate', min: 0, max: 0.2, label: 'Low residual' },
      { status: 'good', min: 0.2, max: 2, label: 'Typical residual' },
      { status: 'moderate', min: 2, max: 4, label: 'High — taste and odor' },
      { status: 'poor', min: 4, label: 'Above EPA maximum residual level' },
    ],
  },
  tds: {
    id: 'tds',
    label: 'Total dissolved solids',
    shortLabel: 'TDS',
    unit: 'mg/L',
    method: 'TDS / conductivity meter',
    description:
      'A rough measure of dissolved minerals and salts. Mostly an aesthetic indicator, but sudden changes can signal a problem worth investigating.',
    reference: 'US EPA secondary (aesthetic) standard is 500 mg/L.',
    bands: [
      { status: 'good', min: 0, max: 300, label: 'Good' },
      { status: 'moderate', min: 300, max: 500, label: 'Fair' },
      { status: 'poor', min: 500, max: 1000, label: 'Above secondary standard' },
      { status: 'unhealthy', min: 1000, label: 'Very high' },
    ],
  },
  hardness: {
    id: 'hardness',
    label: 'Hardness',
    shortLabel: 'Hardness',
    unit: 'mg/L',
    method: 'Test strip',
    description:
      'Dissolved calcium and magnesium (as CaCO₃). Not a health concern — it affects scale, soap, and taste. Soft <60, moderate 60–120, hard 120–180, very hard >180.',
    reference: 'Aesthetic only; no health-based standard.',
    informationalOnly: true,
    bands: [],
  },
  iron: {
    id: 'iron',
    label: 'Iron',
    shortLabel: 'Iron',
    unit: 'mg/L',
    method: 'Test strip',
    description:
      'Causes rusty color, staining, and metallic taste. Mainly an aesthetic issue rather than a health risk at typical levels.',
    reference: 'US EPA secondary (aesthetic) standard is 0.3 mg/L.',
    bands: [
      { status: 'good', min: 0, max: 0.3, label: 'Low' },
      { status: 'moderate', min: 0.3, max: 1, label: 'Above aesthetic standard' },
      { status: 'poor', min: 1, label: 'High — staining likely' },
    ],
  },
  fluoride: {
    id: 'fluoride',
    label: 'Fluoride',
    shortLabel: 'Fluoride',
    unit: 'mg/L',
    method: 'Test strip or lab',
    description:
      'Often added at low levels for dental health. Very high natural levels can affect teeth and bones.',
    reference: 'US EPA MCL is 4 mg/L; secondary standard is 2 mg/L.',
    bands: [
      { status: 'good', min: 0, max: 2, label: 'Within secondary standard' },
      { status: 'moderate', min: 2, max: 4, label: 'Above secondary standard' },
      { status: 'poor', min: 4, label: 'Above EPA MCL' },
    ],
  },
};

/** Display order — health-critical parameters first. */
export const HOME_PARAMETER_ORDER: HomeParameterId[] = [
  'lead',
  'copper',
  'pfas',
  'nitrate',
  'ph',
  'freeChlorine',
  'turbidity',
  'tds',
  'hardness',
  'iron',
  'fluoride',
];

/** A single home measurement. */
export interface HomeMeasurement {
  parameter: HomeParameterId;
  value: number;
}

/** A crowdsourced home tap-water test, stored on-device and always unverified. */
export interface HomeWaterTest {
  id: string;
  filterType: FilterType;
  /** Optional brand/model text for the filter. */
  filterBrand?: string;
  submittedBy: string;
  /** ISO date the sample was tested. */
  testedAt: string;
  createdAt: string;
  measurements: HomeMeasurement[];
  notes?: string;
  verified: boolean;
}

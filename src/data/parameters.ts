import type { ParameterDefinition, ParameterId } from './models';

/**
 * Parameter reference thresholds.
 *
 * These bands are simplified, educational indicators drawn from widely published
 * public-health and ecological guidance. They are NOT the legal water-quality
 * standards used by regulators, and a single sample cannot determine whether
 * water is safe. Always defer to official advisories.
 *
 * Sources referenced (general guidance, adapted into coarse bands):
 * - US EPA Recreational Water Quality Criteria (2012) for bacteria.
 * - US EPA National Primary/Secondary Drinking Water Regulations for nitrate.
 * - NJDEP Surface Water Quality Standards (N.J.A.C. 7:9B) for pH / dissolved oxygen.
 * - General limnology references for turbidity, phosphorus, conductivity.
 */
export const PARAMETERS: Record<ParameterId, ParameterDefinition> = {
  ecoli: {
    id: 'ecoli',
    label: 'E. coli bacteria',
    shortLabel: 'E. coli',
    unit: 'MPN/100 mL',
    description:
      'Indicator bacteria used to estimate the risk of illness from swimming or other primary contact in fresh water. Higher counts mean higher risk.',
    reference:
      'Adapted from US EPA Recreational Water Quality Criteria (2012), freshwater primary contact.',
    bands: [
      { status: 'good', min: 0, max: 126, label: 'Low risk for primary contact' },
      { status: 'moderate', min: 126, max: 235, label: 'Elevated — caution advised' },
      { status: 'poor', min: 235, max: 410, label: 'High — above single-sample guidance' },
      { status: 'unhealthy', min: 410, label: 'Very high — avoid contact' },
    ],
  },
  enterococci: {
    id: 'enterococci',
    label: 'Enterococci bacteria',
    shortLabel: 'Enterococci',
    unit: 'MPN/100 mL',
    description:
      'Indicator bacteria used for marine and estuarine beaches to estimate illness risk from swimming. Higher counts mean higher risk.',
    reference:
      'Adapted from US EPA Recreational Water Quality Criteria (2012), marine primary contact.',
    bands: [
      { status: 'good', min: 0, max: 35, label: 'Low risk for primary contact' },
      { status: 'moderate', min: 35, max: 70, label: 'Elevated — caution advised' },
      { status: 'poor', min: 70, max: 104, label: 'High — above single-sample guidance' },
      { status: 'unhealthy', min: 104, label: 'Very high — avoid contact' },
    ],
  },
  ph: {
    id: 'ph',
    label: 'pH',
    shortLabel: 'pH',
    unit: '',
    description:
      'How acidic or basic the water is. Aquatic life generally does best in a near-neutral range; extremes stress plants and animals.',
    reference: 'Adapted from NJDEP Surface Water Quality Standards (N.J.A.C. 7:9B) freshwater range 6.5–8.5.',
    bands: [
      { status: 'unhealthy', max: 5, label: 'Strongly acidic' },
      { status: 'poor', min: 5, max: 6.5, label: 'Acidic — outside healthy range' },
      { status: 'good', min: 6.5, max: 8.5, label: 'Healthy range' },
      { status: 'poor', min: 8.5, max: 9.5, label: 'Basic — outside healthy range' },
      { status: 'unhealthy', min: 9.5, label: 'Strongly basic' },
    ],
  },
  dissolvedOxygen: {
    id: 'dissolvedOxygen',
    label: 'Dissolved oxygen',
    shortLabel: 'Diss. O₂',
    unit: 'mg/L',
    description:
      'Oxygen available in the water for fish and other aquatic life. Lower values indicate stress; very low values can cause fish kills.',
    reference: 'Adapted from NJDEP freshwater dissolved-oxygen criteria (minimum ~4–5 mg/L).',
    bands: [
      { status: 'unhealthy', min: 0, max: 3, label: 'Severe — aquatic life at risk' },
      { status: 'poor', min: 3, max: 5, label: 'Low — stressful for aquatic life' },
      { status: 'moderate', min: 5, max: 6.5, label: 'Fair' },
      { status: 'good', min: 6.5, label: 'Healthy oxygen levels' },
    ],
  },
  turbidity: {
    id: 'turbidity',
    label: 'Turbidity',
    shortLabel: 'Turbidity',
    unit: 'NTU',
    description:
      'Cloudiness of the water from suspended particles. Higher turbidity can indicate runoff, erosion, or pollution and reduces light for aquatic plants.',
    reference: 'General limnology guidance; interpret alongside recent rainfall.',
    bands: [
      { status: 'good', min: 0, max: 10, label: 'Clear' },
      { status: 'moderate', min: 10, max: 25, label: 'Slightly cloudy' },
      { status: 'poor', min: 25, max: 50, label: 'Cloudy' },
      { status: 'unhealthy', min: 50, label: 'Very cloudy' },
    ],
  },
  nitrate: {
    id: 'nitrate',
    label: 'Nitrate (as N)',
    shortLabel: 'Nitrate',
    unit: 'mg/L',
    description:
      'A nutrient from fertilizer, sewage, and runoff. High levels fuel algae blooms and, in drinking water, can pose health risks for infants.',
    reference:
      'US EPA drinking-water MCL is 10 mg/L as N; surface-water context differs. Shown for awareness only.',
    bands: [
      { status: 'good', min: 0, max: 3, label: 'Low' },
      { status: 'moderate', min: 3, max: 10, label: 'Elevated' },
      { status: 'poor', min: 10, max: 20, label: 'High — above drinking-water MCL' },
      { status: 'unhealthy', min: 20, label: 'Very high' },
    ],
  },
  phosphorus: {
    id: 'phosphorus',
    label: 'Total phosphorus',
    shortLabel: 'Phosphorus',
    unit: 'mg/L',
    description:
      'A nutrient that, in excess, drives algae blooms and low-oxygen conditions in lakes and slow-moving streams.',
    reference: 'Adapted from US EPA guidance for streams (~0.1 mg/L) and lakes (~0.05 mg/L).',
    bands: [
      { status: 'good', min: 0, max: 0.05, label: 'Low' },
      { status: 'moderate', min: 0.05, max: 0.1, label: 'Elevated' },
      { status: 'poor', min: 0.1, max: 0.3, label: 'High' },
      { status: 'unhealthy', min: 0.3, label: 'Very high — bloom risk' },
    ],
  },
  temperature: {
    id: 'temperature',
    label: 'Water temperature',
    shortLabel: 'Temp',
    unit: '°C',
    description:
      'Water temperature affects how much oxygen the water can hold and which species can thrive. Shown for context.',
    reference: 'Informational; interpret alongside season and water-body type.',
    informationalOnly: true,
    bands: [],
  },
  conductivity: {
    id: 'conductivity',
    label: 'Specific conductance',
    shortLabel: 'Conductivity',
    unit: 'µS/cm',
    description:
      'A measure of dissolved salts and minerals. Sudden increases can signal road salt, wastewater, or other pollution.',
    reference: 'General guidance; typical freshwater streams run 150–500 µS/cm.',
    bands: [
      { status: 'good', min: 0, max: 500, label: 'Typical for freshwater' },
      { status: 'moderate', min: 500, max: 1000, label: 'Elevated' },
      { status: 'poor', min: 1000, max: 2000, label: 'High' },
      { status: 'unhealthy', min: 2000, label: 'Very high' },
    ],
  },
};

/** Stable display order for parameters. */
export const PARAMETER_ORDER: ParameterId[] = [
  'ecoli',
  'enterococci',
  'ph',
  'dissolvedOxygen',
  'turbidity',
  'nitrate',
  'phosphorus',
  'conductivity',
  'temperature',
];

export function getParameter(id: ParameterId): ParameterDefinition {
  return PARAMETERS[id];
}

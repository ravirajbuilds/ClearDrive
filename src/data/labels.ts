import type { WaterBodyType } from './models';

export const WATER_BODY_TYPE_LABEL: Record<WaterBodyType, string> = {
  river: 'River',
  lake: 'Lake',
  reservoir: 'Reservoir',
  bay: 'Bay',
  beach: 'Beach',
  creek: 'Creek',
  estuary: 'Estuary',
};

export const WATER_BODY_TYPE_ICON: Record<WaterBodyType, string> = {
  river: '🏞️',
  lake: '🛶',
  reservoir: '💧',
  bay: '⛵',
  beach: '🏖️',
  creek: '🌿',
  estuary: '🐚',
};

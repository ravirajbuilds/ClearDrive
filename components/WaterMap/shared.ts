/**
 * Shared, platform-agnostic pieces for the MapLibre water-body map.
 *
 * The map renders every NJ water body as a status-colored marker. Both the web
 * (MapLibre GL JS) and native (MapLibre GL JS inside a WebView) implementations
 * use the same point shape, marker colors, and map style so the visualization
 * looks and behaves identically across platforms.
 *
 * MapLibre is the open-source fork of Mapbox GL JS and needs no access token.
 * The default basemap uses tokenless CARTO raster tiles (© OpenStreetMap
 * contributors © CARTO) with light/dark variants that follow the app theme.
 */

import type { StyleSpecification } from 'maplibre-gl';

import { StatusColors, type ColorScheme } from '@/constants/Colors';
import type { WqStatus } from '@/src/data/models';

/** A single mappable water body. */
export interface WaterMapPoint {
  id: string;
  name: string;
  /** Human-readable water-body type, e.g. "River". */
  typeLabel: string;
  status: WqStatus;
  latitude: number;
  longitude: number;
  sampleCount: number;
}

export interface WaterMapProps {
  points: WaterMapPoint[];
  colorScheme: ColorScheme;
  /** Optional on-device user location shown as a distinct marker. */
  userLocation?: { latitude: number; longitude: number } | null;
  /** Called with a water-body id when a marker is tapped. */
  onSelectPoint?: (id: string) => void;
  /** Fit the map to a single point at this zoom instead of all of NJ. */
  focusPoint?: { latitude: number; longitude: number } | null;
}

/**
 * Optional custom MapLibre style URL (e.g. a MapTiler/Stadia vector style). Read
 * from `EXPO_PUBLIC_MAP_STYLE_URL`; when unset the built-in CARTO raster style is
 * used, so the map works with zero configuration.
 */
export const MAP_STYLE_OVERRIDE: string = process.env.EXPO_PUBLIC_MAP_STYLE_URL ?? '';

/** Default view centered on New Jersey. */
export const NJ_CENTER = { longitude: -74.45, latitude: 40.1, zoom: 6.7 } as const;

const CARTO_ATTRIBUTION = '© OpenStreetMap contributors © CARTO';

function cartoTiles(variant: 'light_all' | 'dark_all'): string[] {
  return ['a', 'b', 'c', 'd'].map(
    (s) => `https://${s}.basemaps.cartocdn.com/${variant}/{z}/{x}/{y}.png`,
  );
}

/**
 * The MapLibre style for the active color scheme: the custom override URL if one
 * is configured, otherwise a tokenless CARTO raster basemap.
 */
export function mapStyle(scheme: ColorScheme): StyleSpecification | string {
  if (MAP_STYLE_OVERRIDE.trim().length > 0) {
    return MAP_STYLE_OVERRIDE;
  }
  return {
    version: 8,
    sources: {
      carto: {
        type: 'raster',
        tiles: cartoTiles(scheme === 'dark' ? 'dark_all' : 'light_all'),
        tileSize: 256,
        attribution: CARTO_ATTRIBUTION,
      },
    },
    layers: [{ id: 'carto', type: 'raster', source: 'carto' }],
  };
}

/** Solid marker color for a water-quality status in the active scheme. */
export function markerColor(status: WqStatus, scheme: ColorScheme): string {
  return StatusColors[scheme][status].fg;
}

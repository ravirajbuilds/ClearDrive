/**
 * Shared, platform-agnostic pieces for the Mapbox water-body map.
 *
 * The map renders every NJ water body as a status-colored marker. Both the web
 * (Mapbox GL JS) and native (Mapbox GL JS inside a WebView) implementations use
 * the same point shape, marker colors, and Mapbox style so the visualization
 * looks and behaves identically across platforms.
 */

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
 * The Mapbox public access token, read from the `EXPO_PUBLIC_MAPBOX_TOKEN`
 * environment variable (Expo inlines `EXPO_PUBLIC_*` at build time). Empty when
 * unset, in which case the map renders a friendly "token required" state instead
 * of crashing.
 */
export const MAPBOX_TOKEN: string = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '';

export function hasMapboxToken(): boolean {
  return MAPBOX_TOKEN.trim().length > 0;
}

/** Default view centered on New Jersey. */
export const NJ_CENTER = { longitude: -74.45, latitude: 40.1, zoom: 6.7 } as const;

/** Mapbox style URL for the active color scheme. */
export function mapStyleUrl(scheme: ColorScheme): string {
  return scheme === 'dark'
    ? 'mapbox://styles/mapbox/dark-v11'
    : 'mapbox://styles/mapbox/light-v11';
}

/** Solid marker color for a water-quality status in the active scheme. */
export function markerColor(status: WqStatus, scheme: ColorScheme): string {
  return StatusColors[scheme][status].fg;
}

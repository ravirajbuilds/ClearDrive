/** Geospatial helpers. */

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance between two coordinates in kilometers. */
export function distanceKm(
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number,
): number {
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Format a distance in km into a short, locale-neutral miles label. */
export function formatDistance(km: number): string {
  const miles = km * 0.621371;
  if (miles < 0.1) return 'nearby';
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

/** Approximate bounding box for New Jersey, used to validate coordinates. */
export const NJ_BOUNDS = {
  minLat: 38.8,
  maxLat: 41.4,
  minLon: -75.6,
  maxLon: -73.8,
};

/** True when a coordinate is a plausible location within/near New Jersey. */
export function isWithinNJ(lat: number, lon: number): boolean {
  return (
    lat >= NJ_BOUNDS.minLat &&
    lat <= NJ_BOUNDS.maxLat &&
    lon >= NJ_BOUNDS.minLon &&
    lon <= NJ_BOUNDS.maxLon
  );
}

/** True when a coordinate pair is finite and within valid earth ranges. */
export function isValidCoordinate(lat: number, lon: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

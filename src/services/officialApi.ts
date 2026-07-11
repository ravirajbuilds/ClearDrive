import type { Measurement, ParameterId, WaterBody } from '@/src/data/models';
import { getItem, setItem, StorageKeys } from './storage';

/**
 * Official water-quality data client.
 *
 * When a water body has a USGS station and the device is online, this fetches
 * recent instantaneous values from the USGS National Water Information System
 * (a free, public, no-key API). On any failure — offline, timeout, malformed
 * response, or a station without matching data — it falls back to the bundled
 * illustrative snapshot so the UI always has something to show.
 *
 * Successful live results are cached briefly to avoid hammering the API.
 */

const USGS_IV_BASE = 'https://waterservices.usgs.gov/nwis/iv/';
const REQUEST_TIMEOUT_MS = 9000;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/** USGS parameter codes mapped to ClearDrive parameter ids. */
const USGS_PARAM_MAP: Record<string, ParameterId> = {
  '00010': 'temperature',
  '00300': 'dissolvedOxygen',
  '00400': 'ph',
  '00095': 'conductivity',
  '63680': 'turbidity',
  '00618': 'nitrate',
};

const USGS_PARAM_CODES = Object.keys(USGS_PARAM_MAP).join(',');

export type OfficialDataOrigin = 'live' | 'cache' | 'sample';

export interface OfficialData {
  measurements: Measurement[];
  /** Where the shown data came from. */
  origin: OfficialDataOrigin;
  /** Human-readable attribution for the source. */
  source: string;
  /** ISO timestamp of when the data was retrieved or captured. */
  retrievedAt: string;
}

interface CacheEntry {
  data: OfficialData;
  storedAtMs: number;
}

function cacheKey(stationId: string): string {
  return `${StorageKeys.cachedOfficial}:${stationId}`;
}

function bundledFallback(waterBody: WaterBody): OfficialData {
  return {
    measurements: waterBody.officialMeasurements,
    origin: 'sample',
    source: waterBody.officialSource,
    retrievedAt: waterBody.officialSnapshotAt,
  };
}

/** Fetch JSON with an abort-based timeout; throws on non-2xx or timeout. */
async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as unknown;
  } finally {
    clearTimeout(timer);
  }
}

/** Parse the USGS IV JSON payload into measurements; tolerant of shape drift. */
function parseUsgs(payload: unknown): Measurement[] {
  const out: Measurement[] = [];
  const timeSeries = (payload as any)?.value?.timeSeries;
  if (!Array.isArray(timeSeries)) return out;

  for (const series of timeSeries) {
    try {
      const code: string | undefined = series?.variable?.variableCode?.[0]?.value;
      const param = code ? USGS_PARAM_MAP[code] : undefined;
      if (!param) continue;

      const values = series?.values?.[0]?.value;
      const latest = Array.isArray(values) && values.length > 0 ? values[values.length - 1] : null;
      if (!latest) continue;

      const value = Number(latest.value);
      const noData = Number(series?.variable?.noDataValue);
      if (!Number.isFinite(value) || value === noData) continue;

      const collectedAt = typeof latest.dateTime === 'string' ? latest.dateTime : new Date().toISOString();
      out.push({ parameter: param, value, collectedAt });
    } catch {
      // Skip any malformed series without failing the whole parse.
    }
  }
  return out;
}

async function readCache(stationId: string, nowMs: number): Promise<OfficialData | null> {
  const entry = await getItem<CacheEntry | null>(cacheKey(stationId), null);
  if (!entry || typeof entry.storedAtMs !== 'number') return null;
  if (nowMs - entry.storedAtMs > CACHE_TTL_MS) return null;
  return { ...entry.data, origin: 'cache' };
}

/**
 * Resolve official data for a water body. `nowMs` is injected for cache TTL and
 * timestamps. Never throws — always resolves to displayable data.
 */
export async function getOfficialData(
  waterBody: WaterBody,
  nowMs: number,
  options: { forceRefresh?: boolean } = {},
): Promise<OfficialData> {
  const station = waterBody.station;
  if (!station) {
    return bundledFallback(waterBody);
  }

  if (!options.forceRefresh) {
    const cached = await readCache(station.id, nowMs);
    if (cached) return cached;
  }

  try {
    const url = `${USGS_IV_BASE}?format=json&sites=${encodeURIComponent(station.id)}&parameterCd=${USGS_PARAM_CODES}&siteStatus=all`;
    const payload = await fetchJson(url);
    const measurements = parseUsgs(payload);

    if (measurements.length === 0) {
      // Station returned nothing usable — keep the bundled snapshot for context.
      return bundledFallback(waterBody);
    }

    const data: OfficialData = {
      measurements,
      origin: 'live',
      source: `USGS NWIS · station ${station.id} (${station.name})`,
      retrievedAt: new Date(nowMs).toISOString(),
    };
    await setItem<CacheEntry>(cacheKey(station.id), { data, storedAtMs: nowMs });
    return data;
  } catch (err) {
    console.warn(`[officialApi] live fetch failed for ${station.id}:`, err);
    // Try any stale cache before falling back to the bundled snapshot.
    const stale = await getItem<CacheEntry | null>(cacheKey(station.id), null);
    if (stale?.data) {
      return { ...stale.data, origin: 'cache' };
    }
    return bundledFallback(waterBody);
  }
}

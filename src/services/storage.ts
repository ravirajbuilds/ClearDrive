import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Namespaced, JSON-safe wrapper around AsyncStorage. Every method fails soft:
 * storage errors are logged and swallowed so the UI never crashes because
 * persistence was unavailable (private mode, full disk, web fallback, etc.).
 */

const PREFIX = 'cleardrive:';

export const StorageKeys = {
  disclaimerAccepted: 'disclaimer_accepted_version',
  communitySamples: 'community_samples',
  homeWaterTests: 'home_water_tests',
  cachedOfficial: 'cached_official',
  settings: 'settings',
} as const;

function fullKey(key: string): string {
  return `${PREFIX}${key}`;
}

export async function getItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(fullKey(key));
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[storage] failed to read "${key}":`, err);
    return fallback;
  }
}

export async function setItem<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(fullKey(key), JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[storage] failed to write "${key}":`, err);
    return false;
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(fullKey(key));
  } catch (err) {
    console.warn(`[storage] failed to remove "${key}":`, err);
  }
}

import * as Location from 'expo-location';

/**
 * Location service. Location is entirely optional in ClearDrive — it is used only
 * to sort nearby water bodies and to prefill coordinates when submitting a
 * sample. Every path degrades gracefully when permission is denied or the
 * platform has no location provider.
 */

export type LocationStatus = 'granted' | 'denied' | 'unavailable';

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface LocationResult {
  status: LocationStatus;
  location: UserLocation | null;
}

/** Request permission (if needed) and return the current position, or a reason. */
export async function getCurrentLocation(): Promise<LocationResult> {
  try {
    const services = await Location.hasServicesEnabledAsync().catch(() => true);
    if (!services) {
      return { status: 'unavailable', location: null };
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return { status: 'denied', location: null };
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      status: 'granted',
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    };
  } catch (err) {
    console.warn('[location] failed to get position:', err);
    return { status: 'unavailable', location: null };
  }
}

/** Check current permission without prompting. */
export async function getLocationPermissionStatus(): Promise<LocationStatus> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') return 'granted';
    return status === 'denied' ? 'denied' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

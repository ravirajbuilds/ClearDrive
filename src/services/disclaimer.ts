import { getItem, setItem, StorageKeys } from './storage';

/**
 * The disclaimer/consent version. Bump this string whenever the substance of the
 * safety disclaimer changes so previously-consented users are re-prompted.
 */
export const DISCLAIMER_VERSION = '2026-07-01';

export async function hasAcceptedDisclaimer(): Promise<boolean> {
  const accepted = await getItem<string | null>(StorageKeys.disclaimerAccepted, null);
  return accepted === DISCLAIMER_VERSION;
}

export async function acceptDisclaimer(): Promise<void> {
  await setItem(StorageKeys.disclaimerAccepted, DISCLAIMER_VERSION);
}

/**
 * Generate a reasonably unique id without native crypto dependencies.
 * `seed` (typically Date.now() supplied by the caller) keeps ids monotonic and
 * avoids relying on a global clock inside this module.
 */
export function makeId(seed: number): string {
  const rand = Math.floor(Math.random() * 1e9).toString(36);
  return `${seed.toString(36)}-${rand}`;
}

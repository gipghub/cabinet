/**
 * Ask the browser to make this origin's storage *persistent* so the user's
 * data (medicines, dose log, dismissed alerts in IndexedDB) is not evicted
 * under storage pressure or after periods of inactivity.
 *
 * Behavior by platform:
 * - Chrome/Edge/Firefox: grants based on engagement signals (installed PWA,
 *   bookmarked, high engagement) — often silently granted for installed PWAs.
 * - iOS Safari: support is limited; without this, IndexedDB for a PWA can be
 *   evicted after ~7 days of no use. Requesting it is harmless where ignored.
 *
 * Safe to call on every launch — it's idempotent and resolves to the current
 * state. Never throws; returns the resulting persistence state.
 */
export async function requestPersistentStorage(): Promise<{
  supported: boolean;
  persisted: boolean;
}> {
  try {
    if (
      typeof navigator === 'undefined' ||
      !navigator.storage ||
      typeof navigator.storage.persist !== 'function'
    ) {
      return { supported: false, persisted: false };
    }

    // Already granted? Don't re-prompt the engine.
    if (typeof navigator.storage.persisted === 'function') {
      const already = await navigator.storage.persisted();
      if (already) return { supported: true, persisted: true };
    }

    const persisted = await navigator.storage.persist();
    return { supported: true, persisted };
  } catch {
    // Permissions/quota APIs can throw in locked-down contexts — degrade quietly.
    return { supported: false, persisted: false };
  }
}

/**
 * Best-effort storage usage estimate, for diagnostics. Returns null when the
 * StorageManager estimate API is unavailable.
 */
export async function storageEstimate(): Promise<StorageEstimate | null> {
  try {
    if (navigator.storage?.estimate) {
      return await navigator.storage.estimate();
    }
  } catch {
    /* ignore */
  }
  return null;
}

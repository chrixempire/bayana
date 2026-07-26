/** Persistent auth storage shared across tabs on the same origin. */
const STORAGE = localStorage

const LEGACY_STORAGE = sessionStorage

function migrateLegacyKey(key: string) {
  try {
    const legacy = LEGACY_STORAGE.getItem(key)
    if (legacy === null) return

    STORAGE.setItem(key, legacy)
    LEGACY_STORAGE.removeItem(key)
  } catch {
    // Ignore quota / private mode errors during migration.
  }
}

export function getAuthStorageItem(key: string): string | null {
  try {
    const value = STORAGE.getItem(key)
    if (value !== null) return value

    migrateLegacyKey(key)
    return STORAGE.getItem(key)
  } catch {
    return null
  }
}

export function setAuthStorageItem(key: string, value: string) {
  try {
    STORAGE.setItem(key, value)
    LEGACY_STORAGE.removeItem(key)
  } catch {
    // Ignore write failures (private mode, quota).
  }
}

export function removeAuthStorageItem(key: string) {
  try {
    STORAGE.removeItem(key)
    LEGACY_STORAGE.removeItem(key)
  } catch {
    // Ignore remove failures.
  }
}

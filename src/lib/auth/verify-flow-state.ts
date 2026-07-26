import { getAuthStorageItem, removeAuthStorageItem, setAuthStorageItem } from "./auth-storage"

const VERIFY_AFTER_LOGIN_KEY = "bayana-verify-after-login"

/** Set when the user must sign in before verification (different browser/device). */
export function markVerifyAfterLogin() {
  setAuthStorageItem(VERIFY_AFTER_LOGIN_KEY, "1")
}

export function consumeVerifyAfterLogin(): boolean {
  const value = getAuthStorageItem(VERIFY_AFTER_LOGIN_KEY)
  removeAuthStorageItem(VERIFY_AFTER_LOGIN_KEY)
  return value === "1"
}

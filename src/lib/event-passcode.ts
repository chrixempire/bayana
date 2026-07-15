const PASSCODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function generateEventPasscode(length = 8): string {
  let result = ""
  for (let index = 0; index < length; index += 1) {
    result += PASSCODE_CHARS[Math.floor(Math.random() * PASSCODE_CHARS.length)]
  }
  return result
}

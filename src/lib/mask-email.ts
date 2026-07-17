/** Masks the local part for shoulder-surfing / screenshots; keeps domain visible. */
export function maskEmail(email: string): string {
  const trimmed = email.trim()
  if (!trimmed) return ""
  const at = trimmed.indexOf("@")
  if (at < 1) return "***"
  const local = trimmed.slice(0, at)
  const domain = trimmed.slice(at + 1)
  if (!domain) return "***"
  const maskedLocal =
    local.length <= 1 ? "*" : local.length === 2 ? `${local[0]}*` : `${local[0]}***`
  return `${maskedLocal}@${domain}`
}

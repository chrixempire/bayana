export function getEmailInboxUrl(email: string): string {
  const domain = email.split("@")[1]?.toLowerCase() ?? ""

  if (domain === "gmail.com" || domain === "googlemail.com") {
    return "https://mail.google.com/mail/u/0/#inbox"
  }

  if (
    domain.includes("outlook.") ||
    domain.includes("hotmail.") ||
    domain.includes("live.") ||
    domain === "msn.com"
  ) {
    return "https://outlook.live.com/mail/0/inbox"
  }

  if (domain.includes("yahoo.")) {
    return "https://mail.yahoo.com/"
  }

  if (domain === "icloud.com" || domain === "me.com" || domain === "mac.com") {
    return "https://www.icloud.com/mail"
  }

  if (domain.includes("proton.")) {
    return "https://mail.proton.me/"
  }

  return `mailto:${email}`
}

export function openEmailInbox(email: string) {
  const url = getEmailInboxUrl(email)
  window.open(url, "_blank", "noopener,noreferrer")
}

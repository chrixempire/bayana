import { toast } from "../../hooks/use-toast"

export const EMAIL_VERIFIED_TOAST_DURATION_MS = 5000
export const EMAIL_VERIFIED_REDIRECT_DELAY_MS = 2800

export function showEmailVerifiedToast(message: string) {
  toast({
    variant: "success",
    title: "Email verified",
    description: message,
    duration: EMAIL_VERIFIED_TOAST_DURATION_MS,
  })
}

export function waitBeforeEmailVerifyRedirect() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, EMAIL_VERIFIED_REDIRECT_DELAY_MS)
  })
}

export async function finishEmailVerificationSuccess(message: string) {
  showEmailVerifiedToast(message)
  await waitBeforeEmailVerifyRedirect()
}

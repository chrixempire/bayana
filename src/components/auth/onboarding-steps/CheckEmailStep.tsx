import { useEffect, useState } from "react"
import { SpinnerIcon } from "../icons/SpinnerIcon"
import { BayanaLogo } from "../../brand/BayanaLogo"
import { Button } from "../../ui/button"
import { maskEmail } from "../../../lib/mask-email"
import { openEmailInbox } from "../../../lib/open-email-inbox"
import {
  authBodyTextClassName,
  authNeutralButtonClassName,
  authPrimaryButtonClassName,
} from "../../../lib/auth-form-styles"

const DEMO_EMAIL_FALLBACK = "john.doe@bayana.com"
const RESEND_COOLDOWN_SECONDS = 60

function formatCooldown(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${minutes}:${remainder.toString().padStart(2, "0")}`
}

export function CheckEmailStep({
  email,
  onContinue,
  onBackToSignup,
  onResend,
  isResending = false,
  isCheckingVerification = false,
}: {
  email: string
  onContinue: () => void
  onBackToSignup: () => void
  onResend: () => Promise<boolean>
  isResending?: boolean
  isCheckingVerification?: boolean
}) {
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const maskedDisplay = maskEmail(email) || maskEmail(DEMO_EMAIL_FALLBACK)
  const resendDisabled = cooldownSeconds > 0 || isResending

  useEffect(() => {
    if (cooldownSeconds <= 0) return

    const timeoutId = window.setTimeout(() => {
      setCooldownSeconds((prev) => Math.max(prev - 1, 0))
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [cooldownSeconds])

  const handleResend = async () => {
    if (resendDisabled) return

    const sent = await onResend()
    if (sent) setCooldownSeconds(RESEND_COOLDOWN_SECONDS)
  }

  return (
    <div className="mx-auto flex w-full max-w-[350px] flex-col items-center gap-8 text-center">
      <BayanaLogo className="h-12 w-auto" />
      <div className="flex flex-col gap-3">
        <h6 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.1px] text-text-default-500">
          Check your email
        </h6>
        <p className={authBodyTextClassName}>
          We have sent a confirmation link to <span className="text-text-default-500">{maskedDisplay}</span>,
          please click the link to confirm your account
        </p>
      </div>
      <div className="flex w-full flex-col gap-4">
        <Button variant="primary" block className={authPrimaryButtonClassName} onClick={() => openEmailInbox(email)}>
          Open email
        </Button>
        <Button
          variant="neutral"
          block
          disabled={isCheckingVerification}
          className={authNeutralButtonClassName}
          onClick={() => void onContinue()}
        >
          {isCheckingVerification ? (
            <span className="inline-flex items-center gap-2">
              <SpinnerIcon className="size-4" />
              Checking verification...
            </span>
          ) : (
            "I've verified my email"
          )}
        </Button>
        <Button
          variant="neutral"
          disabled={resendDisabled}
          block
          className={authNeutralButtonClassName}
          onClick={() => void handleResend()}
        >
          {isResending ? (
            <span className="inline-flex items-center gap-2">
              <SpinnerIcon className="size-4" />
              Resending...
            </span>
          ) : cooldownSeconds > 0 ? (
            `Resend in ${formatCooldown(cooldownSeconds)}`
          ) : (
            "Resend confirmation email"
          )}
        </Button>
        <Button variant="text" block className="type-small-medium" onClick={onBackToSignup}>
          Back to sign up
        </Button>
      </div>
    </div>
  )
}

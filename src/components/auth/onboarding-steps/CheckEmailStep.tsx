import { BayanaLogo } from "../../brand/BayanaLogo"
import { Button } from "../../ui/button"
import { maskEmail } from "../../../lib/mask-email"

const DEMO_EMAIL_FALLBACK = "john.doe@bayana.com"

export function CheckEmailStep({
  email,
  onNext,
  onBackToSignup,
}: {
  email: string
  onNext: () => void
  onBackToSignup: () => void
}) {
  const maskedDisplay = maskEmail(email) || maskEmail(DEMO_EMAIL_FALLBACK)

  return (
    <div className="mx-auto flex w-full max-w-[350px] flex-col items-center gap-8 text-center">
      <BayanaLogo className="h-12 w-auto" />
      <div className="flex flex-col gap-3">
        <h6 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.1px] text-text-default-500">
          Check your email
        </h6>
        <p className="text-sm leading-[22px] text-text-neutral-400">
          We have sent a confirmation link to <span className="text-text-default-500">{maskedDisplay}</span>,
          please click the link to confirm your account
        </p>
      </div>
      <div className="flex w-full flex-col gap-4">
        <Button
          variant="primary"
          block
          onClick={onNext}
        >
          Open email
        </Button>
        <Button variant="neutral" disabled block>
          Resend in 1:00
        </Button>
        <Button variant="text" block onClick={onBackToSignup}>
          Back to sign up
        </Button>
      </div>
    </div>
  )
}

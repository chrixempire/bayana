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
    <div className="mx-auto w-full max-w-[344px] pt-28 text-center">
      <BayanaLogo className="mx-auto mb-8 h-12 w-auto" />
      <h1 className="text-2xl font-semibold leading-8">Check your email</h1>
      <p className="mt-3 text-sm leading-[22px] text-text-neutral-400">
        We have sent a confirmation link to <span className="text-text-default-500">{maskedDisplay}</span>,
        please click the link to confirm your account
      </p>
      <div className="mt-8 space-y-4">
        <Button
          className="h-10 min-h-10 gap-2 rounded-xl px-3.5 shadow-[inset_0_-2px_1px_0_rgb(25,89,140,0.5)]"
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

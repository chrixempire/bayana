import { ChoosePlanStep } from "../auth/onboarding-steps/ChoosePlanStep"

export function CreateEventUpgradeModal({
  open,
  isPremium,
  onClose,
  onUpgraded,
}: {
  open: boolean
  isPremium: boolean
  onClose: () => void
  onUpgraded: () => void
}) {
  if (!open) return null

  return (
    <ChoosePlanStep
      variant="upgrade"
      isPremium={isPremium}
      onClose={onClose}
      onComplete={onUpgraded}
    />
  )
}

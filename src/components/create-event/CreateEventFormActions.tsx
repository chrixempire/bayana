import { Button } from "../ui/button"
import { ContinueArrowIcon } from "../auth/icons/ContinueArrowIcon"

export function CreateEventFormActions({
  canContinue,
  onContinue,
  onSaveDraft,
  continueLabel = "Continue",
}: {
  canContinue: boolean
  onContinue: () => void
  onSaveDraft: () => void
  continueLabel?: string
}) {
  return (
    <div className="flex w-full flex-col gap-3 pt-2">
      <Button
        type="button"
        variant="primary"
        block
        disabled={!canContinue}
        rightIcon={<ContinueArrowIcon />}
        onClick={onContinue}
        className="rounded-xl"
      >
        {continueLabel}
      </Button>
      <Button type="button" variant="neutral" block onClick={onSaveDraft} className="rounded-xl">
        Save as draft
      </Button>
    </div>
  )
}

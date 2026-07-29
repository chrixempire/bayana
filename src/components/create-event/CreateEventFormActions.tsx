import { Button } from "../ui/button"
import { ContinueArrowIcon } from "../auth/icons/ContinueArrowIcon"

export function CreateEventFormActions({
  canContinue,
  onContinue,
  onSaveDraft,
  continueLabel = "Continue",
  showSaveDraft = true,
  isSaving = false,
}: {
  canContinue: boolean
  onContinue: () => void
  onSaveDraft: () => void
  continueLabel?: string
  showSaveDraft?: boolean
  isSaving?: boolean
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
      {showSaveDraft ? (
        <Button
          type="button"
          variant="neutral"
          block
          disabled={isSaving}
          onClick={onSaveDraft}
          className="rounded-xl"
        >
          {isSaving ? "Saving draft..." : "Save as draft"}
        </Button>
      ) : null}
    </div>
  )
}

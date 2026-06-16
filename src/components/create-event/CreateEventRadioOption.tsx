import { RadioGroupItem } from "../ui/radio-group"
import { ProBadge } from "./ProBadge"
import { cn } from "../../lib/utils"

export function CreateEventRadioOption({
  value,
  label,
  pro,
  disabled,
  proLocked,
  onProInteract,
}: {
  value: string
  label: string
  pro?: boolean
  disabled?: boolean
  proLocked?: boolean
  onProInteract?: () => void
}) {
  const locked = Boolean(proLocked && onProInteract)

  if (locked) {
    return (
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-2 text-sm leading-[22px] text-text-events-strong"
        onClick={onProInteract}
      >
        <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-border-input-default-200 bg-bg-canvas" />
        <span>{label}</span>
        {pro ? <ProBadge /> : null}
      </button>
    )
  }

  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-sm leading-[22px] text-text-events-strong",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <RadioGroupItem value={value} disabled={disabled} size="sm" />
      <span>{label}</span>
      {pro ? <ProBadge /> : null}
    </label>
  )
}

import { ChipRemoveIcon } from "../icons/ChipCircleIcons"
import { cn } from "../../lib/utils"

export type SelectedSkillChipProps = {
  label: string
  onRemove: () => void
  className?: string
}

/** Figma selected skill pill — #FF7415, white 14/22 text, removable. */
export function SelectedSkillChip({ label, onRemove, className }: SelectedSkillChipProps) {
  return (
    <span
      className={cn(
        "type-events-tab inline-flex h-7 max-w-full items-center gap-1 rounded-[40px] bg-bg-accent py-1.5 pr-2 pl-2 text-text-on-solid-bg",
        className,
      )}
    >
      <span className="whitespace-nowrap">{label}</span>
      <button
        type="button"
        className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white/60"
        aria-label={`Remove ${label}`}
        onClick={onRemove}
      >
        <ChipRemoveIcon />
      </button>
    </span>
  )
}

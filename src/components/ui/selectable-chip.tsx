import { cn } from "../../lib/utils"
import { ChipCheckIcon, ChipPlusCircleIcon } from "../icons/ChipCircleIcons"

export const SELECTABLE_CHIP_SHADOW =
  "shadow-[0_0_0_1px_rgba(44,50,55,0.12),0_1px_1px_-0.5px_rgba(44,50,55,0.04)]"

export type SelectableChipProps = {
  label: string
  selected: boolean
  onClick: () => void
  className?: string
}

/** Figma pill chip — inactive (#2C3237 + plus circle) / active (#FF7415 + stroke check). */
export function SelectableChip({ label, selected, onClick, className }: SelectableChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "type-events-tab inline-flex h-7 max-w-full cursor-pointer items-center gap-1 rounded-[40px] py-1.5 pr-2 pl-2 transition-colors",
        selected
          ? "bg-bg-accent text-text-on-solid-bg"
          : "border border-border-default-100 bg-bg-canvas text-text-events-strong hover:bg-bg-on-canvas",
        !selected && SELECTABLE_CHIP_SHADOW,
        className,
      )}
    >
      {selected ? (
        <ChipCheckIcon className="text-text-on-solid-bg" />
      ) : (
        <ChipPlusCircleIcon />
      )}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  )
}

import { cn } from "../../lib/utils"
import {
  dashboardNeutralDropdownTriggerClassName,
  dropdownTriggerOpenClassName,
} from "../../lib/dropdown-trigger-styles"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export type FilterDropdownProps = {
  label: string
  options: string[]
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  triggerClassName?: string
  /** Figma events filter chip — add-circle + label + down-fill, 32px tall. */
  appearance?: "default" | "events"
}

export function FilterDropdown({
  label,
  options,
  value,
  onValueChange,
  className,
  triggerClassName,
  appearance = "default",
}: FilterDropdownProps) {
  const displayValue = value && value !== options[0] ? value : label
  const isEvents = appearance === "events"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          isEvents
            ? cn(dashboardNeutralDropdownTriggerClassName, dropdownTriggerOpenClassName)
            : cn(
                "type-events-filter inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border-input-default-200 bg-input-surface px-3 shadow-input-default outline-none hover:bg-bg-on-canvas focus-visible:ring-2 focus-visible:ring-border-input-active focus-visible:ring-offset-2",
                dropdownTriggerOpenClassName,
              ),
          !isEvents && value && value !== options[0] && "border-border-input-active",
          triggerClassName,
        )}
      >
        {isEvents ? (
          <>
            <EventIcon name="add-circle-fill" size={EVENT_ICON_SIZE.buttonLeading} />
            <span className="max-w-[140px] truncate">{displayValue}</span>
          </>
        ) : (
          <>
            <span className="max-w-[140px] truncate">{displayValue}</span>
            <EventIcon
              name="down-fill"
              size={EVENT_ICON_SIZE.buttonTrailing}
              className="shrink-0 text-icon-neutral"
            />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={cn("min-w-[12rem]", className)}>
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            className={cn(
              "cursor-pointer",
              value === option && "bg-bg-accent-soft font-medium text-bg-accent",
            )}
            onSelect={() => onValueChange?.(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

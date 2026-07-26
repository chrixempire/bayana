import { cn } from "../../lib/utils"
import {
  dashboardNeutralDropdownTriggerClassName,
  dropdownTriggerOpenClassName,
} from "../../lib/dropdown-trigger-styles"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { Checkbox } from "../ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export type MultiSelectFilterProps = {
  label: string
  options: string[]
  values: string[]
  onValuesChange: (values: string[]) => void
  className?: string
  triggerClassName?: string
  /** Figma events filter chip — optional add-circle + label + down-fill, 32px tall. */
  appearance?: "default" | "events"
  /** When `appearance` is `events`, hide the leading add-circle icon. */
  showLeadingIcon?: boolean
}

export function MultiSelectFilter({
  label,
  options,
  values,
  onValuesChange,
  className,
  triggerClassName,
  appearance = "default",
  showLeadingIcon = true,
}: MultiSelectFilterProps) {
  const displayValue =
    values.length === 0
      ? label
      : `${values[0]}${values.length > 1 ? ` +${values.length - 1}` : ""}`
  const isEvents = appearance === "events"
  const isActive = values.length > 0
  const showEventsLeadingIcon = isEvents && showLeadingIcon

  const toggle = (option: string) => {
    onValuesChange(
      values.includes(option) ? values.filter((v) => v !== option) : [...values, option],
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          isEvents
            ? cn(
                dashboardNeutralDropdownTriggerClassName,
                dropdownTriggerOpenClassName,
                isActive && "border-border-input-active",
              )
            : cn(
                "type-events-filter inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border bg-input-surface px-3 shadow-input-default outline-none hover:bg-bg-on-canvas focus-visible:ring-2 focus-visible:ring-border-input-active focus-visible:ring-offset-2",
                dropdownTriggerOpenClassName,
              ),
          !isEvents &&
            (isActive
              ? "border-border-input-active text-text-events-strong"
              : "border-border-input-default-200"),
          triggerClassName,
        )}
      >
        {isEvents ? (
          <>
            {showEventsLeadingIcon ? (
              <EventIcon name="add-circle-fill" size={EVENT_ICON_SIZE.buttonLeading} />
            ) : null}
            <span className="max-w-[140px] truncate">{displayValue}</span>
            {!showEventsLeadingIcon ? (
              <EventIcon
                name="down-fill"
                size={EVENT_ICON_SIZE.buttonTrailing}
                className="shrink-0 text-icon-neutral"
              />
            ) : null}
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
            className="cursor-pointer gap-2.5"
            onSelect={(event) => {
              event.preventDefault()
              toggle(option)
            }}
          >
            <Checkbox
              size="sm"
              checked={values.includes(option)}
              className="pointer-events-none"
              aria-hidden
            />
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"
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
}

export function MultiSelectFilter({
  label,
  options,
  values,
  onValuesChange,
  className,
  triggerClassName,
}: MultiSelectFilterProps) {
  const displayValue =
    values.length === 0
      ? label
      : `${values[0]}${values.length > 1 ? ` +${values.length - 1}` : ""}`

  const toggle = (option: string) => {
    onValuesChange(
      values.includes(option) ? values.filter((v) => v !== option) : [...values, option],
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "type-events-filter inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border bg-input-surface px-3 shadow-input-default outline-none hover:bg-bg-on-canvas focus-visible:ring-2 focus-visible:ring-border-input-active focus-visible:ring-offset-2 data-[state=open]:border-border-input-active",
          values.length > 0
            ? "border-border-input-active text-text-events-strong"
            : "border-border-input-default-200",
          triggerClassName,
        )}
      >
        <span className="max-w-[140px] truncate">{displayValue}</span>
        <ChevronDown className="size-4 shrink-0 text-icon-neutral" />
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

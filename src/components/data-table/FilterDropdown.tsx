import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"
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
}

export function FilterDropdown({
  label,
  options,
  value,
  onValueChange,
  className,
  triggerClassName,
}: FilterDropdownProps) {
  const displayValue = value && value !== options[0] ? value : label

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "type-events-filter inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border-input-default-200 bg-input-surface px-3 shadow-input-default outline-none hover:bg-bg-on-canvas focus-visible:ring-2 focus-visible:ring-border-input-active focus-visible:ring-offset-2 data-[state=open]:border-border-input-active",
          value && value !== options[0] && "border-border-input-active",
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

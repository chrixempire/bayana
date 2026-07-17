import type { ReactNode } from "react"
import { Check } from "lucide-react"
import { cn } from "../../lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { ChevronDownIcon } from "../auth/icons/ChevronDownIcon"

const dropdownTextClass = "text-sm leading-[22px] tracking-[-0.1px] text-text-default-500"

export type FormDropdownOption<T extends string = string> = {
  value: T
  label: string
  leading?: ReactNode
}

type FormDropdownProps<T extends string> = {
  value: T
  onValueChange: (value: T) => void
  options: readonly FormDropdownOption<T>[]
  ariaLabel: string
  invalid?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
  showChevron?: boolean
  renderValue?: (selected: FormDropdownOption<T> | undefined) => ReactNode
}

export function FormDropdown<T extends string>({
  value,
  onValueChange,
  options,
  ariaLabel,
  invalid = false,
  className,
  triggerClassName,
  contentClassName,
  showChevron = true,
  renderValue,
}: FormDropdownProps<T>) {
  const selected = options.find((option) => option.value === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        aria-label={ariaLabel}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border bg-white px-4 py-2 text-left shadow-input-default outline-none transition-colors focus-visible:border-border-input-active focus-visible:ring-2 focus-visible:ring-[rgb(255,122,26,0.12)] data-[state=open]:border-border-input-active data-[state=open]:ring-2 data-[state=open]:ring-[rgb(255,122,26,0.12)]",
          dropdownTextClass,
          invalid ? "border-border-input-negative bg-bg-negative-soft" : "border-border-input-default-200",
          className,
          triggerClassName,
        )}
      >
        <span className="min-w-0 truncate">
          {renderValue ? renderValue(selected) : (selected?.label ?? "Select")}
        </span>
        {showChevron ? <ChevronDownIcon className="size-4 shrink-0 text-text-neutral-400" /> : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn("min-w-[var(--radix-dropdown-menu-trigger-width)] p-1.5", contentClassName)}
      >
        {options.map((option) => {
          const isSelected = option.value === value

          return (
            <DropdownMenuItem
              key={option.value}
              className={cn(
                "cursor-pointer gap-2 rounded-lg px-2.5 py-2 font-normal",
                dropdownTextClass,
                isSelected && "bg-bg-accent-soft text-bg-accent focus:bg-bg-accent-soft focus:text-bg-accent",
              )}
              onSelect={() => onValueChange(option.value)}
            >
              <span className="flex size-4 shrink-0 items-center justify-center">
                {isSelected ? <Check className="size-4" aria-hidden /> : null}
              </span>
              {option.leading}
              <span className="min-w-0 truncate">{option.label}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

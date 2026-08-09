import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { CreateEventTypeIcon } from "../create-event/icons/CreateEventTypeIcon"
import { createEventPath, type CreateEventType } from "../../lib/create-event-paths"
import { cn } from "../../lib/utils"

const QUICK_ACTIONS: Array<{ type: CreateEventType; label: string }> = [
  { type: "cause", label: "Create Cause" },
  { type: "needs", label: "Create Needs" },
]

/** Keep fill + hover/open border on the same 10px radius as the button shell. */
const quickActionTriggerClassName =
  "inline-flex h-8 cursor-pointer items-center gap-1.5 overflow-hidden rounded-[10px] border border-transparent px-3 type-button-large outline-none transition-opacity disabled:cursor-not-allowed hover:border-border-input-active focus-visible:border-border-input-active data-[state=open]:border-border-input-active"

type QuickActionMenuProps = {
  disabled?: boolean
  triggerClassName?: string
  align?: "start" | "center" | "end"
}

export function QuickActionMenu({
  disabled = false,
  triggerClassName,
  align = "end",
}: QuickActionMenuProps) {
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            quickActionTriggerClassName,
            disabled
              ? "bg-button-disabled text-text-disabled-300 hover:border-transparent"
              : "bg-button-primary text-text-on-solid-bg shadow-button-primary hover:opacity-90",
            triggerClassName,
          )}
        >
          Quick action
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={8}
        className="flex w-[217px] flex-col gap-1 overflow-hidden rounded-[10px] border-border-default-100 p-0.5 shadow-[0_16px_16px_-8px_rgba(44,50,55,0.04),0_8px_8px_-4px_rgba(44,50,55,0.04),0_4px_4px_-2px_rgba(44,50,55,0.04),0_2px_2px_-1px_rgba(44,50,55,0.04),0_1px_1px_-0.5px_rgba(44,50,55,0.04),0_0_0_1px_rgba(44,50,55,0.08)]"
      >
        {QUICK_ACTIONS.map((action) => (
          <DropdownMenuItem
            key={action.type}
            className="h-8 cursor-pointer gap-[7px] rounded-[10px] px-2 py-[5px] type-small-medium text-text-events-strong focus:bg-bg-default-100"
            onSelect={() => navigate(createEventPath(action.type))}
          >
            <CreateEventTypeIcon type={action.type} className="size-4 shrink-0 rounded-full" />
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

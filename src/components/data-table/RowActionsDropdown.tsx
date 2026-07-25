import type { ReactNode } from "react"
import { cn } from "../../lib/utils"
import { EventIcon, type EventIconName } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export type RowActionConfig = {
  id: string
  label: string
  icon?: string
  iconName?: EventIconName
  destructive?: boolean
}

const ICON_MAP: Record<string, EventIconName> = {
  eye: "eye-fill",
  pencil: "pen-fill",
  user: "user-3-fill",
  megaphone: "horn-fill",
  share: "share-2-fill",
  trash: "delete-fill",
}

export type RowActionsDropdownProps = {
  actions: RowActionConfig[]
  onAction?: (actionId: string) => void
  align?: "start" | "center" | "end"
  className?: string
  triggerIcon?: ReactNode
}

export function RowActionsDropdown({
  actions,
  onAction,
  align = "end",
  className,
  triggerIcon,
}: RowActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-transparent bg-bg-canvas text-text-table-header outline-none transition-colors",
          "hover:bg-bg-default-100",
          "data-[state=open]:border-text-nav-tab-active",
          "focus-visible:ring-2 focus-visible:ring-border-input-active focus-visible:ring-offset-2",
          className,
        )}
        aria-label="Open row actions"
      >
        {triggerIcon ?? <EventIcon name="more-1-fill" size={EVENT_ICON_SIZE.tableMore} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-52">
        {actions.map((action) => {
          const mappedIcon = action.icon ? ICON_MAP[action.icon] : undefined
          const iconName = action.iconName ?? mappedIcon

          return (
            <DropdownMenuItem
              key={action.id}
              className={cn(
                "cursor-pointer gap-2.5",
                action.destructive && "text-text-negative focus:text-text-negative",
              )}
              onSelect={() => onAction?.(action.id)}
            >
              {iconName ? (
                <EventIcon
                  name={iconName}
                  size={EVENT_ICON_SIZE.dropdownItem}
                  className={action.destructive ? "text-icon-negative" : "text-icon-neutral"}
                />
              ) : null}
              <span>{action.label}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

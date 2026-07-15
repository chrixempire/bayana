import type { LucideIcon } from "lucide-react"
import {
  Eye,
  Megaphone,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
  User,
} from "lucide-react"
import { cn } from "../../lib/utils"
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
  destructive?: boolean
}

const ICON_MAP: Record<string, LucideIcon> = {
  eye: Eye,
  pencil: Pencil,
  user: User,
  megaphone: Megaphone,
  share: Share2,
  trash: Trash2,
}

export type RowActionsDropdownProps = {
  actions: RowActionConfig[]
  onAction?: (actionId: string) => void
  align?: "start" | "center" | "end"
  className?: string
}

export function RowActionsDropdown({
  actions,
  onAction,
  align = "end",
  className,
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
        <MoreHorizontal className="size-4" strokeWidth={2.25} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-52">
        {actions.map((action) => {
          const Icon = action.icon ? ICON_MAP[action.icon] : undefined

          return (
            <DropdownMenuItem
              key={action.id}
              className={cn(
                "cursor-pointer gap-2.5",
                action.destructive && "text-text-negative focus:text-text-negative",
              )}
              onSelect={() => onAction?.(action.id)}
            >
              {Icon ? <Icon className="size-4 shrink-0 text-icon-neutral" /> : null}
              <span>{action.label}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

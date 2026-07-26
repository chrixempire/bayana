import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { EventIcon, type EventIconName } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { DASHBOARD_TAB_PATHS } from "../../lib/dashboard-paths"
import { toast } from "../../hooks/use-toast"
import { cn } from "../../lib/utils"
import { dropdownTriggerOpenClassName } from "../../lib/dropdown-trigger-styles"

type QuickAction = {
  icon: EventIconName
  label: string
  shortcut?: string
  run: () => void
}

function ShortcutChip({ children }: { children: string }) {
  return (
    <span className="inline-flex h-4 items-center justify-center rounded bg-bg-default-100 px-1.5 text-[10px] font-semibold leading-[18px] tracking-[0.1px] text-text-events-strong">
      {children}
    </span>
  )
}

type QuickActionMenuProps = {
  disabled?: boolean
  triggerClassName?: string
  align?: "start" | "center" | "end"
}

export function QuickActionMenu({ disabled = false, triggerClassName, align = "end" }: QuickActionMenuProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const quickActions = useMemo<QuickAction[]>(
    () => [
      { icon: "add-circle-fill", label: "Create a cause", shortcut: "C", run: () => navigate("/events/create") },
      { icon: "add-circle-fill", label: "Create a need", shortcut: "N", run: () => navigate("/events/create") },
      {
        icon: "add-circle-fill",
        label: "Create a new message",
        shortcut: "M",
        run: () => navigate(DASHBOARD_TAB_PATHS.messages),
      },
      {
        icon: "user-add-fill",
        label: "Invite a team member",
        run: () =>
          toast({ title: "Coming soon", description: "Team invites will be available after API integration." }),
      },
      {
        icon: "settings-3-fill",
        label: "Settings",
        shortcut: "S",
        run: () => navigate(DASHBOARD_TAB_PATHS.settings),
      },
    ],
    [navigate],
  )

  const filteredActions = quickActions.filter((action) =>
    action.label.toLowerCase().includes(query.trim().toLowerCase()),
  )

  const runAction = (fn: () => void) => {
    setOpen(false)
    setQuery("")
    fn()
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (disabled) return
        setOpen(next)
        if (!next) setQuery("")
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[10px] px-3 type-button-large transition-opacity disabled:cursor-not-allowed",
            dropdownTriggerOpenClassName,
            disabled
              ? "bg-button-disabled text-text-disabled-300"
              : "bg-button-primary text-text-on-solid-bg shadow-button-primary hover:opacity-90",
            triggerClassName,
          )}
        >
          Quick action
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={8}
        className="w-[480px] rounded-2xl border border-border-default-100 bg-bg-dropdown-modal p-2 text-text-default-500 shadow-[0_16px_48px_rgba(44,50,55,0.16)]"
      >
        <div className="relative mb-1">
          <EventIcon
            name="search-line"
            size={EVENT_ICON_SIZE.search}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-icon-neutral"
          />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type a command or search..."
            className={cn(
              "h-11 w-full rounded-xl border bg-bg-canvas pl-9 pr-9 text-sm text-text-events-strong outline-none placeholder:text-input-placeholder",
              query ? "border-border-input-active" : "border-border-default-100",
            )}
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-icon-neutral hover:text-text-events-strong"
            >
              <EventIcon name="close-fill" size={EVENT_ICON_SIZE.meta} />
            </button>
          ) : null}
        </div>
        <p className="px-2 py-1.5 text-xs font-medium text-text-table-header">Quick actions</p>
        {filteredActions.length ? (
          filteredActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => runAction(action.run)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm text-text-events-strong transition-colors hover:bg-bg-default-100"
            >
              <span className="flex items-center gap-2">
                <EventIcon name={action.icon} size={EVENT_ICON_SIZE.dropdownItem} className="text-icon-neutral" />
                {action.label}
              </span>
              {action.shortcut ? <ShortcutChip>{action.shortcut}</ShortcutChip> : null}
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center gap-1 px-4 py-8 text-center">
            <p className="text-sm font-[510] text-text-events-strong">No result found</p>
            <p className="text-xs leading-5 text-text-table-header">We couldn&apos;t find any result based on your search</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

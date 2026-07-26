import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { PersonAvatar } from "../events/detail/PersonAvatar"
import { EventIcon, type EventIconName } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { DASHBOARD_TAB_PATHS } from "../../lib/dashboard-paths"
import { toast } from "../../hooks/use-toast"
import { cn } from "../../lib/utils"
import { SEARCH_ENTITIES } from "./header-data"

const quickActions: {
  icon: EventIconName
  label: string
  shortcut?: string
  run: () => void
}[] = [
  { icon: "add-circle-fill", label: "Create a cause", shortcut: "C", run: () => {} },
  { icon: "add-circle-fill", label: "Create a need", shortcut: "N", run: () => {} },
  { icon: "add-circle-fill", label: "Create a new message", shortcut: "M", run: () => {} },
  { icon: "user-add-fill", label: "Invite a team member", run: () => {} },
  { icon: "settings-3-fill", label: "Settings", shortcut: "S", run: () => {} },
]

export function HeaderSearch() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [recent, setRecent] = useState<string[]>(["David", "Weekend"])

  const actions = useMemo(
    () =>
      quickActions.map((action) => ({
        ...action,
        run:
          action.label === "Create a cause" || action.label === "Create a need"
            ? () => navigate("/events/create")
            : action.label === "Create a new message"
              ? () => navigate(DASHBOARD_TAB_PATHS.messages)
              : action.label === "Invite a team member"
                ? () =>
                    toast({
                      title: "Coming soon",
                      description: "Team invites will be available after API integration.",
                    })
                : action.label === "Settings"
                  ? () => navigate(DASHBOARD_TAB_PATHS.settings)
                  : action.run,
      })),
    [navigate],
  )

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const q = query.trim().toLowerCase()
  const results = useMemo(() => {
    if (!q) return { Volunteer: [], "Team members": [] }
    const matched = SEARCH_ENTITIES.filter((e) => e.name.toLowerCase().includes(q))
    return {
      Volunteer: matched.filter((e) => e.group === "Volunteer"),
      "Team members": matched.filter((e) => e.group === "Team members"),
    }
  }, [q])
  const hasResults = results.Volunteer.length > 0 || results["Team members"].length > 0

  const runAction = (fn: () => void) => {
    setOpen(false)
    setQuery("")
    fn()
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery("")
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative flex h-9 w-full max-w-[480px] items-center rounded-lg border-0 bg-bg-on-nav pl-9 pr-14 text-left type-small-regular text-text-on-nav-search outline-none transition-colors hover:bg-bg-on-on-nav focus-visible:ring-2 focus-visible:ring-white/25"
        >
          <EventIcon
            name="search-line"
            size={EVENT_ICON_SIZE.search}
            className="pointer-events-none absolute left-3 text-text-on-nav-search"
          />
          Search..
          <kbd className="pointer-events-none absolute right-3 hidden rounded-md bg-bg-on-on-nav/60 px-1.5 py-0.5 text-[10px] font-medium text-text-on-nav-search/80 sm:inline">
            ⌘+K
          </kbd>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-[420px] rounded-2xl border border-border-default-100 bg-bg-dropdown-modal p-2 text-text-default-500 shadow-[0_16px_48px_rgba(44,50,55,0.16)]"
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

        {query ? (
          hasResults ? (
            <div className="flex flex-col gap-1 py-1">
              {(["Volunteer", "Team members"] as const).map((group) =>
                results[group].length ? (
                  <div key={group} className="flex flex-col">
                    <p className="px-2 py-1.5 text-xs font-medium text-text-table-header">{group}</p>
                    {results[group].map((entity) => (
                      <button
                        key={entity.id}
                        type="button"
                        onClick={() => runAction(() => navigate(DASHBOARD_TAB_PATHS.volunteers))}
                        className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-text-events-strong transition-colors hover:bg-bg-default-100"
                      >
                        <PersonAvatar name={entity.name} tone="orange" size={24} />
                        {entity.name}
                      </button>
                    ))}
                  </div>
                ) : null,
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 px-4 py-12 text-center">
              <p className="text-sm font-medium text-text-events-strong">No result found</p>
              <p className="text-xs leading-5 text-text-table-header">
                We couldn&apos;t find any result based on your search
              </p>
            </div>
          )
        ) : (
          <>
            {recent.length ? (
              <div className="flex flex-col">
                <p className="px-2 py-1.5 text-xs font-medium text-text-table-header">Recent searches</p>
                {recent.map((term) => (
                  <div
                    key={term}
                    className="group flex items-center justify-between rounded-lg px-2 py-2 text-sm text-text-events-strong transition-colors hover:bg-bg-default-100"
                  >
                    <button type="button" className="flex-1 text-left" onClick={() => setQuery(term)}>
                      {term}
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${term}`}
                      onClick={() => setRecent((prev) => prev.filter((t) => t !== term))}
                      className="text-icon-neutral hover:text-text-events-strong"
                    >
                      <EventIcon name="close-fill" size={EVENT_ICON_SIZE.meta} />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="flex flex-col">
              <p className="px-2 py-1.5 text-xs font-medium text-text-table-header">Quick actions</p>
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => runAction(action.run)}
                  className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm text-text-events-strong transition-colors hover:bg-bg-default-100"
                >
                  <span className="flex items-center gap-2">
                    <EventIcon name={action.icon} size={EVENT_ICON_SIZE.dropdownItem} className="text-icon-neutral" />
                    {action.label}
                  </span>
                  {action.shortcut ? (
                    <span className="rounded-md border border-border-default-100 px-1.5 text-xs text-text-table-header">
                      {action.shortcut}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}

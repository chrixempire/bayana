import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { DASHBOARD_PAGE_GUTTER_PX } from "../../lib/dashboard-layout"
import { DASHBOARD_TAB_PATHS } from "../../lib/dashboard-paths"
import type { CreateEventType } from "../../lib/create-event-paths"
import { createEventPath } from "../../lib/create-event-paths"
import { CREATE_EVENT_TYPE_OPTIONS } from "./create-event-type-options"
import { CreateEventTypeIcon } from "./icons/CreateEventTypeIcon"
import { cn } from "../../lib/utils"

export function CreateEventHeader({
  eventType,
  onTypeChange,
}: {
  eventType: CreateEventType
  onTypeChange: (type: CreateEventType) => void
}) {
  const navigate = useNavigate()
  const active =
    CREATE_EVENT_TYPE_OPTIONS.find((option) => option.id === eventType) ??
    CREATE_EVENT_TYPE_OPTIONS[0]

  return (
    <div
      className="flex flex-wrap items-center gap-3 border-b border-border-default-100 bg-bg-canvas py-2.5"
      style={{ paddingLeft: DASHBOARD_PAGE_GUTTER_PX, paddingRight: DASHBOARD_PAGE_GUTTER_PX }}
    >
      <button
        type="button"
        onClick={() => navigate(DASHBOARD_TAB_PATHS.events)}
        className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border-default-100 bg-bg-canvas px-3 text-sm font-medium leading-[22px] text-text-events-strong shadow-[0_1px_2px_rgba(44,50,55,0.04)] transition-colors hover:bg-bg-on-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-input-active"
      >
        <EventIcon name="arrow-right-fill" size={EVENT_ICON_SIZE.nav} className="rotate-180" />
        Back
      </button>

      <nav className="flex min-w-0 flex-wrap items-center gap-2" aria-label="Create event breadcrumb">
        <span className="text-sm font-semibold leading-[22px] text-text-events-strong">Create event</span>
        <EventIcon name="arrow-right-fill" size={EVENT_ICON_SIZE.nav} className="shrink-0" aria-hidden />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border-default-100 bg-bg-canvas px-3 text-sm font-medium leading-[22px] text-text-events-strong shadow-input-default outline-none hover:bg-bg-on-canvas focus-visible:ring-2 focus-visible:ring-border-input-active data-[state=open]:border-bg-accent"
            >
              <CreateEventTypeIcon type={active.id} />
              {active.label}
              <EventIcon name="down-fill" size={EVENT_ICON_SIZE.nav} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[172px] rounded-xl p-2">
            {CREATE_EVENT_TYPE_OPTIONS.map((option) => {
              const isActive = option.id === eventType

              return (
                <DropdownMenuItem
                  key={option.id}
                  className={cn(
                    "type-create-event-dropdown inline-flex h-8 w-[156px] cursor-pointer items-center gap-[7px] rounded-[10px] py-[5px] pr-2 pl-2",
                    isActive
                      ? "bg-bg-nav-tab-active text-text-nav-tab-active focus:bg-bg-nav-tab-active focus:text-text-nav-tab-active"
                      : "text-text-events-strong focus:bg-bg-default-100 focus:text-text-events-strong",
                  )}
                  onClick={() => {
                    if (option.id !== eventType) {
                      onTypeChange(option.id)
                      navigate(createEventPath(option.id), { replace: true })
                    }
                  }}
                >
                  <CreateEventTypeIcon type={option.id} />
                  {option.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  )
}

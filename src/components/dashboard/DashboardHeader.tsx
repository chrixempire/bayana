import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SpinnerIcon } from "../auth/icons/SpinnerIcon"
import { BayanaLogo } from "../brand/BayanaLogo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { performLogout } from "../../lib/auth/logout"
import { DASHBOARD_PAGE_GUTTER_PX } from "../../lib/dashboard-layout"
import { toast } from "../../hooks/use-toast"
import { HeaderSearch } from "./HeaderSearch"
import { HeaderNotifications } from "./HeaderNotifications"

type DashboardHeaderProps = {
  organizationName?: string
  organizationInitial?: string
  planLabel?: string
  userInitial?: string
}

const ORGANIZATION_OPTIONS = [
  { name: "Acme Incorporation", initial: "A", plan: "Free" },
  { name: "Bayana Foundation", initial: "B", plan: "Pro" },
] as const

export function DashboardHeader({
  organizationName = "Acme Incorporation",
  organizationInitial = "A",
  planLabel = "Free",
  userInitial = "D",
}: DashboardHeaderProps) {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [activeOrg, setActiveOrg] = useState({
    name: organizationName,
    initial: organizationInitial,
    plan: planLabel,
  })

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await performLogout(navigate)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const navProfileAvatar = isLoggingOut ? (
    <SpinnerIcon className="size-4 text-text-nav-tab-active" aria-hidden />
  ) : (
    userInitial
  )

  const menuProfileAvatar = isLoggingOut ? (
    <SpinnerIcon className="size-4 text-text-nav-tab-active" aria-hidden />
  ) : (
    userInitial
  )

  return (
    <header
      className="grid w-full grid-cols-1 items-center gap-4 py-4 text-text-on-solid-bg lg:grid-cols-[minmax(0,1fr)_minmax(240px,480px)_minmax(0,1fr)] lg:gap-6"
      style={{ paddingLeft: DASHBOARD_PAGE_GUTTER_PX, paddingRight: DASHBOARD_PAGE_GUTTER_PX }}
    >
      <div className="flex min-w-0 items-center gap-2 justify-self-start">
        <BayanaLogo className="h-9 w-[35px] shrink-0" />

        <span className="mx-0.5 hidden h-3 w-px shrink-0 bg-bg-on-nav sm:block" aria-hidden />

        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className="inline-flex h-9 min-w-0 max-w-[220px] cursor-pointer items-center gap-2 rounded-lg bg-bg-on-nav pl-1 pr-1.5 text-left transition-colors hover:bg-bg-on-on-nav focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:max-w-none"
            aria-label="Switch organization"
          >
            <span
              aria-hidden
              className="flex size-6 shrink-0 items-center justify-center rounded bg-bg-accent text-[11px] font-bold leading-[18px] text-text-on-solid-bg"
            >
              {activeOrg.initial}
            </span>
            <span className="truncate type-small-medium text-text-on-solid-bg">{activeOrg.name}</span>
            <EventIcon
              name="selector-vertical-line"
              size={EVENT_ICON_SIZE.meta}
              navSearch
              className="shrink-0 opacity-90"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[14rem] p-1.5">
            {ORGANIZATION_OPTIONS.map((org) => (
              <DropdownMenuItem
                key={org.name}
                className="cursor-pointer rounded-lg px-2.5 py-2 text-sm"
                onSelect={() => setActiveOrg(org)}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded bg-bg-accent text-[11px] font-bold text-text-on-solid-bg">
                  {org.initial}
                </span>
                <span className="truncate">{org.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="inline-flex h-[18px] shrink-0 items-center rounded bg-bg-accent px-1 py-0.5 text-[10px] font-medium leading-[18px] tracking-[0.1px] text-text-on-solid-bg">
          {activeOrg.plan}
        </span>
      </div>

      <div className="flex w-full justify-center lg:col-start-2">
        <HeaderSearch />
      </div>

      <div className="flex shrink-0 items-center gap-2 justify-self-end lg:col-start-3">
        <button
          type="button"
          className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-lg bg-bg-accent px-2.5 type-button-large text-text-on-solid-bg shadow-[inset_0px_-2px_1px_0px_rgba(140,64,12,0.5)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          onClick={() =>
            toast({
              title: "Coming soon",
              description: "Upgrade options will be available soon.",
            })
          }
        >
          <EventIcon name="award-fill-white" size={EVENT_ICON_SIZE.buttonLeading} />
          Upgrade
        </button>

        <HeaderNotifications />

        <span className="hidden h-3 w-px shrink-0 bg-bg-on-nav sm:block" aria-hidden />

        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-bg-nav-avatar text-sm font-semibold leading-5 text-text-on-solid-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Account menu"
            disabled={isLoggingOut}
          >
            {navProfileAvatar}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[15rem] p-1.5">
            <div className="flex items-center gap-2.5 px-2.5 py-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-bg-nav-avatar text-sm font-semibold text-text-on-solid-bg">
                {menuProfileAvatar}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-text-events-strong">Daniel Osonuga</span>
                <span className="text-xs text-text-table-header">Administrator</span>
              </div>
            </div>
            <div className="my-1 border-t border-border-default-100" />
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2.5 py-2 text-sm"
              onSelect={() => navigate("/settings")}
            >
              <EventIcon name="user-3-fill" size={EVENT_ICON_SIZE.dropdownItem} className="text-icon-neutral" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2.5 py-2 text-sm"
              onSelect={() => toast({ title: "Coming soon", description: "Help & support will be available soon." })}
            >
              <EventIcon name="information-fill" size={EVENT_ICON_SIZE.dropdownItem} className="text-icon-neutral" />
              Help &amp; support
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2.5 py-2 text-sm text-text-negative focus:bg-bg-negative-soft"
              disabled={isLoggingOut}
              onSelect={() => void handleLogout()}
            >
              {isLoggingOut ? (
                <SpinnerIcon className="size-4 text-text-negative" />
              ) : (
                <EventIcon name="arrow-right-fill" size={EVENT_ICON_SIZE.dropdownItem} negative />
              )}
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

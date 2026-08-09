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
import { EventIcon, type EventIconName } from "../events/icons/EventIcon"
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
  userName?: string
  userRole?: string
}

/** Figma header menus — 265×172, 16px radius, Card/shadow-large. */
const headerMenuContentClassName =
  "flex w-[265px] flex-col gap-3 overflow-hidden rounded-2xl border-0 bg-bg-canvas p-1.5 shadow-[var(--shadow-card-large)]"

const headerMenuItemClassName =
  "h-8 cursor-pointer gap-1 rounded-lg p-2 type-small-medium text-text-events-strong focus:bg-bg-default-100 data-[highlighted]:bg-bg-default-100"

function HeaderMenuItem({
  icon,
  label,
  disabled,
  onSelect,
}: {
  icon: EventIconName
  label: string
  disabled?: boolean
  onSelect: () => void
}) {
  return (
    <DropdownMenuItem
      className={headerMenuItemClassName}
      disabled={disabled}
      onSelect={onSelect}
    >
      <EventIcon name={icon} size={EVENT_ICON_SIZE.dropdownItem} className="text-icon-neutral" />
      <span className="px-1">{label}</span>
    </DropdownMenuItem>
  )
}

export function DashboardHeader({
  organizationName = "Acme Incorporation",
  organizationInitial = "A",
  planLabel = "Free",
  userInitial = "D",
  userName = "Daniel Osonuga",
  userRole = "Administrator",
}: DashboardHeaderProps) {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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
            aria-label="Organization menu"
          >
            <span
              aria-hidden
              className="flex size-6 shrink-0 items-center justify-center rounded bg-bg-accent text-[11px] font-bold leading-[18px] text-text-on-solid-bg"
            >
              {organizationInitial}
            </span>
            <span className="truncate type-small-medium text-text-on-solid-bg">{organizationName}</span>
            <EventIcon
              name="selector-vertical-line"
              size={EVENT_ICON_SIZE.meta}
              navSearch
              className="shrink-0 opacity-90"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={8} className={headerMenuContentClassName}>
            <div className="flex w-full items-center gap-2">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-bg-accent text-xl font-bold leading-7 text-text-on-solid-bg"
              >
                {organizationInitial}
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate type-small-medium text-text-events-strong">{organizationName}</span>
                <span className="text-xs leading-5 text-text-table-header">{planLabel}</span>
              </div>
            </div>
            <div className="flex w-full flex-col gap-1">
              <HeaderMenuItem
                icon="building-1-fill"
                label="NGO profile"
                onSelect={() => navigate("/settings?tab=ngo-profile")}
              />
              <HeaderMenuItem
                icon="settings-3-fill"
                label="Settings"
                onSelect={() => navigate("/settings")}
              />
              <HeaderMenuItem
                icon="exit-fill"
                label={isLoggingOut ? "Signing out..." : "Sign out"}
                disabled={isLoggingOut}
                onSelect={() => void handleLogout()}
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="inline-flex h-[18px] shrink-0 items-center rounded bg-bg-accent px-1 py-0.5 text-[10px] font-medium leading-[18px] tracking-[0.1px] text-text-on-solid-bg">
          {planLabel}
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
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-[0.5px] border-border-input-active bg-bg-nav-avatar text-base font-semibold leading-5 text-text-nav-tab-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Account menu"
            disabled={isLoggingOut}
          >
            {navProfileAvatar}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className={headerMenuContentClassName}>
            {/* Figma Avatar instance: 40×40 beside name (node 18331:390551) */}
            <div className="flex w-full items-center gap-2">
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[0.5px] border-border-input-active bg-bg-nav-avatar text-[24px] font-semibold leading-7 text-text-nav-tab-active"
              >
                {isLoggingOut ? (
                  <SpinnerIcon className="size-4 text-text-nav-tab-active" aria-hidden />
                ) : (
                  userInitial
                )}
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate type-small-medium text-text-events-strong">{userName}</span>
                <span className="text-xs leading-5 text-text-table-header">{userRole}</span>
              </div>
            </div>
            <div className="flex w-full flex-col gap-1">
              <HeaderMenuItem
                icon="user-3-fill"
                label="Profile"
                onSelect={() => navigate("/settings?tab=profile")}
              />
              <HeaderMenuItem
                icon="question-fill"
                label="Help & support"
                onSelect={() =>
                  toast({
                    title: "Coming soon",
                    description: "Help & support will be available soon.",
                  })
                }
              />
              <HeaderMenuItem
                icon="exit-fill"
                label={isLoggingOut ? "Signing out..." : "Sign out"}
                disabled={isLoggingOut}
                onSelect={() => void handleLogout()}
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

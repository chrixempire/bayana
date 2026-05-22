import { NavLink } from "react-router-dom"
import { cn } from "../../lib/utils"
import { DASHBOARD_TAB_PATHS, type DashboardTabId } from "../../lib/dashboard-paths"
import { CrownIcon } from "./icons"

type TabConfig = {
  id: DashboardTabId
  label: string
  badge?: number
  pro?: boolean
}

const TABS: TabConfig[] = [
  { id: "getting-started", label: "Getting started", badge: 5 },
  { id: "dashboard", label: "Dashboard" },
  { id: "analytics", label: "Analytics", pro: true },
  { id: "events", label: "Events" },
  { id: "volunteers", label: "Volunteers" },
  { id: "messages", label: "Messages" },
  { id: "verification", label: "Verification" },
  { id: "settings", label: "Settings" },
]

export function DashboardNavTabs({ activeTab }: { activeTab: DashboardTabId }) {
  return (
    <nav
      className="flex gap-2 overflow-x-auto border-b border-border-default-100 bg-bg-canvas px-4 py-2.5 sm:px-6"
      aria-label="Dashboard"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab
        const path = DASHBOARD_TAB_PATHS[tab.id]

        return (
          <NavLink
            key={tab.id}
            to={path}
            end
            className={cn(
              "inline-flex shrink-0 items-center gap-2 text-sm font-medium leading-[22px] transition-colors",
              isActive
                ? "rounded-full bg-bg-accent-soft px-3.5 py-1.5 font-semibold text-bg-accent"
                : "rounded-lg px-3 py-1.5 text-text-default-500 hover:bg-bg-default-100",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
            {tab.badge != null ? (
              <span
                className={cn(
                  "inline-flex size-5 items-center justify-center rounded-[6px] text-[11px] font-semibold leading-none",
                  isActive ? "bg-bg-accent text-text-on-solid-bg" : "bg-bg-accent-soft text-bg-accent",
                )}
              >
                {tab.badge}
              </span>
            ) : null}
            {tab.pro ? (
              <span className="inline-flex items-center gap-0.5 rounded bg-gradient-to-r from-[#325adb] to-[#5b7dff] px-1.5 py-0.5 text-[9px] font-semibold uppercase leading-none tracking-wide text-text-on-solid-bg">
                <CrownIcon />
                Pro
              </span>
            ) : null}
          </NavLink>
        )
      })}
    </nav>
  )
}

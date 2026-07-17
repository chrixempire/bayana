import { NavLink } from "react-router-dom"
import { DASHBOARD_PAGE_GUTTER_PX } from "../../lib/dashboard-layout"
import { DASHBOARD_TAB_PATHS, type DashboardTabId } from "../../lib/dashboard-paths"
import { dashboardTabBadgeClassName, dashboardTabClassName } from "../../lib/dashboard-tab-styles"
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
      className="flex gap-1 overflow-x-auto border-b border-border-default-100 bg-bg-canvas py-2.5"
      style={{ paddingLeft: DASHBOARD_PAGE_GUTTER_PX, paddingRight: DASHBOARD_PAGE_GUTTER_PX }}
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
            className={dashboardTabClassName(isActive)}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
            {tab.badge != null ? (
              <span className={dashboardTabBadgeClassName(isActive)}>{tab.badge}</span>
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

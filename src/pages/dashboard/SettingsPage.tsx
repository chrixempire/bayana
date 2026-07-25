import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { DashboardLayout, DashboardWideContent } from "../../components/dashboard/DashboardLayout"
import {
  AuditLogsSection,
  BillingSection,
  NgoProfileSection,
  NotificationsSection,
  PayoutsSection,
  PrivacySecuritySection,
  ProfileSection,
  TeamMembersSection,
} from "../../components/settings/SettingsSections"
import { EventIcon, type EventIconName } from "../../components/events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../../components/events/icons/event-icon-sizes"
import { cn } from "../../lib/utils"
import type { SettingsSection } from "./settings-data"

const NAV_GROUPS: {
  heading: string
  items: { id: SettingsSection; label: string; icon: EventIconName }[]
}[] = [
  {
    heading: "General",
    items: [
      { id: "profile", label: "Profile", icon: "user-3-fill" },
      { id: "notifications", label: "Notifications", icon: "notification-fill" },
      { id: "privacy", label: "Privacy & security", icon: "key-2-fill" },
    ],
  },
  {
    heading: "Administration",
    items: [
      { id: "ngo-profile", label: "NGO profile", icon: "building-1-fill" },
      { id: "team", label: "Team members", icon: "user-group-fill" },
      { id: "billing", label: "Billing & plans", icon: "bank-card-fill" },
      { id: "payouts", label: "Payouts & settlement", icon: "bank-fill" },
      { id: "audit", label: "Audit logs", icon: "list-check-fill" },
    ],
  },
]

const VALID: SettingsSection[] = ["profile", "notifications", "privacy", "ngo-profile", "team", "billing", "payouts", "audit"]

const NARROW_SECTIONS = new Set<SettingsSection>(["profile", "notifications", "privacy", "ngo-profile"])

export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get("tab") as SettingsSection | null
  const [section, setSection] = useState<SettingsSection>(
    tabParam && VALID.includes(tabParam) ? tabParam : "profile",
  )

  const go = (id: SettingsSection) => {
    setSection(id)
    const next = new URLSearchParams(searchParams)
    next.set("tab", id)
    setSearchParams(next, { replace: true })
  }

  return (
    <DashboardLayout activeTab="settings">
      <DashboardWideContent flushBottom className="pb-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          <aside className="shrink-0 lg:w-[200px]">
            <nav className="flex flex-col gap-4 lg:sticky lg:top-6">
              {NAV_GROUPS.map((group) => (
                <div key={group.heading} className="flex flex-col gap-1">
                  <p className="px-2 py-0 text-xs font-medium leading-5 text-text-table-header">{group.heading}</p>
                  {group.items.map((item) => {
                    const active = item.id === section
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => go(item.id)}
                        className={cn(
                          "flex h-8 items-center gap-1 rounded-lg p-2 transition-colors",
                          active
                            ? "type-small-semibold bg-bg-nav-tab-active text-text-nav-tab-active"
                            : "type-small-medium text-text-events-strong hover:bg-bg-default-100",
                        )}
                      >
                        <EventIcon
                          name={item.icon}
                          size={EVENT_ICON_SIZE.nav}
                          className={active ? "text-text-nav-tab-active" : "text-icon-neutral"}
                        />
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              ))}
            </nav>
          </aside>

          <div className={cn("min-w-0 flex-1", NARROW_SECTIONS.has(section) && "max-w-[592px]")}>
            {section === "profile" ? <ProfileSection /> : null}
            {section === "notifications" ? <NotificationsSection /> : null}
            {section === "privacy" ? <PrivacySecuritySection /> : null}
            {section === "ngo-profile" ? <NgoProfileSection /> : null}
            {section === "team" ? <TeamMembersSection /> : null}
            {section === "billing" ? (
              <BillingSection initialPlan={searchParams.get("plan") === "premium" ? "premium" : "free"} />
            ) : null}
            {section === "payouts" ? <PayoutsSection /> : null}
            {section === "audit" ? <AuditLogsSection /> : null}
          </div>
        </div>
      </DashboardWideContent>
    </DashboardLayout>
  )
}

import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  Bell,
  Building2,
  ClipboardList,
  CreditCard,
  KeyRound,
  Landmark,
  User,
  Users,
} from "lucide-react"
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
import { cn } from "../../lib/utils"
import type { SettingsSection } from "./settings-data"

const NAV_GROUPS: { heading: string; items: { id: SettingsSection; label: string; icon: typeof User }[] }[] = [
  {
    heading: "General",
    items: [
      { id: "profile", label: "Profile", icon: User },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "privacy", label: "Privacy & security", icon: KeyRound },
    ],
  },
  {
    heading: "Administration",
    items: [
      { id: "ngo-profile", label: "NGO profile", icon: Building2 },
      { id: "team", label: "Team members", icon: Users },
      { id: "billing", label: "Billing & plans", icon: CreditCard },
      { id: "payouts", label: "Payouts & settlement", icon: Landmark },
      { id: "audit", label: "Audit logs", icon: ClipboardList },
    ],
  },
]

const VALID: SettingsSection[] = ["profile", "notifications", "privacy", "ngo-profile", "team", "billing", "payouts", "audit"]

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
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Left sub-nav */}
          <aside className="shrink-0 lg:w-[200px]">
            <nav className="flex flex-col gap-4 lg:sticky lg:top-6">
              {NAV_GROUPS.map((group) => (
                <div key={group.heading} className="flex flex-col gap-1">
                  <p className="px-2.5 py-1.5 text-xs font-medium uppercase tracking-[0.4px] text-text-table-header">
                    {group.heading}
                  </p>
                  {group.items.map((item) => {
                    const active = item.id === section
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => go(item.id)}
                        className={cn(
                          "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-[510] transition-colors",
                          active
                            ? "bg-bg-nav-tab-active text-text-nav-tab-active"
                            : "text-text-events-strong hover:bg-bg-default-100",
                        )}
                      >
                        <Icon className={cn("size-4", active ? "text-text-nav-tab-active" : "text-icon-neutral")} />
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="min-w-0 flex-1">
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

import type { ReactNode } from "react"
import { cn } from "../../lib/utils"
import type { DashboardTabId } from "../../lib/dashboard-paths"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardNavTabs } from "./DashboardNavTabs"
import { OnboardingBanner } from "./OnboardingBanner"

export const DASHBOARD_CONTENT_WIDTH_PX = 576

export type DashboardLayoutProps = {
  children: ReactNode
  activeTab: DashboardTabId
  showOnboardingBanner?: boolean
  organizationName?: string
  organizationInitial?: string
  planLabel?: string
  userInitial?: string
}

export function DashboardLayout({
  children,
  activeTab,
  showOnboardingBanner = false,
  organizationName,
  organizationInitial,
  planLabel,
  userInitial,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-bg-canvas text-text-default-500">
      <header
        className={cn(
          "sticky top-0 z-30 w-full shrink-0",
          showOnboardingBanner ? "bg-bg-accent" : "bg-bg-nav",
        )}
      >
        {showOnboardingBanner ? <OnboardingBanner /> : null}

        <div
          className={cn(
            "overflow-hidden bg-bg-nav",
            showOnboardingBanner && "rounded-t-[20px]",
          )}
        >
          <DashboardHeader
            organizationName={organizationName}
            organizationInitial={organizationInitial}
            planLabel={planLabel}
            userInitial={userInitial}
          />
        </div>

        <DashboardNavTabs activeTab={activeTab} />
      </header>

      <main className="min-h-0 w-full flex-1 overflow-y-auto bg-bg-on-canvas">{children}</main>
    </div>
  )
}

export function DashboardContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[576px] px-4 py-8 sm:px-0 sm:py-10", className)}
      style={{ maxWidth: DASHBOARD_CONTENT_WIDTH_PX }}
    >
      {children}
    </div>
  )
}

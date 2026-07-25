import { useLayoutEffect, useRef, type ReactNode } from "react"
import { cn } from "../../lib/utils"
import {
  DASHBOARD_CONTENT_WIDTH_PX,
  DASHBOARD_PAGE_GUTTER_PX,
  DASHBOARD_DETAIL_MAX_WIDTH_PX,
  dashboardDetailContentClassName,
} from "../../lib/dashboard-layout"
import type { DashboardTabId } from "../../lib/dashboard-paths"

export {
  DASHBOARD_CONTENT_WIDTH_PX,
  DASHBOARD_PAGE_GUTTER_PX,
  DASHBOARD_DETAIL_GUTTER_PX,
  DASHBOARD_DETAIL_MAX_WIDTH_PX,
  dashboardDetailContentClassName,
} from "../../lib/dashboard-layout"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardNavTabs } from "./DashboardNavTabs"
import { OnboardingBanner } from "./OnboardingBanner"

export type DashboardLayoutProps = {
  children: ReactNode
  activeTab: DashboardTabId
  /** Hide Getting started / Events / … tabs (e.g. focused create-event flow). */
  showNavTabs?: boolean
  showOnboardingBanner?: boolean
  organizationName?: string
  organizationInitial?: string
  planLabel?: string
  userInitial?: string
  mainClassName?: string
  /** Renders below the org header when nav tabs are hidden (e.g. create-event breadcrumb bar). */
  subHeader?: ReactNode
}

export function DashboardLayout({
  children,
  activeTab,
  showNavTabs = true,
  showOnboardingBanner = false,
  organizationName,
  organizationInitial,
  planLabel,
  userInitial,
  mainClassName,
  subHeader,
}: DashboardLayoutProps) {
  const headerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const header = headerRef.current
    if (!header) return

    const syncStickyOffset = () => {
      document.documentElement.style.setProperty("--dashboard-sticky-top", `${header.offsetHeight}px`)
    }

    syncStickyOffset()
    const observer = new ResizeObserver(syncStickyOffset)
    observer.observe(header)

    return () => observer.disconnect()
  }, [showNavTabs, showOnboardingBanner])

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-bg-canvas text-text-default-500">
      <header
        ref={headerRef}
        className={cn(
          "z-30 w-full shrink-0",
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

        {showNavTabs ? (
          <DashboardNavTabs activeTab={activeTab} />
        ) : subHeader ? (
          subHeader
        ) : null}
      </header>

      <main
        className={cn(
          "min-h-0 w-full flex-1 overflow-y-auto overscroll-y-contain bg-bg-canvas",
          mainClassName,
        )}
      >
        {children}
      </main>
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

type DashboardWideContentProps = {
  children: ReactNode
  className?: string
  /** Drop bottom padding so table pages end flush after pagination (avoids empty scroll gap). */
  flushBottom?: boolean
}

/** Full-width dashboard pages (tables, lists) — 104px gutters left and right. */
export function DashboardWideContent({
  children,
  className,
  flushBottom = false,
}: DashboardWideContentProps) {
  return (
    <div
      className={cn(
        "w-full",
        flushBottom ? "pt-6 sm:pt-8" : "py-6 sm:py-8",
        className,
      )}
      style={{ paddingLeft: DASHBOARD_PAGE_GUTTER_PX, paddingRight: DASHBOARD_PAGE_GUTTER_PX }}
    >
      {children}
    </div>
  )
}

/**
 * Breaks out of {@link DashboardWideContent} horizontal padding so borders/backgrounds
 * span the full viewport width. Re-apply gutter padding on inner content as needed.
 */
export function DashboardFullBleed({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(className)}
      style={{
        marginLeft: -DASHBOARD_PAGE_GUTTER_PX,
        marginRight: -DASHBOARD_PAGE_GUTTER_PX,
        width: `calc(100% + ${DASHBOARD_PAGE_GUTTER_PX * 2}px)`,
      }}
    >
      {children}
    </div>
  )
}

/** Detail pages — fixed 1152px content; 144px side margin at 1440px viewport. */
export function DashboardDetailContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(dashboardDetailContentClassName, "py-6 sm:py-8", className)}
      style={{ maxWidth: DASHBOARD_DETAIL_MAX_WIDTH_PX }}
    >
      {children}
    </div>
  )
}

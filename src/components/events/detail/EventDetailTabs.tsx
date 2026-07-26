import { cn } from "../../../lib/utils"
import type { EventDetailTabId } from "../../../pages/dashboard/event-detail-types"

export type EventDetailTab = {
  id: EventDetailTabId
  label: string
}

export function EventDetailTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: {
  tabs: EventDetailTab[]
  activeTab: EventDetailTabId
  onTabChange: (tab: EventDetailTabId) => void
  className?: string
}) {
  return (
    <div className={cn("flex gap-4", className)} role="tablist" aria-label="Event sections">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex h-12 cursor-pointer items-center justify-center border-b-2 py-2 text-sm font-medium leading-[22px] transition-colors",
              isActive
                ? "border-border-input-active text-text-events-strong"
                : "border-transparent text-text-table-header hover:text-text-events-strong",
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

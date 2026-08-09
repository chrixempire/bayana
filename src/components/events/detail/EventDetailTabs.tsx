import { UnderlineTabs } from "../../ui/UnderlineTabs"
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
    <UnderlineTabs
      className={className}
      ariaLabel="Event sections"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(id) => onTabChange(id as EventDetailTabId)}
      variant="border"
      gapClassName="gap-4"
      tabClassName="h-12 justify-center text-sm font-medium leading-[22px]"
    />
  )
}

import { UnderlineTabs } from "../ui/UnderlineTabs"
import type { EventsTabId } from "../../pages/dashboard/events-types"

export type EventsSubTab = {
  id: EventsTabId
  label: string
  /** Optional count badge rendered next to the label. */
  count?: number
}

type EventsSubTabsProps = {
  tabs: EventsSubTab[]
  activeTab: EventsTabId
  onTabChange: (tabId: EventsTabId) => void
  className?: string
}

export function EventsSubTabs({ tabs, activeTab, onTabChange, className }: EventsSubTabsProps) {
  return (
    <UnderlineTabs
      className={className}
      ariaLabel="Event types"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(id) => onTabChange(id as EventsTabId)}
      variant="accent"
    />
  )
}

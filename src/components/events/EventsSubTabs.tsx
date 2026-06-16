import { useLayoutEffect, useRef, useState } from "react"
import { cn } from "../../lib/utils"
import type { EventsTabId } from "../../pages/dashboard/events-types"

export type EventsSubTab = {
  id: EventsTabId
  label: string
}

type TabIndicator = {
  left: number
  width: number
}

type EventsSubTabsProps = {
  tabs: EventsSubTab[]
  activeTab: EventsTabId
  onTabChange: (tabId: EventsTabId) => void
  className?: string
}

export function EventsSubTabs({ tabs, activeTab, onTabChange, className }: EventsSubTabsProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Partial<Record<EventsTabId, HTMLButtonElement | null>>>({})
  const [indicator, setIndicator] = useState<TabIndicator>({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const list = listRef.current
      const activeButton = tabRefs.current[activeTab]
      if (!list || !activeButton) return

      const listRect = list.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()

      setIndicator({
        left: buttonRect.left - listRect.left,
        width: buttonRect.width,
      })
    }

    updateIndicator()

    const list = listRef.current
    if (!list) return

    const observer = new ResizeObserver(updateIndicator)
    observer.observe(list)
    window.addEventListener("resize", updateIndicator)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updateIndicator)
    }
  }, [activeTab, tabs])

  return (
    <div ref={listRef} className={cn("relative flex gap-6", className)} role="tablist" aria-label="Event types">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab

        return (
          <button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[tab.id] = element
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn(
              "type-events-tab relative z-10 cursor-pointer pb-3 transition-colors",
              !isActive && "hover:text-text-neutral-400",
            )}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        )
      })}

      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 z-20 h-[3px] rounded-full bg-bg-accent transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
        style={{
          left: indicator.left,
          width: indicator.width,
        }}
      />
    </div>
  )
}

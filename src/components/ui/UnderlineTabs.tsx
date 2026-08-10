import type { ReactNode } from "react"
import { cn } from "../../lib/utils"
import { useSlidingIndicator } from "../../hooks/use-sliding-indicator"

export type UnderlineTabItem = {
  id: string
  label: ReactNode
  count?: number
}

type UnderlineTabsProps = {
  tabs: readonly UnderlineTabItem[]
  activeTab: string
  onTabChange: (id: string) => void
  ariaLabel: string
  className?: string
  /** `accent` = 3px orange bar (Events). `border` = 2px input-active bar (Analytics/detail). */
  variant?: "accent" | "border"
  gapClassName?: string
  tabClassName?: string
}

export function UnderlineTabs({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel,
  className,
  variant = "accent",
  gapClassName = "gap-6",
  tabClassName,
}: UnderlineTabsProps) {
  const { listRef, setTabRef, indicator, ready } = useSlidingIndicator(
    activeTab,
    [tabs.map((t) => t.id).join("|"), tabs.map((t) => t.count ?? "").join("|")],
  )

  return (
    <div
      ref={listRef}
      className={cn("relative flex", gapClassName, className)}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            ref={(el) => setTabRef(tab.id, el)}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn(
              "type-events-tab relative z-10 flex cursor-pointer items-center gap-1.5 transition-colors",
              variant === "accent" ? "pb-3" : "h-10 py-2",
              isActive ? "text-text-events-strong" : "text-text-table-header hover:text-text-neutral-400",
              tabClassName,
            )}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {typeof tab.count === "number" ? (
              <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-bg-accent px-1 text-[11px] font-semibold leading-none text-text-on-solid-bg">
                {tab.count}
              </span>
            ) : null}
          </button>
        )
      })}

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-20 rounded-full transition-[left,width,opacity] duration-300 ease-out motion-reduce:transition-none",
          variant === "accent"
            ? "bottom-0 h-[3px] bg-bg-accent"
            : "bottom-0 h-0.5 rounded-none bg-border-input-active",
          ready ? "opacity-100" : "opacity-0",
        )}
        style={{ left: indicator.left, width: indicator.width }}
      />
    </div>
  )
}

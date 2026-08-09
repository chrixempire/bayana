import { cn } from "./utils"

/** Dashboard top nav tab — inactive Small/Medium; active Small/Bold (Figma / feedback doc). */
export function dashboardTabClassName(
  isActive: boolean,
  options?: { sliding?: boolean },
) {
  return cn(
    "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2 py-0 transition-colors",
    isActive
      ? cn(
          "type-small-bold text-text-nav-tab-active",
          options?.sliding ? "bg-transparent" : "bg-bg-nav-tab-active",
        )
      : "type-small-medium text-text-events-strong hover:bg-bg-default-100",
  )
}

/** Numeric badge beside a dashboard nav tab label. */
export function dashboardTabBadgeClassName(tabIsActive: boolean) {
  return cn(
    "inline-flex h-5 min-w-5 items-center justify-center rounded-[6px] px-1 text-[11px] font-semibold leading-none",
    tabIsActive
      ? "bg-text-nav-tab-active text-text-on-solid-bg"
      : "bg-bg-nav-tab-active text-text-nav-tab-active",
  )
}

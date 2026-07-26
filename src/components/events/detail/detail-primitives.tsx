import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "../../../lib/utils"
import { EventIcon } from "../icons/EventIcon"
import { EVENT_ICON_SIZE } from "../icons/event-icon-sizes"

/**
 * Figma elevated card surface — used by Overview cards and content Cards
 * (About, Stats, Donations, volunteer tables). Same shadow stack everywhere.
 */
export const elevatedCardSurfaceClassName =
  "overflow-hidden rounded-2xl bg-bg-canvas shadow-[var(--shadow-card-elevated)]"

/** @deprecated Use elevatedCardSurfaceClassName — kept as alias for existing imports. */
export const detailCardSurfaceClassName = elevatedCardSurfaceClassName

/** Figma "Overview card" — metric/stat tile (94px tall, label → value). */
export function OverviewCard({
  label,
  value,
  suffix,
  headerExtra,
  footerExtra,
  className,
}: {
  label: string
  value: string
  suffix?: string
  headerExtra?: ReactNode
  footerExtra?: ReactNode
  className?: string
}) {
  return (
    <div className={cn(elevatedCardSurfaceClassName, "flex flex-1 flex-col gap-3 p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium leading-[22px] text-text-table-header">
          {label}
        </span>
        {headerExtra}
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex min-w-0 items-baseline gap-1">
          <span className="font-display text-xl font-semibold leading-7 text-text-events-strong">
            {value}
          </span>
          {suffix ? (
            <span className="text-xs font-medium leading-5 text-text-table-header">{suffix}</span>
          ) : null}
        </div>
        {footerExtra}
      </div>
    </div>
  )
}

/** Figma capacity chip on Total volunteers — flanking 10px add-circle icons. */
export function OverviewCapacityBadge({ children }: { children: ReactNode }) {
  const iconSize = EVENT_ICON_SIZE.overviewBadge

  return (
    <span className="inline-flex h-[18px] shrink-0 items-center gap-0.5 rounded bg-bg-default-100 px-1 py-0.5">
      <EventIcon name="add-circle-fill" size={iconSize} />
      <span className="px-0.5 text-[10px] font-medium leading-[18px] tracking-[0.1px] text-text-events-strong">
        {children}
      </span>
      <EventIcon name="add-circle-fill" size={iconSize} />
    </span>
  )
}

/** 28×28 view control with eye_2_fill (12px) for capacity breakdown. */
export function OverviewViewButton({
  onClick,
  label,
}: {
  onClick?: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-bg-default-100 text-icon-neutral transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-input-active"
      aria-label={label}
    >
      <EventIcon name="eye-2-fill" size={EVENT_ICON_SIZE.buttonLeading} />
    </button>
  )
}

/** Figma table skill tag — 24px, rounded-lg, bg-default. */
export function TableSkillTag({
  children,
  muted = false,
}: {
  children: ReactNode
  muted?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-lg bg-bg-default-100 px-2 py-1 text-xs font-medium leading-5",
        muted ? "text-text-table-header" : "text-text-events-strong",
      )}
    >
      {children}
    </span>
  )
}

/** Figma "New volunteer!" chip beside name in table rows. */
export function NewVolunteerBadge() {
  const iconSize = EVENT_ICON_SIZE.overviewBadge

  return (
    <span className="inline-flex h-[18px] shrink-0 items-center gap-0.5 rounded bg-bg-nav-tab-active px-1 py-0.5">
      <EventIcon name="add-circle-fill" size={iconSize} />
      <span className="px-0.5 text-[10px] font-medium leading-[18px] tracking-[0.1px] text-text-nav-tab-active">
        New volunteer!
      </span>
      <EventIcon name="add-circle-fill" size={iconSize} />
    </span>
  )
}

/** Rounded surface card matching Figma "Card" with header + body sections. */
export function DetailCard({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section className={cn(elevatedCardSurfaceClassName, className)}>
      {title ? (
        <div className="flex items-center justify-between gap-3 px-4 pt-4">
          <h2 className="truncate font-display text-xl font-semibold leading-7 text-text-events-strong">
            {title}
          </h2>
          {action}
        </div>
      ) : null}
      <div className={cn("flex flex-col gap-3 p-4", bodyClassName)}>{children}</div>
    </section>
  )
}

/** Read-only pill used for categories and skills. */
export function DetailChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-7 shrink-0 items-center rounded-full bg-bg-canvas px-2.5 text-sm font-medium leading-[22px] text-text-events-strong shadow-[0px_2px_2px_-1px_rgba(44,50,55,0.04),0px_1px_1px_-0.5px_rgba(44,50,55,0.04),0px_0px_0px_1px_rgba(44,50,55,0.12)]">
      {children}
    </span>
  )
}

/** 28px-tall neutral control (Provide signature, View more, session kebab). */
export function DetailSmallButton({
  className,
  children,
  iconOnly,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { iconOnly?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-7 cursor-pointer items-center justify-center gap-1 rounded-lg border border-border-default-100 bg-button-neutral text-xs font-medium leading-5 text-text-events-strong shadow-button-neutral transition-colors hover:bg-button-neutral-clicked focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-input-active",
        iconOnly ? "w-7 min-w-7 px-0" : "px-2.5",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

/** Section label above a value group (Description, Category, …). */
export function DetailFieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-normal leading-5 text-text-table-header">{children}</p>
  )
}

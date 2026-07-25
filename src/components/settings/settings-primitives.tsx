import type { ButtonHTMLAttributes } from "react"
import { cn } from "../../lib/utils"
import { elevatedCardSurfaceClassName } from "../events/detail/detail-primitives"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"

/** Elevated surface for settings tables and list panels (Figma card shadow, no border). */
export const settingsTableCardClassName = cn(elevatedCardSurfaceClassName, "overflow-hidden")

/** Figma upload control — h-7, upload_2_fill + add-circle_fill, shadow-button-neutral. */
export function SettingsUploadButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg bg-button-neutral px-2.5 text-xs font-semibold leading-5 text-text-events-strong shadow-button-neutral transition-colors hover:bg-button-neutral-hover",
        className,
      )}
      {...props}
    >
      <EventIcon name="upload-2-fill" size={EVENT_ICON_SIZE.buttonLeading} />
      {children}
      <EventIcon name="add-circle-fill" size={EVENT_ICON_SIZE.buttonTrailing} />
    </button>
  )
}

export function SettingsSearchIcon() {
  return <EventIcon name="search-line" size={EVENT_ICON_SIZE.search} className="text-icon-neutral" />
}

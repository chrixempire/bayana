import { cn } from "../../../lib/utils"

const ICONS = {
  "add-circle-fill": "/events/icons/add-circle-fill.svg",
  "arrow-up-fill": "/events/icons/arrow-up-fill.svg",
  "arrow-up-fill-neutral": "/events/icons/arrow-up-fill-neutral.svg",
  "arrow-right-fill": "/events/icons/arrow-right-fill.svg",
  "arrow-right-up-fill": "/events/icons/arrow-right-up-fill.svg",
  "attachment-fill": "/events/icons/attachment-fill.svg",
  "arrow-right-line": "/events/icons/arrow-right-line.svg",
  "award-fill": "/events/icons/award-fill.svg",
  "award-fill-white": "/events/icons/award-fill-white.svg",
  "bank-card-fill": "/events/icons/bank-card-fill.svg",
  "bank-fill": "/events/icons/bank-fill.svg",
  "box-3-fill": "/events/icons/box-3-fill.svg",
  "building-1-fill": "/events/icons/building-1-fill.svg",
  "briefcase-fill": "/events/icons/briefcase-fill.svg",
  "calendar-fill": "/events/icons/calendar-fill.svg",
  "check-circle-fill": "/events/icons/check-circle-fill.svg",
  "check-fill": "/events/icons/check-fill.svg",
  "check-fill-grey": "/events/icons/check-fill-grey.svg",
  "check-fill-white": "/events/icons/check-fill-white.svg",
  "close-circle-fill": "/events/icons/close-circle-fill.svg",
  "close-fill": "/events/icons/close-fill.svg",
  "down-fill": "/events/icons/down-fill.svg",
  "delete-fill": "/events/icons/delete-fill.svg",
  "draft-fill": "/events/icons/draft-fill.svg",
  "earth-fill": "/events/icons/earth-fill.svg",
  "earth-neutral-fill": "/events/icons/earth-neutral-fill.svg",
  "eye-fill": "/events/icons/eye-fill.svg",
  "eye-2-fill": "/events/icons/eye-2-fill.svg",
  "file-fill": "/events/icons/file-fill.svg",
  "flag-2-fill": "/events/icons/flag-2-fill.svg",
  "google-maps-pin": "/events/icons/google-maps-pin.svg",
  "google-meet": "/events/icons/google-meet.svg",
  "group-fill": "/events/icons/group-fill.svg",
  "horn-fill": "/events/icons/horn-fill.svg",
  "inbox-fill": "/events/icons/inbox-fill.svg",
  "inbox-fill-neutral": "/events/icons/inbox-fill-neutral.svg",
  "info-fill": "/events/icons/info-fill.svg",
  "information-fill": "/events/icons/information-fill.svg",
  "key-2-fill": "/events/icons/key-2-fill.svg",
  "list-check-fill": "/events/icons/list-check-fill.svg",
  "live-fill": "/events/icons/live-fill.svg",
  "live-location-fill": "/events/icons/live-location-fill.svg",
  "location-fill": "/events/icons/location-fill.svg",
  "lock-fill-red": "/events/icons/lock-fill-red.svg",
  "more-fill": "/events/icons/more-fill.svg",
  "more-1-fill": "/events/icons/more-1-fill.svg",
  "notification-fill": "/events/icons/notification-fill.svg",
  "pen-fill": "/events/icons/pen-fill.svg",
  "pencil-fill": "/events/icons/pencil-fill.svg",
  "pic-fill": "/events/icons/pic-fill.svg",
  "rocket-2-fill": "/events/icons/rocket-2-fill.svg",
  "search-line": "/events/icons/search-line.svg",
  "selector-vertical-line": "/events/icons/selector-vertical-line.svg",
  "settings-3-fill": "/events/icons/settings-3-fill.svg",
  "seal-fill": "/events/icons/seal-fill.svg",
  "share-2-fill": "/events/icons/share-2-fill.svg",
  "sparkles-fill": "/events/icons/sparkles-fill.svg",
  "star-fill": "/events/icons/star-fill.svg",
  "star-fill-accent": "/events/icons/star-fill-accent.svg",
  "time-fill": "/events/icons/time-fill.svg",
  "upload-2-fill": "/events/icons/upload-2-fill.svg",
  "user-3-fill": "/events/icons/user-3-fill.svg",
  "user-add-fill": "/events/icons/user-add-fill.svg",
  "user-group-fill": "/events/icons/user-group-fill.svg",
  "wallet-2-fill": "/events/icons/wallet-2-fill.svg",
  "wallet-2-fill-neutral": "/events/icons/wallet-2-fill-neutral.svg",
} as const

export type EventIconName = keyof typeof ICONS

type EventIconProps = {
  name: EventIconName
  size?: number
  className?: string
  /** Renders neutral gray Figma assets as white (primary buttons, cover placeholders). */
  inverted?: boolean
}

type IconRenderStyle = {
  imgClassName: string
  noOverflowClip?: boolean
}

/** Figma exports corner-stroke assets; each icon needs its own rotation to render correctly. */
const ICON_RENDER: Partial<Record<EventIconName, IconRenderStyle>> = {
  "down-fill": { imgClassName: "size-[45%] -rotate-[135deg]", noOverflowClip: true },
  "arrow-right-line": { imgClassName: "size-[45%] rotate-[135deg]", noOverflowClip: true },
  "check-fill-white": { imgClassName: "size-[70%] rotate-45", noOverflowClip: true },
  "check-fill-grey": { imgClassName: "size-[70%] rotate-45", noOverflowClip: true },
}

export function EventIcon({ name, size = 16, className, inverted = false }: EventIconProps) {
  const renderStyle = ICON_RENDER[name]

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        !renderStyle?.noOverflowClip && "overflow-hidden",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <img
        src={ICONS[name]}
        alt=""
        className={cn(
          "max-w-none object-contain",
          renderStyle?.imgClassName ?? "size-full",
          inverted && "brightness-0 invert",
        )}
      />
    </span>
  )
}

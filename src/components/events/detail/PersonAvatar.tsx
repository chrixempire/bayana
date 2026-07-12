import { cn } from "../../../lib/utils"
import type { PersonAvatarTone } from "../../../pages/dashboard/event-detail-types"

const TONE_CLASS: Record<PersonAvatarTone, string> = {
  orange: "border-border-input-active bg-bg-nav-tab-active text-text-nav-tab-active",
  purple: "border-[#ca2efe] bg-[#fcf4ff] text-[#ca2efe]",
  blue: "border-[#2ea1fe] bg-[#eaf6ff] text-[#2ea1fe]",
  green: "border-[#36b55c] bg-bg-success-soft text-text-success",
}

export function PersonAvatar({
  name,
  tone,
  imageUrl,
  size = 40,
  className,
}: {
  name: string
  tone: PersonAvatarTone
  imageUrl?: string
  size?: number
  className?: string
}) {
  const initial = name.trim().charAt(0).toUpperCase()

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        style={{ width: size, height: size }}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    )
  }

  return (
    <span
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border-[0.5px] font-semibold",
        TONE_CLASS[tone],
        className,
      )}
      aria-hidden
    >
      {initial}
    </span>
  )
}

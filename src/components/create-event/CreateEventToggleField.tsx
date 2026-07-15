import { Switch } from "../ui/switch"
import { cn } from "../../lib/utils"
import { ProBadge } from "./ProBadge"

/** Toggle row — switch left, label + description right (matches volunteer settings form). */
export function CreateEventToggleField({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  pro,
  proLocked,
  onProInteract,
}: {
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  pro?: boolean
  /** When true, row opens upgrade instead of toggling (free plan). */
  proLocked?: boolean
  onProInteract?: () => void
}) {
  const locked = Boolean(proLocked && onProInteract)

  const row = (
    <div className="flex items-start gap-4">
      <Switch
        checked={checked}
        onCheckedChange={locked ? undefined : onCheckedChange}
        disabled={disabled || locked}
        className="mt-0.5 shrink-0"
      />
      <div className={cn("flex min-w-0 flex-1 flex-col", description && "gap-1")}>
        <div className="flex flex-wrap items-center gap-2">
          <p className="type-events-tab">{label}</p>
          {pro ? <ProBadge /> : null}
        </div>
        {description ? <p className="type-create-event-caption">{description}</p> : null}
      </div>
    </div>
  )

  if (!locked) return row

  return (
    <div
      role="button"
      tabIndex={0}
      className="cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-border-input-active"
      onClick={onProInteract}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onProInteract?.()
        }
      }}
    >
      {row}
    </div>
  )
}

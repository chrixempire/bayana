import { Switch } from "../ui/switch"
import { ProBadge } from "./ProBadge"
import {
  CREATE_EVENT_BREAKDOWN_PANEL_CLASS,
  CREATE_EVENT_INSET_PANEL_PADDING,
} from "./create-event-surface-styles"
import { cn } from "../../lib/utils"

/** Pro breakdown capacity — bordered card with toggle on the right (shown when capacity limit is on). */
export function BreakdownCapacityCard({
  checked,
  onCheckedChange,
  disabled = true,
}: {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className={cn("w-full", CREATE_EVENT_BREAKDOWN_PANEL_CLASS, CREATE_EVENT_INSET_PANEL_PADDING)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="type-events-tab">Breakdown capacity</p>
            <ProBadge />
          </div>
          <p className="type-create-event-caption">
            Specify the number of capacity you need per skills needed
          </p>
        </div>
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className="mt-0.5 shrink-0"
        />
      </div>
    </div>
  )
}

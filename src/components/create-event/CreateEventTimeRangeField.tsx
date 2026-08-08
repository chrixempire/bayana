import { ScheduleTimePicker } from "./ScheduleTimePicker"

export function CreateEventTimeRangeField({
  start,
  end,
  onStartChange,
  onEndChange,
}: {
  start: string
  end: string
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <ScheduleTimePicker
        value={start}
        onChange={onStartChange}
        ariaLabel="Start time"
        placeholder="Start time"
      />
      <span className="shrink-0 text-sm leading-[22px] text-text-table-header">to</span>
      <ScheduleTimePicker
        value={end}
        onChange={onEndChange}
        ariaLabel="End time"
        placeholder="End time"
      />
    </div>
  )
}

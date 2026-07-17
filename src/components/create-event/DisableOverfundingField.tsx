import { Checkbox } from "../ui/checkbox"

export function DisableOverfundingField({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id="disable-overfunding"
        size="sm"
        checked={checked}
        onCheckedChange={onChange}
        className="mt-0.5"
      />
      <label htmlFor="disable-overfunding" className="flex min-w-0 cursor-pointer flex-col gap-1">
        <span className="type-events-tab text-text-events-strong">Disable overfunding</span>
        <span className="type-create-event-caption">Disable funding when amount goal is met</span>
      </label>
    </div>
  )
}

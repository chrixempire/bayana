export function CreateEventFieldLabel({
  label,
  required,
}: {
  label: string
  required?: boolean
}) {
  return (
    <span className="type-create-event-field-label">
      {label}
      {required ? <span className="text-text-negative"> *</span> : null}
    </span>
  )
}

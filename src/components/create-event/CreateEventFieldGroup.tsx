import type { ReactNode } from "react"
import { CreateEventFieldLabel } from "./CreateEventFieldLabel"

export function CreateEventFieldGroup({
  label,
  required,
  description,
  children,
}: {
  label: string
  required?: boolean
  description?: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <CreateEventFieldLabel label={label} required={required} />
        {description ? <p className="type-create-event-caption">{description}</p> : null}
      </div>
      {children ? <div className="flex flex-col gap-2">{children}</div> : null}
    </div>
  )
}

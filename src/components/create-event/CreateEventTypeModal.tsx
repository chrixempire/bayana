import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import type { CreateEventType } from "../../lib/create-event-paths"
import { CREATE_EVENT_TYPE_OPTIONS } from "./create-event-type-options"
import { CreateEventTypeIcon } from "./icons/CreateEventTypeIcon"

type CreateEventTypeModalProps = {
  open: boolean
  onClose: () => void
  onSelect: (type: CreateEventType) => void
}

export function CreateEventTypeModal({ open, onClose, onSelect }: CreateEventTypeModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-bg-overlay"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-event-modal-title"
        className="relative z-10 w-full max-w-[440px] rounded-3xl bg-bg-canvas p-6 shadow-[0_24px_60px_rgba(44,50,55,0.18)]"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2
            id="create-event-modal-title"
            className="font-display text-xl font-semibold leading-7 tracking-[-0.2px] text-text-events-strong"
          >
            Create event
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-bg-default-100 text-text-table-header transition-colors hover:bg-bg-active-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-input-active"
            aria-label="Close"
          >
            <EventIcon name="close-fill" size={EVENT_ICON_SIZE.meta} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {CREATE_EVENT_TYPE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className="flex w-full cursor-pointer items-start gap-4 rounded-2xl border border-border-default-100 bg-bg-canvas p-4 text-left transition-colors hover:bg-bg-on-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-input-active focus-visible:ring-offset-2"
            >
              <CreateEventTypeIcon type={option.id} className="size-12 shrink-0 rounded-full" />
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-sm font-semibold leading-[22px] text-text-events-strong">
                  {option.label}
                </span>
                <span className="text-sm leading-[22px] text-text-table-header">{option.description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

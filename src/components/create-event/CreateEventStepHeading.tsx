import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"

export function CreateEventStepHeading({
  title,
  subtitle,
  onBack,
}: {
  title: string
  subtitle: string
  onBack?: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go to previous step"
          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#EDF0F2] bg-bg-canvas text-icon-neutral shadow-[0_1px_2px_rgba(44,50,55,0.04)] transition-colors hover:bg-bg-on-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-input-active"
        >
          <EventIcon name="arrow-right-line" size={EVENT_ICON_SIZE.meta} className="rotate-180" />
        </button>
      ) : null}
      <h2 className="font-display text-2xl font-semibold leading-8 tracking-[-0.2px] text-text-events-strong">
        {title}
      </h2>
      <p className="type-create-event-subtitle">{subtitle}</p>
    </div>
  )
}

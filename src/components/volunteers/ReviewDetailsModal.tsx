import { Modal } from "../ui/modal"
import { Button } from "../ui/button"
import { PersonAvatar } from "../events/detail/PersonAvatar"
import { EventIcon } from "../events/icons/EventIcon"
import type { ReviewRow } from "../../pages/dashboard/reviews-data"

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <EventIcon
          key={i}
          name={i < rating ? "star-fill-accent" : "star-fill"}
          size={16}
          className="shrink-0"
        />
      ))}
    </span>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-text-table-header">{label}</span>
      {children}
    </div>
  )
}

export function ReviewDetailsModal({
  open,
  review,
  onClose,
}: {
  open: boolean
  review: ReviewRow | null
  onClose: () => void
}) {
  return (
    <Modal
      open={open && review !== null}
      onClose={onClose}
      title="Review details"
      size="md"
      footer={
        <Button type="button" variant="neutral" className="rounded-xl" onClick={onClose}>
          Close
        </Button>
      }
    >
      {review ? (
        <div className="flex flex-col gap-4 pb-2">
          <Field label="Event">
            <span className="text-sm font-medium text-bg-accent">{review.event}</span>
          </Field>
          <Field label="Volunteer">
            <span className="flex items-center gap-2 text-sm text-text-events-strong">
              <PersonAvatar name={review.name} tone={review.avatarTone} size={24} />
              {review.name}
            </span>
          </Field>
          <Field label="Ratings">
            <StarRating rating={review.rating} />
          </Field>
          <Field label="Review">
            <span className="text-sm leading-[22px] text-text-events-strong">
              {review.review ? `“${review.review}”` : "No review"}
            </span>
          </Field>
          <Field label="Date added">
            <span className="text-sm text-text-events-strong">{review.dateAdded}</span>
          </Field>
        </div>
      ) : null}
    </Modal>
  )
}

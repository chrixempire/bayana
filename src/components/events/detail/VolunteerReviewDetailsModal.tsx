import { Modal } from "../../ui/modal"
import { Button } from "../../ui/button"
import { EventIcon } from "../icons/EventIcon"

export type ReviewDetail = {
  eventTitle: string
  rating: number
  review: string
  dateAdded: string
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <EventIcon
          key={index}
          name={index < rating ? "star-fill-accent" : "star-fill"}
          size={16}
          className="shrink-0"
        />
      ))}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-border-default-100 pt-3 first:border-t-0 first:pt-0">
      <span className="text-xs leading-5 text-text-table-header">{label}</span>
      {children}
    </div>
  )
}

export function VolunteerReviewDetailsModal({
  review,
  onClose,
}: {
  review: ReviewDetail | null
  onClose: () => void
}) {
  return (
    <Modal
      open={Boolean(review)}
      onClose={onClose}
      title="Review details"
      size="sm"
      footer={
        <Button type="button" variant="neutral" className="rounded-xl" onClick={onClose}>
          Close
        </Button>
      }
    >
      {review ? (
        <div className="flex flex-col gap-3 pb-2">
          <Field label="Event">
            <span className="text-sm font-medium leading-[22px] text-text-nav-tab-active">
              {review.eventTitle}
            </span>
          </Field>
          <Field label="Ratings">
            <Stars rating={review.rating} />
          </Field>
          <Field label="Review">
            <p className="text-sm leading-[22px] text-text-events-strong">
              &ldquo;{review.review}&rdquo;
            </p>
          </Field>
          <Field label="Date added">
            <span className="text-sm font-medium leading-[22px] text-text-events-strong">
              {review.dateAdded}
            </span>
          </Field>
        </div>
      ) : null}
    </Modal>
  )
}

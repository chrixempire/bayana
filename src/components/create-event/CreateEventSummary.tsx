import { Calendar, HandCoins, MapPin, Users } from "lucide-react"
import { getDonationSummaryRows } from "../../lib/create-event-donations"
import { Button } from "../ui/button"
import { StatusTag } from "../ui/status-tag"
import { CREATE_EVENT_SUMMARY_MAX_WIDTH_PX } from "../../lib/dashboard-layout"
import { formatSummaryDateTime } from "../../lib/create-event-format"
import { CREATE_EVENT_FREE_PLAN_MAX_VOLUNTEERS } from "../../data/create-event-settings"
import type { CreateEventFormState } from "../../pages/dashboard/create-event-types"
import { cn } from "../../lib/utils"

export function CreateEventSummary({
  form,
  canCreate,
  isPremium = false,
  onCreate,
}: {
  form: CreateEventFormState
  canCreate: boolean
  isPremium?: boolean
  onCreate: () => void
}) {
  const cover = form.images.find((image) => image.isCover) ?? form.images[0]
  const extraCategories = Math.max(0, form.categories.length - 1)
  const donationRows = getDonationSummaryRows(form.donationAmount, form.receiveDonations)

  const displayCapacity = form.hasCapacityLimit
    ? isPremium
      ? form.capacity
      : Math.min(form.capacity, CREATE_EVENT_FREE_PLAN_MAX_VOLUNTEERS)
    : isPremium
      ? "Unlimited"
      : CREATE_EVENT_FREE_PLAN_MAX_VOLUNTEERS

  return (
    <aside
      className="w-full shrink-0 lg:sticky lg:top-6"
      style={{ maxWidth: CREATE_EVENT_SUMMARY_MAX_WIDTH_PX }}
    >
      <p className="mb-4 text-sm font-semibold leading-[22px] text-text-events-strong">Summary</p>

      <div className="overflow-hidden rounded-2xl border border-border-default-100 bg-bg-canvas shadow-[0_2px_8px_rgba(44,50,55,0.06)]">
        <div className="relative aspect-[1280/820] w-full overflow-hidden bg-bg-default-100">
          {cover ? (
            <img
              src={cover.previewUrl}
              alt=""
              className="absolute inset-0 block h-full w-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-bg-active-200 to-bg-default-100" />
          )}
          {form.categories[0] ? (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              <StatusTag className="border-0 bg-bg-overlay/80 text-text-on-solid-bg backdrop-blur-sm">
                {form.categories[0]}
              </StatusTag>
              {extraCategories > 0 ? (
                <span className="inline-flex items-center rounded-lg bg-bg-canvas/90 px-2 py-0.5 text-xs font-medium text-text-events-strong">
                  +{extraCategories}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-[22px] text-text-events-strong">
              {form.title || "Untitled event"}
            </h3>
            <p className="mt-1 line-clamp-3 text-xs leading-5 text-text-table-header">
              {form.description || "Your description will appear here."}
            </p>
          </div>

          <ul className="flex flex-col gap-3 text-xs leading-5 text-text-events-strong">
            <li className="flex items-start gap-2">
              <Calendar className="mt-0.5 size-4 shrink-0 text-icon-neutral" />
              <span>
                <span className="text-text-table-header">Date — </span>
                {formatSummaryDateTime(form.dateStart, form.dateEnd, form.timeStart, form.timeEnd)}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-icon-neutral" />
              <span>
                <span className="text-text-table-header">Volunteering type — </span>
                {form.volunteeringType === "in-person" ? "In-person" : "Virtual"}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Users className="mt-0.5 size-4 shrink-0 text-icon-neutral" />
              <span>
                <span className="text-text-table-header">Volunteer capacity — </span>
                {displayCapacity}
                {typeof displayCapacity === "number" ? " Volunteers" : ""}
              </span>
            </li>
            {form.receiveDonations ? (
              <>
                <li className="flex items-start gap-2">
                  <HandCoins className="mt-0.5 size-4 shrink-0 text-icon-neutral" />
                  <span className="flex w-full min-w-0 justify-between gap-2">
                    <span className="text-text-table-header">Donations</span>
                    <span className="text-right font-medium">{donationRows.donations}</span>
                  </span>
                </li>
                <li className="flex min-w-0 justify-between gap-2 pl-6">
                  <span className="text-text-table-header">Platform fee (2%)</span>
                  <span className="text-right font-medium">{donationRows.platformFee}</span>
                </li>
                <li className="flex min-w-0 justify-between gap-2 pl-6">
                  <span className="text-text-table-header">Total amount to receive</span>
                  <span className="text-right font-medium">{donationRows.totalToReceive}</span>
                </li>
              </>
            ) : null}
          </ul>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        block
        disabled={!canCreate}
        onClick={onCreate}
        className={cn("mt-4 rounded-xl")}
      >
        Create event
      </Button>
    </aside>
  )
}

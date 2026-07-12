import { Calendar, Coins, HandCoins, Handshake, MapPin, Package, Users } from "lucide-react"
import {
  formatNaira,
  getDonationSummaryRows,
  CREATE_EVENT_DONATION_PLATFORM_FEE_RATE,
} from "../../lib/create-event-donations"
import { Button } from "../ui/button"
import { StatusTag } from "../ui/status-tag"
import { CREATE_EVENT_SUMMARY_MAX_WIDTH_PX } from "../../lib/dashboard-layout"
import { formatNeedsSummaryDateRange, formatSummaryDateTime } from "../../lib/create-event-format"
import { CREATE_EVENT_FREE_PLAN_MAX_VOLUNTEERS } from "../../data/create-event-settings"
import type { CreateEventFormState } from "../../pages/dashboard/create-event-types"
import type { CreateEventType } from "../../lib/create-event-paths"
import { cn } from "../../lib/utils"

export function CreateEventSummary({
  form,
  canCreate,
  isPremium = false,
  eventType = "cause",
  onCreate,
}: {
  form: CreateEventFormState
  canCreate: boolean
  isPremium?: boolean
  eventType?: CreateEventType
  onCreate: () => void
}) {
  const isNeeds = eventType === "needs"
  const cover = form.images.find((image) => image.isCover) ?? form.images[0]
  const extraCategories = Math.max(0, form.categories.length - 1)
  const donationRows = getDonationSummaryRows(form.donationAmount, form.receiveDonations)

  const targetAmount = form.donationAmount
  const platformFee = targetAmount * CREATE_EVENT_DONATION_PLATFORM_FEE_RATE
  const totalToReceive = targetAmount - platformFee

  const inKindItems = form.inKindItems
  const deliveryLabel =
    [form.deliveryByDelivery && "Delivery", form.deliveryByPickup && "Pickup"]
      .filter(Boolean)
      .join(", ") || "--"
  const collaborator = form.ngoCollaboration ? form.ngoOrganization : ""

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

          {isNeeds ? (
            <ul className="flex flex-col gap-3 text-xs leading-5 text-text-events-strong">
              <li className="flex min-w-0 items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-text-table-header">
                  <Calendar className="size-4 shrink-0 text-icon-neutral" />
                  Date
                </span>
                <span className="text-right font-medium">
                  {formatNeedsSummaryDateRange(form.dateStart, form.dateEnd)}
                </span>
              </li>
              {collaborator ? (
                <li className="flex min-w-0 items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-text-table-header">
                    <Handshake className="size-4 shrink-0 text-icon-neutral" />
                    Collaborator
                  </span>
                  <span className="truncate text-right font-medium">{collaborator}</span>
                </li>
              ) : null}
              {form.inKindDonations ? (
                <>
                  <li className="flex min-w-0 items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-text-table-header">
                      <Package className="size-4 shrink-0 text-icon-neutral" />
                      Items ({inKindItems.length})
                    </span>
                    {inKindItems.length > 0 ? (
                      <span className="flex items-center">
                        {inKindItems.slice(0, 4).map((item, index) => (
                          <span
                            key={item.id}
                            className={cn(
                              "inline-flex size-6 items-center justify-center overflow-hidden rounded-md border border-bg-canvas bg-bg-default-100 text-icon-neutral",
                              index > 0 && "-ml-2",
                            )}
                          >
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt="" className="size-full object-cover" />
                            ) : (
                              <Package className="size-3" />
                            )}
                          </span>
                        ))}
                        {inKindItems.length > 4 ? (
                          <span className="-ml-2 inline-flex size-6 items-center justify-center rounded-md border border-bg-canvas bg-bg-default-100 text-[10px] font-medium text-text-events-strong">
                            +{inKindItems.length - 4}
                          </span>
                        ) : null}
                      </span>
                    ) : (
                      <span className="text-right font-medium">--</span>
                    )}
                  </li>
                  <li className="flex min-w-0 items-center justify-between gap-2">
                    <span className="text-text-table-header">Delivery options</span>
                    <span className="text-right font-medium">{deliveryLabel}</span>
                  </li>
                </>
              ) : null}
              {form.financialDonations ? (
                <>
                  <li className="flex min-w-0 items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-text-table-header">
                      <Coins className="size-4 shrink-0 text-icon-neutral" />
                      Target amount
                    </span>
                    <span className="text-right font-medium">{formatNaira(targetAmount)}</span>
                  </li>
                  <li className="flex min-w-0 justify-between gap-2">
                    <span className="text-text-table-header">Platform fee (2%)</span>
                    <span className="text-right font-medium">{formatNaira(platformFee)}</span>
                  </li>
                  <li className="flex min-w-0 justify-between gap-2 border-t border-border-default-100 pt-3">
                    <span className="text-text-table-header">Total amount to receive</span>
                    <span className="text-right text-sm font-semibold">
                      {formatNaira(totalToReceive)}
                    </span>
                  </li>
                </>
              ) : null}
            </ul>
          ) : (
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
          )}
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

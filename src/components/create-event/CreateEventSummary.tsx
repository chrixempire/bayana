import type { ReactNode } from "react"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { CREATE_EVENT_DONATION_PLATFORM_FEE_RATE } from "../../lib/create-event-donations"
import { Button } from "../ui/button"
import { CREATE_EVENT_SUMMARY_MAX_WIDTH_PX } from "../../lib/dashboard-layout"
import {
  formatCauseDisplayDate,
  formatNeedsSummaryDateRange,
} from "../../lib/create-event-format"
import { CREATE_EVENT_FREE_PLAN_MAX_VOLUNTEERS } from "../../data/create-event-settings"
import type { CreateEventFormState } from "../../pages/dashboard/create-event-types"
import type { CreateEventType } from "../../lib/create-event-paths"
import { cn } from "../../lib/utils"

/** Figma Card/shadow-normal — create-event summary (18290:41009). */
const SUMMARY_CARD_SHADOW =
  "0px 16px 16px -8px rgba(44,50,55,0.04), 0px 8px 8px -4px rgba(44,50,55,0.04), 0px 4px 4px -2px rgba(44,50,55,0.04), 0px 2px 2px -1px rgba(44,50,55,0.04), 0px 1px 1px -0.5px rgba(44,50,55,0.04), 0px 0px 0px 1px rgba(44,50,55,0.08)"

/** Figma summary amounts: ₦400,000 (no space / decimals). */
function formatSummaryNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`
}

function SummaryCategoryChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center justify-center rounded-2xl border border-white bg-white/85 px-2 text-[10px] font-medium leading-[18px] tracking-[0.1px] text-text-events-strong backdrop-blur-[2px]">
      {children}
    </span>
  )
}

function SummaryMetaRow({
  icon,
  label,
  value,
}: {
  icon?: ReactNode
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex w-full items-center justify-between gap-2 border-t border-border-default-100 bg-bg-canvas px-4 py-3">
      <span className="flex min-w-0 items-center gap-1 text-xs font-normal leading-5 text-text-table-header">
        {icon ? <span className="inline-flex size-4 shrink-0 items-center justify-center text-icon-neutral">{icon}</span> : null}
        <span className="truncate">{label}</span>
      </span>
      <span className="shrink-0 text-right text-xs font-medium leading-5 text-text-events-strong">{value}</span>
    </div>
  )
}

export function CreateEventSummary({
  form,
  canCreate,
  isPremium = false,
  eventType = "cause",
  isSubmitting = false,
  onCreate,
}: {
  form: CreateEventFormState
  canCreate: boolean
  isPremium?: boolean
  eventType?: CreateEventType
  isSubmitting?: boolean
  onCreate: () => void
}) {
  const isNeeds = eventType === "needs"
  const cover = form.images.find((image) => image.isCover) ?? form.images[0]
  const extraCategories = Math.max(0, form.categories.length - 1)
  const targetAmount = form.donationAmount
  const platformFee = targetAmount * CREATE_EVENT_DONATION_PLATFORM_FEE_RATE
  const totalToReceive = targetAmount - platformFee
  const causeDonationAmount = form.receiveDonations ? formatSummaryNaira(targetAmount) : null
  const causePlatformFee = form.receiveDonations ? formatSummaryNaira(platformFee) : null
  const causeTotalToReceive = form.receiveDonations ? formatSummaryNaira(totalToReceive) : null

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

  const capacityLabel =
    typeof displayCapacity === "number" ? `${displayCapacity} Volunteers` : displayCapacity

  return (
    <aside
      className="flex w-full shrink-0 flex-col gap-4 lg:sticky lg:top-6"
      style={{ maxWidth: CREATE_EVENT_SUMMARY_MAX_WIDTH_PX }}
    >
      <p className="text-base font-semibold leading-6 text-text-events-strong">Summary</p>

      <div
        className="overflow-hidden rounded-2xl bg-bg-canvas"
        style={{ boxShadow: SUMMARY_CARD_SHADOW }}
      >
        <div className="relative h-40 w-full overflow-hidden bg-bg-default-100">
          {cover ? (
            <img
              src={cover.previewUrl}
              alt=""
              className="absolute inset-0 block size-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-bg-active-200 to-bg-default-100" />
          )}
          {form.categories[0] ? (
            <div className="absolute left-4 top-4 flex items-center gap-1">
              <SummaryCategoryChip>{form.categories[0]}</SummaryCategoryChip>
              {extraCategories > 0 ? (
                <SummaryCategoryChip>+{extraCategories}</SummaryCategoryChip>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col">
          <div className="flex flex-col gap-2 px-4 py-3">
            <h3 className="truncate text-sm font-medium leading-[22px] text-text-events-strong">
              {form.title || "Untitled event"}
            </h3>
            <p className="line-clamp-2 text-xs font-normal leading-5 text-text-table-header">
              {form.description || "Your description will appear here."}
            </p>
          </div>

          {isNeeds ? (
            <div className="flex flex-col">
              <SummaryMetaRow
                icon={<EventIcon name="calendar-fill" size={EVENT_ICON_SIZE.meta} />}
                label="Date"
                value={formatNeedsSummaryDateRange(form.dateStart, form.dateEnd)}
              />
              {collaborator ? (
                <SummaryMetaRow
                  icon={<EventIcon name="group-fill" size={EVENT_ICON_SIZE.meta} />}
                  label="Collaborator"
                  value={collaborator}
                />
              ) : null}
              {form.inKindDonations ? (
                <>
                  <div className="flex w-full items-center justify-between gap-2 border-t border-border-default-100 px-4 py-3">
                    <span className="flex items-center gap-1 text-xs leading-5 text-text-table-header">
                      <span className="inline-flex size-4 shrink-0 text-icon-neutral">
                        <EventIcon name="box-3-fill" size={EVENT_ICON_SIZE.meta} />
                      </span>
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
                              <EventIcon name="box-3-fill" size={EVENT_ICON_SIZE.chip} />
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
                      <span className="text-xs font-medium leading-5 text-text-events-strong">--</span>
                    )}
                  </div>
                  <SummaryMetaRow label="Delivery options" value={deliveryLabel} />
                </>
              ) : null}
              {form.financialDonations ? (
                <div className="flex flex-col gap-4 border-t border-border-default-100 px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-xs leading-5 text-text-table-header">
                      <span className="inline-flex size-4 shrink-0 text-icon-neutral">
                        <EventIcon name="wallet-2-fill" size={EVENT_ICON_SIZE.meta} />
                      </span>
                      Target amount
                    </span>
                    <span className="text-xs font-medium leading-5 text-text-events-strong">
                      {formatSummaryNaira(targetAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs leading-5">
                    <span className="text-text-table-header">Platform fee (2%)</span>
                    <span className="font-medium text-text-events-strong">{formatSummaryNaira(platformFee)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium leading-5 text-text-table-header">
                      Total amount to receive
                    </span>
                    <span className="text-base font-semibold leading-6 text-text-events-strong">
                      {formatSummaryNaira(totalToReceive)}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col">
              <SummaryMetaRow
                icon={<EventIcon name="calendar-fill" size={EVENT_ICON_SIZE.meta} />}
                label="Date"
                value={formatCauseDisplayDate(form.dateStart, "--")}
              />
              <SummaryMetaRow
                icon={<EventIcon name="location-fill" size={EVENT_ICON_SIZE.meta} />}
                label="Volunteering type"
                value={form.volunteeringType === "in-person" ? "In-person" : "Virtual"}
              />
              <SummaryMetaRow
                icon={<EventIcon name="user-group-fill" size={EVENT_ICON_SIZE.meta} />}
                label="Volunteer capacity"
                value={capacityLabel}
              />
              {form.receiveDonations ? (
                <div className="flex flex-col gap-4 border-t border-border-default-100 px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-xs leading-5 text-text-table-header">
                      <span className="inline-flex size-4 shrink-0 text-icon-neutral">
                        <EventIcon name="wallet-2-fill" size={EVENT_ICON_SIZE.meta} />
                      </span>
                      Donations
                    </span>
                    <span className="text-xs font-medium leading-5 text-text-events-strong">
                      {causeDonationAmount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs leading-5">
                    <span className="text-text-table-header">Platform fee (2%)</span>
                    <span className="font-medium text-text-events-strong">{causePlatformFee}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium leading-5 text-text-table-header">
                      Total amount to receive
                    </span>
                    <span className="text-base font-semibold leading-6 text-text-events-strong">
                      {causeTotalToReceive}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        block
        size="sm"
        disabled={!canCreate || isSubmitting}
        onClick={onCreate}
        className="h-10 min-h-10 rounded-xl px-3.5"
      >
        {isSubmitting ? "Creating..." : "Create event"}
      </Button>
    </aside>
  )
}

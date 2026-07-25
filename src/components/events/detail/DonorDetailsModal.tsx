import { Modal } from "../../ui/modal"
import { Button } from "../../ui/button"
import { EventIcon, type EventIconName } from "../icons/EventIcon"
import { EVENT_ICON_SIZE } from "../icons/event-icon-sizes"
import { PersonAvatar } from "./PersonAvatar"
import { InKindStatusTag } from "./NeedsInKindDonationsTab"
import type { InKindDonationRow } from "../../../pages/dashboard/event-detail-types"

function InfoRow({ icon, label, value }: { icon: EventIconName; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-xs leading-5 text-text-table-header">
        <EventIcon name={icon} size={EVENT_ICON_SIZE.fieldHint} />
        {label}
      </span>
      <span className="text-sm font-[510] leading-[22px] text-text-events-strong">{value}</span>
    </div>
  )
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-xs leading-5 text-text-table-header">{children}</span>
}

export function DonorDetailsModal({
  donation,
  onClose,
  onConfirmReceipt,
  onMessage,
}: {
  donation: InKindDonationRow | null
  onClose: () => void
  onConfirmReceipt: (donation: InKindDonationRow) => void
  onMessage: (donation: InKindDonationRow) => void
}) {
  return (
    <Modal
      open={Boolean(donation)}
      onClose={onClose}
      title="Donor details"
      size="lg"
      footer={
        donation ? (
          <Button
            type="button"
            variant="primary"
            className="rounded-xl"
            leftIcon={<span className="text-base leading-none">✓</span>}
            onClick={() => onConfirmReceipt(donation)}
          >
            Confirm receipt
          </Button>
        ) : null
      }
    >
      {donation ? (
        <div className="flex flex-col gap-6 pb-2 sm:flex-row">
          {/* Profile */}
          <div className="flex w-full shrink-0 flex-col gap-4 sm:w-[220px]">
            <PersonAvatar name={donation.donor} tone={donation.avatarTone} size={48} />
            <div>
              <p className="text-base font-semibold leading-6 text-text-events-strong">
                {donation.donor}
              </p>
              <p className="text-sm leading-[22px] text-text-table-header">@{donation.handle}</p>
            </div>
            <Button
              type="button"
              variant="neutral"
              className="h-9 w-fit rounded-lg"
              leftIcon={<EventIcon name="inbox-fill" size={EVENT_ICON_SIZE.meta} />}
              onClick={() => onMessage(donation)}
            >
              Send message
            </Button>
            <div className="flex flex-col gap-3">
              <InfoRow icon="inbox-fill" label="Email" value={donation.email} />
              <InfoRow icon="user-3-fill" label="Phone number" value={donation.phone} />
              <InfoRow icon="calendar-fill" label="Date joined" value={donation.dateJoined} />
            </div>
          </div>

          {/* Donation details + activity */}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-2xl border border-border-default-100 p-4">
              <p className="text-sm font-semibold leading-[22px] text-text-events-strong">
                Donation details
              </p>
              <div className="flex flex-col gap-2">
                <FieldLabel>Items pledged</FieldLabel>
                <div className="flex flex-col gap-2">
                  {donation.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 rounded-lg bg-bg-on-canvas p-2"
                    >
                      <span className="flex size-8 items-center justify-center overflow-hidden rounded-md bg-bg-default-100 text-icon-neutral">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" className="size-full object-cover" />
                        ) : (
                          <EventIcon name="pic-fill" size={EVENT_ICON_SIZE.meta} />
                        )}
                      </span>
                      <span className="flex-1 truncate text-sm font-[510] text-text-events-strong">
                        {item.name}
                      </span>
                      <span className="text-sm font-semibold text-text-events-strong">
                        {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>Delivery type</FieldLabel>
                <span className="text-sm font-[510] leading-[22px] text-text-events-strong">
                  {donation.deliveryType}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Status</FieldLabel>
                <InKindStatusTag status={donation.status} />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>Preferred delivery date</FieldLabel>
                <span className="text-sm font-[510] leading-[22px] text-text-events-strong">
                  {donation.preferredDate}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>Date pledged</FieldLabel>
                <span className="text-sm font-[510] leading-[22px] text-text-events-strong">
                  {donation.datePledged}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-border-default-100 p-4">
              <p className="text-sm font-semibold leading-[22px] text-text-events-strong">Activity</p>
              <div className="flex items-start gap-2">
                <EventIcon name="sparkles-fill" size={EVENT_ICON_SIZE.meta} className="mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-[510] leading-[22px] text-text-events-strong">
                    Pledged {donation.itemsCount} items
                  </span>
                  <span className="text-xs leading-5 text-text-table-header">
                    {donation.datePledged}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}

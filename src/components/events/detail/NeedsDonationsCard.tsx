import { cn } from "../../../lib/utils"
import type { NeedsHomeData, NeedsRecentDonation } from "../../../pages/dashboard/event-detail-types"
import { EventIcon } from "../icons/EventIcon"
import { EVENT_ICON_SIZE } from "../icons/event-icon-sizes"
import { DetailSmallButton, detailCardSurfaceClassName } from "./detail-primitives"

function StatCell({
  value,
  suffix,
  label,
  className,
}: {
  value: string
  suffix?: string
  label: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border-default-100 p-4",
        className,
      )}
    >
      <div className="flex items-baseline gap-1">
        <span className="font-display text-xl font-semibold leading-7 text-text-events-strong">
          {value}
        </span>
        {suffix ? (
          <span className="text-xs font-medium leading-5 text-text-table-header">{suffix}</span>
        ) : null}
      </div>
      <span className="text-sm font-medium leading-[22px] text-text-table-header">{label}</span>
    </div>
  )
}

function CashDonationIcon() {
  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e7fbed]"
      style={{ width: EVENT_ICON_SIZE.donationWalletCircle, height: EVENT_ICON_SIZE.donationWalletCircle }}
    >
      <EventIcon name="wallet-2-fill" size={EVENT_ICON_SIZE.donationWallet} />
    </span>
  )
}

function InKindDonationIcon({ images }: { images?: string[] }) {
  if (images?.length) {
    return (
      <span className="relative size-10 shrink-0 overflow-hidden rounded-lg">
        <img src={images[0]} alt="" className="size-full object-cover" />
        {images[1] ? (
          <img
            src={images[1]}
            alt=""
            className="absolute bottom-0 right-0 size-5 rounded border-[0.5px] border-border-default-100 object-cover"
          />
        ) : null}
      </span>
    )
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-lg bg-bg-default-100"
      style={{ width: EVENT_ICON_SIZE.donationItemCircle, height: EVENT_ICON_SIZE.donationItemCircle }}
    >
      <EventIcon name="box-3-fill" size={EVENT_ICON_SIZE.donationItemFallback} />
    </span>
  )
}

function RecentDonationRow({ donation }: { donation: NeedsRecentDonation }) {
  const isInKind = donation.kind === "in-kind"

  return (
    <div className="flex items-center gap-4 border-b border-border-default-100 py-4 last:border-b-0">
      {isInKind ? (
        <InKindDonationIcon images={donation.itemImages} />
      ) : (
        <CashDonationIcon />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-sm font-medium leading-[22px] text-text-events-strong">
          {donation.donor} donated
        </p>
        <p className="text-xs font-normal leading-5 text-text-table-header">{donation.timeAgo}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-medium leading-[22px] text-[#087629]">{donation.amount}</span>
        <span className="text-xs font-normal leading-5 text-text-table-header">{donation.left}</span>
      </div>
    </div>
  )
}

export function NeedsDonationsCard({
  needs,
  showInKindStats = false,
  onViewMore,
}: {
  needs: NeedsHomeData
  showInKindStats?: boolean
  onViewMore?: () => void
}) {
  const recent = needs.recentDonations

  return (
    <section className={detailCardSurfaceClassName}>
      <div
        className={cn(
          "grid border-b border-border-default-100",
          showInKindStats ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2",
        )}
      >
        <StatCell value={String(needs.donorsCount)} label="Donors" />
        <StatCell
          value={needs.inCashRaised}
          suffix={`/ ${needs.inCashGoal}`}
          label="In cash donations"
          className="sm:border-l sm:border-border-default-100"
        />
        {showInKindStats ? (
          <StatCell
            value={needs.inKindRaised ?? "0"}
            suffix={`/${needs.inKindGoal ?? "0"}`}
            label="In-kind donations"
            className="sm:border-l sm:border-border-default-100"
          />
        ) : null}
      </div>

      <div className="flex items-center px-4 pt-4">
        <h2 className="font-display text-xl font-semibold leading-7 text-text-events-strong">
          Recent donations
        </h2>
      </div>

      {recent.length > 0 ? (
        <div className="flex flex-col px-4">
          {recent.map((donation) => (
            <RecentDonationRow key={donation.id} donation={donation} />
          ))}
        </div>
      ) : (
        <div className="flex h-[356px] flex-col items-center justify-center gap-2 px-4 text-center">
          <p className="text-sm font-medium leading-[22px] text-text-events-strong">
            No donations yet
          </p>
          <p className="text-xs font-normal leading-5 text-text-table-header">
            Once a donation is sent, it will appear here
          </p>
        </div>
      )}

      {recent.length > 0 && onViewMore ? (
        <div className="flex items-center justify-center border-t border-border-default-100 py-4">
          <DetailSmallButton
            className="border-transparent bg-transparent shadow-none hover:bg-transparent"
            onClick={onViewMore}
          >
            <EventIcon name="pen-fill" size={EVENT_ICON_SIZE.buttonLeading} />
            View more
            <EventIcon name="arrow-right-fill" size={EVENT_ICON_SIZE.buttonTrailing} />
          </DetailSmallButton>
        </div>
      ) : null}
    </section>
  )
}

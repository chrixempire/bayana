import { Coins } from "lucide-react"
import type { EventDetail, NeedsRecentDonation } from "../../../pages/dashboard/event-detail-types"
import { DetailCard, DetailChip, DetailFieldLabel } from "./detail-primitives"

function AboutCard({ about }: { about: EventDetail["about"] }) {
  return (
    <DetailCard title={about.label}>
      <div className="flex flex-col gap-1.5">
        <DetailFieldLabel>Description</DetailFieldLabel>
        <p className="text-sm font-[510] leading-[22px] text-text-events-strong">
          {about.description}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <DetailFieldLabel>Category</DetailFieldLabel>
        <div className="flex flex-wrap gap-1.5">
          {about.categories.map((category) => (
            <DetailChip key={category}>{category}</DetailChip>
          ))}
        </div>
      </div>
    </DetailCard>
  )
}

function RecentDonationRow({ donation }: { donation: NeedsRecentDonation }) {
  return (
    <div className="flex items-center gap-3 border-b border-border-default-100 py-3.5 last:border-b-0">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e7f7ed] text-[#36b55c]">
        <Coins className="size-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-sm font-[510] leading-[22px] text-text-events-strong">
          {donation.donor} donated
        </p>
        <p className="text-xs leading-5 text-text-table-header">{donation.timeAgo}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end">
        <span className="text-sm font-semibold leading-[22px] text-[#36b55c]">{donation.amount}</span>
        <span className="text-xs leading-5 text-text-table-header">{donation.left}</span>
      </div>
    </div>
  )
}

export function NeedsOverviewTab({
  event,
  onViewMore,
}: {
  event: EventDetail
  onViewMore?: () => void
}) {
  const needs = event.needs
  const recent = needs?.recentDonations ?? []

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <div className="w-full xl:w-[360px] xl:shrink-0">
        <AboutCard about={event.about} />
      </div>

      <div className="min-w-0 flex-1">
        <DetailCard bodyClassName="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col gap-1 border-b border-border-default-100 p-4 sm:border-b-0 sm:border-r">
              <span className="font-display text-2xl font-semibold leading-8 text-text-events-strong">
                {needs?.donorsCount ?? 0}
              </span>
              <span className="text-sm leading-[22px] text-text-table-header">Donors</span>
            </div>
            <div className="flex flex-col gap-1 p-4">
              <span className="font-display text-2xl font-semibold leading-8 text-text-events-strong">
                {needs?.inCashRaised ?? "₦0"}
                <span className="text-sm font-normal text-text-table-header">
                  {" "}
                  / {needs?.inCashGoal ?? "0"}
                </span>
              </span>
              <span className="text-sm leading-[22px] text-text-table-header">In cash donations</span>
            </div>
          </div>

          <div className="border-t border-border-default-100 p-4">
            <h3 className="mb-1 font-display text-lg font-semibold leading-7 text-text-events-strong">
              Recent donations
            </h3>
            {recent.length > 0 ? (
              <>
                <div className="flex flex-col">
                  {recent.map((donation) => (
                    <RecentDonationRow key={donation.id} donation={donation} />
                  ))}
                </div>
                {onViewMore ? (
                  <div className="flex justify-center pt-3">
                    <button
                      type="button"
                      onClick={onViewMore}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-[510] leading-[22px] text-text-events-strong transition-colors hover:text-text-nav-tab-active"
                    >
                      View more →
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 py-24 text-center">
                <p className="text-sm font-[510] leading-[22px] text-text-events-strong">
                  No donations yet
                </p>
                <p className="text-xs leading-5 text-text-table-header">
                  Once a donation is sent, it will appear here
                </p>
              </div>
            )}
          </div>
        </DetailCard>
      </div>
    </div>
  )
}

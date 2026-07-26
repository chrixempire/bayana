import type { EventDetail } from "../../../pages/dashboard/event-detail-types"
import { DetailCard, DetailChip, DetailFieldLabel } from "./detail-primitives"
import { NeedsDonationsCard } from "./NeedsDonationsCard"

function AboutCard({ about }: { about: EventDetail["about"] }) {
  return (
    <DetailCard title={about.label}>
      <div className="flex flex-col gap-1.5">
        <DetailFieldLabel>Description</DetailFieldLabel>
        <p className="text-sm font-medium leading-[22px] text-text-events-strong">
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

function hasInKindDonations(event: EventDetail) {
  const donationType = event.meta.find((row) => row.id === "donation-type")?.value ?? ""
  return donationType.toLowerCase().includes("in-kind")
}

export function NeedsOverviewTab({
  event,
  onViewMore,
}: {
  event: EventDetail
  onViewMore?: () => void
}) {
  const needs = event.needs

  if (!needs) return null

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <div className="w-full xl:w-[400px] xl:shrink-0">
        <AboutCard about={event.about} />
      </div>

      <div className="min-w-0 flex-1">
        <NeedsDonationsCard
          needs={needs}
          showInKindStats={hasInKindDonations(event)}
          onViewMore={onViewMore}
        />
      </div>
    </div>
  )
}

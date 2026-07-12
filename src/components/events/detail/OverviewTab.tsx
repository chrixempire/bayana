import { PenLine } from "lucide-react"
import type { EventDetail } from "../../../pages/dashboard/event-detail-types"
import {
  DetailCard,
  DetailChip,
  DetailFieldLabel,
  DetailSmallButton,
} from "./detail-primitives"
import { EventCertificate } from "./EventCertificate"
import { EventStatsCard } from "./EventStatsCard"

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

      <div className="flex flex-col gap-1.5">
        <DetailFieldLabel>Requirements</DetailFieldLabel>
        <ul className="list-disc pl-[21px] text-sm font-[510] leading-[22px] text-text-events-strong">
          {about.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-1.5">
        <DetailFieldLabel>Skills needed</DetailFieldLabel>
        <div className="flex flex-wrap gap-1.5">
          {about.skills.map((skill) => (
            <DetailChip key={skill}>{skill}</DetailChip>
          ))}
        </div>
      </div>
    </DetailCard>
  )
}

export function OverviewTab({
  event,
  onProvideSignature,
  onViewMoreSessions,
  onViewAttendance,
}: {
  event: EventDetail
  onProvideSignature?: () => void
  onViewMoreSessions?: () => void
  onViewAttendance?: () => void
}) {
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <AboutCard about={event.about} />

        <DetailCard
          title="Cause certificate"
          action={
            <DetailSmallButton onClick={onProvideSignature}>
              <PenLine className="size-3.5" />
              Provide signature
            </DetailSmallButton>
          }
        >
          <EventCertificate certificate={event.certificate} />
        </DetailCard>
      </div>

      <div className="w-full xl:w-[400px] xl:shrink-0">
        <EventStatsCard
          stats={event.stats}
          sessions={event.sessions}
          onViewMore={onViewMoreSessions}
          onSessionAction={onViewAttendance}
        />
      </div>
    </div>
  )
}

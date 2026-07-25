import { Calendar, ChevronDown, Mail, Phone, Zap } from "lucide-react"
import { Button } from "../../ui/button"
import { Modal } from "../../ui/modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import type { Volunteer } from "../../../pages/dashboard/event-detail-types"
import { PersonAvatar } from "./PersonAvatar"
import { NewVolunteerBadge, TableSkillTag } from "./detail-primitives"
import { VolunteerStatusTag } from "./VolunteerStatusTag"

function SkillChip({ label }: { label: string }) {
  return <TableSkillTag>{label}</TableSkillTag>
}

function FieldLabel({ children }: { children: string }) {
  return <p className="text-xs font-normal leading-5 text-text-table-header">{children}</p>
}

function PanelCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border-default-100 bg-bg-canvas">
      <div className="border-b border-border-default-100 px-4 py-3">
        <h3 className="text-sm font-semibold leading-[22px] text-text-events-strong">{title}</h3>
      </div>
      <div className="flex flex-col gap-4 p-4">{children}</div>
    </section>
  )
}

export function VolunteerDetailsModal({
  volunteer,
  onClose,
  onAccept,
  onDecline,
  onWaitlist,
  onRemove,
}: {
  volunteer: Volunteer | null
  onClose: () => void
  onAccept: (volunteer: Volunteer) => void
  onDecline: (volunteer: Volunteer) => void
  onWaitlist: (volunteer: Volunteer) => void
  onRemove: (volunteer: Volunteer) => void
}) {
  if (!volunteer) return null

  return (
    <Modal
      open={Boolean(volunteer)}
      onClose={onClose}
      size="full"
      title="Volunteer details"
      flushBody
      className="max-h-[92vh]"
      footer={
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="neutral" size="sm" className="rounded-[10px]" rightIcon={<ChevronDown className="size-4" />}>
                More actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="min-w-[12rem]">
              <DropdownMenuItem onSelect={() => onWaitlist(volunteer)}>Add to waitlist</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDecline(volunteer)}>Decline request</DropdownMenuItem>
              <DropdownMenuItem
                className="text-text-negative focus:bg-bg-negative-soft"
                onSelect={() => onRemove(volunteer)}
              >
                Remove volunteer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="primary"
            size="sm"
            className="rounded-[10px]"
            onClick={() => onAccept(volunteer)}
          >
            Accept request
          </Button>
        </>
      }
    >
      <div className="flex flex-col md:flex-row">
        {/* Profile panel */}
        <div className="flex flex-col gap-6 border-b border-border-default-100 p-6 md:w-[320px] md:shrink-0 md:border-b-0 md:border-r">
          <div className="flex flex-col gap-3">
            <PersonAvatar name={volunteer.name} tone={volunteer.avatarTone} imageUrl={volunteer.avatarImage || undefined} size={56} />
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-semibold leading-6 text-text-events-strong">{volunteer.name}</p>
                {volunteer.isNew ? <NewVolunteerBadge /> : null}
              </div>
              <p className="text-sm leading-[22px] text-text-table-header">@{volunteer.handle}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-text-table-header">
                <Mail className="size-4" />
                <span className="text-xs font-normal leading-5">Email</span>
              </span>
              <p className="text-sm font-[510] leading-[22px] text-text-events-strong">{volunteer.email}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-text-table-header">
                <Phone className="size-4" />
                <span className="text-xs font-normal leading-5">Phone number</span>
              </span>
              <p className="text-sm font-[510] leading-[22px] text-text-events-strong">{volunteer.phone}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-normal leading-5 text-text-table-header">Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {volunteer.skills.map((skill) => (
                  <SkillChip key={skill} label={skill} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-text-table-header">
                <Calendar className="size-4" />
                <span className="text-xs font-normal leading-5">Date joined</span>
              </span>
              <p className="text-sm font-[510] leading-[22px] text-text-events-strong">{volunteer.dateJoined}</p>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="flex flex-1 flex-col gap-4 bg-bg-on-canvas p-6">
          <PanelCard title="Application details">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Skill capacity</FieldLabel>
              <div className="flex flex-wrap gap-1.5">
                {volunteer.skills.map((skill) => (
                  <SkillChip key={skill} label={skill} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Reason for joining</FieldLabel>
              <p className="text-sm font-[510] leading-[22px] text-text-events-strong">
                {volunteer.reason ?? "--"}
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Status</FieldLabel>
              <VolunteerStatusTag status={volunteer.status} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Date applied</FieldLabel>
              <p className="text-sm font-[510] leading-[22px] text-text-events-strong">
                {volunteer.dateApplied}
              </p>
            </div>
          </PanelCard>

          <PanelCard title="Activity">
            <div className="flex items-start gap-2">
              <Zap className="mt-0.5 size-4 shrink-0 fill-bg-accent text-bg-accent" />
              <div className="flex flex-col">
                <p className="text-sm font-[510] leading-[22px] text-text-events-strong">
                  Requested to join cause
                </p>
                <p className="text-xs leading-5 text-text-table-header">{volunteer.dateApplied}</p>
              </div>
            </div>
          </PanelCard>
        </div>
      </div>
    </Modal>
  )
}

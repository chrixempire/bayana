import { useState, type ReactNode } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { Button } from "../../ui/button"
import { cn } from "../../../lib/utils"
import type { EventDetail, EventDetailMetaRow } from "../../../pages/dashboard/event-detail-types"
import { EventCollabBadge } from "../icons/EventChipBadge"
import { EventIcon, type EventIconName } from "../icons/EventIcon"
import { EVENT_ICON_SIZE } from "../icons/event-icon-sizes"
import { EventMetaIcon } from "../icons/EventMetaIcon"
import { EventStatusBadge } from "./EventStatusBadge"
import { CollaborationRequestBanner } from "./CollaborationRequestBanner"

export type CollaborationState = "new-request" | "pending" | "accepted"

function MetaRow({ row }: { row: EventDetailMetaRow }) {
  const isPrivate = row.icon === "visibility" && row.value.toLowerCase() === "private"

  return (
    <div className="flex items-center gap-1">
      <div className="flex w-[200px] shrink-0 items-center gap-1 text-text-table-header">
        <EventMetaIcon icon={row.icon} isPrivate={isPrivate} />
        <span className="truncate text-sm font-normal leading-[22px] tracking-[-0.1px]">
          {row.label}
        </span>
      </div>
      <div className="flex min-w-0 items-center gap-1.5">
        {row.avatarInitial ? (
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full border-[0.5px] border-border-input-active bg-bg-nav-tab-active text-[10px] font-semibold text-text-nav-tab-active">
            {row.avatarInitial}
          </span>
        ) : null}
        <span className="truncate text-sm font-[510] leading-[22px] text-text-events-strong">
          {row.value}
        </span>
      </div>
    </div>
  )
}

function EventCover({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0)
  const dotCount = Math.max(images.length, 3)
  const safeActive = Math.min(active, Math.max(0, images.length - 1))
  const current = images[safeActive]

  return (
    <div className="relative aspect-[566/306] w-full overflow-hidden rounded-2xl lg:max-w-[566px]">
      {current ? (
        <img src={current} alt={title} className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#e6d8ff] via-[#f2e7ff] to-[#ffe4cf]">
          <EventIcon
            name="pic-fill"
            size={EVENT_ICON_SIZE.coverPlaceholder}
            inverted
            className="opacity-70"
          />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
        {Array.from({ length: dotCount }).map((_, index) => {
          const selectable = index < images.length
          return (
            <button
              key={index}
              type="button"
              disabled={!selectable}
              onClick={() => selectable && setActive(index)}
              className={cn(
                "size-1.5 rounded-full transition-colors",
                index === safeActive && images.length > 0 ? "bg-white" : "bg-white/50",
                selectable ? "cursor-pointer" : "cursor-default",
              )}
              aria-label={`Show image ${index + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}

const HEADER_BUTTON = "h-8 min-h-8 gap-1.5 rounded-[10px] px-3 text-sm"

const HEADER_BUTTON_TRAILING_ICON = (
  <EventIcon name="add-circle-fill" size={EVENT_ICON_SIZE.buttonTrailing} />
)

function menuIcon(name: EventIconName, destructive = false) {
  return (
    <EventIcon
      name={name}
      size={EVENT_ICON_SIZE.dropdownItem}
      className={destructive ? "text-icon-negative" : undefined}
    />
  )
}

export function EventDetailHeader({
  event,
  onPostUpdate,
  onIssueCertificate,
  onEdit,
  onViewVolunteers,
  onShare,
  onDelete,
  onViewAttendance,
  onCopyAccessCode,
  onSubmitImpactReport,
  onCloseEvent,
  collaboration,
  collaborationInviter = "Acme Incorporation",
  onAcceptCollaboration,
  onRejectCollaboration,
  onCancelCollaboration,
}: {
  event: EventDetail
  onPostUpdate?: () => void
  onIssueCertificate?: () => void
  onEdit?: () => void
  onViewVolunteers?: () => void
  onShare?: () => void
  onDelete?: () => void
  onViewAttendance?: () => void
  onCopyAccessCode?: () => void
  onSubmitImpactReport?: () => void
  onCloseEvent?: () => void
  collaboration?: CollaborationState
  collaborationInviter?: string
  onAcceptCollaboration?: () => void
  onRejectCollaboration?: () => void
  onCancelCollaboration?: () => void
}) {
  const isNeeds = event.kind === "needs"
  const isFullyFulfilled = event.status === "fully-fulfilled"
  const isCompleted = event.status === "completed"
  const isPrivate =
    event.meta.find((row) => row.id === "visibility")?.value.toLowerCase() === "private"

  type MenuItem = {
    label: string
    icon?: EventIconName
    iconNode?: ReactNode
    onClick?: () => void
    destructive?: boolean
  }

  const viewVolunteers: MenuItem = {
    label: "View volunteers",
    icon: "group-fill",
    onClick: onViewVolunteers,
  }
  const shareLink: MenuItem = {
    label: "Get shareable link",
    icon: "share-2-fill",
    onClick: onShare,
  }
  const deleteEvent: MenuItem = {
    label: "Delete event",
    icon: "delete-fill",
    onClick: onDelete,
    destructive: true,
  }
  const closeEvent: MenuItem = {
    label: "Close event",
    icon: "close-circle-fill",
    onClick: onCloseEvent,
  }
  const viewAttendance: MenuItem = {
    label: "View attendance",
    icon: "eye-fill",
    onClick: onViewAttendance,
  }

  const menuItems: MenuItem[] = isNeeds
    ? [shareLink, closeEvent, deleteEvent]
    : isCompleted
      ? [
          { label: "Submit impact report", icon: "file-fill", onClick: onSubmitImpactReport },
          viewVolunteers,
          viewAttendance,
        ]
      : event.status === "active"
        ? [viewAttendance, viewVolunteers, shareLink, deleteEvent]
        : [
            ...(isPrivate
              ? [{ label: "Copy access code", icon: "seal-fill", onClick: onCopyAccessCode } as MenuItem]
              : []),
            viewVolunteers,
            shareLink,
            deleteEvent,
          ]

  const cancelRequest: MenuItem = {
    label: "Cancel request",
    iconNode: menuIcon("close-circle-fill"),
    onClick: onCancelCollaboration,
  }
  const resolvedMenuItems = collaboration === "pending" ? [cancelRequest] : menuItems

  const collabBadges =
    collaboration === "new-request" ? (
      <EventCollabBadge variant="new-request" />
    ) : collaboration === "pending" ? (
      <>
        <EventCollabBadge variant="organizer" />
        <EventCollabBadge variant="pending" />
      </>
    ) : collaboration === "accepted" ? (
      <EventCollabBadge variant="organizer" />
    ) : null

  if (isNeeds && isFullyFulfilled) {
    return (
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-6 lg:max-w-[434px]">
          <div className="flex flex-col gap-3">
            <EventStatusBadge status={event.status} label={event.statusLabel} />
            <h1 className="font-display text-2xl font-semibold leading-8 tracking-[-0.1px] text-text-events-strong">
              {event.title}
            </h1>
          </div>
          <dl className="flex flex-col gap-2">
            {event.meta.map((row) => (
              <MetaRow key={row.id} row={row} />
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              className={HEADER_BUTTON}
              leftIcon={
                <EventIcon
                  name="file-fill"
                  size={EVENT_ICON_SIZE.buttonLeading}
                  inverted
                />
              }
              onClick={onSubmitImpactReport}
            >
              Submit impact report
            </Button>
          </div>
        </div>
        <div className="w-full lg:w-[566px] lg:shrink-0">
          <EventCover images={event.coverImages} title={event.title} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 flex-col gap-6 lg:max-w-[434px]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {collabBadges}
            <EventStatusBadge status={event.status} label={event.statusLabel} />
          </div>
          <h1 className="font-display text-2xl font-semibold leading-8 tracking-[-0.1px] text-text-events-strong">
            {event.title}
          </h1>
        </div>

        <dl className="flex flex-col gap-2">
          {event.meta.map((row) => (
            <MetaRow key={row.id} row={row} />
          ))}
        </dl>

        {collaboration === "new-request" ? (
          <CollaborationRequestBanner
            inviterName={collaborationInviter}
            onAccept={onAcceptCollaboration}
            onReject={onRejectCollaboration}
          />
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {isCompleted && !isNeeds ? (
              <Button
                variant="primary"
                className={HEADER_BUTTON}
                leftIcon={
                  <EventIcon
                    name="award-fill"
                    size={EVENT_ICON_SIZE.buttonLeading}
                    inverted
                  />
                }
                onClick={onIssueCertificate}
              >
                Issue certificate
              </Button>
            ) : (
              <Button
                variant="primary"
                className={HEADER_BUTTON}
                leftIcon={<EventIcon name="horn-fill" size={EVENT_ICON_SIZE.buttonLeading} />}
                rightIcon={HEADER_BUTTON_TRAILING_ICON}
                onClick={onPostUpdate}
              >
                Post update
              </Button>
            )}
            <Button
              variant="neutral"
              className={HEADER_BUTTON}
              leftIcon={<EventIcon name="pencil-fill" size={EVENT_ICON_SIZE.buttonLeading} />}
              rightIcon={HEADER_BUTTON_TRAILING_ICON}
              onClick={onEdit}
            >
              Edit event
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="neutral"
                  className="h-8 min-h-8 w-9 rounded-[10px] px-0"
                  aria-label="More actions"
                >
                  <EventIcon name="more-fill" size={EVENT_ICON_SIZE.buttonLeading} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[11rem]">
                {resolvedMenuItems.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    className={cn(item.destructive && "text-text-negative focus:bg-bg-negative-soft")}
                    onSelect={() => item.onClick?.()}
                  >
                    {item.iconNode ?? (item.icon ? menuIcon(item.icon, item.destructive) : null)}
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="w-full lg:w-[566px] lg:shrink-0">
        <EventCover images={event.coverImages} title={event.title} />
      </div>
    </div>
  )
}

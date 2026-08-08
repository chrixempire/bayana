import { Fragment, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { EventIcon } from "../../components/events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../../components/events/icons/event-icon-sizes"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"
import { dashboardDetailContentClassName } from "../../lib/dashboard-layout"
import { cn } from "../../lib/utils"
import { DASHBOARD_TAB_PATHS } from "../../lib/dashboard-paths"
import { parseEventDetailTab } from "../../lib/event-detail-paths"
import { EventDetailHeader } from "../../components/events/detail/EventDetailHeader"
import { EventDetailTabs } from "../../components/events/detail/EventDetailTabs"
import type { EventDetailTab } from "../../components/events/detail/EventDetailTabs"
import { OverviewTab } from "../../components/events/detail/OverviewTab"
import { NeedsOverviewTab } from "../../components/events/detail/NeedsOverviewTab"
import { NeedsInKindDonationsTab } from "../../components/events/detail/NeedsInKindDonationsTab"
import { DonorDetailsModal } from "../../components/events/detail/DonorDetailsModal"
import type { InKindDonationRow } from "./event-detail-types"
import { VolunteersTab } from "../../components/events/detail/VolunteersTab"
import { DonationsTab } from "../../components/events/detail/DonationsTab"
import { ReviewsTab } from "../../components/events/detail/ReviewsTab"
import { UpdatesTab } from "../../components/events/detail/UpdatesTab"
import { ShareEventModal } from "../../components/events/detail/ShareEventModal"
import { EditEventModal } from "../../components/events/detail/EditEventModal"
import { AttendanceModal } from "../../components/events/detail/AttendanceModal"
import { ProvideSignatureModal } from "../../components/events/detail/ProvideSignatureModal"
import { PostUpdateModal } from "../../components/events/detail/PostUpdateModal"
import { IssueCertificateModal } from "../../components/events/detail/IssueCertificateModal"
import { AcceptCollaborationModal } from "../../components/events/detail/AcceptCollaborationModal"
import type { CollaborationState } from "../../components/events/detail/EventDetailHeader"
import { Modal } from "../../components/ui/modal"
import { ConfirmModal } from "../../components/ui/confirm-modal"
import { toast } from "../../hooks/use-toast"
import type { EventEditPatch } from "../../components/events/detail/EditEventModal"
import { getEventDetail } from "./event-detail-scenarios"
import { buildNeedsEventDetail } from "./event-detail-needs"
import type { ApiCause } from "../../lib/api/cause-types"
import {
  buildCauseUpdateFormData,
  deleteOrganisationCause,
  getOrganisationCause,
  updateOrganisationCause,
} from "../../lib/api/causes"
import { ApiError } from "../../lib/api/types"
import { mapCauseToEventDetail } from "../../lib/map-cause-to-event-detail"
import { Skeleton } from "../../components/ui/skeleton"
import { Button } from "../../components/ui/button"
import type {
  EventDetail,
  EventDetailStatus,
  EventDetailTabId,
  SessionTiming,
  UpdatesData,
  VolunteersData,
} from "./event-detail-types"

const STATUS_LABELS: Record<EventDetailStatus, string> = {
  active: "Active",
  upcoming: "Upcoming",
  completed: "Completed",
  "fully-fulfilled": "Fully fulfilled",
  draft: "Draft",
}

const MEET_LINK = "https://meet.google.com/abc-defg-hij"

/**
 * Optional ?status / ?visibility / ?type overrides so every header/kind variant is
 * viewable, and so sessions reflect the right timing badges + virtual meet links.
 */
function applyVariant(
  event: EventDetail,
  opts: { status: string | null; visibility: string | null; type: string | null },
): EventDetail {
  let next = event
  if (opts.status && opts.status in STATUS_LABELS) {
    const s = opts.status as EventDetailStatus
    next = { ...next, status: s, statusLabel: STATUS_LABELS[s] }
  }

  const isVirtual =
    opts.type === "virtual" || next.meta.find((row) => row.id === "type")?.value === "Virtual"

  next = {
    ...next,
    meta: next.meta.map((row) => {
      if (row.id === "visibility" && opts.visibility) {
        return { ...row, value: opts.visibility === "private" ? "Private" : "Public" }
      }
      if (row.id === "type" && opts.type) {
        return { ...row, value: opts.type === "virtual" ? "Virtual" : "In person" }
      }
      return row
    }),
  }

  const status = next.status
  next = {
    ...next,
    sessions: next.sessions.map((session, index) => {
      let timing: SessionTiming | undefined
      let daysLabel: string | undefined
      if (status === "completed") {
        timing = "done"
      } else if (status === "upcoming") {
        if (index === 0) {
          timing = "upcoming"
          daysLabel = "4 Days Time"
        }
      } else if (index === 0 && session.happening) {
        timing = "happening"
      }
      return {
        ...session,
        timing,
        daysLabel,
        meetLink: isVirtual ? MEET_LINK : undefined,
      }
    }),
  }

  return next
}

const TABS: EventDetailTab[] = [
  { id: "home", label: "Home" },
  { id: "updates", label: "Updates" },
  { id: "volunteers", label: "Volunteers" },
  { id: "donations", label: "Donations" },
  { id: "reviews", label: "Reviews" },
]

const NEEDS_TABS: EventDetailTab[] = [
  { id: "home", label: "Home" },
  { id: "updates", label: "Updates" },
  { id: "donations", label: "In-cash donations" },
  { id: "in-kind", label: "In-kind donations" },
]

const NEEDS_STATUSES: EventDetailStatus[] = [
  "upcoming",
  "active",
  "completed",
  "fully-fulfilled",
  "draft",
]

const COLLAB_STATES: CollaborationState[] = ["new-request", "pending", "accepted"]

function parseCollab(value: string | null): CollaborationState | null {
  return COLLAB_STATES.includes(value as CollaborationState) ? (value as CollaborationState) : null
}

/** Builds the seed event, branching to the needs-kind shape and collaboration overlay. */
function seedEvent(
  eventId: string | undefined,
  opts: {
    status: string | null
    visibility: string | null
    type: string | null
    kind: string | null
    collab: string | null
  },
): EventDetail {
  const base = getEventDetail(eventId)
  let event: EventDetail
  if (opts.kind === "needs") {
    const status = NEEDS_STATUSES.includes(opts.status as EventDetailStatus)
      ? (opts.status as EventDetailStatus)
      : "upcoming"
    event = buildNeedsEventDetail(base, status)
  } else {
    event = applyVariant(base, opts)
  }

  const collab = parseCollab(opts.collab)
  if (collab) {
    event = {
      ...event,
      status: "upcoming",
      statusLabel: "Upcoming",
      breadcrumb: ["Events", "Collaborations", event.title],
    }
    if (collab === "new-request") {
      event = {
        ...event,
        meta: [
          {
            id: "organizer",
            icon: "contact",
            label: "Organizer",
            value: "Acme Incorporation",
          },
          ...event.meta.filter((row) => row.id !== "contact" && row.id !== "organizer"),
        ],
      }
    } else if (collab === "pending" || collab === "accepted") {
      // Organizer view: swap the Contact row for a Collaborator row at the top.
      event = {
        ...event,
        meta: [
          {
            id: "collaborator",
            icon: "collaborator",
            label: "Collaborator",
            value: "Acme Incorporation 2",
          },
          ...event.meta.filter((row) => row.id !== "contact" && row.id !== "collaborator"),
        ],
      }
    }
  }
  return event
}

function DetailPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 py-6">
      <Skeleton className="h-4 w-48" />
      <div className="flex flex-col gap-6 lg:flex-row">
        <Skeleton className="aspect-[566/306] w-full rounded-2xl lg:max-w-[566px]" />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-24" />
          <div className="flex flex-col gap-3 pt-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-full max-w-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Breadcrumb({ items, onHome }: { items: string[]; onHome: () => void }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs font-medium leading-5 text-text-table-header"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <Fragment key={`${item}-${index}`}>
            {index === 0 ? (
              <button
                type="button"
                onClick={onHome}
                className="cursor-pointer whitespace-nowrap transition-colors hover:text-text-events-strong"
              >
                {item}
              </button>
            ) : (
              <span className={isLast ? "min-w-0 truncate" : "whitespace-nowrap"}>{item}</span>
            )}
            {isLast ? null : (
              <EventIcon name="arrow-right-line" size={EVENT_ICON_SIZE.buttonLeading} />
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}

export function EventDetailPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const variantOpts = {
    status: searchParams.get("status"),
    visibility: searchParams.get("visibility"),
    type: searchParams.get("type"),
    kind: searchParams.get("kind"),
    collab: searchParams.get("collab"),
  }
  const useMockDetail = variantOpts.kind === "needs" || Boolean(variantOpts.collab)
  const key = `${eventId}|${variantOpts.status}|${variantOpts.visibility}|${variantOpts.type}|${variantOpts.kind}|${variantOpts.collab}`
  const [seedKey, setSeedKey] = useState(key)
  const [event, setEvent] = useState<EventDetail | null>(() =>
    useMockDetail ? seedEvent(eventId, variantOpts) : null,
  )
  const [apiCause, setApiCause] = useState<ApiCause | null>(null)
  const [loading, setLoading] = useState(!useMockDetail)
  const [loadError, setLoadError] = useState<string | null>(null)
  const activeTab = parseEventDetailTab(searchParams.get("tab"))
  const isNeeds = event?.kind === "needs"

  const [collabState, setCollabState] = useState<CollaborationState | null>(
    parseCollab(variantOpts.collab),
  )

  useEffect(() => {
    if (useMockDetail || !eventId) return

    let cancelled = false

    void (async () => {
      setLoading(true)
      setLoadError(null)

      try {
        const response = await getOrganisationCause(eventId)
        if (cancelled) return

        const mapped = mapCauseToEventDetail(response.data)
        if (!mapped) {
          setLoadError("This cause could not be loaded.")
          setEvent(null)
          setApiCause(null)
          return
        }

        setApiCause(response.data)
        setEvent(mapped)
      } catch (error) {
        if (cancelled) return

        setEvent(null)
        setApiCause(null)
        setLoadError(error instanceof ApiError ? error.message : "Unable to load this cause.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [eventId, useMockDetail])

  // Re-seed the mock working copy when the event or any variant override changes.
  if (useMockDetail && seedKey !== key) {
    setSeedKey(key)
    setEvent(seedEvent(eventId, variantOpts))
    setCollabState(parseCollab(variantOpts.collab))
  }

  const applyEdit = async (patch: EventEditPatch) => {
    if (!useMockDetail && eventId && apiCause) {
      try {
        const response = await updateOrganisationCause(
          eventId,
          buildCauseUpdateFormData(apiCause, {
            title: patch.title,
            description: patch.description,
            requirements: patch.requirements,
          }),
        )
        const mapped = mapCauseToEventDetail(response.data) ?? mapCauseToEventDetail({
          ...apiCause,
          title: patch.title,
          description: patch.description,
          requirements: patch.requirements.join("\n"),
        })
        if (mapped) {
          setApiCause(response.data)
          setEvent({
            ...mapped,
            coverImages: patch.coverImages.length ? patch.coverImages : mapped.coverImages,
            meta: mapped.meta.map((row) =>
              row.id === "contact" ? { ...row, value: patch.contact } : row,
            ),
          })
        }
        toast({ variant: "success", title: "Cause updated" })
        return
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Unable to update cause",
          description: error instanceof ApiError ? error.message : "Please try again.",
        })
        throw error
      }
    }

    setEvent((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        title: patch.title,
        breadcrumb: [...prev.breadcrumb.slice(0, -1), patch.title],
        coverImages: patch.coverImages,
        about: {
          ...prev.about,
          description: patch.description,
          requirements: patch.requirements,
        },
        meta: prev.meta.map((row) =>
          row.id === "contact" ? { ...row, value: patch.contact } : row,
        ),
      }
    })
    toast({ variant: "success", title: "Event updated" })
  }

  const setVolunteers = (volunteers: VolunteersData) =>
    setEvent((prev) => (prev ? { ...prev, volunteers } : prev))
  const setUpdates = (updates: UpdatesData) =>
    setEvent((prev) => (prev ? { ...prev, updates } : prev))

  const [editOpen, setEditOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [closeOpen, setCloseOpen] = useState(false)
  const [acceptCollabOpen, setAcceptCollabOpen] = useState(false)
  const [rejectCollabOpen, setRejectCollabOpen] = useState(false)
  const [cancelCollabOpen, setCancelCollabOpen] = useState(false)
  const [donorDetail, setDonorDetail] = useState<InKindDonationRow | null>(null)

  const confirmReceipt = (row: InKindDonationRow) => {
    setDonorDetail(null)
    toast({ variant: "success", title: `Receipt confirmed for ${row.donor}` })
  }
  const messageDonor = (row: InKindDonationRow) =>
    toast({ title: "Coming soon", description: `Messaging ${row.donor} will be available after API integration.` })
  const [signatureOpen, setSignatureOpen] = useState(false)
  const [sessionsOpen, setSessionsOpen] = useState(false)
  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const [postUpdateOpen, setPostUpdateOpen] = useState(false)
  const [issueCertOpen, setIssueCertOpen] = useState(false)

  const setActiveTab = (tab: EventDetailTabId) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (tab === "home") next.delete("tab")
        else next.set("tab", tab)
        return next
      },
      { replace: true },
    )
  }

  const goToEvents = () => navigate(DASHBOARD_TAB_PATHS.events)
  const shareUrl = useMemo(() => {
    if (!event) return ""
    if (typeof window === "undefined") return `app.bayana.com/${event.id}`
    return `${window.location.origin}/events/${event.id}`
  }, [event])

  if (loading) {
    return (
      <DashboardLayout activeTab="events">
        <div className={dashboardDetailContentClassName}>
          <DetailPageSkeleton />
        </div>
      </DashboardLayout>
    )
  }

  if (loadError || !event) {
    return (
      <DashboardLayout activeTab="events">
        <div className={cn(dashboardDetailContentClassName, "flex flex-col gap-4 py-10")}>
          <p className="text-sm font-medium text-text-events-strong">
            {loadError ?? "This cause could not be found."}
          </p>
          <Button type="button" variant="neutral" className="w-fit" onClick={goToEvents}>
            Back to events
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const renderTab = () => {
    if (isNeeds) {
      switch (activeTab) {
        case "updates":
          return <UpdatesTab data={event.updates} onChange={setUpdates} />
        case "donations":
          return <DonationsTab data={event.donations} />
        case "in-kind":
          return event.inKind ? (
            <NeedsInKindDonationsTab
              data={event.inKind}
              onViewDetails={setDonorDetail}
              onConfirmReceipt={confirmReceipt}
              onMessageDonor={messageDonor}
            />
          ) : null
        default:
          return <NeedsOverviewTab event={event} onViewMore={() => setActiveTab("donations")} />
      }
    }

    switch (activeTab) {
      case "updates":
        return <UpdatesTab data={event.updates} onChange={setUpdates} />
      case "volunteers":
        return <VolunteersTab data={event.volunteers} onChange={setVolunteers} />
      case "donations":
        return <DonationsTab data={event.donations} />
      case "reviews":
        return <ReviewsTab data={event.reviews} />
      default:
        return (
          <OverviewTab
            event={event}
            onProvideSignature={() => setSignatureOpen(true)}
            onViewMoreSessions={() => setSessionsOpen(true)}
            onViewAttendance={() => setAttendanceOpen(true)}
          />
        )
    }
  }

  return (
    <DashboardLayout activeTab="events">
      <div className="flex flex-col">
        <div className="bg-bg-detail-header">
          <div className={cn(dashboardDetailContentClassName, "flex flex-col gap-4 pt-4 pb-6")}>
            <Breadcrumb items={event.breadcrumb} onHome={goToEvents} />
            <EventDetailHeader
              event={event}
              onPostUpdate={() => setPostUpdateOpen(true)}
              onIssueCertificate={() => setIssueCertOpen(true)}
              onEdit={() => setEditOpen(true)}
              onViewVolunteers={() => setActiveTab("volunteers")}
              onShare={() => setShareOpen(true)}
              onDelete={() => setDeleteOpen(true)}
              onViewAttendance={() => setAttendanceOpen(true)}
              onCopyAccessCode={() => {
                const code = event.accessCode?.trim()
                if (!code) {
                  toast({
                    title: "No access code",
                    description: "This cause does not have an access code.",
                  })
                  return
                }
                void navigator.clipboard?.writeText(code)
                toast({ variant: "success", title: "Access code copied" })
              }}
              onCloseEvent={() => setCloseOpen(true)}
              onSubmitImpactReport={() =>
                toast({ title: "Coming soon", description: "Impact reports arrive after API integration." })
              }
              collaboration={collabState ?? undefined}
              onAcceptCollaboration={() => setAcceptCollabOpen(true)}
              onRejectCollaboration={() => setRejectCollabOpen(true)}
              onCancelCollaboration={() => setCancelCollabOpen(true)}
            />
          </div>
        </div>

        <div className="border-b border-border-default-100 bg-bg-canvas">
          <div className={dashboardDetailContentClassName}>
            <EventDetailTabs
              tabs={isNeeds ? NEEDS_TABS : TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>

        <div className={cn(dashboardDetailContentClassName, "py-6")}>
          {renderTab()}
        </div>
      </div>

      <EditEventModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        event={event}
        onSave={applyEdit}
      />

      <AttendanceModal
        open={attendanceOpen}
        onClose={() => setAttendanceOpen(false)}
        volunteers={event.volunteers}
      />

      <IssueCertificateModal
        open={issueCertOpen}
        onClose={() => setIssueCertOpen(false)}
        volunteers={event.volunteers.rows}
      />

      <ShareEventModal open={shareOpen} onClose={() => setShareOpen(false)} shareUrl={shareUrl} />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete event"
        description="This event and its data will be permanently removed and any associated donations will be refunded. This action cannot be undone."
        confirmLabel="Delete event"
        variant="destructive"
        onConfirm={() => {
          void (async () => {
            if (!useMockDetail && eventId) {
              try {
                await deleteOrganisationCause(eventId)
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "Unable to delete cause",
                  description: error instanceof ApiError ? error.message : "Please try again.",
                })
                return
              }
            }

            toast({ variant: "success", title: "Event deleted" })
            goToEvents()
          })()
        }}
      />

      <ConfirmModal
        open={closeOpen}
        onClose={() => setCloseOpen(false)}
        title="Close event"
        description="Closing this event stops new donations. Donors will no longer be able to contribute. You can still withdraw and submit an impact report."
        confirmLabel="Close event"
        variant="destructive"
        onConfirm={() => {
          toast({ variant: "success", title: "Event closed" })
          setCloseOpen(false)
        }}
      />

      <AcceptCollaborationModal
        open={acceptCollabOpen}
        onClose={() => setAcceptCollabOpen(false)}
        onAccept={() => {
          setAcceptCollabOpen(false)
          setCollabState(null)
          toast({
            variant: "success",
            title: "Collaboration request accepted",
            description: "You are now a collaborator on this event.",
          })
        }}
      />

      <ConfirmModal
        open={rejectCollabOpen}
        onClose={() => setRejectCollabOpen(false)}
        title="Reject collaboration request"
        description="You're about to reject this collaboration request. This means that you don't want to collaborate with this organizer on this event."
        confirmLabel="Reject request"
        variant="destructive"
        onConfirm={() => {
          setRejectCollabOpen(false)
          toast({ variant: "success", title: "Collaboration request rejected" })
          goToEvents()
        }}
      />

      <ConfirmModal
        open={cancelCollabOpen}
        onClose={() => setCancelCollabOpen(false)}
        title="Cancel collaboration request"
        description="You're about to cancel this collaboration request. The organizer will no longer see your invitation to collaborate on this event."
        confirmLabel="Cancel request"
        variant="destructive"
        onConfirm={() => {
          setCancelCollabOpen(false)
          toast({ variant: "success", title: "Collaboration request cancelled" })
          goToEvents()
        }}
      />

      <DonorDetailsModal
        donation={donorDetail}
        onClose={() => setDonorDetail(null)}
        onConfirmReceipt={confirmReceipt}
        onMessage={messageDonor}
      />

      <ProvideSignatureModal
        open={signatureOpen}
        onClose={() => setSignatureOpen(false)}
        defaultName={event.meta.find((row) => row.id === "contact")?.value}
      />

      <PostUpdateModal
        open={postUpdateOpen}
        onClose={() => setPostUpdateOpen(false)}
        onPost={(body) => {
          setUpdates({
            rows: [
              {
                id:
                  typeof crypto !== "undefined" && crypto.randomUUID
                    ? crypto.randomUUID()
                    : String(Math.random()),
                author: "Acme Incorporation",
                avatarTone: "orange",
                timeAgo: "Just now",
                body,
                likes: 0,
                comments: 0,
                commentList: [],
              },
              ...event.updates.rows,
            ],
          })
          setActiveTab("updates")
        }}
      />

      <Modal
        open={sessionsOpen}
        onClose={() => setSessionsOpen(false)}
        title={`Sessions (${event.sessionsTotal})`}
        size="md"
      >
        <div className="flex flex-col">
          {event.sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-4 border-b border-border-default-100 py-3 last:border-b-0"
            >
              <div className="flex w-10 shrink-0 flex-col overflow-hidden rounded-lg shadow-button-neutral">
                <div className="flex h-3 items-center justify-center bg-bg-active-200">
                  <span className="text-[10px] font-medium leading-3 tracking-[0.5px] text-text-table-header">
                    {session.month}
                  </span>
                </div>
                <div className="flex h-7 items-center justify-center bg-bg-canvas">
                  <span className="text-xs font-semibold leading-5 text-text-events-strong">
                    {session.day}
                  </span>
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-1 text-text-table-header">
                  <EventIcon name="time-fill" size={12} className="shrink-0" />
                  <span className="text-xs leading-5">{session.time}</span>
                </div>
                <p className="truncate text-sm font-medium leading-[22px] text-text-events-strong">
                  {session.title}
                </p>
                <div className="flex items-center gap-1">
                  <EventIcon name="location-fill" size={EVENT_ICON_SIZE.meta} className="shrink-0 text-icon-negative" />
                  <span className="truncate text-xs leading-5 text-text-table-header">
                    {session.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </DashboardLayout>
  )
}

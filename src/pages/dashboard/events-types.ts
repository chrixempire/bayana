export type EventsTabId = "causes" | "needs" | "collaborations"

export type EventVisibilityType = "public" | "private" | "drafts"

export type EventLifecycleStatus = "upcoming" | "active" | "completed"

export type EventVolunteerFormat = "in-person" | "virtual"

export type EventKind = "cause" | "needs" | "collaboration"

export type EventTableRow = {
  id: string
  /** Which sub-tab (Causes / Needs / Collaborations) the row belongs to. */
  kind?: EventKind
  cause: {
    thumbnailUrl: string
    title: string
    description: string
  }
  visibility: {
    type: EventVisibilityType
    lifecycleStatus: EventLifecycleStatus | null
  }
  category: {
    tags: string[]
    extraCount: number
  }
  volunteerType: {
    type: EventVolunteerFormat | null
    detail: string | null
  }
  date: {
    range: string | null
    time: string | null
    /** ISO (YYYY-MM-DD) for filtering; null for drafts. */
    startDate?: string | null
    endDate?: string | null
  }
  volunteers: {
    current: number
    max: number
  } | null
  shareUrl: string | null
  /** Collaboration-only: the inviting/collaborating organisation. */
  collaborator?: {
    name: string
    /** Square logo tint when no image is supplied. */
    tone?: "orange" | "purple" | "blue" | "green"
    logoUrl?: string
  } | null
  /** Collaboration-only: the underlying event type the collaboration is attached to. */
  eventType?: "cause" | "needs" | null
  /** Collaboration-only: request-status badges rendered over the Event cell. */
  requestBadges?: Array<"new-request" | "organizer" | "pending">
}

export type EventsPagination = {
  from: number
  to: number
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type EventsScenarioData = {
  activeTab: EventsTabId
  progress: { current: number; total: number }
  rows: EventTableRow[]
  pagination: EventsPagination
}

export type EventsTableScenario = "empty" | "filled"

export type EventsColumnDef = { id: string; label: string; type: string }
export type EventsFilterDef = {
  id: string
  label: string
  options: string[]
  /** Multi-select checkbox dropdown (collaboration filters). */
  multi?: boolean
}
export type EventsRowActionDef = {
  id: string
  label: string
  icon?: string
  destructive?: boolean
}
export type EventsEmptyState = { title: string; description: string }

export type EventsPageConfig = {
  title: string
  createButtonLabel: string
  tabs: Array<{
    id: EventsTabId
    label: string
    searchPlaceholder: string
    progressLabel: string
    progressLimit: number
    /** Optional per-tab overrides — fall back to the page-level defaults. */
    columns?: EventsColumnDef[]
    filters?: EventsFilterDef[]
    rowActions?: EventsRowActionDef[]
    emptyState?: EventsEmptyState
    /** When set, renders a count badge next to the tab label. */
    showCount?: boolean
  }>
  filters: EventsFilterDef[]
  columns: EventsColumnDef[]
  rowActions: EventsRowActionDef[]
  /** Row menu shown for draft rows (Continue / Delete draft). */
  draftRowActions?: EventsRowActionDef[]
  emptyState: EventsEmptyState
  pagination: {
    pageSizeOptions: number[]
    defaultPageSize: number
  }
}

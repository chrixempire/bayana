export type EventsTabId = "causes" | "needs" | "collaborations"

export type EventVisibilityType = "public" | "private" | "drafts"

export type EventLifecycleStatus = "upcoming" | "active" | "completed"

export type EventVolunteerFormat = "in-person" | "virtual"

export type EventTableRow = {
  id: string
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
  }
  volunteers: {
    current: number
    max: number
  } | null
  shareUrl: string | null
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

export type EventsPageConfig = {
  title: string
  createButtonLabel: string
  tabs: Array<{
    id: EventsTabId
    label: string
    searchPlaceholder: string
    progressLabel: string
    progressLimit: number
  }>
  filters: Array<{ id: string; label: string; options: string[] }>
  columns: Array<{ id: string; label: string; type: string }>
  rowActions: Array<{
    id: string
    label: string
    icon?: string
    destructive?: boolean
  }>
  emptyState: {
    title: string
    description: string
  }
  pagination: {
    pageSizeOptions: number[]
    defaultPageSize: number
  }
}

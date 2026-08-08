export type EventDetailTabId =
  | "home"
  | "updates"
  | "volunteers"
  | "donations"
  | "reviews"
  | "in-kind"

export type PersonAvatarTone = "orange" | "purple" | "blue" | "green"

export type EventDetailStatus =
  | "active"
  | "upcoming"
  | "completed"
  | "draft"
  | "fully-fulfilled"

export type EventDetailKind = "cause" | "needs" | "campaign"

/** Label/value row rendered in the detail header (Date, Visibility, …). */
export type EventDetailMetaRow = {
  id: string
  icon:
    | "calendar"
    | "volunteers"
    | "visibility"
    | "type"
    | "contact"
    | "updated"
    | "donation-type"
    | "target-amount"
    | "items"
    | "collaborator"
  label: string
  value: string
  /** Renders the orange initial avatar before the value (used for "Last updated"). */
  avatarInitial?: string
}

/* ------------------------------- Needs (detail) --------------------------------- */

/** A row in the "Recent donations" list on a needs Home tab. */
export type NeedsRecentDonation = {
  id: string
  donor: string
  avatarTone: PersonAvatarTone
  kind?: "cash" | "in-kind"
  itemImages?: string[]
  /** Signed contribution, e.g. "+₦10,000.00". */
  amount: string
  /** Remaining-to-goal note, e.g. "₦360,000 left". */
  left: string
  timeAgo: string
}

/** Extra data used to render the needs Home tab (donors + in-cash progress). */
export type NeedsHomeData = {
  donorsCount: number
  /** Pre-formatted, e.g. "₦100,000". */
  inCashRaised: string
  /** Pre-formatted goal, e.g. "200,000". */
  inCashGoal: string
  /** Pre-formatted in-kind progress, e.g. "10". */
  inKindRaised?: string
  /** Pre-formatted in-kind goal, e.g. "50". */
  inKindGoal?: string
  recentDonations: NeedsRecentDonation[]
}

export type InKindDonationStatus = "in-transit" | "pledged" | "confirmed" | "flagged"

export type InKindPledgedItem = {
  name: string
  quantity: number
  imageUrl?: string
}

/** A row in the In-kind donations tab (and the Donor details modal). */
export type InKindDonationRow = {
  id: string
  donor: string
  handle: string
  avatarTone: PersonAvatarTone
  itemsCount: number
  status: InKindDonationStatus
  date: string
  email: string
  phone: string
  dateJoined: string
  deliveryType: "Delivery" | "Pickup"
  preferredDate: string
  datePledged: string
  items: InKindPledgedItem[]
}

/** Data for the needs In-kind donations tab. */
export type NeedsInKindData = {
  totalItems: number
  itemsLeft: number
  donorsCount: number
  /** Items received so far (progress bar numerator). */
  itemsReceived: number
  rows: InKindDonationRow[]
}

export type EventDetailStats = {
  volunteers: { current: number; max: number }
  /** Pre-formatted currency strings, e.g. "₦40,000" / "400,000". */
  donations: { current: string; max: string }
  sessions: { current: number; max: number }
  attendance: string
}

export type EventSessionAttendees = {
  /** Up to 4 avatar entries rendered as an overlapping stack. */
  avatars: Array<{ initial?: string; imageUrl?: string; tone: "purple" | "blue" }>
  summary: string
}

export type SessionTiming = "upcoming" | "happening" | "done"

export type EventSession = {
  id: string
  month: string
  day: string
  time: string
  title: string
  location: string
  /** Highlights the date badge (orange) — used for the currently "happening" session. */
  happening?: boolean
  /** Timing badge state (Happening / Done / N Days Time). */
  timing?: SessionTiming
  /** Label for an upcoming session, e.g. "4 Days Time". */
  daysLabel?: string
  /** Virtual sessions show a meeting link instead of a location. */
  meetLink?: string
  attendees?: EventSessionAttendees | null
}

export type EventDetail = {
  id: string
  kind: EventDetailKind
  status: EventDetailStatus
  statusLabel: string
  breadcrumb: string[]
  title: string
  coverImages: string[]
  /** Private causes — used when copying the access code from the header menu. */
  accessCode?: string | null
  meta: EventDetailMetaRow[]
  about: {
    label: string
    description: string
    categories: string[]
    requirements: string[]
    skills: string[]
  }
  certificate: {
    kindLabel: string
    heading: string
    presentedTo: string
    recipientName: string
    body: string
    signatureName: string
    signatureRole: string
  }
  stats: EventDetailStats
  sessionsTotal: number
  sessions: EventSession[]
  volunteers: VolunteersData
  donations: DonationsData
  reviews: ReviewsData
  updates: UpdatesData
  /** Present only for needs-kind events; drives the needs Home tab. */
  needs?: NeedsHomeData
  /** Present when a needs event accepts in-kind donations; drives the In-kind tab. */
  inKind?: NeedsInKindData
}

/* ---------------------------------- Volunteers ---------------------------------- */

export type VolunteerStatus = "pending" | "accepted" | "waitlist"

export type Volunteer = {
  id: string
  name: string
  handle: string
  email: string
  phone: string
  avatarTone: PersonAvatarTone
  avatarImage?: string
  isNew?: boolean
  skills: string[]
  reason: string | null
  status: VolunteerStatus
  dateApplied: string
  dateJoined: string
  /** 0–100 reliability score used in the Issue certificate flow. */
  reliability?: number
}

export type SkillCapacity = {
  skill: string
  filled: number
  total: number
}

export type VolunteersData = {
  totals: {
    volunteers: { current: number; max: number }
    spotsLeft: number
    pending: number
    waitlists: number
  }
  capacity: SkillCapacity[]
  rows: Volunteer[]
}

/* ---------------------------------- Donations ----------------------------------- */

export type DonationChannel = "card" | "bank-transfer"

export type Donation = {
  id: string
  donor: string
  avatarTone: PersonAvatarTone
  channel: DonationChannel
  amount: string
  date: string
}

export type DonationsData = {
  goal: string
  /** Progress toward the goal (for the middle "Donation progress" card). */
  raised: string
  raisedValue: number
  goalValue: number
  availableForWithdrawal: string
  amountWithdrawn: string
  rows: Donation[]
}

/* ----------------------------------- Reviews ------------------------------------ */

export type Review = {
  id: string
  name: string
  avatarTone: PersonAvatarTone
  avatarImage?: string
  rating: number
  date: string
  comment: string
}

export type ReviewsData = {
  averageRating: number
  totalReviews: number
  rows: Review[]
}

/* ----------------------------------- Updates ------------------------------------ */

export type UpdateComment = {
  id: string
  author: string
  avatarTone: PersonAvatarTone
  date: string
  text: string
  replies?: UpdateComment[]
}

export type UpdatePost = {
  id: string
  author: string
  avatarTone: PersonAvatarTone
  timeAgo: string
  body: string
  imageUrl?: string
  likes: number
  comments: number
  commentList: UpdateComment[]
}

export type UpdatesData = {
  rows: UpdatePost[]
}

import type {
  EventDetail,
  EventDetailMetaRow,
  EventDetailStatus,
  InKindDonationRow,
  NeedsHomeData,
  NeedsInKindData,
  NeedsRecentDonation,
} from "./event-detail-types"

const NEEDS_STATUS_LABELS: Record<EventDetailStatus, string> = {
  active: "Active",
  upcoming: "Upcoming",
  completed: "Completed",
  "fully-fulfilled": "Fully fulfilled",
  draft: "Draft",
}

const RECENT_CASH_DONATIONS: NeedsRecentDonation[] = [
  { id: "rd-1", donor: "Daniel Osonuga", avatarTone: "green", amount: "+₦10,000.00", left: "₦360,000 left", timeAgo: "Just now" },
  { id: "rd-2", donor: "Anonymous", avatarTone: "purple", amount: "+₦10,000.00", left: "₦370,000 left", timeAgo: "2 mins ago" },
  { id: "rd-3", donor: "Anonymous", avatarTone: "blue", amount: "+₦10,000.00", left: "₦370,000 left", timeAgo: "2 mins ago" },
  { id: "rd-4", donor: "David Bamidele", avatarTone: "orange", amount: "+₦10,000.00", left: "₦380,000 left", timeAgo: "1 hour ago" },
]

const RECENT_MIXED_DONATIONS: NeedsRecentDonation[] = [
  RECENT_CASH_DONATIONS[0],
  {
    id: "rd-2",
    donor: "Daniel Osonuga",
    avatarTone: "green",
    kind: "in-kind",
    amount: "+2",
    left: "40 left",
    timeAgo: "Just now",
  },
  RECENT_CASH_DONATIONS[1],
  {
    id: "rd-4",
    donor: "Anonymous",
    avatarTone: "purple",
    kind: "in-kind",
    amount: "+2",
    left: "42 left",
    timeAgo: "2 mins ago",
  },
  RECENT_CASH_DONATIONS[2],
  RECENT_CASH_DONATIONS[3],
]

function needsHomeForStatus(status: EventDetailStatus, includeInKind: boolean): NeedsHomeData {
  if (status === "upcoming") {
    return {
      donorsCount: 0,
      inCashRaised: "₦0",
      inCashGoal: "200,000",
      recentDonations: [],
    }
  }

  const base: NeedsHomeData = {
    donorsCount: 12,
    inCashRaised: status === "active" ? "₦100,000" : "₦200,000",
    inCashGoal: "200,000",
    recentDonations: includeInKind ? RECENT_MIXED_DONATIONS : RECENT_CASH_DONATIONS,
  }

  if (includeInKind) {
    return {
      ...base,
      inKindRaised: status === "active" ? "10" : "50",
      inKindGoal: "50",
    }
  }

  return base
}

function needsMetaForStatus(status: EventDetailStatus): EventDetailMetaRow[] {
  const rows: EventDetailMetaRow[] = [
    { id: "date", icon: "calendar", label: "Date", value: "22 Jan 2025 to 31 Jan 2025" },
    { id: "visibility", icon: "visibility", label: "Visibility", value: "Public" },
    {
      id: "donation-type",
      icon: "donation-type",
      label: "Donation type",
      value: status === "upcoming" ? "In cash" : "In cash, In-kind",
    },
    { id: "target-amount", icon: "target-amount", label: "Target amount", value: "₦ 200,000.00" },
  ]

  if (status !== "upcoming") {
    rows.push({ id: "items", icon: "items", label: "Items", value: "50 items" })
  }

  rows.push(
    { id: "contact", icon: "contact", label: "Contact", value: "Daniel Osonuga" },
    {
      id: "updated",
      icon: "updated",
      label: "Last updated",
      value: "4th December 2025, 08:30 PM",
      avatarInitial: "A",
    },
  )

  return rows
}

const PLEDGED_ITEMS = [
  { name: "Bag of rice", quantity: 1 },
  { name: "Canned tomatoes", quantity: 1 },
]

function makeInKindRow(
  n: number,
  donor: string,
  handle: string,
  tone: InKindDonationRow["avatarTone"],
  itemsCount: number,
  status: InKindDonationRow["status"],
  date: string,
): InKindDonationRow {
  return {
    id: `#${100132 - n}`,
    donor,
    handle,
    avatarTone: tone,
    itemsCount,
    status,
    date,
    email: "abimbola.malik@email.com",
    phone: "+234 701 234 5678",
    dateJoined: "23 December 2025",
    deliveryType: "Delivery",
    preferredDate: "7 Jan 2025 12:20 PM",
    datePledged: "7 Jan 2025 12:20 PM",
    items: PLEDGED_ITEMS.slice(0, Math.max(1, Math.min(2, itemsCount))),
  }
}

const IN_KIND_ROWS: InKindDonationRow[] = [
  makeInKindRow(0, "Barry Allen", "barry_allen", "purple", 2, "in-transit", "21st Jan, 9:00 AM"),
  makeInKindRow(0, "Barry Allen", "barry_allen", "purple", 2, "pledged", "21st Jan, 9:00 AM"),
  makeInKindRow(1, "Caitlin Snow", "caitlin", "orange", 1, "confirmed", "20th Jan, 11:15 AM"),
  makeInKindRow(2, "Anonymous", "anonymous", "blue", 3, "flagged", "19th Jan, 10:34 PM"),
  makeInKindRow(3, "Tony Stark", "tony", "green", 1, "confirmed", "19th Jan, 11:59 PM"),
  makeInKindRow(4, "Jessica Jones", "jessica", "blue", 1, "confirmed", "19th Jan, 11:45 PM"),
  makeInKindRow(5, "Anonymous", "anonymous", "orange", 1, "confirmed", "19th Jan, 11:30 PM"),
  makeInKindRow(6, "Anonymous", "anonymous", "purple", 1, "confirmed", "19th Jan, 11:15 PM"),
  makeInKindRow(7, "Michael Jordan", "mj", "purple", 1, "confirmed", "19th Jan, 11:00 PM"),
]

function inKindForStatus(status: EventDetailStatus): NeedsInKindData {
  if (status === "upcoming") {
    return { totalItems: 50, itemsLeft: 50, donorsCount: 0, itemsReceived: 0, rows: [] }
  }
  return { totalItems: 50, itemsLeft: 38, donorsCount: 12, itemsReceived: 12, rows: IN_KIND_ROWS }
}

/**
 * Reshapes the sample cause event into a needs-kind detail record for the given
 * lifecycle status. Reuses the base cover images / updates, and adds the needs
 * Home data + needs-specific meta rows.
 */
export function buildNeedsEventDetail(
  base: EventDetail,
  status: EventDetailStatus = "upcoming",
): EventDetail {
  const includeInKind = status !== "upcoming"
  const home = needsHomeForStatus(status, includeInKind)
  const raisedValue = status === "upcoming" ? 0 : status === "active" ? 100000 : 200000
  const title = "₦500,000 for flood relief food item"

  return {
    ...base,
    kind: "needs",
    status,
    statusLabel: NEEDS_STATUS_LABELS[status],
    title,
    breadcrumb: ["Events", "Needs", title],
    meta: needsMetaForStatus(status),
    about: {
      ...base.about,
      label: "About this cause",
      description:
        "We want to help people affected by flood in makoko community recently with food items",
      categories: ["Relief", "Flood donations"],
    },
    needs: home,
    inKind: inKindForStatus(status),
    donations: {
      ...base.donations,
      goal: "₦200,000",
      raised: home.inCashRaised,
      raisedValue,
      goalValue: 200000,
    },
  }
}

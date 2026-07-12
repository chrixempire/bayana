import type { PersonAvatarTone } from "./event-detail-types"

export type DashboardStat = {
  label: string
  value: string
  emptyValue: string
  delta: string
  trend: "up" | "down"
  star?: boolean
}

export const DASHBOARD_STATS: DashboardStat[] = [
  { label: "Total events", value: "1,250", emptyValue: "0", delta: "+5.0%", trend: "up" },
  { label: "Total volunteers", value: "1,120", emptyValue: "0", delta: "+8.6%", trend: "up" },
  { label: "Total cash donations", value: "₦150,215,000.00", emptyValue: "₦0.00", delta: "+6.0%", trend: "up" },
]

export const DASHBOARD_SIDE_STATS: DashboardStat[] = [
  { label: "Public ratings", value: "3.5", emptyValue: "0.0", delta: "-2.0%", trend: "down", star: true },
  { label: "Total review", value: "150", emptyValue: "0", delta: "+4.5%", trend: "up" },
]

// Active events line chart (single blue series, 0–1000).
export const ACTIVE_EVENTS_SERIES = [
  150, 180, 235, 200, 165, 175, 250, 210, 165, 480, 690, 705, 690, 470, 200,
  165, 235, 205, 170, 165, 180, 210, 175, 200, 260,
]

export type Visibility = "Public" | "Private"
export type EventStatus = "Active" | "Upcoming" | "Completed"

export type RecentEvent = {
  title: string
  subtitle: string
  thumb: string
  type: "Cause" | "Need"
  visibility: Visibility
  status: EventStatus
  dateRange: string
  time: string
}

export const RECENT_EVENTS: RecentEvent[] = [
  {
    title: "Weekend teaching program at Makoko",
    subtitle: "Join us in providing quality education...",
    thumb: "/placeholders/event-thumb-1.jpg",
    type: "Cause",
    visibility: "Public",
    status: "Active",
    dateRange: "6 Dec - 12 Dec 2025",
    time: "8:00 AM - 5:00PM",
  },
  {
    title: "₦500,000 for flood relief food item",
    subtitle: "We want to help people affected b...",
    thumb: "/placeholders/event-thumb-2.jpg",
    type: "Need",
    visibility: "Public",
    status: "Upcoming",
    dateRange: "6 Dec - 12 Dec 2025",
    time: "8:00 AM - 5:00PM",
  },
  {
    title: "Weekend teaching program at Makoko",
    subtitle: "Join us in providing quality education...",
    thumb: "/placeholders/event-thumb-3.jpg",
    type: "Cause",
    visibility: "Private",
    status: "Active",
    dateRange: "6 Dec - 12 Dec 2025",
    time: "8:00 AM - 5:00PM",
  },
  {
    title: "₦500,000 for flood relief food item",
    subtitle: "We want to help people affected b...",
    thumb: "/placeholders/event-thumb-4.jpg",
    type: "Need",
    visibility: "Public",
    status: "Completed",
    dateRange: "6 Dec - 12 Dec 2025",
    time: "8:00 AM - 5:00PM",
  },
  {
    title: "Weekend teaching program at Makoko",
    subtitle: "Join us in providing quality education...",
    thumb: "/placeholders/event-thumb-1.jpg",
    type: "Cause",
    visibility: "Public",
    status: "Completed",
    dateRange: "6 Dec - 12 Dec 2025",
    time: "8:00 AM - 5:00PM",
  },
]

export type Review = {
  id: string
  name: string
  avatarTone: PersonAvatarTone
  rating: number
  text: string
}

export const RECENT_REVIEWS: Review[] = Array.from({ length: 5 }, (_, i) => ({
  id: `r-${i}`,
  name: "Abimbola Malik",
  avatarTone: "orange" as PersonAvatarTone,
  rating: 3,
  text: "I enjoyed participating in this cause, it was rea...",
}))

export type UnreadMessage = {
  id: string
  name: string
  time: string
  preview: string
  members: { name: string; avatarTone: PersonAvatarTone; avatarImage?: string }[]
  extra: number
  unread: number
}

export const UNREAD_MESSAGES: UnreadMessage[] = [
  {
    id: "u-1",
    name: "Boluwatufe Jubu",
    time: "2 mins ago",
    preview: "Hi, please i need help with locating the cause",
    members: [{ name: "Boluwatufe Jubu", avatarTone: "purple" }],
    extra: 0,
    unread: 1,
  },
  {
    id: "u-2",
    name: "David Bamidele",
    time: "8:30 AM",
    preview: "Hi, please i need help with locating the cause",
    members: [{ name: "David Bamidele", avatarTone: "blue", avatarImage: "/placeholders/volunteer-david.jpg" }],
    extra: 0,
    unread: 1,
  },
  {
    id: "u-3",
    name: "Boluwatife and David",
    time: "2 mins ago",
    preview: "You: Here's the updated location for the Ma...",
    members: [
      { name: "Boluwatife Jubu", avatarTone: "purple" },
      { name: "David Bamidele", avatarTone: "blue", avatarImage: "/placeholders/volunteer-david.jpg" },
    ],
    extra: 0,
    unread: 1,
  },
  {
    id: "u-4",
    name: "Abimbola and 2 others",
    time: "Just now",
    preview: "You: Here's the updated location for the Ma...",
    members: [
      { name: "Abimbola Malik", avatarTone: "orange" },
      { name: "David Bamidele", avatarTone: "blue", avatarImage: "/placeholders/volunteer-david.jpg" },
    ],
    extra: 2,
    unread: 1,
  },
  {
    id: "u-5",
    name: "Boluwatufe Jubu",
    time: "2 mins ago",
    preview: "Hi, please i need help with locating the cause",
    members: [{ name: "Boluwatufe Jubu", avatarTone: "purple" }],
    extra: 0,
    unread: 1,
  },
]

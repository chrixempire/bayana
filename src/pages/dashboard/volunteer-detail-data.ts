import type { PersonAvatarTone } from "./event-detail-types"

export type AttendanceCell = "attended" | "clocked-in" | "no-show" | "empty"

export type VolunteerAttendanceRow = {
  id: string
  event: string
  rate: string
  sessions: number
  cells: AttendanceCell[]
}

export type VolunteerEventRow = {
  id: string
  thumbnailUrl: string
  title: string
  description: string
  eventType: "Cause" | "Need"
  visibility: "public" | "private"
  lifecycle: "Upcoming" | "Active" | "Completed"
  categories: string[]
  extraCount: number
  date: string
  time: string
}

export type VolunteerDonationRow = {
  id: string
  type: "in-kind" | "in-cash"
  detail: string
  status: "in-transit" | "completed"
  date: string
}

export type VolunteerReviewRow = {
  id: string
  thumbnailUrl: string
  eventTitle: string
  eventDescription: string
  rating: number
  review: string
  date: string
}

export type VolunteerDetail = {
  id: string
  name: string
  handle: string
  email: string
  phone: string
  dateOfBirth: string
  avatarTone: PersonAvatarTone
  avatarImage?: string
  status: "active" | "blacklisted"
  joined: string
  accountCreated: string
  skills: string[]
  interests: string[]
  stats: { hours: string; events: number; inCash: string; inKind: number }
  attendanceRate: string
  attendance: VolunteerAttendanceRow[]
  events: VolunteerEventRow[]
  donations: VolunteerDonationRow[]
  reviews: VolunteerReviewRow[]
}

const A = "attended" as const
const C = "clocked-in" as const
const N = "no-show" as const
const E = "empty" as const

const EVENT_TITLE = "Weekend teaching program at Makoko community"
const EVENT_DESC = "Join us in providing quality education to children in the Makoko community"

const DETAIL: VolunteerDetail = {
  id: "vol-1",
  name: "Abimbola Malik",
  handle: "abimbola_malik",
  email: "abimbola.malik@email.com",
  phone: "+234 701 234 5678",
  dateOfBirth: "12 April 1999",
  avatarTone: "orange",
  status: "active",
  joined: "26 Jan 2026",
  accountCreated: "23 December 2025",
  skills: ["Couselling/Mentoring", "Healthcare Support", "Public speaking"],
  interests: ["Arts, Culture & Technology", "Events", "Youth Development"],
  stats: { hours: "20", events: 2, inCash: "₦ 50,000.00", inKind: 12 },
  attendanceRate: "78",
  attendance: [
    { id: "a1", event: EVENT_TITLE, rate: "90% attendance rate", sessions: 5, cells: [A, E, E, E, E] },
    { id: "a2", event: EVENT_TITLE, rate: "90% attendance rate", sessions: 6, cells: [A, A, C, C, N, N] },
    { id: "a3", event: EVENT_TITLE, rate: "90% attendance rate", sessions: 5, cells: [A, A, C, N, A] },
    { id: "a4", event: EVENT_TITLE, rate: "75% attendance rate", sessions: 10, cells: [A, A, A, A, A, A, A, C, N, A] },
  ],
  events: [
    {
      id: "evt-1",
      thumbnailUrl: "/placeholders/event-thumb-1.jpg",
      title: EVENT_TITLE,
      description: EVENT_DESC,
      eventType: "Cause",
      visibility: "public",
      lifecycle: "Active",
      categories: ["Youth Development"],
      extraCount: 1,
      date: "6 Dec - 12 Dec 2025",
      time: "8:00 AM - 5:00PM",
    },
    {
      id: "evt-2",
      thumbnailUrl: "/placeholders/event-thumb-2.jpg",
      title: "₦500,000 for flood relief food item",
      description: "We want to help people affected by flood in makoko community",
      eventType: "Need",
      visibility: "public",
      lifecycle: "Completed",
      categories: ["Youth Development"],
      extraCount: 1,
      date: "6 Dec - 12 Dec 2025",
      time: "8:00 AM - 5:00PM",
    },
  ],
  donations: [
    { id: "#100132", type: "in-kind", detail: "12 items", status: "in-transit", date: "21st Jan, 9:00 AM" },
    { id: "#100132", type: "in-cash", detail: "₦ 50,000.00", status: "completed", date: "21st Jan, 9:00 AM" },
  ],
  reviews: [
    {
      id: "r1",
      thumbnailUrl: "/placeholders/event-thumb-1.jpg",
      eventTitle: "Weekend teachi...",
      eventDescription: "Join us in providi...",
      rating: 3,
      review: "I enjoyed participating in this cause, it was really fulfilling. However there were a few hiccups with coordination.",
      date: "04 Jan, 08:15 AM",
    },
    {
      id: "r2",
      thumbnailUrl: "/placeholders/event-thumb-2.jpg",
      eventTitle: "Weekend teachi...",
      eventDescription: "Join us in providi...",
      rating: 3,
      review: "I enjoyed participating in this cause, it was really fulfilling. However there were a few hiccups with coordination.",
      date: "04 Jan, 08:15 AM",
    },
  ],
}

export function getVolunteerDetail(id?: string): VolunteerDetail {
  return id ? { ...DETAIL, id } : DETAIL
}

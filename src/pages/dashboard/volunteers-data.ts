import type { PersonAvatarTone } from "./event-detail-types"

export type VolunteerListStatus = "active" | "blacklisted"

export type VolunteerListRow = {
  id: string
  name: string
  email: string
  avatarTone: PersonAvatarTone
  avatarImage?: string
  skills: string[]
  activities: number
  status: VolunteerListStatus
  /** Pre-formatted, e.g. "26 Jan 11:40 AM". */
  dateJoined: string
  /** ISO for date-joined filtering. */
  dateJoinedIso: string
}

export const VOLUNTEER_SKILL_OPTIONS = [
  "IT Training",
  "Marketing",
  "Product Development",
  "Sales",
  "UX Design",
  "Customer Support",
  "Finance",
  "Operations",
  "Human Resources",
  "Research & Development",
  "Teaching",
  "Public Speaking",
] as const

const TONES: PersonAvatarTone[] = ["orange", "purple", "blue", "green"]

const BASE: Array<[string, string, string, VolunteerListStatus, number, string, string]> = [
  ["Abimbola Malik", "IT Training", "active", "active", 2, "26 Jan 11:40 AM", "2025-01-26"],
  ["Carlos Mendoza", "Marketing", "active", "active", 3, "26 Jan 12:00 PM", "2025-01-26"],
  ["Diana Wu", "Product Development", "blacklisted", "blacklisted", 1, "25 Jan 10:30 AM", "2025-01-25"],
  ["Ethan Lee", "Sales", "active", "active", 5, "26 Jan 1:15 PM", "2025-01-26"],
  ["Fiona Rogers", "UX Design", "active", "active", 4, "26 Jan 2:00 PM", "2025-01-26"],
  ["George Patel", "Customer Support", "active", "active", 2, "26 Jan 2:30 PM", "2025-01-26"],
  ["Hannah Kim", "Finance", "blacklisted", "blacklisted", 3, "25 Jan 9:00 AM", "2025-01-25"],
  ["Isaac Turner", "Operations", "active", "active", 1, "26 Jan 3:00 PM", "2025-01-26"],
  ["Jasmine Singh", "Human Resources", "active", "active", 2, "26 Jan 3:30 PM", "2025-01-26"],
  ["Kevin Zhao", "Research & Development", "blacklisted", "blacklisted", 4, "25 Jan 8:00 AM", "2025-01-25"],
]

const EXTRA_NAMES = [
  "Laura Chen", "Marcus Bell", "Nadia Okafor", "Oscar Reyes", "Priya Nair",
  "Quentin Ford", "Rosa Dvir", "Samuel Idris", "Tara Bassey", "Uche Nwosu",
  "Vera Adeyemi", "Wale Johnson", "Xena Cole", "Yara Mensah", "Zach Obi",
  "Amara Diallo", "Ben Carter", "Chidi Eze", "Deborah Sy", "Emeka Obi",
  "Farah Nasser", "Gbenga Alli", "Halima Sadiq", "Ivan Petrov", "Joy Ekong",
  "Kunle Bello", "Lola Ade", "Musa Bala", "Ngozi Udo", "Osei Kwame",
  "Pat Riley", "Rita Ofori", "Sade Cole", "Tomi Ola", "Uma Rao",
  "Victor Ita", "Wura Bello", "Yusuf Musa", "Zainab Kola", "Ada Obi",
]

function buildRows(): VolunteerListRow[] {
  const rows: VolunteerListRow[] = BASE.map((entry, index) => ({
    id: `vol-${index + 1}`,
    name: entry[0],
    email: `${entry[0].toLowerCase().replace(/\s+/g, ".")}@email.com`,
    avatarTone: TONES[index % TONES.length],
    avatarImage: entry[0] === "Kevin Zhao" ? "/placeholders/volunteer-kevin.jpg" : undefined,
    skills: [entry[1], "Teaching"],
    activities: entry[4],
    status: entry[3],
    dateJoined: entry[5],
    dateJoinedIso: entry[6],
  }))

  EXTRA_NAMES.forEach((name, i) => {
    const skill = VOLUNTEER_SKILL_OPTIONS[i % VOLUNTEER_SKILL_OPTIONS.length]
    rows.push({
      id: `vol-${rows.length + 1}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
      avatarTone: TONES[i % TONES.length],
      skills: [skill, "Public Speaking"],
      activities: (i % 5) + 1,
      // Exactly 2 blacklisted here + 3 in BASE = 5 total (45 active of 50).
      status: i === 5 || i === 20 ? "blacklisted" : "active",
      dateJoined: `2${i % 6} Jan ${9 + (i % 3)}:00 AM`,
      dateJoinedIso: `2025-01-${String(10 + (i % 18)).padStart(2, "0")}`,
    })
  })
  return rows
}

export const VOLUNTEER_ROWS: VolunteerListRow[] = buildRows()

export const VOLUNTEER_TOTALS = {
  total: VOLUNTEER_ROWS.length,
  active: VOLUNTEER_ROWS.filter((r) => r.status === "active").length,
  blacklisted: VOLUNTEER_ROWS.filter((r) => r.status === "blacklisted").length,
}

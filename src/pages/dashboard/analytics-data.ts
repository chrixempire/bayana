export type AnalyticsTab = "overview" | "donations" | "volunteers"

export type StatCard = {
  label: string
  value: string
  /** e.g. "+5.0%" or "-1.5%". */
  delta: string
  trend: "up" | "down"
  /** Show a gold star after the value (Public review card). */
  star?: boolean
}

/** Chart series palette (matches Figma design tokens). */
export const CHART_BLUE = "#2ea1fe"
export const CHART_ORANGE = "#ff7415"
export const CHART_PURPLE = "#8b3df5"
export const CHART_TRACK = "#edf0f2"

export const OVERVIEW_STATS: StatCard[] = [
  { label: "Total events", value: "1,250", delta: "+5.0%", trend: "up" },
  { label: "Total active events", value: "10", delta: "+4.5%", trend: "up" },
  { label: "Total volunteers", value: "1,120", delta: "+8.6%", trend: "up" },
  { label: "Total volunteer hours", value: "45", delta: "+1.2%", trend: "up" },
  { label: "Total cash donations", value: "₦150,215,000.00", delta: "+6.0%", trend: "up" },
  { label: "Total in-kind donations", value: "23,500", delta: "+5.0%", trend: "up" },
  { label: "Need fulfilment rate", value: "75 %", delta: "-1.5%", trend: "down" },
  { label: "Public review", value: "3.5", delta: "-2.0%", trend: "down", star: true },
]

export const DONATION_STATS: StatCard[] = [
  { label: "Total cash donations", value: "₦150,215,000.00", delta: "+6.0%", trend: "up" },
  { label: "Total donations this month", value: "₦1,150,000.00", delta: "+5.0%", trend: "up" },
  { label: "Average donation value", value: "₦5,670.00", delta: "-1.5%", trend: "down" },
  { label: "Total donors", value: "560", delta: "+1.2%", trend: "up" },
  { label: "Total items requested", value: "11,250", delta: "+8.6%", trend: "up" },
  { label: "Items pledged", value: "10,125", delta: "+5.0%", trend: "up" },
  { label: "Items confirmed received", value: "125", delta: "-2.0%", trend: "down" },
  { label: "Need fulfilment rate", value: "75 %", delta: "-1.5%", trend: "down" },
]

export const VOLUNTEER_STATS: StatCard[] = [
  { label: "Total volunteers", value: "1,120", delta: "+8.6%", trend: "up" },
  { label: "Total active volunteers", value: "860", delta: "+5.0%", trend: "up" },
  { label: "Repeat volunteering rate", value: "15.50 %", delta: "-8.0%", trend: "down" },
  { label: "Total volunteer hours", value: "45", delta: "+1.2%", trend: "up" },
]

// ── Event activity (Overview) — two smooth series on a 0–1000 scale ───────────
export const EVENT_ACTIVITY_DONATIONS = [
  720, 705, 640, 690, 610, 505, 470, 500, 520, 560, 545, 600, 615, 690, 700,
]
export const EVENT_ACTIVITY_VOLUNTEERS = [
  225, 300, 250, 235, 255, 560, 600, 585, 310, 345, 330, 320, 335, 320, 330,
]

// ── Volunteer growth (Volunteers) — single smooth series, big central hump ────
export const VOLUNTEER_GROWTH = [
  150, 180, 235, 200, 165, 175, 250, 210, 165, 480, 690, 705, 690, 470, 200,
  165, 235, 205, 170, 165, 180, 210, 175, 200, 260,
]

export const CHART_X_START = "1 Mar"
export const CHART_X_END = "31 Mar"

// ── Pie datasets ──────────────────────────────────────────────────────────────
export type PieSlice = { label: string; value: number; color: string; legend?: string }

export const DONOR_COMPARISON: PieSlice[] = [
  { label: "New donor", value: 435, color: CHART_BLUE },
  { label: "Returning donor", value: 125, color: CHART_ORANGE },
]

export const AGE_RANGE: PieSlice[] = [
  { label: "10 - 20", value: 350, color: CHART_BLUE },
  { label: "21 - 30", value: 180, color: CHART_ORANGE },
  { label: "31 - 40", value: 35, color: CHART_PURPLE },
]

export const GENDER: PieSlice[] = [
  { label: "Male", value: 875, color: CHART_BLUE },
  { label: "Female", value: 245, color: CHART_ORANGE },
]

// ── Top 5 skills (Volunteers) ───────────────────────────────────────────────
export type SkillRow = { label: string; value: number; pct: number }
export const TOP_SKILLS: SkillRow[] = [
  { label: "Teaching", value: 50, pct: 79 },
  { label: "IT Training", value: 35, pct: 65 },
  { label: "Youth Mentorship", value: 18, pct: 36 },
  { label: "Public Speaking", value: 10, pct: 19 },
  { label: "Counselling/Mentoring", value: 4, pct: 6 },
]

// ── Event donations table (Donations) ────────────────────────────────────────
export type EventDonationRow = {
  event: string
  totalRaised: string
  donors: number
  averageDonation: string
}

export const EVENT_DONATIONS: EventDonationRow[] = Array.from({ length: 50 }, (_, i) => ({
  event: `Weekend teaching program at Makoko ${i + 1}`,
  totalRaised: "₦140,000.00",
  donors: 54,
  averageDonation: "₦2,500.00",
}))

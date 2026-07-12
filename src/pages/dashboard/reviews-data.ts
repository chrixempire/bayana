import type { PersonAvatarTone } from "./event-detail-types"

export type ReviewRow = {
  id: string
  name: string
  email: string
  avatarTone: PersonAvatarTone
  rating: number
  review: string | null
  date: string
  event: string
  dateAdded: string
}

const REVIEW_TEXT =
  "I enjoyed participating in this cause, it was really fulfilling. However, I noticed it wasn't as engaging as expected"

export const REVIEW_ROWS: ReviewRow[] = Array.from({ length: 15 }, (_, i) => ({
  id: `rev-${i + 1}`,
  name: "Abimbola Malik",
  email: "abimbola.malik@email.com",
  avatarTone: "orange" as PersonAvatarTone,
  rating: 3,
  review: i === 3 ? null : REVIEW_TEXT,
  date: "04 Jan, 08:15 AM",
  event: "Weekend teaching program at Makoko community",
  dateAdded: "7 Jan 2025 12:20 PM",
}))

export const REVIEW_TOTALS = { average: "3.5", total: 150 }

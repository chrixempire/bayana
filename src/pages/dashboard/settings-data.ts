import type { PersonAvatarTone } from "./event-detail-types"

export type SettingsSection =
  | "profile"
  | "notifications"
  | "privacy"
  | "ngo-profile"
  | "team"
  | "billing"
  | "payouts"
  | "audit"

export type TeamMember = {
  id: string
  name: string
  email: string
  avatarTone: PersonAvatarTone
  avatarImage?: string
  role: string
  status: "active" | "pending"
  dateJoined: string
  isYou?: boolean
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm-1",
    name: "Daniel Osonuga",
    email: "daniel.osonuga@email.com",
    avatarTone: "orange",
    role: "Administrator",
    status: "active",
    dateJoined: "26 Jan 12:00 PM",
    isYou: true,
  },
  {
    id: "tm-2",
    name: "John Doe",
    email: "john.doe@email.com",
    avatarTone: "orange",
    role: "Owner",
    status: "active",
    dateJoined: "26 Jan 11:40 AM",
  },
  {
    id: "tm-3",
    name: "David Bamidele",
    email: "david.bamidele@email.com",
    avatarTone: "blue",
    avatarImage: "/placeholders/volunteer-david.jpg",
    role: "Finance Manager",
    status: "active",
    dateJoined: "26 Jan 11:40 AM",
  },
  {
    id: "tm-4",
    name: "David Akinyele",
    email: "david.akinyele@email.com",
    avatarTone: "orange",
    role: "Support Officer",
    status: "pending",
    dateJoined: "--",
  },
]

export const ROLE_OPTIONS = ["Administrator", "Owner", "Finance Manager", "Support Officer"]

export type AuditLog = {
  id: string
  member: string
  avatarTone: PersonAvatarTone
  avatarImage?: string
  log: string
  fullLog: string
  date: string
  dateAdded: string
}

export const AUDIT_LOGS: AuditLog[] = [
  {
    id: "al-1",
    member: "Daniel Osonuga",
    avatarTone: "orange",
    log: "Accepted volunteer request to join Weekend teach…",
    fullLog: "Accepted volunteer request to join Weekend teaching program",
    date: "26 Jan 12:00 PM",
    dateAdded: "7 Jan 2025 12:20 PM",
  },
  {
    id: "al-2",
    member: "Daniel Osonuga",
    avatarTone: "orange",
    log: "Logged in to Acme Incoporation",
    fullLog: "Logged in to Acme Incoporation",
    date: "26 Jan 12:00 PM",
    dateAdded: "7 Jan 2025 12:20 PM",
  },
  {
    id: "al-3",
    member: "John Doe",
    avatarTone: "orange",
    log: "Logged in to Acme Incoporation",
    fullLog: "Logged in to Acme Incoporation",
    date: "26 Jan 12:00 PM",
    dateAdded: "7 Jan 2025 12:20 PM",
  },
]

export type BankAccount = {
  id: string
  name: string
  number: string
  bank: string
  primary: boolean
}

export const BANK_ACCOUNTS: BankAccount[] = [
  { id: "ba-1", name: "Acme Incorporation", number: "1234567890", bank: "First Bank Nigeria", primary: true },
  { id: "ba-2", name: "Acme Incorporation", number: "1234567890", bank: "Zenith Bank", primary: false },
]

export const BANK_OPTIONS = [
  "First Bank Nigeria",
  "Zenith Bank",
  "Access Bank",
  "Guaranty Trust Bank",
  "United Bank for Africa",
]

export type PayoutRow = {
  id: string
  title: string
  date: string
  amount: string
  status: "Successful"
  accountName: string
  accountNumber: string
  bank: string
  transactionId: string
}

export const PAYOUT_HISTORY: PayoutRow[] = Array.from({ length: 3 }, (_, i) => ({
  id: `po-${i + 1}`,
  title: "Acme Incorporation (7890)",
  date: "17 May 2026, 08:30 AM",
  amount: "₦100,000",
  status: "Successful" as const,
  accountName: "Acme incorporation",
  accountNumber: "1234567890",
  bank: "First Bank Nigeria",
  transactionId: "01FGMZ-001",
}))

export const CAUSE_AREAS: { label: string; selected: boolean }[] = [
  { label: "Arts, Culture & Technology", selected: true },
  { label: "Animal Welfare", selected: false },
  { label: "Children's Welfare", selected: false },
  { label: "Education", selected: true },
  { label: "Environmental", selected: false },
  { label: "Events", selected: true },
  { label: "Faith-based", selected: false },
  { label: "Fitness", selected: false },
  { label: "Food & Hunger", selected: false },
  { label: "Health & Wellness", selected: false },
  { label: "Sports", selected: false },
  { label: "Travel", selected: false },
  { label: "Youth Development", selected: true },
]

export const NOTIFICATION_ALERTS = [
  { key: "payout", label: "Payout successful", helper: "Get updates when you withdraw your payouts" },
  { key: "donations", label: "New donations", helper: "Get updates when you receive a donation" },
  { key: "reminder", label: "Event reminder", helper: "Get updates when an event reminder is triggered" },
  { key: "completion", label: "Event completion", helper: "Get updates when your an event is completed" },
  { key: "requests", label: "Volunteer requests", helper: "Get updates when a volunteer sends a request" },
  { key: "message", label: "New message", helper: "Get updates when you receive a message" },
  { key: "collab", label: "New collaboration requests", helper: "Get updates when you receive a collaboration request" },
]

export const PLAN_FEATURES = {
  free: [
    "10 volunteers per cause",
    "Up to ₦500,000 donations per month",
    "7 days duration for causes & needs",
    "2% platform fees on donations",
    "Up to 3 active causes/needs at a time",
  ],
  premium: [
    "Unlimited volunteers per cause",
    "Unlimited donations",
    "90 days duration for causes & needs",
    "0.5% platform fees on donations",
    "Up 10 active causes/needs at a time",
    "NGO collaborators",
    "Featured NGO spotlight",
    "Premium verified NGO badge",
    "Advanced analytics dashboard",
    "Auto-generated impact report",
  ],
}

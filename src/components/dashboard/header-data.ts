export type NotificationGroup = "Today" | "Yesterday" | "Older"

export type NotificationIcon =
  | "event-complete"
  | "reminder"
  | "donation"
  | "volunteer"
  | "collaboration"
  | "message"
  | "payout"
  | "ratings"

export type NotificationItem = {
  id: string
  title: string
  description: string
  time: string
  group: NotificationGroup
  icon: NotificationIcon
  unread: boolean
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    title: "Event completion",
    description: 'You have completed "Weekend teaching program..."',
    time: "09:00 AM",
    group: "Today",
    icon: "event-complete",
    unread: true,
  },
  {
    id: "n-2",
    title: "Event reminder",
    description: '"Weekend teaching program..." starts in 30 minutes',
    time: "03:45 AM",
    group: "Today",
    icon: "reminder",
    unread: true,
  },
  {
    id: "n-3",
    title: "New donation",
    description: "You have received a donation of ₦5,000",
    time: "09:00 AM",
    group: "Yesterday",
    icon: "donation",
    unread: false,
  },
  {
    id: "n-4",
    title: "Volunteer request",
    description: 'Abimbola Malik requested to join "Weekend te..."',
    time: "03:45 AM",
    group: "Yesterday",
    icon: "volunteer",
    unread: false,
  },
  {
    id: "n-5",
    title: "Collaboration request",
    description: "Acme Incorporation2 requested a collaboration",
    time: "03:45 AM",
    group: "Yesterday",
    icon: "collaboration",
    unread: false,
  },
  {
    id: "n-6",
    title: "New message",
    description: "Boluwatife Judu sent you a new message",
    time: "15 / 04",
    group: "Older",
    icon: "message",
    unread: false,
  },
  {
    id: "n-7",
    title: "New message",
    description: "You have a new message from Abimbola and David",
    time: "15 / 04",
    group: "Older",
    icon: "message",
    unread: false,
  },
  {
    id: "n-8",
    title: "Payout successful!",
    description: "You've successfully withdrawn ₦200,000.00",
    time: "14 / 04",
    group: "Older",
    icon: "payout",
    unread: false,
  },
  {
    id: "n-9",
    title: "Ratings received",
    description: "You've received 4 new ratings from volunteers",
    time: "14 / 04",
    group: "Older",
    icon: "ratings",
    unread: false,
  },
]

export type SearchEntity = { id: string; name: string; group: "Volunteer" | "Team members" }

export const SEARCH_ENTITIES: SearchEntity[] = [
  { id: "sv-1", name: "David Bamidele", group: "Volunteer" },
  { id: "sv-2", name: "David Akinyele", group: "Volunteer" },
  { id: "sv-3", name: "Abimbola Malik", group: "Volunteer" },
  { id: "sv-4", name: "Boluwatufe Jubu", group: "Volunteer" },
  { id: "sv-5", name: "Weekend teaching program at Makoko", group: "Volunteer" },
  { id: "st-1", name: "David Bamidele", group: "Team members" },
  { id: "st-2", name: "David Akinyele", group: "Team members" },
  { id: "st-3", name: "Daniel Osonuga", group: "Team members" },
  { id: "st-4", name: "Grace Okafor", group: "Team members" },
]

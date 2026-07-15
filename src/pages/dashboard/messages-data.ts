import type { PersonAvatarTone } from "./event-detail-types"

export type MessageBubble = {
  id: string
  from: "them" | "me"
  kind: "text" | "event"
  text?: string
  eventTitle?: string
  eventThumb?: string
  time?: string
}

export type Conversation = {
  id: string
  name: string
  role: string
  avatarTone: PersonAvatarTone
  avatarImage?: string
  time: string
  preview: string
  unread: number
  messages: MessageBubble[]
}

export const MESSAGES_USER = {
  name: "Daniel Osonuga",
  role: "Admin",
  tone: "orange" as PersonAvatarTone,
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c-1",
    name: "Abimbola Malik",
    role: "Volunteer",
    avatarTone: "orange",
    time: "Just now",
    preview: "Hi, please i need help with locati...",
    unread: 2,
    messages: [
      {
        id: "m1",
        from: "them",
        kind: "event",
        eventTitle: "Weekend teaching program at Makoko comm...",
        eventThumb: "/placeholders/event-thumb-1.jpg",
        time: "Just now",
      },
      { id: "m2", from: "them", kind: "text", text: "I need help please" },
      {
        id: "m3",
        from: "them",
        kind: "text",
        text: "Hi, please i need help with locating the event center. I just got to Makoko and I am currently stuck",
      },
    ],
  },
  {
    id: "c-2",
    name: "Boluwatufe Jubu",
    role: "Volunteer",
    avatarTone: "purple",
    time: "2 mins ago",
    preview: "Hi, please i need help with locati...",
    unread: 3,
    messages: [
      { id: "m1", from: "them", kind: "text", text: "Hi, please i need help with locating the event center." },
    ],
  },
  {
    id: "c-3",
    name: "David Bamidele",
    role: "Volunteer",
    avatarTone: "blue",
    avatarImage: "/placeholders/volunteer-david.jpg",
    time: "8:30 AM",
    preview: "Hi, please i need help with locating...",
    unread: 0,
    messages: [
      { id: "m1", from: "them", kind: "text", text: "Hi, please i need help with locating the event center." },
      { id: "m2", from: "me", kind: "text", text: "Sure, can you share your current location?" },
    ],
  },
]

export const RECENT_MESSAGES = [
  { id: "c-1", name: "Abimbola Malik", avatarTone: "orange" as PersonAvatarTone },
  {
    id: "c-3",
    name: "David Bamidele",
    avatarTone: "blue" as PersonAvatarTone,
    avatarImage: "/placeholders/volunteer-david.jpg",
  },
]

export const UNREAD_COUNT = CONVERSATIONS.reduce((sum, c) => sum + (c.unread > 0 ? 1 : 0), 0)

export type MessagePerson = {
  id: string
  name: string
  avatarTone: PersonAvatarTone
  avatarImage?: string
}

export const VOLUNTEERS_LIST: MessagePerson[] = [
  { id: "v-1", name: "Abimbola Malik", avatarTone: "orange" },
  { id: "v-2", name: "Boluwatufe Jubu", avatarTone: "purple" },
  { id: "v-3", name: "David Bamidele", avatarTone: "blue", avatarImage: "/placeholders/volunteer-david.jpg" },
  { id: "v-4", name: "Chinonso Okechukwu", avatarTone: "orange" },
  { id: "v-5", name: "Damilola Adebayo", avatarTone: "green" },
  { id: "v-6", name: "Emeka Nwankwo", avatarTone: "blue" },
  { id: "v-7", name: "Folake Adesina", avatarTone: "purple" },
  { id: "v-8", name: "Grace Uche", avatarTone: "orange" },
  { id: "v-9", name: "Henry Chuka", avatarTone: "green" },
  { id: "v-10", name: "Isabella Eze", avatarTone: "blue" },
]

export const TEAM_MEMBERS_LIST: MessagePerson[] = [
  { id: "t-1", name: "Daniel Osonuga", avatarTone: "orange" },
  { id: "t-2", name: "Grace Okafor", avatarTone: "purple" },
  { id: "t-3", name: "Tunde Bello", avatarTone: "blue" },
  { id: "t-4", name: "Aisha Bello", avatarTone: "green" },
  { id: "t-5", name: "Michael Chen", avatarTone: "orange" },
  { id: "t-6", name: "Ngozi Udo", avatarTone: "purple" },
]

export type MessageGroup = {
  id: string
  title: string
  members: { name: string; avatarTone: PersonAvatarTone; avatarImage?: string }[]
  extra: number
  preview: string
  time: string
  body: string
}

const GROUP_BODY =
  "Here'e the updated location for the Makoko event happening on the 30th of March 2026.\n\n2 Makoko road, off govement center, makoko"

export const BROADCASTS: MessageGroup[] = [
  {
    id: "b-1",
    title: "Abimbola and 2 others",
    members: [
      { name: "Abimbola Malik", avatarTone: "orange" },
      { name: "David Bamidele", avatarTone: "blue", avatarImage: "/placeholders/volunteer-david.jpg" },
    ],
    extra: 2,
    preview: "You: Here'e the updated location fo...",
    time: "Just now",
    body: GROUP_BODY,
  },
  {
    id: "b-2",
    title: "Boluwatife and David",
    members: [
      { name: "Boluwatife Jubu", avatarTone: "purple" },
      { name: "David Bamidele", avatarTone: "blue", avatarImage: "/placeholders/volunteer-david.jpg" },
    ],
    extra: 0,
    preview: "You: Here'e the updated location fo...",
    time: "2 mins ago",
    body: GROUP_BODY,
  },
]

export const SCHEDULED: MessageGroup[] = [
  {
    id: "s-1",
    title: "Abimbola and 2 others",
    members: [
      { name: "Abimbola Malik", avatarTone: "orange" },
      { name: "David Bamidele", avatarTone: "blue", avatarImage: "/placeholders/volunteer-david.jpg" },
    ],
    extra: 2,
    preview: "You: Here'e the updated location fo...",
    time: "24 / 04",
    body: GROUP_BODY,
  },
  {
    id: "s-2",
    title: "Boluwatife and David",
    members: [
      { name: "Boluwatife Jubu", avatarTone: "purple" },
      { name: "David Bamidele", avatarTone: "blue", avatarImage: "/placeholders/volunteer-david.jpg" },
    ],
    extra: 0,
    preview: "You: Here'e the updated location fo...",
    time: "Tomorrow",
    body: GROUP_BODY,
  },
  {
    id: "s-3",
    title: "David Bamidele",
    members: [{ name: "David Bamidele", avatarTone: "blue", avatarImage: "/placeholders/volunteer-david.jpg" }],
    extra: 0,
    preview: "You: Here'e the updated location fo...",
    time: "20 / 04",
    body: GROUP_BODY,
  },
]

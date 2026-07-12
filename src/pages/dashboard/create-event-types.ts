import type { CreateEventType } from "../../lib/create-event-paths"

export type CreateEventImage = {
  id: string
  previewUrl: string
  name: string
  isCover: boolean
}

export type VolunteeringType = "in-person" | "virtual"
export type EventVisibility = "public" | "private"
export type CertificateAccess = "all" | "automated" | "manual"

export type InKindItem = {
  id: string
  name: string
  description: string
  quantity: number
  imageUrl: string | null
}

export type CreateEventFormState = {
  title: string
  images: CreateEventImage[]
  description: string
  categories: string[]
  requirements: string
  skills: string[]
  volunteeringType: VolunteeringType
  location: string
  hasCapacityLimit: boolean
  capacity: number
  breakdownCapacity: boolean
  skillCapacities: Record<string, number>
  vettingVolunteers: boolean
  receiveDonations: boolean
  donationAmount: number
  disableOverfunding: boolean
  reliabilityScore: number
  dateStart: string
  dateEnd: string
  timeStart: string
  timeEnd: string
  organizer: string
  visibility: EventVisibility
  eventPasscode: string
  certificateAccess: CertificateAccess
  eventReminder: boolean
  notifyBefore: string
  ngoCollaboration: boolean
  ngoOrganization: string
  moreSettingsOpen: boolean
  // Needs-specific
  financialDonations: boolean
  allowOverfunding: boolean
  inKindDonations: boolean
  inKindItems: InKindItem[]
  deliveryByDelivery: boolean
  deliveryByPickup: boolean
  deliveryAddress: string
  deliveryInstructions: string
  pickupAddress: string
  pickupInstructions: string
}

export type CreateEventStepId =
  | "basics"
  | "about"
  | "settings"
  | "needs-basics"
  | "needs-config"

export type CreateEventStepConfig = {
  id: CreateEventStepId
  label: string
}

export function getCreateEventSteps(type: CreateEventType): CreateEventStepConfig[] {
  if (type === "needs") {
    return [
      { id: "needs-basics", label: "Basic information" },
      { id: "needs-config", label: "Need type config" },
    ]
  }

  return [
    { id: "basics", label: "First of all..." },
    { id: "about", label: "About this cause" },
    { id: "settings", label: "Cause settings" },
  ]
}

export const CREATE_EVENT_TITLE_MAX_WORDS = 8

export const CREATE_EVENT_MAX_IMAGES = 4

export function createInitialFormState(): CreateEventFormState {
  return {
    title: "",
    images: [],
    description: "",
    categories: [],
    requirements: "",
    skills: [],
    volunteeringType: "in-person",
    location: "",
    hasCapacityLimit: false,
    capacity: 10,
    breakdownCapacity: false,
    skillCapacities: {},
    vettingVolunteers: true,
    receiveDonations: false,
    donationAmount: 0,
    disableOverfunding: false,
    reliabilityScore: 50,
    dateStart: "",
    dateEnd: "",
    timeStart: "08:00",
    timeEnd: "17:00",
    organizer: "Daniel Osonuga",
    visibility: "public",
    eventPasscode: "",
    certificateAccess: "all",
    eventReminder: true,
    notifyBefore: "30 minutes",
    ngoCollaboration: false,
    ngoOrganization: "",
    moreSettingsOpen: false,
    financialDonations: true,
    allowOverfunding: false,
    inKindDonations: false,
    inKindItems: [],
    deliveryByDelivery: true,
    deliveryByPickup: false,
    deliveryAddress: "",
    deliveryInstructions: "",
    pickupAddress: "",
    pickupInstructions: "",
  }
}

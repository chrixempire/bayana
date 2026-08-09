import { CREATE_EVENT_FREE_PLAN_MAX_VOLUNTEERS } from "../data/create-event-settings"
import { getDonationAmountError } from "./create-event-donations"
import {
  clampReliabilityScore,
  RELIABILITY_SCORE_MAX,
  RELIABILITY_SCORE_MIN,
} from "./reliability-score"
import {
  CREATE_EVENT_TITLE_MAX_WORDS,
  type CreateEventFormState,
  type CreateEventStepId,
} from "../pages/dashboard/create-event-types"

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

export function getCapacityError(
  capacity: number,
  hasCapacityLimit: boolean,
  isPremium = false,
): string | null {
  if (!hasCapacityLimit) return null
  if (!isPremium && capacity > CREATE_EVENT_FREE_PLAN_MAX_VOLUNTEERS) {
    return `Free plan does not accommodate more than ${CREATE_EVENT_FREE_PLAN_MAX_VOLUNTEERS} volunteers. Upgrade`
  }
  if (capacity < 1) return "Capacity must be at least 1"
  return null
}

export function isCreateEventStepValid(
  stepId: CreateEventStepId,
  form: CreateEventFormState,
  isPremium = false,
): boolean {
  if (stepId === "basics") {
    const words = countWords(form.title)
    return words > 0 && words <= CREATE_EVENT_TITLE_MAX_WORDS && form.images.length > 0
  }

  if (stepId === "needs-basics") {
    const words = countWords(form.title)
    const titleOk = words > 0 && words <= CREATE_EVENT_TITLE_MAX_WORDS
    return (
      titleOk &&
      form.description.trim().length > 0 &&
      form.categories.length > 0 &&
      form.images.length > 0
    )
  }

  if (stepId === "needs-config") {
    const financialOk =
      !form.financialDonations ||
      (form.donationAmount > 0 && !getDonationAmountError(form.donationAmount, isPremium))
    const inKindOk =
      !form.inKindDonations ||
      (form.inKindItems.length > 0 &&
        (form.deliveryByDelivery || form.deliveryByPickup) &&
        (!form.deliveryByDelivery || form.deliveryAddress.trim().length > 0) &&
        (!form.deliveryByPickup || form.pickupAddress.trim().length > 0))
    const donationTypeSelected = form.financialDonations || form.inKindDonations
    const datesOk = Boolean(form.dateStart && form.dateEnd)
    const organizerOk = form.organizer.trim().length > 0
    const passcodeOk = form.visibility !== "private" || form.eventPasscode.trim().length > 0
    const ngoOk = !form.ngoCollaboration || form.ngoOrganization.trim().length > 0
    return (
      donationTypeSelected &&
      financialOk &&
      inKindOk &&
      datesOk &&
      organizerOk &&
      passcodeOk &&
      ngoOk
    )
  }

  if (stepId === "about") {
    return (
      form.description.trim().length > 0 &&
      form.categories.length > 0 &&
      form.requirements.trim().length > 0 &&
      form.skills.length > 0
    )
  }

  if (stepId === "settings") {
    const locationOk =
      form.volunteeringType === "virtual" || form.location.trim().length > 0
    const meetLinkOk =
      form.volunteeringType !== "virtual" || form.googleMeetLink.trim().length > 0
    const capacityOk =
      !form.hasCapacityLimit || !getCapacityError(form.capacity, form.hasCapacityLimit, isPremium)
    const ngoOk = !form.ngoCollaboration || form.ngoOrganization.trim().length > 0
    const datesOk = Boolean(form.dateStart && form.dateEnd)
    const timesOk = Boolean(form.timeStart && form.timeEnd)
    const organizerOk = form.organizer.trim().length > 0
    const passcodeOk = form.visibility !== "private" || form.eventPasscode.trim().length > 0
    const donationsOk =
      !form.receiveDonations ||
      (form.donationAmount > 0 && !getDonationAmountError(form.donationAmount, isPremium))
    const reliabilityScore = clampReliabilityScore(form.reliabilityScore)
    const certificateOk =
      form.certificateAccess !== "automated" ||
      (isPremium &&
        reliabilityScore >= RELIABILITY_SCORE_MIN &&
        reliabilityScore <= RELIABILITY_SCORE_MAX)

    return (
      locationOk &&
      meetLinkOk &&
      capacityOk &&
      datesOk &&
      timesOk &&
      organizerOk &&
      passcodeOk &&
      ngoOk &&
      donationsOk &&
      certificateOk
    )
  }

  return false
}

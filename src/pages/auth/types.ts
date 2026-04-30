export type RouteStep =
  | "create-account"
  | "check-email"
  | "basic-information"
  | "business-owner"
  | "business-verification"
  | "ngo-profile"
  | "review"

/** Steps rendered under `/auth/onboarding/:step` (after create-account). */
export type OnboardingFlowStep = Exclude<RouteStep, "create-account">

export type OnboardingData = {
  createAccount: { email: string }
  basicInformation: { businessName: string; cacNumber: string; address: string; website: string }
  businessOwner: {
    fullName: string
    dialCode: string
    phone: string
    idType: string
    nin: string
  }
  verification: {
    cacDocument: string
    ngoRegistrationCertificate: string
    proofOfAddress: string
    scumlDocument: string
  }
  ngoProfile: { logoName: string; mission: string; causes: string[]; activities: string }
}

export const defaultData: OnboardingData = {
  createAccount: { email: "" },
  basicInformation: { businessName: "", cacNumber: "", address: "", website: "" },
  businessOwner: {
    fullName: "",
    dialCode: "+234",
    phone: "",
    idType: "National ID card",
    nin: "",
  },
  verification: {
    cacDocument: "",
    ngoRegistrationCertificate: "",
    proofOfAddress: "",
    scumlDocument: "",
  },
  ngoProfile: { logoName: "", mission: "", causes: [], activities: "" },
}

export function mergeOnboardingFromPartial(parsed: Partial<OnboardingData> | null | undefined): OnboardingData {
  if (!parsed) return defaultData
  return {
    createAccount: { ...defaultData.createAccount, ...parsed.createAccount },
    basicInformation: { ...defaultData.basicInformation, ...parsed.basicInformation },
    businessOwner: { ...defaultData.businessOwner, ...parsed.businessOwner },
    verification: { ...defaultData.verification, ...parsed.verification },
    ngoProfile: { ...defaultData.ngoProfile, ...parsed.ngoProfile },
  }
}

export const onboardingFlowSteps: OnboardingFlowStep[] = [
  "check-email",
  "basic-information",
  "business-owner",
  "business-verification",
  "ngo-profile",
  "review",
]

export const routeToSidebarIndex: Partial<Record<OnboardingFlowStep, number>> = {
  "basic-information": 0,
  "business-owner": 1,
  "business-verification": 2,
  "ngo-profile": 3,
  review: 4,
}

export {
  AUTH_CREATE_ACCOUNT_PATH,
  AUTH_HOME_PATH,
  AUTH_INVITE_PATH,
  AUTH_LOGIN_PATH,
  AUTH_ONBOARDING_PATH,
} from "../../lib/auth-paths"

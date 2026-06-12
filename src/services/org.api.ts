import type { ApiClient } from "../lib/api/client"
import type { ApiDataResponse } from "../lib/api/types"

/** Matches `deriveScenarioFromOrgStatus` in getting-started-scenarios. */
export type OrgSetupStatus = {
  onboarding: "in_progress" | "under_review" | "verified"
  bank: boolean
  invite: boolean
  event: boolean
}

export function createOrgApi(client: ApiClient) {
  return {
    getSetupStatus() {
      return client.get<ApiDataResponse<OrgSetupStatus>>("/org/setup-status")
    },
  }
}

export type OrgApi = ReturnType<typeof createOrgApi>

import { apiRequest } from "./client"
import type { ApiDataResponse } from "./types"

export type OrganisationSearchResult = {
  uuid: string
  name: string
}

type OrganisationListItem = {
  uuid?: string | null
  id?: string | number | null
  name?: string | null
  organisation_name?: string | null
  organization_name?: string | null
}

function readOrgName(item: OrganisationListItem): string {
  return (
    item.name?.trim() ||
    item.organisation_name?.trim() ||
    item.organization_name?.trim() ||
    ""
  )
}

function readOrgUuid(item: OrganisationListItem): string | null {
  if (typeof item.uuid === "string" && item.uuid.trim()) return item.uuid.trim()
  if (typeof item.id === "string" && item.id.trim()) return item.id.trim()
  return null
}

function extractOrganisationList(payload: unknown): OrganisationListItem[] {
  if (!payload || typeof payload !== "object") return []

  const data = (payload as ApiDataResponse<unknown>).data
  if (Array.isArray(data)) return data as OrganisationListItem[]
  if (data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: OrganisationListItem[] }).data
  }

  return []
}

export async function searchOrganisations(search: string, perPage = 15) {
  const params = new URLSearchParams({
    search: search.trim(),
    per_page: String(perPage),
  })

  const response = await apiRequest<ApiDataResponse<unknown>>(
    `/api/v1/volunteer/organisations/recommended?${params.toString()}`,
    { method: "GET" },
  )

  return extractOrganisationList(response)
    .map((item) => {
      const uuid = readOrgUuid(item)
      const name = readOrgName(item)
      if (!uuid || !name) return null
      return { uuid, name } satisfies OrganisationSearchResult
    })
    .filter((item): item is OrganisationSearchResult => item != null)
}

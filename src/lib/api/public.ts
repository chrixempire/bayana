import { apiRequest } from "./client"
import type { ApiSkill } from "./cause-types"

export type CauseArea = {
  id: number
  name: string
  created_at: string
  updated_at: string
}

type CauseAreasResponse = {
  success: boolean
  message: string
  data: CauseArea[]
}

type SkillsResponse = {
  success: boolean
  message: string
  data: ApiSkill[]
}

export function getCauseAreas() {
  return apiRequest<CauseAreasResponse>("/api/v1/public/cause-areas", {
    method: "GET",
    auth: false,
  })
}

export function getSkills() {
  return apiRequest<SkillsResponse>("/api/v1/public/skills", {
    method: "GET",
    auth: false,
  })
}

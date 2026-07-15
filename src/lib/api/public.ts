import { apiRequest } from "./client"

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

export function getCauseAreas() {
  return apiRequest<CauseAreasResponse>("/api/v1/public/cause-areas", {
    method: "GET",
    auth: false,
  })
}

export type ApiSkill = {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

export type ApiCauseCategory = {
  id: number
  name: string
}

export type ApiCauseSkill = {
  skill_id: number
  individuals_required?: number
  name?: string
}

export type ApiCause = {
  uuid?: string
  id?: string | number
  title?: string
  description?: string
  requirements?: string
  volunteering_type?: string
  google_meet_link?: string | null
  address?: string | null
  max_volunteers_capacity?: number | null
  accept_donations?: boolean | number | string | null
  start_date?: string | null
  end_date?: string | null
  start_time?: string | null
  end_time?: string | null
  enable_event_reminders?: boolean | number | string | null
  reminder_time_before?: number | string | null
  visibility?: string | null
  access_code?: string | null
  certificate?: string | null
  reliability_score?: number | string | null
  org_collaboration?: boolean | number | string | null
  enable_skill_breakdown?: boolean | number | string | null
  status?: string | null
  categories?: ApiCauseCategory[]
  category?: ApiCauseCategory[]
  skills?: ApiCauseSkill[]
  images?: Array<{ url?: string; path?: string } | string>
  image?: string | string[] | null
  created_at?: string
  updated_at?: string
}

export type CauseFormLookups = {
  categoryIdByName: Record<string, number>
  skillIdByName: Record<string, number>
}

export type CausePublishStatus = "active" | "draft"

export type ApiSkill = {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

export type ApiCauseCategory = {
  id: number
  name: string
  created_at?: string
  updated_at?: string
  pivot?: {
    causes_uuid?: string
    cause_area_id?: number
    created_at?: string
    updated_at?: string
  }
}

export type ApiCauseSkillPivot = {
  causes_uuid?: string
  skill_id?: number
  individuals_required?: number
  created_at?: string
  updated_at?: string
}

export type ApiCauseSkill = {
  id?: number
  skill_id?: number
  name?: string
  individuals_required?: number
  pivot?: ApiCauseSkillPivot
  created_at?: string
  updated_at?: string
}

export type ApiCauseImage = {
  id?: number
  cause_uuid?: string
  photo_url?: string
  sort_order?: number
  created_at?: string
  updated_at?: string
}

export type ApiCause = {
  uuid?: string
  id?: string | number
  org_uuid?: string
  title?: string
  description?: string
  requirements?: string | null
  status?: string | null
  volunteering_type?: string
  google_meet_link?: string | null
  meeting_generated_at?: string | null
  address?: string | null
  country?: string | null
  max_volunteers_capacity?: number | null
  volunteers_needed?: number | null
  volunteers_joined?: number | null
  enable_skill_breakdown?: boolean | number | string | null
  accept_donations?: boolean | number | string | null
  donation_goal_amount?: number | string | null
  donation_received_amount?: number | string | null
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
  is_featured?: boolean
  view_count?: number
  created_by?: string
  created_at?: string
  updated_at?: string
  featured_until?: string | null
  urgent_until?: string | null
  cause_areas?: ApiCauseCategory[]
  categories?: ApiCauseCategory[]
  category?: ApiCauseCategory[]
  skills?: ApiCauseSkill[]
  cause_images?: ApiCauseImage[]
  collaborators?: unknown[]
  images?: Array<{ url?: string; path?: string } | string>
  image?: string | string[] | null
}

export type CauseFormLookups = {
  categoryIdByName: Record<string, number>
  skillIdByName: Record<string, number>
}

export type CausePublishStatus = "active" | "draft"

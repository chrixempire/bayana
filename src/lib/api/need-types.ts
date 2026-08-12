export type ApiNeedCategory = {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

export type ApiNeedItem = {
  id?: number
  name?: string
  description?: string
  quantity?: number
  image_url?: string | null
  image?: string | null
}

export type ApiNeedImage = {
  id?: number
  photo_url?: string
  url?: string
  sort_order?: number
}

export type ApiNeed = {
  uuid?: string
  id?: string | number
  org_uuid?: string
  title?: string
  description?: string
  need_type?: string | null
  target_amount?: number | string | null
  currency?: string | null
  in_kind?: boolean | number | string | null
  start_date?: string | null
  end_date?: string | null
  delivery_address?: string | null
  delivery_instructions?: string | null
  visibility?: string | null
  access_code?: string | null
  enable_event_reminders?: boolean | number | string | null
  reminder_time_before?: number | string | null
  org_collaboration?: boolean | number | string | null
  status?: string | null
  created_at?: string
  updated_at?: string
  cause_areas?: ApiNeedCategory[]
  categories?: ApiNeedCategory[]
  category?: ApiNeedCategory[]
  items?: ApiNeedItem[]
  need_items?: ApiNeedItem[]
  need_images?: ApiNeedImage[]
  images?: Array<{ url?: string; path?: string; photo_url?: string } | string>
  image?: string | string[] | null
  collaborators?: unknown[]
}

export type NeedFormLookups = {
  categoryIdByName: Record<string, number>
}

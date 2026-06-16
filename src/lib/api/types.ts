export type AuthUser = {
  email: string
  user_type: string
  uuid: string
  created_at: string
  updated_at: string
  email_verified_at?: string | null
  verified_at?: string | null
  email_verified?: boolean
  is_email_verified?: boolean
  is_verified?: boolean
  verification_status?: string
}

export type RegistrationResponse = {
  message: string
  data: {
    user: AuthUser
    token: string
  }
}

export type ApiMessageResponse = {
  message: string
}

export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string[]>

  constructor(message: string, status: number, fieldErrors: Record<string, string[]> = {}) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

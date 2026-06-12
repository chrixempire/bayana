export interface ApiClientOptions {
  baseURL?: string
  defaultHeaders?: HeadersInit
  getDefaultHeaders?: () => HeadersInit | undefined
  getAuthToken?: () => string | null | undefined
  onAuthRefresh?: () => Promise<string | null | undefined>
  onAuthFailure?: (error: ApiError) => void | Promise<void>
}

export interface ApiError {
  code: string
  message: string
  status: number
  details?: unknown
}

export interface ApiMessageResponse {
  message?: string
}

export interface ApiDataResponse<TData> {
  message?: string
  data: TData
}

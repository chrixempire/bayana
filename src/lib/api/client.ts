import { getAuthToken } from "../auth/session"
import { ApiError } from "./types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? ""

type ApiRequestOptions = RequestInit & {
  auth?: boolean
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { auth = true, headers, body, ...rest } = options

  if (!API_BASE_URL) {
    throw new ApiError("API base URL is not configured. Set VITE_API_BASE_URL in your environment.", 0)
  }

  const requestHeaders = new Headers(headers)
  requestHeaders.set("Accept", "application/json")

  if (body && !(body instanceof FormData) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json")
  }

  if (auth) {
    const token = getAuthToken()
    if (token) requestHeaders.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body,
  })

  const text = await response.text()
  let payload: unknown = null

  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      throw new ApiError("Unexpected response from server", response.status)
    }
  }

  if (!response.ok) {
    const errorPayload = payload as {
      message?: string
      errors?: Record<string, string[]>
      error_code?: string
    } | null
    throw new ApiError(errorPayload?.message ?? response.statusText, response.status, errorPayload?.errors ?? {})
  }

  const successPayload = payload as { success?: boolean; message?: string } | null
  if (successPayload?.success === false) {
    throw new ApiError(successPayload.message ?? "Request failed", response.status)
  }

  return payload as T
}

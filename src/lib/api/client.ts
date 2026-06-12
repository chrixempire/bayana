import { normalizeApiError } from "./errors"
import type { ApiClientOptions, ApiError } from "./types"

export interface ApiClient {
  request<TResponse>(path: string, options?: RequestInit): Promise<TResponse>
  get<TResponse>(path: string, options?: Omit<RequestInit, "method">): Promise<TResponse>
  post<TResponse>(
    path: string,
    body?: unknown,
    options?: Omit<RequestInit, "method" | "body">,
  ): Promise<TResponse>
  patch<TResponse>(
    path: string,
    body?: unknown,
    options?: Omit<RequestInit, "method" | "body">,
  ): Promise<TResponse>
  put<TResponse>(
    path: string,
    body?: unknown,
    options?: Omit<RequestInit, "method" | "body">,
  ): Promise<TResponse>
  delete<TResponse>(path: string, options?: Omit<RequestInit, "method">): Promise<TResponse>
}

export function createApiClient(options: ApiClientOptions = {}): ApiClient {
  const {
    baseURL = "",
    defaultHeaders,
    getDefaultHeaders,
    getAuthToken,
    onAuthRefresh,
    onAuthFailure,
  } = options

  async function request<TResponse>(path: string, options: RequestInit = {}): Promise<TResponse> {
    const method = (options.method ?? "GET").toUpperCase()
    const headers = new Headers(defaultHeaders)

    const dynamicDefaultHeaders = getDefaultHeaders?.()
    if (dynamicDefaultHeaders) {
      new Headers(dynamicDefaultHeaders).forEach((value, key) => {
        headers.set(key, value)
      })
    }

    new Headers(options.headers).forEach((value, key) => {
      headers.set(key, value)
    })

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && !headers.has("Idempotency-Key")) {
      headers.set("Idempotency-Key", crypto.randomUUID())
    }

    const token = getAuthToken?.()
    const hasExplicitAuthorization = headers.has("Authorization")
    const usesManagedAuth = Boolean(token && !hasExplicitAuthorization)

    if (token && !hasExplicitAuthorization) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    const executeRequest = (requestHeaders: Headers) =>
      fetch(`${baseURL}${path}`, {
        ...options,
        headers: requestHeaders,
      })

    let response = await executeRequest(headers)

    if (response.status === 401 && usesManagedAuth && onAuthRefresh) {
      try {
        const nextToken = await onAuthRefresh()
        if (nextToken) {
          headers.set("Authorization", `Bearer ${nextToken}`)
          response = await executeRequest(headers)
        }
      } catch {
        // Fall through to normalized 401 handling below.
      }
    }

    const contentType = response.headers.get("content-type") ?? ""
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text()

    if (!response.ok) {
      const normalizedError = normalizeApiError({
        ...(typeof payload === "object" && payload !== null ? payload : {}),
        status: response.status,
      } satisfies Partial<ApiError> & { status: number })

      if (response.status === 401) {
        await onAuthFailure?.(normalizedError)
      }

      throw normalizedError
    }

    return payload as TResponse
  }

  return {
    request,
    get: <TResponse>(path: string, options: Omit<RequestInit, "method"> = {}) =>
      request<TResponse>(path, { ...options, method: "GET" }),
    post: <TResponse>(path: string, body?: unknown, options: Omit<RequestInit, "method" | "body"> = {}) =>
      request<TResponse>(path, {
        ...options,
        method: "POST",
        body: body === undefined ? undefined : JSON.stringify(body),
        headers: {
          "content-type": "application/json",
          ...(options.headers ?? {}),
        },
      }),
    patch: <TResponse>(path: string, body?: unknown, options: Omit<RequestInit, "method" | "body"> = {}) =>
      request<TResponse>(path, {
        ...options,
        method: "PATCH",
        body: body === undefined ? undefined : JSON.stringify(body),
        headers: {
          "content-type": "application/json",
          ...(options.headers ?? {}),
        },
      }),
    put: <TResponse>(path: string, body?: unknown, options: Omit<RequestInit, "method" | "body"> = {}) =>
      request<TResponse>(path, {
        ...options,
        method: "PUT",
        body: body === undefined ? undefined : JSON.stringify(body),
        headers: {
          "content-type": "application/json",
          ...(options.headers ?? {}),
        },
      }),
    delete: <TResponse>(path: string, options: Omit<RequestInit, "method"> = {}) =>
      request<TResponse>(path, { ...options, method: "DELETE" }),
  }
}

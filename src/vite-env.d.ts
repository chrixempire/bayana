/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Absolute or relative API root (e.g. https://api.bayana.com or /api in dev). */
  readonly VITE_API_BASE_URL?: string
  /** Upstream URL for the Vite dev proxy when using `/api`. */
  readonly VITE_API_PROXY_TARGET?: string
  /** When `"true"`, UI should call the backend instead of local mocks. */
  readonly VITE_API_INTEGRATION_ENABLED?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

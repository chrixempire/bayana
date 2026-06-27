import { toast as sonnerToast } from "sonner"

export type ToastVariant = "default" | "success" | "destructive"

export type ToastPayload = {
  id?: string | number
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

/**
 * Thin wrapper around Sonner that preserves the existing
 * `toast({ variant, title, description })` call shape used across the app.
 */
export function toast({ id, title, description, variant = "default", duration }: ToastPayload) {
  const options = { id, description, duration }

  switch (variant) {
    case "success":
      return { id: sonnerToast.success(title, options) }
    case "destructive":
      return { id: sonnerToast.error(title, options) }
    default:
      return { id: sonnerToast(title, options) }
  }
}

export function dismiss(id?: string | number) {
  sonnerToast.dismiss(id)
}

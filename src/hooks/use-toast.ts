import { useEffect, useState } from "react"

export type ToastVariant = "default" | "success" | "destructive"

export type ToasterToast = {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

const TOAST_LIMIT = 5

let memoryToasts: ToasterToast[] = []
const listeners = new Set<() => void>()
const dismissTimers = new Map<string, ReturnType<typeof setTimeout>>()

function emit() {
  listeners.forEach((l) => l())
}

export function dismiss(id: string) {
  const t = dismissTimers.get(id)
  if (t) clearTimeout(t)
  dismissTimers.delete(id)
  memoryToasts = memoryToasts.filter((x) => x.id !== id)
  emit()
}

export function toast(payload: Omit<ToasterToast, "id"> & { id?: string; duration?: number }) {
  const id = payload.id ?? `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const item: ToasterToast = {
    id,
    title: payload.title,
    description: payload.description,
    variant: payload.variant ?? "default",
  }
  memoryToasts = [...memoryToasts, item].slice(-TOAST_LIMIT)
  emit()

  const duration = payload.duration ?? 4000
  if (duration > 0) {
    dismissTimers.set(
      id,
      setTimeout(() => dismiss(id), duration),
    )
  }

  return { id, dismiss: () => dismiss(id) }
}

export function useToastList() {
  const [list, setList] = useState<ToasterToast[]>(() => [...memoryToasts])

  useEffect(() => {
    const sync = () => setList([...memoryToasts])
    listeners.add(sync)
    sync()
    return () => {
      listeners.delete(sync)
    }
  }, [])

  return list
}

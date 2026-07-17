import { useEffect, useState } from "react"

/**
 * Briefly reports `true` on mount to surface loading skeletons, then flips to
 * `false`. Append `?loading` to the URL to hold the skeleton indefinitely for
 * design review.
 */
export function useSimulatedLoading(ms = 600): boolean {
  const hold =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).has("loading")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (hold) return
    const timer = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(timer)
  }, [ms, hold])

  return hold || loading
}

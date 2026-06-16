import { useCallback, useEffect, useRef, useState, type RefObject } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"

type ListScrollFadeHintProps = {
  listRef: RefObject<HTMLElement | null>
  fadeHeight?: number
  /** Pixels scrolled per tick while hovering the chevron. */
  scrollStepPx?: number
  /** Interval between scroll ticks (ms). */
  scrollIntervalMs?: number
  deps?: readonly unknown[]
  className?: string
}

export function ListScrollFadeHint({
  listRef,
  fadeHeight = 40,
  scrollStepPx = 28,
  scrollIntervalMs = 48,
  deps = [],
  className,
}: ListScrollFadeHintProps) {
  const [showFade, setShowFade] = useState(false)
  const scrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const syncScrollState = useCallback(() => {
    const list = listRef.current
    if (!list) {
      setShowFade(false)
      return
    }
    const canScroll = list.scrollHeight > list.clientHeight + 2
    const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 2
    setShowFade(canScroll && !atBottom)
  }, [listRef])

  const scrollListDown = useCallback(() => {
    const list = listRef.current
    if (!list) return false

    const maxScroll = list.scrollHeight - list.clientHeight
    if (list.scrollTop >= maxScroll - 1) {
      syncScrollState()
      return false
    }

    list.scrollTop = Math.min(list.scrollTop + scrollStepPx, maxScroll)
    syncScrollState()
    return list.scrollTop < maxScroll - 1
  }, [listRef, scrollStepPx, syncScrollState])

  const stopAutoScroll = useCallback(() => {
    if (scrollTimerRef.current) {
      clearInterval(scrollTimerRef.current)
      scrollTimerRef.current = null
    }
  }, [])

  const startAutoScroll = useCallback(() => {
    stopAutoScroll()
    scrollListDown()
    scrollTimerRef.current = setInterval(() => {
      const hasMore = scrollListDown()
      if (!hasMore) stopAutoScroll()
    }, scrollIntervalMs)
  }, [scrollIntervalMs, scrollListDown, stopAutoScroll])

  useEffect(() => {
    syncScrollState()
    const list = listRef.current
    if (!list) return

    list.addEventListener("scroll", syncScrollState, { passive: true })
    window.addEventListener("resize", syncScrollState)

    return () => {
      list.removeEventListener("scroll", syncScrollState)
      window.removeEventListener("resize", syncScrollState)
      stopAutoScroll()
    }
  }, [deps, listRef, stopAutoScroll, syncScrollState])

  if (!showFade) return null

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-10 rounded-b-xl bg-gradient-to-t from-bg-canvas via-bg-canvas/95 to-transparent",
        className,
      )}
      style={{ height: fadeHeight }}
      aria-hidden
    >
      <button
        type="button"
        className="pointer-events-auto absolute bottom-1 left-1/2 inline-flex size-8 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full text-icon-neutral transition-colors hover:bg-bg-default-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-input-active"
        aria-label="Scroll list down"
        onMouseEnter={startAutoScroll}
        onMouseLeave={stopAutoScroll}
        onFocus={startAutoScroll}
        onBlur={stopAutoScroll}
        onClick={(event) => {
          event.preventDefault()
          scrollListDown()
        }}
      >
        <ChevronDown className="size-4" />
      </button>
    </div>
  )
}

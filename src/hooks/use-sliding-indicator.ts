import { useLayoutEffect, useRef, useState, type RefObject } from "react"

export type SlidingIndicatorBox = {
  left: number
  top: number
  width: number
  height: number
}

const EMPTY: SlidingIndicatorBox = { left: 0, top: 0, width: 0, height: 0 }

/**
 * Measures the active tab relative to a tablist container for sliding indicators.
 */
export function useSlidingIndicator(
  activeId: string,
  deps: unknown[] = [],
): {
  listRef: RefObject<HTMLDivElement | null>
  setTabRef: (id: string, element: HTMLElement | null) => void
  indicator: SlidingIndicatorBox
  ready: boolean
} {
  const listRef = useRef<HTMLDivElement | null>(null)
  const tabRefs = useRef<Record<string, HTMLElement | null>>({})
  const [indicator, setIndicator] = useState<SlidingIndicatorBox>(EMPTY)
  const [ready, setReady] = useState(false)

  const setTabRef = (id: string, element: HTMLElement | null) => {
    tabRefs.current[id] = element
  }

  useLayoutEffect(() => {
    const update = () => {
      const list = listRef.current
      const active = tabRefs.current[activeId]
      if (!list || !active) return

      const listRect = list.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()

      setIndicator({
        left: activeRect.left - listRect.left + list.scrollLeft,
        top: activeRect.top - listRect.top + list.scrollTop,
        width: activeRect.width,
        height: activeRect.height,
      })
      setReady(true)
    }

    update()

    const list = listRef.current
    if (!list) return

    const observer = new ResizeObserver(update)
    observer.observe(list)
    for (const el of Object.values(tabRefs.current)) {
      if (el) observer.observe(el)
    }
    list.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)

    return () => {
      observer.disconnect()
      list.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller controls extra deps
  }, [activeId, ...deps])

  return { listRef, setTabRef, indicator, ready }
}

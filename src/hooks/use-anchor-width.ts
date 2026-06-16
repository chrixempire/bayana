import { useLayoutEffect, useState } from "react"
import type { RefObject } from "react"

/** Match popover panel width to an anchor element while open. */
export function useAnchorWidth(open: boolean, anchorRef: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState<number | undefined>()

  useLayoutEffect(() => {
    if (!open) return

    const element = anchorRef.current
    if (!element) return

    const update = () => setWidth(element.offsetWidth)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [anchorRef, open])

  return width
}

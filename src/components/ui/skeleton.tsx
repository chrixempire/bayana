import { cn } from "../../lib/utils"

/** Shimmer placeholder used in loading states. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-bg-default-100", className)} aria-hidden />
}

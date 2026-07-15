import { cn } from "../../lib/utils"

export function BayanaLogo({
  className,
  alt = "Bayana",
  src = "/bayana-logo.svg",
}: {
  className?: string
  alt?: string
  src?: string
}) {
  return <img src={src} alt={alt} className={cn("h-auto w-auto", className)} />
}

import { cn } from "../../lib/utils"

export function InfoCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4 shrink-0", className)} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 7.25v3.5M8 5.5h.01" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

export function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-3.5 shrink-0", className)} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M4.5 9.5 9.5 4.5M9.5 4.5H6M9.5 4.5V8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4 shrink-0", className)} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="m10.5 10.5 2.75 2.75" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

export function ChevronUpDownIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-3.5 shrink-0 opacity-70", className)} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M4 5.5 7 2.5l3 3M4 8.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4 shrink-0", className)} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 1.75a4.25 4.25 0 0 0-2.5 7.72V11h5V9.47A4.25 4.25 0 0 0 8 1.75ZM6.5 11.75h3M7.25 13.25h1.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-[18px] shrink-0", className)} viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M7.25 14.25a1.75 1.75 0 0 0 3.5 0M3.5 11.25h11a1.5 1.5 0 0 0-1.5-1.5c0-2.5-1.25-3.75-1.25-6.25a3.25 3.25 0 1 0-6.5 0c0 2.5-1.25 3.75-1.25 6.25a1.5 1.5 0 0 0-1.5 1.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-2.5 shrink-0", className)} viewBox="0 0 10 10" fill="none" aria-hidden>
      <path
        d="M1.5 7.25h7l-1-4.5L5.5 4.5 5 2l-.5 2.5L2.5 2.75l-1 4.5Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-3.5 shrink-0", className)} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 7h9M7.5 3.5 11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-5 shrink-0", className)} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.75 10.25 8.75 12.25l4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

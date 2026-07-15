/** Two-bubble placeholder shown in the message thread pane when no conversation is selected. */
export function EmptyMessagesIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 130"
      fill="none"
      className={className ?? "w-[180px] text-bg-default-100"}
      aria-hidden
    >
      {/* large bubble */}
      <path
        d="M18 12h96a12 12 0 0 1 12 12v46a12 12 0 0 1-12 12H54l-22 20V82H18A12 12 0 0 1 6 70V24A12 12 0 0 1 18 12Z"
        fill="currentColor"
      />
      <circle cx="48" cy="47" r="5" fill="#ffffff" />
      <circle cx="66" cy="47" r="5" fill="#ffffff" />
      <circle cx="84" cy="47" r="5" fill="#ffffff" />
      {/* small bubble */}
      <path
        d="M124 56h34a10 10 0 0 1 10 10v26a10 10 0 0 1-10 10h-6v14l-16-14h-12a10 10 0 0 1-10-10V66a10 10 0 0 1 10-10Z"
        fill="currentColor"
        stroke="#ffffff"
        strokeWidth="4"
      />
      <circle cx="134" cy="79" r="3.5" fill="#ffffff" />
      <circle cx="147" cy="79" r="3.5" fill="#ffffff" />
      <circle cx="160" cy="79" r="3.5" fill="#ffffff" />
    </svg>
  )
}

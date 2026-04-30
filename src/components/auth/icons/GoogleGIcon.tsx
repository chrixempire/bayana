/** 16×16 Google “G” colours per brand guidelines (decorative). */
export function GoogleGIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" width={16} height={16} aria-hidden>
      <path
        fill="#4285F4"
        d="M15.2 8.17c0-.5-.05-1-.13-1.47H8v2.78h4.04c-.17.93-.68 1.72-1.45 2.25v1.87h2.35c1.37-1.26 2.16-3.12 2.16-5.43Z"
      />
      <path
        fill="#34A853"
        d="M8 16c1.94 0 3.58-.64 4.77-1.74l-2.35-1.87c-.65.44-1.48.7-2.42.7-1.86 0-3.44-1.26-4-2.95H1.6v1.93C2.78 14.25 5.11 16 8 16Z"
      />
      <path
        fill="#FBBC05"
        d="M4 9.14c-.15-.44-.24-.91-.24-1.4s.09-.96.24-1.4V4.41H1.6A7.97 7.97 0 0 0 0 7.74c0 1.28.31 2.5.86 3.59l2.54-1.19Z"
      />
      <path
        fill="#EA4335"
        d="M8 3.25c1.05 0 1.99.36 2.73 1.07l2.05-2.05C11.57.81 9.93 0 8 0 5.11 0 2.78 1.75 1.6 4.41L4 6.34c.56-1.69 2.14-2.95 4-2.95Z"
      />
    </svg>
  )
}

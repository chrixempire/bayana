import { BayanaLogo } from "../components/brand/BayanaLogo"

export function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-canvas px-6 text-text-default-500">
      <div className="flex flex-col items-center gap-6 text-center">
        <BayanaLogo className="h-12 w-auto" />
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-[-0.2px]">I am home now</h1>
        <p className="max-w-[420px] text-sm leading-6 text-text-neutral-400">
          This is the temporary landing page after email verification and login handoff.
        </p>
      </div>
    </main>
  )
}

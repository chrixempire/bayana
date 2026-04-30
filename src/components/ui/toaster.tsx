import * as ToastPrimitive from "@radix-ui/react-toast"
import { dismiss, useToastList, type ToastVariant } from "../../hooks/use-toast"
import { cn } from "../../lib/utils"

const variantStyles: Record<ToastVariant, string> = {
  default:
    "border-l-[#b8c0cc] bg-[#eef2f6] [--toast-accent:#b8c0cc]",
  success:
    "border-l-[#12802a] bg-[var(--color-bg-success-soft)] [--toast-accent:#12802a]",
  destructive:
    "border-l-[#94233a] bg-[var(--color-bg-negative-soft)] [--toast-accent:#94233a]",
}

export function Toaster() {
  const toasts = useToastList()

  return (
    <ToastPrimitive.Provider label="Notifications" duration={5000} swipeDirection="right">
      {toasts.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          type="foreground"
          duration={Number.POSITIVE_INFINITY}
          className={cn(
            "toast-root group pointer-events-auto relative flex w-full flex-col gap-1 rounded-lg border border-[#e1e5ea] border-l-4 p-4 pr-10 shadow-[0_8px_24px_rgba(44,50,55,0.12)]",
            variantStyles[t.variant ?? "default"],
          )}
          onOpenChange={(open) => {
            if (!open) dismiss(t.id)
          }}
        >
          <div className="grid gap-1">
            <ToastPrimitive.Title className="text-sm font-semibold text-[#2c3237]">
              {t.title}
            </ToastPrimitive.Title>
            {t.description ? (
              <ToastPrimitive.Description className="text-sm leading-snug text-[#656f78]">
                {t.description}
              </ToastPrimitive.Description>
            ) : null}
          </div>
          <ToastPrimitive.Close
            type="button"
            className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-md text-[#76808b] opacity-70 transition hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#3695e6]/40"
            aria-label="Close"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed top-4 right-4 z-[100] flex max-h-[100dvh] w-[min(100vw-2rem,420px)] flex-col-reverse gap-2 outline-none" />
    </ToastPrimitive.Provider>
  )
}

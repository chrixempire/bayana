import { Toaster as Sonner, type ToasterProps } from "sonner"

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "rounded-lg shadow-[0_8px_24px_rgba(44,50,55,0.12)]",
          title: "text-sm font-semibold",
          description: "text-sm leading-snug",
        },
      }}
      {...props}
    />
  )
}

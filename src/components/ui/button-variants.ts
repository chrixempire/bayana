import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[18px] border text-sm font-semibold tracking-[0.01em] transition-all outline-none focus-visible:ring-2 focus-visible:ring-border-input-active focus-visible:ring-offset-2 focus-visible:ring-offset-bg-canvas disabled:pointer-events-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "border-button-primary-border bg-button-primary text-text-on-solid-bg shadow-button-primary hover:bg-button-primary-clicked hover:shadow-none active:border-button-primary-active-border active:bg-button-primary-clicked active:shadow-none",
        destructive:
          "border-button-destructive-border bg-button-negative text-text-on-solid-bg shadow-button-negative hover:border-button-destructive-active-border hover:bg-button-negative-clicked hover:shadow-none active:border-button-destructive-active-border active:bg-button-negative-clicked active:shadow-none",
        neutral:
          "border-border-default-100 bg-button-neutral text-text-default-500 shadow-button-neutral hover:border-transparent hover:bg-button-neutral-clicked hover:shadow-none active:border-transparent active:bg-button-neutral-clicked active:shadow-none",
        disabled:
          "border-transparent bg-button-disabled text-text-disabled-300/60 shadow-none",
        ghost:
          "border-transparent bg-transparent text-text-default-500 shadow-none hover:bg-button-neutral-clicked active:bg-button-neutral-clicked",
        text:
          "border-transparent bg-transparent px-0 text-text-default-500 shadow-none hover:bg-button-neutral-clicked active:bg-button-neutral-clicked",
        textDisabled:
          "border-transparent bg-button-disabled text-text-disabled-300/60 shadow-none",
      },
      size: {
        sm: "h-[36px] min-h-[36px] px-4 text-[0.8rem]",
        default: "h-11 min-h-11 px-6",
        lg: "h-[44px] min-h-[44px] px-7",
        xl: "h-[52px] min-h-[52px] px-8 text-[1.05rem]",
        icon: "size-11 rounded-full",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      block: false,
    },
  },
)

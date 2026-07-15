import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const radioItemVariants = cva(
  "flex shrink-0 items-center justify-center gap-[8px] rounded-full border outline-none transition-all focus-visible:ring-2 focus-visible:ring-border-input-active focus-visible:ring-offset-2 data-[state=checked]:border-bg-accent data-[state=checked]:bg-bg-accent data-[state=unchecked]:border-border-default-100 data-[state=unchecked]:bg-white disabled:cursor-not-allowed disabled:opacity-100 disabled:data-[state=checked]:border-transparent disabled:data-[state=checked]:bg-control-disabled-checked disabled:data-[state=unchecked]:border-control-disabled-border disabled:data-[state=unchecked]:bg-white",
  {
    variants: {
      size: {
        default:
          "size-[22px] p-[7px] shadow-control-pressed data-[state=unchecked]:shadow-control-elevated disabled:data-[state=checked]:shadow-none disabled:data-[state=unchecked]:shadow-none",
        sm: "size-[16px] p-[4px] shadow-control-pressed data-[state=unchecked]:shadow-control-elevated disabled:data-[state=checked]:shadow-none disabled:data-[state=unchecked]:shadow-none",
      },
    },
    defaultVariants: { size: "default" },
  },
)

const radioIndicatorVariants = cva("flex size-full items-center justify-center", {
  variants: { size: { default: "size-full", sm: "size-full" } },
  defaultVariants: { size: "default" },
})

function RadioDot({ className }: { className?: string }) {
  return <span className={cn("rounded-full bg-white", className)} aria-hidden="true" />
}

export type RadioGroupProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} />
}

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioItemVariants> {}

export function RadioGroupItem({ className, size, disabled, ...props }: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item disabled={disabled} className={cn(radioItemVariants({ size }), className)} {...props}>
      <RadioGroupPrimitive.Indicator className={cn(radioIndicatorVariants({ size }))}>
        <RadioDot className={size === "sm" ? "size-[5px]" : "size-[6px]"} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

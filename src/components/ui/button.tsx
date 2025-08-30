import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap rounded-md text-sm font-medium",
  "transition-all duration-300",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
    "shrink-0 [&_svg]:shrink-0",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
    "aria-invalid:ring-destructive/20"
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "glass-button",
          "bg-[var(--primary)] text-[var(--primary-foreground)]",
        "hover:bg-[var(--primary)]/80 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:shadow-[0_0_16px_4px_var(--primary)]",
        "active:scale-[0.98] active:shadow-md",
        "shadow-lg shadow-[var(--primary)]/20",
          "backdrop-blur-md",
          "transition-all duration-300"
        ].join(" "),
        destructive: [
          "glass-button",
          "bg-[var(--destructive)] text-[var(--destructive-foreground)]",
          "hover:bg-[var(--destructive)]/80 hover:shadow-xl hover:shadow-[var(--destructive)]/30",
          "active:scale-[0.98] active:shadow-md",
          "shadow-lg shadow-[var(--destructive)]/20",
          "backdrop-blur-md",
          "transition-all duration-300"
        ].join(" "),
        outline: [
          "glass-button",
          "border-2 border-[var(--primary)]/20",
          "hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/40 hover:shadow-lg hover:shadow-[var(--primary)]/10",
          "active:scale-[0.98] active:shadow-md",
          "backdrop-blur-md",
          "transition-all duration-300"
        ].join(" "),
        secondary: [
          "glass-button",
          "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
          "hover:bg-[var(--secondary)]/80 hover:shadow-xl hover:shadow-[var(--secondary)]/30",
          "active:scale-[0.98] active:shadow-md",
          "shadow-lg shadow-[var(--secondary)]/20",
          "backdrop-blur-md",
          "transition-all duration-300"
        ].join(" "),
        ghost: [
          "hover:bg-[var(--primary)]/10 hover:shadow-lg hover:shadow-[var(--primary)]/5",
          "hover:text-[var(--primary)]",
          "active:scale-[0.98] active:shadow-md",
          "transition-all duration-300"
        ].join(" "),
        link: [
          "text-[var(--primary)] underline-offset-4",
          "hover:underline hover:text-[var(--primary)]/80",
          "transition-colors duration-300"
        ].join(" "),
        glass: [
          "glass-gradient",
          "border border-white/20",
          "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
          "backdrop-blur-[4px]",
          "hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.47)]",
          "hover:backdrop-blur-[8px]",
          "active:scale-[0.98]",
          "transition-all duration-300"
        ].join(" ")
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 rounded-md text-xs",
        lg: "h-11 px-6 rounded-md text-base",
        icon: "size-10 p-2"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

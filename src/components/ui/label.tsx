"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[var(--foreground)]"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
    // Add motion for entrance and hover/tap
    asChild
  >
    <span>
      {/* Fluid entrance animation */}
      <span
        style={{ display: 'inline-block' }}
        className={cn(className)}
        tabIndex={0}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.transition = 'transform 0.2s cubic-bezier(0.4,0,0.2,1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onMouseDown={e => {
          e.currentTarget.style.transform = 'scale(0.96)';
        }}
        onMouseUp={e => {
          e.currentTarget.style.transform = 'scale(1.08)';
        }}
      >
        {props.children}
      </span>
    </span>
  </LabelPrimitive.Root>
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

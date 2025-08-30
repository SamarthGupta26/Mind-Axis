"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-transform duration-200 hover:shadow-[0_0_16px_4px_var(--primary)]",
            className
          )}
          ref={ref}
          {...props}
          // Add interactive animation
          onFocus={e => {
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.transition = 'transform 0.2s cubic-bezier(0.4,0,0.2,1)';
          }}
          onBlur={e => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

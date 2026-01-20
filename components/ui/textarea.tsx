import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          // Default light theme styles
          "bg-white text-black border-champagne-gold/30 placeholder:text-black/50",
          // Dark theme placeholder - will be overridden by globals.css for dark backgrounds
          "dark:placeholder:text-gray-300",
          // Allow overrides - if className includes text-white or bg-gray, use those
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

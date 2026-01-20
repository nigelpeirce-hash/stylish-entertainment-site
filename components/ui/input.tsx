import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
Input.displayName = "Input"

export { Input }

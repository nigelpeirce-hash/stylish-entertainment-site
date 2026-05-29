"use client";

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"

interface SliderProps {
  children: React.ReactNode
  className?: string
}

export function Slider({ children, className }: SliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  
  // Use ref to store stable children array - only update when count actually changes
  // This prevents infinite loops from children prop reference changes on every render
  const childrenRef = React.useRef<React.ReactNode[]>([])
  const countRef = React.useRef(0)
  
  const currentCount = React.Children.count(children)
  
  // Initialize or update children array if the count changed (actual content change)
  if (currentCount !== countRef.current || childrenRef.current.length === 0) {
    childrenRef.current = React.Children.toArray(children)
    countRef.current = currentCount
  }
  
  const childrenArray = childrenRef.current
  const totalSlides = childrenArray.length

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div className="overflow-hidden h-full">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {childrenArray.map((child, index) => (
            <div key={index} className="min-w-full h-full">
              {child}
            </div>
          ))}
        </div>
      </div>
      {totalSlides > 1 && (
        <>
          {/* Previous Button – compact size per design preference */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 bg-gray-900/95 hover:bg-champagne-gold border border-champagne-gold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-9 h-9 sm:w-10 sm:h-10 group"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-champagne-gold group-hover:text-gray-900 transition-colors" />
          </Button>
          
          {/* Next Button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 bg-gray-900/95 hover:bg-champagne-gold border border-champagne-gold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-9 h-9 sm:w-10 sm:h-10 group"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-champagne-gold group-hover:text-gray-900 transition-colors" />
          </Button>
          
          {/* Slide Counter */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 bg-gray-900/95 backdrop-blur-sm border border-champagne-gold rounded-full px-3 py-1.5 shadow-lg">
            <span className="text-xs sm:text-sm font-bold text-champagne-gold">
              {currentIndex + 1} / {totalSlides}
            </span>
          </div>
          
          {/* Navigation Dots – compact size per design preference */}
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 z-10 bg-gray-900/95 backdrop-blur-sm px-2 py-1.5 rounded-full shadow-lg border border-champagne-gold/50">
            {childrenArray.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110",
                  index === currentIndex
                    ? "w-8 h-2 bg-champagne-gold shadow-md"
                    : "w-2 h-2 bg-gray-400 hover:bg-gray-300"
                )}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation Hint Text */}
          <div className="absolute bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2 z-10 bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-champagne-gold/50">
            <p className="text-[10px] sm:text-xs text-champagne-gold font-medium">
              Swipe or tap to navigate
            </p>
          </div>
        </>
      )}
    </div>
  )
}

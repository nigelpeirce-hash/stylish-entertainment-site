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
  const childrenArray = React.Children.toArray(children)
  const totalSlides = childrenArray.length

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {childrenArray.map((child, index) => (
            <div key={index} className="min-w-full">
              {child}
            </div>
          ))}
        </div>
      </div>
      {totalSlides > 1 && (
        <>
          {/* Previous Button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-champagne-gold border-2 border-champagne-gold shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 w-12 h-12 sm:w-14 sm:h-14 group"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7 text-champagne-gold group-hover:text-white transition-colors" />
          </Button>
          
          {/* Next Button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-champagne-gold border-2 border-champagne-gold shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 w-12 h-12 sm:w-14 sm:h-14 group"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7 text-champagne-gold group-hover:text-white transition-colors" />
          </Button>
          
          {/* Slide Counter */}
          <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm border-2 border-champagne-gold rounded-full px-4 py-2 shadow-lg">
            <span className="text-sm sm:text-base font-bold text-champagne-gold">
              {currentIndex + 1} / {totalSlides}
            </span>
          </div>
          
          {/* Navigation Dots */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-champagne-gold/30">
            {childrenArray.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "rounded-full transition-all duration-300 hover:scale-125",
                  index === currentIndex
                    ? "w-10 h-3 bg-champagne-gold shadow-md"
                    : "w-3 h-3 bg-black/30 hover:bg-black/50"
                )}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation Hint Text */}
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-champagne-gold/30">
            <p className="text-xs sm:text-sm text-black/70 font-medium">
              <span className="hidden sm:inline">Click arrows or dots to navigate</span>
              <span className="sm:hidden">Swipe or tap</span>
            </p>
          </div>
        </>
      )}
    </div>
  )
}

"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import type { ImagePhoto } from "@/components/ImageCarousel";
import SiteLightbox from "@/components/SiteLightbox";

interface HorizontalImageCarouselProps {
  images: ImagePhoto[];
  aspectRatio?: "video" | "square" | "wide" | "tall" | "standard";
  showDots?: boolean;
  autoplayMs?: number;
  className?: string;
}

const aspectClasses: Record<string, string> = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  tall: "aspect-[3/4]",
  standard: "aspect-[4/3]",
};

export default function HorizontalImageCarousel({
  images,
  aspectRatio = "video",
  showDots = true,
  autoplayMs = 0,
  className = "",
}: HorizontalImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const multi = images.length > 1;

  useEffect(() => {
    if (autoplayMs <= 0 || !multi) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, autoplayMs);
    return () => clearInterval(timer);
  }, [autoplayMs, images.length, multi]);

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!multi) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!multi) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (images.length === 0) return null;

  if (!multi) {
    return (
      <>
        <div
          className={`relative w-full overflow-hidden rounded-xl border border-champagne-gold/30 bg-gray-900 shadow-xl cursor-pointer group ${aspectClasses[aspectRatio]} ${className}`}
          onClick={() => openLightbox(0)}
        >
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <SiteLightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={images}
        />
      </>
    );
  }

  return (
    <>
      <div className={`relative w-full max-w-5xl mx-auto group ${className}`}>
        <div
          className={`relative overflow-hidden rounded-xl border border-champagne-gold/30 bg-gray-900 shadow-xl cursor-pointer ${aspectClasses[aspectRatio]}`}
          onClick={() => openLightbox(currentIndex)}
        >
          <div
            className="flex transition-transform duration-500 ease-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="min-w-full w-full flex-shrink-0 relative h-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-champagne-gold/80 border border-champagne-gold/50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-champagne-gold/80 border border-champagne-gold/50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </button>

          {showDots && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-5 md:w-6 h-1.5 bg-champagne-gold"
                      : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <SiteLightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images}
        onView={setLightboxIndex}
      />
    </>
  );
}

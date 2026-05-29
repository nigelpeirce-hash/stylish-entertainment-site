"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { ImagePhoto } from "@/components/ImageCarousel";
import { LIGHTBOX_CAROUSEL, LIGHTBOX_CONTROLLER, toLightboxSlides } from "@/components/lightbox-config";

const Lightbox = dynamic(
  () => import("yet-another-react-lightbox"),
  { ssr: false, loading: () => null }
);

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

  useEffect(() => {
    import("yet-another-react-lightbox/styles.css");
  }, []);

  useEffect(() => {
    if (autoplayMs <= 0 || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, autoplayMs);
    return () => clearInterval(timer);
  }, [autoplayMs, images.length]);

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (images.length === 0) return null;

  if (images.length === 1) {
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
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={toLightboxSlides(images)}
          carousel={LIGHTBOX_CAROUSEL}
          controller={LIGHTBOX_CONTROLLER}
          render={{
            buttonPrev: () => (
              <button className="yarl__button yarl__button_prev" style={lightboxBtnStyle} aria-label="Previous">
                <ChevronLeft size={28} strokeWidth={3} />
              </button>
            ),
            buttonNext: () => (
              <button className="yarl__button yarl__button_next" style={lightboxBtnStyle} aria-label="Next">
                <ChevronRight size={28} strokeWidth={3} />
              </button>
            ),
          }}
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
              <div key={index} className="min-w-full relative">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading={index <= 1 ? "eager" : "lazy"}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Navigation – compact buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-champagne-gold/90 border border-champagne-gold/50 rounded-full p-1.5 md:p-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-champagne-gold/90 border border-champagne-gold/50 rounded-full p-1.5 md:p-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>

          {showDots && (
            <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
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

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={toLightboxSlides(images)}
        carousel={LIGHTBOX_CAROUSEL}
        controller={LIGHTBOX_CONTROLLER}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
        render={{
          buttonPrev: () => (
            <button className="yarl__button yarl__button_prev" style={lightboxBtnStyle} aria-label="Previous">
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
          ),
          buttonNext: () => (
            <button className="yarl__button yarl__button_next" style={lightboxBtnStyle} aria-label="Next">
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          ),
        }}
      />
    </>
  );
}

const lightboxBtnStyle: React.CSSProperties = {
  backgroundColor: "rgba(212, 175, 55, 0.9)",
  color: "#1a1a1a",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "50%",
  padding: "10px",
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
};

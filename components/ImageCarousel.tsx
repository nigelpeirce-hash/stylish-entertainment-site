"use client";

import { useState, useEffect } from "react";

const LIGHTBOX_BTN_STYLE: React.CSSProperties = {
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import { LIGHTBOX_CAROUSEL, LIGHTBOX_CONTROLLER } from "@/components/lightbox-config";

// Dynamically import Lightbox to prevent SSR/build issues
const Lightbox = dynamic(
  () => import("yet-another-react-lightbox"),
  {
    ssr: false,
    loading: () => null,
  }
);

export interface ImagePhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
}

interface ImageCarouselProps {
  images: ImagePhoto[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Load CSS only on client side
  useEffect(() => {
    import("yet-another-react-lightbox/styles.css");
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Vertical Scrolling Gallery */}
      <div className="space-y-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-full overflow-hidden rounded-lg bg-gray-900 shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-auto object-contain cursor-pointer hover:opacity-90 transition-opacity duration-300"
              onClick={() => openLightbox(index)}
              loading="lazy"
              decoding="async"
            />
            
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Lightbox - dynamically loaded, only renders on client */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images}
        carousel={LIGHTBOX_CAROUSEL}
        controller={LIGHTBOX_CONTROLLER}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
        render={{
          buttonPrev: () => (
            <button
              className="yarl__button yarl__button_prev"
              style={LIGHTBOX_BTN_STYLE}
              aria-label="Previous image"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
          ),
          buttonNext: () => (
            <button
              className="yarl__button yarl__button_next"
              style={LIGHTBOX_BTN_STYLE}
              aria-label="Next image"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          ),
        }}
      />
    </div>
  );
}

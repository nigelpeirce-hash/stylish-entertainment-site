"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "yet-another-react-lightbox/styles.css";

export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
}

interface GalleryProps {
  photos: Photo[];
  columns?: number;
}

export default function Gallery({ photos, columns = 1 }: GalleryProps) {
  const [index, setIndex] = useState(-1);

  // Normalize all images to consistent aspect ratio (4:3)
  // This ensures all images have the same width/height ratio for consistent sizing
  const normalizedPhotos = photos.map((photo) => ({
    ...photo,
    width: 1200,
    height: 900, // Force 4:3 aspect ratio for consistent sizing
  }));

  return (
    <div className="gallery-wrapper flex justify-center">
      <div className="w-full max-w-5xl">
        {/* Vertical scrolling single column layout */}
        <div className="space-y-6">
          {normalizedPhotos.map((photo, photoIndex) => (
            <div
              key={photoIndex}
              className="relative w-full overflow-hidden rounded-lg bg-gray-900 shadow-lg hover:shadow-2xl transition-shadow duration-300 group cursor-pointer"
              onClick={() => setIndex(photoIndex)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-auto object-contain hover:opacity-90 transition-opacity duration-300"
                loading="lazy"
                decoding="async"
              />
              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
      <Lightbox
        slides={normalizedPhotos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        render={{
          buttonPrev: () => (
            <button
              className="yarl__button yarl__button_prev"
              style={{
                backgroundColor: "rgba(212, 175, 55, 0.9)",
                color: "#1a1a1a",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "50%",
                padding: "16px",
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} strokeWidth={3} />
            </button>
          ),
          buttonNext: () => (
            <button
              className="yarl__button yarl__button_next"
              style={{
                backgroundColor: "rgba(212, 175, 55, 0.9)",
                color: "#1a1a1a",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "50%",
                padding: "16px",
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
              }}
              aria-label="Next image"
            >
              <ChevronRight size={28} strokeWidth={3} />
            </button>
          ),
        }}
      />
    </div>
  );
}

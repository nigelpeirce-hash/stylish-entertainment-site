"use client";

import { useState } from "react";
import SiteLightbox from "@/components/SiteLightbox";

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

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
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
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
          </div>
        ))}
      </div>

      <SiteLightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images}
        onView={setLightboxIndex}
      />
    </div>
  );
}

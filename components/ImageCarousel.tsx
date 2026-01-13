"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const currentImage = images[currentIndex];

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-900 shadow-2xl">
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="w-full h-full object-cover object-center cursor-pointer hover:scale-105 transition-transform duration-500"
          onClick={() => openLightbox(currentIndex)}
          loading="lazy"
          decoding="async"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Navigation Buttons - More Prominent */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-champagne-gold/40 hover:bg-champagne-gold/60 backdrop-blur-md rounded-full text-white transition-all duration-300 hover:scale-110 shadow-2xl border-2 border-white/50"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-8 h-8 font-bold" strokeWidth={4} />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-champagne-gold/40 hover:bg-champagne-gold/60 backdrop-blur-md rounded-full text-white transition-all duration-300 hover:scale-110 shadow-2xl border-2 border-white/50"
          aria-label="Next image"
        >
          <ChevronRight className="w-8 h-8 font-bold" strokeWidth={4} />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              index === currentIndex
                ? "border-champagne-gold scale-110 shadow-lg"
                : "border-gray-700 hover:border-gray-500 opacity-70 hover:opacity-100"
            }`}
            aria-label={`View image ${index + 1}: ${image.alt}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
      />
    </div>
  );
}

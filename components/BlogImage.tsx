"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Dynamically import Lightbox to prevent SSR/build issues
const Lightbox = dynamic(
  () => import("yet-another-react-lightbox"),
  {
    ssr: false,
    loading: () => null,
  }
);

interface BlogImageProps {
  src: string;
  alt: string;
  className?: string;
  images?: Array<{ src: string; alt: string }>;
  index?: number;
}

export default function BlogImage({ 
  src, 
  alt, 
  className = "w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity duration-300",
  images,
  index = 0
}: BlogImageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(index);

  // Load CSS only on client side
  useEffect(() => {
    import("yet-another-react-lightbox/styles.css");
  }, []);

  // If images array is provided, use it; otherwise create a single-item array
  const lightboxImages = images || [{ src, alt }];

  const openLightbox = () => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={className}
        onClick={openLightbox}
        loading="lazy"
        decoding="async"
      />
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxImages.map(img => ({ src: img.src }))}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
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
    </>
  );
}

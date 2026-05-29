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
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LIGHTBOX_CAROUSEL, LIGHTBOX_CONTROLLER, toLightboxSlides } from "@/components/lightbox-config";

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
        slides={toLightboxSlides(lightboxImages)}
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
    </>
  );
}

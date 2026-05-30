"use client";

import { useState } from "react";
import SiteLightbox from "@/components/SiteLightbox";
import type { LightboxPhoto } from "@/components/lightbox-config";

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
  index = 0,
}: BlogImageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(index);

  const lightboxImages: LightboxPhoto[] = images || [{ src, alt }];

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
      <SiteLightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxImages}
        onView={setLightboxIndex}
      />
    </>
  );
}

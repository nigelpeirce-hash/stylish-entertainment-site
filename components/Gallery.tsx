"use client";

import { useState } from "react";
import Image from "next/image";
import SiteLightbox from "@/components/SiteLightbox";

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

  const normalizedPhotos = photos.map((photo) => ({
    ...photo,
    width: 1200,
    height: 900,
  }));

  return (
    <div className="gallery-wrapper flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="space-y-6">
          {normalizedPhotos.map((photo, photoIndex) => (
            <div
              key={photoIndex}
              className="relative w-full overflow-hidden rounded-lg bg-gray-900 shadow-lg hover:shadow-2xl transition-shadow duration-300 group cursor-pointer aspect-[4/3]"
              onClick={() => setIndex(photoIndex)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain hover:opacity-90 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
      <SiteLightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index >= 0 ? index : 0}
        slides={normalizedPhotos}
      />
    </div>
  );
}

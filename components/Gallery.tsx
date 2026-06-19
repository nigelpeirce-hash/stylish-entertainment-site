"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteLightbox from "@/components/SiteLightbox";

export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
}

const DEFAULT_MOBILE_VISIBLE = 4;

interface GalleryProps {
  photos: Photo[];
  columns?: number;
  /** Photos shown on mobile before the rest are hidden until md breakpoint. */
  mobileVisibleCount?: number;
  /** Mobile-only link when the gallery is capped. Set null on /galleries/ itself. */
  viewAllHref?: string | null;
}

export default function Gallery({
  photos,
  columns = 1,
  mobileVisibleCount = DEFAULT_MOBILE_VISIBLE,
  viewAllHref = "/galleries/",
}: GalleryProps) {
  const [index, setIndex] = useState(-1);

  const normalizedPhotos = photos.map((photo) => ({
    ...photo,
    width: 1200,
    height: 900,
  }));

  const cappedOnMobile = photos.length > mobileVisibleCount;
  const showViewAllLink = cappedOnMobile && viewAllHref;

  return (
    <div className="gallery-wrapper flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="space-y-6">
          {normalizedPhotos.map((photo, photoIndex) => (
            <div
              key={photoIndex}
              className={`relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-lg bg-gray-900 shadow-lg transition-shadow duration-300 group hover:shadow-2xl${
                photoIndex >= mobileVisibleCount ? " hidden md:block" : ""
              }`}
              onClick={() => setIndex(photoIndex)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain transition-opacity duration-300 hover:opacity-90"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
            </div>
          ))}
        </div>

        {showViewAllLink ? (
          <p className="mt-6 text-center text-sm text-gray-400 md:hidden">
            Tap any photo to enlarge ·{" "}
            <Link
              href={viewAllHref}
              className="font-medium text-champagne-gold underline hover:text-gold-light"
            >
              View full gallery
            </Link>
          </p>
        ) : null}
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

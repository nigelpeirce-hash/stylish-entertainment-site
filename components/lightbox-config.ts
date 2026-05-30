import type { CSSProperties } from "react";

/** Shared yet-another-react-lightbox settings for image galleries site-wide. */

/** YARL defaults: padding 16px + spacing 30% — on mobile looks like a black margin on the right. */
export const LIGHTBOX_CAROUSEL_BASE = {
  padding: "0px" as const,
  spacing: "0px" as const,
  preload: 1,
  imageFit: "cover" as const,
};

/** @deprecated Prefer getLightboxCarousel(slideCount) so single-image galleries disable wrap-around. */
export const LIGHTBOX_CAROUSEL = LIGHTBOX_CAROUSEL_BASE;

export const LIGHTBOX_CONTROLLER = {
  closeOnBackdropClick: true,
};

/** Edge-to-edge viewport; pair with .yarl__* rules in globals.css */
export const LIGHTBOX_STYLES = {
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.96)",
  },
  slide: {
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },
};

export function getLightboxCarousel(slideCount: number) {
  return {
    ...LIGHTBOX_CAROUSEL_BASE,
    /** Single slide: no infinite prev/next in the lightbox */
    finite: slideCount <= 1,
  };
}

export const LIGHTBOX_BTN_STYLE_SM: CSSProperties = {
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

export const LIGHTBOX_BTN_STYLE_LG: CSSProperties = {
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
};

export type LightboxPhoto = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

/** Lightbox slides use natural image dimensions only (avoids layout offset from forced w/h). */
export function toLightboxSlide(photo: LightboxPhoto) {
  const slide: { src: string; alt?: string } = { src: photo.src };
  if (photo.alt) slide.alt = photo.alt;
  return slide;
}

export function toLightboxSlides(photos: LightboxPhoto[]) {
  return photos.map(toLightboxSlide);
}

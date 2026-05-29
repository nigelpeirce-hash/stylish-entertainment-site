/** Shared yet-another-react-lightbox settings for image galleries site-wide. */

/** YARL defaults: padding 16px + spacing 30% — on mobile looks like a black margin on the right. */
export const LIGHTBOX_CAROUSEL = {
  padding: 0,
  spacing: 0,
  imageFit: "contain" as const,
};

export const LIGHTBOX_CONTROLLER = {
  closeOnBackdropClick: true,
};

export type LightboxPhoto = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

/** Preserve aspect ratio in the lightbox when width/height are known. */
export function toLightboxSlide(photo: LightboxPhoto) {
  const slide: { src: string; alt?: string; width?: number; height?: number } = {
    src: photo.src,
  };
  if (photo.alt) slide.alt = photo.alt;
  if (photo.width != null && photo.height != null) {
    slide.width = photo.width;
    slide.height = photo.height;
  }
  return slide;
}

export function toLightboxSlides(photos: LightboxPhoto[]) {
  return photos.map(toLightboxSlide);
}

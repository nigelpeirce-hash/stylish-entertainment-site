/**
 * Centralized Cloudinary URL builder with responsive presets.
 * Use for all site images to ensure consistent quality and screen-size optimization.
 */

const CLOUDINARY_BASE = "https://res.cloudinary.com/drtwveoqo/image/upload";

export type CloudinaryPreset = "hero" | "gallery" | "card" | "thumbnail" | "default";

/** Transform strings per preset – optimized for display context and screen size */
const PRESETS: Record<CloudinaryPreset, string> = {
  /** Full viewport hero/slider: high quality, dpr for Retina, width cap for mobile LCP */
  hero: "f_auto,q_75,dpr_auto,w_1920",
  /** Gallery / lightbox: high quality, dpr, 1200px for masonry/display */
  gallery: "f_auto,q_85,dpr_auto,w_1200",
  /** Service cards, below-fold: balanced quality, 800px cap for mobile */
  card: "f_auto,q_75,dpr_auto,w_800",
  /** Small thumbnails, avatars */
  thumbnail: "f_auto,q_75,w_400",
  /** General display: high quality, dpr */
  default: "f_auto,q_85,dpr_auto",
};

/**
 * Extracts the path after /upload/ from a Cloudinary URL (version/filename).
 */
function getPathFromUrl(url: string): string | null {
  if (!url.includes("cloudinary.com")) return null;
  const match = url.match(/\/upload\/(?:[^/]+\/)?(.+)$/);
  return match ? match[1] : null;
}

/**
 * Builds a Cloudinary URL with the given preset.
 * @param pathOrUrl - Full Cloudinary URL or path (e.g. "v1768163840/Fairy-Light_wgdrd3.jpg")
 * @param preset - Display context for responsive settings
 */
export function cloudinaryUrl(pathOrUrl: string, preset: CloudinaryPreset = "default"): string {
  const path = pathOrUrl.includes("cloudinary.com") ? getPathFromUrl(pathOrUrl) : pathOrUrl;
  if (!path) return pathOrUrl;
  const transforms = PRESETS[preset];
  return `${CLOUDINARY_BASE}/${transforms}/${path}`;
}

/**
 * Ensures an existing Cloudinary URL uses the gallery preset (high-res display).
 * Use when migrating hardcoded URLs to standardized settings.
 */
export function toGalleryUrl(url: string): string {
  const path = getPathFromUrl(url);
  return path ? cloudinaryUrl(path, "gallery") : url;
}

/**
 * Ensures an existing Cloudinary URL uses the default preset.
 */
export function toDefaultUrl(url: string): string {
  const path = getPathFromUrl(url);
  return path ? cloudinaryUrl(path, "default") : url;
}

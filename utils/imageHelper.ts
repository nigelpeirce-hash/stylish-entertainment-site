/**
 * Image Helper Utility
 * Ensures all images have proper Cloudinary optimization, alt text, and formatting
 */

export interface ImageConfig {
  filename: string;
  version?: string;
  hash: string;
  extension: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  transformations?: string; // Additional transformations like "c_auto,g_auto,h_667,w_1000"
}

/**
 * Generates a Cloudinary URL with automatic optimization
 * @param config Image configuration object
 * @returns Optimized Cloudinary URL
 */
export function getCloudinaryUrl(config: ImageConfig): string {
  const baseUrl = "https://res.cloudinary.com/drtwveoqo/image/upload";
  
  // Build transformation string
  let transformations = "f_auto,q_auto";
  if (config.transformations) {
    transformations += `,${config.transformations}`;
  }
  
  // Build path
  let path = config.filename;
  if (config.hash) {
    path = `${config.filename}_${config.hash}`;
  }
  path += `.${config.extension}`;
  
  // Add version if provided
  if (config.version) {
    return `${baseUrl}/${transformations}/v${config.version}/${path}`;
  }
  
  return `${baseUrl}/${transformations}/${path}`;
}

/**
 * Validates that an image object has all required properties
 * @param image Image object to validate
 * @returns true if valid, throws error if not
 */
export function validateImage(image: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}): boolean {
  if (!image.src) {
    throw new Error("Image must have a src property");
  }
  
  if (!image.alt || image.alt.trim().length === 0) {
    throw new Error("Image must have descriptive alt text");
  }
  
  if (image.alt.length < 10) {
    console.warn("Alt text should be at least 10 characters for better SEO");
  }
  
  // Check if Cloudinary URL has optimization
  if (image.src.includes("res.cloudinary.com") && !image.src.includes("f_auto,q_auto")) {
    console.warn("Cloudinary URL should include f_auto,q_auto for optimization");
  }
  
  return true;
}

/**
 * Creates a properly formatted image object for galleries
 */
export function createGalleryImage(config: ImageConfig) {
  const src = getCloudinaryUrl(config);
  
  const image = {
    src,
    width: config.width || 1200,
    height: config.height || 900,
    alt: config.alt,
    ...(config.caption && { caption: config.caption }),
  };
  
  validateImage(image);
  return image;
}

/**
 * Creates a properly formatted image object for homepage slider
 */
export function createSliderImage(config: ImageConfig) {
  const src = getCloudinaryUrl(config);
  
  const image = {
    src,
    alt: config.alt,
  };
  
  validateImage(image);
  return image;
}

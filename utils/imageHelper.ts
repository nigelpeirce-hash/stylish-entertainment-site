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
 * Includes DPR (Device Pixel Ratio) support for retina displays
 * @param config Image configuration object
 * @returns Optimized Cloudinary URL
 */
export function getCloudinaryUrl(config: ImageConfig): string {
  const baseUrl = "https://res.cloudinary.com/drtwveoqo/image/upload";
  
  // Build transformation string
  // f_auto: automatic format selection (WebP, AVIF when supported)
  // q_auto: automatic quality optimization
  // dpr_auto: automatic device pixel ratio (serves 2x/3x for retina displays)
  let transformations = "f_auto,q_auto,dpr_auto";
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
  
  // Check if Cloudinary URL has DPR support for retina displays
  if (image.src.includes("res.cloudinary.com") && !image.src.includes("dpr_")) {
    console.warn("Cloudinary URL should include dpr_auto for retina display support");
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

/**
 * Adds DPR (Device Pixel Ratio) support to existing Cloudinary URLs
 * Automatically serves 2x/3x resolution images for retina displays
 * @param cloudinaryUrl Existing Cloudinary URL
 * @returns URL with dpr_auto added to transformations
 */
export function addRetinaSupport(cloudinaryUrl: string): string {
  if (!cloudinaryUrl.includes("res.cloudinary.com")) {
    return cloudinaryUrl; // Not a Cloudinary URL, return as-is
  }
  
  // If dpr_auto already exists, return as-is
  if (cloudinaryUrl.includes("dpr_auto") || cloudinaryUrl.includes("dpr_")) {
    return cloudinaryUrl;
  }
  
  // Add dpr_auto to the transformation string
  // Pattern: /f_auto,q_auto/ -> /f_auto,q_auto,dpr_auto/
  return cloudinaryUrl.replace(/\/f_auto,q_auto\//, "/f_auto,q_auto,dpr_auto/");
}

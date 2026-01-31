/**
 * Cloudinary URL utilities
 * Fixes broken Cloudinary URLs by ensuring proper transformations
 */

/**
 * Removes placeholder "?" or path fragments that break Cloudinary URLs.
 * Cloudinary URLs use path-based transformations, not query strings; a stray "?" in the path breaks the link.
 * Use this for any imageUrl from DB/props before using as img src.
 */
export function sanitizeCloudinaryUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  if (!url.includes('cloudinary.com')) return url;
  const pathOnly = url.split('?')[0];
  return pathOnly || url;
}

/**
 * Ensures a Cloudinary URL has proper transformations for display
 * If the URL already has transformations, it preserves them
 * If not, it adds standard transformations
 */
export function fixCloudinaryUrl(url: string | null | undefined, options?: {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
  /** Use dpr_auto for sharp images on Retina/HiDPI; default true for display sizes */
  dprAuto?: boolean;
}): string | null {
  if (!url) return null;
  if (!url.includes('cloudinary.com')) return url;
  url = sanitizeCloudinaryUrl(url);

  const {
    width = 400,
    height = 400,
    quality = 'auto',
    format = 'auto',
    dprAuto = false,
  } = options || {};

  const tail = dprAuto ? ',dpr_auto' : '';
  const baseTransforms = () => `f_${format},q_${quality},w_${width},h_${height},c_fill,g_face${tail}`;

  // Check if URL already has transformations
  // Cloudinary URLs with transformations look like: /upload/TRANSFORMATIONS/IMAGE_ID
  // URLs without transformations look like: /upload/IMAGE_ID or /upload/v123/IMAGE_ID
  
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const baseUrl = url.substring(0, uploadIndex + '/upload/'.length);
  const afterUpload = url.substring(uploadIndex + '/upload/'.length);
  
  // Split by '/' to separate transformations from image path
  const parts = afterUpload.split('/');
  
  // Check if first part looks like transformations (contains underscores and commas)
  // Transformations typically look like: f_auto,q_auto,w_400
  // Or it could be a version: v123
  const firstPart = parts[0];
  const hasVersion = /^v\d+$/.test(firstPart); // Version like v123
  const hasTransformations = firstPart.includes('_') && 
    (firstPart.includes('f_') || firstPart.includes('w_') || firstPart.includes('h_') || 
     firstPart.includes('c_') || firstPart.includes('q_') || firstPart.includes('dpr_') ||
     firstPart.includes('g_') || firstPart.includes('r_'));
  
  // Helper function to check if a path has a file extension
  const hasFileExtension = (path: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.ico'];
    return imageExtensions.some(ext => path.toLowerCase().endsWith(ext));
  };
  
  // Helper function to ensure URL has a file extension
  const ensureFileExtension = (path: string): string => {
    if (hasFileExtension(path)) {
      return path;
    }
    // If no extension, try .jpg as default (Cloudinary will auto-format if needed)
    // But first, check if it's a versioned path (v1/path) - in that case, append to the last part
    const pathParts = path.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    if (!hasFileExtension(lastPart)) {
      pathParts[pathParts.length - 1] = lastPart + '.jpg';
      return pathParts.join('/');
    }
    return path;
  };
  
  if (hasTransformations) {
    // URL already has transformations (e.g., f_auto,q_auto)
    // The image path is everything after the transformations
    const imagePath = parts.slice(1).join('/');
    const fixedPath = ensureFileExtension(imagePath);
    
    // Check if it has width/height transformations
    if (!firstPart.includes('w_') && !firstPart.includes('h_')) {
      const newTransforms = `${firstPart},w_${width},h_${height},c_fill,g_face${tail}`;
      return baseUrl + newTransforms + '/' + fixedPath;
    }
    
    // Already has width/height, but ensure path has extension
    if (fixedPath !== imagePath) {
      // Path was fixed (extension added), rebuild URL
      return baseUrl + firstPart + '/' + fixedPath;
    }
    return url;
  }

  // No transformations found
  // Check if first part is a version number
  if (hasVersion) {
    const imagePath = parts.slice(1).join('/');
    const fixedPath = ensureFileExtension(imagePath);
    const publicId = firstPart + '/' + fixedPath;
    return baseUrl + baseTransforms() + '/' + publicId;
  }

  const imagePath = afterUpload;
  const fixedPath = ensureFileExtension(imagePath);
  return baseUrl + baseTransforms() + '/' + fixedPath;
}

/**
 * Fixes Cloudinary URLs for email display (smaller size)
 */
export function fixCloudinaryUrlForEmail(url: string | null | undefined): string | null {
  return fixCloudinaryUrl(url, {
    width: 160,
    height: 160,
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Fixes Cloudinary URLs for thumbnail display
 */
export function fixCloudinaryUrlForThumbnail(url: string | null | undefined): string | null {
  return fixCloudinaryUrl(url, {
    width: 200,
    height: 200,
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Fixes Cloudinary URLs for card/display (medium size).
 * Uses dpr_auto for sharp images on Retina/HiDPI.
 */
export function fixCloudinaryUrlForDisplay(url: string | null | undefined): string | null {
  return fixCloudinaryUrl(url, {
    width: 400,
    height: 400,
    quality: 'auto',
    format: 'auto',
    dprAuto: true,
  });
}

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload a file to Cloudinary
 * @param base64Data Base64 encoded file data (without data URL prefix)
 * @param publicId Public ID for the file (path/filename)
 * @param resourceType Resource type (image, video, raw, etc.)
 * @returns Upload result with secure URL
 */
export async function uploadToCloudinary(
  base64Data: string,
  publicId: string,
  resourceType: string = "raw"
): Promise<{ secure_url: string; public_id: string }> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary not configured");
  }

  try {
    const result = await cloudinary.uploader.upload(
      `data:${resourceType};base64,${base64Data}`,
      {
        public_id: publicId,
        resource_type: resourceType === "application/pdf" ? "raw" : resourceType.startsWith("image/") ? "image" : "raw",
        folder: "portal-attachments",
      }
    );

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
  }
}

"use client";

import React from "react";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "@/lib/cloudinary-cld";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { format, quality, dpr } from "@cloudinary/url-gen/actions/delivery";
import { extractCloudinaryPublicId } from "@/lib/cloudinary-public-id";

export interface ResponsiveImageProps {
  /** Cloudinary public_id (e.g. "stylish-entertainment/djs/James-F-DJ_wgijk1") or full Cloudinary URL */
  publicId: string;
  alt?: string;
  className?: string;
  /** Width for fill resize; default 800 */
  width?: number;
  /** Height for fill resize; default 800 */
  height?: number;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  publicId: publicIdOrUrl,
  alt = "",
  className,
  width = 800,
  height = 800,
}) => {
  const publicId = publicIdOrUrl.includes("cloudinary.com")
    ? extractCloudinaryPublicId(publicIdOrUrl)
    : publicIdOrUrl;

  if (!publicId) return null;

  const img = cld
    .image(publicId)
    .resize(fill().width(width).height(height))
    .delivery(quality("auto"))
    .delivery(format("auto"))
    .delivery(dpr("auto"));

  return <AdvancedImage cldImg={img} alt={alt} className={className} />;
};

import { Metadata } from "next";

const baseUrl = "https://www.stylishentertainment.co.uk";

/**
 * Generate absolute canonical URL from path (relative path, no leading slash or with).
 */
export function generateCanonicalUrl(pathname: string): string {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, "");
  return cleanPath ? `${baseUrl}/${cleanPath}/` : `${baseUrl}/`;
}

export type CreateMetadataOptions = {
  title: string;
  description: string;
  /** Path for canonical and openGraph url (e.g. "contact-us" or "/private-parties"). pathname still supported for backward compat. */
  path?: string;
  /** @deprecated Use path. Kept for backward compatibility. */
  pathname?: string;
  noindex?: boolean;
  keywords?: string[];
  openGraph?: {
    images?: Array<{ url: string; width?: number; height?: number; alt: string }>;
  };
};

/**
 * Create metadata with canonical, openGraph, twitter. Supports noindex for non-public pages.
 */
export function createMetadata(metadata: CreateMetadataOptions): Metadata {
  const path = metadata.path ?? metadata.pathname ?? "";
  const canonical =
    path !== undefined && path !== null ? generateCanonicalUrl(path) : undefined;

  const base: Metadata = {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: canonical,
      siteName: "STYLISH Entertainment",
      title: metadata.title,
      description: metadata.description,
      images: metadata.openGraph?.images || [
        {
          url: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw",
          width: 1200,
          height: 630,
          alt: "Stylish Entertainment & Production - Professional DJs, Lighting Design and Venue Styling",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: metadata.openGraph?.images?.[0]?.url || "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw",
    },
  };

  if (metadata.noindex) {
    base.robots = { index: false, follow: false };
  }

  return base;
}

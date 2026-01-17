import { Metadata } from "next";

const baseUrl = "https://stylishentertainment.co.uk";

/**
 * Generate canonical URL for a page based on pathname
 */
export function generateCanonicalUrl(pathname: string): string {
  // Remove leading/trailing slashes and normalize
  const cleanPath = pathname.replace(/^\/+|\/+$/g, "");
  // Always include trailing slash for consistency
  return cleanPath ? `${baseUrl}/${cleanPath}/` : `${baseUrl}/`;
}

/**
 * Create metadata object with automatic canonical URL
 */
export function createMetadata(metadata: {
  title: string;
  description: string;
  pathname?: string;
  keywords?: string[];
  openGraph?: {
    images?: Array<{ url: string; width?: number; height?: number; alt: string }>;
  };
}): Metadata {
  const canonical = metadata.pathname 
    ? generateCanonicalUrl(metadata.pathname)
    : baseUrl;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical,
    },
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
}

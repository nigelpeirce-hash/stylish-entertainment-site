/**
 * Master Resources Manager
 * Centralised list of all PDF resources available to send to clients
 */

export interface MasterResource {
  id: string; // Unique identifier (e.g., "general-brochure")
  name: string; // Display name (e.g., "General STYLISH Entertainment Brochure")
  pdfUrl: string; // URL to the PDF (cloud storage or CDN)
  description?: string; // Optional description for admin reference
  category?: string; // Optional category for grouping (e.g., "brochures", "guides", "contracts")
}

/**
 * Master Resources Library
 * Add new PDFs here as they become available
 */
export const masterResources: MasterResource[] = [
  {
    id: "general-brochure",
    name: "General STYLISH Entertainment Brochure",
    pdfUrl: "https://storage.googleapis.com/stylish-entertainment-venue-assets/general-stylish-brochure.pdf",
    description: "Comprehensive overview of all STYLISH Entertainment services",
    category: "brochures",
  },
  {
    id: "wedding-planning-guide",
    name: "Wedding Planning Guide",
    pdfUrl: "https://storage.googleapis.com/stylish-entertainment-venue-assets/wedding-planning-guide.pdf",
    description: "Essential tips and timeline for planning your wedding entertainment",
    category: "guides",
  },
  {
    id: "music-request-template",
    name: "Music Request Template",
    pdfUrl: "https://storage.googleapis.com/stylish-entertainment-venue-assets/music-request-template.pdf",
    description: "Template for sharing your music preferences and must-play songs",
    category: "guides",
  },
  {
    id: "lighting-design-portfolio",
    name: "Lighting Design Portfolio",
    pdfUrl: "https://storage.googleapis.com/stylish-entertainment-venue-assets/lighting-design-portfolio.pdf",
    description: "Our lighting design work and inspiration gallery",
    category: "portfolios",
  },
  {
    id: "venue-styling-guide",
    name: "Venue Styling Guide",
    pdfUrl: "https://storage.googleapis.com/stylish-entertainment-venue-assets/venue-styling-guide.pdf",
    description: "Ideas and inspiration for styling your wedding venue",
    category: "guides",
  },
];

/**
 * Get all resources grouped by category
 */
export function getResourcesByCategory(): Record<string, MasterResource[]> {
  const grouped: Record<string, MasterResource[]> = {};
  
  masterResources.forEach((resource) => {
    const category = resource.category || "other";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(resource);
  });
  
  return grouped;
}

/**
 * Get resource by ID
 */
export function getResourceById(id: string): MasterResource | undefined {
  return masterResources.find((r) => r.id === id);
}

/**
 * Get all resources as a flat list
 */
export function getAllResources(): MasterResource[] {
  return masterResources;
}

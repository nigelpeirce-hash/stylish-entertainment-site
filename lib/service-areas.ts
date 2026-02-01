/**
 * Service areas – editorial tiles and county-based data.
 * Single source of truth for cohesive display across artists/djs, private-parties, venue-decoration.
 */

import { getVenueFiltersFromTestimonials } from "@/data/testimonials";

export interface ServiceRegion {
  region: string;
  counties: string[];
  description?: string;
}

/** Editorial region tiles – luxury magazine style, used site-wide. */
export interface EditorialServiceRegion {
  region: string;
  description: string;
}

/** Canonical editorial regions in display order. Nationwide Reach. Local Expertise. */
export const EDITORIAL_SERVICE_REGIONS: EditorialServiceRegion[] = [
  {
    region: "The South West & Cotswolds",
    description: "Our heartland. From the rolling hills of Somerset to the manor houses of Gloucestershire and the wilds of Devon.",
  },
  {
    region: "London & The Home Counties",
    description: "Effortless logistics for city celebrations, from Mayfair rooftops to rural estates in Surrey and Berkshire.",
  },
  {
    region: "The Midlands & Beyond",
    description: "Bringing high-end production to the heart of England, Wales, and the East.",
  },
  {
    region: "International Destinations",
    description: "We travel for the right party. From Monaco to the Mediterranean, our sounds go wherever you do.",
  },
];

/** Headline and sub-headline for editorial service areas block. */
export const EDITORIAL_SERVICE_HEADLINE = {
  headline: "Nationwide Reach. Local Expertise.",
  subheadline: "Based in the West Country, our teams are on the road weekly, bringing the STYLISH vibe to prestigious venues across the UK and Europe.",
};

export function getEditorialServiceRegions(): EditorialServiceRegion[] {
  return EDITORIAL_SERVICE_REGIONS;
}

/** Counties/regions we have testimonials from (excludes venue names like Babington House). */
function getTestimonialCounties(): string[] {
  const filters = getVenueFiltersFromTestimonials();
  const venueNames = ["Babington House"]; // Venue names to exclude from county list
  return filters.filter((f) => !venueNames.includes(f));
}

/** Map counties to regional groups. Counties without testimonials can be added for marketing but are not "evidence-based". */
const REGION_MAP: Record<string, string> = {
  // West Country / South West
  Somerset: "West Country",
  Wiltshire: "West Country",
  Devon: "West Country",
  Dorset: "West Country",
  Cornwall: "West Country",
  Gloucestershire: "West Country",
  Bristol: "West Country",
  // London & South East
  London: "London & South East",
  Surrey: "London & South East",
  Berkshire: "London & South East",
  Buckinghamshire: "London & South East",
  Essex: "London & South East",
  Hertfordshire: "London & South East",
  // South & Thames Valley
  Hampshire: "South & Thames Valley",
  Oxfordshire: "South & Thames Valley",
  // Midlands
  Warwickshire: "Midlands",
  Leicestershire: "Midlands",
  Derbyshire: "Midlands",
  Herefordshire: "Midlands",
  // Wales
  Wales: "Wales",
  // East of England
  Suffolk: "East of England",
  Norfolk: "East of England",
  // International
  Monaco: "International",
};

/** Group testimonial counties into regional blocks for display. */
export function getServiceAreasByRegion(): ServiceRegion[] {
  const counties = getTestimonialCounties();
  const byRegion = new Map<string, string[]>();

  for (const county of counties) {
    const region = REGION_MAP[county] ?? "Other";
    if (!byRegion.has(region)) byRegion.set(region, []);
    byRegion.get(region)!.push(county);
  }

  const regionOrder = [
    "West Country",
    "London & South East",
    "South & Thames Valley",
    "Midlands",
    "Wales",
    "East of England",
    "International",
    "Other",
  ];

  return regionOrder
    .filter((r) => byRegion.has(r))
    .map((region) => ({
      region,
      counties: byRegion.get(region)!.sort((a, b) => a.localeCompare(b)),
      description: getRegionDescription(region),
    }));
}

function getRegionDescription(region: string): string | undefined {
  const desc: Record<string, string> = {
    "West Country": "Our home base. Somerset, Wiltshire, Devon and the South West.",
    "London & South East": "From Mayfair to Surrey, we play London and the Home Counties.",
    "South & Thames Valley": "Hampshire, Oxfordshire and the Thames Valley.",
    Midlands: "Warwickshire, Leicestershire and the heart of England.",
    Wales: "South Wales and beyond.",
    "East of England": "Suffolk, Norfolk and the East.",
    International: "We travel. Monaco and Europe by arrangement.",
  };
  return desc[region];
}

/** Flat list of all counties we have testimonials from (for simple chips/badges). */
export function getServiceAreaCounties(): string[] {
  return getTestimonialCounties();
}

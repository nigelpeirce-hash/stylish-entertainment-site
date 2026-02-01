import { Metadata } from "next";
import PrivatePartiesClient from "./PrivatePartiesClient";

// Generate comprehensive keywords from service areas
const serviceAreaKeywords = [
  // Somerset
  "Frome party planning", "Bruton party planning", "Castle Cary party planning", "Glastonbury party planning", 
  "Wells party planning", "Taunton party planning", "Shepton Mallet party planning", "Yeovil party planning",
  "Bridgwater party planning", "Wincanton party planning", "Somerset party planning", "Somerset event production",
  // Wiltshire
  "Malmesbury party planning", "Marlborough party planning", "Devizes party planning", "Salisbury party planning",
  "Warminster party planning", "Westbury party planning", "Trowbridge party planning", "Chippenham party planning",
  "Swindon party planning", "Melksham party planning", "Wiltshire party planning", "Wiltshire event production",
  // Gloucestershire
  "South Gloucestershire party planning", "Cheltenham party planning", "Gloucester party planning", "Stroud party planning",
  "Cirencester party planning", "Tetbury party planning", "Tewkesbury party planning", "Gloucestershire party planning",
  // Bath & Bristol
  "Bath party planning", "Bristol party planning", "Clifton party planning", "Keynsham party planning",
  "Radstock party planning", "Midsomer Norton party planning", "Bath event production", "Bristol event production",
  // Dorset
  "Sherborne party planning", "Gillingham party planning", "Shaftesbury party planning", "Dorchester party planning",
  "Weymouth party planning", "Bridport party planning", "Dorset party planning", "Dorset event production",
  // Devon
  "Exeter party planning", "Honiton party planning", "Crediton party planning", "Tiverton party planning",
  "Devon party planning", "Devon event production",
  // General
  "Party planning South West", "Event production South West", "Private party planning", "Bespoke party planning",
  "Party production services", "Event planning Somerset", "Event planning Wiltshire"
];

export const metadata: Metadata = {
  title: "Private Parties | Bespoke Party Planning & Technical Production",
  description: "Full party planning and production services. Creative DJs, bands, entertainment and beautiful lighting for private parties across the UK. Serving 100+ towns. Trusted by Babington House for 20+ years.",
  keywords: [
    "Private party planning",
    "Bespoke party planning",
    "Party production services",
    "Party planning South West",
    "Event planning Somerset",
    "Event planning Wiltshire",
    "Event planning Gloucestershire",
    "Event planning Dorset",
    "Event planning Devon",
    "Bath party planning",
    "Bristol party planning",
    "Babington House party planning",
    ...serviceAreaKeywords.slice(0, 30) // Limit to avoid metadata bloat
  ],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Private Parties | Bespoke Party Planning & Technical Production",
    description: "Full party planning and production services across the UK. Serving 100+ towns.",
  },
};

// Service areas data for JSON-LD (matching the client component)
const serviceAreasForSEO = [
  {
    region: "Somerset",
    towns: [
      "Frome", "Bruton", "Castle Cary", "Glastonbury", "Wells", "Taunton",
      "Shepton Mallet", "Street", "Yeovil", "Bridgwater", "Wincanton",
      "Somerton", "Crewkerne", "Ilminster", "Chard", "Dunster", "Watchet",
      "Minehead", "Burnham-on-Sea", "Highbridge", "Cheddar", "Axbridge",
      "Wedmore", "Langport", "Martock", "South Petherton", "Milborne Port",
      "Templecombe", "Norton-sub-Hamdon", "Montacute", "Stoke-sub-Hamdon",
      "Cucklington", "Zeals", "Evercreech", "Ditcheat", "Pilton"
    ],
  },
  {
    region: "Wiltshire",
    towns: [
      "Malmesbury", "Marlborough", "Devizes", "Salisbury", "Warminster",
      "Westbury", "Trowbridge", "Bradford-on-Avon", "Chippenham", "Swindon",
      "Melksham", "Corsham", "Amesbury", "Calne", "Tidworth", "Pewsey",
      "Royal Wootton Bassett", "Ludgershall", "Tisbury", "Downton",
      "Fordingbridge", "Alderbury", "Woodford", "Redlynch", "Britford",
      "Durrington", "Bulford", "Larkhill", "Easterton", "Market Lavington",
      "Burbage", "Great Bedwyn", "Ramsbury", "Ogbourne St George"
    ],
  },
  {
    region: "Gloucestershire",
    towns: [
      "South Gloucestershire", "Cheltenham", "Gloucester", "Stroud",
      "Cirencester", "Tetbury", "Tewkesbury", "Dursley", "Thornbury",
      "Chipping Sodbury", "Yate", "Wotton-under-Edge", "Moreton-in-Marsh",
      "Fairford", "Lechlade", "Nailsworth", "Painswick", "Stonehouse",
      "Berkeley", "Lydney", "Newent", "Winchcombe", "Chipping Campden",
      "Broadway", "Bourton-on-the-Water", "Stow-on-the-Wold", "Northleach",
      "Kemble", "Sapperton", "Rodmarton", "Eastleach", "Ampney Crucis"
    ],
  },
  {
    region: "Bath",
    towns: [
      "Bath", "Midsomer Norton", "Radstock", "Keynsham", "Saltford",
      "Peasedown St John", "Combe Down", "Lansdown", "Twerton", "Oldfield Park",
      "Widcombe", "Claverton Down", "Bathampton", "Batheaston", "Bathford",
      "Compton Dando", "Wellow", "Peasedown", "Camerton", "Priston",
      "Englishcombe", "Hinton Charterhouse", "Freshford", "Limpley Stoke"
    ],
  },
  {
    region: "Bristol",
    towns: [
      "Clifton", "City Centre", "Westbury-on-Trym", "Chew Magna",
      "Bishopston", "Redland", "Hotwells", "Hanham", "Longwell Green",
      "Brislington", "Knowle", "Bedminster", "Ashton Gate", "Southville",
      "Windmill Hill", "Totterdown", "St Werburghs", "Montpelier", "Cotham",
      "Stokes Croft", "St Pauls", "Easton", "Fishponds", "Staple Hill",
      "Kingswood", "Whitchurch", "Westbury Park", "Henleaze", "Westbury Village"
    ],
  },
  {
    region: "Dorset",
    towns: [
      "Sherborne", "Gillingham", "Shaftesbury", "Dorchester", "Weymouth",
      "Bridport", "Blandford Forum", "Wimborne Minster", "Sturminster Newton",
      "Bere Regis", "Verwood", "Wareham", "Swanage", "Poole", "Bournemouth",
      "Christchurch", "Ferndown", "Wimborne", "Corfe Mullen", "Blandford St Mary",
      "Stalbridge", "Templecombe", "Milborne Port", "Puddletown", "Cerne Abbas",
      "Milton Abbas", "Abbotsbury", "Lyme Regis"
    ],
  },
  {
    region: "Devon",
    towns: [
      "Exeter", "Honiton", "Crediton", "Tiverton", "Okehampton",
      "Barnstaple", "Bideford", "South Molton", "Chulmleigh", "Dawlish",
      "Teignmouth", "Newton Abbot", "Torquay", "Paignton", "Totnes",
      "Dartmouth", "Salcombe", "Kingsbridge", "Plymouth", "Tavistock",
      "Holsworthy", "Hatherleigh", "Winkleigh", "North Tawton", "Bow"
    ],
  },
];

export default function PrivateParties() {
  // Generate comprehensive service area text for SEO
  const allTowns = serviceAreasForSEO.flatMap(area => area.towns);
  const serviceAreaText = serviceAreasForSEO
    .map(area => `${area.region}: ${area.towns.join(", ")}`)
    .join(". ");

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "STYLISH Entertainment",
    "description": "Bespoke party planning and technical production services in the South West and beyond",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "88 Weymouth Road",
      "addressLocality": "Frome",
      "addressRegion": "Somerset",
      "postalCode": "BA11 1HJ",
      "addressCountry": "GB"
    },
    "areaServed": [
      {
        "@type": "State",
        "name": "Somerset"
      },
      {
        "@type": "State",
        "name": "Wiltshire"
      },
      {
        "@type": "State",
        "name": "Gloucestershire"
      },
      {
        "@type": "State",
        "name": "Dorset"
      },
      {
        "@type": "State",
        "name": "Devon"
      },
      {
        "@type": "City",
        "name": "Bath"
      },
      {
        "@type": "City",
        "name": "Bristol"
      }
    ],
    "serviceType": [
      "Party Planning",
      "Event Production",
      "DJ Services",
      "Lighting Design",
      "Venue Styling",
      "Entertainment Services"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Party Planning Services",
      "itemListElement": serviceAreasForSEO.map((area, idx) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": `Party Planning in ${area.region}`,
          "description": `Professional party planning and production services in ${area.region}`,
          "areaServed": {
            "@type": "City",
            "name": area.towns.join(", ")
          }
        }
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* SEO-friendly hidden text with all service areas */}
      <div className="sr-only" aria-hidden="true">
        <h2>Service Areas - Party Planning & Event Production</h2>
        <p>
          STYLISH Entertainment provides bespoke party planning and technical production services in the South West and beyond. 
          We serve over 200 towns and locations including:
        </p>
        {serviceAreasForSEO.map((area, idx) => (
          <div key={idx}>
            <h3>Party Planning in {area.region}</h3>
            <p>
              We offer party planning services in {area.region} including: {area.towns.join(", ")}.
            </p>
          </div>
        ))}
        <p>
          Our comprehensive service area covers the UK. 
          Whether you&apos;re planning a private party in Frome, Malmesbury, Marlborough, Devizes, Castle Cary, Cheltenham, 
          Gloucester, Sherborne, Exeter or any of the 200+ towns we serve, we provide expert party planning and production services.
        </p>
      </div>
      <PrivatePartiesClient />
    </>
  );
}

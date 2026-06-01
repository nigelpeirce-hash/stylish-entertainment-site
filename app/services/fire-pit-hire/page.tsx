import { Metadata } from "next";
import FirePitClient from "./FirePitClient";

export const metadata: Metadata = {
  title: "Wedding Fire Pit Hire Somerset | Fire Pits for Weddings | Stylish Entertainment",
  description:
    "Wedding fire pit hire across Somerset and the South West. Create a warm wedding chill out area and outdoor gathering space alongside your dancefloor — with professional setup, safety and optional fuel. Fire pit hire Somerset for autumn and winter weddings.",
  keywords: [
    "wedding fire pit hire",
    "fire pits for weddings",
    "outdoor wedding heating",
    "wedding chill out area",
    "wedding outdoor gathering space",
    "fire pit hire Somerset",
    "wedding evening atmosphere",
    "Fire Pit Hire",
    "Outdoor Fire Pit Hire",
    "Fire Pit Hire South West",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are fire pits safe at weddings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — when they are set up and used properly. Our fire pits are professionally maintained and safety-checked. We deliver and position them for your layout; lighting and tending during the evening is normally handled by you, your venue or coordinator.",
      },
    },
    {
      "@type": "Question",
      name: "Do you supply fuel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fire-lighters and kindling are included so you can light the pits on the night. Logs and additional fuel are available at extra cost, priced according to burn time.",
      },
    },
    {
      "@type": "Question",
      name: "How many fire pits do we need?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your guest numbers and how you want the outdoor space to feel. One well-placed pit can anchor a wedding chill out area; larger lawns often benefit from two or three. We recommend a practical number for a natural wedding outdoor gathering space.",
      },
    },
    {
      "@type": "Question",
      name: "Can fire pits be used on grass?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Often yes, with the right placement and protection. We assess the site on arrival — grass, gravel, stone and paved areas are all common at country weddings.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide setup and supervision?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Delivery, positioning and collection are included. Staff to light, supervise or extinguish the fires through the evening are not included as standard — most couples arrange that through their venue, planner or wedding party.",
      },
    },
    {
      "@type": "Question",
      name: "Can fire pits be combined with festoon lighting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "They work beautifully together. Warm festoon over a lawn or courtyard, fairy lights in trees, and fire pits below create a memorable wedding evening atmosphere. Combined quotes are available alongside wedding lighting design.",
      },
    },
  ],
};

export default function FirePitHireService() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FirePitClient />
    </>
  );
}

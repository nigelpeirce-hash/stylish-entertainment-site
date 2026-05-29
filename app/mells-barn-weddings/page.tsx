import { Metadata } from "next";
import MellsBarnClient from "./MellsBarnClient";

export const metadata: Metadata = {
  title: "Mells Barn Weddings — DJs, Sound, Lighting & Styling | STYLISH Entertainment",
  description: "Mells Barn wedding DJs, professional sound, lighting and venue styling from STYLISH Entertainment. Frome-based specialists with years of experience at the venue. No travel fees within 10 miles.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can Mells Barn fit a band?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Mells Barn has ample space for live bands and professional entertainment. Our team knows the exact dimensions and power requirements, so we can coordinate seamlessly with your musicians to ensure everything fits perfectly on the day."
      }
    },
    {
      "@type": "Question",
      "name": "Is there enough power for professional lighting?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. We know Mells Barn's power circuits inside and out. With years of experience at this venue, we've mapped every outlet, circuit capacity, and rigging point. This knowledge ensures we can install professional lighting safely and efficiently, even for large-scale setups."
      }
    },
    {
      "@type": "Question",
      "name": "Where do guests stay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The award-winning Talbot Inn is directly across the road from Mells Barn, offering luxurious B&B accommodation. For larger groups, Frome has excellent options including The George Hotel and Archangel. We're happy to help you coordinate accommodation for your guests as part of our planning service."
      }
    }
  ]
};

export default function MellsBarnWeddings() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <MellsBarnClient />
    </>
  );
}

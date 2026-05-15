import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import FaqClient from "./FaqClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about wedding and event entertainment, DJs, lighting and venue styling.",
  pathname: "about/faq",
});

// IMPORTANT: these Q&As MUST match the visible copy in FaqClient.tsx exactly.
// Google penalises FAQPage structured data whose answers do not appear on the
// page. If you edit copy in FaqClient.tsx, update this array in the same PR.
const faqs: Array<{ q: string; a: string }> = [
  // --- Lighting, Styling and Production ---
  {
    q: "How Much Do you Charge?",
    a: "We need to know a few details before we can offer a quote which include size of the venue / space. Ceiling height if we are creating a canopy and access times. The most important question is have you sought permission from the venue before contacting us? some venue are very fussy about their properties however, we are always very respectful.",
  },
  {
    q: "When will you setup and de-rig?",
    a: "Our preference is to setup the day before your wedding, the wedding day will be very busy with your caterer, florist, bar-staff and photographer all wanting to access the same space as us. We try and work to your requirements for the de-rig, if your wedding is a Saturday we prefer to de-rig on a Monday however, if that isn\u2019t possible we will de-rig on Sunday.",
  },
  {
    q: "What types of lighting do you offer?",
    a: "We offer a comprehensive range of lighting solutions including LED uplighting, fairy light canopies, festoon lighting, intelligent moving lights, dance floor packages, exterior lighting and custom installations. We can create everything from subtle ambient lighting to dramatic theatrical effects tailored to your venue and style.",
  },
  {
    q: "Can you work with our venue\u2019s existing lighting?",
    a: "Yes, we can integrate our lighting design with your venue\u2019s existing lighting system. We\u2019ll assess the venue during our consultation and create a design that complements or enhances what\u2019s already there. We can also work independently if preferred.",
  },
  {
    q: "Do you provide venue styling consultations?",
    a: "Yes, we offer styling consultations to help you create a cohesive design theme for your event. We can discuss drapery, backdrops, props, furniture hire and decorative elements that will transform your venue and reflect your personal style.",
  },
  {
    q: "Can you create custom lighting designs?",
    a: "Absolutely! We specialise in bespoke lighting installations tailored to your specific venue and vision. Whether you want a fairy light tunnel, a dramatic canopy, or custom colour schemes to match your theme, we can create unique designs that make your event unforgettable.",
  },
  {
    q: "Do you handle outdoor lighting?",
    a: "Yes, we provide outdoor lighting for terraces, gardens, walkways and alfresco dining areas. We use weather-appropriate equipment and can create beautiful exterior lighting that extends the magic of your celebration beyond the main venue space.",
  },
  {
    q: "How far in advance should we book?",
    a: "We recommend booking as early as possible, especially for popular dates and peak wedding season. Many clients book 12-18 months in advance. However, we can often accommodate shorter notice bookings depending on availability, so it\u2019s always worth getting in touch.",
  },
  // --- DJs ---
  {
    q: "How much do your DJs charge?",
    a: "Every party, wedding or event is different due to location, timings and individual requirements. Please submit our contact form to get the ball rolling.",
  },
  {
    q: "Will you play our requests?",
    a: "Yes, we actively encourage both your requests and dis-likes and create a bespoke set for every client. We do use our knowledge and skills to make sure we fill the dance-floor not empty it!",
  },
  {
    q: "We have a mixed-age crowd, is that an issue?",
    a: "No, we are very experienced at entertaining everyone in your wedding party \u2013 even aunt Betty!",
  },
  {
    q: "Can you setup during the day?",
    a: "Yes, we can offer an early set-up for an additional fee. The artists will arrive, setup their equipment and then return when they are required. We also offer the use of a microphone for speeches.",
  },
  {
    q: "Can we have a DJ and band for the evening?",
    a: "Yes, we are used to splitting the evening with a band and DJ can advise on the best way to use both.",
  },
  {
    q: "How late can you play?",
    a: "It depends on the venue but we are used to late nights, you may have to pay accommodation locally if it is unsafe for the artist to drive home.",
  },
  {
    q: "How do we book?",
    a: "If you make an enquiry we will email you with artists available for your date and a fee. To book, we will need your names, address and contact numbers. We will then email you a deposit invoice with t&cs. Once payment and t&c\u2019s have been received, we will email you a booking confirmation.",
  },
  {
    q: "What area do you cover?",
    a: "Over the last 12 months we have supplied entertainment from Norfolk in the east to Cornwall in the west, the south coast to the midlands. We have artists located across the south which enables us to cover a large area.",
  },
  // --- Admin ---
  {
    q: "Where are you based?",
    a: "We are based in Somerset close to Bath but, as you can see from the above we can cover a large area.",
  },
  {
    q: "Do you have public liability and pat tested equipment?",
    a: "Yes, we can supply your venue directly if they ask for it.",
  },
  {
    q: "When do we pay?",
    a: "You pay a deposit when booking and the final balance in the weeks before your party or wedding or, on the night in cash once the artist have setup.",
  },
  {
    q: "Can I speak with anyone?",
    a: "Of course, we are available on the phone during the day 07970793177, if we do not answer please leave a message and we will call you back.",
  },
  {
    q: "Are you reliable?",
    a: "Yes, we have backup talent if someone is ill and have never let any client down on their special party or wedding.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text: a,
    },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqClient />
    </>
  );
}

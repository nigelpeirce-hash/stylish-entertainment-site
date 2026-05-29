import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createMetadata } from "@/lib/metadata";
import { getSeoPageImages } from "@/lib/seo-page-images";

const baseUrl = "https://www.stylishentertainment.co.uk";

export const metadata: Metadata = createMetadata({
  title: "Wedding Production London | Luxury Event Production & Entertainment",
  description: "Boutique wedding production and entertainment across London and the Home Counties. DJs, live acts and full event production for weddings that demand one team, one vision.",
  pathname: "wedding-production-london",
  keywords: [
    "wedding production London",
    "luxury wedding entertainment London",
    "London wedding DJ",
    "wedding production Home Counties",
    "London event production",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is wedding production and how does it work in London?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Wedding production means one team handling entertainment and—where needed—the technical and creative direction of the evening. We bring DJs and live acts (solo, DJ-plus-sax, or full trio) and work to your brief so the sound, flow and atmosphere feel cohesive. In London and the Home Counties we travel to your venue; we don't run a separate London office but we're on the road there regularly and quote clearly for each booking."
      }
    },
    {
      "@type": "Question",
      "name": "Do you only do DJs or can you provide full wedding production in London?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We lead with artists—DJs and live acts—and position as an event production studio. In London and the Home Counties we typically deliver DJ and/or live music; lighting design and venue styling are available in the South West from our base. For London weddings we focus on exceptional entertainment: bespoke sets, no cheese, and a production-minded approach to timing, flow and guest experience."
      }
    },
    {
      "@type": "Question",
      "name": "Which areas do you cover for London wedding production?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We cover Greater London and the Home Counties: Surrey, Berkshire, Buckinghamshire, Hertfordshire, Essex, Kent and West Sussex. We're based in the South West but travel to the capital and the South East regularly. Travel is factored into your quote so you get one clear price."
      }
    },
    {
      "@type": "Question",
      "name": "How do we book wedding production for our London wedding?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Share your date, venue and what you have in mind (DJ, live acts, or both). We'll check availability and send a tailored quote. A booking fee secures your date; the balance is due two weeks before the wedding. You'll get a planning worksheet and direct contact with your artist so the run of show is locked in before the day."
      }
    },
    {
      "@type": "Question",
      "name": "What makes your London wedding entertainment different?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We're a boutique production studio, not a high-volume agency. Our DJs and live acts are chosen for their ability to read the room and build a dance floor without gimmicks. No mic-shouting, no YMCA—just confident, tailored entertainment. We work with venues from Mayfair to Surrey barns and Berkshire estates, so we understand the expectations of London and Home Counties couples."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a travel charge for London and the Home Counties?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We quote on a per-booking basis. Travel to London and the Home Counties is included in the quote—we don't add surprise fees. Many of our team are in the South East regularly, so we'll give you a clear price when you enquire."
      }
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Wedding Production London",
  "description": "Boutique wedding production and entertainment across London and the Home Counties: DJs, live acts and event production for weddings that demand one team and one vision.",
  "provider": { "@id": `${baseUrl}/#localbusiness` },
  "areaServed": [
    { "@type": "City", "name": "London" },
    { "@type": "AdministrativeArea", "name": "Surrey" },
    { "@type": "AdministrativeArea", "name": "Berkshire" },
    { "@type": "AdministrativeArea", "name": "Buckinghamshire" },
    { "@type": "AdministrativeArea", "name": "Hertfordshire" },
    { "@type": "AdministrativeArea", "name": "Essex" },
    { "@type": "AdministrativeArea", "name": "Kent" },
  ],
  "serviceType": "Wedding Production",
};

const IMAGES = getSeoPageImages("wedding-production-london");

export default function WeddingProductionLondonPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <div>
        <section className="relative py-24 md:py-32 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-72 h-72 bg-champagne-gold/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-champagne-gold/5 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-16">
              <div className="flex-1 text-center md:text-left order-1">
                <p className="text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase mb-4">Trusted at Babington House since 2003</p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold text-white mb-6">
                  Wedding Production <span className="text-champagne-gold">London</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 max-w-xl mb-8">
                  Boutique wedding entertainment and production across London and the Home Counties.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
                  <Link href="/contact-us/" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-champagne-gold text-black font-semibold hover:bg-champagne-gold/90 transition-colors">Check Availability</Link>
                  <Link href="/artists/djs/" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-champagne-gold/20 border border-champagne-gold/50 text-champagne-gold font-semibold hover:bg-champagne-gold/30 transition-colors">Meet Our DJs</Link>
                </div>
                <p className="text-sm text-gray-400">20+ years · Babington House since 2003 · UK &amp; Europe</p>
              </div>
              {IMAGES?.hero && (
                <div className="flex-1 order-2 mt-10 md:mt-0 w-full max-w-lg mx-auto md:max-w-none">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-champagne-gold/20 shadow-[0_0_24px_rgba(212,175,55,0.12)]">
                    <Image src={IMAGES.hero.src} alt={IMAGES.hero.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 bg-gray-900">
          <div className="container mx-auto max-w-3xl">
            <div className="prose prose-invert prose-lg max-w-none text-gray-200 space-y-6">
              <p className="text-gray-200 leading-relaxed">
                From Mayfair townhouses and private members&apos; clubs to Surrey estates and Berkshire manor houses, London weddings demand polish, pace and precision.
              </p>
              <p className="text-gray-200 leading-relaxed">
                STYLISH Entertainment & Production operates as a boutique event production studio. We lead with artists—<Link href="/artists/djs/" className="text-champagne-gold hover:text-champagne-gold/80 underline">DJs</Link> and live acts—but the mindset is production. Timing. Flow. Atmosphere. No gimmicks. No cheese. Just confident, curated wedding entertainment for couples who care about detail.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Our team works across London and the South East year-round, performing at high-profile venues throughout the capital and the Home Counties. We understand listed buildings, tight load-ins, sound restrictions and black-tie expectations. Whether you&apos;re marrying in central London, a Surrey estate or a Berkshire barn, we tailor the soundtrack and structure of the evening to suit your venue and your taste.
              </p>

              <p className="text-gray-200 leading-relaxed">
                If you&apos;re searching for a wedding DJ in London who brings production-level thinking—not just a playlist—you&apos;re in the right place.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">What We Offer in London & the Home Counties</h2>
              <p className="text-gray-200 leading-relaxed">
                In London and the Home Counties we deliver wedding entertainment with a production mindset.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-8">
                {IMAGES?.featureImage && (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-champagne-gold/20 bg-gray-800 order-2 md:order-1">
                    <Image src={IMAGES.featureImage.src} alt={IMAGES.featureImage.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                )}
                <div className="order-1 md:order-2">
                  <p className="text-gray-200 leading-relaxed mb-4">Choose:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-200">
                    <li>A solo wedding DJ</li>
                    <li>DJ + sax</li>
                    <li>DJ, sax &amp; percussion for a high-energy live feel</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-200 leading-relaxed">
                Our artists build the evening properly—from drinks reception through to the final track—working to your must-plays and do-not-plays. No mic-shouting. No recycled playlists. No YMCA.
              </p>
              <p className="text-gray-200 leading-relaxed">
                We bring premium sound and intelligent lighting as standard, and coordinate directly with your venue so the evening runs seamlessly.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Where We Cover</h2>
              <p className="text-gray-200 leading-relaxed">
                We work across:
              </p>
              <ul className="list-none pl-0 space-y-2 text-gray-200">
                <li><strong className="text-white">Greater London</strong> — Mayfair, Chelsea, Marylebone, Shoreditch and beyond</li>
                <li><strong className="text-white">Surrey</strong> — Guildford, Farnham, Cobham, Richmond</li>
                <li><strong className="text-white">Berkshire</strong> — Windsor, Ascot, Maidenhead, Newbury</li>
                <li><strong className="text-white">Buckinghamshire</strong> — Amersham, Beaconsfield, Marlow</li>
                <li><strong className="text-white">Hertfordshire</strong> — St Albans, Harpenden</li>
                <li><strong className="text-white">Essex &amp; Kent</strong> — Chelmsford, Sevenoaks, Tunbridge Wells</li>
              </ul>
              <p className="text-gray-200 leading-relaxed">
                If your wedding is in London or the Home Counties, we&apos;ll tailor a clear proposal around your venue and timings.
              </p>

              {IMAGES?.imageStrip && IMAGES.imageStrip.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-12">
                  {IMAGES.imageStrip.map((img, i) => (
                    <div key={i} className="relative aspect-[16/10] rounded-lg overflow-hidden border border-champagne-gold/20 bg-gray-800">
                      <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                  ))}
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Why Production, Not Just a Wedding DJ in London?</h2>
              <p className="text-gray-200 leading-relaxed">
                A London wedding deserves more than a standard DJ.
              </p>
              <p className="text-gray-200 leading-relaxed">
                It requires someone who understands room dynamics, guest energy and pacing. Our artists are selected for their ability to read a mixed-age London crowd and build a dance floor without gimmicks.
              </p>
              <p className="text-gray-200 leading-relaxed">
                We don&apos;t shout over the music.<br />
                We don&apos;t rely on the same 50 wedding tracks every weekend.<br />
                And we don&apos;t treat your celebration like a template.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Instead, we design the atmosphere—so the soundtrack feels deliberate, not accidental.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Browse our <Link href="/venues/" className="text-champagne-gold hover:text-champagne-gold/80 underline">venues</Link> and our <Link href="/artists/djs/" className="text-champagne-gold hover:text-champagne-gold/80 underline">DJs</Link>, then <Link href="/contact-us/" className="text-champagne-gold hover:text-champagne-gold/80 underline">get in touch</Link> with your date and venue.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 bg-gray-800">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
            <dl className="space-y-6">
              <div>
                <dt className="text-lg font-semibold text-white mb-2">What is wedding production and how does it work in London?</dt>
                <dd className="text-gray-300 leading-relaxed">Wedding production means one team handling entertainment and—where needed—the technical and creative direction of the evening. We bring DJs and live acts (solo, DJ-plus-sax, or full trio) and work to your brief so the sound, flow and atmosphere feel cohesive. In London and the Home Counties we travel to your venue; we don&apos;t run a separate London office but we&apos;re on the road there regularly and quote clearly for each booking.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Do you only do DJs or can you provide full wedding production in London?</dt>
                <dd className="text-gray-300 leading-relaxed">We lead with artists—DJs and live acts—and position as an event production studio. In London and the Home Counties we typically deliver DJ and/or live music; lighting design and venue styling are available in the South West from our base. For London weddings we focus on exceptional entertainment: bespoke sets, no cheese, and a production-minded approach to timing, flow and guest experience.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Which areas do you cover for London wedding production?</dt>
                <dd className="text-gray-300 leading-relaxed">We cover Greater London and the Home Counties: Surrey, Berkshire, Buckinghamshire, Hertfordshire, Essex, Kent and West Sussex. We&apos;re based in the South West but travel to the capital and the South East regularly. Travel is factored into your quote so you get one clear price.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">How do we book wedding production for our London wedding?</dt>
                <dd className="text-gray-300 leading-relaxed">Share your date, venue and what you have in mind (DJ, live acts, or both). We&apos;ll check availability and send a tailored quote. A booking fee secures your date; the balance is due two weeks before the wedding. You&apos;ll get a planning worksheet and direct contact with your artist so the run of show is locked in before the day.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">What makes your London wedding entertainment different?</dt>
                <dd className="text-gray-300 leading-relaxed">We&apos;re a boutique production studio, not a high-volume agency. Our DJs and live acts are chosen for their ability to read the room and build a dance floor without gimmicks. No mic-shouting, no YMCA—just confident, tailored entertainment. We work with venues from Mayfair to Surrey barns and Berkshire estates, so we understand the expectations of London and Home Counties couples.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Is there a travel charge for London and the Home Counties?</dt>
                <dd className="text-gray-300 leading-relaxed">We quote on a per-booking basis. Travel to London and the Home Counties is included in the quote—we don&apos;t add surprise fees. Many of our team are in the South East regularly, so we&apos;ll give you a clear price when you enquire.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 bg-gray-900">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Secure Your London Wedding Date</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Tell us your venue and date. We&apos;ll check availability and craft a tailored proposal built around your vision.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/artists/djs/" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-champagne-gold/20 border border-champagne-gold/50 text-champagne-gold font-semibold hover:bg-champagne-gold/30 transition-colors">Meet Our DJs</Link>
              <Link href="/contact-us/" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-champagne-gold text-black font-semibold hover:bg-champagne-gold/90 transition-colors">Check Availability</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

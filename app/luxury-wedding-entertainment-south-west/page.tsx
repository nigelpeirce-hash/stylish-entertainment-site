import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createMetadata } from "@/lib/metadata";
import { getSeoPageImages } from "@/lib/seo-page-images";

const baseUrl = "https://www.stylishentertainment.co.uk";

export const metadata: Metadata = createMetadata({
  title: "Luxury Wedding Entertainment South West | Event Production & DJs",
  description: "Boutique wedding entertainment and event production across the South West. DJs, live acts, lighting design and styling for Somerset, Wiltshire, Devon, Dorset and the Cotswolds.",
  pathname: "luxury-wedding-entertainment-south-west",
  keywords: [
    "luxury wedding entertainment South West",
    "wedding production Somerset",
    "South West wedding DJ",
    "wedding lighting design South West",
    "venue styling Cotswolds",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does luxury wedding entertainment include in the South West?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer a full production approach: DJs and live acts (solo, DJ-plus-sax, or full trio with percussion), plus lighting design and venue styling where needed. Our team reads the room, tailors the soundtrack to your taste and delivers a polished, cheese-free experience. Coverage includes Somerset, Wiltshire, Devon, Dorset, Gloucestershire, Bath, Bristol and the Cotswolds."
      }
    },
    {
      "@type": "Question",
      "name": "How is your South West wedding entertainment different from a standard DJ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We position as an event production studio, not a generic DJ agency. Our artists are selected for atmosphere and flow; we offer bespoke sets, optional live instrumentation and—in the South West—lighting and styling from the same team. No gimmicks, no mic-shouting, no YMCA. Everything is tailored to your venue and your brief."
      }
    },
    {
      "@type": "Question",
      "name": "Do you cover the whole of the South West?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We're based in Frome, Somerset, and work regularly across Somerset, Wiltshire, Devon, Dorset, Gloucestershire, Bath, Bristol and the Cotswolds. We also travel to Cornwall and beyond by arrangement. Travel within our core region is included in our quote."
      }
    },
    {
      "@type": "Question",
      "name": "Can we have both a DJ and lighting design for our South West wedding?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. In the South West we offer full production: DJ and/or live acts plus lighting design and venue styling. One team, one vision—so the music and the look are aligned. Many of our couples start with a DJ and add lighting or styling once they've chosen their venue."
      }
    },
    {
      "@type": "Question",
      "name": "Which South West venues do you work at?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We've performed at hundreds of venues across the region, from barns and manor houses to estates and exclusive spaces. We're familiar with the logistics and character of venues like Mells Barn, North Cadbury Court, Pennard House and Kin House, and many others. Tell us your venue and we'll tailor our approach."
      }
    },
    {
      "@type": "Question",
      "name": "How do we book luxury wedding entertainment in the South West?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Share your date, venue and what you have in mind (DJ only, DJ plus live elements, lighting, styling). We'll check availability and send a tailored quote. A booking fee secures your date; the balance is due two weeks before the wedding. You'll get a planning worksheet and direct contact with your artist and production team."
      }
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Luxury Wedding Entertainment South West",
  "description": "Boutique wedding entertainment and event production across the South West: DJs, live acts, lighting design and venue styling for Somerset, Wiltshire, Devon, Dorset, Gloucestershire, Bath, Bristol and the Cotswolds.",
  "provider": { "@id": `${baseUrl}/#localbusiness` },
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "Somerset" },
    { "@type": "AdministrativeArea", "name": "Wiltshire" },
    { "@type": "AdministrativeArea", "name": "Devon" },
    { "@type": "AdministrativeArea", "name": "Dorset" },
    { "@type": "AdministrativeArea", "name": "Gloucestershire" },
    { "@type": "City", "name": "Bath" },
    { "@type": "City", "name": "Bristol" },
  ],
  "serviceType": "Wedding Entertainment",
};

const IMAGES = getSeoPageImages("luxury-wedding-entertainment-south-west");

export default function LuxuryWeddingEntertainmentSouthWestPage() {
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
                  Luxury Wedding Entertainment <span className="text-champagne-gold">South West</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 max-w-xl mb-8">
                  Boutique wedding entertainment and event production across Somerset, Wiltshire, Devon, Dorset and the Cotswolds.
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
                The South West is one of the UK&apos;s most coveted wedding regions—rolling hills, historic manor houses, design-led barns and dramatic coastline. Celebrations here demand more than a standard DJ or a list of disconnected suppliers.
              </p>
              <p className="text-gray-200 leading-relaxed">
                STYLISH Entertainment & Production operates as a luxury event production studio. DJs and live artists are the entry point; in the South West, we also deliver lighting design and venue styling so the sound, the space and the atmosphere feel unified.
              </p>
              <p className="text-gray-200 leading-relaxed font-semibold text-white">
                One studio. One vision. No compromises.
              </p>

              <p className="text-gray-200 leading-relaxed">
                If you&apos;re searching for a luxury wedding DJ in Somerset or a full wedding production team in the South West, you&apos;re in the right place.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">What We Offer in the South West</h2>
              <p className="text-gray-200 leading-relaxed">
                Our South West weddings are built around three pillars:
              </p>
              <p className="text-gray-200 leading-relaxed font-medium text-white">
                Artists. Lighting. Styling.
              </p>
              <p className="text-gray-200 leading-relaxed">
                You can book them individually—but most couples choose a cohesive approach. They start with a <Link href="/artists/djs/" className="text-champagne-gold hover:text-champagne-gold/80 underline">wedding DJ</Link> or live lineup (DJ plus sax, or DJ plus sax and percussion), then integrate <Link href="/weddings/wedding-lighting/" className="text-champagne-gold hover:text-champagne-gold/80 underline">lighting design</Link> or <Link href="/services/venue-styling/" className="text-champagne-gold hover:text-champagne-gold/80 underline">venue styling</Link> to elevate the space.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Because we operate as one studio, the music and the room transformation are aligned from the outset. No supplier friction. No mismatched aesthetics. Just a seamless, confident celebration.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Where We Cover</h2>
              <p className="text-gray-200 leading-relaxed">
                We work across the full South West:
              </p>
              <ul className="list-none pl-0 space-y-2 text-gray-200">
                <li><strong className="text-white">Somerset</strong> — Frome, Bruton, Castle Cary, Glastonbury, Wells, Taunton</li>
                <li><strong className="text-white">Wiltshire</strong> — Malmesbury, Marlborough, Salisbury, Bradford-on-Avon</li>
                <li><strong className="text-white">Devon &amp; Dorset</strong> — estates, coast and countryside</li>
                <li><strong className="text-white">Gloucestershire &amp; The Cotswolds</strong> — Cheltenham, Cirencester, Tetbury</li>
                <li><strong className="text-white">Bath &amp; Bristol</strong></li>
              </ul>
              <p className="text-gray-200 leading-relaxed">
                Travel within this region is standard. Cornwall and further afield by arrangement.
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

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Venues We Know</h2>
              <p className="text-gray-200 leading-relaxed">
                We&apos;ve performed at hundreds of South West weddings. That includes celebrated barns and houses such as <Link href="/venues/mells-barn/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Mells Barn</Link>, <Link href="/venues/north-cadbury-court/" className="text-champagne-gold hover:text-champagne-gold/80 underline">North Cadbury Court</Link>, <Link href="/venues/pennard-house/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Pennard House</Link> and <Link href="/kin-house-wiltshire/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Kin House</Link>, plus many other manor houses, barns and exclusive venues. You can browse more on our <Link href="/venues/" className="text-champagne-gold hover:text-champagne-gold/80 underline">venues page</Link>. When you <Link href="/contact-us/" className="text-champagne-gold hover:text-champagne-gold/80 underline">get in touch</Link>, tell us your venue and we&apos;ll tailor our approach and quote.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Why a Production Studio, Not Just a DJ?</h2>
              <p className="text-gray-200 leading-relaxed">
                A luxury wedding in the South West deserves more than a playlist.
              </p>
              <p className="text-gray-200 leading-relaxed font-medium text-white">
                We design the full atmosphere.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-8">
                {IMAGES?.featureImage && (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-champagne-gold/20 bg-gray-800 order-2 md:order-1">
                    <Image src={IMAGES.featureImage.src} alt={IMAGES.featureImage.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                )}
                <div className="order-1 md:order-2">
                  <p className="text-gray-200 leading-relaxed mb-4">That means:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-200">
                    <li>A DJ or live act who understands flow, pacing and restraint</li>
                    <li>Lighting that enhances architecture rather than overpowering it</li>
                    <li>Styling elements that support your venue&apos;s character</li>
                    <li>A cohesive aesthetic from arrival drinks to last track</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-200 leading-relaxed">
                We do not shout over the music.<br />
                We do not recycle the same 50 songs every weekend.<br />
                And we certainly do not play YMCA.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Instead, we build a soundtrack and environment that feels unmistakably yours.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 bg-gray-800">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
            <dl className="space-y-6">
              <div>
                <dt className="text-lg font-semibold text-white mb-2">What does luxury wedding entertainment include in the South West?</dt>
                <dd className="text-gray-300 leading-relaxed">We offer a full production approach: DJs and live acts (solo, DJ-plus-sax, or full trio with percussion), plus lighting design and venue styling where needed. Our team reads the room, tailors the soundtrack to your taste and delivers a polished, cheese-free experience. Coverage includes Somerset, Wiltshire, Devon, Dorset, Gloucestershire, Bath, Bristol and the Cotswolds.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">How is your South West wedding entertainment different from a standard DJ?</dt>
                <dd className="text-gray-300 leading-relaxed">We position as an event production studio, not a generic DJ agency. Our artists are selected for atmosphere and flow; we offer bespoke sets, optional live instrumentation and—in the South West—lighting and styling from the same team. No gimmicks, no mic-shouting, no YMCA. Everything is tailored to your venue and your brief.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Do you cover the whole of the South West?</dt>
                <dd className="text-gray-300 leading-relaxed">Yes. We&apos;re based in Frome, Somerset, and work regularly across Somerset, Wiltshire, Devon, Dorset, Gloucestershire, Bath, Bristol and the Cotswolds. We also travel to Cornwall and beyond by arrangement. Travel within our core region is included in our quote.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Can we have both a DJ and lighting design for our South West wedding?</dt>
                <dd className="text-gray-300 leading-relaxed">Yes. In the South West we offer full production: DJ and/or live acts plus lighting design and venue styling. One team, one vision—so the music and the look are aligned. Many of our couples start with a DJ and add lighting or styling once they&apos;ve chosen their venue.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Which South West venues do you work at?</dt>
                <dd className="text-gray-300 leading-relaxed">We&apos;ve performed at hundreds of venues across the region, from barns and manor houses to estates and exclusive spaces. We&apos;re familiar with the logistics and character of venues like Mells Barn, North Cadbury Court, Pennard House and Kin House, and many others. Tell us your venue and we&apos;ll tailor our approach.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">How do we book luxury wedding entertainment in the South West?</dt>
                <dd className="text-gray-300 leading-relaxed">Share your date, venue and what you have in mind (DJ only, DJ plus live elements, lighting, styling). We&apos;ll check availability and send a tailored quote. A booking fee secures your date; the balance is due two weeks before the wedding. You&apos;ll get a planning worksheet and direct contact with your artist and production team.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 bg-gray-900">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Begin Planning Your South West Wedding Atmosphere</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Share your date and venue. We&apos;ll check availability and tailor a proposal around your vision—whether that&apos;s DJ-led or full-scale production.
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

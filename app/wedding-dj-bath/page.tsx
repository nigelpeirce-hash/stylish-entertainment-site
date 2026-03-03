import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createMetadata } from "@/lib/metadata";
import { getSeoPageImages } from "@/lib/seo-page-images";

const baseUrl = "https://www.stylishentertainment.co.uk";

export const metadata: Metadata = createMetadata({
  title: "Wedding DJ Bath | Stylish Entertainment",
  description: "Boutique wedding DJ and live acts in Bath and the surrounding area. Georgian elegance, city and country venues. Bespoke sets, no cheese.",
  pathname: "wedding-dj-bath",
  keywords: ["wedding DJ Bath", "Bath wedding DJ", "Bath wedding entertainment", "wedding DJ Bath area"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do you cover Bath city and the surrounding area?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We work across Bath city centre and the wider Bath area—including Bathampton, Combe Down, Keynsham, Bradford-on-Avon and venues in the valleys and hills around the city. We're based nearby in Frome, so Bath weddings are a regular part of our calendar. Travel is included in our quote."
      }
    },
    {
      "@type": "Question",
      "name": "What kind of Bath wedding venues do you work at?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We've performed at a range of Bath-area venues: Georgian townhouses and hotels in the city, country houses and barns in the surrounding valleys, and exclusive-use properties in North Somerset and the Chew Valley. We understand listed buildings, sound restrictions and the mix of elegance and atmosphere that Bath couples expect."
      }
    },
    {
      "@type": "Question",
      "name": "Can we have a wedding DJ and live musicians in Bath?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We offer solo DJs, DJ-plus-sax duos and our full lineup (DJ, sax and percussion). Many Bath couples choose a DJ for the evening reception and add live elements for the drinks reception or first dance. We tailor the package to your venue and style."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a travel charge for Bath?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bath and the immediate area fall within our core South West coverage. We quote on a per-booking basis and include travel so you get one clear price. No surprise fees."
      }
    },
    {
      "@type": "Question",
      "name": "What makes your Bath wedding DJ service different?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We're a boutique production studio, not a generic DJ agency. Our artists read the room, work to your must-plays and do-not-plays, and build the evening without gimmicks. No mic-shouting, no YMCA—just confident, tailored entertainment. For Bath and the South West we can also add lighting design and venue styling from the same team."
      }
    },
    {
      "@type": "Question",
      "name": "How do we book a wedding DJ in Bath?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Share your date, venue and timings. We'll check availability and send a tailored quote. A booking fee secures your date; the balance is due two weeks before the wedding. You'll get a planning worksheet and direct contact with your DJ."
      }
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Wedding DJ Bath",
  "description": "Boutique wedding DJ and live act services in Bath and the surrounding area. City and country venues. Bespoke sets, no cheese.",
  "provider": { "@id": `${baseUrl}/#localbusiness` },
  "areaServed": { "@type": "City", "name": "Bath" },
  "serviceType": "Wedding DJ Services",
};

const IMAGES = getSeoPageImages("wedding-dj-bath");

export default function WeddingDJBathPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <div className="w-full">
        {/* Hero */}
        <section className="relative py-24 md:py-32 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-72 h-72 bg-champagne-gold/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-champagne-gold/5 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-16">
              <div className="flex-1 text-center md:text-left order-1">
                <p className="text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase mb-4">Bath Wedding DJ</p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold text-white mb-6">
                  Wedding DJ <span className="text-champagne-gold">Bath</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 max-w-xl mb-8">
                  Premium wedding DJ and live acts in Bath and the surrounding countryside.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Link href="/contact-us/" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-champagne-gold text-black font-semibold hover:bg-champagne-gold/90 transition-colors">Enquire &amp; Check Availability</Link>
                  <Link href="/artists/djs/" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-champagne-gold/20 border border-champagne-gold/50 text-champagne-gold font-semibold hover:bg-champagne-gold/30 transition-colors">Meet Our DJs</Link>
                </div>
                <p className="text-sm text-gray-400 mt-4 max-w-xl">
                  Regularly performing in Bath city venues, Limpley Stoke, the Avon Valley and surrounding Somerset countryside.
                </p>
                <p className="text-sm text-gray-400 mt-1 max-w-xl">
                  Resident at Babington House for 20 years — a benchmark venue for South West weddings.
                </p>
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

        {/* Main content */}
        <section className="py-16 px-4 sm:px-6 bg-gray-900">
          <div className="container mx-auto max-w-3xl">
            <div className="prose prose-invert prose-lg max-w-none text-gray-200 space-y-6">
              <p className="text-gray-200 leading-relaxed">
                Bath&apos;s wedding character is unmistakable: Georgian architecture, honey stone, a sense of occasion between city sophistication and West Country warmth. Elegant spaces need elegant timing—a dance floor that builds naturally, a DJ who reads the room and matches the atmosphere. Refined, not stiff.
              </p>
              <p className="text-gray-200 leading-relaxed">
                STYLISH is based nearby in Frome. We work in Bath regularly—townhouse, hotel, country house on the fringes. We understand listed buildings, sound constraints and the flow that Bath couples expect. Production-minded timing and a soundtrack that feels deliberate. No gimmicks, no YMCA—just confident, curated wedding entertainment.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Why Choose a Wedding DJ in Bath from STYLISH?</h2>
              <p className="text-gray-200 leading-relaxed">
                Elegant spaces need elegant timing. No mic-hype. No generic wedding anthems. We build the evening from drinks reception to last track, honour your must-plays and do-not-plays, and deliver a bespoke soundtrack built for the room. <Link href="/artists/djs/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Solo DJs</Link> and live options (DJ plus sax, or full trio with percussion) to match your venue. <Link href="/weddings/wedding-lighting/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Lighting</Link> and <Link href="/services/venue-styling/" className="text-champagne-gold hover:text-champagne-gold/80 underline">venue styling</Link> available as an upgrade. See our <Link href="/wedding-dj-south-west/" className="text-champagne-gold hover:text-champagne-gold/80 underline">South West coverage</Link> for the full picture.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Venues We Work At in Bath & the Area</h2>
              <p className="text-gray-200 leading-relaxed">
                Georgian townhouses and hotels in the city; country houses and barns in the valleys; exclusive-use properties that draw couples from Bath and beyond. We know the logistics and the atmosphere that suits a Bath wedding. <Link href="/venues/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Browse our venues page</Link>; when you <Link href="/contact-us/" className="text-champagne-gold hover:text-champagne-gold/80 underline">get in touch</Link>, tell us your venue and we&apos;ll tailor our approach and quote.
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

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Our Approach</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-8">
                {IMAGES?.featureImage && (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-champagne-gold/20 bg-gray-800 order-2 md:order-1">
                    <Image src={IMAGES.featureImage.src} alt={IMAGES.featureImage.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                )}
                <div className="order-1 md:order-2">
                  <p className="text-gray-200 leading-relaxed">
                    We don&apos;t do cheesy requests, mic-hype or recycled playlists. We do bespoke sets: flow, pacing and a soundtrack that builds naturally. You send us your must-plays and do-not-plays; we read the room and keep the energy right. Full five-hour sets, early setup where needed, and equipment that&apos;s PAT tested and fully insured. If you want to add live sax or our full trio (DJ, sax and percussion), we make it seamless—same team, same standards.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Where We Cover Nearby</h2>
              <p className="text-gray-200 leading-relaxed">
                We cover <strong className="text-white">Bath city</strong> and its surrounding valleys and estates: <strong className="text-white">Bathampton, Combe Down, Lansdown, Widcombe, Keynsham, Saltford, Bradford-on-Avon, Limpley Stoke, Freshford, Wellow</strong> and the villages between Bath and the Somerset border. For Bristol or further into Somerset, we cover those too—see <Link href="/wedding-dj-south-west/" className="text-champagne-gold hover:text-champagne-gold/80 underline">wedding DJ South West</Link> for our full regional coverage.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Upgrade Option: Full Production</h2>
              <p className="text-gray-200 leading-relaxed">
                Beyond a Bath wedding DJ: we offer lighting design, venue styling and full event production across the South West under one roof. Explore <Link href="/luxury-wedding-entertainment-south-west/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Luxury Wedding Entertainment South West</Link> for the complete picture.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 sm:px-6 bg-gray-800">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
              Frequently Asked Questions: Wedding DJ Bath
            </h2>
            <dl className="space-y-6">
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Do you cover Bath city and the surrounding area?</dt>
                <dd className="text-gray-300 leading-relaxed">Yes. We work across Bath city centre and the wider Bath area—including Bathampton, Combe Down, Keynsham, Bradford-on-Avon and venues in the valleys and hills around the city. We&apos;re based nearby in Frome, so Bath weddings are a regular part of our calendar. Travel is included in our quote.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">What kind of Bath wedding venues do you work at?</dt>
                <dd className="text-gray-300 leading-relaxed">We&apos;ve performed at a range of Bath-area venues: Georgian townhouses and hotels in the city, country houses and barns in the surrounding valleys, and exclusive-use properties in North Somerset and the Chew Valley. We understand listed buildings, sound restrictions and the mix of elegance and atmosphere that Bath couples expect.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Can we have a wedding DJ and live musicians in Bath?</dt>
                <dd className="text-gray-300 leading-relaxed">Yes. We offer solo DJs, DJ-plus-sax duos and our full lineup (DJ, sax and percussion). Many Bath couples choose a DJ for the evening reception and add live elements for the drinks reception or first dance. We tailor the package to your venue and style.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Is there a travel charge for Bath?</dt>
                <dd className="text-gray-300 leading-relaxed">Bath and the immediate area fall within our core South West coverage. We quote on a per-booking basis and include travel so you get one clear price. No surprise fees.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">What makes your Bath wedding DJ service different?</dt>
                <dd className="text-gray-300 leading-relaxed">We&apos;re a boutique production studio, not a generic DJ agency. Our artists read the room, work to your must-plays and do-not-plays, and build the evening without gimmicks. No mic-shouting, no YMCA—just confident, tailored entertainment. For Bath and the South West we can also add lighting design and venue styling from the same team.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">How do we book a wedding DJ in Bath?</dt>
                <dd className="text-gray-300 leading-relaxed">Share your date, venue and timings. We&apos;ll check availability and send a tailored quote. A booking fee secures your date; the balance is due two weeks before the wedding. You&apos;ll get a planning worksheet and direct contact with your DJ.</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 bg-gray-900">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Book Your Bath Wedding DJ
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Share your date and venue—we&apos;ll check availability and send a tailored quote. <Link href="/artists/djs/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Meet our DJs</Link>, see our <Link href="/wedding-dj-south-west/" className="text-champagne-gold hover:text-champagne-gold/80 underline">South West coverage</Link>, or <Link href="/contact-us/" className="text-champagne-gold hover:text-champagne-gold/80 underline">get in touch</Link>.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/artists/djs/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-champagne-gold/20 border border-champagne-gold/50 text-champagne-gold font-semibold hover:bg-champagne-gold/30 transition-colors"
              >
                Meet Our DJs
              </Link>
              <Link
                href="/contact-us/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-champagne-gold text-black font-semibold hover:bg-champagne-gold/90 transition-colors"
              >
                Enquire &amp; Check Availability
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

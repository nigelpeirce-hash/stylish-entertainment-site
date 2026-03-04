import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createMetadata } from "@/lib/metadata";
import { getSeoPageImages } from "@/lib/seo-page-images";

const baseUrl = "https://www.stylishentertainment.co.uk";

export const metadata: Metadata = createMetadata({
  title: "Wedding DJ Bristol",
  description: "Boutique wedding DJ and live acts in Bristol and the surrounding area. City and country venues, from Clifton to the Chew Valley. Bespoke sets, no cheese.",
  pathname: "wedding-dj-bristol",
  keywords: ["wedding DJ Bristol", "Bristol wedding DJ", "Bristol wedding entertainment", "Clifton wedding DJ"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do you cover Bristol city and the surrounding area?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We work across Bristol—from Clifton and the city centre to Southville, the Chew Valley and the villages and country venues on the city's fringes. We're based nearby in Frome and are in Bristol regularly for weddings and events. Travel is included in our quote."
      }
    },
    {
      "@type": "Question",
      "name": "What kind of Bristol wedding venues do you work at?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We've performed at a mix of Bristol-area venues: city hotels and exclusive spaces, Clifton townhouses, country houses and barns in the Chew Valley and North Somerset, and venues that blend urban edge with countryside. We understand the variety of spaces and the expectations of Bristol couples—refined but not stuffy."
      }
    },
    {
      "@type": "Question",
      "name": "Can we have a wedding DJ and live musicians in Bristol?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We offer solo DJs, DJ-plus-sax duos and our full lineup (DJ, sax and percussion). Many Bristol couples choose a DJ for the evening and add live elements for the drinks reception or first dance. We tailor the package to your venue and vibe."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a travel charge for Bristol?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bristol and the surrounding area fall within our core South West coverage. We quote on a per-booking basis and include travel so you get one clear price. No surprise fees."
      }
    },
    {
      "@type": "Question",
      "name": "What makes your Bristol wedding DJ service different?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We're a boutique production studio, not a generic DJ agency. Our artists read the room, work to your must-plays and do-not-plays, and build the evening without gimmicks. No mic-shouting, no YMCA—just confident, tailored entertainment. For Bristol and the South West we can also add lighting design and venue styling from the same team."
      }
    },
    {
      "@type": "Question",
      "name": "How do we book a wedding DJ in Bristol?",
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
  "name": "Wedding DJ Bristol",
  "description": "Boutique wedding DJ and live act services in Bristol and the surrounding area. City and country venues. Bespoke sets, no cheese.",
  "provider": { "@id": `${baseUrl}/#localbusiness` },
  "areaServed": { "@type": "City", "name": "Bristol" },
  "serviceType": "Wedding DJ Services",
};

const IMAGES = getSeoPageImages("wedding-dj-bristol");

export default function WeddingDJBristolPage() {
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
                <p className="text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase mb-4">Bristol Wedding DJ</p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold text-white mb-6">
                  Wedding DJ <span className="text-champagne-gold">Bristol</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 max-w-xl mb-8">
                  Boutique wedding DJ and live acts across Bristol. City energy and country escapes—one team, one standard.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Link href="/contact-us/" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-champagne-gold text-black font-semibold hover:bg-champagne-gold/90 transition-colors">Enquire &amp; Check Availability</Link>
                  <Link href="/artists/djs/" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-champagne-gold/20 border border-champagne-gold/50 text-champagne-gold font-semibold hover:bg-champagne-gold/30 transition-colors">Meet Our DJs</Link>
                </div>
                <p className="text-sm text-gray-400 mt-4 max-w-xl">
                  Based nearby in Frome (BA11) and regularly performing across Clifton, the city centre, the Chew Valley and North Somerset.
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
                Bristol&apos;s wedding scene is as varied as the city: Clifton elegance, warehouse and loft spaces with an industrial edge, and—just outside—country houses and barns in the Chew Valley and North Somerset. Couples want entertainment that matches—refined when it needs to be, high-energy when the dance floor calls—and a Bristol wedding DJ who reads the room.
              </p>
              <p className="text-gray-200 leading-relaxed">
                STYLISH is based nearby in Frome. We work across Bristol regularly—from the centre and Clifton to Southville, the Chew Valley and beyond. We understand city and country venues and the expectations of couples who want their day to feel distinctive. Production-minded timing, flow and a soundtrack that feels deliberate. No gimmicks, no YMCA—just confident, curated wedding entertainment.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Why Choose a Wedding DJ in Bristol from STYLISH?</h2>
              <p className="text-gray-200 leading-relaxed">
                From a Clifton townhouse to a barn in the valley—the entertainment has to fit. We offer <Link href="/artists/djs/" className="text-champagne-gold hover:text-champagne-gold/80 underline">solo DJs</Link> and live options (DJ plus sax, or full trio with percussion) so you can scale the energy to your venue. Flow and pacing are central: our DJs build the evening from drinks reception to last track, honour your must-plays and do-not-plays, and never fall back on the same 50 anthems. Production-minded timing, one team. For Bristol and the wider South West you can add <Link href="/weddings/wedding-lighting/" className="text-champagne-gold hover:text-champagne-gold/80 underline">lighting design</Link> and <Link href="/services/venue-styling/" className="text-champagne-gold hover:text-champagne-gold/80 underline">venue styling</Link> as an upgrade. See our <Link href="/wedding-dj-south-west/" className="text-champagne-gold hover:text-champagne-gold/80 underline">South West coverage</Link> for the full picture.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Venues We Work At in Bristol & the Area</h2>
              <p className="text-gray-200 leading-relaxed">
                We&apos;ve performed at city hotels and exclusive spaces, Clifton townhouses, country houses and barns in the Chew Valley and North Somerset—venues that range from urban to rural. We know the logistics and the atmosphere that suits a Bristol wedding. <Link href="/venues/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Browse our venues page</Link>; when you <Link href="/contact-us/" className="text-champagne-gold hover:text-champagne-gold/80 underline">get in touch</Link>, tell us your venue and we&apos;ll tailor our approach and quote.
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
                    Bespoke sets built on flow and pacing. You send must-plays and do-not-plays; we read the room and keep the energy right. No cheesy requests, mic-hype or recycled playlists—just a soundtrack that builds naturally from drinks to last track.
                  </p>
                  <p className="text-gray-200 leading-relaxed mt-4">
                    Full five-hour sets, early setup where needed, PAT-tested and fully insured equipment. Add live sax or our full trio (DJ, sax and percussion) with the same team and the same standards.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Where We Cover Nearby</h2>
              <p className="text-gray-200 leading-relaxed">
                We cover <strong className="text-white">Bristol city</strong> and nearby venues: <strong className="text-white">Clifton, Redland, Westbury-on-Trym, Southville, Bedminster, the city centre, Chew Magna, Chew Stoke, Bishopsworth, Long Ashton, Backwell, Clevedon</strong> and the North Somerset and South Gloucestershire borders. For Bath, Somerset or further afield, we cover those too—see <Link href="/wedding-dj-south-west/" className="text-champagne-gold hover:text-champagne-gold/80 underline">wedding DJ South West</Link> for our full regional coverage.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Upgrade Option: Full Production</h2>
              <p className="text-gray-200 leading-relaxed">
                Beyond a Bristol wedding DJ: we offer lighting design, venue styling and full event production across the South West under one roof. Explore <Link href="/luxury-wedding-entertainment-south-west/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Luxury Wedding Entertainment South West</Link> for the complete picture.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 sm:px-6 bg-gray-800">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
              Frequently Asked Questions: Wedding DJ Bristol
            </h2>
            <dl className="space-y-6">
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Do you cover Bristol city and the surrounding area?</dt>
                <dd className="text-gray-300 leading-relaxed">Yes. We work across Bristol—from Clifton and the city centre to Southville, the Chew Valley and the villages and country venues on the city&apos;s fringes. We&apos;re based nearby in Frome and are in Bristol regularly for weddings and events. Travel is included in our quote.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">What kind of Bristol wedding venues do you work at?</dt>
                <dd className="text-gray-300 leading-relaxed">We&apos;ve performed at a mix of Bristol-area venues: city hotels and exclusive spaces, Clifton townhouses, country houses and barns in the Chew Valley and North Somerset, and venues that blend urban edge with countryside. We understand the variety of spaces and the expectations of Bristol couples—refined but not stuffy.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Can we have a wedding DJ and live musicians in Bristol?</dt>
                <dd className="text-gray-300 leading-relaxed">Yes. We offer solo DJs, DJ-plus-sax duos and our full lineup (DJ, sax and percussion). Many Bristol couples choose a DJ for the evening and add live elements for the drinks reception or first dance. We tailor the package to your venue and vibe.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Is there a travel charge for Bristol?</dt>
                <dd className="text-gray-300 leading-relaxed">Bristol and the surrounding area fall within our core South West coverage. We quote on a per-booking basis and include travel so you get one clear price. No surprise fees.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">What makes your Bristol wedding DJ service different?</dt>
                <dd className="text-gray-300 leading-relaxed">We&apos;re a boutique production studio, not a generic DJ agency. Our artists read the room, work to your must-plays and do-not-plays, and build the evening without gimmicks. No mic-shouting, no YMCA—just confident, tailored entertainment. For Bristol and the South West we can also add lighting design and venue styling from the same team.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">How do we book a wedding DJ in Bristol?</dt>
                <dd className="text-gray-300 leading-relaxed">Share your date, venue and timings. We&apos;ll check availability and send a tailored quote. A booking fee secures your date; the balance is due two weeks before the wedding. You&apos;ll get a planning worksheet and direct contact with your DJ.</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 bg-gray-900">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Book Your Bristol Wedding DJ
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

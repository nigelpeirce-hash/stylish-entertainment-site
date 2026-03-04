import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createMetadata } from "@/lib/metadata";
import { getSeoPageImages } from "@/lib/seo-page-images";

const baseUrl = "https://www.stylishentertainment.co.uk";

export const metadata: Metadata = createMetadata({
  title: "Wedding DJ Somerset",
  description: "Boutique wedding DJ and live acts across Somerset—Frome, Bruton, Wells, Glastonbury, Taunton and beyond. Bespoke sets, no cheese. We're based here.",
  pathname: "wedding-dj-somerset",
  keywords: ["wedding DJ Somerset", "Somerset wedding DJ", "Frome wedding DJ", "Wells wedding DJ", "wedding entertainment Somerset"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Are you actually based in Somerset?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. STYLISH Entertainment is based in Frome, Somerset. We know the county's venues, roads and logistics inside out—so Somerset weddings are not a side trip for us; they're home ground. Travel within Somerset is included in our quote."
      }
    },
    {
      "@type": "Question",
      "name": "Which Somerset wedding venues do you know well?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We've performed at dozens of Somerset venues, from iconic barns like Mells Barn and North Cadbury Court to Pennard House, Rosedew Farm, The Newt and many manor houses and estates across the county. We're happy to discuss your venue and any load-in or technical questions."
      }
    },
    {
      "@type": "Question",
      "name": "Do you cover the whole of Somerset?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. From Frome and Bruton to Castle Cary, Glastonbury, Wells, Taunton, Shepton Mallet, Yeovil and the Mendips—we cover the full county. No travel surcharge within Somerset."
      }
    },
    {
      "@type": "Question",
      "name": "Can we have a DJ and live musicians for our Somerset wedding?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We offer solo DJs, DJ-plus-sax duos and our full lineup (DJ, sax and percussion). Many Somerset couples choose a DJ for the evening and add live elements for the drinks reception or first dance. We tailor the package to your venue and budget."
      }
    },
    {
      "@type": "Question",
      "name": "What makes your Somerset wedding DJ service different?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We're a boutique production studio, not a high-volume agency. Our DJs read the room, work to your must-plays and do-not-plays, and build the evening without gimmicks. No mic-shouting, no YMCA—just confident, tailored entertainment. In Somerset we can also add lighting design and venue styling from the same team."
      }
    },
    {
      "@type": "Question",
      "name": "How do we book a wedding DJ in Somerset?",
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
  "name": "Wedding DJ Somerset",
  "description": "Boutique wedding DJ and live act services across Somerset. Based in Frome; covering Frome, Bruton, Wells, Glastonbury, Taunton and the whole county. Bespoke sets, no cheese.",
  "provider": { "@id": `${baseUrl}/#localbusiness` },
  "areaServed": { "@type": "AdministrativeArea", "name": "Somerset" },
  "serviceType": "Wedding DJ Services",
};

const IMAGES = getSeoPageImages("wedding-dj-somerset");

export default function WeddingDJSomersetPage() {
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
                <p className="text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase mb-4">Somerset Wedding DJ</p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold text-white mb-6">
                  Wedding DJ <span className="text-champagne-gold">Somerset</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 max-w-xl mb-8">
                  Boutique wedding DJ and live acts across Somerset. We&apos;re based here—so your celebration is in our backyard.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Link href="/contact-us/" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-champagne-gold text-black font-semibold hover:bg-champagne-gold/90 transition-colors">Enquire &amp; Check Availability</Link>
                  <Link href="/artists/djs/" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-champagne-gold/20 border border-champagne-gold/50 text-champagne-gold font-semibold hover:bg-champagne-gold/30 transition-colors">Meet Our DJs</Link>
                </div>
                <p className="text-sm text-gray-400 mt-4 max-w-xl">
                  Based here in Frome and performing across Somerset weekly—from Bruton and Castle Cary to Wells and Taunton.
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
                Somerset wedding DJ territory: rolling hills, stone barns, manor houses and countryside estates. Rural but refined—relaxed in spirit, exacting in detail. Frome and Bruton to Wells, Glastonbury, Castle Cary and Taunton. These rooms deserve a Somerset wedding DJ who gets the tone and doesn&apos;t default to the same playlist every weekend.
              </p>
              <p className="text-gray-200 leading-relaxed">
                We&apos;re based here in Frome. We know these rooms—the power, the acoustics, the atmosphere Somerset couples are after. Production-led, not an afterthought. No gimmicks, no YMCA: just confident, crafted wedding entertainment that fits your venue and your taste.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Why Choose a Wedding DJ in Somerset from STYLISH?</h2>
              <p className="text-gray-200 leading-relaxed">
                Local knowledge and a production mindset. We build the evening from drinks reception to final track, honour your must-plays and do-not-plays, and read the room—no shouting over the music. <Link href="/artists/djs/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Solo DJs</Link> and live options (DJ plus sax, or full trio with percussion) to scale the energy to your day. Because we&apos;re here, we can add <Link href="/weddings/wedding-lighting/" className="text-champagne-gold hover:text-champagne-gold/80 underline">lighting design</Link> and <Link href="/services/venue-styling/" className="text-champagne-gold hover:text-champagne-gold/80 underline">venue styling</Link> at the same venue—one team, one vision. See our <Link href="/wedding-dj-south-west/" className="text-champagne-gold hover:text-champagne-gold/80 underline">South West coverage</Link> for the full picture.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Venues We Work At in Somerset</h2>
              <p className="text-gray-200 leading-relaxed">
                Celebrated barns and houses—<Link href="/venues/mells-barn/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Mells Barn</Link>, <Link href="/venues/north-cadbury-court/" className="text-champagne-gold hover:text-champagne-gold/80 underline">North Cadbury Court</Link>, <Link href="/venues/pennard-house/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Pennard House</Link>—plus Rosedew Farm, The Newt and many other manor houses, barns and estates across the county. <Link href="/venues/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Browse our venues page</Link>; when you <Link href="/contact-us/" className="text-champagne-gold hover:text-champagne-gold/80 underline">get in touch</Link>, tell us your venue and we&apos;ll tailor our approach and quote.
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
                    We don&apos;t do cheesy requests, mic-hype or the same 50 wedding tracks every Saturday. We do bespoke sets: flow, pacing and a soundtrack that builds from drinks reception to last track. You send us your must-plays and do-not-plays; we read the room and keep the energy right. Full five-hour sets, early setup where needed, and equipment that&apos;s PAT tested and fully insured. If you want to add live sax or our full trio (DJ, sax and percussion), we make it seamless—same team, same standards.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Where We Cover Nearby</h2>
              <p className="text-gray-200 leading-relaxed">
                We cover the full county. That includes: <strong className="text-white">Frome, Bruton, Castle Cary, Glastonbury, Wells, Street, Shepton Mallet, Taunton, Yeovil, Bridgwater, Wincanton, Somerton, Ilminster, Chard, Martock, Langport</strong> and the Mendips, Quantocks and Levels. Travel within Somerset is included. For weddings just over the border in Wiltshire, Dorset or Devon, we quote on a per-booking basis—see our <Link href="/wedding-dj-south-west/" className="text-champagne-gold hover:text-champagne-gold/80 underline">South West coverage</Link> for the full picture.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">Upgrade Option: Full Production</h2>
              <p className="text-gray-200 leading-relaxed">
                Beyond a Somerset wedding DJ: we offer lighting design, venue styling and full event production from our Somerset base. Explore <Link href="/luxury-wedding-entertainment-south-west/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Luxury Wedding Entertainment South West</Link> for the complete picture—same team, same standards.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 sm:px-6 bg-gray-800">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
              Frequently Asked Questions: Wedding DJ Somerset
            </h2>
            <dl className="space-y-6">
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Are you actually based in Somerset?</dt>
                <dd className="text-gray-300 leading-relaxed">Yes. STYLISH Entertainment is based in Frome, Somerset. We know the county&apos;s venues, roads and logistics inside out—so Somerset weddings are not a side trip for us; they&apos;re home ground. Travel within Somerset is included in our quote.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Which Somerset wedding venues do you know well?</dt>
                <dd className="text-gray-300 leading-relaxed">We&apos;ve performed at dozens of Somerset venues, from iconic barns like Mells Barn and North Cadbury Court to Pennard House, Rosedew Farm, The Newt and many manor houses and estates across the county. We&apos;re happy to discuss your venue and any load-in or technical questions.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Do you cover the whole of Somerset?</dt>
                <dd className="text-gray-300 leading-relaxed">Yes. From Frome and Bruton to Castle Cary, Glastonbury, Wells, Taunton, Shepton Mallet, Yeovil and the Mendips—we cover the full county. No travel surcharge within Somerset.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Can we have a DJ and live musicians for our Somerset wedding?</dt>
                <dd className="text-gray-300 leading-relaxed">Yes. We offer solo DJs, DJ-plus-sax duos and our full lineup (DJ, sax and percussion). Many Somerset couples choose a DJ for the evening and add live elements for the drinks reception or first dance. We tailor the package to your venue and budget.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">What makes your Somerset wedding DJ service different?</dt>
                <dd className="text-gray-300 leading-relaxed">We&apos;re a boutique production studio, not a high-volume agency. Our DJs read the room, work to your must-plays and do-not-plays, and build the evening without gimmicks. No mic-shouting, no YMCA—just confident, tailored entertainment. In Somerset we can also add lighting design and venue styling from the same team.</dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">How do we book a wedding DJ in Somerset?</dt>
                <dd className="text-gray-300 leading-relaxed">Share your date, venue and timings. We&apos;ll check availability and send a tailored quote. A booking fee secures your date; the balance is due two weeks before the wedding. You&apos;ll get a planning worksheet and direct contact with your DJ.</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 bg-gray-900">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Book Your Somerset Wedding DJ
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

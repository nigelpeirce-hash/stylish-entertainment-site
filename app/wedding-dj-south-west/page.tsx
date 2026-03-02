import { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";

const baseUrl = "https://www.stylishentertainment.co.uk";

export const metadata: Metadata = createMetadata({
  title: "Wedding DJ South West | Somerset, Wiltshire, Devon, Dorset & Cotswolds",
  description: "Premium wedding DJs across the South West—Somerset, Wiltshire, Devon, Dorset, Gloucestershire, Bath & Bristol. Bespoke sets, no cheesy requests. Trusted at Mells Barn, North Cadbury Court, Pennard House and more.",
  pathname: "wedding-dj-south-west",
  keywords: [
    "wedding DJ South West",
    "Somerset wedding DJ",
    "Wiltshire wedding DJ",
    "Devon wedding DJ",
    "Dorset wedding DJ",
    "Bath wedding DJ",
    "Bristol wedding DJ",
    "Cotswolds wedding DJ",
    "Gloucestershire wedding DJ",
    "South West wedding entertainment",
    "Mells Barn wedding DJ",
    "North Cadbury Court wedding DJ",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do you travel across the whole South West?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We're based in Frome, Somerset, and regularly cover Somerset, Wiltshire, Devon, Dorset, Gloucestershire, Bath, Bristol and the Cotswolds. We also work at venues in Cornwall and the wider South West. Travel is included within our standard coverage area; we can quote for destinations further afield."
      }
    },
    {
      "@type": "Question",
      "name": "What makes your South West wedding DJs different?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We focus on atmosphere and flow rather than gimmicks. Our DJs read the room, build energy gradually and tailor sets to your taste. We offer solo DJs or our live lineup (DJ plus sax, or DJ plus sax and percussion). No mic-shouting, no cheesy requests—just polished entertainment that fits your venue and your guests."
      }
    },
    {
      "@type": "Question",
      "name": "Which South West venues do you know well?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We've performed at hundreds of venues across the region, including Mells Barn, North Cadbury Court, Pennard House, Kin House in Wiltshire, and many manor houses, barns and estates in Somerset, Wiltshire, Devon, Dorset and the Cotswolds. We're happy to discuss your venue and any technical or planning questions."
      }
    },
    {
      "@type": "Question",
      "name": "How do we book a wedding DJ in the South West?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Get in touch with your date, venue and rough timings. We'll check availability and send a tailored quote. Once you're ready, we secure your date with a booking fee; the balance is due two weeks before the wedding. You'll get access to our planning worksheet and a direct line to your DJ as the day approaches."
      }
    },
    {
      "@type": "Question",
      "name": "Can we have a DJ and live musicians?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We offer solo DJs, DJ-plus-sax duos and our full lineup with sax and percussion. Many South West couples choose a DJ for the evening reception and add live elements for the drinks reception or first dance. We can tailor the package to your venue and budget."
      }
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Wedding DJ South West",
  "description": "Premium wedding DJ and live DJ act services across the South West: Somerset, Wiltshire, Devon, Dorset, Gloucestershire, Bath, Bristol and the Cotswolds. Bespoke sets, professional equipment, no cheesy requests.",
  "provider": {
    "@id": `${baseUrl}/#localbusiness`,
  },
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "Somerset" },
    { "@type": "AdministrativeArea", "name": "Wiltshire" },
    { "@type": "AdministrativeArea", "name": "Devon" },
    { "@type": "AdministrativeArea", "name": "Dorset" },
    { "@type": "AdministrativeArea", "name": "Gloucestershire" },
    { "@type": "City", "name": "Bath" },
    { "@type": "City", "name": "Bristol" },
  ],
  "serviceType": "Wedding DJ",
};

export default function WeddingDJSouthWestPage() {
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
      <div>
        {/* Hero */}
        <section className="relative py-24 md:py-32 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-72 h-72 bg-champagne-gold/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-champagne-gold/5 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 container mx-auto max-w-4xl text-center">
            <p className="text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase mb-4">
              Wedding DJs Across the South West
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold text-white mb-6">
              Wedding DJ <span className="text-champagne-gold">South West</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Premium wedding DJs and live acts across Somerset, Wiltshire, Devon, Dorset, Gloucestershire, Bath, Bristol and the Cotswolds. Bespoke sets, no cheesy requests.
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="py-16 px-4 sm:px-6 bg-gray-900">
          <div className="container mx-auto max-w-3xl">
            <div className="prose prose-invert prose-lg max-w-none text-gray-200 space-y-6">
              <p className="text-gray-200 leading-relaxed">
                If you&apos;re planning a wedding in the South West, you&apos;re spoiled for choice when it comes to venues—from Somerset barns and Wiltshire manor houses to Devon estates and Cotswold stone. The right wedding DJ can make the difference between a nice evening and an unforgettable one. At STYLISH Entertainment we specialise in high-end wedding entertainment across the region: intelligent DJ sets, optional live sax and percussion, and a no-nonsense approach to requests (no YMCA, no gimmicks—just great flow and atmosphere).
              </p>
              <p className="text-gray-200 leading-relaxed">
                We&apos;re based in Frome, Somerset, and have spent years building relationships with venues and couples across the South West. That means we know the rooms, the power, the acoustics and the logistics—so your DJ isn&apos;t just turning up on the day; they&apos;re prepared. Whether you&apos;re marrying at a barn in Somerset, a house in Dorset or a country estate in Gloucestershire, we tailor the music and the production to your venue and your taste.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">
                Wedding DJ by Location in the South West
              </h2>
              <ul className="list-disc pl-6 space-y-1 text-gray-200">
                <li><Link href="/wedding-dj-somerset/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Wedding DJ Somerset</Link></li>
                <li><Link href="/wedding-dj-bath/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Wedding DJ Bath</Link></li>
                <li><Link href="/wedding-dj-bristol/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Wedding DJ Bristol</Link></li>
              </ul>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">
                Wedding DJs Across the South West: Where We Cover
              </h2>
              <p className="text-gray-200 leading-relaxed">
                We provide wedding DJ and live act services across the whole of the South West. Our core coverage includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-200">
                <li><strong className="text-white">Somerset</strong> — Frome, Bruton, Castle Cary, Glastonbury, Wells, Taunton, Shepton Mallet, Yeovil, Bridgwater and across the county</li>
                <li><strong className="text-white">Wiltshire</strong> — Malmesbury, Marlborough, Devizes, Salisbury, Bradford-on-Avon, Chippenham, Swindon and surrounding areas</li>
                <li><strong className="text-white">Devon</strong> — Exeter, Honiton, Tiverton, Dartmoor, the coast and beyond</li>
                <li><strong className="text-white">Dorset</strong> — Sherborne, Gillingham, Shaftesbury, Dorchester, Weymouth, Bridport and the Jurassic Coast</li>
                <li><strong className="text-white">Gloucestershire & the Cotswolds</strong> — Cheltenham, Gloucester, Stroud, Cirencester, Tetbury, the Cotswold villages and manor houses</li>
                <li><strong className="text-white">Bath & Bristol</strong> — City and surrounding areas, from Clifton to the Chew Valley</li>
              </ul>
              <p className="text-gray-200 leading-relaxed">
                Travel within this area is standard. For Cornwall or further afield we can quote on request. If your venue is in the South West, we&apos;re likely already familiar with it—or happy to get to know it.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">
                Venues We&apos;ve Worked At in the South West
              </h2>
              <p className="text-gray-200 leading-relaxed">
                We&apos;ve performed at hundreds of weddings across the region. That includes iconic barns like <Link href="/venues/mells-barn/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Mells Barn</Link>, historic houses such as <Link href="/venues/north-cadbury-court/" className="text-champagne-gold hover:text-champagne-gold/80 underline">North Cadbury Court</Link> and <Link href="/venues/pennard-house/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Pennard House</Link>, and stunning estates like <Link href="/kin-house-wiltshire/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Kin House in Wiltshire</Link>. We also work at many other manor houses, barns and exclusive venues across Somerset, Wiltshire, Devon, Dorset and the Cotswolds. You can browse more on our <Link href="/venues/" className="text-champagne-gold hover:text-champagne-gold/80 underline">venues page</Link> or tell us your venue when you <Link href="/contact-us/" className="text-champagne-gold hover:text-champagne-gold/80 underline">get in touch</Link>.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">
                Why Choose a South West Wedding DJ from STYLISH?
              </h2>
              <p className="text-gray-200 leading-relaxed">
                Our DJs are chosen for their ability to read a room and build a dance floor without resorting to clichés. We offer full five-hour sets, early setup where needed, and a digital planning worksheet so your playlist, must-plays and must-not-plays are locked in before the day. You can opt for a solo DJ or our live lineup (DJ plus sax, or DJ plus sax and percussion) for a festival feel. All our equipment is PAT tested and we carry full public liability insurance—so your venue is covered too.
              </p>
              <p className="text-gray-200 leading-relaxed">
                We know that &quot;wedding DJ South West&quot; throws up a lot of options. What we offer is a boutique, production-led approach: the same attention to detail we bring to private parties and corporate events, applied to your wedding. If that sounds like the fit you&apos;re after, we&apos;d love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 sm:px-6 bg-gray-800">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
              Frequently Asked Questions: Wedding DJ South West
            </h2>
            <dl className="space-y-6">
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Do you travel across the whole South West?</dt>
                <dd className="text-gray-300 leading-relaxed">
                  Yes. We&apos;re based in Frome, Somerset, and regularly cover Somerset, Wiltshire, Devon, Dorset, Gloucestershire, Bath, Bristol and the Cotswolds. We also work at venues in Cornwall and the wider South West. Travel is included within our standard coverage area; we can quote for destinations further afield.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">What makes your South West wedding DJs different?</dt>
                <dd className="text-gray-300 leading-relaxed">
                  We focus on atmosphere and flow rather than gimmicks. Our DJs read the room, build energy gradually and tailor sets to your taste. We offer solo DJs or our live lineup (DJ plus sax, or DJ plus sax and percussion). No mic-shouting, no cheesy requests—just polished entertainment that fits your venue and your guests.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Which South West venues do you know well?</dt>
                <dd className="text-gray-300 leading-relaxed">
                  We&apos;ve performed at hundreds of venues across the region, including Mells Barn, North Cadbury Court, Pennard House, Kin House in Wiltshire, and many manor houses, barns and estates in Somerset, Wiltshire, Devon, Dorset and the Cotswolds. We&apos;re happy to discuss your venue and any technical or planning questions.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">How do we book a wedding DJ in the South West?</dt>
                <dd className="text-gray-300 leading-relaxed">
                  Get in touch with your date, venue and rough timings. We&apos;ll check availability and send a tailored quote. Once you&apos;re ready, we secure your date with a booking fee; the balance is due two weeks before the wedding. You&apos;ll get access to our planning worksheet and a direct line to your DJ as the day approaches.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Can we have a DJ and live musicians?</dt>
                <dd className="text-gray-300 leading-relaxed">
                  Yes. We offer solo DJs, DJ-plus-sax duos and our full lineup with sax and percussion. Many South West couples choose a DJ for the evening reception and add live elements for the drinks reception or first dance. We can tailor the package to your venue and budget.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 bg-gray-900">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Book Your South West Wedding DJ
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Meet our <Link href="/artists/djs/" className="text-champagne-gold hover:text-champagne-gold/80 underline">wedding DJs</Link> and see who could be the right fit for your day. When you&apos;re ready, <Link href="/contact-us/" className="text-champagne-gold hover:text-champagne-gold/80 underline">get in touch</Link> with your date, venue and timings and we&apos;ll tailor a quote and check availability.
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

import { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { buildWeddingDjServiceJsonLd } from "@/lib/service-jsonld";

export const metadata: Metadata = createMetadata({
  title: "Wedding DJ London & Home Counties | Surrey, Berkshire, Buckinghamshire & Beyond",
  description: "Premium wedding DJs across London and the Home Counties—Surrey, Berkshire, Buckinghamshire, Hertfordshire, Essex and Kent. Bespoke sets for manor houses, barns and exclusive venues. No cheesy requests.",
  pathname: "wedding-dj-london-home-counties",
  keywords: [
    "wedding DJ London",
    "wedding DJ Home Counties",
    "Surrey wedding DJ",
    "Berkshire wedding DJ",
    "Buckinghamshire wedding DJ",
    "Hertfordshire wedding DJ",
    "Essex wedding DJ",
    "London wedding DJ",
    "Kent wedding DJ",
    "South East wedding DJ",
    "London wedding entertainment",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do you cover all of London and the Home Counties?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We travel regularly to London and the Home Counties for weddings and events. Our coverage includes Greater London, Surrey, Berkshire, Buckinghamshire, Hertfordshire, Essex, Kent and West Sussex. We're based in the South West but have extensive experience at London and Home Counties venues—from Mayfair rooftops to Surrey manor houses and Berkshire barns."
      }
    },
    {
      "@type": "Question",
      "name": "What do you offer for London and Home Counties weddings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer the same premium DJ and live act service as in the South West: solo DJs, DJ-plus-sax duos and our full lineup with sax and percussion. Our DJs read the room, tailor sets to your brief and avoid cheesy requests. We bring professional sound and lighting, and we work with your venue's requirements—whether that's a listed building, a barn or a private estate."
      }
    },
    {
      "@type": "Question",
      "name": "Which London and Home Counties venues have you worked at?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We've performed at hundreds of venues across the UK, including prestigious locations in London and the Home Counties. Our venue experience spans manor houses, barns, hotels and private estates in Surrey, Berkshire, Buckinghamshire, Hertfordshire, Essex and beyond. You can see more on our venues page or tell us your venue when you get in touch."
      }
    },
    {
      "@type": "Question",
      "name": "How do we book a wedding DJ in London or the Home Counties?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Send us your date, venue and timings. We'll check availability and send a tailored quote. To secure your date we take a booking fee; the balance is due two weeks before the wedding. You'll get access to our planning worksheet and direct contact with your DJ as the day approaches."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a travel charge for London and Home Counties?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We quote on a per-booking basis. Travel to London and the Home Counties is factored into our quote—we don't add surprise fees. Many of our team are on the road in the South East regularly, so we'll give you a clear price when you enquire."
      }
    },
  ],
};

const serviceSchema = buildWeddingDjServiceJsonLd({
  slug: "wedding-dj-london-home-counties",
  name: "Wedding DJ London & Home Counties",
  description:
    "Premium wedding DJ and live DJ act services across London and the Home Counties: Surrey, Berkshire, Buckinghamshire, Hertfordshire, Essex, Kent and West Sussex. Bespoke sets, professional equipment, no cheesy requests.",
  areaServed: [
    { "@type": "City", name: "London" },
    { "@type": "AdministrativeArea", name: "Surrey" },
    { "@type": "AdministrativeArea", name: "Berkshire" },
    { "@type": "AdministrativeArea", name: "Buckinghamshire" },
    { "@type": "AdministrativeArea", name: "Hertfordshire" },
    { "@type": "AdministrativeArea", name: "Essex" },
    { "@type": "AdministrativeArea", name: "Kent" },
    { "@type": "AdministrativeArea", name: "West Sussex" },
  ],
});

export default function WeddingDJLondonHomeCountiesPage() {
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
              Wedding DJs Across London & the Home Counties
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold text-white mb-6">
              Wedding DJ <span className="text-champagne-gold">London &amp; Home Counties</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Premium wedding DJs and live acts across London, Surrey, Berkshire, Buckinghamshire, Hertfordshire, Essex and Kent. Bespoke sets for manor houses, barns and exclusive venues.
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="py-16 px-4 sm:px-6 bg-gray-900">
          <div className="container mx-auto max-w-3xl">
            <div className="prose prose-invert prose-lg max-w-none text-gray-200 space-y-6">
              <p className="text-gray-200 leading-relaxed">
                London and the Home Counties are home to some of the UK&apos;s most sought-after wedding venues—from Surrey manor houses and Berkshire barns to Buckinghamshire estates and Hertfordshire country houses. The right wedding DJ can turn a beautiful setting into an unforgettable party. At STYLISH Entertainment we bring the same premium, no-nonsense approach we&apos;re known for in the South West to weddings across London and the Home Counties: intelligent sets, optional live sax and percussion, and a strict no-cheese policy (no YMCA, no gimmicks—just great atmosphere and flow).
              </p>
              <p className="text-gray-200 leading-relaxed">
                We&apos;re based in Frome, Somerset, but we travel to London and the South East regularly. Our teams have performed at prestigious venues across the capital and the Home Counties, so we understand the logistics, the sound requirements and the expectations of couples and venues alike. Whether you&apos;re marrying in a Mayfair townhouse, a Surrey barn or a Berkshire estate, we tailor the music and the production to your venue and your taste.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">
                Wedding DJs Across London & the Home Counties: Where We Cover
              </h2>
              <p className="text-gray-200 leading-relaxed">
                We provide wedding DJ and live act services across London and the surrounding counties. Our coverage includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-200">
                <li><strong className="text-white">London</strong> — Central London, West London, North London, South London, East London and the Greater London area</li>
                <li><strong className="text-white">Surrey</strong> — Guildford, Woking, Farnham, Haslemere, Cobham, Esher, Weybridge, Richmond, Kingston and across the county</li>
                <li><strong className="text-white">Berkshire</strong> — Windsor, Maidenhead, Ascot, Newbury, Reading, Hungerford and the Thames Valley</li>
                <li><strong className="text-white">Buckinghamshire</strong> — Amersham, Beaconsfield, Marlow, Aylesbury, Milton Keynes and the Chilterns</li>
                <li><strong className="text-white">Hertfordshire</strong> — St Albans, Harpenden, Hitchin, Hertford, Ware and the surrounding areas</li>
                <li><strong className="text-white">Essex</strong> — Chelmsford, Colchester, Saffron Walden, Dedham Vale and the county&apos;s manor houses and barns</li>
                <li><strong className="text-white">Kent & West Sussex</strong> — Tunbridge Wells, Sevenoaks, Tonbridge, and into West Sussex for venues near the Surrey and Hampshire borders</li>
              </ul>
              <p className="text-gray-200 leading-relaxed">
                We quote on a per-booking basis and factor in travel so you get one clear price. If your venue is in London or the Home Counties, we&apos;re ready to discuss your date and your vision.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">
                Venues We&apos;ve Worked At in London & the Home Counties
              </h2>
              <p className="text-gray-200 leading-relaxed">
                We&apos;ve performed at hundreds of weddings and events across the UK, including prestigious venues in London and the Home Counties. Our experience spans listed buildings, manor houses, barns, hotels and private estates in Surrey, Berkshire, Buckinghamshire, Hertfordshire, Essex and beyond. You can explore more on our <Link href="/venues/" className="text-champagne-gold hover:text-champagne-gold/80 underline">venues page</Link>—and when you <Link href="/contact-us/" className="text-champagne-gold hover:text-champagne-gold/80 underline">get in touch</Link>, tell us your venue so we can tailor our quote and any planning advice.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4">
                Why Choose a London & Home Counties Wedding DJ from STYLISH?
              </h2>
              <p className="text-gray-200 leading-relaxed">
                Our DJs are chosen for their ability to read a room and build a dance floor without resorting to clichés. We offer full five-hour sets, early setup where needed, and a digital planning worksheet so your playlist, must-plays and must-not-plays are locked in before the day. You can opt for a solo DJ or our live lineup (DJ plus sax, or DJ plus sax and percussion) for a festival feel. All our equipment is PAT tested and we carry full public liability insurance—so your venue is covered too.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Searching for a &quot;wedding DJ London&quot; or &quot;wedding DJ Home Counties&quot; brings up a lot of options. What we offer is a boutique, production-led approach: the same attention to detail we bring to weddings in the South West and to private parties and corporate events, applied to your London or Home Counties wedding. If that sounds like the fit you&apos;re after, we&apos;d love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 sm:px-6 bg-gray-800">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
              Frequently Asked Questions: Wedding DJ London & Home Counties
            </h2>
            <dl className="space-y-6">
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Do you cover all of London and the Home Counties?</dt>
                <dd className="text-gray-300 leading-relaxed">
                  Yes. We travel regularly to London and the Home Counties for weddings and events. Our coverage includes Greater London, Surrey, Berkshire, Buckinghamshire, Hertfordshire, Essex, Kent and West Sussex. We&apos;re based in the South West but have extensive experience at London and Home Counties venues—from Mayfair rooftops to Surrey manor houses and Berkshire barns.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">What do you offer for London and Home Counties weddings?</dt>
                <dd className="text-gray-300 leading-relaxed">
                  We offer the same premium DJ and live act service as in the South West: solo DJs, DJ-plus-sax duos and our full lineup with sax and percussion. Our DJs read the room, tailor sets to your brief and avoid cheesy requests. We bring professional sound and lighting, and we work with your venue&apos;s requirements—whether that&apos;s a listed building, a barn or a private estate.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Which London and Home Counties venues have you worked at?</dt>
                <dd className="text-gray-300 leading-relaxed">
                  We&apos;ve performed at hundreds of venues across the UK, including prestigious locations in London and the Home Counties. Our venue experience spans manor houses, barns, hotels and private estates in Surrey, Berkshire, Buckinghamshire, Hertfordshire, Essex and beyond. You can see more on our <Link href="/venues/" className="text-champagne-gold hover:text-champagne-gold/80 underline">venues page</Link> or tell us your venue when you get in touch.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">How do we book a wedding DJ in London or the Home Counties?</dt>
                <dd className="text-gray-300 leading-relaxed">
                  Send us your date, venue and timings. We&apos;ll check availability and send a tailored quote. To secure your date we take a booking fee; the balance is due two weeks before the wedding. You&apos;ll get access to our planning worksheet and direct contact with your DJ as the day approaches.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-white mb-2">Is there a travel charge for London and Home Counties?</dt>
                <dd className="text-gray-300 leading-relaxed">
                  We quote on a per-booking basis. Travel to London and the Home Counties is factored into our quote—we don&apos;t add surprise fees. Many of our team are on the road in the South East regularly, so we&apos;ll give you a clear price when you enquire.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 bg-gray-900">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Book Your London & Home Counties Wedding DJ
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

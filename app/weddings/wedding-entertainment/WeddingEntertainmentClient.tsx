"use client";

import { motion } from "@/lib/motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const VIBE_TILES = [
  {
    id: "dj",
    headline: "The Anti-Cheesy DJ",
    vibe: "No cringey banter, no \"Macarena,\" just incredible mixing and a packed floor. Career DJs who have held residencies at places like Babington House for 20+ years.",
    buttonText: "Meet the DJs",
    href: "/artists/djs/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163661/Hedsor-House-with-DJ-and-Sax_zv7pnl.jpg",
    imageAlt: "Hedsor House dance floor with DJ and sax – sophisticated wedding entertainment",
  },
  {
    id: "musicians",
    headline: "Live Musicians & Sax",
    vibe: "Elevate the energy. Whether it's a soulful acoustic duo for your ceremony or a high-octane Sax and Bongos player to jam alongside your DJ.",
    buttonText: "Explore Live Music",
    href: "/artists/musicians/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163839/Jade-and-Emma-0062_fz8ujk.jpg",
    imageAlt: "Live musicians performing at a wedding, showcasing saxophone and percussion",
  },
  {
    id: "lighting",
    headline: "Bespoke Lighting Design",
    vibe: "Lighting is the difference between a \"room\" and a \"vibe.\" We transform barns, marquees, and estates into Instagram-worthy masterpieces.",
    buttonText: "See the Glow",
    href: "/weddings/wedding-lighting/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162258/Fairy-light-Tunnel_sc40ed.jpg",
    imageAlt: "Fairy light tunnel – luxury wedding lighting transforming a venue",
  },
  {
    id: "extras",
    headline: "Fire-Pits & Styling",
    vibe: "For the moments off the dancefloor. Professional-grade fire-pit hire and venue styling that ties the whole aesthetic together.",
    buttonText: "View Extras",
    href: "/services/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163596/STYLISH-babs-july2016_ria-mishaal-photography_006_qmds40.jpg",
    imageAlt: "Babington House – fire pit and atmospheric wedding styling",
  },
];

const WEDDING_TESTIMONIALS = [
  {
    quote:
      "Just wanted to say thank you soo much for helping us host such an amazing night on our special day. It was such fun and we've had so many nice comments from guests about how good the evening part was! Nigel, you are a top tier DJ! You really brought the party vibe we wanted and were an absolutely great host. Cannot thank you enough! We will 100% be recommending Stylish Entertainment.",
    author: "Camilla & Dan Wilkins",
    venue: "Northover Manor Hotel, Ilchester, Somerset",
  },
  {
    quote:
      "We have been meaning to drop you a line to say a HUGE HUGE THANK YOU for doing such an amazing job with the DJing and lighting etc at our wedding. So many people commented on how great you were and how good the music was and it really made the night so special so really thank you from the bottom of our hearts. Everyone loved Mark Anthony as well and that all went really smoothly and I think the stage worked really well generally as a podium for people to dance on afterwards! Anyway we thought you were awesome and everyone had such a great time, thanks once again for making the party and hope to see you at Babington some time.",
    author: "Colin and Lian Lockhead",
    venue: "Babington House Hotel",
  },
  {
    quote:
      "We wanted to say thank you so much for Monday night. Also, many thanks for playing Come On Eileen for the first time. We really appreciated that and hopefully you didn't mind too much. We had the most perfect day and your DJ set was brilliant!!! We knew you meant business when you came straight in with Stayin' Alive after the band.",
    author: "Riley & Emily Broudie",
    venue: "Babington House Hotel, Somerset",
  },
];

export default function WeddingEntertainmentClient() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative isolate min-h-[70vh] overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0 -z-10">
          <div className="relative h-full w-full min-h-[70vh]">
            <Image
              src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163781/Emma-Conrad-2-9-23-682_utvftj.jpg"
              alt="Emma and Conrad's wedding with professional entertainment, elegant lighting design, and beautiful wedding atmosphere captured by The Falkenburgs Photography"
              fill
              className="object-cover object-center brightness-75"
              style={{ objectPosition: "center center" }}
              priority
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-gray-950" />
        </div>
        <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-end px-4 pb-8 pt-28 text-center sm:justify-center sm:pb-0 sm:pt-48 max-w-4xl mx-auto w-full">
          <div className="inline-block mb-6 px-6 py-2 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
            <span className="text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase">
              Trusted at Babington House since 2003
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Wedding Entertainment &amp; Production
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md mb-8">
            Wedding DJs, live musicians, lighting and styling — one experienced team shaping the atmosphere of your day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Link href="/contact-us/">Plan Your Wedding</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-[48px] border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 hover:scale-105 transition-all duration-300"
            >
              <Link href="/artists/djs/">Meet Our DJs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* The Gold Standard – Venue proof */}
      <section className="py-16 px-4 md:px-8 bg-gray-900/50 border-y border-champagne-gold/20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-champagne-gold tracking-widest uppercase mb-4">
            The Gold Standard
          </p>
          <p className="text-lg md:text-xl text-gray-200">
            Trusted suppliers at{" "}
            <Link
              href="/venues/babington-house/"
              className="text-champagne-gold hover:text-gold-light underline transition-colors"
            >
              Babington House
            </Link>{" "}
            since 2003,{" "}
            <a
              href="https://www.thenewtinsomerset.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-champagne-gold hover:text-gold-light underline transition-colors"
            >
              The Newt in Somerset
            </a>{" "}
            and <span className="text-champagne-gold">Euridge Manor</span>.
          </p>
        </div>
      </section>

      {/* What couples say */}
      <section className="pt-16 pb-6 px-4 md:pt-20 md:pb-8 md:px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Couples Say</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A small selection of five-star Google reviews from weddings across the UK.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 md:mb-10">
            {WEDDING_TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-gray-900/70 border-champagne-gold/30 backdrop-blur-sm">
                  <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                    <p className="text-gray-200 italic leading-relaxed mb-6 flex-grow text-sm sm:text-base">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <div className="border-t border-champagne-gold/20 pt-4">
                      <p className="text-champagne-gold font-bold">{testimonial.author}</p>
                      <p className="text-gray-400 text-sm mt-1">{testimonial.venue}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/testi/"
              className="inline-flex items-center gap-2 text-champagne-gold hover:text-gold-light font-semibold transition-colors"
            >
              Read all reviews
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Choose Your Vibe – 4-tile grid */}
      <section className="pt-4 pb-16 px-4 md:pt-12 md:pb-28 md:px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Choose Your Vibe</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              DJs, musicians, lighting, fire-pits—everything you need for a STYLISH celebration.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {VIBE_TILES.map((tile, index) => (
              <motion.div
                key={tile.id}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={tile.href} className="block group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border-2 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all duration-300">
                    <Image
                      src={tile.image}
                      alt={tile.imageAlt}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                        {tile.headline}
                      </h3>
                      <p className="text-gray-200 text-sm md:text-base mb-4 line-clamp-2 drop-shadow-md">
                        {tile.vibe}
                      </p>
                      <span className="inline-flex items-center gap-2 text-champagne-gold font-semibold group-hover:gap-3 transition-all">
                        {tile.buttonText}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry CTA */}
      <section className="py-20 px-4 md:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="border-2 border-champagne-gold/50 bg-gray-800 shadow-xl">
              <CardContent className="p-8 sm:p-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Ready to plan your wedding entertainment?
                </h2>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                  Tell us your date, venue and vision — we reply within 24 hours with a tailored proposal.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    asChild
                    size="lg"
                    className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <Link href="/contact-us/">Enquire &amp; Check Availability</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="min-h-[48px] border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
                  >
                    <a href="tel:+447970793177">Call 07970 793177</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

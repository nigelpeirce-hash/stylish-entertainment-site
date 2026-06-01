"use client";

import { motion } from "@/lib/motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const linkClass =
  "text-champagne-gold hover:text-gold-light underline underline-offset-2 transition-colors";

const STORY_TIMELINE = [
  {
    label: "Teenage years",
    copy: "Nigel started DJing at 14 — local clubs and events long before it became a career.",
  },
  {
    label: "Radio & production",
    copy: "Freelance work for Pete Tong's Essential Selection and London radio — learning music programming under real broadcast pressure.",
  },
  {
    label: "Factory Studios",
    copy: "Co-founded Factory Studios, an award-winning TV and radio production company. Those production standards still shape how we plan and deliver events.",
  },
  {
    label: "2003",
    copy: "Resident DJ at Babington House — a relationship that continues to define how we work at serious venues.",
  },
  {
    label: "2004",
    copy: "STYLISH Entertainment established — Ali and Nigel formalised the business couples and venues were already booking.",
  },
  {
    label: "Today",
    copy: "DJs, lighting, venue styling and production support — one small family-run team, Somerset based and UK-wide.",
  },
];

const DIFFERENTIATORS = [
  {
    title: "Atmosphere First",
    description:
      "We plan DJ sets, lighting and styling as one atmosphere — how the room should feel at drinks, dinner and when the dancefloor opens — not as separate suppliers ticking boxes.",
  },
  {
    title: "Trusted At Leading Venues",
    description:
      "Babington House since 2003, plus regular work at Kin House, Mells Barn, North Cadbury Court and country estates across the South West. Venues rebook us because the technical and personal standards hold up.",
  },
  {
    title: "Music, Lighting & Production Together",
    description:
      "When you want one team shaping the evening, music and lighting are planned together — timings, power, rigging and mood — rather than two companies meeting for the first time on the day.",
  },
  {
    title: "Small Team, Personal Service",
    description:
      "You work directly with Ali and Nigel — not a call centre or rotating account manager. Two people who care how your event feels when the lights go down.",
  },
];

const SERVICE_CARDS = [
  {
    title: "Entertainment",
    description: "DJs, bands and evening flow — programmed for your crowd, not a generic wedding playlist.",
    href: "/weddings/wedding-entertainment/",
  },
  {
    title: "Lighting",
    description: "Uplighting, canopies, festoon and dancefloor design for barns, marquees and estates.",
    href: "/weddings/wedding-lighting/",
  },
  {
    title: "Venue Styling",
    description: "Drapery, props, table styling and transformation — the room before guests arrive.",
    href: "/services/venue-styling/",
  },
  {
    title: "Production",
    description: "Sound, microphones, ceremony audio and technical support when the brief needs more than a DJ rig.",
    href: "/services/kit-hire/",
  },
];

const TRUSTED_VENUE_STRIP: Array<{ name: string; href?: string }> = [
  { name: "Babington House", href: "/venues/babington-house/" },
  { name: "Kin House", href: "/kin-house-wiltshire/" },
  { name: "Mells Barn", href: "/venues/mells-barn/" },
  { name: "North Cadbury Court", href: "/venues/north-cadbury-court/" },
  { name: "Pennard House", href: "/venues/pennard-house/" },
];

const TRUSTED_SINCE_2003 = [
  {
    title: "Babington House",
    copy: "Resident DJ since 2003 — hundreds of weddings and parties at one of the UK's most celebrated venues.",
    href: "/venues/babington-house/",
    linkLabel: "Babington guide",
  },
  {
    title: "Open-format DJ",
    copy: "Soul, disco, house, indie, R&B and party classics — mixed with timing and instinct, not a rigid playlist.",
  },
  {
    title: "Music + Lighting",
    copy: "DJ sets and lighting design from one team so the evening feels joined-up.",
    href: "/weddings/wedding-lighting/",
    linkLabel: "Wedding lighting",
  },
  {
    title: "Discretion & Professionalism",
    copy: "Trusted by private and high-profile clients who value calm delivery and confidentiality on the night.",
  },
];

export default function AboutClient() {
  return (
    <div>
      <section
        className="pt-20 pb-8 px-3 sm:px-4"
        style={{
          background:
            "radial-gradient(circle at top, rgb(55 65 81) 0%, rgb(31 41 55) 50%, rgb(17 24 39) 100%)",
        }}
      >
        <div className="container mx-auto max-w-5xl space-y-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold tracking-wide px-4">
              About Us
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white md:text-gray-300 font-semibold px-4 max-w-3xl mx-auto leading-relaxed">
              A family-run team for weddings, private parties and corporate events — DJs, lighting
              and production from one experienced pair, trusted at Babington House since 2003.
            </p>
          </motion.div>

          {/* Short intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gray-900 border-champagne-gold/30">
              <CardContent className="p-6 sm:p-8">
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg text-center max-w-3xl mx-auto">
                  STYLISH Entertainment is Ali and Nigel Peirce — two people, not an agency roster.
                  Ali leads client experience, venue relationships and styling; Nigel (DJ Nige) leads
                  music and the technical side of how a room should feel. From weddings and private
                  parties to corporate events, the same team plans the atmosphere. Everything else on
                  this page is the story of how that partnership grew.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* The Story Behind STYLISH */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <Card className="bg-gradient-to-br from-champagne-gold/20 md:from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.1)] md:shadow-none">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold tracking-wide">
                  The Story Behind STYLISH
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0">
                <ol className="relative border-l border-champagne-gold/30 ml-3 sm:ml-4 space-y-8">
                  {STORY_TIMELINE.map((item) => (
                    <li key={item.label} className="pl-6 sm:pl-8">
                      <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-champagne-gold" />
                      <h3 className="text-lg font-bold text-champagne-gold mb-1">{item.label}</h3>
                      <p className="text-gray-200 md:text-gray-300 leading-relaxed text-sm sm:text-base">
                        {item.copy}
                      </p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.div>

          {/* Our Heritage & Experience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-gray-900 border-champagne-gold/30">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold tracking-wide">
                  Our Heritage &amp; Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  STYLISH grew from Nigel&apos;s music and production background and Ali&apos;s work in
                  interior design, luxury hospitality and event logistics — two disciplines that
                  naturally belong together when you care about atmosphere, not just equipment.
                </p>
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  What started as DJ bookings became lighting design, venue styling and full
                  production support as couples and venues asked for one team they could trust. We
                  formalised the company in 2004; the Babington House residency from 2003 gave us a
                  benchmark for how serious venues expect suppliers to behave.
                </p>
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  Today we work UK-wide from Somerset — same small team, same direct relationship,
                  whether the brief is a DJ for one evening or lighting and production across a
                  whole weekend.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* What Sets Us Apart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Card className="bg-gray-900 border-champagne-gold/30">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold tracking-wide">
                  What Sets Us Apart
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-5">
                {DIFFERENTIATORS.map((item) => (
                  <div key={item.title}>
                    <h3 className="text-xl font-bold text-champagne-gold mb-2">{item.title}</h3>
                    <p className="text-gray-200 md:text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* What we do — four cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gray-900 border-champagne-gold/30">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold tracking-wide">
                  What We Do
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SERVICE_CARDS.map((service) => (
                    <Link
                      key={service.title}
                      href={service.href}
                      className="group block p-5 rounded-xl bg-gray-800/60 border border-champagne-gold/20 hover:border-champagne-gold/50 transition-colors"
                    >
                      <h3 className="text-lg font-bold text-champagne-gold mb-2 group-hover:text-gold-light">
                        {service.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        {service.description}
                      </p>
                      <span className="inline-flex items-center text-sm text-champagne-gold/90 group-hover:text-champagne-gold">
                        Learn more
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Where We Work */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Card className="bg-gradient-to-br from-champagne-gold/20 md:from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.1)] md:shadow-none">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold tracking-wide">
                  Where We Work
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0">
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  Based in Frome, Somerset — at the heart of the South West wedding market — and
                  working UK-wide for the right events. Somerset, Wiltshire, Dorset, Bath, Bristol
                  and London are home turf; we regularly travel further when the brief suits.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Meet the Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-center mb-8 pt-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white font-serif font-bold mb-4 tracking-wide">
              Meet the <span className="text-gradient">Team</span>
            </h2>
            <p className="text-white md:text-gray-300 text-base sm:text-lg">
              The two people behind every STYLISH event
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Ali */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-1"
            >
              <Card className="bg-gray-900 border-champagne-gold/30 h-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="relative w-full aspect-square mb-6 rounded-lg overflow-hidden bg-gray-700">
                    <Image
                      src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162313/Ali-Peirce_aec3tn.jpg"
                      alt="Ali Peirce — Stylish Entertainment"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-champagne-gold mb-2 tracking-wide">
                    Meet Ali
                  </h3>
                  <p className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider">
                    Client experience &amp; styling
                  </p>
                  <div className="space-y-4 text-gray-200 md:text-gray-300 leading-relaxed">
                    <p>
                      Ali brings interior design, luxury hospitality and project management to every
                      booking — the eye for detail that runs through styling, guest experience and
                      how an event is planned, not just how it looks in photos.
                    </p>
                    <p>
                      She is the main contact for venue relationships and the luxe, personal service
                      couples expect when they are spending properly on a celebration. If something
                      needs coordinating across suppliers, Ali is usually the one making it happen.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* DJ Nige */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="lg:col-span-1"
            >
              <Card className="bg-gray-900 border-champagne-gold/30 h-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="relative w-full aspect-square mb-6 rounded-lg overflow-hidden bg-gray-700">
                    <Image
                      src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162279/Nigel-DJ-Babs-House-0009-1_f59b99.jpg"
                      alt="DJ Nige at Babington House — wedding and event DJ"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-champagne-gold mb-2 tracking-wide">
                    <Link href="/artists/djs/dj-nige/" className="hover:text-gold-light transition-colors">
                      Meet DJ Nige
                    </Link>
                  </h3>
                  <p className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider">
                    Founder &amp; resident DJ
                  </p>
                  <div className="space-y-4 text-gray-200 md:text-gray-300 leading-relaxed">
                    <p>
                      Nigel is an open-format wedding and event DJ — soul, disco, house, indie,
                      R&amp;B and party classics chosen with the flow of your day, not a fixed
                      playlist. He reads rooms; that is what couples book him for.
                    </p>
                    <p>
                      The timeline above tells the career story. For Babington House detail, mixing
                      style and production background, see his full profile.
                    </p>
                    <Button
                      asChild
                      className="w-full sm:w-auto bg-champagne-gold text-black hover:bg-champagne-gold/90"
                    >
                      <Link href="/artists/djs/dj-nige/">
                        View DJ Nige profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trusted Since 2003 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="lg:col-span-1"
            >
              <Card className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-champagne-gold/30 h-full">
                <CardHeader className="p-6 sm:p-8 pb-4">
                  <CardTitle className="text-xl md:text-2xl font-serif font-bold text-champagne-gold tracking-wide">
                    Trusted Since 2003
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0 space-y-5">
                  {TRUSTED_SINCE_2003.map((item, index) => (
                    <div
                      key={item.title}
                      className={index > 0 ? "border-t border-champagne-gold/30 pt-5" : ""}
                    >
                      <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        {item.copy}
                        {item.href && item.linkLabel && (
                          <>
                            {" "}
                            <Link href={item.href} className={linkClass}>
                              {item.linkLabel}
                            </Link>
                          </>
                        )}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Trusted by couples & venues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mb-8"
          >
            <div className="rounded-xl border border-champagne-gold/25 bg-gray-900/80 px-4 sm:px-8 py-8 text-center">
              <p className="text-xs font-semibold text-champagne-gold uppercase tracking-wider mb-5">
                Trusted By Couples &amp; Venues Since 2003
              </p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                {TRUSTED_VENUE_STRIP.map(({ name, href }) =>
                  href ? (
                    <Link
                      key={name}
                      href={href}
                      className="text-sm sm:text-base text-gray-200 hover:text-champagne-gold transition-colors font-medium"
                    >
                      {name}
                    </Link>
                  ) : (
                    <span key={name} className="text-sm sm:text-base text-gray-200 font-medium">
                      {name}
                    </span>
                  )
                )}
              </div>
            </div>
          </motion.div>

          {/* Our Promise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-gray-900 border-champagne-gold/30">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold tracking-wide">
                  Our Promise to You
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0">
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg mb-6">
                  Events are built on trust. We answer calls, turn up when we say we will,
                  communicate clearly and solve problems before they become visible to guests. That
                  sounds simple, but after twenty years in the industry we know it matters.
                </p>
                <p className="text-center">
                  <Link
                    href="/contact-us/"
                    className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-lg bg-champagne-gold text-gray-900 font-semibold hover:bg-champagne-gold/90 transition-colors"
                  >
                    Get in touch
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

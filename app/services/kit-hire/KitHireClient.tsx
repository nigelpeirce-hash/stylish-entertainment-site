"use client";

import type { ReactNode } from "react";
import { motion } from "@/lib/motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WaveDivider from "@/components/WaveDivider";
import {
  Building2,
  FileText,
  Headphones,
  Lightbulb,
  Mic,
  Music2,
  Shield,
  Speaker,
  Trees,
  Users,
} from "lucide-react";

const linkClass =
  "text-champagne-gold hover:text-gold-light underline underline-offset-2 transition-colors";

const HERO_IMAGE =
  "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162508/Kin-House-Stage-Lighting-and-Sound-supply_j8yln4.jpg";

const technicalSupportByNeed: Array<{ Icon: typeof Mic; title: string; copy: ReactNode }> = [
  {
    Icon: Mic,
    title: "Speech & ceremony",
    copy: "Wireless microphones, discreet PA and ceremony audio for vows, readings and toasts — clarity planned for the room, not volume for its own sake.",
  },
  {
    Icon: Speaker,
    title: "Party & DJ sound",
    copy: (
      <>
        Sound systems for private celebrations and dancefloors — sized for guest numbers and how the
        room behaves, with{" "}
        <Link href="/artists/djs/" className={linkClass}>
          DJ
        </Link>{" "}
        support when the brief needs it.
      </>
    ),
  },
  {
    Icon: Music2,
    title: "Band & live performance",
    copy: "PA, microphones, monitoring and engineer support for singers, musicians, bands and hybrid DJ/live setups — configured for performance, not a generic rig dropped at the door.",
  },
  {
    Icon: Building2,
    title: "Corporate production",
    copy: (
      <>
        Presentation microphones, playback and awards-night support for brand events — technical
        confidence for hosts who cannot afford a failure on the day. See{" "}
        <Link href="/parties/corporate/" className={linkClass}>
          corporate event production
        </Link>
        .
      </>
    ),
  },
  {
    Icon: Trees,
    title: "Marquee & outdoor",
    copy: "Sound and coverage for marquees, gardens and courtyards — outdoor event production where acoustics and power need proper planning.",
  },
  {
    Icon: Lightbulb,
    title: "Lighting support",
    copy: (
      <>
        Uplighting, dancefloor rigs and mirror balls where lighting supports the event — coordinated
        with{" "}
        <Link href="/weddings/wedding-lighting/" className={linkClass}>
          wedding lighting
        </Link>{" "}
        and{" "}
        <Link href="/parties/party-lighting/" className={linkClass}>
          party lighting
        </Link>{" "}
        when appropriate, not styling props.
      </>
    ),
  },
];

const typicalSoundBriefs = [
  {
    title: "Wedding ceremony",
    copy: "Wireless microphones, discreet PA and music playback — vow audio and readings heard clearly without dominating a small space.",
  },
  {
    title: "Marquee party",
    copy: "Dinner sound, speeches and dancefloor audio — one technical programme from welcome drinks through to the last track.",
  },
  {
    title: "Awards night",
    copy: "Presentation microphones, playback and awards stings — walk-up music and announcements handled with calm professional support.",
  },
  {
    title: "Live band event",
    copy: "Band PA, monitors and engineer support — live performance configured properly, not a speaker stack left for the band to sort out.",
  },
];

const productionScaleItems = [
  "One wireless microphone for speeches",
  "Small PA for a wedding ceremony",
  "DJ sound and lighting for a private party",
  "Band PA and microphones for live performance",
  "Corporate sound and presentation support",
  "Marquee sound and lighting package",
  "Full technical production with crew",
];

const whySetupMatters = [
  "Bad sound ruins speeches — guests cannot follow awards, toasts or ceremony readings.",
  "Incorrect speaker placement creates dead spots or painful volume at the back of the room.",
  "Wireless microphones need planning — interference, handover and battery life matter on the day.",
  "Outdoor and marquee sound behaves differently from a hotel function room.",
  "Professional setup prevents stress for planners, couples, hosts and venue teams.",
];

const whereThisFits: Array<{ label: string; copy: ReactNode }> = [
  {
    label: "Atmosphere and transformation",
    copy: (
      <>
        See{" "}
        <Link href="/party-planning-and-organising/" className={linkClass}>
          private event production
        </Link>{" "}
        for creative direction, styling and production managed as one story.
      </>
    ),
  },
  {
    label: "Wedding lighting design",
    copy: (
      <>
        See{" "}
        <Link href="/weddings/wedding-lighting/" className={linkClass}>
          wedding lighting design
        </Link>{" "}
        for uplighting, fairy lights, festoon and dancefloor atmosphere.
      </>
    ),
  },
  {
    label: "Party lighting",
    copy: (
      <>
        See{" "}
        <Link href="/parties/party-lighting/" className={linkClass}>
          party lighting
        </Link>{" "}
        for mirror balls, courtyard lighting and celebration energy.
      </>
    ),
  },
  {
    label: "Styling and finishing touches",
    copy: (
      <>
        See{" "}
        <Link href="/services/venue-styling/" className={linkClass}>
          venue styling
        </Link>{" "}
        for props, table styling, backdrops and visual transformation — not this page.
      </>
    ),
  },
  {
    label: "DJs and entertainment",
    copy: (
      <>
        See our{" "}
        <Link href="/artists/djs/" className={linkClass}>
          DJs
        </Link>{" "}
        when the brief needs entertainment and programming, not sound support alone.
      </>
    ),
  },
];

const peaceOfMindItems = [
  {
    Icon: Shield,
    title: "PAT-tested equipment",
    copy: "All sound and lighting equipment tested and maintained to required standards.",
  },
  {
    Icon: FileText,
    title: "£10m Public Liability Insurance",
    copy: "Full coverage for weddings, private parties, corporate venues and outdoor events.",
  },
  {
    Icon: Headphones,
    title: "Professional setup",
    copy: "Installed, tested and configured for your venue layout — not dropped off without advice.",
  },
  {
    Icon: Users,
    title: "Technical support",
    copy: "Experienced crew when the event needs operation, troubleshooting and calm on the day.",
  },
  {
    Icon: Building2,
    title: "Venue coordination",
    copy: "We work with venues, planners and suppliers so sound fits the programme properly.",
  },
  {
    Icon: Speaker,
    title: "Clear recommendations",
    copy: "Honest advice based on guest numbers, speeches, music and performance requirements.",
  },
];

const KIT_HIRE_FAQ_ITEMS: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "Can you provide microphones for speeches?",
    answer:
      "Yes. Wireless microphones for speeches, toasts, awards and announcements — planned for room size, presenter movement and handover between speakers.",
  },
  {
    question: "Can you supply sound for a wedding ceremony?",
    answer:
      "Yes. Discreet PA and wireless microphones for ceremonies — vow audio, readings and music playback where the venue requires it.",
  },
  {
    question: "Do you provide PA systems for parties?",
    answer:
      "Yes. Sound systems sized for your guest numbers and dancefloor — professionally installed and supported for weddings and private parties.",
  },
  {
    question: "Can you support bands and live musicians?",
    answer:
      "Yes. PA, microphones and technical support for singers, musicians and bands — including hybrid setups with DJs and live performance.",
  },
  {
    question: "Can you provide sound in a marquee or garden?",
    answer:
      "Yes. Outdoor and marquee event production — coverage planned for temporary structures, gardens and courtyards.",
  },
  {
    question: "Can you provide lighting as well as sound?",
    answer: (
      <>
        Yes, where the brief suits. Dancefloor lighting, uplighting and production support alongside
        sound — see{" "}
        <Link href="/weddings/wedding-lighting/" className={linkClass}>
          wedding lighting
        </Link>{" "}
        and{" "}
        <Link href="/parties/party-lighting/" className={linkClass}>
          party lighting
        </Link>{" "}
        for atmosphere-led design.
      </>
    ),
  },
  {
    question: "Do you install and operate the equipment?",
    answer:
      "Yes. We install, test and operate equipment on the day when required — the goal is speeches and music working properly, not a dry-hire box left at the venue.",
  },
  {
    question: "Are you insured and PAT tested?",
    answer:
      "Yes. PAT-tested equipment and £10m public liability insurance — documentation available for venues and corporate procurement teams.",
  },
  {
    question: "How do we know what equipment we need?",
    answer: (
      <>
        Tell us your venue, guest numbers and what the day involves — speeches, ceremony, band, DJ,
        awards or all of the above. We recommend honestly via our{" "}
        <Link href="/contact-us/" className={linkClass}>
          contact page
        </Link>
        ; most clients do not need to understand mixer channels or speaker coverage themselves.
      </>
    ),
  },
];

export default function KitHireClient() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGE}
            alt="Stage with professional sound and lighting setup for a wedding reception"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/55 to-gray-950/90" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52 pb-8"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Sound, Lighting &amp; Event Production
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md mb-8 max-w-3xl mx-auto leading-relaxed">
            Sound systems, wireless microphones, lighting and technical support for weddings,
            private parties and corporate events — professionally installed, tested and managed so
            speeches, music and production work properly on the day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <Button
              asChild
              size="lg"
              className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Link href="/contact-us/">Discuss Your Technical Requirements</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-[48px] border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <a href="tel:+447970793177">Call 07970 793177</a>
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 drop-shadow-md">
            PAT tested · £10m Public Liability · Weddings, parties &amp; corporate events
          </p>
        </motion.div>
        <div className="relative z-20 w-full">
          <WaveDivider />
        </div>
      </section>

      <div
        style={{
          background:
            "radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)",
        }}
      >
        {/* Most Clients Don't Need Kit Hire */}
        <section className="py-20 px-3 sm:px-4 lg:px-8">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Most Clients Don&apos;t Need Kit Hire
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed mb-6">
                Most people do not know what size PA system they need. They do not need to understand
                speaker coverage, mixer channels or microphone types.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                They need guests to hear speeches, music to sound good and the technical side handled
                without stress — event technical production planned around how your event actually works.
              </p>
              <p className="text-gray-200 text-lg leading-relaxed">
                That is why we recommend systems based on guest numbers, venue layout, speeches, music
                and performance requirements — not a shopping list of equipment.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Technical Support By Event Need */}
        <section className="py-20 px-3 sm:px-4 lg:px-8 bg-gray-950/50 border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Technical Support By Event Need
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Sound and lighting support shaped by what your event requires — professional setup
                and operation, not a shopping list or dry-hire catalogue.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technicalSupportByNeed.map(({ Icon, title, copy }) => (
                <Card
                  key={title}
                  className="bg-gray-900/70 border border-champagne-gold/20 hover:border-champagne-gold/40 transition-colors"
                >
                  <CardContent className="p-6">
                    <Icon className="w-8 h-8 text-champagne-gold mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{copy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Simple Support To Full Production */}
        <section className="py-20 px-3 sm:px-4 lg:px-8">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
                Simple Support To Full Production
              </h2>
              <p className="text-gray-400 text-center mb-8 leading-relaxed">
                Not every event needs a huge setup. We advise honestly on what is enough.
              </p>
              <ul className="space-y-2">
                {productionScaleItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-300 text-sm sm:text-base leading-relaxed p-3 rounded-lg bg-gray-900/40 border border-champagne-gold/10"
                  >
                    <span className="text-champagne-gold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Typical Sound & Production Briefs */}
        <section className="py-20 px-3 sm:px-4 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-10">
                <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
                  <span className="text-champagne-gold text-xs font-semibold uppercase tracking-wider">
                    Illustration
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Typical Sound &amp; Production Briefs
                </h2>
                <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
                  Not named case studies — just the kind of technical briefs we support regularly.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {typicalSoundBriefs.map((brief) => (
                  <div
                    key={brief.title}
                    className="p-5 rounded-xl bg-gray-900/70 border border-champagne-gold/20"
                  >
                    <h3 className="text-lg font-bold text-champagne-gold mb-2 capitalize">
                      {brief.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{brief.copy}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Professional Setup Matters */}
        <section className="py-20 px-3 sm:px-4 lg:px-8 bg-gray-950/60 border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
                Why Professional Setup Matters
              </h2>
              <ul className="space-y-4">
                {whySetupMatters.map((point, idx) => (
                  <li
                    key={idx}
                    className="text-base sm:text-lg leading-relaxed text-gray-300 pl-4 border-l-2 border-champagne-gold/40"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Where This Fits */}
        <section className="py-20 px-3 sm:px-4 lg:px-8 bg-gray-950/50 border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
                Where This Fits
              </h2>
              <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto leading-relaxed">
                This page owns sound, PA, microphones and technical production. Related pages own
                atmosphere, styling and entertainment.
              </p>
              <div className="space-y-4">
                {whereThisFits.map(({ label, copy }) => (
                  <div
                    key={label}
                    className="p-4 rounded-xl bg-gray-900/70 border border-champagne-gold/15"
                  >
                    <p className="text-champagne-gold font-semibold mb-1">{label}</p>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{copy}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Peace of Mind */}
        <section className="py-20 px-3 sm:px-4 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/40">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-8 w-8 text-champagne-gold" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Peace of Mind</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {peaceOfMindItems.map(({ Icon, title, copy }) => (
                      <div key={title} className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-champagne-gold mt-1 shrink-0" />
                        <div>
                          <h3 className="text-white font-semibold mb-1">{title}</h3>
                          <p className="text-gray-300 text-sm leading-relaxed">{copy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 px-3 sm:px-4 lg:px-8 bg-gray-950/50 border-t border-champagne-gold/10">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {KIT_HIRE_FAQ_ITEMS.map((item, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-champagne-gold/20 bg-gray-900/60 overflow-hidden"
                  >
                    <summary className="cursor-pointer list-none px-5 py-4 text-white font-semibold hover:bg-champagne-gold/5 transition-colors [&::-webkit-details-marker]:hidden flex justify-between items-center gap-4">
                      {item.question}
                      <span className="text-champagne-gold text-xl shrink-0 group-open:rotate-45 transition-transform">
                        +
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-gray-300 leading-relaxed text-sm sm:text-base border-t border-champagne-gold/10 pt-4">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-3 sm:px-4 lg:px-8">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <CardContent className="p-8 sm:p-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                    Not sure what you need?
                  </h2>
                  <p className="text-gray-200 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                    Tell us your venue, guest numbers and what the day involves. We will recommend
                    sound and technical production honestly — so speeches land, music sounds good and
                    the technical side is handled properly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                    <Button
                      asChild
                      size="lg"
                      className="min-h-[48px] bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300"
                    >
                      <Link href="/contact-us/">Discuss Your Technical Requirements</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="min-h-[48px] border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
                    >
                      <a href="tel:+447970793177">Call 07970 793177</a>
                    </Button>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Also see{" "}
                    <Link href="/party-planning-and-organising/" className={linkClass}>
                      private event production
                    </Link>
                    ,{" "}
                    <Link href="/weddings/wedding-lighting/" className={linkClass}>
                      wedding lighting
                    </Link>{" "}
                    and{" "}
                    <Link href="/parties/party-lighting/" className={linkClass}>
                      party lighting
                    </Link>
                    .
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}

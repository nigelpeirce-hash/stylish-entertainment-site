"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { motion } from "@/lib/motion";
import Link from "next/link";
import Image from "next/image";
import Gallery, { Photo } from "@/components/Gallery";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calculator,
  Gift,
  Home,
  Lightbulb,
  Music2,
  Sparkles,
  Trees,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ServiceQuoteGenerator } from "@/components/ServiceQuoteGenerator";

const linkClass =
  "text-champagne-gold hover:text-gold-light underline underline-offset-2 transition-colors";

const HERO_IMAGE =
  "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768741948/Saltburn_231005__0020_0640_nmzjp6.jpg";

const HERO_ALT =
  "Babington House Orangery with fairy-light canopy over long dining tables — venue styling by Stylish Entertainment";

const stylingPhotos: Photo[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163723/IMG_6321_xu8q8j.jpg",
    width: 1200,
    height: 800,
    alt: "Reception room styled with warm uplighting, long banquet tables and floral centrepieces",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768742034/IMG_1348_161201_zwmdh2.jpg",
    width: 1200,
    height: 800,
    alt: "Orangery evening reception with layered lighting and dressed tables ready for guests",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768742094/IMG_4162_h3h0bb.jpg",
    width: 1200,
    height: 800,
    alt: "Orangery dining with hanging shades, candlelight and warm glow across the room",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768742204/Saltburn_231005__0050_1558_y6diu8.jpg",
    width: 1200,
    height: 800,
    alt: "Babington House Orangery transformed for evening dining with soft mood lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163679/IMG_3094-1_aiyu5i.jpg",
    width: 1200,
    height: 800,
    alt: "Barn reception with fairy-light canopy and mirror ball over a packed dancefloor",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163675/DSC00018_kixfyj.jpg",
    width: 1200,
    height: 800,
    alt: "Draped backdrop and table styling with soft uplighting and finishing touches",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163647/Orangery-violet_c95cvu.jpg",
    width: 1200,
    height: 800,
    alt: "Orangery transformed with violet uplighting and candlelight",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg",
    width: 1200,
    height: 800,
    alt: "Stretch marquee lined with festoon and fairy lights for an evening reception",
  },
];

const after20YearsPoints = [
  "Guests rarely remember individual decorations. They remember walking into a room and feeling the reaction around them.",
  "The moment a marquee no longer feels like a marquee.",
  "The moment a barn becomes a celebration.",
  "The moment an empty room suddenly feels warm, considered and alive.",
  "That is what styling is really about — not props on their own, but the feeling when everything works together.",
];

const whatWeStyle: Array<{ Icon: typeof Home; title: string; copy: ReactNode }> = [
  {
    Icon: Sparkles,
    title: "Weddings",
    copy: "Orangeries, barns, marquees, country houses and estate spaces — wedding venue styling planned with lighting and guest flow from arrival to last dance.",
  },
  {
    Icon: Users,
    title: "Private parties",
    copy: (
      <>
        Milestone birthdays, house parties, garden parties and themed celebrations — see our{" "}
        <Link href="/parties/private-parties/" className={linkClass}>
          private parties
        </Link>{" "}
        and{" "}
        <Link href="/party-planning-and-organising/" className={linkClass}>
          private event production
        </Link>{" "}
        approach applied to styling.
      </>
    ),
  },
  {
    Icon: Building2,
    title: "Corporate events",
    copy: (
      <>
        Awards nights, product launches, client entertaining and brand events — polished event styling
        that reflects your company properly. See{" "}
        <Link href="/parties/corporate/" className={linkClass}>
          corporate event production
        </Link>
        .
      </>
    ),
  },
  {
    Icon: Gift,
    title: "Seasonal events",
    copy: (
      <>
        Christmas parties, winter galas and themed celebrations — festive styling with warmth and
        atmosphere. See our{" "}
        <Link href="/parties/christmas/" className={linkClass}>
          Christmas party production
        </Link>{" "}
        page.
      </>
    ),
  },
  {
    Icon: Trees,
    title: "Outdoor spaces",
    copy: (
      <>
        Terraces, courtyards, gardens, arrival areas and{" "}
        <Link href="/services/fire-pit-hire/" className={linkClass}>
          fire pit
        </Link>{" "}
        lounges — outdoor styling that keeps guests using the space after dark.
      </>
    ),
  },
];

const whatWeProvide = [
  "Styling consultation and creative direction",
  "Table styling and centrepiece coordination",
  "Draping and fabric installations",
  "Backdrops and photo areas",
  "Themed props and accessories",
  "Outdoor styling — terraces, courtyards and gardens",
  "Fire pits and lounge areas",
  "Lighting coordination with our in-house team",
  "Floral coordination — working with your florist where needed",
  "Supplier coordination where the brief requires it",
];

const spaceTypes = [
  {
    title: "Barns",
    copy: "Warm lighting, texture and softened architecture — barn wedding styling that amplifies the beams and stone, rather than fighting the structure.",
  },
  {
    title: "Marquees",
    copy: "Creating structure, warmth and atmosphere in a blank canvas — marquee styling that makes a temporary space feel intentional from the first guest.",
  },
  {
    title: "Country houses",
    copy: "Enhancing existing character without over-dressing — styling that respects the room and adds finishing touches where they matter.",
  },
  {
    title: "Outdoor spaces",
    copy: (
      <>
        Festoon,{" "}
        <Link href="/services/fire-pit-hire/" className={linkClass}>
          fire pits
        </Link>
        , seating and lighting so guests keep using the terrace, courtyard or garden after sunset.
      </>
    ),
  },
  {
    title: "Party rooms",
    copy: "Dancefloor, mirror balls, lighting and finishing touches that signal celebration — party styling that builds energy without feeling like a prop hire catalogue.",
  },
];

const VENUE_STYLING_FAQ_ITEMS: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "Do you provide full venue styling?",
    answer:
      "Yes — from consultation and table styling through to draping, backdrops, outdoor areas and lighting coordination. Scope depends on the venue and brief; we will be honest about what is needed and what is not.",
  },
  {
    question: "Can you style weddings and private parties?",
    answer: (
      <>
        Yes. Wedding venue styling, milestone birthdays, garden parties and private celebrations
        across Somerset, the South West and UK-wide — see our{" "}
        <Link href="/parties/private-parties/" className={linkClass}>
          private parties
        </Link>{" "}
        page for the wider approach.
      </>
    ),
  },
  {
    question: "Can styling be combined with lighting?",
    answer: (
      <>
        Absolutely — and it should be. We plan styling alongside{" "}
        <Link href="/weddings/wedding-lighting/" className={linkClass}>
          wedding lighting
        </Link>{" "}
        and{" "}
        <Link href="/parties/party-lighting/" className={linkClass}>
          party lighting
        </Link>{" "}
        so texture, colour and light work as one vision, not separate suppliers arriving on the day.
      </>
    ),
  },
  {
    question: "Do you provide florals?",
    answer:
      "We coordinate florals and table styling with your chosen florist rather than supplying flowers directly. If you already have a florist or planner, we align with them so styling, lighting and florals feel like one finished room.",
  },
  {
    question: "Can you work with our florist or planner?",
    answer:
      "Yes. Many weddings and events involve a florist, planner or venue team — we are used to working alongside them so styling, lighting and production stay coordinated.",
  },
  {
    question: "Do you style marquees and barns?",
    answer:
      "Regularly. Marquees, barns, orangeries and country houses are among the spaces we style most — blank canvases and characterful rooms that need warmth, structure and atmosphere before guests arrive.",
  },
  {
    question: "Can you provide themed styling?",
    answer:
      "Yes — alpine lodge, winter wonderland, Gatsby, disco and bespoke concepts where the brief suits. The goal is atmosphere and transformation, not a fancy-dress shop.",
  },
  {
    question: "How early should we enquire?",
    answer: (
      <>
        For peak wedding dates and December events, enquire as soon as your venue and date are
        confirmed — styling, lighting and supplier coordination benefit from lead time.{" "}
        <Link href="/contact-us/" className={linkClass}>
          Discuss your styling
        </Link>{" "}
        and we will reply with honest next steps.
      </>
    ),
  },
];

export default function VenueStylingClient() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGE}
            alt={HERO_ALT}
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
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52 pb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Venue Styling &amp; Transformation
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md mb-8 max-w-3xl mx-auto leading-relaxed">
            Styling, lighting and finishing touches for weddings, private parties and events —
            creating spaces that feel intentional from the moment guests arrive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <Button
              asChild
              size="lg"
              className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Link href="/contact-us/">Discuss Your Styling</Link>
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
            20+ years · Weddings, parties &amp; events · South West &amp; UK-wide
          </p>
        </motion.div>
      </section>

      <div
        style={{
          background:
            "radial-gradient(circle at center, rgb(17 24 39) 0%, rgb(3 7 18) 50%, rgb(2 6 23) 100%)",
        }}
      >
        {/* From Empty Space To Finished Room — gallery early for visual proof */}
        <section className="py-12 md:py-16 px-3 sm:px-4 lg:px-8 bg-gray-950/40 border-b border-champagne-gold/10" id="gallery">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8 md:mb-10 text-center"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 px-4">
                From Empty Space To Finished Room
              </h2>
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4 leading-relaxed">
                Most venues begin as blank spaces — an empty marquee, a barn, a dining room or a
                courtyard. Our role is to make the space feel considered before guests arrive.
              </p>
            </motion.div>
            <div className="w-full md:max-w-4xl md:mx-auto">
              <Gallery photos={stylingPhotos} columns={2} />
            </div>
          </div>
        </section>

        {/* Styling Is More Than Decoration */}
        <section className="py-20 px-3 sm:px-4 lg:px-8">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Styling Is More Than Decoration
              </h2>
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-6">
                Great venue styling is not about filling a room with props. It is about creating
                atmosphere — how a space feels when guests walk in.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Lighting, layout, texture, colour, furniture, florals and finishing touches all
                affect how a room reads. The goal is a space that feels designed, not dressed at the
                last minute.
              </p>
              <p className="text-gray-200 text-lg leading-relaxed">
                That is the difference between event styling that gets noticed for the wrong reasons,
                and venue transformation that makes people stop when they enter the room.
              </p>
            </motion.div>
          </div>
        </section>

        {/* After 20 Years Of Transforming Venues… */}
        <section className="py-20 px-3 sm:px-4 lg:px-8 bg-gray-950/60 border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
                After 20 Years Of Transforming Venues&hellip;
              </h2>
              <ul className="space-y-4">
                {after20YearsPoints.map((point, idx) => (
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

        {/* What We Style */}
        <section className="py-20 px-3 sm:px-4 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What We Style</h2>
              <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Wedding venue styling, party styling and event transformation across Somerset, the
                South West and UK-wide.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whatWeStyle.map(({ Icon, title, copy }) => (
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

        {/* How Styling And Lighting Work Together */}
        <section className="py-20 px-3 sm:px-4 lg:px-8 bg-gray-950/50 border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">
                How Styling And Lighting Work Together
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed mb-6">
                Styling and lighting should not be planned separately. A table centrepiece changes
                under the wrong light. A marquee needs warmth. A barn needs texture and glow. Outdoor
                areas need lighting to feel connected after dark.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                We plan uplighting, fairy lights, festoon, candles, mirror balls, tree lighting,{" "}
                <Link href="/services/fire-pit-hire/" className={linkClass}>
                  fire pits
                </Link>
                , backdrops and table styling as one visual story — so guest experience and visual
                flow stay consistent from arrival through to the dancefloor.
              </p>
              <p className="text-gray-200 text-lg leading-relaxed">
                See how we approach lighting on our{" "}
                <Link href="/weddings/wedding-lighting/" className={linkClass}>
                  wedding lighting
                </Link>{" "}
                and{" "}
                <Link href="/parties/party-lighting/" className={linkClass}>
                  party lighting
                </Link>{" "}
                pages — styling and light planned together, not bolted on at the end.
              </p>
            </motion.div>
          </div>
        </section>

        {/* What We Actually Provide */}
        <section className="py-20 px-3 sm:px-4 lg:px-8 bg-gray-950/60 border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
                What We Actually Provide
              </h2>
              <p className="text-gray-400 text-center mb-8 leading-relaxed">
                Practical event styling services — scoped to your venue, brief and budget.
              </p>
              <ul className="space-y-2 mb-8">
                {whatWeProvide.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-300 text-sm sm:text-base leading-relaxed p-3 rounded-lg bg-gray-900/40 border border-champagne-gold/10"
                  >
                    <span className="text-champagne-gold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
                <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="min-h-[48px] border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
                    >
                      <Calculator className="w-5 h-5 mr-2" />
                      Get a styling quote
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-gray-900 border-champagne-gold/30">
                    <DialogHeader>
                      <DialogTitle className="text-white">Venue styling quote</DialogTitle>
                    </DialogHeader>
                    <ServiceQuoteGenerator
                      category="venue_styling"
                      title="Venue styling quote"
                      compact
                      onClose={() => setQuoteOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  asChild
                  size="lg"
                  className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90"
                >
                  <Link href="/contact-us/">Discuss Your Styling</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Styling For Different Types Of Space */}
        <section className="py-20 px-3 sm:px-4 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
                Styling For Different Types Of Space
              </h2>
              <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto leading-relaxed">
                Barn wedding styling, marquee styling and party rooms — each space needs a different
                approach to warmth, structure and atmosphere.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {spaceTypes.map((space) => (
                  <div
                    key={space.title}
                    className="p-5 rounded-xl bg-gray-900/60 border border-champagne-gold/20"
                  >
                    <h3 className="text-champagne-gold font-semibold mb-2 flex items-center gap-2">
                      {space.title === "Outdoor spaces" ? (
                        <Trees className="w-5 h-5 shrink-0" />
                      ) : space.title === "Party rooms" ? (
                        <Music2 className="w-5 h-5 shrink-0" />
                      ) : space.title === "Marquees" ? (
                        <Home className="w-5 h-5 shrink-0" />
                      ) : space.title === "Barns" ? (
                        <Home className="w-5 h-5 shrink-0" />
                      ) : (
                        <Building2 className="w-5 h-5 shrink-0" />
                      )}
                      {space.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{space.copy}</p>
                  </div>
                ))}
              </div>
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
                {VENUE_STYLING_FAQ_ITEMS.map((item, i) => (
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
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <CardContent className="p-8 sm:p-12 text-center">
                  <Lightbulb className="w-12 h-12 text-champagne-gold mx-auto mb-6" />
                  <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                    Ready to transform your space?
                  </h3>
                  <p className="text-gray-200 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                    Tell us about your wedding, party or event. We will reply with honest ideas about
                    venue styling, lighting and finishing touches — so the room feels extraordinary
                    before the first guest arrives.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <Button
                      asChild
                      size="lg"
                      className="min-h-[48px] bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300"
                    >
                      <Link href="/contact-us/">Discuss Your Styling</Link>
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
                    <Link href="/weddings/wedding-lighting/" className={linkClass}>
                      wedding lighting
                    </Link>
                    ,{" "}
                    <Link href="/parties/party-lighting/" className={linkClass}>
                      party lighting
                    </Link>{" "}
                    and{" "}
                    <Link href="/party-planning-and-organising/" className={linkClass}>
                      private event production
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

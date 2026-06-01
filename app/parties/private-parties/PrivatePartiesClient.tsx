"use client";

import type { ReactNode } from "react";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "@/lib/motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Music,
  Home,
  Warehouse,
  Tent,
  Cake,
  Gem,
  Trees,
  MapPin,
  Check,
} from "lucide-react";
import SiteLightbox from "@/components/SiteLightbox";
import { Card, CardContent } from "@/components/ui/card";
import BeforeAfter from "@/components/BeforeAfter";
import { Button } from "@/components/ui/button";

const linkClass =
  "text-champagne-gold hover:text-gold-light underline underline-offset-2 transition-colors";

// Hero mood images – party moments (first dance feel, marquee, packed dancefloor)
const heroMoodImages = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768736010/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_xwmaca.jpg",
    alt: "Magical fairy light tunnel at The Newt Somerset – first wedding, prestigious venue transformation",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163720/A-Big-Lazer-e1430894875463_xgpiil.jpg",
    alt: "Packed dance floor with dramatic laser lighting – high-energy party celebration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768741340/_F4R3275_tukoww.jpg",
    alt: "Lit marquee at night with Edison festoon and fairy lights – alfresco party atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163745/Pool-Party01_qe5ro0.jpg",
    alt: "Pool party with colourful lighting reflecting on the water – stylish summer celebration",
  },
];

// Gallery photos
const galleryPhotos = [
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg", alt: "Professional lighting design at Kings Weston House for a private party" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162844/Orangery1_dpfega.jpg", alt: "Orangery venue with stunning party lighting and elegant atmosphere" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163745/Pool-Party01_qe5ro0.jpg", alt: "Pool party with colourful lighting reflecting on the water" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163181/IMG_6095_fo6lhk.jpg", alt: "Private party with atmospheric lighting and elegant decor" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768731384/Pennard-House-Lighting-with-Amber-Up-lighting_sljvaa.jpg", alt: "Pennard House with amber uplighting for elegant evening events" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1777634524/wild-west-party-04_g8pvop.jpg", alt: "Outdoor Wild West themed patio with fire pit, hay-bale seating and festoon lights at a private party" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1777634523/wild-west-party-03_rvh4xq.jpg", alt: "Wild West themed photo backdrop with cowboy props and rustic styling at a private party" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1777634523/wild-west-party-01_chyutk.jpg", alt: "Wild West themed banquet hall with long tables, bunting and Edison festoon lighting" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1777634522/wild-west-party-02_aqqa1c.jpg", alt: "Wild West themed venue entrance with saloon doors and festive lighting at night" },
];

const beforeAfterTransforms = [
  {
    title: "Private Party Space",
    before: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1771490793/Log_room_10_tttjs7.jpg",
      alt: "Private party space before transformation",
    },
    after: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768649763/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw.jpg",
      alt: "Private party space after transformation",
    },
  },
  {
    title: "Barn Transformation",
    before: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163654/IMG_1070_pelq7j.jpg",
      alt: "Barn before transformation - empty space ready for styling and lighting design",
    },
    after: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163716/IMG_1098_hqiw3d.jpg",
      alt: "Barn after transformation - elegant outdoor terrace with professional venue styling and festoon lighting",
    },
  },
  {
    title: "Party Room Transformation",
    before: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768753000/IMG_2530_njx41m.jpg",
      alt: "Party room before transformation - empty space ready for styling and lighting design",
    },
    after: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768751155/IMG_3188_zviff5.jpg",
      alt: "Party room after transformation - fun and creative party styling with vibrant decorations and lighting design",
    },
  },
];

const partyTypes: Array<{
  icon: typeof Home;
  title: string;
  copy: ReactNode;
}> = [
  {
    icon: Home,
    title: "House parties",
    copy: (
      <>
        A home should still feel like yours — just elevated. We shape sound, lighting and layout for
        intimate rooms where conversation and dancing coexist. Our{" "}
        <Link href="/artists/djs/" className={linkClass}>
          private party DJs
        </Link>{" "}
        know how to build momentum without overpowering the space.
      </>
    ),
  },
  {
    icon: Warehouse,
    title: "Barn parties",
    copy: (
      <>
        Empty beams become atmosphere. Warm uplighting, festoon and a dancefloor that draws people in
        — house party production at scale, with{" "}
        <Link href="/weddings/wedding-lighting/" className={linkClass}>
          party lighting hire
        </Link>{" "}
        designed for the room, not a catalogue.
      </>
    ),
  },
  {
    icon: Tent,
    title: "Marquee parties",
    copy: (
      <>
        Marquees need structure — a clear flow from arrival to dancefloor, lighting that softens the
        canvas and music that evolves through the night. We handle marquee party production so the tent
        feels like a destination, not a temporary room.
      </>
    ),
  },
  {
    icon: Cake,
    title: "Milestone birthdays",
    copy: (
      <>
        40th, 50th, 60th — the numbers change but the goal is the same: a night that feels personal.
        We help with milestone birthday party ideas, music flow and{" "}
        <Link href="/artists/djs/" className={linkClass}>
          birthday party entertainment
        </Link>{" "}
        that reflects the guest of honour, not a generic playlist.
      </>
    ),
  },
  {
    icon: Gem,
    title: "Black tie celebrations",
    copy: (
      <>
        Elegance without stiffness. Discreet production, flattering light and a soundtrack that moves
        from cocktail hour to a packed floor — the hallmarks of a luxury private party where guests
        notice the feeling, not the equipment.
      </>
    ),
  },
  {
    icon: Trees,
    title: "Garden and pool parties",
    copy: (
      <>
        Outdoor spaces should stay connected to the party.{" "}
        <Link href="/weddings/wedding-lighting/" className={linkClass}>
          Garden party lighting
        </Link>
        , festoon and{" "}
        <Link href="/services/fire-pit-hire/" className={linkClass}>
          fire pits
        </Link>{" "}
        keep terraces and lawns alive long after sunset — so guests drift outside for one more drink,
        not because the music stopped.
      </>
    ),
  },
];

const greatPartyPoints = [
  "The room must feel special from the moment guests arrive",
  "Music should evolve through the night — not jump straight to the obvious hits",
  "Lighting should flatter the space and the guests, not just fill a room with colour",
  "Outdoor spaces should stay connected to the party, not feel like an afterthought",
  "The dancefloor needs momentum, not microphone hype",
  "Production should feel effortless, not overcomplicated",
];

const FAQ_ITEMS: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "Do you provide DJs for private parties?",
    answer: (
      <>
        Yes. We supply career{" "}
        <Link href="/artists/djs/" className={linkClass}>
          private party DJs
        </Link>{" "}
        who read the room without mic-hype or forced classics — from house parties and barns to
        marquees and black-tie celebrations. Music, sound and production are planned together from
        the first conversation.
      </>
    ),
  },
  {
    question: "Can you provide lighting as well as music?",
    answer: (
      <>
        Yes.{" "}
        <Link href="/weddings/wedding-lighting/" className={linkClass}>
          Party lighting hire
        </Link>{" "}
        is a core part of what we do — uplighting, festoon, fairy lights and dancefloor production
        designed to flatter the space and the guests. We often combine lighting with{" "}
        <Link href="/services/venue-styling/" className={linkClass}>
          venue styling
        </Link>{" "}
        so everything feels cohesive.
      </>
    ),
  },
  {
    question: "Do you work in private homes and marquees?",
    answer:
      "Yes. We regularly produce house parties, barn parties, marquee parties and garden celebrations — adapting sound levels, layout and lighting to each setting so production feels effortless, not over-engineered.",
  },
  {
    question: "Can you help with 50th and 60th birthdays?",
    answer:
      "Yes. Milestone birthdays are one of our specialities. We help shape the atmosphere, music flow and production for 50th and 60th birthday party entertainment that feels personal — curated for your guest list, not a generic function.",
  },
  {
    question: "Do you travel outside Somerset and Wiltshire?",
    answer:
      "Yes. Our heartland is the South West and Cotswolds, but we work across London, the Home Counties and UK-wide by arrangement for the right celebration.",
  },
  {
    question: "Can you provide fire pits or outdoor lighting?",
    answer: (
      <>
        Yes. Garden party lighting, festoon and{" "}
        <Link href="/services/fire-pit-hire/" className={linkClass}>
          fire pit hire
        </Link>{" "}
        keep outdoor spaces connected to the party — so guests drift outside for one more drink
        without the energy dropping.
      </>
    ),
  },
  {
    question: "How early should we enquire?",
    answer: (
      <>
        Popular dates — especially milestone birthdays and summer weekends — book early. Enquire as
        soon as you have a date and venue in mind via our{" "}
        <Link href="/contact-us/" className={linkClass}>
          contact page
        </Link>
        ; we will reply with honest ideas and a clear next step.
      </>
    ),
  },
];

export default function PrivatePartiesClient() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const advanceHero = useCallback(() => {
    setHeroIndex((i) => (i + 1) % heroMoodImages.length);
  }, []);
  useEffect(() => {
    const t = setInterval(advanceHero, 5000);
    return () => clearInterval(t);
  }, [advanceHero]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white max-w-full overflow-x-hidden">
      {/* Hero */}
      <section className="relative h-[75vh] min-h-[520px] w-full overflow-hidden max-w-full">
        <div className="absolute inset-0">
          {heroMoodImages.map((image, i) => (
            <div
              key={image.src}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === heroIndex ? "opacity-100 z-0" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={i !== heroIndex}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
                quality={85}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25 pointer-events-none z-[1]" />
        <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-10 lg:p-12 max-w-4xl">
          <div className="inline-block mb-4 px-4 py-1.5 bg-champagne-gold/10 rounded-full border border-champagne-gold/30 backdrop-blur-sm">
            <span className="text-xs sm:text-sm font-semibold text-champagne-gold tracking-wider uppercase">
              Trusted at Babington House since 2003
            </span>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-champagne-gold/90 font-medium mb-3 drop-shadow-md italic">
            Events That Feel Like a Soho House Night.
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg leading-tight">
            Private Parties With Atmosphere
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mb-6 drop-shadow-md">
            DJs, lighting and production for milestone birthdays, house parties, marquee parties and
            private celebrations — one experienced team from first idea to last dance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center mb-3">
            <Button
              asChild
              size="lg"
              className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Link href="/contact-us/">Check Availability</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-[48px] border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <Link href="/artists/djs/">Meet Our DJs</Link>
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 drop-shadow-md">
            20+ years · South West, London &amp; UK-wide
          </p>
        </div>

        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex gap-2 z-20">
          {heroMoodImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === heroIndex ? "bg-champagne-gold w-6" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setHeroIndex((i) => (i - 1 + heroMoodImages.length) % heroMoodImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors z-20"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setHeroIndex((i) => (i + 1) % heroMoodImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors z-20"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* Before and After */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-900 max-w-full overflow-x-hidden">
        <div className="w-full max-w-[1700px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 md:mb-14 text-center"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Featured</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold mb-3 text-white">
              Before and After
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              Drag the slider or click anywhere to compare — the difference lighting, music and
              production make to a private space.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-16">
            {beforeAfterTransforms.map((transform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gray-800/50 backdrop-blur-sm border-2 border-champagne-gold/30 shadow-xl overflow-hidden hover:border-champagne-gold/60 transition-all duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-champagne-gold mb-4">{transform.title}</h3>
                    <BeforeAfter
                      before={transform.before}
                      after={transform.after}
                      aspectRatio="16/9"
                      fullWidth
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* After 20 Years Of Parties */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50 max-w-full overflow-x-hidden">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              After 20 Years Of Parties&hellip;
            </h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                The best parties are not always the biggest. They are the ones where guests do not
                want to leave.
              </p>
              <p>
                Lighting, music, layout and timing all work together — so people stay for one more
                drink, one more dance and one more conversation. That is what we have learned from
                two decades of private celebrations, from intimate house parties to marquee weekends
                and milestone birthdays.
              </p>
              <p>
                We are not party planners in the traditional sense. We are a production team —{" "}
                <Link href="/artists/djs/" className={linkClass}>
                  DJs
                </Link>
                , lighting designers and technicians who shape atmosphere from the moment guests
                arrive until the last track plays.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How We Create Private Parties */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-950 max-w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How We Create Private Parties</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Every setting asks something different. We focus on atmosphere and guest experience —
              not just equipment lists.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partyTypes.map((type, i) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="bg-white/5 backdrop-blur border-champagne-gold/30 hover:border-champagne-gold/50 transition-all h-full">
                  <CardContent className="p-8">
                    <type.icon className="w-10 h-10 text-champagne-gold mb-5" />
                    <h3 className="text-xl font-bold mb-4">{type.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{type.copy}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes A Great Private Party? */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50 max-w-full overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Makes A Great Private Party?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The details that separate a good evening from one people talk about for years.
            </p>
          </motion.div>

          <ul className="space-y-4">
            {greatPartyPoints.map((point, i) => (
              <motion.li
                key={point}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-start gap-4 p-4 rounded-lg bg-gray-900/60 border border-champagne-gold/20"
              >
                <Check className="w-5 h-5 text-champagne-gold flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-lg">{point}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-950 max-w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Atmospheric Venue Transformations</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            House parties, barns, marquees and gardens — production and{" "}
            <Link href="/services/venue-styling/" className={linkClass}>
              venue styling
            </Link>{" "}
            that transforms how a space feels.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryPhotos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(i)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Babington credibility */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50 max-w-full overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/40">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-6">
                  <Sparkles className="w-10 h-10 text-champagne-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                      What Working At Babington House Teaches You
                    </h3>
                    <p className="text-gray-200 text-lg leading-relaxed mb-6">
                      For more than twenty years we have helped create the atmosphere at{" "}
                      <Link
                        href="https://www.babingtonhouse.co.uk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        Babington House
                      </Link>
                      , one of the UK&apos;s most celebrated private members&apos; clubs. Working at
                      that level teaches you that details matter — not bigger speakers, but better
                      experiences.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      The same standards apply whether we are in a Somerset barn, a London townhouse
                      or a marquee in the Cotswolds. Music that evolves. Lighting that flatters. A
                      dancefloor with momentum. That same private-members-club sensibility —
                      relaxed, detailed and atmospheric — is what we bring to every celebration.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Where We Work */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-950 max-w-full overflow-x-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-champagne-gold/70" />
            <h2 className="text-2xl md:text-3xl font-bold">Where We Work</h2>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Our heartland is the South West and Cotswolds — Somerset, Wiltshire, Gloucestershire,
            Dorset and Devon. We also work regularly in Bath, Bristol, London and the Home Counties,
            and travel UK-wide by arrangement for the right celebration.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
            {[
              { region: "South West & Cotswolds", detail: "Somerset, Wiltshire, Gloucestershire, Dorset & Devon" },
              { region: "London & Home Counties", detail: "City celebrations, country estates & marquee weekends" },
              { region: "UK-wide", detail: "By arrangement — tell us where and we will be honest about logistics" },
            ].map((area) => (
              <Card key={area.region} className="bg-gray-900/80 border-champagne-gold/20">
                <CardContent className="p-5">
                  <h3 className="text-champagne-gold font-semibold mb-2">{area.region}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{area.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50 max-w-full overflow-x-hidden">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-6">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-gray-900/60 border-champagne-gold/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">{item.question}</h3>
                    <div className="text-gray-300 leading-relaxed">{item.answer}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-950 border-t border-champagne-gold/20 max-w-full overflow-x-hidden">
        <div className="max-w-3xl mx-auto text-center">
          <Music className="w-10 h-10 text-champagne-gold mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Plan Your Party?</h2>
          <p className="text-gray-200 text-lg mb-8 leading-relaxed">
            Tell us what you are celebrating, where it is happening and how you want the night to
            feel — we will reply with honest ideas and a clear next step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Link href="/contact-us/">Get in Touch</Link>
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
        </div>
      </section>

      <SiteLightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={galleryPhotos}
      />
    </div>
  );
}

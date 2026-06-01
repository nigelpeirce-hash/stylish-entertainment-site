"use client";

import type { ReactNode } from "react";
import { motion } from "@/lib/motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CLOUDINARY_OPT = "f_auto,q_85,dpr_auto,w_1200";
const cdn = (path: string) =>
  `https://res.cloudinary.com/drtwveoqo/image/upload/${CLOUDINARY_OPT}/${path}`;

const linkClass =
  "text-champagne-gold hover:text-gold-light underline underline-offset-2 transition-colors";

const HERO_IMAGE_URL = cdn(
  "v1768749164/MartinBeddallPhotography02-e1530632660291_pabjzl.jpg"
);

const FLOW_OF_DAY: Array<{
  id: string;
  time: string;
  title: string;
  paragraphs: ReactNode[];
  image: string;
  imageAlt: string;
  cta?: { href: string; label: string };
}> = [
  {
    id: "daytime",
    time: "Morning & ceremony",
    title: "Daytime atmosphere",
    paragraphs: [
      <>
        The tone you set before the evening matters. Acoustic musicians, discreet playback and
        calm production support help guests arrive relaxed — especially at venues like{" "}
        <Link href="/venues/babington-house/" className={linkClass}>
          Babington House
        </Link>{" "}
        where the day unfolds across several spaces.
      </>,
      <>
        We discuss timelines with your planner early so sound checks, changeovers and handovers to
        the evening team never feel rushed.
      </>,
    ],
    image: cdn("v1768163781/Emma-Conrad-2-9-23-682_utvftj.jpg"),
    imageAlt: "Wedding ceremony and daytime atmosphere with elegant production",
  },
  {
    id: "drinks",
    time: "Drinks reception",
    title: "Drinks reception music",
    paragraphs: [
      <>
        This is where personality first shows — background that feels curated, not generic. A
        roaming band among guests, a saxophonist, or a DJ setting the mood without shouting over
        conversation.
      </>,
      <>
        We match energy to your guest mix and venue layout — a country-house lawn, a barn courtyard
        or a terrace drinks reception in London — so music fits the space, not a generic playlist.
      </>,
    ],
    image: cdn("v1768163818/IMG_3168-e1487170912714_nvwc3p.jpg"),
    imageAlt:
      "Bride and groom at an outdoor drinks reception with lantern and fairy-light canopy",
    cta: { href: "/artists/musicians/", label: "Explore live musicians" },
  },
  {
    id: "breakfast",
    time: "Wedding breakfast",
    title: "Wedding breakfast atmosphere",
    paragraphs: [
      <>
        Speeches need clarity; conversation needs warmth. We balance microphone support with
        understated background music so the room feels intimate, not empty.
      </>,
      <>
        Where you are also booking{" "}
        <Link href="/weddings/wedding-lighting/" className={linkClass}>
          wedding lighting
        </Link>{" "}
        or{" "}
        <Link href="/services/venue-styling/" className={linkClass}>
          venue styling
        </Link>
        , we align timelines so uplighting and tablescapes come alive as the sun drops.
      </>,
    ],
    image: cdn(
      "v1768163434/Nailsea-Tythe-Barn-Bristol-with-a-fairy-light-and-shade-canopy_ljrtgy.jpg"
    ),
    imageAlt:
      "Wedding breakfast in a barn with fairy-light canopy, paper lanterns and long banquet tables",
  },
  {
    id: "evening",
    time: "Evening party",
    title: "Evening bands, DJs & the dancefloor",
    paragraphs: [
      <>
        The dancefloor — or the party room, if your venue has one — is where
        memories stick. Evening entertainment is not only a DJ: we supply{" "}
        <strong className="text-white font-semibold">bands of all shapes and sizes</strong> —
        acoustic duos, soul and funk bands, roaming line-ups and full function bands — as well as
        career DJs who read the room without mic-hype or forced classics.
      </>,
      <>
        We book and brief everything in-house, so handovers from a guest band to our function band,
        or from live music into the DJ set, stay seamless.{" "}
        <Link href="/artists/djs/dj-nige/" className={linkClass}>
          DJ Nige
        </Link>{" "}
        has held residencies at Babington House for more than twenty years; our{" "}
        <Link href="/artists/musicians/" className={linkClass}>
          musicians and bands
        </Link>{" "}
        and{" "}
        <Link href="/artists/djs/" className={linkClass}>
          DJ roster
        </Link>{" "}
        bring the same standards to barns, marquees and estates across the South West.
      </>,
    ],
    image: cdn("v1768731827/Camilla-Richard-0063_ngmblz.jpg"),
    imageAlt:
      "Bride and groom first dance with golden confetti and guests cheering — evening wedding party",
    cta: { href: "/artists/musicians/", label: "Bands & evening entertainment" },
  },
  {
    id: "live",
    time: "Live & hybrid",
    title: "DJ, sax & hybrid sets",
    paragraphs: [
      <>
        Many couples blend formats — sax and bongos alongside the decks, a live trio before the
        band or DJ, or a function band for the first part of the evening then a DJ into the night.
        We shape the timetable so each act has a clear role.
      </>,
      <>
        The same production team runs your dancefloor and live sound, avoiding the awkward gap when
        one act finishes and the energy drops before the next begins.
      </>,
    ],
    image: cdn("v1768163136/Cuban-Brothers-at-Private-Party-e1430906419315_xfry7j.jpg"),
    imageAlt: "Live hybrid entertainment — high-energy performers with professional production lighting",
    cta: { href: "/artists/musicians/", label: "Live & band options" },
  },
  {
    id: "lighting-production",
    time: "Lighting & production",
    title: "Lighting and production support",
    paragraphs: [
      <>
        Entertainment and lighting planned together feel cohesive; booked separately they often
        clash. Our{" "}
        <Link href="/weddings/wedding-lighting/" className={linkClass}>
          wedding lighting design
        </Link>{" "}
        team works from the same brief as your DJ or evening band — terraces, dancefloor and party
        spaces
        considered from the first conversation.
      </>,
      <>
        Fire pits, styling and technical production sit alongside music when you need one team to
        own the whole evening. Browse{" "}
        <Link href="/venues/" className={linkClass}>
          venues we know
        </Link>{" "}
        to see how we adapt to each room.
      </>,
    ],
    image: cdn("v1768163095/matt_emma_4191-scaled_jllnsf.jpg"),
    imageAlt:
      "Bride and groom dancing on the bar with guests cheering — wedding lighting and production",
    cta: { href: "/weddings/wedding-lighting/", label: "Wedding lighting design" },
  },
];

const VIBE_TILES = [
  {
    id: "dj",
    headline: "The Anti-Cheesy DJ",
    vibe: "No cringey banter, no \"Macarena,\" just incredible mixing and a packed floor. Career DJs who have held residencies at places like Babington House for 20+ years.",
    buttonText: "Meet the DJs",
    href: "/artists/djs/",
    image: cdn("v1768163328/Nigel-DJ-Babs-House-0021-1_xmxz8v.jpg"),
    imageAlt: "DJ at Babington House with a packed, high-energy wedding dancefloor",
  },
  {
    id: "musicians",
    headline: "Live Musicians & Sax",
    vibe: "Elevate the energy. Whether it's a soulful acoustic duo for your ceremony or a high-octane sax and bongos player to jam alongside your DJ.",
    buttonText: "Explore Live Music",
    href: "/artists/musicians/",
    image: cdn("v1768162646/Add-a-Sax-player_ewzicg.jpg"),
    imageAlt: "Live saxophone player performing at a wedding celebration",
  },
  {
    id: "lighting",
    headline: "Bespoke Lighting Design",
    vibe: "Lighting is the difference between a room and a feeling. We design uplighting, festoon and fairy-light schemes that match how your day actually flows.",
    buttonText: "See wedding lighting",
    href: "/weddings/wedding-lighting/",
    image: cdn(
      "v1768163434/Nailsea-Tythe-Barn-Bristol-with-a-fairy-light-and-shade-canopy_ljrtgy.jpg"
    ),
    imageAlt: "Fairy-light and lantern canopy over a wedding breakfast barn",
  },
  {
    id: "extras",
    headline: "Fire-Pits & Styling",
    vibe: "For the moments away from the dancefloor — terraces, lounges and fire pits. Professional-grade fire-pit hire and venue styling that ties the whole aesthetic together.",
    buttonText: "Venue styling",
    href: "/services/venue-styling/",
    image: cdn("v1768163813/Firepit-Hire-for-weddings-and-parties_xvnj07.jpg"),
    imageAlt: "Fire pit hire for weddings — guests gathered outdoors at a manor house",
  },
];

const ENTERTAINMENT_IDEAS = [
  {
    title: "Roaming band at drinks reception",
    detail:
      "A roaming band — brass, strings or acoustic line-up moving among guests — is the current fashion at drinks receptions. It sets the mood without overpowering conversation, and pairs naturally with your evening band or DJ.",
    href: "/artists/musicians/",
    linkLabel: "Roaming bands & live music",
  },
  {
    title: "Singing waiter surprise",
    detail:
      "A well-timed surprise during wedding breakfast when guests least expect it — we coordinate timing and sound so it lands perfectly, not awkwardly.",
  },
  {
    title: "DJ & sax",
    detail:
      "The sax player jams with the DJ as energy builds into the evening. We book and brief both sides in-house so the handover is seamless.",
    href: "/artists/djs/",
    linkLabel: "Our DJs",
  },
  {
    title: "Fire pits after dinner",
    detail:
      "When guests drift outside after the meal, fire pits keep the atmosphere alive. We often pair them with festoon lighting and background music.",
    href: "/services/fire-pit-hire/",
    linkLabel: "Fire pit hire",
  },
  {
    title: "Acoustic ceremony music",
    detail:
      "Guitar, strings or piano for arrival and procession — understated, emotional, and timed to your aisle walk without rushing the moment.",
    href: "/artists/musicians/",
    linkLabel: "Ceremony musicians",
  },
  {
    title: "Headphone party after the main set",
    detail:
      "For venues with curfews or neighbours nearby — wireless headphones let the celebration continue without volume battles. We advise on kit and timing if you want this as a finale.",
  },
  {
    title: "Live percussion alongside the DJ",
    detail:
      "Bongos or percussion add live energy on the floor without replacing the DJ. Popular at barn weddings where guests want something more than a playlist.",
    href: "/artists/musicians/",
    linkLabel: "DJ & live options",
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
              src={HERO_IMAGE_URL}
              alt="Packed wedding dancefloor in a tipi with fairy lights, moving heads and guests celebrating — Martin Beddall Photography"
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
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md mb-8 max-w-3xl">
            DJs, bands, live music, lighting and production from one experienced team — shaping the
            atmosphere of every moment, from ceremony to a packed dancefloor.
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

      {/* Proof band */}
      <section className="py-12 px-4 md:px-8 bg-gray-900/50 border-y border-champagne-gold/20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-champagne-gold tracking-widest uppercase mb-4">
            20+ years · One experienced team
          </p>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
            Trusted at{" "}
            <Link href="/venues/babington-house/" className={linkClass}>
              Babington House
            </Link>{" "}
            since 2003 and regularly chosen by venues including{" "}
            <a
              href="https://www.thenewtinsomerset.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              The Newt in Somerset
            </a>{" "}
            and Euridge Manor, with DJs,{" "}
            <Link href="/weddings/wedding-lighting/" className={linkClass}>
              lighting
            </Link>{" "}
            and production planned together from one brief.
          </p>
        </div>
      </section>

      {/* Flow of the day */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Flow of <span className="text-champagne-gold">the Day</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            How we think about music and production from morning through to the last dance — not
            a catalogue of hires, but a plan that fits your venue.
          </p>
        </div>

        <div className="space-y-20 md:space-y-28 max-w-6xl mx-auto">
          {FLOW_OF_DAY.map((step, i) => (
            <motion.div
              key={step.id}
              id={step.id}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-champagne-gold/20 shadow-[0_0_24px_rgba(212,175,55,0.08)]">
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <p className="text-xs font-semibold text-champagne-gold tracking-widest uppercase mb-3">
                  {step.time}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-5">{step.title}</h3>
                <div className="space-y-4 text-gray-300 text-lg leading-relaxed mb-6">
                  {step.paragraphs.map((paragraph, pi) => (
                    <p key={pi}>{paragraph}</p>
                  ))}
                </div>
                {step.cta && (
                  <Link
                    href={step.cta.href}
                    className="inline-flex items-center gap-2 text-champagne-gold hover:text-gold-light font-semibold transition-colors"
                  >
                    {step.cta.label}
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Wedding entertainment ideas — list content for search intent */}
      <section id="ideas" className="py-16 md:py-24 px-4 md:px-8 bg-gray-900 border-y border-champagne-gold/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Wedding Entertainment Ideas We See Working Again and Again
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Inspiration from real weddings — not every idea suits every venue, but these are the
              combinations couples ask us about most.
            </p>
          </motion.div>
          <ul className="space-y-4">
            {ENTERTAINMENT_IDEAS.map((idea, index) => (
              <motion.li
                key={idea.title}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
              >
                <Card className="bg-gray-800/50 border-champagne-gold/20">
                  <CardContent className="p-5 sm:p-6 flex gap-4">
                    <Check
                      className="w-6 h-6 text-champagne-gold shrink-0 mt-0.5"
                      aria-hidden
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{idea.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{idea.detail}</p>
                      {idea.href && (
                        <Link
                          href={idea.href}
                          className={`inline-flex items-center gap-1 mt-3 text-sm font-semibold ${linkClass}`}
                        >
                          {idea.linkLabel}
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Nigel voice — after 20 years */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-950">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto rounded-2xl border-2 border-champagne-gold/30 bg-gray-800/50 backdrop-blur-sm p-8 md:p-12 shadow-[0_0_32px_rgba(212,175,55,0.08)]"
        >
          <p className="text-xs font-semibold text-champagne-gold tracking-widest uppercase mb-4">
            From Nigel · DJ Nige
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            After 20 Years Of Weddings&hellip;
          </h2>
          <div className="space-y-6 text-lg md:text-xl text-gray-200 leading-relaxed">
            <p>
              The biggest mistake couples make is assuming entertainment starts after dinner.
            </p>
            <p className="text-gray-300">
              In reality, atmosphere begins the moment guests arrive. The music at drinks, the
              calm during speeches, the first notes on the dancefloor — each chapter sets up the
              next. Get the early moments wrong and no DJ can rescue the evening later.
            </p>
            <p className="text-gray-300">
              That is why we plan the whole arc with you, not just the DJ or band slot after dinner.
              If you want the
              person behind the decks,{" "}
              <Link href="/artists/djs/dj-nige/" className={linkClass}>
                read more about DJ Nige
              </Link>{" "}
              — or tell us your venue and we will suggest what actually works there.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Philosophy — not about equipment */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Why Great Wedding Entertainment Isn&apos;t About{" "}
            <span className="text-champagne-gold">Equipment</span>
          </h2>
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>
              Most DJ companies sell speakers, lights and decks. We sell{" "}
              <strong className="text-white font-semibold">timing</strong>,{" "}
              <strong className="text-white font-semibold">flow</strong> and{" "}
              <strong className="text-white font-semibold">atmosphere</strong> — the things guests
              remember when they cannot name a single track that was played.
            </p>
            <p>
              The right song at the wrong moment falls flat. A modest setup with someone who reads
              the room will always outperform a warehouse of kit operated on autopilot. That is the
              difference twenty years at{" "}
              <Link href="/venues/babington-house/" className={linkClass}>
                Babington House
              </Link>{" "}
              and hundreds of barn weddings teaches you.
            </p>
            <p>
              When we also handle{" "}
              <Link href="/weddings/wedding-lighting/" className={linkClass}>
                lighting
              </Link>{" "}
              and{" "}
              <Link href="/services/venue-styling/" className={linkClass}>
                styling
              </Link>
              , it is because those decisions affect the same emotional arc — not because we want
              to sell more boxes.
            </p>
          </div>
        </div>
      </section>

      {/* How much entertainment do you need? */}
      <section id="how-much" className="py-16 md:py-20 px-4 md:px-8 bg-gray-950 border-y border-champagne-gold/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            How Much Wedding Entertainment Do We Need?
          </h2>
          <div className="space-y-5 text-lg text-gray-300 leading-relaxed">
            <p className="text-gray-200 text-xl text-center max-w-2xl mx-auto mb-8">
              Not every wedding needs a DJ, sax player, acoustic duo, fire pits and confetti
              cannons.
            </p>
            <p>
              The best weddings usually focus on a few things done exceptionally well. A brilliant
              evening band or DJ and a full dancefloor matter more than spreading budget across
              seven half-measures. A roaming band or drinks-reception sax can be transformative;
              either can be unnecessary if your guest list is small and conversation-led.
            </p>
            <p>
              We will tell you honestly if you are over-planning — or if you are under-investing in
              the moments guests actually talk about afterwards. Sometimes that means a brilliant{" "}
              <Link href="/artists/musicians/" className={linkClass}>
                function band
              </Link>
              , sometimes{" "}
              <Link href="/artists/djs/" className={linkClass}>
                one great DJ
              </Link>
              , often a combination — plus{" "}
              <Link href="/weddings/wedding-lighting/" className={linkClass}>
                lighting
              </Link>{" "}
              designed together from the start.
            </p>
            <p>
              Share your date, guest numbers and how you imagine the day feeling. We reply within 24
              hours with a focused suggestion — not a catalogue thrown at you.
            </p>
          </div>
        </div>
      </section>

      {/* How much does wedding entertainment cost? */}
      <section id="cost" className="py-16 md:py-20 px-4 md:px-8 bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            How Much Does <span className="text-champagne-gold">Wedding Entertainment</span> Cost?
          </h2>
          <div className="space-y-5 text-lg text-gray-300 leading-relaxed">
            <p>
              Wedding entertainment budgets vary enormously. Some couples need only an experienced
              evening DJ; others want a function band, ceremony musicians, drinks reception
              entertainment, lighting design and production support.
            </p>
            <p>
              The right investment depends on guest numbers, venue layout and the style of
              celebration you want to create — from an intimate barn with a packed dancefloor and one
              great DJ, to a full wedding party with a live band, roaming musicians and{" "}
              <Link href="/weddings/wedding-lighting/" className={linkClass}>
                lighting design
              </Link>
              .
            </p>
            <p>
              We do not publish fixed price lists because every timetable and venue tells a
              different story. Share your date and vision — we reply with a clear proposal that
              explains where your budget delivers the most impact, without upselling what you do
              not need.
            </p>
          </div>
          <p className="text-center mt-8">
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90">
              <Link href="/contact-us/">Discuss your wedding entertainment budget</Link>
            </Button>
          </p>
        </div>
      </section>

      {/* How we plan the flow */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-950 border-y border-champagne-gold/20">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto rounded-2xl border border-champagne-gold/20 bg-gray-800/40 backdrop-blur-sm p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            How We Plan <span className="text-champagne-gold">the Flow</span>
          </h2>
          <div className="space-y-6 text-lg text-gray-200 leading-relaxed">
            <p>
              We start with your timetable, guest profile and the spaces you are actually using —
              not a generic wedding package. That might mean a quiet acoustic moment at ceremony,
              a sax player at drinks, then{" "}
              <Link href="/artists/djs/dj-nige/" className={linkClass}>
                DJ Nige
              </Link>{" "}
              or a DJ from our roster once your band has finished — whatever order suits your
              celebration.
            </p>
            <p className="text-gray-300">
              If lighting matters to you, we loop in our wedding lighting designers early so
              terraces and dining rooms feel intentional before guests reach the dancefloor. The
              goal is one team, one brief, no surprises on the night.
            </p>
            <p className="text-gray-300">
              Tell us your date and venue — we reply within 24 hours with ideas shaped around how
              you want the day to feel, not just what equipment you might need.
            </p>
          </div>
          <p className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link href="/weddings/wedding-lighting/" className={linkClass}>
              Wedding lighting
            </Link>
            <Link href="/venues/babington-house/" className={linkClass}>
              Babington House
            </Link>
            <Link href="/venues/" className={linkClass}>
              Venues we know
            </Link>
            <Link href="/contact-us/" className={linkClass}>
              Get in touch
            </Link>
          </p>
        </motion.div>
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
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Choose your vibe */}
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
              Deep-dive into DJs, live music,{" "}
              <Link href="/weddings/wedding-lighting/" className={linkClass}>
                wedding lighting
              </Link>{" "}
              and{" "}
              <Link href="/services/venue-styling/" className={linkClass}>
                venue styling
              </Link>{" "}
              — everything for a STYLISH celebration.
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
                      <p className="text-gray-200 text-sm md:text-base mb-4 line-clamp-3 drop-shadow-md">
                        {tile.vibe}
                      </p>
                      <span className="inline-flex items-center gap-2 text-champagne-gold font-semibold group-hover:gap-3 transition-all">
                        {tile.buttonText}
                        <ArrowRight className="w-4 h-4" aria-hidden />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why one team — conversion */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-900 border-t border-champagne-gold/20">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Why Couples Choose <span className="text-champagne-gold">One Team</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
            Music, lighting and production affect the same atmosphere. When different suppliers are
            working from different briefs, details get missed. By planning DJs, musicians, lighting
            and production together, we make sure every part of the day feels connected.
          </p>
        </motion.div>
      </section>

      {/* Enquiry CTA */}
      <section className="py-20 px-4 md:px-8 bg-gray-950">
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
                  Tell us your date, venue and vision — we reply within 24 hours with a tailored
                  proposal. Pair with our{" "}
                  <Link href="/weddings/wedding-lighting/" className={linkClass}>
                    wedding lighting design
                  </Link>{" "}
                  for one cohesive team from ceremony to last dance.
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
                    <a href="tel:+447970793177" aria-label="Call 07970 793177">
                      <Phone className="w-5 h-5 inline mr-2" aria-hidden />
                      07970 793177
                    </a>
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

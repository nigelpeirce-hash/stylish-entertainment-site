"use client";

import type { ReactNode } from "react";
import { motion } from "@/lib/motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, AlertCircle, Home, Lightbulb, Music2, Phone, Sparkles, Trees } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Gallery, { Photo } from "@/components/Gallery";
import BeforeAfter from "@/components/BeforeAfter";

const CLOUDINARY_OPT = "f_auto,q_85,dpr_auto,w_1200";
const cdn = (path: string) =>
  `https://res.cloudinary.com/drtwveoqo/image/upload/${CLOUDINARY_OPT}/${path}`;

const HERO_IMAGE_URL = cdn("v1768162258/Fairy-light-Tunnel_sc40ed.jpg");

const beforeAfterTransform = {
  before: {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto,w_1200/v1768163654/IMG_1070_pelq7j.jpg",
    alt: "Outdoor terrace before wedding lighting — daylight, no festoon or uplighting",
  },
  after: {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto,w_1200/v1768163716/IMG_1098_hqiw3d.jpg",
    alt: "Same terrace after wedding lighting — festoon strings, uplighting and evening atmosphere",
  },
};

const linkClass =
  "text-champagne-gold hover:text-gold-light underline underline-offset-2 transition-colors";

const LIGHTING_SECTIONS: Array<{
  id: string;
  icon: typeof Lightbulb;
  label: string;
  whyTitle: string;
  paragraphs: ReactNode[];
  image: string;
  imageAlt: string;
  venueLink: { href: string; label: string };
}> = [
  {
    id: "uplighting",
    icon: Lightbulb,
    label: "LED uplighting & colour washes",
    whyTitle: "Why uplighting works",
    paragraphs: [
      <>
        Uplighting draws attention to the architecture couples have fallen in love with when
        choosing their venue — stone walls, timber beams and window reveals that disappear in flat
        overhead light.
      </>,
      <>
        Warm amber or soft white washes flatter florals and tablescapes without competing with them,
        and they photograph beautifully when your photographer arrives for the evening.
      </>,
    ],
    image: cdn("v1768731384/Pennard-House-Lighting-with-Amber-Up-lighting_sljvaa.jpg"),
    imageAlt:
      "Pennard House wedding with amber LED uplighting highlighting architectural features",
    venueLink: { href: "/venues/pennard-house/", label: "See Pennard House" },
  },
  {
    id: "fairy-festoon",
    icon: Sparkles,
    label: "Fairy lights, festoon & architectural lighting",
    whyTitle: "Why fairy lights and festoon matter",
    paragraphs: [
      <>
        Couples choose barns and country estates for their character — a simple canopy of warm fairy
        lights above the dining table signals intimacy before anyone sits down.
      </>,
      <>
        Festoon and tree lighting scale that feeling across a whole room or terrace. It is the
        difference between a space that feels hired, and one that feels deliberately romantic — the
        same instinct behind our work at{" "}
        <Link href="/venues/babington-house/" className={linkClass}>
          Babington House
        </Link>{" "}
        and fairy-light tunnels at The Newt.
      </>,
    ],
    image: cdn("v1768163840/Fairy-Light-Canopy-with-Shades-e1510835685909_wgdrd3.jpg"),
    imageAlt: "Fairy light canopy with shades at a wedding reception",
    venueLink: { href: "/venues/babington-house/", label: "Babington House lighting" },
  },
  {
    id: "dancefloor",
    icon: Music2,
    label: "Dancefloor & evening atmosphere",
    whyTitle: "Why dancefloor lighting is different",
    paragraphs: [
      <>
        Most guests only notice lighting when it is wrong — too dark to see faces, too harsh to
        relax, or so colourful that skin tones look unnatural in every photo.
      </>,
      <>
        We design the evening floor so energy builds naturally from first dance to last track,
        coordinated with your DJ from day one. That is why we plan dancefloor looks alongside{" "}
        <Link href="/artists/djs/dj-nige/" className={linkClass}>
          DJ Nige
        </Link>{" "}
        and the wider{" "}
        <Link href="/weddings/wedding-entertainment/" className={linkClass}>
          wedding entertainment
        </Link>{" "}
        team rather than bolting lights on at the end.
      </>,
    ],
    image: cdn("v1768163506/DJ-Nige-white-dance-floor-lighting_kigdwb.jpg"),
    imageAlt: "Wedding dancefloor with professional white LED lighting and mirror ball atmosphere",
    venueLink: { href: "/artists/djs/dj-nige/", label: "DJ Nige at Babington & beyond" },
  },
  {
    id: "barn-marquee",
    icon: Home,
    label: "Barns, marquees & covered spaces",
    whyTitle: "Why barn and marquee lighting needs planning",
    paragraphs: [
      <>
        Barn beams and marquee canvas limit where kit can safely hang and how much weight a roof
        can take. Couples book these venues for the feeling — low ceilings, exposed structure,
        candlelight scale — and lighting should amplify that, not fight it.
      </>,
      <>
        We survey early, rig in daylight where venues allow, and design schemes that still feel
        magical after sunset — whether that is{" "}
        <Link href="/venues/mells-barn/" className={linkClass}>
          Mells Barn
        </Link>
        , a stretch marquee or a family field with a temporary structure.
      </>,
    ],
    image: cdn("v1768163500/Mells-Barn-Fairy-lights-in-ceiling_vmzs3p.jpg"),
    imageAlt: "Mells Barn wedding with fairy lights installed in the barn ceiling",
    venueLink: { href: "/venues/mells-barn/", label: "Mells Barn weddings" },
  },
  {
    id: "outdoor",
    icon: Trees,
    label: "Outdoor & alfresco",
    whyTitle: "Why outdoor lighting is often overlooked",
    paragraphs: [
      <>
        Guests spend as much time on the terrace, in the courtyard and walking between spaces as
        they do in the main room — yet many weddings only light the party room.
      </>,
      <>
        Outdoor festoon, tree lighting and exterior washes keep the atmosphere consistent from
        golden hour through to the fire pit. When you want florals, furniture and lighting to feel
        like one vision, we align with your{" "}
        <Link href="/services/venue-styling/" className={linkClass}>
          venue styling
        </Link>{" "}
        team so nothing feels like an afterthought.
      </>,
    ],
    image: cdn("v1768163641/Pennard-House-Festoon-Pizzarova_rpdwep.jpg"),
    imageAlt:
      "Pennard House festoon lighting over alfresco wedding dining in an outdoor courtyard",
    venueLink: { href: "/venues/pennard-house/", label: "Pennard House, Somerset" },
  },
];

const LIGHTING_MISTAKES = [
  {
    title: "Lighting only the party room",
    detail:
      "The party room fills at 9pm, but your guests form memories at dinner, on the terrace and by the bar. If those spaces stay flat, the evening never feels fully designed.",
  },
  {
    title: "Ignoring outdoor spaces",
    detail:
      "Ceremonies, drinks receptions and summer dinners often flow outside. Unlit pathways and dark courtyards push everyone indoors earlier than they would choose.",
  },
  {
    title: "Too much coloured lighting",
    detail:
      "Strong saturated washes date quickly in photos and make skin tones hard to flatter. Warm white and amber usually outlast trend-led colour schemes.",
  },
  {
    title: "Not thinking about photography",
    detail:
      "Your photographer relies on gentle, directional light. Harsh moving heads or uncorrected green LED can ruin otherwise beautiful documentary moments.",
  },
  {
    title: "Forgetting where guests go after dinner",
    detail:
      "Lounges, fire pits, dessert stations and quiet corners matter after the meal. Light them with the same care as the main room and people stay longer.",
  },
];

const VENUE_EXAMPLES = [
  {
    name: "Babington House",
    href: "/venues/babington-house/",
    blurb: "Trusted supplier since 2003",
  },
  {
    name: "Kin House",
    href: "/kin-house-wiltshire/",
    blurb: "Bar, hall & terrace lighting",
  },
  {
    name: "Pennard House",
    href: "/venues/pennard-house/",
    blurb: "Amber uplighting & festoon",
  },
  {
    name: "Mells Barn",
    href: "/venues/mells-barn/",
    blurb: "Barn ceiling fairy lights",
  },
];

const galleryPhotos: Photo[] = [
  {
    src: cdn("v1768163840/Fairy-Light-Canopy-with-Shades-e1510835685909_wgdrd3.jpg"),
    width: 1200,
    height: 900,
    alt: "Fairy light canopy with shades creating a romantic wedding atmosphere",
  },
  {
    src: cdn("v1768163736/ChloeStu2-e1434724653198_n5lhsf.jpg"),
    width: 1200,
    height: 900,
    alt: "Chloe and Stu's wedding with fairy light installations and atmospheric lighting",
  },
  {
    src: cdn("v1768163739/170504_matthew-pei-san_ria-mishaal-photography_0957_im3era.jpg"),
    width: 1200,
    height: 900,
    alt: "Fairy light tunnel at a wedding reception, Ria Mishaal Photography",
  },
  {
    src: cdn("v1768163700/Pennard-House_koaxfj.jpg"),
    width: 1200,
    height: 900,
    alt: "Pennard House with elegant exterior wedding lighting",
  },
  {
    src: cdn("v1768163641/Pennard-House-Festoon-Pizzarova_rpdwep.jpg"),
    width: 1200,
    height: 900,
    alt: "Pennard House festoon lighting for alfresco wedding dining",
  },
  {
    src: cdn("v1768163596/STYLISH-babs-july2016_ria-mishaal-photography_006_qmds40.jpg"),
    width: 1200,
    height: 900,
    alt: "Babington House wedding with professional lighting design, Ria Mishaal Photography",
  },
  {
    src: cdn("v1768163500/Mells-Barn-Fairy-lights-in-ceiling_vmzs3p.jpg"),
    width: 1200,
    height: 900,
    alt: "Mells Barn wedding with fairy lights in the barn ceiling",
  },
  {
    src: cdn("v1768162262/Kin-House-LED-up-lighting_fr3ypq.jpg"),
    width: 1200,
    height: 900,
    alt: "Kin House LED uplighting creating dramatic wedding atmosphere",
  },
  {
    src: cdn("v1768736010/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_xwmaca.jpg"),
    width: 1200,
    height: 900,
    alt: "The Newt Somerset with fairy light tunnel installation for their first wedding",
  },
  {
    src: cdn("v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg"),
    width: 1200,
    height: 900,
    alt: "Stretch marquee with festoon lighting for a wedding celebration",
  },
  {
    src: cdn("v1768163506/DJ-Nige-white-dance-floor-lighting_kigdwb.jpg"),
    width: 1200,
    height: 900,
    alt: "Wedding dancefloor with white LED lighting design",
  },
  {
    src: cdn("v1768741340/_F4R3275_tukoww.jpg"),
    width: 1200,
    height: 900,
    alt: "Chill Out Camp with vintage Edison festoon and fairy lights",
  },
];

export default function WeddingLightingClient() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero — shorter on mobile for LCP; full height from md */}
      <section className="relative isolate min-h-[60vh] min-h-[440px] overflow-hidden bg-gray-900 text-white md:min-h-[70vh] lg:min-h-[88vh] xl:min-h-[92vh]">
        <div className="absolute inset-0 -z-10">
          <div className="relative h-full w-full min-h-[60vh] min-h-[440px] md:min-h-[70vh] lg:min-h-[88vh] xl:min-h-[92vh]">
            <Image
              src={HERO_IMAGE_URL}
              alt="Fairy light tunnel at a wedding — bespoke lighting design by Stylish Entertainment"
              fill
              className="object-cover brightness-75 lg:brightness-[0.82] object-[center_55%] sm:object-[center_50%] lg:object-[center_42%]"
              priority
              fetchPriority="high"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-gray-950/95 lg:from-black/45 lg:via-black/20" />
        </div>
        <div className="relative z-10 flex min-h-[60vh] min-h-[440px] flex-col items-center justify-end px-4 pb-8 pt-28 text-center sm:justify-center sm:pb-0 sm:pt-40 max-w-4xl mx-auto w-full md:min-h-[70vh] lg:min-h-[88vh] xl:min-h-[92vh] lg:pt-44">
          <div className="inline-block mb-6 px-6 py-2 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
            <span className="text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase">
              Trusted at Babington House since 2003
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Wedding Lighting Design
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md mb-8 max-w-3xl">
            Designed, not just hired. Uplighting, fairy-light canopies, festoon and architectural
            lighting from a team with 20+ years transforming barns, marquees and country estates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Link href="/contact-us/">Discuss Your Lighting</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="hidden min-h-[48px] border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 hover:scale-105 transition-all duration-300 sm:inline-flex"
            >
              <a href="tel:+447970793177">Call 07970 793177</a>
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
            <Link
              href="/venues/babington-house/"
              className="text-champagne-gold hover:text-gold-light underline transition-colors"
            >
              Babington House
            </Link>{" "}
            since 2003 — the same team behind our{" "}
            <Link href="/weddings/wedding-entertainment/" className={linkClass}>
              wedding entertainment
            </Link>
            ,{" "}
            <Link href="/artists/djs/dj-nige/" className={linkClass}>
              DJ Nige
            </Link>{" "}
            and{" "}
            <Link href="/services/venue-styling/" className={linkClass}>
              venue styling
            </Link>
            , so your day feels cohesive from ceremony to last dance.
          </p>
        </div>
      </section>

      {/* Our approach */}
      <section className="py-12 md:py-28 px-4 md:px-8 bg-gray-900">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto rounded-2xl border border-champagne-gold/20 bg-gray-800/40 backdrop-blur-sm p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Our Approach To{" "}
            <span className="text-champagne-gold">Wedding Lighting</span>
          </h2>
          <div className="space-y-6 text-lg md:text-xl text-gray-200 leading-relaxed">
            <p>
              We&apos;ve been lighting weddings for more than twenty years and one lesson never
              changes: the best lighting doesn&apos;t shout for attention. It makes people feel
              something.
            </p>
            <p className="text-gray-300">
              Sometimes that means a simple canopy of warm fairy lights above a dining table.
              Sometimes it means transforming an entire terrace with festoon and tree lighting. The
              aim is always the same — creating atmosphere, not just illumination.
            </p>
            <p className="text-gray-300">
              We design every installation around how the space will be used throughout the day and
              evening — and how it sits alongside your wider{" "}
              <Link href="/weddings/wedding-entertainment/" className={linkClass}>
                wedding entertainment
              </Link>{" "}
              plans, not as a separate hire dropped in at the last minute.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Structured lighting sections */}
      <section className="py-12 md:py-28 px-4 md:px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Each Choice <span className="text-champagne-gold">Matters</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The kit is only half the story — here is why couples (and venues) invest in each layer
            of lighting.
          </p>
        </div>

        <div className="space-y-20 md:space-y-28 max-w-6xl mx-auto">
          {LIGHTING_SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                id={section.id}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center${
                  i >= 2 ? " hidden md:grid" : ""
                }`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-champagne-gold/20 shadow-[0_0_24px_rgba(212,175,55,0.08)]">
                    <Image
                      src={section.image}
                      alt={section.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <p className="text-xs font-semibold text-champagne-gold tracking-widest uppercase mb-3">
                    {section.label}
                  </p>
                  <div className="flex items-start gap-3 mb-5">
                    <Icon className="w-8 h-8 text-champagne-gold shrink-0 mt-1" aria-hidden />
                    <h3 className="text-2xl md:text-3xl font-bold text-white">{section.whyTitle}</h3>
                  </div>
                  <div className="space-y-4 text-gray-300 text-lg leading-relaxed mb-6">
                    {section.paragraphs.map((paragraph, pi) => (
                      <p key={pi}>{paragraph}</p>
                    ))}
                  </div>
                  <Link
                    href={section.venueLink.href}
                    className="inline-flex items-center gap-2 text-champagne-gold hover:text-gold-light font-semibold transition-colors"
                  >
                    {section.venueLink.label}
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-10 text-center md:hidden">
          <Link href="/galleries/" className={`text-sm ${linkClass}`}>
            View wedding lighting gallery
          </Link>
        </p>
      </section>

      {/* Common mistakes */}
      <section
        id="mistakes"
        className="py-12 md:py-28 px-4 md:px-8 bg-gray-900 border-y border-champagne-gold/20"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Most Common{" "}
              <span className="text-champagne-gold">Wedding Lighting Mistakes</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We see these at venues across the South West — often before couples call us in to
              refine the plan.
            </p>
          </motion.div>
          <ul className="space-y-5">
            {LIGHTING_MISTAKES.map((mistake, index) => (
              <motion.li
                key={mistake.title}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={index >= 3 ? "hidden md:list-item" : undefined}
              >
                <Card className="bg-gray-800/50 border-champagne-gold/20 hover:border-champagne-gold/35 transition-colors">
                  <CardContent className="p-6 flex gap-4">
                    <AlertCircle
                      className="w-6 h-6 text-champagne-gold shrink-0 mt-0.5"
                      aria-hidden
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{mistake.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{mistake.detail}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cost guidance */}
      <section id="cost" className="py-12 md:py-28 px-4 md:px-8 bg-gray-950">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            How Much Does <span className="text-champagne-gold">Wedding Lighting</span> Cost?
          </h2>
          <div className="space-y-5 text-lg text-gray-300 leading-relaxed">
            <p>
              Wedding lighting can range from a few hundred pounds for a simple installation to
              several thousand pounds for a complete venue transformation. The biggest factors are
              venue size, access, installation time and the type of lighting required.
            </p>
            <p>
              A single room with uplighting and fairy lights over the dining tables sits at a very
              different budget to a barn ceiling full of festoon, exterior terraces, a lit walkway
              and a coordinated dancefloor — especially when rigging needs extra time or specialist
              access.
            </p>
            <p>
              We do not publish fixed packages because every venue tells a different story. Share
              your date, floor plans and a sense of what you want to feel — we will reply with a
              clear proposal. If you are also booking{" "}
              <Link href="/weddings/wedding-entertainment/" className={linkClass}>
                wedding entertainment
              </Link>{" "}
              or{" "}
              <Link href="/services/venue-styling/" className={linkClass}>
                venue styling
              </Link>
              , we can scope lighting as one quote so nothing is duplicated.
            </p>
          </div>
          <p className="text-center mt-8">
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90">
              <Link href="/contact-us/">Get a tailored lighting quote</Link>
            </Button>
          </p>
        </motion.div>
      </section>

      {/* Before / after — desktop only (slider is heavy on mobile) */}
      <section className="hidden py-12 md:block md:py-28 px-4 md:px-8 bg-gray-900/80">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              See the Transformation
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Drag the slider — the same terrace before and after our lighting team finished.
            </p>
          </motion.div>
          <BeforeAfter
            before={beforeAfterTransform.before}
            after={beforeAfterTransform.after}
            aspectRatio="16/9"
          />
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 md:py-28 px-3 sm:px-4 bg-gray-950" id="gallery">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Wedding Lighting Gallery</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A selection of recent weddings across the South West and beyond.
            </p>
          </motion.div>
          <Gallery photos={galleryPhotos} columns={3} mobileVisibleCount={4} viewAllHref="/galleries/" />
        </div>
      </section>

      {/* Venue examples */}
      <section className="py-12 md:py-28 px-4 md:px-8 bg-gray-900 border-y border-champagne-gold/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
            Venues We Know Inside Out
          </h2>
          <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
            Lighting schemes designed with real knowledge of each room, terrace and barn.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VENUE_EXAMPLES.map((venue, index) => (
              <Link
                key={venue.href}
                href={venue.href}
                className={`group flex items-center justify-between p-5 rounded-xl bg-gray-800/60 border border-champagne-gold/20 hover:border-champagne-gold/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.12)] transition-all${
                  index >= 2 ? " hidden md:flex" : ""
                }`}
              >
                <div>
                  <p className="text-white font-semibold group-hover:text-champagne-gold transition-colors">
                    {venue.name}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">{venue.blurb}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-champagne-gold group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            ))}
          </div>
          <p className="text-center mt-8">
            <Link
              href="/venues/"
              className="inline-flex items-center gap-2 text-champagne-gold hover:text-gold-light font-semibold"
            >
              Browse all wedding venues
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      {/* Service area + testimonials link */}
      <section className="py-12 md:py-28 px-4 md:px-8 bg-gray-950">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-serif text-white">
              A Reputation Built on{" "}
              <span className="text-champagne-gold">Flawless Execution</span>
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Couples and venues trust us to transform their most important moments. Read how
              lighting worked alongside{" "}
              <Link href="/artists/djs/dj-nige/" className={linkClass}>
                DJ Nige
              </Link>{" "}
              and full{" "}
              <Link href="/weddings/wedding-entertainment/" className={linkClass}>
                wedding entertainment
              </Link>{" "}
              packages on the dancefloor.
            </p>
            <Link
              href="/testi/"
              className="inline-flex items-center gap-2 text-champagne-gold hover:text-white transition-colors group"
            >
              <span className="border-b border-champagne-gold">Read client experiences</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <Card className="hidden bg-white/5 border-champagne-gold/20 backdrop-blur-xl md:block">
            <CardContent className="p-8 space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-champagne-gold mb-4">
                  Serving the South West
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Somerset", "Wiltshire", "Dorset", "Gloucestershire", "Bath", "Bristol", "Exeter"].map(
                    (area) => (
                      <span
                        key={area}
                        className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-200"
                      >
                        {area}
                      </span>
                    )
                  )}
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                London and Home Counties weddings by arrangement — same design team, same quality
                of install.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enquiry CTA */}
      <section className="py-12 md:py-28 px-4 md:px-8 bg-gray-900">
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
                  Ready to design your wedding lighting?
                </h2>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                  Share your date, venue and vision — we reply within 24 hours with ideas tailored
                  to your space. Pair with our{" "}
                  <Link
                    href="/weddings/wedding-entertainment/"
                    className="text-champagne-gold hover:text-gold-light underline"
                  >
                    wedding entertainment
                  </Link>{" "}
                  for one cohesive team.
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

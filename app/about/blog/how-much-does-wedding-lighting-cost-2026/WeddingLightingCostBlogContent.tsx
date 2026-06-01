"use client";

import { motion } from "@/lib/motion";
import { useEffect, useMemo } from "react";
import dynamicImport from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const BlogImage = dynamicImport(() => import("@/components/BlogImage"), {
  ssr: false,
});

function CostRange({
  range,
  children,
}: {
  range: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 rounded-lg border border-champagne-gold/20 bg-gray-800/80 p-5 sm:p-6">
      <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-champagne-gold">
        Typical investment
      </p>
      <p className="mb-3 text-2xl font-bold text-white">{range}</p>
      <div className="space-y-3 text-gray-300">{children}</div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-2xl font-bold text-champagne-gold md:text-3xl">{children}</h2>
  );
}

const linkClass = "text-champagne-gold underline hover:text-gold-light";

const VENUE_BUDGET_ROWS = [
  { venue: "Small Barn", budget: "£600–£1,200" },
  { venue: "Large Barn", budget: "£1,000–£2,500" },
  { venue: "Country House", budget: "£600–£2,000" },
  { venue: "Marquee", budget: "£1,000–£5,000+" },
] as const;

export default function WeddingLightingCostBlogContent() {
  useEffect(() => {
    document.title =
      "How Much Does Wedding Lighting Cost in 2026? | Wedding Lighting Prices";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "A practical guide to wedding lighting costs in 2026, including uplighting, fairy-light canopies, festoon, dancefloor lighting, marquee lighting and full venue transformations."
      );
    }
  }, []);

  const allImages = useMemo(
    () => [
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163829/IMG_4298-e1483614322821_qoogxg.jpg",
        alt: "Barn wedding with fairy lights draped across wooden beams and white drapes",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768733254/Babington-House-in-Green_oms0ws.jpg",
        alt: "Green exterior uplighting at Babington House",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768741843/JI_2836_tkl0gi.jpg",
        alt: "Fairy light canopy and walls in a barn wedding breakfast room",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768736010/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_xwmaca.jpg",
        alt: "Fairy light tunnel installation at The Newt in Somerset",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162882/Pennard-House-Wedding-Lighting-in-the-Coach-House_vfptzj.jpg",
        alt: "Festoon lighting at Pennard House Coach House wedding",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768741619/IMG_0487_aoaxho.jpg",
        alt: "Exterior festoon and fairy light lighting on a lawn at a country house wedding",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163836/Marquee-Lighting-2_fis1jr.jpg",
        alt: "Marquee wedding lighting with chandeliers, uplighting and fairy light canopy",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163790/Party-dj-with-lazer_wnhreb.jpg",
        alt: "Professional DJ with laser and dancefloor lighting at a wedding",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768730094/Mirrorball-with-spotlights-and-amber-up-lighting_vyrl8r.jpg",
        alt: "Mirror ball with spotlights and amber uplighting at a wedding reception",
      },
    ],
    []
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768738511/wedding-tree-lighting-2-e1510835516724_f1fant.jpg"
            alt="Wedding tree lighting with paper lanterns and festoon lights at an outdoor evening reception"
            fill
            className="object-cover object-center brightness-110"
            style={{ objectPosition: "center center" }}
            priority
            sizes="100vw"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mx-auto max-w-4xl px-4 pt-32 text-center md:pt-40"
        >
          <div className="mb-4 inline-block rounded-full border border-champagne-gold/20 bg-champagne-gold/10 px-4 py-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-champagne-gold">
              Wedding Lighting · Journal
            </span>
          </div>
          <h1 className="mb-4 px-4 font-sans text-3xl font-bold text-white drop-shadow-lg sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            How Much Does Wedding Lighting Cost in 2026?
          </h1>
          <p className="mx-auto max-w-3xl px-4 text-base font-semibold leading-relaxed text-gray-200 drop-shadow-md sm:text-lg md:text-xl">
            A practical guide to wedding lighting prices, what affects the cost, and where your
            budget makes the biggest difference.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="bg-gray-800 px-3 py-20 sm:px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <Card className="border-champagne-gold/30 bg-gray-900">
              <CardContent className="space-y-8 p-6 sm:p-8 md:p-12">
                <div className="space-y-6 leading-relaxed text-gray-300">
                  <p className="text-lg">
                    One of the most common questions couples ask is: &ldquo;How much should we
                    budget for wedding lighting?&rdquo;
                  </p>
                  <p>
                    The honest answer is that it depends on your venue, the size of the space and
                    how ambitious you want the transformation to be. A few carefully placed lights
                    can make a huge difference, while a full venue transformation needs more
                    planning, equipment and installation time.
                  </p>
                  <p>
                    After more than twenty years lighting weddings at barns, marquees, country
                    houses and estates across the South West and beyond, we have learned that
                    lighting is often one of the biggest factors in how a venue feels once the sun
                    goes down. This guide explains typical{" "}
                    <Link href="/weddings/wedding-lighting/" className={linkClass}>
                      wedding lighting prices
                    </Link>{" "}
                    in 2026 — as ranges, not fixed packages — so you can plan sensibly and know
                    where your budget will have the most impact.
                  </p>

                  <div className="my-8 overflow-hidden rounded-lg border border-champagne-gold/30 bg-gray-800/60">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[320px] text-left text-sm sm:text-base">
                        <thead>
                          <tr className="border-b border-champagne-gold/20 bg-gray-800/80">
                            <th
                              scope="col"
                              className="px-4 py-3 font-semibold text-champagne-gold sm:px-6"
                            >
                              Venue Type
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 font-semibold text-champagne-gold sm:px-6"
                            >
                              Typical Lighting Budget
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {VENUE_BUDGET_ROWS.map((row, i) => (
                            <tr
                              key={row.venue}
                              className={
                                i < VENUE_BUDGET_ROWS.length - 1
                                  ? "border-b border-champagne-gold/10"
                                  : undefined
                              }
                            >
                              <td className="px-4 py-3 font-medium text-white sm:px-6">
                                {row.venue}
                              </td>
                              <td className="px-4 py-3 text-gray-200 sm:px-6">{row.budget}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="border-t border-champagne-gold/10 px-4 py-3 text-sm text-gray-400 sm:px-6">
                      Every venue is different, but these ranges provide a useful planning guide.
                      For country house weddings, our{" "}
                      <Link href="/venues/babington-house/" className={linkClass}>
                        Babington House wedding guide
                      </Link>{" "}
                      shows how lighting fits a real Soho House celebration.
                    </p>
                  </div>

                  <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-lg">
                    <BlogImage
                      src={allImages[0].src}
                      alt={allImages[0].alt}
                      images={allImages}
                      index={0}
                    />
                  </div>

                  {/* 1. Why Wedding Lighting Matters */}
                  <div>
                    <SectionHeading>1. Why Wedding Lighting Matters</SectionHeading>
                    <p className="mb-4">
                      Most venues look completely different after sunset. What felt bright and airy
                      at 4pm can feel flat, cold or cavernous by 8pm — unless someone has planned
                      for that shift.
                    </p>
                    <p className="mb-4">
                      Good lighting does not just make a room brighter. It changes how a room feels.
                    </p>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>
                        <strong className="text-white">Dinner atmosphere</strong> — warm, flattering
                        light keeps guests relaxed and makes speeches and toasts feel intimate.
                      </li>
                      <li>
                        <strong className="text-white">Photographs after dark</strong> — your
                        photographer relies on ambient light; harsh overhead fluorescents or a
                        pitch-black barn are both difficult to work with.
                      </li>
                      <li>
                        <strong className="text-white">Movement between rooms</strong> — corridors,
                        bars and breakout spaces need continuity so the evening flows naturally.
                      </li>
                      <li>
                        <strong className="text-white">Outdoor spaces</strong> — terraces, gardens
                        and courtyards often host drinks, fire pits or quiet conversations once
                        dancing starts inside.
                      </li>
                      <li>
                        <strong className="text-white">The transition to dancing</strong> — lighting
                        that builds energy without feeling like a school disco is one of the hardest
                        things to get right, and one of the most memorable when it works.
                      </li>
                    </ul>
                    <p className="mt-4">
                      If you are still exploring what is possible, our{" "}
                      <Link href="/weddings/wedding-lighting/" className={linkClass}>
                        wedding lighting
                      </Link>{" "}
                      page shows the kinds of installs we deliver at real venues — not stock
                      Pinterest boards.
                    </p>
                  </div>

                  {/* 2. Typical Wedding Lighting Budgets */}
                  <div>
                    <SectionHeading>2. Typical Wedding Lighting Budgets</SectionHeading>
                    <p className="mb-4">
                      Every wedding is different, but these guide ranges reflect what we typically
                      see for professional{" "}
                      <strong className="font-semibold text-white">wedding lighting hire</strong> in
                      2026. They are not quotes — your venue, access and design will move the
                      number up or down.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-lg border border-champagne-gold/20 bg-gray-800/60 p-5">
                        <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-champagne-gold">
                          Simple enhancement
                        </p>
                        <p className="mb-2 text-xl font-bold text-white">£300–£600</p>
                        <p className="text-sm">
                          Targeted uplighting, a small dancefloor rig or exterior accent lighting
                          where one element makes a clear difference.
                        </p>
                      </div>
                      <div className="rounded-lg border border-champagne-gold/30 bg-gray-800/80 p-5 shadow-[0_0_24px_rgba(212,175,55,0.12)]">
                        <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-champagne-gold">
                          Most weddings
                        </p>
                        <p className="mb-2 text-xl font-bold text-white">£600–£1,500</p>
                        <p className="text-sm">
                          A considered combination — often uplighting, dancefloor lighting and
                          some exterior or bar lighting working together.
                        </p>
                      </div>
                      <div className="rounded-lg border border-champagne-gold/20 bg-gray-800/60 p-5">
                        <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-champagne-gold">
                          Full venue transformation
                        </p>
                        <p className="mb-2 text-xl font-bold text-white">£1,500–£5,000+</p>
                        <p className="text-sm">
                          Canopies, extensive rigging, multiple rooms, marquees or large outdoor
                          areas — design, crew and install time all increase.
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-400">
                      These wedding lighting budget ranges depend on venue access, setup windows,
                      ceiling height, rigging requirements and how much of the site you want to
                      cover — not simply how many lights you hire. Where styling and lighting work
                      together, our{" "}
                      <Link href="/services/venue-styling/" className={linkClass}>
                        venue styling
                      </Link>{" "}
                      team can help you plan both as one atmosphere.
                    </p>
                  </div>

                  {/* 3. Uplighting */}
                  <div>
                    <SectionHeading>3. Wedding Uplighting Cost</SectionHeading>
                    <CostRange range="£300–£900">
                      <p>
                        Uplighting is often the best place to start when couples ask about{" "}
                        <strong className="text-white">wedding lighting cost</strong>. It is
                        relatively quick to install, works in barns, orangeries, country houses and
                        marquees, and highlights walls, beams and architectural detail that
                        disappear in flat overhead light.
                      </p>
                      <p>
                        We have used uplighting at barns and country houses to warm stone, timber
                        and plaster without overpowering the room. Our{" "}
                        <Link href="/venues/babington-house/" className={linkClass}>
                          Babington House wedding guide
                        </Link>{" "}
                        is a useful country house example; at{" "}
                        <Link href="/venues/mells-barn/" className={linkClass}>
                          Mells Barn
                        </Link>
                        , we know the rigging points and power circuits well. Colour, quantity and
                        programming all affect the final investment.
                      </p>
                    </CostRange>
                    <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[1].src}
                        alt={allImages[1].alt}
                        images={allImages}
                        index={1}
                      />
                    </div>
                  </div>

                  {/* 4. Fairy Light Canopy */}
                  <div>
                    <SectionHeading>4. Fairy Light Canopy Cost</SectionHeading>
                    <CostRange range="£800–£3,000+">
                      <p>
                        A fairy light canopy creates that ceiling-of-stars effect couples remember
                        long after the wedding. It is dramatic in barns and marquees — but cost
                        varies widely.
                      </p>
                      <p>
                        Ceiling height, rigging points, access for ladders or lifts, and the area
                        you need to cover all push the{" "}
                        <strong className="text-white">fairy light canopy cost</strong> up or down.
                        A partial canopy over the dancefloor sits at the lower end; a full barn
                        ceiling with multiple rigging runs sits at the upper end.
                      </p>
                    </CostRange>
                    <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[2].src}
                        alt={allImages[2].alt}
                        images={allImages}
                        index={2}
                      />
                    </div>
                    <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[3].src}
                        alt={allImages[3].alt}
                        images={allImages}
                        index={3}
                      />
                    </div>
                  </div>

                  {/* 5. Festoon */}
                  <div>
                    <SectionHeading>5. Festoon Lighting Wedding Cost</SectionHeading>
                    <CostRange range="£300–£1,500+">
                      <p>
                        Festoon lighting suits courtyards, gardens, terraces and outdoor dining
                        areas — anywhere you want warmth and a relaxed, celebratory feel after
                        dark. Indoors, it works equally well in stone coach houses and barns where
                        you want to fill a high ceiling without a full rig.
                      </p>
                      <p>
                        The{" "}
                        <strong className="text-white">festoon lighting wedding cost</strong> is
                        rarely about the bulbs alone. Cable runs, fixing points, weather protection
                        and power distribution across a garden or courtyard often account for a
                        significant part of the install.
                      </p>
                    </CostRange>
                    <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[4].src}
                        alt={allImages[4].alt}
                        images={allImages}
                        index={4}
                      />
                    </div>
                  </div>

                  {/* 6. Exterior */}
                  <div>
                    <SectionHeading>6. Exterior &amp; Outdoor Lighting Costs</SectionHeading>
                    <CostRange range="£400–£2,000+">
                      <p>
                        Building washes, tree lighting, pathways, arrival routes and lit courtyards
                        keep outside spaces connected to the reception once the sun sets. Guests
                        move between bar, terrace and garden throughout the evening — if those
                        areas are dark, the flow breaks.
                      </p>
                      <p>
                        Outdoor power, weather and access all affect pricing. Tree lighting and
                        building washes need safe rigging and often more crew time than a row of
                        uplighters indoors.
                      </p>
                    </CostRange>
                    <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[5].src}
                        alt={allImages[5].alt}
                        images={allImages}
                        index={5}
                      />
                    </div>
                  </div>

                  {/* 7. Dancefloor */}
                  <div>
                    <SectionHeading>7. Dancefloor Lighting Cost</SectionHeading>
                    <CostRange range="£300–£1,500+">
                      <p>
                        Dancefloor lighting depends on room size, ceiling height and the kind of
                        music you are planning. A small barn with a low ceiling needs a different
                        approach to a marquee with a 4-metre ridge.
                      </p>
                      <p>
                        We generally favour intelligent lighting and mirror balls over effects
                        that dominate the room rather than enhance it. Well-placed wash and moving
                        lights often create more atmosphere — and better photographs — than an
                        aggressive light show. See our{" "}
                        <Link href="/parties/party-lighting/" className={linkClass}>
                          Party Lighting
                        </Link>{" "}
                        work for examples of dancefloor rigs at private celebrations.
                      </p>
                    </CostRange>
                    <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[7].src}
                        alt={allImages[7].alt}
                        images={allImages}
                        index={7}
                      />
                    </div>
                  </div>

                  {/* 8. Mirror Ball */}
                  <div>
                    <SectionHeading>8. Mirror Ball Costs</SectionHeading>
                    <CostRange range="£150–£1,000+">
                      <p>
                        Mirror balls add movement and glamour without overwhelming a room — when
                        they are the right size and rigged at the right height. A single ball over
                        a dancefloor is modest; multiple balls with motorised rigging and
                        coordinated wash lighting sits higher.
                      </p>
                      <p>
                        Size, quantity, rigging height and whether you need additional fixtures to
                        make the ball read in a large space all affect cost.
                      </p>
                    </CostRange>
                    <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[8].src}
                        alt={allImages[8].alt}
                        images={allImages}
                        index={8}
                      />
                    </div>
                  </div>

                  {/* 9. Barn */}
                  <div>
                    <SectionHeading>9. Barn Wedding Lighting Cost</SectionHeading>
                    <CostRange range="£800–£3,000+">
                      <p>
                        Barns often need warmth, texture and structure. Exposed beams, uneven
                        floors and limited fixed lighting mean a barn wedding rarely succeeds with
                        uplighting alone.
                      </p>
                      <p>
                        Fairy lights, uplighting, dancefloor lighting and outdoor areas often work
                        together. At{" "}
                        <Link
                          href="/venues/mells-barn/"
                          className="text-champagne-gold underline hover:text-gold-light"
                        >
                          Mells Barn
                        </Link>
                        , for example, we know the rigging points, power and flow of the space —
                        that knowledge saves time on the day and helps couples spend wisely.
                      </p>
                    </CostRange>
                  </div>

                  {/* 10. Marquee */}
                  <div>
                    <SectionHeading>10. Marquee Wedding Lighting Cost</SectionHeading>
                    <CostRange range="£1,000–£5,000+">
                      <p>
                        Marquees are blank canvases. You are not enhancing an existing room — you
                        are building atmosphere from scratch. Dining lighting, a canopy, dancefloor
                        rig, entrance lighting and exterior festoon often all need to work as one
                        design.
                      </p>
                      <p>
                        The{" "}
                        <strong className="text-white">marquee wedding lighting cost</strong> reflects
                        that scope. Full design matters more than individual fixtures: a coherent
                        plan beats a shopping list of hire items. For more on what we deliver, see
                        our{" "}
                        <Link href="/weddings/wedding-lighting/" className={linkClass}>
                          Wedding Lighting
                        </Link>{" "}
                        service.
                      </p>
                    </CostRange>
                    <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[6].src}
                        alt={allImages[6].alt}
                        images={allImages}
                        index={6}
                      />
                    </div>
                  </div>

                  {/* 11. What drives cost */}
                  <div>
                    <SectionHeading>11. What Actually Drives The Cost?</SectionHeading>
                    <p className="mb-4">
                      When couples compare wedding lighting prices, they often focus on the number
                      of lights. In practice, these factors move the quote more than anything:
                    </p>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>
                        <strong className="text-white">Venue access</strong> — loading bays, stairs,
                        restricted hours and distance from the van to the rig point.
                      </li>
                      <li>
                        <strong className="text-white">Setup window</strong> — a same-day turn
                        around between ceremony and reception limits what is achievable.
                      </li>
                      <li>
                        <strong className="text-white">Ceiling height and rigging</strong> — high
                        barns and marquees need ladders, lifts or truss.
                      </li>
                      <li>
                        <strong className="text-white">Coverage area</strong> — one room versus
                        dining, bar, dancefloor, corridor and garden.
                      </li>
                      <li>
                        <strong className="text-white">Installation and de-rig time</strong> —
                        complex canopies take hours to build and strike safely.
                      </li>
                      <li>
                        <strong className="text-white">Crew requirements</strong> — larger installs
                        need more hands on site.
                      </li>
                      <li>
                        <strong className="text-white">Outdoor power and weather</strong> — IP-rated
                        kit, cable protection and contingency planning.
                      </li>
                    </ul>
                    <p className="mt-4">
                      Our{" "}
                      <Link
                        href="/what-we-do/lighting/"
                        className="text-champagne-gold underline hover:text-gold-light"
                      >
                        lighting services
                      </Link>{" "}
                      page explains how we approach site visits and planning — the conversation
                      matters as much as the equipment list.
                    </p>
                  </div>

                  {/* 12. Mistakes */}
                  <div>
                    <SectionHeading>12. Common Wedding Lighting Mistakes</SectionHeading>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>
                        <strong className="text-white">Only lighting the dancefloor</strong> — guests
                        spend most of the evening at dinner, at the bar and outdoors; neglect those
                        spaces and the room feels disjointed.
                      </li>
                      <li>
                        <strong className="text-white">Forgetting outdoor spaces</strong> — terraces
                        and gardens go dark first; plan for them early.
                      </li>
                      <li>
                        <strong className="text-white">Choosing effects that fight the venue</strong>{" "}
                        — aggressive colour or cheap disco fixtures clash with a country house or
                        barn aesthetic.
                      </li>
                      <li>
                        <strong className="text-white">Leaving lighting too late</strong> — by the
                        time you book, access windows and crew availability shrink.
                      </li>
                      <li>
                        <strong className="text-white">Not checking venue permissions</strong> — some
                        venues restrict rigging, candles, external suppliers or late setup.
                      </li>
                      <li>
                        <strong className="text-white">Ignoring setup and de-rig access</strong> — if
                        the marquee company and lighting crew cannot coordinate, costs and stress
                        both rise.
                      </li>
                    </ul>
                    <p className="mt-4">
                      Lighting and{" "}
                      <Link href="/services/venue-styling/" className={linkClass}>
                        venue styling
                      </Link>{" "}
                      work best when planned together — drapery, props and light should complement
                      each other, not compete.
                    </p>
                  </div>

                  {/* 13. Where to spend */}
                  <div>
                    <SectionHeading>13. Where Should You Spend Your Budget?</SectionHeading>
                    <p className="mb-4">
                      Every venue is different, but if your wedding lighting budget is limited,
                      this order often delivers the most visible improvement:
                    </p>
                    <ol className="list-decimal space-y-3 pl-5">
                      <li>
                        <strong className="text-white">Uplighting</strong> — fastest way to change
                        how the whole room feels at dinner.
                      </li>
                      <li>
                        <strong className="text-white">Dancefloor lighting</strong> — builds energy
                        for the evening without re-lighting the entire barn.
                      </li>
                      <li>
                        <strong className="text-white">Outdoor lighting</strong> — keeps drinks,
                        fire pits and conversation spaces usable after dark.
                      </li>
                      <li>
                        <strong className="text-white">Fairy light canopy</strong> — stunning, but
                        often the largest single line item; worth prioritising if the ceiling is a
                        focal point of your venue.
                      </li>
                    </ol>
                    <p className="mt-4">
                      A short conversation about your venue usually clarifies which of these will
                      matter most on your date.
                    </p>
                  </div>

                  {/* 14. Final thoughts */}
                  <div>
                    <SectionHeading>14. Final Thoughts</SectionHeading>
                    <p className="mb-4">
                      Wedding lighting affects every guest, every photograph and every part of the
                      evening. The goal is not simply to add lights. The goal is to create
                      atmosphere.
                    </p>
                    <p>
                      Whether you are planning a modest uplight in a Somerset barn or a full
                      marquee transformation, honest planning beats guessing at package prices. We
                      would rather help you understand{" "}
                      <strong className="text-white">how much wedding lighting costs</strong> for
                      your specific venue than sell you equipment you do not need.
                    </p>
                  </div>

                  {/* FAQ */}
                  <div className="border-t border-gray-700 pt-8">
                    <SectionHeading>Frequently Asked Questions</SectionHeading>
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          How much does wedding lighting cost?
                        </h3>
                        <p>
                          Most couples spend between £600 and £1,500 on wedding lighting hire, with
                          simple enhancement from around £300–£600 and full venue transformations
                          often reaching £1,500–£5,000 or more. Your venue, access and design
                          ambition determine where you sit in that range.
                        </p>
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          What is the cheapest way to improve wedding lighting?
                        </h3>
                        <p>
                          Uplighting is usually the most cost-effective upgrade — typically
                          £300–£900 for a meaningful change to walls, beams and overall atmosphere
                          without a full rig or canopy.
                        </p>
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          How much does a fairy light canopy cost?
                        </h3>
                        <p>
                          Expect £800–£3,000 or more, depending on ceiling height, rigging access
                          and how much of the space you cover. High barns and large marquees often
                          sit at the upper end.
                        </p>
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          Is uplighting worth it for a wedding?
                        </h3>
                        <p>
                          Yes. It is one of the best-value investments in wedding lighting — quick
                          to install, visible in photographs and effective in barns, orangeries,
                          country houses and marquees.
                        </p>
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          How early should we book wedding lighting?
                        </h3>
                        <p>
                          As soon as your venue and date are confirmed — ideally six to twelve
                          months ahead for peak season. Early booking allows a proper planning
                          conversation and avoids last-minute access problems.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-12 rounded-xl border border-champagne-gold/30 bg-gray-800/60 p-6 text-center backdrop-blur-sm sm:p-8">
                    <h2 className="mb-3 text-2xl font-bold text-champagne-gold md:text-3xl">
                      Planning your wedding lighting?
                    </h2>
                    <p className="mx-auto mb-6 max-w-2xl text-gray-300">
                      Tell us your venue, date and the kind of atmosphere you want to create — we
                      will suggest where lighting will make the biggest difference.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                      <Link
                        href="/weddings/wedding-lighting/"
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-champagne-gold px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                      >
                        Discuss Wedding Lighting
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                      <Link
                        href="/contact-us/"
                        className="text-champagne-gold underline hover:text-gold-light"
                      >
                        Or contact us directly
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

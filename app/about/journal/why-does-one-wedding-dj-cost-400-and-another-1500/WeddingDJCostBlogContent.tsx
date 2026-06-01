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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-2xl font-bold text-champagne-gold md:text-3xl">{children}</h2>
  );
}

const linkClass = "text-champagne-gold underline hover:text-gold-light";

const DJ_COST_RANGES = [
  {
    tier: "Budget / casual DJ",
    range: "£400–£700",
    note: "Often shorter sets, simpler venues or less planning time built in.",
  },
  {
    tier: "Professional wedding DJ",
    range: "£700–£1,200",
    note: "Typical range for an experienced wedding specialist with proper kit and prep.",
  },
  {
    tier: "Experienced premium / luxury wedding DJ",
    range: "£1,200–£2,000+",
    note: "Named artists, high-stakes evenings and venues where judgement matters most.",
  },
  {
    tier: "Full DJ + sound + lighting / production",
    range: "£1,500–£4,000+",
    note: "Entertainment planned as one production — music, sound and atmosphere together.",
  },
] as const;

const BOOKING_QUESTIONS = [
  "Who will actually DJ on the night?",
  "Have you played at our venue or similar venues?",
  "What happens if you are ill?",
  "Can we provide requests and do-not-plays?",
  "Do you have public liability insurance?",
  "Is your equipment PAT tested?",
  "Do you provide microphones for speeches?",
  "How do you handle mixed-age crowds?",
  "What time do you arrive?",
  "What is included in the fee?",
] as const;

const PAY_MORE_WHEN = [
  "The wedding is high-value and you want confidence on the night",
  "The venue is complex — access, curfews, noise limits or multiple rooms",
  "There are mixed generations on the dancefloor",
  "Music matters deeply to you as a couple",
  "You need ceremony or speech sound support",
  "You have a band handover to manage",
  "You want lighting included in the same plan",
  "You need a late finish or extended setup window",
  "You want a named, experienced DJ — not whoever is free",
  "You want peace of mind on a one-day event with no second chance",
] as const;

export default function WeddingDJCostBlogContent() {
  useEffect(() => {
    document.title = "Why Does One Wedding DJ Cost £400 And Another £1,500?";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Why do wedding DJ prices vary so much? A practical guide to wedding DJ costs, experience, equipment, reliability, planning, insurance and what couples are really paying for."
      );
    }
  }, []);

  const allImages = useMemo(
    () => [
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162609/Nigel-DJ-Babs-House-0004_n7thhh.jpg",
        alt: "DJ Nige performing at a Babington House wedding reception",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768742320/IMG_1871_161201_n88x5z.jpg",
        alt: "Wedding guests celebrating on a packed dancefloor with live saxophone",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768734676/RosedewFarmWeddingPhotography-EmmaSam-562_aqtw3u.jpg",
        alt: "Live band and packed wedding dancefloor with professional lighting at a barn venue",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163806/Jade-and-Emma-0061_vd8lwz.jpg",
        alt: "Bride and groom dancing on the bar at a wedding reception",
      },
    ],
    []
  );

  return (
    <div>
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162609/Nigel-DJ-Babs-House-0004_n7thhh.jpg"
            alt="DJ Nige performing at a Babington House wedding reception"
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
              Wedding Entertainment · Journal
            </span>
          </div>
          <h1 className="mb-4 px-4 font-sans text-3xl font-bold text-white drop-shadow-lg sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            Why Does One Wedding DJ Cost £400 And Another £1,500?
          </h1>
          <p className="mx-auto max-w-3xl px-4 text-base font-semibold leading-relaxed text-gray-200 drop-shadow-md sm:text-lg md:text-xl">
            A practical guide to wedding DJ prices, what affects the fee, and why the cheapest
            option is not always the best value.
          </p>
        </motion.div>
      </section>

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
                    &ldquo;Why are some wedding DJs £400 and others £1,500 or more?&rdquo; It is one
                    of the first questions couples ask when they start comparing quotes — and a fair
                    one.
                  </p>
                  <p>
                    At first glance, it can look like everyone is offering the same thing: a DJ,
                    speakers, lights and a few hours of music. But{" "}
                    <strong className="font-semibold text-white">wedding DJ pricing</strong> is not
                    just about the number of hours behind the decks.
                  </p>
                  <p>
                    It reflects experience, preparation, music knowledge, reliability, equipment,
                    insurance, travel, setup time, venue familiarity and the ability to read a room
                    when the pressure is on. After more than twenty years performing at weddings
                    including{" "}
                    <Link href="/venues/babington-house/" className={linkClass}>
                      Babington House
                    </Link>{" "}
                    and venues across Somerset, Bath, Bristol and the wider UK, we have seen exactly
                    why the cheapest option can sometimes become the most expensive mistake.
                  </p>

                  <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-lg">
                    <BlogImage
                      src={allImages[0].src}
                      alt={allImages[0].alt}
                      images={allImages}
                      index={0}
                    />
                  </div>

                  {/* 1 */}
                  <div>
                    <SectionHeading>1. The Short Answer</SectionHeading>
                    <p className="mb-4">
                      A £400 DJ may be charging mainly for time and equipment. A £1,500 DJ is
                      usually charging for experience, judgement, preparation, reliability and
                      professional delivery.
                    </p>
                    <p className="rounded-lg border border-champagne-gold/20 bg-gray-800/60 px-5 py-4 font-medium text-white">
                      You are not only paying for the music. You are paying for what happens when
                      the room does not behave like the playlist.
                    </p>
                  </div>

                  {/* 2 */}
                  <div>
                    <SectionHeading>2. What Most Couples Think They Are Buying</SectionHeading>
                    <p className="mb-4">
                      Many couples assume they are buying speakers, lights, decks, music and five
                      hours of performance. Those are the visible parts — and they matter.
                    </p>
                    <p className="mb-4">What matters more on the night:</p>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>Knowing when to start — and when to hold back</li>
                      <li>Handling mixed generations without losing either end of the room</li>
                      <li>Filtering requests without killing the mood</li>
                      <li>First dance timing and the arc after it</li>
                      <li>Band handovers that do not drop the energy</li>
                      <li>Speeches support — microphones, cues and calm under pressure</li>
                      <li>Working within venue restrictions without the couple noticing the friction</li>
                    </ul>
                    <p className="mt-4">
                      That is what separates a{" "}
                      <Link href="/weddings/wedding-entertainment/" className={linkClass}>
                        professional wedding DJ
                      </Link>{" "}
                      from someone who turns up and presses play.
                    </p>
                  </div>

                  {/* 3 */}
                  <div>
                    <SectionHeading>3. Experience Costs More Because It Reduces Risk</SectionHeading>
                    <p className="mb-4">
                      A wedding is not a nightclub slot. There is no second chance. A wedding DJ has
                      to manage mixed-age crowds, family dynamics, strict venue timings,
                      photographers and caterers, emotional moments, must-play and do-not-play
                      lists, nervous couples and an energy that shifts every twenty minutes.
                    </p>
                    <p className="rounded-lg border border-champagne-gold/20 bg-gray-800/60 px-5 py-4 font-medium text-white">
                      Experience does not guarantee perfection, but it dramatically reduces the
                      chance of avoidable mistakes.
                    </p>
                    <p className="mt-4">
                      If you want a sense of what that judgement looks like in practice, our guide on{" "}
                      <Link
                        href="/about/journal/how-to-keep-a-wedding-dancefloor-full/"
                        className={linkClass}
                      >
                        how to keep a wedding dancefloor full
                      </Link>{" "}
                      goes into the timing and room-reading side — the invisible work behind a busy
                      floor.
                    </p>
                    <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[1].src}
                        alt={allImages[1].alt}
                        images={allImages}
                        index={1}
                      />
                    </div>
                  </div>

                  {/* 4 */}
                  <div>
                    <SectionHeading>
                      4. Music Knowledge Is Not The Same As Having Spotify
                    </SectionHeading>
                    <p className="mb-4">
                      Anyone can access millions of songs. The skill is knowing what to play, when
                      to play it, what not to play, when to move on, when to take a risk and when
                      to play the obvious song that pulls the room together.
                    </p>
                    <p>
                      Reading the room. Mixed generations. Music arcs across the evening — not a
                      genre playlist from 9pm to midnight. That is why couples who care about{" "}
                      <strong className="text-white">wedding reception music</strong> often book a
                      named DJ rather than the lowest quote on a comparison site.
                    </p>
                  </div>

                  {/* 5 */}
                  <div>
                    <SectionHeading>5. Preparation Takes Time</SectionHeading>
                    <p className="mb-4">
                      The visible DJ set might be five hours. The invisible work often includes:
                    </p>
                    <ul className="mb-4 list-disc space-y-2 pl-5">
                      <li>Enquiry handling and honest advice before you book</li>
                      <li>Planning calls and music briefs</li>
                      <li>Playlist review, requests and do-not-play lists</li>
                      <li>Venue liaison — access, curfews, noise limits</li>
                      <li>Travel planning and equipment prep</li>
                      <li>Early setup and backup planning</li>
                    </ul>
                    <p>
                      A fair <strong className="text-white">wedding DJ cost</strong> covers more
                      than the performance window. When you are comparing{" "}
                      <strong className="text-white">wedding DJ prices</strong>, ask what happens
                      before the first song — not just what happens after it.
                    </p>
                  </div>

                  {/* 6 */}
                  <div>
                    <SectionHeading>
                      6. Equipment Matters — But It Is Not The Whole Story
                    </SectionHeading>
                    <p className="mb-4">
                      Good sound and lighting matter. Guests notice muddy speech audio and harsh
                      dancefloor lighting. But equipment alone does not fill a dancefloor.
                    </p>
                    <ul className="mb-4 list-disc space-y-2 pl-5">
                      <li>Reliable sound system sized for the room</li>
                      <li>Microphones for speeches and toasts</li>
                      <li>Tidy setup that works with the venue, not against it</li>
                      <li>Backup cables and contingency kit</li>
                      <li>PAT testing and public liability insurance</li>
                      <li>Appropriate lighting — often planned with{" "}
                        <Link href="/weddings/wedding-lighting/" className={linkClass}>
                          wedding lighting
                        </Link>{" "}
                        as one atmosphere</li>
                    </ul>
                    <p className="rounded-lg border border-champagne-gold/20 bg-gray-800/60 px-5 py-4 font-medium text-white">
                      A warehouse of kit operated badly is still a bad wedding.
                    </p>
                  </div>

                  {/* 7 */}
                  <div>
                    <SectionHeading>7. Reliability Has A Price</SectionHeading>
                    <p className="mb-4">
                      A professional wedding DJ should offer a written booking process, clear
                      contract, deposit and balance terms, insurance, a backup plan, replacement
                      cover if ill, communication before the day and venue paperwork when required.
                    </p>
                    <p>
                      This matters because weddings are high-stakes, one-day events. The question is
                      not whether something will go wrong — it is whether someone experienced is
                      prepared when it does. Our{" "}
                      <Link href="/about/faq/" className={linkClass}>
                        FAQ
                      </Link>{" "}
                      covers some of the practical booking questions couples ask most often.
                    </p>
                  </div>

                  {/* 8 */}
                  <div>
                    <SectionHeading>8. Venue Experience Can Save You Money</SectionHeading>
                    <p className="mb-4">
                      A DJ who knows wedding venues understands load-in access, noise limits, where
                      the bar is, where guests gather, setup timings, power, curfews and how the
                      room behaves once dinner ends.
                    </p>
                    <p className="mb-4">
                      At Babington House, after hundreds of events, we know how the terrace, bar,
                      Orangery and party spaces affect the flow of the night — that familiarity
                      saves time and stress on the day. The point is broader: venue knowledge reduces
                      friction, and friction costs money in overtime, stress and missed moments.
                    </p>
                    <p>
                      Browse our{" "}
                      <Link href="/artists/djs/" className={linkClass}>
                        DJ roster
                      </Link>{" "}
                      to see who knows your kind of venue — barns, country houses, marquees and
                      estates across the South West and beyond.
                    </p>
                  </div>

                  {/* 9 */}
                  <div>
                    <SectionHeading>9. Why Cheap Can Be Fine — Sometimes</SectionHeading>
                    <p className="mb-4">
                      We would rather be honest than defensive. A lower-cost DJ can be perfectly
                      suitable for smaller parties, casual events, short sets, simple venues or
                      clients with modest expectations. Not every celebration needs a premium
                      production.
                    </p>
                    <p>
                      But a luxury wedding, complex venue, mixed guest list or high-pressure
                      evening needs more than someone playing tracks. The question is whether your
                      event matches the level of risk you are comfortable with — not whether a{" "}
                      <strong className="text-white">cheap wedding DJ</strong> exists. They do. The
                      issue is fit, not morality.
                    </p>
                  </div>

                  {/* 10 */}
                  <div>
                    <SectionHeading>10. When Paying More Makes Sense</SectionHeading>
                    <p className="mb-4">Paying more usually makes sense when:</p>
                    <ul className="list-disc space-y-2 pl-5">
                      {PAY_MORE_WHEN.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <p className="mt-4">
                      Read what clients say on our{" "}
                      <Link href="/testi/" className={linkClass}>
                        testimonials
                      </Link>{" "}
                      page — the recurring theme is rarely the playlist. It is confidence, calm and
                      a room that felt right.
                    </p>
                  </div>

                  {/* Real example */}
                  <div className="rounded-xl border border-champagne-gold/30 bg-gray-800/60 p-6 sm:p-8">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-champagne-gold">
                      Real example
                    </p>
                    <h3 className="mb-4 text-xl font-bold text-white md:text-2xl">
                      Two DJs. Same Wedding. Different Outcomes.
                    </h3>
                    <p className="mb-4">
                      Imagine a 150-guest wedding in a Somerset barn.
                    </p>
                    <p className="mb-4">
                      The £400 DJ arrives at 7pm, sets up, plays music and leaves at midnight.
                    </p>
                    <p className="mb-4">The £1,500 DJ has already:</p>
                    <ul className="mb-4 list-disc space-y-2 pl-5">
                      <li>spoken with the couple</li>
                      <li>reviewed requests</li>
                      <li>planned around the venue</li>
                      <li>coordinated with the band</li>
                      <li>checked speech microphones</li>
                      <li>prepared backup equipment</li>
                      <li>planned the first dance transition</li>
                      <li>managed the flow of the evening</li>
                    </ul>
                    <p className="mb-4">Both may play the same songs.</p>
                    <p className="font-medium text-white">
                      Only one is managing the entire experience.
                    </p>
                  </div>

                  <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-lg">
                    <BlogImage
                      src={allImages[2].src}
                      alt={allImages[2].alt}
                      images={allImages}
                      index={2}
                    />
                  </div>

                  {/* 11 From Nigel */}
                  <div>
                    <SectionHeading>11. From Nigel</SectionHeading>
                    <div className="space-y-4 border-l-2 border-champagne-gold/40 pl-5 sm:pl-6">
                      <p>
                        The weddings I worry about least are not always the biggest.
                      </p>
                      <p>
                        The weddings I worry about most are the ones where couples have assumed
                        music will somehow take care of itself.
                      </p>
                      <p>
                        After twenty years, I have learned that atmosphere is rarely an accident.
                        It is usually the result of preparation.
                      </p>
                      <p>
                        That is what you are comparing when two quotes sit £1,000 apart — not just
                        five hours behind the decks, but whether someone is thinking about your
                        evening before the guests arrive.{" "}
                        <Link href="/artists/djs/dj-nige/" className={linkClass}>
                          Meet DJ Nige
                        </Link>{" "}
                        if you want to talk through what that looks like at your venue.
                      </p>
                    </div>
                    <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[3].src}
                        alt={allImages[3].alt}
                        images={allImages}
                        index={3}
                      />
                    </div>
                  </div>

                  {/* 12 */}
                  <div>
                    <SectionHeading>12. Questions To Ask Before Booking A Wedding DJ</SectionHeading>
                    <p className="mb-4">
                      Before you sign, these questions separate a professional from a gamble:
                    </p>
                    <ol className="list-decimal space-y-2 pl-5">
                      {BOOKING_QUESTIONS.map((question) => (
                        <li key={question}>{question}</li>
                      ))}
                    </ol>
                  </div>

                  {/* 13 */}
                  <div>
                    <SectionHeading>13. What Should A Wedding DJ Cost In 2026?</SectionHeading>
                    <p className="mb-4">
                      These are broad UK guide ranges for{" "}
                      <strong className="text-white">wedding DJ cost UK</strong> comparisons in
                      2026 — not fixed prices and not a quote from us. Location, travel, timings,
                      setup access, artist profile, equipment, lighting and production all move the
                      final number.
                    </p>
                    <div className="overflow-hidden rounded-lg border border-champagne-gold/30 bg-gray-800/60">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[320px] text-left text-sm sm:text-base">
                          <thead>
                            <tr className="border-b border-champagne-gold/20 bg-gray-800/80">
                              <th
                                scope="col"
                                className="px-4 py-3 font-semibold text-champagne-gold sm:px-6"
                              >
                                Tier
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 font-semibold text-champagne-gold sm:px-6"
                              >
                                Typical range
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {DJ_COST_RANGES.map((row, i) => (
                              <tr
                                key={row.tier}
                                className={
                                  i < DJ_COST_RANGES.length - 1
                                    ? "border-b border-champagne-gold/10"
                                    : undefined
                                }
                              >
                                <td className="px-4 py-3 align-top font-medium text-white sm:px-6">
                                  {row.tier}
                                  <p className="mt-1 text-sm font-normal text-gray-400">
                                    {row.note}
                                  </p>
                                </td>
                                <td className="px-4 py-3 align-top font-semibold text-gray-200 sm:px-6">
                                  {row.range}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="border-t border-champagne-gold/10 px-4 py-3 text-sm text-gray-400 sm:px-6">
                        For a named, experienced DJ at a serious venue, compare like with like —
                        not a £400 quote against a £1,500 quote that includes planning, insurance,
                        backup cover and years of wedding-specific judgement.
                      </p>
                    </div>
                  </div>

                  {/* 14 */}
                  <div className="border-t border-gray-700 pt-8">
                    <SectionHeading>14. Final Thoughts</SectionHeading>
                    <p className="mb-4">
                      The best wedding DJ is not always the most expensive. The cheapest is not
                      always wrong. But couples should understand what they are comparing.
                    </p>
                    <p className="mb-4">
                      A wedding DJ fee reflects risk, experience, preparation, judgement and
                      confidence on the night — whether you are planning in Somerset, Bath,
                      Bristol or further afield. It is part of the wider{" "}
                      <strong className="text-white">wedding entertainment cost</strong>, not an
                      isolated line item.
                    </p>
                    <p className="rounded-lg border border-champagne-gold/20 bg-gray-800/60 px-5 py-4 font-medium text-white">
                      If the music matters to you, do not compare DJs only by price. Compare by
                      trust.
                    </p>
                  </div>

                  {/* FAQ */}
                  <div>
                    <SectionHeading>Frequently Asked Questions</SectionHeading>
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          How much does a wedding DJ cost in the UK?
                        </h3>
                        <p>
                          Broad guide ranges in 2026: budget or casual DJs often £400–£700,
                          professional wedding DJs £700–£1,200, experienced premium or luxury DJs
                          £1,200–£2,000+, and full DJ plus sound, lighting or production packages
                          £1,500–£4,000+. Travel, timings and venue complexity all affect the quote.
                        </p>
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          Why are some wedding DJs more expensive?
                        </h3>
                        <p>
                          Higher fees usually reflect experience, preparation, music judgement,
                          reliability, insurance, backup plans and venue familiarity — not just
                          hours on the decks.
                        </p>
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          Is a cheap wedding DJ always a bad idea?
                        </h3>
                        <p>
                          No. Lower-cost DJs can suit smaller or casual events. For complex venues,
                          mixed generations or high-pressure evenings, paying more for experience
                          usually reduces risk.
                        </p>
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          What should be included in a wedding DJ fee?
                        </h3>
                        <p>
                          Who is performing, reliable sound, speech microphones if needed, setup
                          time, planning communication, insurance, PAT-tested equipment where
                          required, and a backup plan if the DJ cannot attend.
                        </p>
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          Is it worth paying more for an experienced wedding DJ?
                        </h3>
                        <p>
                          Yes — when music matters deeply, the guest list spans generations, the
                          venue is complex or you want peace of mind on a one-day event with no
                          second chance.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-12 rounded-xl border border-champagne-gold/30 bg-gray-800/60 p-6 text-center backdrop-blur-sm sm:p-8">
                    <h2 className="mb-3 text-2xl font-bold text-champagne-gold md:text-3xl">
                      Planning your wedding entertainment?
                    </h2>
                    <p className="mx-auto mb-6 max-w-2xl text-gray-300">
                      Tell us your date, venue and guest numbers and we will recommend the right DJ,
                      lighting and production approach for your celebration.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
                      <Link
                        href="/weddings/wedding-entertainment/"
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-champagne-gold px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                      >
                        Discuss Wedding Entertainment
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                      <Link
                        href="/artists/djs/dj-nige/"
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-champagne-gold/40 px-6 py-3 font-semibold text-champagne-gold transition-all hover:border-champagne-gold hover:bg-champagne-gold/10"
                      >
                        Meet DJ Nige
                      </Link>
                      <Link
                        href="/artists/djs/"
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-champagne-gold/40 px-6 py-3 font-semibold text-champagne-gold transition-all hover:border-champagne-gold hover:bg-champagne-gold/10"
                      >
                        View Our DJs
                      </Link>
                    </div>
                    <p className="mt-4 text-sm text-gray-400">
                      Or{" "}
                      <Link href="/contact-us/" className={linkClass}>
                        contact us directly
                      </Link>
                    </p>
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

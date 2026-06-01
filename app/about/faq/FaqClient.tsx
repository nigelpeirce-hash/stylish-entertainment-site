"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "@/lib/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FAQ_SECTIONS,
  MOST_POPULAR_QUESTIONS,
  faqQuestionSlug,
  type FaqItem,
} from "@/data/faq";

const linkClass =
  "text-champagne-gold hover:text-gold-light underline underline-offset-2 transition-colors";

const jumpLinkClass =
  "min-h-[40px] inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/5 border border-champagne-gold/30 text-gray-300 hover:bg-white/10 hover:border-champagne-gold/50 hover:text-champagne-gold transition-all duration-300";

function FaqAnswer({ children }: { children: ReactNode }) {
  return <p className="text-gray-300 leading-relaxed">{children}</p>;
}

/** Rich answers with internal links — plain-text fallbacks live in data/faq.ts for JSON-LD */
const RICH_ANSWERS: Partial<Record<string, ReactNode>> = {
  "How do we book?": (
    <FaqAnswer>
      Send your date, venue and brief — DJ, lighting, sound, styling or a mix. We confirm
      availability, recommend the right team and send a clear fee. Deposit and signed terms secure
      the date.{" "}
      <Link href="/contact-us/" className={linkClass}>
        Start on our contact page
      </Link>
      .
    </FaqAnswer>
  ),
  "Have you worked at our venue before?": (
    <FaqAnswer>
      Chances are yes. Over the last 20 years we have worked at hundreds of venues including{" "}
      <Link href="/venues/babington-house/" className={linkClass}>
        Babington House
      </Link>
      , Mells Barn, Kin House, North Cadbury Court and country estates across the UK. If your venue
      is new to us, we research access, power and layout with you before quoting.
    </FaqAnswer>
  ),
  "How much do you charge for lighting and styling?": (
    <FaqAnswer>
      Quotes depend on room size, ceiling height, access times and design scope. See{" "}
      <Link href="/weddings/wedding-lighting/" className={linkClass}>
        wedding lighting
      </Link>{" "}
      and{" "}
      <Link href="/services/venue-styling/" className={linkClass}>
        venue styling
      </Link>{" "}
      for typical briefs. We also confirm your venue allows external suppliers.
    </FaqAnswer>
  ),
  "How much do your DJs charge?": (
    <FaqAnswer>
      Fees depend on artist, location, hours and whether you need ceremony sound or a late finish.
      Send your brief via our{" "}
      <Link href="/contact-us/" className={linkClass}>
        contact form
      </Link>{" "}
      and we reply with availability and a clear fee.
    </FaqAnswer>
  ),
  "Can we choose music?": (
    <FaqAnswer>
      Yes. Every set is built around your taste — must-plays, mood and how you want the room to
      feel. See{" "}
      <Link href="/weddings/wedding-entertainment/" className={linkClass}>
        wedding entertainment
      </Link>{" "}
      for how we plan an evening. Our DJs combine your input with years of reading dancefloors.
    </FaqAnswer>
  ),
  "Can we have a DJ and band for the evening?": (
    <FaqAnswer>
      Yes, often — as part of wider{" "}
      <Link href="/weddings/wedding-entertainment/" className={linkClass}>
        wedding entertainment
      </Link>{" "}
      planning. We advise on timing and handle changeovers without awkward gaps.
    </FaqAnswer>
  ),
  "Do you provide venue styling consultations?": (
    <FaqAnswer>
      Yes — drapery, backdrops, props and table styling. See{" "}
      <Link href="/services/venue-styling/" className={linkClass}>
        venue styling
      </Link>{" "}
      for the kind of transformation we plan.
    </FaqAnswer>
  ),
  "What types of lighting do you offer?": (
    <FaqAnswer>
      Uplighting, canopies, festoon, dancefloor rigs, exterior lighting and bespoke installs. See{" "}
      <Link href="/weddings/wedding-lighting/" className={linkClass}>
        wedding lighting design
      </Link>{" "}
      for typical approaches.
    </FaqAnswer>
  ),
  "Can you provide DJs and lighting together?": (
    <FaqAnswer>
      Yes — often the best approach. One team on{" "}
      <Link href="/weddings/wedding-entertainment/" className={linkClass}>
        entertainment
      </Link>{" "}
      and{" "}
      <Link href="/weddings/wedding-lighting/" className={linkClass}>
        lighting
      </Link>{" "}
      avoids clashing timings and duplicate kit.
    </FaqAnswer>
  ),
  "Can you provide ceremony sound?": (
    <FaqAnswer>
      Yes — discreet PA, playback and wireless mics for vows and readings. Part of our wider{" "}
      <Link href="/services/kit-hire/" className={linkClass}>
        sound &amp; production
      </Link>{" "}
      support when needed.
    </FaqAnswer>
  ),
  "Can you provide microphones for speeches?": (
    <FaqAnswer>
      Yes — wireless handheld or lapel mics, levels checked before speeches. Handled through{" "}
      <Link href="/services/kit-hire/" className={linkClass}>
        sound &amp; production
      </Link>{" "}
      or the evening DJ, depending on your brief.
    </FaqAnswer>
  ),
  "Can you support marquee weddings and parties?": (
    <FaqAnswer>
      Regularly — acoustics, power, speeches and dancefloor audio all need marquee-specific planning.
      We combine{" "}
      <Link href="/services/kit-hire/" className={linkClass}>
        sound &amp; production
      </Link>{" "}
      with lighting where needed.
    </FaqAnswer>
  ),
  "Can I speak with someone before booking?": (
    <FaqAnswer>
      Yes — call{" "}
      <a href="tel:+447970793177" className={linkClass}>
        07970 793177
      </a>{" "}
      or use the{" "}
      <Link href="/contact-us/" className={linkClass}>
        contact form
      </Link>{" "}
      for detailed briefs.
    </FaqAnswer>
  ),
};

function FaqItemBlock({ item }: { item: FaqItem }) {
  const rich = RICH_ANSWERS[item.question];
  return (
    <div id={faqQuestionSlug(item.question)} className="scroll-mt-28">
      <h3 className="text-xl font-bold text-champagne-gold mb-3">{item.question}</h3>
      {rich ?? <FaqAnswer>{item.answer}</FaqAnswer>}
    </div>
  );
}

export default function FaqClient() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "FAQ | Event Planning Questions | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Practical answers on booking DJs, wedding lighting, venue styling, sound and event production — planning advice from an experienced UK events team."
      );
    }
  }, []);

  return (
    <div>
      <section className="pt-20 pb-8 px-3 sm:px-4 bg-gray-800">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 font-semibold px-4 max-w-3xl mx-auto leading-relaxed">
              Practical planning advice on DJs, lighting, styling, sound and booking — skimmable
              answers from a team with 20+ years in events.
            </p>
          </motion.div>

          {/* Quick jump */}
          <nav
            aria-label="FAQ sections"
            className="mb-10 p-4 sm:p-6 rounded-xl bg-gray-900/80 border border-champagne-gold/20"
          >
            <p className="text-xs font-semibold text-champagne-gold uppercase tracking-wider mb-3 text-center">
              Jump to section
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {FAQ_SECTIONS.map((section) => (
                <a key={section.slug} href={`#${section.slug}`} className={jumpLinkClass}>
                  {section.title}
                </a>
              ))}
            </div>
          </nav>

          {/* Most popular */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Card className="bg-gray-900 border-champagne-gold/40">
              <CardHeader className="p-6 sm:p-8 pb-4">
                <CardTitle className="text-xl sm:text-2xl text-white font-bold">
                  Most Popular Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0">
                <ul className="space-y-3">
                  {MOST_POPULAR_QUESTIONS.map((question) => (
                    <li key={question}>
                      <a
                        href={`#${faqQuestionSlug(question)}`}
                        className="text-champagne-gold hover:text-gold-light font-medium underline underline-offset-2 transition-colors"
                      >
                        {question}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {FAQ_SECTIONS.map((section, sectionIndex) => (
            <motion.div
              key={section.slug}
              id={section.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.05 }}
              className="mb-12 scroll-mt-28"
            >
              <Card className="bg-gray-900 border-champagne-gold/30 mb-8">
                <CardHeader className="p-6 sm:p-8">
                  <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0 space-y-6">
                  {section.items.map((item) => (
                    <FaqItemBlock key={item.question} item={item} />
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center pb-8"
          >
            <p className="text-gray-400 mb-4">
              Still planning? Tell us your date, venue and what you are trying to achieve.
            </p>
            <Link
              href="/contact-us/"
              className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-lg bg-champagne-gold text-gray-900 font-semibold hover:bg-champagne-gold/90 transition-colors"
            >
              Get in touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { motion } from "@/lib/motion";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GoogleReviews from "@/components/GoogleReviews";
import { ExternalLink, MapPin } from "lucide-react";
import { RefinedStar } from "@/components/RefinedStar";
import {
  testimonials,
  type Testimonial,
  TRUSTED_VENUE_NAMES,
  PROOF_THEMES,
  getFeaturedTestimonials,
  getPrioritizedTestimonialFilters,
  matchesTestimonialFilter,
  testimonialKey,
  truncateQuote,
} from "@/data/testimonials";

const LONG_QUOTE_LENGTH = 220;
const FEATURED_EXCERPT_LENGTH = 200;

function getVenueAndLocation(t: Testimonial): { venueName: string; location: string } {
  const venueName = t.venue;
  const location =
    t.venueFilter ?? (t.venue.includes(", ") ? t.venue.split(", ").slice(1).join(", ") : "");
  return { venueName, location };
}

function VenueBlock({ testimonial }: { testimonial: Testimonial }) {
  const { venueName, location } = getVenueAndLocation(testimonial);
  return (
    <div className="border-t border-white/10 pt-4 mt-4">
      <p className="text-champagne-gold font-bold text-[15px] sm:text-lg">{testimonial.author}</p>
      <p className="text-champagne-gold text-[15px] sm:text-base mt-2">
        {testimonial.venueUrl ? (
          <Link
            href={testimonial.venueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-90 transition-opacity underline inline-flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5 text-champagne-gold shrink-0" aria-hidden />
            {venueName}
            <ExternalLink className="w-3 h-3" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-champagne-gold shrink-0" aria-hidden />
            {venueName}
          </span>
        )}
      </p>
      {location && (
        <p className="text-gray-400 text-[14px] sm:text-sm mt-1">{location}</p>
      )}
    </div>
  );
}

export default function TestimonialsClient() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const featuredTestimonials = useMemo(() => getFeaturedTestimonials(), []);
  const featuredKeys = useMemo(
    () => new Set(featuredTestimonials.map(testimonialKey)),
    [featuredTestimonials]
  );

  const venueFilters = useMemo(() => getPrioritizedTestimonialFilters(), []);

  const filteredTestimonials = useMemo(() => {
    const matched = testimonials.filter((t) => matchesTestimonialFilter(t, activeFilter));
    if (activeFilter === "All") {
      return matched.filter((t) => !featuredKeys.has(testimonialKey(t)));
    }
    return matched;
  }, [activeFilter, featuredKeys]);

  const toggleExpanded = (key: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const renderExpandableQuote = (
    testimonial: Testimonial,
    cardKey: string,
    quoteText: string,
    quoteClassName = "text-gray-200 mb-4 leading-relaxed italic text-base sm:text-lg"
  ) => {
    const isLong = quoteText.length > LONG_QUOTE_LENGTH;
    const isExpanded = expandedCards.has(cardKey);

    return (
      <>
        <div className={!isExpanded && isLong ? "min-h-[140px] relative flex-shrink-0" : ""}>
          <div className={!isExpanded && isLong ? "max-h-[100px] overflow-hidden" : ""}>
            <p className={quoteClassName}>&quot;{quoteText}&quot;</p>
          </div>
          {isLong && !isExpanded && (
            <>
              <div
                className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none"
                aria-hidden
              />
              <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1 pt-10">
                <button
                  type="button"
                  onClick={() => toggleExpanded(cardKey)}
                  className="min-h-[48px] flex items-center justify-center px-4 py-3 text-champagne-gold/90 hover:text-champagne-gold text-sm font-medium underline underline-offset-2"
                >
                  Read Full Story
                </button>
              </div>
            </>
          )}
        </div>
        {isLong && isExpanded && (
          <button
            type="button"
            onClick={() => toggleExpanded(cardKey)}
            className="min-h-[48px] flex items-center justify-center px-4 py-3 text-champagne-gold/90 hover:text-champagne-gold text-sm font-medium mb-4 underline underline-offset-2"
          >
            Show less
          </button>
        )}
      </>
    );
  };

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden max-w-full">
        <div className="absolute inset-0 opacity-40 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768731827/Camilla-Richard-0063_ngmblz.jpg"
            alt="Wedding reception with professional lighting design showcasing elegant table settings and ambient lighting at a South West venue"
            className="w-full h-full object-cover object-center brightness-110"
            style={{ objectPosition: "center center" }}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52 pb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Client Reviews &amp; Testimonials
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed px-4 drop-shadow-md">
            Real feedback from weddings, private parties and events across Babington House, country
            estates, castles, marquees and venues throughout the UK.
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-8 px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-y border-champagne-gold/20 max-w-full overflow-x-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <RefinedStar
                    key={star}
                    filled={true}
                    className="w-[18px] h-[18px] text-champagne-gold"
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-white">5.0</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md border border-champagne-gold/30 rounded-lg">
              <span className="text-champagne-gold font-bold text-xl">20+</span>
              <span className="text-gray-300 text-sm">Years Experience</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md border border-champagne-gold/30 rounded-lg">
              <span className="text-champagne-gold font-semibold text-sm">Babington House</span>
              <span className="text-white font-bold text-sm">since 2003</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md border border-champagne-gold/30 rounded-lg">
              <span className="text-champagne-gold font-bold text-xl">{testimonials.length}+</span>
              <span className="text-gray-300 text-sm">Client Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted At Serious Venues */}
      <section className="py-16 px-4 bg-gray-950 border-b border-champagne-gold/10">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted At Serious Venues
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              A selection of estates, castles and private venues where clients have left written
              feedback — wedding DJ reviews, wedding entertainment reviews and event production
              praise from real events.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {TRUSTED_VENUE_NAMES.map(({ name, location }) => (
              <span
                key={name}
                className="px-4 py-2 rounded-full bg-gray-900/80 border border-champagne-gold/25 text-sm text-gray-200"
              >
                <span className="text-champagne-gold font-semibold">{name}</span>
                {location && <span className="text-gray-500"> · {location}</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What Clients Keep Saying */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              What Clients Keep Saying
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Recurring themes from wedding entertainment reviews and private party testimonials
              across our archive.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROOF_THEMES.map((item) => (
              <Card
                key={item.theme}
                className="bg-gray-800/60 border border-champagne-gold/20 h-full"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="text-champagne-gold font-bold text-base mb-3">{item.theme}</h3>
                  <p className="text-gray-300 italic text-sm leading-relaxed flex-grow">
                    &quot;{item.excerpt}&quot;
                  </p>
                  <p className="text-gray-500 text-xs mt-4 pt-4 border-t border-white/10">
                    {item.author} · {item.venue}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured testimonials */}
      {activeFilter === "All" && (
        <section className="py-16 px-4 bg-gray-950/80 border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
                <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">
                  Featured
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                Standout Client Feedback
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Babington House DJ reviews, castle weddings, private parties, lighting and our DJ
                roster — a cross-section before the full archive.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredTestimonials.map((testimonial) => {
                const cardKey = `featured-${testimonialKey(testimonial)}`;
                const isExpanded = expandedCards.has(cardKey);
                const isLong = testimonial.quote.length > LONG_QUOTE_LENGTH;
                const displayQuote =
                  isExpanded || !isLong
                    ? testimonial.quote
                    : truncateQuote(testimonial.quote, FEATURED_EXCERPT_LENGTH);

                return (
                  <Card
                    key={cardKey}
                    className="bg-white/[0.03] backdrop-blur-xl border border-champagne-gold/30 hover:border-champagne-gold/50 transition-all duration-300 h-full"
                  >
                    <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                      <p className="text-gray-200 leading-relaxed italic text-base sm:text-lg mb-4">
                        &quot;{displayQuote}&quot;
                      </p>
                      {isLong && (
                        <button
                          type="button"
                          onClick={() => toggleExpanded(cardKey)}
                          className="text-champagne-gold/90 hover:text-champagne-gold text-sm font-medium underline underline-offset-2 mb-4 self-start"
                        >
                          {isExpanded ? "Show less" : "Read Full Story"}
                        </button>
                      )}
                      <div className="mt-auto">
                        <VenueBlock testimonial={testimonial} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Google Reviews + filters + archive */}
      <section className="py-20 px-4 bg-gray-800 max-w-full overflow-x-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <GoogleReviews maxReviews={5} className="luxury-theme" />
          </motion.div>

          {/* Filters */}
          <div className="mb-8">
            <p className="text-center text-gray-400 text-sm mb-4">
              Filter by venue or region — Babington House, Somerset, London, Wiltshire and more
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {venueFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`min-h-[40px] md:min-h-0 px-4 py-2 md:py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center ${
                    activeFilter === filter
                      ? "bg-champagne-gold/20 border-2 border-champagne-gold text-champagne-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                      : "bg-white/5 border border-champagne-gold/30 text-gray-300 hover:bg-white/10 hover:border-champagne-gold/50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Archive intro */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Full Testimonial Archive
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Browse the full collection of client feedback from weddings, private parties and
              events across the UK — wedding lighting reviews, Babington House DJ reviews and event
              production testimonials included.
            </p>
            {activeFilter !== "All" && (
              <p className="text-champagne-gold/90 text-sm mt-4">
                Showing {filteredTestimonials.length}{" "}
                {filteredTestimonials.length === 1 ? "review" : "reviews"} for{" "}
                <span className="font-semibold">{activeFilter}</span>
              </p>
            )}
          </motion.div>

          {/* Archive grid */}
          <motion.div
            key={`masonry-${activeFilter}`}
            className="testimonials-masonry testimonials-masonry-tidy"
            initial={false}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {filteredTestimonials.map((testimonial, index) => {
              const cardKey = `masonry-${index}-${testimonialKey(testimonial)}`;
              return (
                <motion.div
                  key={cardKey}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.3 }}
                  className="testimonials-masonry-item"
                >
                  <Card
                    className={`bg-white/[0.03] backdrop-blur-md border border-champagne-gold/20 hover:border-champagne-gold/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 h-full max-h-[350px] overflow-hidden ${expandedCards.has(cardKey) ? "!max-h-none" : ""}`}
                  >
                    <CardContent className="p-8 relative flex flex-col">
                      {renderExpandableQuote(testimonial, cardKey, testimonial.quote)}
                      <div className="mt-auto">
                        <VenueBlock testimonial={testimonial} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 md:px-8 bg-gray-950 border-t border-champagne-gold/20 max-w-full overflow-x-hidden">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-champagne-gold/50 bg-gray-800 shadow-xl">
            <CardContent className="p-8 sm:p-10 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Planning a wedding or event?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join couples and hosts who trusted Stylish Entertainment with their celebration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
                  className="min-h-[48px] border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
                >
                  <a href="tel:+447970793177">Call 07970 793177</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

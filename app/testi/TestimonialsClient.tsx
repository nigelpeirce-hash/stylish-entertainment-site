"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useMemo } from "react";
import Link from "next/link";
import GoogleReviews from "@/components/GoogleReviews";
import { ExternalLink, MapPin } from "lucide-react";
import { RefinedStar } from "@/components/RefinedStar";
import { testimonials, type Testimonial, getVenueFiltersFromTestimonials } from "@/data/testimonials";

const LONG_QUOTE_LENGTH = 220; // character threshold for "Read Full Story"
const SPOTLIGHT_COUNT = 3;

/** Derive display venue name and location from testimonial (venue always shown; location from venueFilter or after first comma). */
function getVenueAndLocation(t: Testimonial): { venueName: string; location: string } {
  const venueName = t.venue;
  const location = t.venueFilter ?? (t.venue.includes(", ") ? t.venue.split(", ").slice(1).join(", ") : "");
  return { venueName, location };
}

export default function TestimonialsClient() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleExpanded = (key: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Hand-picked spotlight reviews (first 3 for a consistent hero section)
  const spotlightTestimonials = useMemo(
    () => testimonials.slice(0, SPOTLIGHT_COUNT),
    []
  );

  // Archive = all testimonials except spotlight when filter is "All"
  const regularTestimonials = useMemo(
    () => testimonials.slice(SPOTLIGHT_COUNT),
    []
  );

  // Venue filter options: "All" plus unique filters from testimonials
  const venueFilters = useMemo(
    () => ["All", ...getVenueFiltersFromTestimonials()],
    []
  );

  // Filter testimonials based on active filter
  const filteredTestimonials = useMemo(() => {
    if (activeFilter === "All") {
      // Show all regular testimonials (excluding featured)
      return regularTestimonials;
    } else {
      // When filtering by venue, filter from ALL testimonials (not just regular)
      // Only include testimonials that have a venueFilter matching the active filter
      return testimonials.filter((t) => t.venueFilter === activeFilter);
    }
  }, [activeFilter, regularTestimonials, testimonials]);


  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768731827/Camilla-Richard-0063_ngmblz.jpg"
            alt="Wedding reception with professional lighting design showcasing elegant table settings and ambient lighting at a South West venue"
            className="w-full h-full object-cover object-center brightness-110"
            style={{ objectPosition: 'center center' }}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Wall of Love
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Real reviews from our happy clients
          </p>
        </motion.div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-y border-champagne-gold/20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {/* 5.0 Google Star Rating */}
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

            {/* 20+ Years Experience Badge */}
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md border border-champagne-gold/30 rounded-lg">
              <span className="text-champagne-gold font-bold text-xl">20+</span>
              <span className="text-gray-300 text-sm">Years Experience</span>
            </div>

            {/* Resident DJ Badge */}
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md border border-champagne-gold/30 rounded-lg">
              <span className="text-champagne-gold font-semibold text-sm">Resident at</span>
              <span className="text-white font-bold">Babington House</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/20">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Client Reviews</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              What Our <span className="text-gradient">Clients Say</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 mb-6">
              Don't just take our word for it - hear from couples and clients who have experienced our services
            </p>
          </motion.div>

          {/* Google Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <GoogleReviews maxReviews={5} className="luxury-theme" />
          </motion.div>

          {/* Google Summary Card – directly above venue filter buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-4 px-4 py-3 sm:px-6 sm:py-4 bg-gray-900/60 backdrop-blur-sm border border-champagne-gold/30 rounded-xl shadow-[0_0_24px_rgba(212,175,55,0.12)]">
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-6 h-6 shrink-0"
                aria-hidden
              />
              <div className="flex gap-0.5 shrink-0">
                {[1, 2, 3, 4, 5].map((star) => (
                  <RefinedStar
                    key={star}
                    filled={true}
                    className="w-[18px] h-[18px] text-champagne-gold"
                  />
                ))}
              </div>
              <span className="text-sm sm:text-base font-semibold text-white whitespace-nowrap">
                159+ Five-Star Reviews on Google
              </span>
            </div>
          </motion.div>

          {/* Venue Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {venueFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-champagne-gold/20 border-2 border-champagne-gold text-champagne-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    : "bg-white/5 border border-champagne-gold/30 text-gray-300 hover:bg-white/10 hover:border-champagne-gold/50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Spotlight: 3 hand-picked reviews – only when filter is "All" */}
          {activeFilter === "All" && (
            <motion.div
              className="flex flex-col md:flex-row gap-6 md:gap-8 mb-20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              {spotlightTestimonials.map((testimonial, index) => {
                const { venueName, location } = getVenueAndLocation(testimonial);
                return (
                <motion.div
                  key={`spotlight-${index}-${testimonial.author}-${testimonial.venue}`}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                  className="flex-1 min-w-0"
                >
                  <Card className="h-full bg-white/[0.03] backdrop-blur-xl border border-champagne-gold/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300">
                    <CardContent className="p-8">
                      <p className="text-gray-200 mb-4 leading-relaxed italic text-xl">
                        &quot;{testimonial.quote}&quot;
                      </p>
                      <div className="border-t border-white/10 pt-4">
                        <p className="text-champagne-gold font-bold text-base sm:text-lg">
                          {testimonial.author}
                        </p>
                        <div className="border-t border-white/10 pt-4 mt-4">
                          <p className="text-champagne-gold text-sm sm:text-base flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-champagne-gold shrink-0" aria-hidden />
                            {testimonial.venueUrl ? (
                              <Link
                                href={testimonial.venueUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-90 transition-opacity underline flex items-center gap-1"
                              >
                                {venueName}
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            ) : (
                              venueName
                            )}
                          </p>
                          {location && (
                            <p className="text-gray-400 text-xs sm:text-sm mt-1">
                              {location}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Archive: Tidy masonry grid – uniform cards, fade + Read Full Story */}
          <motion.div
            key={`masonry-${activeFilter}`}
            className="testimonials-masonry testimonials-masonry-tidy"
            initial="hidden"
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
              const cardKey = `masonry-${index}-${testimonial.author}-${testimonial.venue}`;
              const isLong = testimonial.quote.length > LONG_QUOTE_LENGTH;
              const isExpanded = expandedCards.has(cardKey);
              const { venueName, location } = getVenueAndLocation(testimonial);
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
                <Card className={`bg-white/[0.03] backdrop-blur-md border border-champagne-gold/20 hover:border-champagne-gold/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 h-full max-h-[350px] overflow-hidden ${isExpanded ? "!max-h-none" : ""}`}>
                  <CardContent className="p-8 relative flex flex-col">
                    {/* Only the quote is collapsible; venue block stays visible */}
                    <div className={!isExpanded && isLong ? "min-h-[140px] relative flex-shrink-0" : ""}>
                      <div className={!isExpanded && isLong ? "max-h-[100px] overflow-hidden" : ""}>
                        <p className="text-gray-200 mb-4 leading-relaxed italic text-base sm:text-lg">
                          &quot;{testimonial.quote}&quot;
                        </p>
                      </div>
                      {isLong && !isExpanded && (
                        <>
                          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none" aria-hidden />
                          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1 pt-10">
                            <button
                              type="button"
                              onClick={() => toggleExpanded(cardKey)}
                              className="text-champagne-gold/90 hover:text-champagne-gold text-sm font-medium underline underline-offset-2"
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
                        className="text-champagne-gold/90 hover:text-champagne-gold text-sm font-medium mb-4 underline underline-offset-2"
                      >
                        Show less
                      </button>
                    )}
                    {/* Venue block always visible below client name */}
                    <div className="border-t border-white/10 pt-4 mt-auto">
                      <p className="text-champagne-gold font-bold text-base sm:text-lg">
                        {testimonial.author}
                      </p>
                      <div className="border-t border-white/10 pt-4 mt-4">
                        <p className="text-champagne-gold text-sm sm:text-base flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-champagne-gold shrink-0" aria-hidden />
                          {testimonial.venueUrl ? (
                            <Link
                              href={testimonial.venueUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:opacity-90 transition-opacity underline flex items-center gap-1"
                            >
                              {venueName}
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          ) : (
                            venueName
                          )}
                        </p>
                        {location && (
                          <p className="text-gray-400 text-xs sm:text-sm mt-1">
                            {location}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

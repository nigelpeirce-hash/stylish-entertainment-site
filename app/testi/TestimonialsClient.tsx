"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import GoogleReviews from "@/components/GoogleReviews";
import { Star, ExternalLink } from "lucide-react";
import { testimonials, type Testimonial } from "@/data/testimonials";

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type VenueFilter = "All" | "Babington House" | "London" | "Somerset" | "Wiltshire";

export default function TestimonialsClient() {
  const [activeFilter, setActiveFilter] = useState<VenueFilter>("All");
  const [shuffledTestimonials, setShuffledTestimonials] = useState(testimonials);
  const [featuredTestimonials, setFeaturedTestimonials] = useState<Testimonial[]>([]);

  // Select 3 random featured testimonials only on client after hydration
  useEffect(() => {
    const shuffled = shuffleArray([...testimonials]);
    setFeaturedTestimonials(shuffled.slice(0, 3));
  }, []);

  // Get regular testimonials (excluding featured)
  const regularTestimonials = useMemo(() => {
    if (featuredTestimonials.length === 0) {
      // On initial render (server), return all testimonials to avoid hydration mismatch
      return testimonials;
    }
    return testimonials.filter((t) => !featuredTestimonials.includes(t));
  }, [featuredTestimonials]);

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

  useEffect(() => {
    // Shuffle regular testimonials after component mounts on client
    setShuffledTestimonials(shuffleArray(regularTestimonials));
  }, [regularTestimonials]);

  const venueFilters: VenueFilter[] = ["All", "Babington House", "London", "Somerset", "Wiltshire"];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162627/Camilla-Richard-0063_mctrmo.jpg"
            alt="Wedding reception with professional lighting design showcasing elegant table settings and ambient lighting at a West Country venue"
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
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-champagne-gold text-champagne-gold" />
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

          {/* Featured Testimonials (2 columns on desktop) - Only show after hydration and when filter is "All" */}
          {featuredTestimonials.length > 0 && activeFilter === "All" && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {featuredTestimonials.map((testimonial, index) => (
              <motion.div
                key={`featured-${index}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
                className="md:col-span-1"
              >
                <Card className="bg-gray-900/50 backdrop-blur-sm border-champagne-gold/20 hover:border-champagne-gold/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 h-full">
                  <CardContent className="p-6 sm:p-8">
                    <p className="text-champagne-gold mb-4 leading-relaxed italic text-lg sm:text-xl md:text-2xl font-medium">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <div className="border-t border-champagne-gold/20 pt-4">
                      <p className="text-white font-semibold text-base sm:text-lg">
                        {testimonial.author}
                      </p>
                      <p className="text-gray-300 text-sm sm:text-base mt-1 flex items-center gap-2">
                        {testimonial.venueUrl ? (
                          <>
                            <Link
                              href={testimonial.venueUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-champagne-gold transition-colors underline flex items-center gap-1"
                            >
                              {testimonial.venue}
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </>
                        ) : (
                          testimonial.venue
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              ))}
            </motion.div>
          )}

          {/* Masonry Grid for Regular Testimonials */}
          <style dangerouslySetInnerHTML={{__html: `
            .testimonials-masonry {
              column-count: 1;
              column-gap: 1.5rem;
            }
            @media (min-width: 768px) {
              .testimonials-masonry {
                column-count: 2;
              }
            }
            @media (min-width: 1024px) {
              .testimonials-masonry {
                column-count: 3;
              }
            }
            .testimonials-masonry-item {
              break-inside: avoid;
              page-break-inside: avoid;
              margin-bottom: 1.5rem;
            }
          `}} />
          <motion.div 
            key={`masonry-${activeFilter}`}
            className="testimonials-masonry"
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
            {filteredTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.author}-${testimonial.venue}-${index}`}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.3 }}
                className="testimonials-masonry-item"
              >
                    <Card className="bg-gray-900/50 backdrop-blur-sm border-champagne-gold/20 hover:border-champagne-gold/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 h-full">
                      <CardContent className="p-6 sm:p-8">
                        <p className="text-gray-200 mb-4 leading-relaxed italic text-base sm:text-lg">
                          &quot;{testimonial.quote}&quot;
                        </p>
                        <div className="border-t border-champagne-gold/20 pt-4">
                          <p className="text-champagne-gold font-semibold text-sm sm:text-base">
                            {testimonial.author}
                          </p>
                          <p className="text-gray-400 text-xs sm:text-sm mt-1 flex items-center gap-2">
                            {testimonial.venueUrl ? (
                              <Link
                                href={testimonial.venueUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-champagne-gold transition-colors underline flex items-center gap-1"
                              >
                                {testimonial.venue}
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            ) : (
                              testimonial.venue
                            )}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

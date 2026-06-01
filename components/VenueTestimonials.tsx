"use client";

import { useMemo } from "react";
import {
  testimonials,
  getTestimonialsForVenuePage,
  getTestimonialsByVenueFilter,
  truncateQuote,
} from "@/data/testimonials";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "@/lib/motion";
import { RefinedStar } from "@/components/RefinedStar";

interface VenueTestimonialsProps {
  venueName: string;
  /** Optional slug for reusable venue-page matching (e.g. babington-house, mells-barn). */
  venueSlug?: string;
}

export default function VenueTestimonials({ venueName, venueSlug }: VenueTestimonialsProps) {
  const filtered = useMemo(() => {
    if (venueSlug) {
      const fromSlug = getTestimonialsForVenuePage(venueSlug, 6);
      if (fromSlug.length > 0) return fromSlug.slice(0, 3);
    }

    const byFilter = getTestimonialsByVenueFilter(venueName, 3);
    if (byFilter.length > 0) return byFilter;

    const byVenueName = testimonials.filter(
      (t) => t.venue.includes(venueName) || t.venueFilter === venueName
    );
    if (byVenueName.length > 0) return byVenueName.slice(0, 3);

    return testimonials.slice(0, 3);
  }, [venueName, venueSlug]);

  return (
    <section className="py-16 bg-gray-900/50 rounded-3xl border border-champagne-gold/20 my-12 px-6">
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
          What couples say about us at {venueName}
        </h3>
        <div className="flex justify-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <RefinedStar
              key={s}
              filled={true}
              className="w-[14px] h-[14px] text-champagne-gold"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t, i) => (
          <motion.div
            key={`${t.author}-${t.venue}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-gray-800 border-none h-full">
              <CardContent className="p-6">
                <p className="text-gray-300 italic mb-4">
                  &quot;{truncateQuote(t.quote, 280)}&quot;
                </p>
                <p className="text-champagne-gold font-semibold">{t.author}</p>
                <p className="text-gray-500 text-sm mt-1">{t.venue}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

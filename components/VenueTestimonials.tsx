"use client";

import { useMemo } from 'react';
import { testimonials } from '@/data/testimonials';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface VenueTestimonialsProps {
  venueName: string; // e.g., "Babington House"
}

export default function VenueTestimonials({ venueName }: VenueTestimonialsProps) {
  const filtered = useMemo(() => {
    // Filter by the venueFilter property we added earlier
    const matching = testimonials.filter(t => t.venueFilter === venueName);
    
    // If we have matching reviews, return them. 
    // Otherwise, return 3 high-quality general reviews as a fallback.
    return matching.length > 0 ? matching : testimonials.slice(0, 3);
  }, [venueName]);

  return (
    <section className="py-16 bg-gray-900/50 rounded-3xl border border-champagne-gold/20 my-12 px-6">
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
          What couples say about us at {venueName}
        </h3>
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-5 h-5 fill-champagne-gold text-champagne-gold" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-gray-800 border-none h-full">
              <CardContent className="p-6">
                <p className="text-gray-300 italic mb-4">"{t.quote}"</p>
                <p className="text-champagne-gold font-semibold">{t.author}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

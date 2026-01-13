"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogPostBristolSpringBall() {
  useEffect(() => {
    document.title = "Bristol University Spring Ball | Stylish Entertainment Blog";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "STYLISH Entertainment designed and implemented lighting and sound for the Bristol University Spring Ball at Kings Weston House, transforming the venue for 750 law students.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg"
            alt="Bristol University Spring Ball at Kings Weston House"
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
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-32 md:pt-40"
        >
          <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/20">
            <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Blog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Bristol University Spring Ball
          </h1>
        </motion.div>
      </section>

      {/* Blog Content */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <Card className="bg-gray-900 border-champagne-gold/30">
              <CardContent className="p-6 sm:p-8 md:p-12">
                <div className="text-gray-300 leading-relaxed space-y-6">
                  <p className="text-lg">
                    Kings Weston House in Bristol is a unique venue, we were asked by the Bristol University Spring Ball committee to design and implement lighting and sound for their recent spring ball. Over 750 law students gathered at the end of their year to celebrate and let their hair down.
                  </p>

                  <p>
                    We decorated three dining rooms with our fairy light canopy and round shades which reduced the ceiling height and made the space much more intimate and magical.
                  </p>

                  <p>
                    We decorated six rooms in total including a large marquee in the grounds. A fabulous event to work on and we can report back that with 750 enthusiastic law students all went well with no law suits imminent!
                  </p>

                  <div className="my-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg"
                          alt="Combination of curtain lighting and bannister fairy-lights with foliage at Kings Weston House"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg"
                          alt="Combination of fairy-light canopy with shades and pink window up-lighting at Bristol University Spring Ball"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 italic">Combination of Curtain lighting and bannister fairy-lights with foliage</p>
                    <p className="text-sm text-gray-400 italic mt-2">Combination of fairy-light canopy with shades and Pink window up-lighting</p>
                  </div>

                  <div className="my-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg"
                          alt="A trapeze artist performing in the atrium of Kings Weston House during the Bristol University Spring Ball"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg"
                          alt="Dancing with hands in the air action at Bristol University Spring Ball"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 italic">A trapeze artist performing in the atrium of Kings Weston House</p>
                    <p className="text-sm text-gray-400 italic mt-2">Dancing with hands in the air action</p>
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-700">
                    <p className="text-lg">
                      For any queries on event lighting and sound design, feel free to{" "}
                      <Link href="/contact-us" className="text-champagne-gold hover:text-gold-light underline">
                        contact us
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

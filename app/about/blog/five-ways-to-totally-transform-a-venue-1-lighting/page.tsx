"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogPostLighting() {
  useEffect(() => {
    document.title = "Five Ways to Totally Transform a Venue #1 Lighting | Stylish Entertainment Blog";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Discover how lighting can transform your wedding venue. From fairy lights to LED uplighting, explore creative lighting design ideas from STYLISH Entertainment.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162661/Exterior-LED-mood-Lighting_jjuuar.jpg"
            alt="Venue lighting transformation"
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
            Five Ways to Totally Transform a Venue #1 Lighting
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
                    Five ways to totally transform a venue…..
                  </p>

                  <h2 className="text-3xl md:text-4xl font-bold text-champagne-gold mb-4">Lighting</h2>

                  <p>
                    The world of weddings is breaking away from tradition, moving beyond the boundaries of a church or registry office and function room reception, with couples now able to experiment with spaces to host their ceremony and reception, posing new decor challenges.
                  </p>

                  <p>
                    At STYLISH we believe that any space can be transformed with a little bit of creative magic. We&apos;ve worked with many venues, both traditional and unusual that are simply not wedding ready in their naked form. From quaint little village halls in the deepest Somerset countryside, marquees, hotels and even a stable, decor is as essential to your wedding as the happy couple!
                  </p>

                  <p>
                    There&apos;s so much that can be done to transform a space from the everyday to the extra special. With advice from our expert team of creatives, including decor specialists and DJ&apos;s, we&apos;ve put together a series of blogs revealing our guide to decor that will absolutely transform any space, giving you freedom to design a space that&apos;s unique to you.
                  </p>

                  <p>
                    This week we&apos;re showcasing our beautiful range of lighting design.
                  </p>

                  <p>
                    Lighting is one of the most popular design elements in wedding venue decoration, due to it&apos;s simple yet transformative effect on a space, both indoor and outdoor.
                  </p>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">Light and Shade Tree Lighting</h2>
                    <p className="mb-4">
                      The Light and Shade style is a huge hit with many of our clients, as the shades, which glow bright white in the day and a warm yellow in the evening, are hung elegantly around a tree or canopy, and create a beautiful backdrop for photos. They are adaptable to space and can be used with festoon or fairy lights to create a modern, minimalist look, perfect for those Instagram moments.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162627/Camilla-Richard-0063_mctrmo.jpg"
                          alt="Light and Shade tree lighting creating a beautiful backdrop for wedding photos"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162627/Camilla-Richard-0063_mctrmo.jpg"
                          alt="Light and Shade tree lighting with happy bride and groom"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 italic">A stunning shot from Brett Harkness Photography of our Light and Shade Tree Lighting</p>
                    <p className="text-sm text-gray-400 italic mt-2">Light and Shade Tree Lighting with a happy bride & groom</p>
                  </div>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">Fairy Lights</h2>
                    <p className="mb-4">
                      Another classic option, which can be installed in many different designs creating a number of different light effects for both indoor and outdoor settings. Canopies are a popular option for covering ceilings or in barns to give a warm intimate feeling great for dining room decor. Larger festoon lights are also available and can be used to guide the way up the aisle or create paths and outdoor canopies with a stronger light.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768169246/Fairy%20Light%20Tunnel%20at%20Babington%20House.jpg"
                          alt="The Coach House at Pennard House with a Stylish fairy-light canopy"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768169246/Fairy%20Light%20Tunnel%20at%20Babington%20House.jpg"
                          alt="The Orangery at Babington House with our fairy-light canopy"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 italic mb-4">The Coach House at Pennard House with a Stylish Fairy-light canopy</p>
                    <p className="text-sm text-gray-400 italic mb-4">The Orangery at Babington House with our fairy-light canopy</p>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg my-6">
                      <img
                        src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768169246/Fairy%20Light%20Tunnel%20at%20Babington%20House.jpg"
                        alt="Wick Farm near Bath wedding barn venue with Star Burst canopy created with white cable"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-sm text-gray-400 italic">Wick Farm near Bath is a beautiful wedding barn venue, we created this Star Burst canopy with white cable.</p>
                  </div>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">Uplighting / Mood Lighting</h2>
                    <p className="mb-4">
                      Uplighting is another amazing way to disguise a room, buy changing the colour and creating an atmosphere with mood lighting. From dance floors, to art installations, LED strips create a dramatic glow. Dressing your venue to impress has never been easier.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163524/Amber-LED-Mood-lighting_zuiexc.jpg"
                          alt="Violet LED up-lighting in the bar at Babington House Hotel"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163745/Pool-Party01_qe5ro0.jpg"
                          alt="Swimming Pool with added Cocktail Bar, Lighting, Shades and LED Furniture"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 italic mb-4">This is Violet LED up-lighting in the bar at Babington House Hotel.</p>
                    <p className="text-sm text-gray-400 italic mb-4">Swimming Pool with added Cocktail Bar, Lighting, Shades and LED Furniture.</p>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg my-6">
                      <img
                        src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163524/Amber-LED-Mood-lighting_zuiexc.jpg"
                        alt="Red up and down lighting with an 11 metre mirrored table top creating a dramatic atmosphere"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-sm text-gray-400 italic">We created this look with red up and down lighting and an 11 metre mirrored table top!</p>
                  </div>

                  <div className="my-8 p-6 bg-gray-800/50 rounded-lg border border-champagne-gold/20">
                    <p className="mb-4">
                      Our STYLISH range of lighting is available for hire, including delivery and installment at your venue by our professional team. For the full gallery of our lighting head to{" "}
                      <Link href="/weddings/wedding-lighting" className="text-champagne-gold hover:text-gold-light underline">
                        wedding lighting hire
                      </Link>
                    </p>
                    <p>
                      Next week, we&apos;ll be showcasing Venue Dressing as part of our decor series.
                    </p>
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-700">
                    <p className="text-lg">
                      For any queries on lighting design, feel free to{" "}
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

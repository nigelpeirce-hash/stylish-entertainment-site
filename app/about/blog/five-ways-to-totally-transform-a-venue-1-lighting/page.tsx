"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import BlogImage from "@/components/BlogImage";

export default function BlogPostLighting() {
  useEffect(() => {
    document.title = "Five Ways to Totally Transform a Venue #1 Lighting | Stylish Entertainment Blog";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Discover how lighting can transform any venue for weddings, parties, and corporate events. From fairy lights to LED uplighting, explore creative lighting design ideas from STYLISH Entertainment.");
    }
  }, []);

  // Collect all images for lightbox navigation
  const allImages = useMemo(() => [
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163068/Wedding-Tree-Lighting_ewqmh6.jpg", alt: "Light and Shade tree lighting creating a beautiful backdrop for events and photos" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163271/wedding-tree-lighting-2-e1510835516724_f1fant.jpg", alt: "Light and Shade tree lighting creating an elegant atmosphere for events" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162589/Light-and-Shade-KV_counyg.jpg", alt: "Light and Shade tree lighting with elegant shades creating a magical atmosphere" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162640/Smedmore-House-Dorset-Tree-Lighting-e1499338525247_trnxzr.jpg", alt: "Light and Shade tree lighting at Smedmore House, Dorset" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162939/Fairy-light-Canopy_vc1rkd.jpg", alt: "Fairy light canopy creating a warm and intimate atmosphere" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162570/Fairy-canopy-9_ytbop0.jpg", alt: "Elegant fairy light canopy installation for events" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163754/Pine-fairy-01_k7y1nh.jpg", alt: "Pine fairy light installation creating a magical atmosphere" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162637/Fairy-canopy-6-e1444840616907_lv3ncz.jpg", alt: "Fairy light canopy design for weddings, parties, and corporate events" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162262/Kin-House-LED-up-lighting_fr3ypq.jpg", alt: "Kin House LED up-lighting creating a dramatic atmosphere" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163392/Mells_Barn_LED_lighting-transformed-e1698060379974_geh36y.jpg", alt: "Mells Barn transformed with LED lighting" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162636/IMG_8030_b5un4j.jpg", alt: "LED up-lighting creating dramatic mood lighting for events" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163677/Babington-Bar-Violet_xc3jsd.jpg", alt: "Violet LED up-lighting in the bar at Babington House Hotel" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162621/Babington-House-in-Green_oms0ws.jpg", alt: "Babington House transformed with green LED mood lighting" },
  ], []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163745/Pool-Party01_qe5ro0.jpg"
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
                    Whether you&apos;re planning a wedding, corporate event, or private party, the venue you choose often needs transformation to create the perfect atmosphere. Modern events are breaking away from traditional spaces, with clients experimenting with unique locations - from converted barns and marquees to hotels, village halls, and even stables - all of which present exciting decor opportunities.
                  </p>

                  <p>
                    At STYLISH we believe that any space can be transformed with a little bit of creative magic. We&apos;ve worked with many venues, both traditional and unusual, that need styling to create the right atmosphere for your event. From quaint village halls in the deepest Somerset countryside, marquees, hotels, and corporate spaces, lighting and decor are essential to creating an unforgettable experience for your guests.
                  </p>

                  <p>
                    There&apos;s so much that can be done to transform a space from the everyday to the extra special. With advice from our expert team of creatives, including decor specialists and DJ&apos;s, we&apos;ve put together a series of blogs revealing our guide to decor that will absolutely transform any space, giving you freedom to design a space that&apos;s unique to you.
                  </p>

                  <p>
                    This week we&apos;re showcasing our beautiful range of lighting design.
                  </p>

                  <p>
                    Lighting is one of the most popular design elements for transforming any venue, due to its simple yet transformative effect on a space, both indoor and outdoor. Whether you&apos;re hosting a wedding, corporate gala, or private party, the right lighting can completely change the mood and atmosphere of your event.
                  </p>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">Light and Shade Tree Lighting</h2>
                    <p className="mb-4">
                      The Light and Shade style is a huge hit with many of our clients, as the shades, which glow bright white in the day and a warm yellow in the evening, are hung elegantly around a tree or canopy, and create a beautiful backdrop for photos and events. They are adaptable to space and can be used with festoon or fairy lights to create a modern, minimalist look, perfect for weddings, parties, and corporate events alike.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163068/Wedding-Tree-Lighting_ewqmh6.jpg"
                          alt="Light and Shade tree lighting creating a beautiful backdrop for events and photos"
                          images={allImages}
                          index={0}
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163271/wedding-tree-lighting-2-e1510835516724_f1fant.jpg"
                          alt="Light and Shade tree lighting creating an elegant atmosphere for events"
                          images={allImages}
                          index={1}
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162589/Light-and-Shade-KV_counyg.jpg"
                          alt="Light and Shade tree lighting with elegant shades creating a magical atmosphere"
                          images={allImages}
                          index={2}
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162640/Smedmore-House-Dorset-Tree-Lighting-e1499338525247_trnxzr.jpg"
                          alt="Light and Shade tree lighting at Smedmore House, Dorset"
                          images={allImages}
                          index={3}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 italic">Light and Shade Tree Lighting creating beautiful backdrops for weddings, parties, and corporate events</p>
                  </div>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">Fairy Lights</h2>
                    <p className="mb-4">
                      Another classic option, which can be installed in many different designs creating a number of different light effects for both indoor and outdoor settings. Canopies are a popular option for covering ceilings or in barns to give a warm intimate feeling great for dining areas, reception spaces, and corporate event settings. Larger festoon lights are also available and can be used to guide guests along pathways, create entrance features, or build outdoor canopies with a stronger light - perfect for weddings, parties, and corporate events.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162939/Fairy-light-Canopy_vc1rkd.jpg"
                          alt="Fairy light canopy creating a warm and intimate atmosphere"
                          images={allImages}
                          index={4}
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162570/Fairy-canopy-9_ytbop0.jpg"
                          alt="Elegant fairy light canopy installation for events"
                          images={allImages}
                          index={5}
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163754/Pine-fairy-01_k7y1nh.jpg"
                          alt="Pine fairy light installation creating a magical atmosphere"
                          images={allImages}
                          index={6}
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162637/Fairy-canopy-6-e1444840616907_lv3ncz.jpg"
                          alt="Fairy light canopy design for weddings, parties, and corporate events"
                          images={allImages}
                          index={7}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 italic">Fairy light canopies creating beautiful atmospheres for weddings, parties, and corporate events</p>
                  </div>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">Uplighting / Mood Lighting</h2>
                    <p className="mb-4">
                      Uplighting is another amazing way to transform a room, by changing the colour and creating an atmosphere with mood lighting. From dance floors to art installations, LED strips create a dramatic glow perfect for weddings, parties, and corporate events. Whether you want to create a sophisticated corporate atmosphere, a romantic wedding setting, or an energetic party vibe, dressing your venue to impress has never been easier.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162262/Kin-House-LED-up-lighting_fr3ypq.jpg"
                          alt="Kin House LED up-lighting creating a dramatic atmosphere"
                          images={allImages}
                          index={8}
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163392/Mells_Barn_LED_lighting-transformed-e1698060379974_geh36y.jpg"
                          alt="Mells Barn transformed with LED lighting"
                          images={allImages}
                          index={9}
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162636/IMG_8030_b5un4j.jpg"
                          alt="LED up-lighting creating dramatic mood lighting for events"
                          images={allImages}
                          index={10}
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163677/Babington-Bar-Violet_xc3jsd.jpg"
                          alt="Violet LED up-lighting in the bar at Babington House Hotel"
                          images={allImages}
                          index={11}
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:col-span-2 max-w-3xl mx-auto">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162621/Babington-House-in-Green_oms0ws.jpg"
                          alt="Babington House transformed with green LED mood lighting"
                          images={allImages}
                          index={12}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 italic">LED up-lighting and mood lighting transforming venues for weddings, parties, and corporate events</p>
                  </div>

                  <div className="my-8 p-6 bg-gray-800/50 rounded-lg border border-champagne-gold/20">
                    <p className="mb-4">
                      Our STYLISH range of lighting is available for hire, including delivery and installation at your venue by our professional team. Perfect for weddings, parties, and corporate events, our lighting solutions can transform any space. For the full gallery of our lighting designs, head to{" "}
                      <Link href="/services/lighting-design" className="text-champagne-gold hover:text-gold-light underline">
                        lighting design services
                      </Link>
                      {" "}or{" "}
                      <Link href="/parties/party-lighting" className="text-champagne-gold hover:text-gold-light underline">
                        party lighting
                      </Link>
                      .
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

"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import LazyIframe from "@/components/LazyIframe";
import BlogImage from "@/components/BlogImage";

export default function BlogPostDecor() {
  useEffect(() => {
    document.title = "Five Ways to Totally Transform a Venue #2 Decor | Stylish Entertainment Blog";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Discover how decor can transform your wedding venue. From Middle Eastern themes to circus tents, explore creative venue styling ideas from STYLISH Entertainment.");
    }
  }, []);

  // Collect all images for lightbox navigation
  const allImages = useMemo(() => [
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163673/455_yjyind.jpg", alt: "Middle Eastern style venue decor with red satin drapes, sofas, and bohemian eastern styling" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163738/Circus-Temed-Party-Tent_uizqbq.jpg", alt: "13m x 7m circus tent installation inside the Orangery at Babington House with red and white satin fabric" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163745/Pool-Party01_qe5ro0.jpg", alt: "Pool party decor with LED furniture and LED uplighting creating a vibrant atmosphere" },
  ], []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162661/Exterior-LED-mood-Lighting_jjuuar.jpg"
            alt="Venue decor and styling transformation"
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
            Five Ways to Totally Transform a Venue #2 Decor
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
                    In this blog series &apos;5 ways to totally transform a venue&apos;, we are exploring the essential details of wedding venue styling and atmosphere, from lighting and music to fabric and flowers. Last week we looked at an array of stunning lighting offered by STYLISH Entertainment, and are now shifting our focus to decor, and the way it can be used alongside lighting to create a picture perfect wedding venue.
                  </p>

                  <p>
                    Depending on the look you would like to achieve in your venue, there are many decor options available for venue styling. Some of our favourite projects include winter wonderland, circus party and a Middle Eastern paradise as well as the use of specialist furniture to give an extra decorative feel.
                  </p>

                  <p>
                    We use beautiful fabrics to create drapes that change the shape of a venue and create an intimate feel, transporting people from the reality of a function room to a fantastical world.
                  </p>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">Middle Eastern Style Theme</h2>
                    <p className="mb-4">
                      This Middle Eastern style theme incorporates the use of soft furnishings including red satin style drapes and furniture like the sofas, chaise lounges and cushions. Other props such as faux palm trees, lanterns and shisha pipes contributed to the creation of this cool chill out area in a bohemian eastern style. Lighting was also key in addition to decor to create the warm red glow.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163673/455_yjyind.jpg"
                          alt="Middle Eastern style venue decor with red satin drapes, sofas, and bohemian eastern styling"
                          images={allImages}
                          index={0}
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163673/455_yjyind.jpg"
                          alt="Middle Eastern themed venue with lanterns, palm trees, and warm red lighting"
                          images={allImages}
                          index={0}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">Circus Tent Project</h2>
                    <p className="mb-4">
                      One of our biggest projects to date was the creation of a 13m x 7m circus tent for a circus themed party, installed in the Orangery at Babington House. This detailed project saw Ali, our decor superstar tasked with the hand creation of said tent. Armed with over 300m of red and white satin style fabric, Ali set to work sewing together this huge tent. It turned out that that was the easy bit compared to erecting the tent inside the venue. The relief was palpable when it was successfully up, with every stripe matched and stitched to perfection.
                    </p>
                    <div className="my-6">
                      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-700">
                        <LazyIframe
                          src="https://www.youtube.com/embed/Nmc1Y_pzWbE"
                          title="Circus tent installation at Babington House"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <p className="text-sm text-gray-400 mt-2 italic">Circus tent installation video</p>
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg my-6">
                      <BlogImage
                        src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163738/Circus-Temed-Party-Tent_uizqbq.jpg"
                        alt="13m x 7m circus tent installation inside the Orangery at Babington House with red and white satin fabric"
                        images={allImages}
                        index={1}
                      />
                    </div>
                    <p className="text-sm text-gray-400 italic">A peek inside the circus tent</p>
                  </div>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">LED Furniture & Fire Pits</h2>
                    <p className="mb-4">
                      Another popular option for venue styling is the use of furniture and accessory hire items such as LED furniture or fire pits.
                    </p>
                    <div className="my-6">
                      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-700">
                        <LazyIframe
                          src="https://www.youtube.com/embed/sDXBCwhMMkM"
                          title="LED furniture and fire pit styling"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                    <p className="mb-4">
                      LED furniture is a perfect accompaniment to LED uplighting as can be seen in this Pool Party decor, while hire accessories such as fire pits are a great idea for outdoor spaces, alongside outdoor seating such as hay bales or chill out areas to create a social alfresco feel.
                    </p>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg my-6">
                      <BlogImage
                        src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163745/Pool-Party01_qe5ro0.jpg"
                        alt="Pool party decor with LED furniture and LED uplighting creating a vibrant atmosphere"
                        images={allImages}
                        index={2}
                      />
                    </div>
                  </div>

                  <div className="my-8 p-6 bg-gray-800/50 rounded-lg border border-champagne-gold/20">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">Health & Safety</h2>
                    <p>
                      It&apos;s absolutely imperative to factor health and safety into venue dressing, which is something that DIY jobs often don&apos;t consider. All our professional materials are made from high quality flame retardant contract fabric. We hold Public Liability Insurance, and Employee Liability Insurance and have training in all relevant safety procedures.
                    </p>
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-700">
                    <p className="text-lg">
                      For any queries on venue styling and decor, feel free to{" "}
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

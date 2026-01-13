"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const outsidePhotos = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162291/Pennard-House-Lighting-with-Amber-Up-lighting_ztldmo.jpg",
    alt: "Amber up-lighting with Festoon and Fairy-light across the Coach House exterior at Pennard House",
    description: "Amber up-lighting with Festoon and Fairy-light across the Coach House exterior.",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162614/Pennard-House-Coach-House-with-Festoon-Lighting-Canopy_swzbdx.jpg",
    alt: "A stunning Festoon Lighting Canopy at Pennard House in Somerset",
    description: "A stunning Festoon Lighting Canopy at Pennard House in Somerset",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162533/Pennard-House-Coach-House-Lighting_yjdues.jpg",
    alt: "Fairy Light Canopy with optional shades at Pennard House",
    description: "Fairy Light Canopy with optional shades",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162498/Pennard-House-Festoon-Pizzarova_iwgkvm.jpg",
    alt: "Festoon and Fairy rigged from the Coach House to the flower beds opposite at Pennard House",
    description: "Festoon and Fairy rigged from the Coach House to the flower beds opposite.",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162671/Pennard-House_skxuop.jpg",
    alt: "Festoon and Fairy Lights with additional LED Up-lighting at Pennard House",
    description: "Festoon and Fairy Lights with additional LED Up-lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163121/Pennard-House-Somerset-Festoon-Lighting-Hire-for-a-wedding-e1675176362931_zjcxct.jpg",
    alt: "The Full Monty lighting design at Pennard House, Somerset",
    description: "The Full Monty lighting design at Pennard House, Somerset",
  },
];

const insidePhotos = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163320/Fairy-light-Canopy-Pennard-House_bjuqnx.jpg",
    alt: "Fairy light canopy at Pennard House Coach House interior",
    description: "Fairy Light Canopy with optional shades",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162494/Pennard-House-Somerset-with-Festoon-Bulb-Canopy_p2x4sz.jpg",
    alt: "Traditional festoon lighting canopy at Pennard House",
    description: "Our traditional festoon lighting canopy",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162964/Pennard-House-Vintage-Festoon-with-Ivy-wrap_izutpp.jpg",
    alt: "Pennard House with Vintage Festoon bulbs with an ivy wrap",
    description: "Pennard House. Vintage Festoon bulbs with an ivy wrap.",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162390/Pennard-House-with-Vintage-Edison-and-Ivy-wrap0_iseaka.jpg",
    alt: "Pennard House with a run of Edison Vintage Festoon down the centre of each table and Ivy wrap",
    description: "Pennard House with a run of Edison Vintage Festoon down the centre of each table and Ivy wrap.",
  },
];

export default function PennardHouseLighting() {
  useEffect(() => {
    document.title = "Pennard House Lighting | Wedding Lighting Design | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Professional wedding lighting design for Pennard House weddings. Stunning lighting installations inside and outside the Coach House. Contact STYLISH Entertainment for your Pennard House wedding.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163700/Pennard-House_koaxfj.jpg"
            alt="Pennard House wedding venue with professional lighting design"
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
            Pennard House Lighting
          </h1>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gray-900 border-champagne-gold/30">
              <CardContent className="p-6 sm:p-8 md:p-12">
                <div className="text-gray-300 leading-relaxed space-y-6">
                  <p className="text-lg">
                    Congratulations on booking your Pennard House Wedding, you have chosen a beautiful venue and must be very excited. We have been supplying lighting for a number of years, both inside and outside of the Coach House. Both areas are blank canvas&apos;s where we can create a variety of different lighting designs, some simple, some quite complex but all stunning and Insta friendly.
                  </p>

                  <p>
                    We are based locally to Pennard and work closely with the outstanding wedding directors to ensure the smooth installation and de-rig within their wedding timeframes so we make it very easy for you.
                  </p>

                  <p>
                    Please contact us with your ideas and requirements – we love talking wedding lighting. We can offer any of the designs below or if you would like us to create something bespoke, please{" "}
                    <Link href="/contact-us" className="text-champagne-gold hover:text-gold-light underline">
                      contact us
                    </Link>
                    {" "}with your ideas.
                  </p>

                  <p className="text-champagne-gold font-semibold">
                    Enjoy your wedding planning. Ali & Nigel
                  </p>

                  <div className="my-12 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-champagne-gold mb-8 text-center">Outside the Coach House</h2>
                    <div className="bg-white max-w-[1000px] mx-auto">
                      {outsidePhotos.map((photo, index) => (
                        <div key={index} className="w-full">
                          <div className="h-screen min-h-[100vh] relative">
                            <img
                              src={photo.src}
                              alt={photo.alt}
                              className="w-full h-full object-cover"
                              loading={index === 0 ? "eager" : "lazy"}
                            />
                          </div>
                          {index < outsidePhotos.length - 1 && (
                            <div className="h-8 md:h-12 bg-white"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="my-12 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-champagne-gold mb-8 text-center">Inside the Coach House</h2>
                    <div className="bg-white max-w-[1000px] mx-auto">
                      {insidePhotos.map((photo, index) => (
                        <div key={index} className="w-full">
                          <div className="h-screen min-h-[100vh] relative">
                            <img
                              src={photo.src}
                              alt={photo.alt}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          {index < insidePhotos.length - 1 && (
                            <div className="h-8 md:h-12 bg-white"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="my-8 p-6 bg-gray-800/50 rounded-lg border border-champagne-gold/20">
                    <p className="mb-4">
                      We hope you like our lighting designs, they are offered on a 3 day hire basis, installing the day before the wedding and de-rigging the day after. We like to be discrete and try to ensure that we are out of the way by the time you arrive.
                    </p>
                    <p>
                      Ready to discuss your Pennard House wedding lighting?{" "}
                      <Link href="/contact-us" className="text-champagne-gold hover:text-gold-light underline">
                        Contact us
                      </Link>
                      {" "}today to discuss your ideas and requirements.
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

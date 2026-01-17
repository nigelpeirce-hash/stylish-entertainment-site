"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import { ChevronLeft, ChevronRight, Phone, Mail, PenTool } from "lucide-react";
import "yet-another-react-lightbox/styles.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WaveDivider from "@/components/WaveDivider";

const outsidePhotos = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162291/Pennard-House-Lighting-with-Amber-Up-lighting_ztldmo.jpg",
    alt: "Amber up-lighting with Festoon and Fairy-light across the Coach House exterior at Pennard House",
    description: "Amber up-lighting with Festoon and Fairy-light across the Coach House exterior.",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162614/Pennard-House-Coach-House-with-Festoon-Lighting-Canopy_swzbdx.jpg",
    alt: "A stunning Festoon Lighting Canopy at Pennard House in Somerset",
    description: "A stunning Festoon Lighting Canopy at Pennard House in Somerset",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162533/Pennard-House-Coach-House-Lighting_yjdues.jpg",
    alt: "Fairy Light Canopy with optional shades at Pennard House",
    description: "Fairy Light Canopy with optional shades",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162498/Pennard-House-Festoon-Pizzarova_iwgkvm.jpg",
    alt: "Festoon and Fairy rigged from the Coach House to the flower beds opposite at Pennard House",
    description: "Festoon and Fairy rigged from the Coach House to the flower beds opposite.",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162671/Pennard-House_skxuop.jpg",
    alt: "Festoon and Fairy Lights with additional LED Up-lighting at Pennard House",
    description: "Festoon and Fairy Lights with additional LED Up-lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163121/Pennard-House-Somerset-Festoon-Lighting-Hire-for-a-wedding-e1675176362931_zjcxct.jpg",
    alt: "The Full Monty lighting design at Pennard House, Somerset",
    description: "The Full Monty lighting design at Pennard House, Somerset",
  },
];

const insidePhotos = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163320/Fairy-light-Canopy-Pennard-House_bjuqnx.jpg",
    alt: "Fairy light canopy at Pennard House Coach House interior",
    description: "Fairy Light Canopy with optional shades",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162494/Pennard-House-Somerset-with-Festoon-Bulb-Canopy_p2x4sz.jpg",
    alt: "Traditional festoon lighting canopy at Pennard House",
    description: "Our traditional festoon lighting canopy",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162964/Pennard-House-Vintage-Festoon-with-Ivy-wrap_izutpp.jpg",
    alt: "Pennard House with Vintage Festoon bulbs with an ivy wrap",
    description: "Pennard House. Vintage Festoon bulbs with an ivy wrap.",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162390/Pennard-House-with-Vintage-Edison-and-Ivy-wrap0_iseaka.jpg",
    alt: "Pennard House with a run of Edison Vintage Festoon down the centre of each table and Ivy wrap",
    description: "Pennard House with a run of Edison Vintage Festoon down the centre of each table and Ivy wrap.",
  },
];

export default function PennardHouseClient() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxPhotos, setLightboxPhotos] = useState<typeof outsidePhotos>(outsidePhotos);

  const openLightbox = (index: number, photos: typeof outsidePhotos) => {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163700/Pennard-House_koaxfj.jpg"
            alt="Pennard House wedding venue with professional lighting design"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-gray-900" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Pennard House Lighting
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Professional Wedding Lighting Design
          </p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <WaveDivider />
        </div>
      </section>

      {/* Content */}
      <div
        style={{
          background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
        }}
      >
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30">
                <CardContent className="p-6 sm:p-8 md:p-12">
                  <div className="text-gray-200 leading-relaxed space-y-6">
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

                    {/* The Pennard House Advantage */}
                    <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/50 mt-8">
                      <CardHeader>
                        <CardTitle className="text-white">The Pennard House Advantage</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-champagne-gold mt-2 flex-shrink-0"></div>
                            <div>
                              <h4 className="text-white font-semibold mb-1">3-Day Hire Period</h4>
                              <p className="text-gray-300 text-sm">Extended access for setup and breakdown</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-champagne-gold mt-2 flex-shrink-0"></div>
                            <div>
                              <h4 className="text-white font-semibold mb-1">Early Installation</h4>
                              <p className="text-gray-300 text-sm">Setup the day before your wedding</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-champagne-gold mt-2 flex-shrink-0"></div>
                            <div>
                              <h4 className="text-white font-semibold mb-1">Discreet De-rigging</h4>
                              <p className="text-gray-300 text-sm">Removal the day after, out of your way</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-champagne-gold mt-2 flex-shrink-0"></div>
                            <div>
                              <h4 className="text-white font-semibold mb-1">Local Expertise</h4>
                              <p className="text-gray-300 text-sm">We know the Coach House power circuits and rigging points perfectly</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Gallery Tabs */}
                    <div className="my-12">
                      <Tabs defaultValue="outside" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                          <TabsTrigger value="outside">Outside the Coach House</TabsTrigger>
                          <TabsTrigger value="inside">Inside the Coach House</TabsTrigger>
                        </TabsList>
                        <TabsContent value="outside">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {outsidePhotos.map((photo, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="relative cursor-pointer overflow-hidden rounded-lg border-2 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all duration-300"
                                onClick={() => openLightbox(index, outsidePhotos)}
                              >
                                <div className="relative aspect-[4/3]" style={{ minHeight: "300px" }}>
                                  <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    loading={index < 2 ? "eager" : "lazy"}
                                  />
                                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300" />
                                </div>
                                {photo.description && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <p className="text-white text-sm">{photo.description}</p>
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </TabsContent>
                        <TabsContent value="inside">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {insidePhotos.map((photo, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="relative cursor-pointer overflow-hidden rounded-lg border-2 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all duration-300"
                                onClick={() => openLightbox(index, insidePhotos)}
                              >
                                <div className="relative aspect-[4/3]" style={{ minHeight: "300px" }}>
                                  <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    loading={index < 2 ? "eager" : "lazy"}
                                  />
                                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300" />
                                </div>
                                {photo.description && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <p className="text-white text-sm">{photo.description}</p>
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    {/* CTA Section */}
                    <Card className="bg-gradient-to-br from-champagne-gold/20 to-transparent border-2 border-champagne-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.3)] mt-12">
                      <CardContent className="p-8 text-center">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                          Ready to Discuss Your Pennard House Wedding Lighting?
                        </h3>
                        <p className="text-gray-200 text-lg mb-6 max-w-2xl mx-auto">
                          We hope you like our lighting designs. They are offered on a 3 day hire basis, installing the day before the wedding and de-rigging the day after. We like to be discrete and try to ensure that we are out of the way by the time you arrive.
                        </p>
                        <Button
                          asChild
                          size="lg"
                          className="bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.5)] mb-4"
                        >
                          <Link href="/contact-us">Request a Pennard House Lighting Quote</Link>
                        </Button>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 text-gray-300">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-champagne-gold" />
                            <a href="tel:+447970793177" className="hover:text-champagne-gold transition-colors">
                              07970793177
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-champagne-gold" />
                            <a href="mailto:info@stylishentertainment.co.uk" className="hover:text-champagne-gold transition-colors">
                              info@stylishentertainment.co.uk
                            </a>
                          </div>
                        </div>
                        <p className="text-champagne-gold font-semibold text-lg mt-6 flex items-center justify-center gap-2">
                          <PenTool className="w-5 h-5" />
                          <span>Ali & Nigel</span>
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxPhotos.map((photo) => ({ src: photo.src }))}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
        render={{
          buttonPrev: () => (
            <button
              className="yarl__button yarl__button_prev"
              style={{
                backgroundColor: "rgba(212, 175, 55, 0.9)",
                color: "#1a1a1a",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "50%",
                padding: "16px",
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} strokeWidth={3} />
            </button>
          ),
          buttonNext: () => (
            <button
              className="yarl__button yarl__button_next"
              style={{
                backgroundColor: "rgba(212, 175, 55, 0.9)",
                color: "#1a1a1a",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "50%",
                padding: "16px",
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
              }}
              aria-label="Next image"
            >
              <ChevronRight size={28} strokeWidth={3} />
            </button>
          ),
        }}
      />
    </div>
  );
}

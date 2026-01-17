"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import { ChevronLeft, ChevronRight, MapPin, Video, FileText, Zap, Map, Home, Camera } from "lucide-react";
import "yet-another-react-lightbox/styles.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const mellsBarnPhotos = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163254/Mells-Barn-Ribbon-Garlands_gyfyt9.jpg",
    alt: "Ribbon garlands and festoon lighting create a colourful and fun addition to Mells Barn",
    width: 1200,
    height: 1600,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163543/PHOTO-2024-09-06-14-41-23-e1767702933382_mrusvc.jpg",
    alt: "Mells Barn with our Festoon and multi coloured shades & LED up-lights",
    width: 1200,
    height: 900,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163679/IMG_3094-1_aiyu5i.jpg",
    alt: "Wedding party in full swing with fairy-light canopy at Mells Barn",
    width: 1200,
    height: 1600,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162233/Mells-Barn-Mirrorball_yzes4e.jpg",
    alt: "Mirror-balls anywhere, inside or outside they make a lovely decorative lighting feature at Mells Barn",
    width: 1200,
    height: 900,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163346/Mells-Barn-Fairy-Light-and-Shades_krscsw.jpg",
    alt: "Mells Barn with Stylish Entertainment's Fairy Light Zig Zag Canopy and White Shades",
    width: 1200,
    height: 1600,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163392/Mells_Barn_LED_lighting-transformed-e1698060379974_geh36y.jpg",
    alt: "Pink LED up-lights installed for a party at Mells Barn",
    width: 1200,
    height: 900,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162531/Mells-Barn-Fairy-lights-in-ceiling_t8xe8k.jpg",
    alt: "Fairy lights in ceiling at Mells Barn creating a magical wedding atmosphere",
    width: 1200,
    height: 1600,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163793/Mells-Barn-with-fairy-light-canopy-petal-garlands_hqepbs.jpg",
    alt: "Fairy-lights with bead dressing at Mells Barn",
    width: 1200,
    height: 900,
  },
];

const styleLooks = [
  {
    name: "The Country Classic",
    description: "Warm fairy-light canopies, rustic wooden accents, and soft ambient lighting create a timeless countryside elegance.",
    features: ["Fairy light zig-zag canopies", "Soft amber uplighting", "Ribbon garlands", "White shade lanterns"],
  },
  {
    name: "The Neon Party",
    description: "Bold LED up-lighting in vibrant colours, mirrorballs, and dynamic party lighting for an unforgettable celebration.",
    features: ["Coloured LED uplighting", "Mirrorball clusters", "Dynamic lighting effects", "Festoon lighting"],
  },
  {
    name: "The Fairy Light Glow",
    description: "Romantic, ethereal atmosphere with delicate fairy-light draping, petal garlands, and soft pink mood lighting.",
    features: ["Fairy light ceiling dressing", "Petal garlands", "Pink mood lighting", "Bead detailing"],
  },
];

const faqItems = [
  {
    question: "Can Mells Barn fit a band?",
    answer: "Yes! Mells Barn has ample space for live bands and professional entertainment. Our team knows the exact dimensions and power requirements, so we can coordinate seamlessly with your musicians to ensure everything fits perfectly on the day.",
  },
  {
    question: "Is there enough power for professional lighting?",
    answer: "Absolutely. We know Mells Barn's power circuits inside and out. With years of experience at this venue, we've mapped every outlet, circuit capacity, and rigging point. This knowledge ensures we can install professional lighting safely and efficiently, even for large-scale setups.",
  },
  {
    question: "Where do guests stay?",
    answer: "The award-winning Talbot Inn is directly across the road from Mells Barn, offering luxurious B&B accommodation. For larger groups, Frome has excellent options including The George Hotel and Archangel. We're happy to help you coordinate accommodation for your guests as part of our planning service.",
  },
];

export default function MellsBarnClient() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162531/Mells-Barn-Fairy-lights-in-ceiling_t8xe8k.jpg"
            alt="Mells Barn wedding venue with professional lighting and styling"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-gray-800" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            The Ultimate Planning Guide for Mells Barn Weddings | Lighting & Production
          </h1>
        </motion.div>
      </section>

      {/* Content */}
      <div
        style={{
          background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
        }}
      >
        {/* Introduction Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50">
                <CardContent className="p-6 sm:p-8 md:p-12">
                  <div className="text-gray-200 leading-relaxed space-y-6">
                    <div className="my-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Planning from afar?</h2>
                      <p className="text-lg">
                        Located just a short distance from our base in Frome, Mells Barn is a venue we have worked with extensively over the years. Our local Frome-based team acts as your 'on-the-ground' eyes and ears for technical setup, so you don't need to worry about being miles away.
                      </p>
                    </div>

                    <div className="my-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">A Venue We Know and Love</h2>
                      <p>
                        From intimate weddings to lively celebrations, we have had the privilege of providing DJs, entertainment, lighting, and styling to transform this space into something truly magical. With years of experience at Mells Barn, we understand its unique character and can bring your vision to life—even from a distance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Distance Planning Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">Distance Planning Made Simple</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Video className="h-6 w-6 text-champagne-gold" />
                    <CardTitle className="text-white">Zoom Consultations</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 leading-relaxed">
                    We offer Zoom consultations so you can discuss your vision with us from anywhere in the world. Share your inspiration, ask questions, and see our portfolio—all from the comfort of your home.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Map className="h-6 w-6 text-champagne-gold" />
                    <CardTitle className="text-white">Detailed Site Maps</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 leading-relaxed">
                    We have detailed site maps of Mells Barn covering every power circuit, rigging point, and access route. You don't need to visit for technical meetings—we handle it all using our comprehensive knowledge of the venue.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Logistics & Trust Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/50">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="h-6 w-6 text-champagne-gold" />
                    <CardTitle className="text-white">Logistics & Technical Expertise</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-200 leading-relaxed">
                    We know Mells Barn's power circuits, rigging points, and access times perfectly. This reduces 'Day-of' stress for couples not from the area—we've handled every technical detail hundreds of times, so you can relax knowing everything is under control.
                  </p>
                  <div className="mt-6 p-4 bg-champagne-gold/10 rounded-lg border border-champagne-gold/30">
                    <p className="text-champagne-gold font-semibold">
                      ✨ No Travel Fees for weddings within 10 miles of Frome
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Style Menu Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">Style Menu</h2>
              <p className="text-gray-300 text-center max-w-2xl mx-auto">
                Whilst it's a beautifully characterful village hall, it benefits from thoughtful styling to elevate it into a stunning barn wedding venue. Choose from our curated looks or create a bespoke combination.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {styleLooks.map((look, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/30 hover:border-champagne-gold/60 transition-all h-full">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">{look.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4 leading-relaxed">{look.description}</p>
                      <ul className="space-y-2">
                        {look.features.map((feature, fIdx) => (
                          <li key={fIdx} className="text-sm text-gray-400 flex items-start gap-2">
                            <span className="text-champagne-gold mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Masonry Gallery Grid */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">Gallery</h2>
              <p className="text-gray-300 text-center max-w-2xl mx-auto">
                See the magic we've created at Mells Barn. Each event is uniquely designed to bring our clients' dreams to life.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mellsBarnPhotos.map((photo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative cursor-pointer overflow-hidden rounded-lg border-2 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all duration-300"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative aspect-[3/4] md:aspect-auto" style={{ minHeight: "300px" }}>
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                      loading={index < 3 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Wedding Weekend Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Home className="h-6 w-6 text-champagne-gold" />
                    <CardTitle className="text-white">Wedding Weekend: Where to Stay</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-200 leading-relaxed">
                    Planning a destination wedding? We've got your accommodation sorted. Across the road from Mells Barn, you'll find the award-winning <strong className="text-white">Talbot Inn (Mells)</strong>, offering luxurious B&B accommodation and outstanding food—ideal for your guests or even a pre- or post-wedding meal.
                  </p>
                  <div className="mt-6 space-y-3">
                    <p className="text-gray-300 font-semibold">Other nearby options in Frome:</p>
                    <ul className="space-y-2 text-gray-300 ml-4">
                      <li>• <strong>The George Hotel</strong> - Historic coaching inn with modern comforts</li>
                      <li>• <strong>Archangel</strong> - Boutique accommodation with character</li>
                    </ul>
                  </div>
                  <p className="text-gray-300 mt-4 text-sm">
                    We're happy to help you coordinate accommodation for your guests as part of our planning service.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">Frequently Asked Questions</h2>
            </motion.div>
            <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50">
              <CardContent className="p-6">
                <Accordion type="single" className="w-full">
                  {faqItems.map((item, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border-champagne-gold/30">
                      <AccordionTrigger className="text-white hover:text-champagne-gold">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-champagne-gold/20 to-transparent border-2 border-champagne-gold/50">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Let's Bring Your Wedding Vision to Life
                  </h2>
                  <p className="text-gray-200 text-lg mb-6 max-w-2xl mx-auto">
                    Planning from afar? Our local Frome-based team is here to make your Mells Barn wedding seamless and stress-free. Contact us today to discuss your vision.
                  </p>
                  <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                    <Link href="/contact-us">Get in Touch</Link>
                  </Button>
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
        slides={mellsBarnPhotos.map((photo) => ({ src: photo.src }))}
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

"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import ImageCarousel, { ImagePhoto } from "@/components/ImageCarousel";
import { useEffect } from "react";

const lightingPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162627/Camilla-Richard-0063_mctrmo.jpg",
    width: 1200,
    height: 900,
    alt: "Wedding reception for Camilla and Richard with professional lighting design, elegant table settings, and ambient lighting at a West Country venue",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163679/IMG_3094-1_aiyu5i.jpg",
    width: 1200,
    height: 900,
    alt: "Elegant wedding reception with sophisticated lighting design creating a warm and romantic atmosphere with ambient mood lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162621/Babington-House-in-Green_oms0ws.jpg",
    width: 1200,
    height: 900,
    alt: "Babington House wedding venue exterior with beautiful green LED mood lighting, showcasing luxury wedding lighting design in Somerset",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163328/Nigel-DJ-Babs-House-0021-1_xmxz8v.jpg",
    width: 1200,
    height: 900,
    alt: "Professional DJ setup by DJ Nige at Babington House with custom lighting, professional sound equipment, and atmospheric wedding entertainment",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,c_auto,g_auto,h_667,w_1000/EmilyTomWedding-JonnyBarrattPhotography605-scaled-e1640779326843_ozksuz.jpg",
    width: 1200,
    height: 900,
    alt: "Emily and Tom's wedding reception with stunning atmospheric lighting design, captured by Jonny Barratt Photography, creating a magical evening ambiance",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162378/Jade-and-Emma-0059-1_wddnet.jpg",
    width: 1200,
    height: 900,
    alt: "Jade and Emma's wedding with elegant dance floor lighting design and romantic ambient lighting creating a beautiful celebration atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162978/ITALLIAN-VILLA-02_jgy3tx.jpg",
    width: 1200,
    height: 900,
    alt: "Italian Villa wedding venue with stunning exterior LED mood lighting and professional wedding lighting design creating an elegant evening atmosphere",
  },
];

export default function LightingDesignService() {
  useEffect(() => {
    document.title = "Lighting Design | Professional Wedding Lighting | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Transform your wedding venue with bespoke lighting design. LED uplighting, intelligent moving lights, atmospheric mood lighting, and dance floor packages across the West Country.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162978/ITALLIAN-VILLA-02_jgy3tx.jpg"
            alt="Italian Villa wedding venue with stunning exterior LED mood lighting and professional wedding lighting design creating an elegant evening atmosphere"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Lighting Design</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Transform your venue with bespoke lighting design that creates the perfect atmosphere
          </p>
        </motion.div>
      </section>

      {/* Service Details */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-8 w-8 text-champagne-gold" />
                <CardTitle className="text-3xl md:text-4xl text-white">Professional Lighting Design</CardTitle>
              </div>
              <CardDescription className="text-lg text-gray-300">
                Create the perfect ambiance for your special day with our bespoke lighting design service. From subtle mood lighting to dramatic dance floor effects, we transform your venue into a magical space.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">What We Offer</h3>
                <ul className="space-y-3">
                  {[
                    "Custom lighting schemes tailored to your venue",
                    "LED uplighting and color washes",
                    "Intelligent moving lights and effects",
                    "Atmospheric mood lighting",
                    "Dance floor lighting packages",
                    "Outdoor lighting solutions",
                    "Gobo projection and custom patterns",
                    "Fairy lights and festoon lighting",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="bg-gray-900 border-champagne-gold/30 mt-8">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p className="text-base sm:text-lg">
                  At <span className="text-champagne-gold font-semibold">STYLISH Entertainment</span>, we take pride in our established reputation for providing genuine guidance and flawless execution. Explore the firsthand experiences of our satisfied clients on our <Link href="/testi" className="text-champagne-gold hover:text-gold-light underline">testimonial page</Link> to witness the magic we bring to every celebration.
                </p>
                
                <p className="text-base sm:text-lg">
                  Eager to turn your vision into reality? Based in <span className="text-champagne-gold font-medium">Frome, Somerset</span>, we extend our services across <span className="text-white font-medium">Somerset, Wiltshire, Dorset, Gloucestershire, Bath, Bristol, Swindon, and Exeter</span>.
                </p>
                
                <p className="text-base sm:text-lg">
                  Take the first step towards an unforgettable event by reaching out to <span className="text-champagne-gold font-medium">Nigel or Ali</span> at STYLISH Entertainment. Call <a href="tel:07970793177" className="text-champagne-gold hover:text-gold-light font-medium underline">07970793177</a> to discuss your party and specific requirements, or simply complete the form below.
                </p>
                
                <p className="text-lg sm:text-xl text-champagne-gold font-semibold italic text-center pt-4">
                  Let&apos;s illuminate your celebration into a masterpiece together!
                </p>
              </div>

              <div className="pt-6 border-t border-champagne-gold/30">
                <Button asChild size="lg" className="w-full sm:w-auto bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
                  <Link href="/contact-us">Get in Touch</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-3 sm:mb-4 text-center text-white font-bold px-4">Lighting Design Gallery</h2>
            <p className="text-base sm:text-lg text-gray-300 text-center max-w-2xl mx-auto px-4">
              See how we transform venues with captivating light installations
            </p>
          </motion.div>
          <ImageCarousel images={lightingPhotos} />
        </div>
      </section>

      {/* CTA */}
      <section className="pt-20 pb-8 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Ready to transform your venue?
            </h2>
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

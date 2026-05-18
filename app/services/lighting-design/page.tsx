"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Calculator } from "lucide-react";
import ImageCarousel, { ImagePhoto } from "@/components/ImageCarousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ServiceQuoteGenerator } from "@/components/ServiceQuoteGenerator";

const lightingPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163679/IMG_3094-1_aiyu5i.jpg",
    width: 1200,
    height: 900,
    alt: "Elegant wedding reception with sophisticated lighting design creating a warm and romantic atmosphere with ambient mood lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163303/Kin-House-Stage-Lighting_naw56h.jpg",
    width: 1200,
    height: 900,
    alt: "Kin House stage lighting design for weddings and events, professional stage and venue illumination",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163114/Babington-Tree-Lighting-Daytime_nw8qbl.jpg",
    width: 1200,
    height: 900,
    alt: "Babington House tree lighting in daytime, elegant exterior lighting design for wedding venues",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162275/Pond-Fountain-Party-Lighting-_bieerh.jpg",
    width: 1200,
    height: 900,
    alt: "Pond and fountain party lighting creating a magical atmosphere for outdoor celebrations",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162661/Exterior-LED-mood-Lighting_jjuuar.jpg",
    width: 1200,
    height: 900,
    alt: "Exterior LED mood lighting for weddings and events, atmospheric outdoor illumination",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162717/Free-Standing-Lighting-Canopy-with-Tree-lighting-in-distance_fgfz56.jpg",
    width: 1200,
    height: 900,
    alt: "Free-standing lighting canopy with tree lighting in the distance, versatile wedding and event lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768739479/EXTERIOR-DINING-TREE-LIGHTING_ur4vlb.jpg",
    width: 1200,
    height: 900,
    alt: "Exterior dining area with tree lighting, romantic al fresco wedding and event lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,c_auto,g_auto,h_667,w_1000/EmilyTomWedding-JonnyBarrattPhotography605-scaled-e1640779326843_ozksuz.jpg",
    width: 1200,
    height: 900,
    alt: "Emily and Tom's wedding reception with stunning atmospheric lighting design, captured by Jonny Barratt Photography, creating a magical evening ambiance",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768731827/Camilla-Richard-0063_ngmblz.jpg",
    width: 1200,
    height: 900,
    alt: "Wedding reception for Camilla and Richard with professional lighting design, elegant table settings and ambient lighting at a South West venue",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg",
    width: 1200,
    height: 900,
    alt: "Stretch marquee lighting for weddings and events, elegant tent illumination",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163491/Barn-Lighting-For-a-Wedding_g3fuow.jpg",
    width: 1200,
    height: 900,
    alt: "Barn lighting for a wedding, atmospheric rural venue lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162241/wedding-tree-lighting-2-e1510835516724_nbjn2r.jpg",
    width: 1200,
    height: 900,
    alt: "Wedding tree lighting creating a magical outdoor atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg",
    width: 1200,
    height: 900,
    alt: "Lighting design at Kings Weston House, elegant wedding and event illumination",
  },
];

export default function LightingDesignService() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-50 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768733254/Babington-House-in-Green_oms0ws.jpg"
            alt="Babington House wedding venue exterior with green LED mood lighting, luxury wedding lighting design in Somerset"
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
      <section className="py-20 px-3 sm:px-4 bg-gray-800">
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
                    "LED uplighting and colour washes",
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
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-3 sm:px-4 bg-gray-900">
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

      {/* About & contact – above footer */}
      <section className="py-20 px-3 sm:px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gray-900 border-champagne-gold/30">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p className="text-base sm:text-lg">
                  At <span className="text-champagne-gold font-semibold">STYLISH Entertainment</span>, we take pride in our established reputation for providing genuine guidance and flawless execution. Explore the firsthand experiences of our satisfied clients on our <Link href="/testi/" className="text-champagne-gold hover:text-gold-light underline">testimonial page</Link> to witness the magic we bring to every celebration.
                </p>
                <p className="text-base sm:text-lg">
                  Eager to turn your vision into reality? Based in <span className="text-champagne-gold font-medium">Frome, Somerset</span>, we extend our services across <span className="text-white font-medium">the UK</span>.
                </p>
                <p className="text-base sm:text-lg">
                  Take the first step towards an unforgettable event by reaching out to <span className="text-champagne-gold font-medium">Nigel or Ali</span> at STYLISH Entertainment. Call <a href="tel:+447970793177" className="text-champagne-gold hover:text-gold-light font-medium underline">07970793177</a> to discuss your party and specific requirements, or simply complete the form below.
                </p>
                <p className="text-lg sm:text-xl text-champagne-gold font-semibold italic text-center pt-4">
                  Let&apos;s illuminate your celebration into a masterpiece together!
                </p>
              </div>
              <div className="pt-6 border-t border-champagne-gold/30 flex flex-wrap gap-3">
                <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10">
                      <Calculator className="w-5 h-5 mr-2" />
                      Get a quote
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-gray-900 border-champagne-gold/30">
                    <DialogHeader>
                      <DialogTitle className="text-white">Lighting quote</DialogTitle>
                    </DialogHeader>
                    <ServiceQuoteGenerator
                      category="lighting"
                      title="Lighting quote"
                      compact
                      onClose={() => setQuoteOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
                <Button asChild size="lg" className="w-full sm:w-auto bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
                  <Link href="/contact-us/">Get in Touch</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

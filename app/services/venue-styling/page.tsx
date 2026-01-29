"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Palette } from "lucide-react";
import Gallery, { Photo } from "@/components/Gallery";
import { useEffect } from "react";

const stylingPhotos: Photo[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162260/Saltburn_231005__0020_0638_fpdevj.jpg",
    width: 1200,
    height: 800,
    alt: "Elegant Wedding Venue Styling",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768741948/Saltburn_231005__0020_0640_nmzjp6.jpg",
    width: 1200,
    height: 800,
    alt: "Elegant wedding venue styling with sophisticated lighting design and professional decoration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768742034/IMG_1348_161201_zwmdh2.jpg",
    width: 1200,
    height: 800,
    alt: "Luxury wedding venue styling with elegant lighting and sophisticated interior design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768742094/IMG_4162_h3h0bb.jpg",
    width: 1200,
    height: 800,
    alt: "Professional wedding venue styling with atmospheric lighting and elegant decoration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768742204/Saltburn_231005__0050_1558_y6diu8.jpg",
    width: 1200,
    height: 800,
    alt: "Sophisticated wedding venue styling with professional lighting design and elegant atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163679/IMG_3094-1_aiyu5i.jpg",
    width: 1200,
    height: 800,
    alt: "Elegant venue styling with sophisticated lighting and decoration creating a luxurious atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163675/DSC00018_kixfyj.jpg",
    width: 1200,
    height: 800,
    alt: "Beautiful venue styling with elegant decorations and professional lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163647/Orangery-violet_c95cvu.jpg",
    width: 1200,
    height: 800,
    alt: "Orangery venue with violet lighting and elegant styling creating a romantic atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg",
    width: 1200,
    height: 800,
    alt: "Stretch marquee with professional lighting and elegant venue styling for wedding celebrations",
  },
];

export default function VenueStylingService() {
  useEffect(() => {
    document.title = "Venue Styling | Professional Wedding Styling | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Complete venue transformation with elegant styling. Table centerpieces, drapery, custom backdrops and cohesive design themes across the UK and Wales.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-50 flex items-center justify-center">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,w_1920/v1768162260/Saltburn_231005__0020_0638_fpdevj.jpg"
            alt="Saltburn venue with elegant venue styling, professional wedding decoration and sophisticated interior design creating a luxurious wedding atmosphere"
            fill
            className="object-cover object-center brightness-110"
            style={{ objectPosition: 'center center' }}
            priority
            sizes="100vw"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Venue Styling</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Complete venue transformation with elegant styling that reflects your personal vision
          </p>
        </motion.div>
      </section>

      {/* Service Details */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Palette className="h-8 w-8 text-champagne-gold" />
                <CardTitle className="text-3xl md:text-4xl text-white">Professional Venue Styling</CardTitle>
              </div>
              <CardDescription className="text-lg text-gray-300">
                Elevate your wedding aesthetic with our expert venue styling service. We work closely with you to create a cohesive design theme that reflects your personal taste and transforms your venue into a stunning celebration space.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">What We Offer</h3>
                <ul className="space-y-3">
                  {[
                    "Full venue styling consultation",
                    "Table centerpieces and floral arrangements",
                    "Drapery and fabric installations",
                    "Custom backdrops and photo walls",
                    "Cohesive design theme throughout",
                    "Themed decor and accessories",
                    "Complete venue transformation",
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
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-3 sm:mb-4 text-center text-white font-bold px-4">Venue Styling Gallery</h2>
            <p className="text-base sm:text-lg text-gray-300 text-center max-w-2xl mx-auto px-4">
              Elegant styling that reflects your personal vision
            </p>
          </motion.div>
          <div className="w-full md:max-w-4xl md:mx-auto">
            <Gallery photos={stylingPhotos} columns={2} />
          </div>
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
              Ready to style your venue?
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

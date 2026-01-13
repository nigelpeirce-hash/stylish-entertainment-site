"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Palette } from "lucide-react";
import ImageCarousel, { ImagePhoto } from "@/components/ImageCarousel";
import { useEffect } from "react";

const stylingPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163340/IMG_1348_161201_owwllt.jpg",
    width: 1200,
    height: 900,
    alt: "Professional venue styling with elegant decorations and creative design creating a sophisticated wedding atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768169246/Fairy%20Light%20Tunnel%20at%20Babington%20House.jpg",
    width: 1200,
    height: 900,
    alt: "Fairy light tunnel at Babington House creating a magical entrance with professional venue styling and lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163815/Highcliffe-Castle-Wedding-2-web_pgsbaa.jpg",
    width: 1200,
    height: 900,
    alt: "Highcliffe Castle wedding with elegant venue styling, professional decoration, and sophisticated wedding design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163745/Pool-Party01_qe5ro0.jpg",
    width: 1200,
    height: 900,
    alt: "Pool party with professional venue styling, creative decorations, and beautiful lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163744/430_lzn5ns.jpg",
    width: 1200,
    height: 900,
    alt: "Elegant venue styling with professional decorations and creative design elements creating a sophisticated event atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163738/Circus-Temed-Party-Tent_uizqbq.jpg",
    width: 1200,
    height: 900,
    alt: "Circus themed party tent with creative venue styling, professional decorations, and themed party design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163733/Lost-Orangery_xdaewo.jpg",
    width: 1200,
    height: 900,
    alt: "Lost Orangery venue with elegant styling, professional decoration, and sophisticated wedding design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163723/IMG_6321_xu8q8j.jpg",
    width: 1200,
    height: 900,
    alt: "Professional venue styling with creative decorations and elegant design creating a beautiful celebration atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163716/IMG_1098_hqiw3d.jpg",
    width: 1200,
    height: 900,
    alt: "Outdoor terrace with professional venue styling, festoon lighting, and elegant party decorations",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163714/IMG_2321-1_mh4e6d.jpg",
    width: 1200,
    height: 900,
    alt: "Elegant venue styling with professional decorations and creative design elements for weddings and parties",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163708/LED-furniture_im8hda.jpg",
    width: 1200,
    height: 900,
    alt: "LED furniture and creative venue styling with modern lighting design creating a unique party atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163684/IMG_2731_yk0kmb.jpg",
    width: 1200,
    height: 900,
    alt: "Professional venue styling with elegant decorations and sophisticated design creating a beautiful event atmosphere",
  },
];

export default function VenueDecoration() {
  useEffect(() => {
    document.title = "Venue Decoration | Professional Wedding Styling | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Complete venue transformation with elegant styling. Table centerpieces, drapery, custom backdrops, and cohesive design themes across the West Country.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162260/Saltburn_231005__0020_0638_fpdevj.jpg"
            alt="Saltburn venue with elegant venue styling, professional wedding decoration, and sophisticated interior design creating a luxurious wedding atmosphere"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Venue Decoration</h1>
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
                    "Chair covers and sashes",
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
          <div className="flex justify-center">
            <ImageCarousel images={stylingPhotos} />
          </div>
        </div>
      </section>

      {/* Bottom Text Section */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              We offer a complete range of wedding and party décor ideas to decorate your venue inside and out using a combination of creative drapery, lighting design, dressings, props, furniture hire and special effects.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-6">
              We have a passion for providing unique ideas that make for great talking points and wonderful memories.
            </p>
            <div className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/30 rounded-lg p-6 mb-6">
              <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
                <Link href="/contact-us" className="text-champagne-gold hover:text-gold-light underline font-semibold">Contact Us</Link> today and speak to one of our team about your party or event.
              </p>
              <p className="text-white text-base md:text-lg leading-relaxed">
                We offer our venue styling in the following areas: <span className="font-semibold text-champagne-gold">Venue styling Somerset, Wiltshire, London, Devon, Bristol, Bath, Swindon, Oxford, Berkshire</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-20 pb-8 px-4 bg-gray-900">
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
              <Link href="/contact-us">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

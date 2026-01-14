"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import ImageCarousel, { ImagePhoto } from "@/components/ImageCarousel";
import { Card, CardContent } from "@/components/ui/card";

const corporatePhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,e_upscale,c_auto,h_667,w_1000/DJ-Decks_mlezxe.jpg",
    width: 1200,
    height: 900,
    alt: "Professional DJ decks setup for corporate entertainment at a high-end corporate event",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,e_enhance/IMG_2048_vpuugy.jpg",
    width: 1200,
    height: 900,
    alt: "Corporate event with professional entertainment, lighting, and sophisticated atmosphere",
  },
];

export default function CorporateParties() {
  useEffect(() => {
    document.title = "Corporate Events | Professional Corporate Entertainment | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Professional corporate entertainment for galas, conferences, product launches, and team-building events. Trusted by Aston Martin, Red Bull, Tesco, and more."
      );
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,e_enhance/ABS-Preview-50-percent0006_c51xsl.jpg"
            alt="Professional corporate event with sophisticated entertainment and lighting"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Corporate Events</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Professional entertainment that elevates your brand and leaves a lasting impression
          </p>
        </motion.div>
      </section>

      {/* Text Block */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="container mx-auto max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-white text-lg md:text-xl leading-relaxed">
                Elevate your corporate events to new heights with our roster of talented DJs, curated specifically for corporate entertainment. Whether you&apos;re hosting a gala, conference, product launch, or team-building event, our skilled DJs will set the perfect tone to enhance your company&apos;s brand and message.
              </p>
            </div>

            {/* Two Column Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card className="bg-gray-800/50 border-champagne-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                    Professional & Versatile
                  </h3>
                  <p className="text-white text-base sm:text-lg leading-relaxed">
                    With years of experience in the industry, our DJs are adept at reading the room and delivering precisely the right ambience to keep your guests engaged and entertained. From sophisticated background beats to high-energy dance sets, our DJs are versatile and adaptable to the unique needs of your event.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-champagne-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                    Unforgettable Entertainment
                  </h3>
                  <p className="text-white text-base sm:text-lg leading-relaxed">
                    Trust us to provide professional, reliable, and unforgettable entertainment that will leave a lasting impression on your clients, partners, and employees alike. Let us tailor the soundtrack to your success and make your corporate events truly memorable.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Trusted Brands Card */}
            <Card className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/30 shadow-lg mt-8">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">⭐</div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-champagne-gold mb-3">
                      Trusted by Leading Brands
                    </h3>
                    <p className="text-white text-lg leading-relaxed mb-4">
                      We supply entertainment to many corporate events, working with brands such as <span className="font-semibold text-champagne-gold">Aston Martin, Red Bull, Tesco, Orange, T-Mobile, Direct Wines, Top Shop, Sotheby&apos;s, Sony</span> and many more.
                    </p>
                    <p className="text-white text-lg leading-relaxed">
                      We supply DJs & &quot;discos&quot;, live entertainment including bands, duos, trios, harpist, singing waiters and cabaret acts. We can offer you a package of entertainment. A popular option is our <span className="font-semibold text-champagne-gold">festival trio of DJ, sax and bongos</span> giving you a slice of Glastonbury festival at your event.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="container mx-auto max-w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center"
          >
            <ImageCarousel images={corporatePhotos} />
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="container mx-auto max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-champagne-gold/20 via-yellow-400/20 to-champagne-gold/20 border-2 border-champagne-gold/40">
              <CardContent className="p-6 sm:p-8 text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-champagne-gold mb-4">
                  Ready to Elevate Your Corporate Event?
                </h3>
                <p className="text-white text-lg md:text-xl leading-relaxed mb-6">
                  Please contact us on{" "}
                  <a 
                    href="tel:+447970793177" 
                    className="text-champagne-gold hover:text-gold-light underline font-bold text-xl"
                  >
                    07970793177
                  </a>
                  {" "}or{" "}
                  <a 
                    href="mailto:info@stylishentertainment.co.uk" 
                    className="text-champagne-gold hover:text-gold-light underline font-bold"
                  >
                    info@stylishentertainment.co.uk
                  </a>
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="tel:+447970793177"
                    className="inline-block px-8 py-3 bg-champagne-gold text-black font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Call Now
                  </a>
                  <Link
                    href="/contact"
                    className="inline-block px-8 py-3 bg-transparent border-2 border-champagne-gold text-champagne-gold font-semibold rounded-lg hover:bg-champagne-gold hover:text-black transition-all duration-300 hover:scale-105"
                  >
                    Get in Touch
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

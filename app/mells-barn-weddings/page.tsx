"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const mellsBarnPhotos = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163254/Mells-Barn-Ribbon-Garlands_gyfyt9.jpg",
    alt: "Ribbon garlands and festoon lighting create a colourful and fun addition to Mells Barn",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163543/PHOTO-2024-09-06-14-41-23-e1767702933382_mrusvc.jpg",
    alt: "Mells Barn with our Festoon and multi coloured shades & LED up-lights",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163679/IMG_3094-1_aiyu5i.jpg",
    alt: "Wedding party in full swing with fairy-light canopy at Mells Barn",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162233/Mells-Barn-Mirrorball_yzes4e.jpg",
    alt: "Mirror-balls anywhere, inside or outside they make a lovely decorative lighting feature at Mells Barn",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163346/Mells-Barn-Fairy-Light-and-Shades_krscsw.jpg",
    alt: "Mells Barn with Stylish Entertainment's Fairy Light Zig Zag Canopy and White Shades",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163392/Mells_Barn_LED_lighting-transformed-e1698060379974_geh36y.jpg",
    alt: "Pink LED up-lights installed for a party at Mells Barn",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162531/Mells-Barn-Fairy-lights-in-ceiling_t8xe8k.jpg",
    alt: "Fairy lights in ceiling at Mells Barn creating a magical wedding atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163793/Mells-Barn-with-fairy-light-canopy-petal-garlands_hqepbs.jpg",
    alt: "Fairy-lights with bead dressing at Mells Barn",
  },
];

export default function MellsBarnWeddings() {
  useEffect(() => {
    document.title = "Mells Barn Weddings | Wedding Lighting & Styling | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Professional wedding lighting, styling, and entertainment services for Mells Barn weddings. Transform this beautiful venue with bespoke lighting and décor. Contact STYLISH Entertainment.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162531/Mells-Barn-Fairy-lights-in-ceiling_t8xe8k.jpg"
            alt="Mells Barn wedding venue with professional lighting and styling"
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
            Mells Barn Weddings
          </h1>
        </motion.div>
      </section>

      {/* Content */}
      <div>
        {/* Introduction Section */}
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
                    <div className="my-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">A Venue We Know and Love</h2>
                      <p>
                        Located just a short distance from our base in Frome, Mells Barn is a venue we have worked with extensively over the years. From intimate weddings to lively celebrations, we have had the privilege of providing DJs, entertainment, lighting, and styling to transform this space into something truly magical.
                      </p>
                    </div>

                    <div className="my-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">A Blank Canvas with Endless Possibilities</h2>
                      <p>
                        Whilst it&apos;s a beautifully characterful village hall, it benefits from some thoughtful styling to elevate it into a stunning barn wedding venue. With its rustic charm and spacious interior, it offers a wonderful blank canvas for couples who want to create a warm, inviting, and stylish setting for their special day.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* First Image - Ribbon Garlands */}
        <div className="bg-white">
          <div className="w-full h-screen min-h-[100vh] relative">
            <img
              src={mellsBarnPhotos[0].src}
              alt={mellsBarnPhotos[0].alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="h-8 md:h-12 bg-white"></div>
        </div>

        {/* Transforming the Space Section */}
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
                  <div className="text-gray-300 leading-relaxed">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">Transforming the Space with Lighting & Styling</h2>
                    <p className="mb-4">
                      With the right touches, Mells Barn can be completely transformed to reflect your wedding vision. We specialise in:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Ambient uplighting to highlight the barn&apos;s unique features</li>
                      <li>Elegant draping for a soft, romantic atmosphere</li>
                      <li>Bespoke décor tailored to your theme</li>
                      <li>Dance floor setups to keep the celebration going all night</li>
                      <li>Professional DJs and live entertainment to set the perfect mood</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Gallery Images */}
        <div className="bg-white">
          {mellsBarnPhotos.slice(1).map((photo, index) => (
            <div key={index}>
              <div className="w-full h-screen min-h-[100vh] relative">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {index < mellsBarnPhotos.slice(1).length - 1 && (
                <div className="h-8 md:h-12 bg-white"></div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Information Sections */}
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
                    <div className="my-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">See the Magic for Yourself</h2>
                      <p>
                        The images above showcase some of the stunning weddings and parties we have styled at Mells Barn. Each event is uniquely designed to bring our clients&apos; dreams to life.
                      </p>
                    </div>

                    <div className="my-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">Make the Most of the Space</h2>
                      <p>
                        For larger weddings or additional space, a marquee can be added to extend the venue, giving you more room for dining, dancing, or relaxing areas. The beautiful garden is perfect for fun outdoor games, drinks receptions, or a quiet escape during the festivities.
                      </p>
                    </div>

                    <div className="my-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">Stay & Dine at The Talbot Inn</h2>
                      <p>
                        Across the road from Mells Barn, you&apos;ll find the award-winning Talbot Inn, offering luxurious B&B accommodation and outstanding food—ideal for your guests or even a pre- or post-wedding meal.
                      </p>
                    </div>

                    <div className="my-8 p-6 bg-gray-800/50 rounded-lg border border-champagne-gold/20">
                      <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">Let&apos;s Bring Your Wedding Vision to Life</h2>
                      <p className="text-lg">
                        If you&apos;re planning your wedding at Mells Barn, let us help you create a truly magical celebration.{" "}
                        <Link href="/contact-us" className="text-champagne-gold hover:text-gold-light underline">
                          Contact us
                        </Link>
                        {" "}today to discuss your vision and how we can transform Mells Barn into the perfect setting for your special day.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}

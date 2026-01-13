"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import Gallery, { Photo } from "@/components/Gallery";

const galleryPhotos: Photo[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163840/Fairy-Light-Canopy-with-Shades-e1510835685909_wgdrd3.jpg",
    width: 1200,
    height: 900,
    alt: "Fairy light canopy with shades creating a romantic wedding atmosphere with elegant lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163736/ChloeStu2-e1434724653198_n5lhsf.jpg",
    width: 1200,
    height: 900,
    alt: "Chloe and Stu's wedding with beautiful fairy light installations and atmospheric wedding lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163739/170504_matthew-pei-san_ria-mishaal-photography_0957_im3era.jpg",
    width: 1200,
    height: 900,
    alt: "Matthew and Pei San's wedding reception with stunning fairy light tunnel and professional wedding lighting, captured by Ria Mishaal Photography",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163700/Pennard-House_koaxfj.jpg",
    width: 1200,
    height: 900,
    alt: "Pennard House wedding venue with elegant exterior lighting design and atmospheric wedding lighting installations",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163694/Jade-and-Emma-1081-1_bmnwh0.jpg",
    width: 1200,
    height: 900,
    alt: "Jade and Emma's wedding with beautiful fairy light installations and romantic wedding lighting design creating a magical atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163641/Pennard-House-Festoon-Pizzarova_rpdwep.jpg",
    width: 1200,
    height: 900,
    alt: "Pennard House wedding venue with festoon lighting and elegant outdoor wedding lighting design for alfresco dining",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163634/matt_emma_4191_vvmdww.jpg",
    width: 1200,
    height: 900,
    alt: "Matt and Emma's wedding with stunning fairy light installations and professional wedding lighting design creating a romantic atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163611/Camilla-Richard-0063_ngmblz.jpg",
    width: 1200,
    height: 900,
    alt: "Camilla and Richard's wedding reception with elegant lighting design, beautiful table settings, and atmospheric wedding lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163596/STYLISH-babs-july2016_ria-mishaal-photography_006_qmds40.jpg",
    width: 1200,
    height: 900,
    alt: "Babington House wedding with professional lighting design and elegant wedding lighting installations, captured by Ria Mishaal Photography",
  },
];

export default function WeddingLighting() {
  useEffect(() => {
    document.title = "Wedding Lighting | Bespoke Wedding Lighting Design | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Transform your wedding venue with bespoke lighting installations. Fairy lights, festoon lighting, LED uplighting, and custom wedding lighting design across Somerset, Wiltshire, Dorset, and the West Country.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768169246/Fairy%20Light%20Tunnel%20at%20Babington%20House.jpg"
            alt="Fairy light tunnel at Babington House creating a magical wedding entrance with elegant lighting design"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Wedding Lighting</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Transform your wedding venue into an Instagram-worthy wonder
          </p>
        </motion.div>
      </section>

      {/* Text Paragraph */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              Step into the world of enchanting wedding lighting where we turn ordinary spaces into Instagram-worthy wonders!
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              Our team specialises in crafting custom wedding lighting installations tailored to your unique venue. Whether it's a charming barn, an elegant marquee, a luxurious venue, or the cosiness of your own home, we've got the magic touch to transform it into a dreamy spectacle. But that's not all – we sprinkle our lighting expertise outdoors too, adding a touch of radiance to alfresco dining, terraces, walkways, and even Mother Nature's own creations like trees and hedges. Check out the images below for a peek into the magic we can conjure up!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Gallery photos={galleryPhotos} columns={3} />
          </motion.div>
        </div>
      </section>

      {/* Text Block Below Gallery */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              At STYLISH Entertainment, we take pride in our established reputation for providing genuine guidance and flawless execution. Explore the firsthand experiences of our satisfied clients on our <Link href="/testi" className="text-champagne-gold hover:text-gold-light underline">testimonial page</Link> to witness the magic we bring to every celebration.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              Eager to turn your vision into reality? Based in Frome, Somerset, we extend our services across Somerset, Wiltshire, Dorset, Gloucestershire, Bath, Bristol, Swindon, and Exeter.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              Take the first step towards an unforgettable event by reaching out to Nigel or Ali at STYLISH Entertainment. Call <a href="tel:+447970793177" className="text-champagne-gold hover:text-gold-light underline font-semibold">07970793177</a> to discuss your party and specific requirements, or simply complete the form below.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed font-semibold text-champagne-gold">
              Let's illuminate your celebration into a masterpiece together!
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-block px-8 py-3 bg-champagne-gold text-black font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

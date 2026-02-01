"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Gallery, { Photo } from "@/components/Gallery";

const galleryPhotos: Photo[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163840/Fairy-Light-Canopy-with-Shades-e1510835685909_wgdrd3.jpg",
    width: 1200,
    height: 900,
    alt: "Fairy light canopy with shades creating a romantic wedding atmosphere with elegant lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163736/ChloeStu2-e1434724653198_n5lhsf.jpg",
    width: 1200,
    height: 900,
    alt: "Chloe and Stu's wedding with beautiful fairy light installations and atmospheric wedding lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163739/170504_matthew-pei-san_ria-mishaal-photography_0957_im3era.jpg",
    width: 1200,
    height: 900,
    alt: "Matthew and Pei San's wedding reception with stunning fairy light tunnel and professional wedding lighting, captured by Ria Mishaal Photography",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163700/Pennard-House_koaxfj.jpg",
    width: 1200,
    height: 900,
    alt: "Pennard House wedding venue with elegant exterior lighting design and atmospheric wedding lighting installations",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163694/Jade-and-Emma-1081-1_bmnwh0.jpg",
    width: 1200,
    height: 900,
    alt: "Jade and Emma's wedding with beautiful fairy light installations and romantic wedding lighting design creating a magical atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163641/Pennard-House-Festoon-Pizzarova_rpdwep.jpg",
    width: 1200,
    height: 900,
    alt: "Pennard House wedding venue with festoon lighting and elegant outdoor wedding lighting design for alfresco dining",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768731827/Camilla-Richard-0063_ngmblz.jpg",
    width: 1200,
    height: 900,
    alt: "Camilla and Richard's wedding reception with elegant lighting design, beautiful table settings, and atmospheric wedding lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163596/STYLISH-babs-july2016_ria-mishaal-photography_006_qmds40.jpg",
    width: 1200,
    height: 900,
    alt: "Babington House wedding with professional lighting design and elegant wedding lighting installations, captured by Ria Mishaal Photography",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768741340/_F4R3275_tukoww.jpg",
    width: 1200,
    height: 900,
    alt: "Chill Out Camp with vintage Edison festoon lighting and fairy lights creating a magical wedding atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768741619/IMG_0487_aoaxho.jpg",
    width: 1200,
    height: 900,
    alt: "Bar terrace with elegant wedding lighting design creating a romantic atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768742034/IMG_1348_161201_zwmdh2.jpg",
    width: 1200,
    height: 900,
    alt: "Wedding venue with beautiful lighting and elegant styling",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768742094/IMG_4162_h3h0bb.jpg",
    width: 1200,
    height: 900,
    alt: "Sophisticated wedding lighting design creating an atmospheric celebration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163734/F4R3490_dyrug0.jpg",
    width: 1200,
    height: 900,
    alt: "Professional wedding and party lighting creating an atmospheric celebration",
  },
];

export default function WeddingLightingClient() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-50 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163797/150730_sami-tammy_ria-mishaal-photography_775_bbo9bb.jpg"
            alt="Sami and Tammy's wedding with beautiful lighting design creating an elegant and romantic atmosphere, captured by Ria Mishaal Photography"
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
      <section className="py-16 px-3 sm:px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              Transform ordinary spaces into extraordinary celebrations with our bespoke wedding lighting design.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              We create custom lighting installations tailored to your venue – from charming barns and elegant marquees to luxury venues and intimate home celebrations. Our expertise extends outdoors too, illuminating alfresco dining areas, terraces, walkways, and natural features to create a cohesive, magical atmosphere throughout your celebration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-3 sm:px-4 bg-gray-900">
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

      {/* Reputation & Service Area Section */}
      <section className="py-20 bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Column 1: Reputation & Trust */}
            <div className="space-y-6">
              <h2 className="text-3xl font-serif text-white">A Reputation Built on <span className="text-champagne-gold">Flawless Execution</span></h2>
              <p className="text-gray-300 leading-relaxed">
                At STYLISH Entertainment, we provide more than just equipment; we offer genuine guidance. 
                Our clients trust us to transform their most important moments into masterpieces.
              </p>
              <Link 
                href="/testi" 
                className="inline-flex items-center gap-2 text-champagne-gold hover:text-white transition-colors group"
              >
                <span className="border-b border-champagne-gold">Read Client Experiences</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Column 2: Service Area & Fast Contact */}
            <Card className="bg-white/5 border-champagne-gold/20 backdrop-blur-xl p-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-champagne-gold mb-4">Serving the West Country</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Somerset", "Wiltshire", "Dorset", "Gloucestershire", "Bath", "Bristol", "Exeter"].map((area) => (
                      <span key={area} className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-200">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-gray-400 text-sm mb-4">Reach out to Nigel or Ali directly:</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href="tel:+447970793177" 
                      className="flex items-center justify-center gap-3 bg-champagne-gold text-black font-bold py-3 px-6 rounded-lg hover:bg-white transition-all shadow-lg"
                    >
                      <Phone className="w-5 h-5" />
                      07970 793177
                    </a>
                    <Button variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
                      <Link href="/contact-us">Inquire Online</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const kinHousePhotos = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163122/Kin-House-Mirroball-Package_gu9htw.jpg",
    alt: "Stage, Band lighting, PA and Glitter Ball at Kin House",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162837/02B12F9E-2B68-4AC4-9222-1CB8636346B5_1_105_c-e1711128118139_etauug.jpg",
    alt: "Fairy-light canopy in Kilvert Hall at Kin House",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163212/Kin-House-Kilvert-Hall-Lighting_htlcbj.jpg",
    alt: "Perfect for winter and autumn weddings and events at Kin House",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162715/Kin-House-Exterior-Terrace-Lighting_lxvlpk.jpg",
    alt: "Exterior terrace lighting at Kin House",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162649/Kin-House-Mirrorball-Clusters_fi5n50.jpg",
    alt: "Our cluster of Gold and Silver Mirrorballs of multi-size in the bar at Kin House",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163147/Kin-House-Stage-Supply_rj6ipz.jpg",
    alt: "Stage supply from Stylish Entertainment at Kin House",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162617/Kin-House-Stage-and-Lighting-supply_ufpxbl.jpg",
    alt: "Band Lighting and stage supply with retro lights at Kin House",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162262/Kin-House-LED-up-lighting_fr3ypq.jpg",
    alt: "LED mood lighting in use at Kilvert Bar at Kin House",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163012/Kin-House-Violet-Mood-Lighting_i8xos3.jpg",
    alt: "Add some mood lighting at your Kin House Wedding or party",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162252/Kin-House-Kilvert-Hall_ukg4ln.jpg",
    alt: "A party in full swing with DJ and Mirrorball lighting at Kin House",
  },
];

export default function KinHouseWiltshire() {
  useEffect(() => {
    document.title = "Kin House, Wiltshire | Wedding Lighting & Production | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Professional wedding lighting and production services for Kin House, Wiltshire. Mirrorball packages, stage supply, party lighting, and creative lighting solutions. Contact STYLISH Entertainment.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162508/Kin-House-Stage-Lighting-and-Sound-supply_j8yln4.jpg"
            alt="Kin House, Wiltshire wedding venue with professional lighting and production"
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
            Kin House, Wiltshire
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white font-semibold px-4 drop-shadow-md">
            Lighting, Staging & Production
          </p>
        </motion.div>
      </section>

      {/* Content */}
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
                  <p className="text-lg">
                    At Kin House, Wiltshire, we&apos;re honoured to be the trusted lighting and production partner for this exceptional venue. With years of experience working alongside the Kin House team, we understand the unique character and charm of this beautiful setting. Our passion lies in crafting bespoke lighting designs that enhance the venue&apos;s natural elegance while bringing your personal vision to life.
                  </p>

                  <p>
                    From intimate ceremonies to grand receptions, we work closely with you to create a seamless production that transforms every space. Our attention to detail and commitment to excellence ensures that your celebration at Kin House will be nothing short of spectacular, leaving you and your guests with memories that will last a lifetime.
                  </p>

                  <div className="my-8 p-6 bg-gray-800/50 rounded-lg border border-champagne-gold/20">
                    <h3 className="text-xl md:text-2xl font-bold text-champagne-gold mb-4">Our services include:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      <li>Mirrorball packages</li>
                      <li>Stage supply</li>
                      <li>Party lighting</li>
                      <li>Stage lighting</li>
                      <li>Exterior and interior creative lighting</li>
                    </ul>
                  </div>

                  <div className="my-12">
                    <div className="bg-white">
                      {kinHousePhotos.map((photo, index) => (
                        <div key={index} className="w-full">
                          <div className="h-screen min-h-[100vh] relative">
                            <img
                              src={photo.src}
                              alt={photo.alt}
                              className="w-full h-full object-cover"
                              loading={index === 0 ? "eager" : "lazy"}
                            />
                          </div>
                          {index < kinHousePhotos.length - 1 && (
                            <div className="h-8 md:h-12 bg-white"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="my-8 p-6 bg-gray-800/50 rounded-lg border border-champagne-gold/20">
                    <p className="text-lg">
                      Contact Ali or Nigel at Stylish Entertainment about your wedding, party or event at Kin House in Wiltshire where we are a trusted local supplier and know the team at Kin well.
                    </p>
                    <p className="mt-4">
                      <Link href="/contact-us" className="text-champagne-gold hover:text-gold-light underline">
                        Contact us
                      </Link>
                      {" "}today to discuss your Kin House lighting and production requirements.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

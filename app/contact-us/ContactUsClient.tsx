"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ContactForm from "./ContactForm";

export default function ContactUsClient() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162649/Kin-House-Mirrorball-Clusters_fi5n50.jpg"
            alt="Kin House wedding venue with elegant mirrorball clusters and professional lighting design, showcasing our wedding entertainment services"
            fill
            className="object-cover object-center opacity-25 brightness-110"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-gray-900" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Let&apos;s discuss how we can make your event exceptional
          </p>
        </motion.div>
      </section>

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
}

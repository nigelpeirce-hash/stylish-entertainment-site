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
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto,w_1200/v1768754478/IMG_2866_zhs5sz.jpg"
            alt="Contact Us Hero"
            fill
            className="object-cover object-center opacity-50 brightness-110"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/30 to-gray-900" />
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

      {/* Contact Form Section */}
      <section
        className="pt-20 pb-8 px-4 relative contact-ui"
        style={{
          background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
        }}
      >
        <div className="container mx-auto max-w-3xl">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { CONTACT_US_HERO_ALT, CONTACT_US_HERO_LCP_URL } from "@/lib/contact-us-hero";

const formSectionBg = {
  background:
    "radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)",
};

/** Form bundle split — hero paints first, then form hydrates (lower mobile TBT). */
const ContactForm = dynamic(() => import("./ContactForm"), {
  ssr: true,
  loading: () => (
    <section
      className="pt-12 pb-8 px-4 relative contact-ui md:pt-20"
      style={formSectionBg}
      aria-hidden
    >
      <div className="container mx-auto max-w-3xl">
        <div className="h-[420px] animate-pulse rounded-xl border border-champagne-gold/20 bg-gray-800/40 md:h-[480px]" />
      </div>
    </section>
  ),
});

export default function ContactUsClient() {
  return (
    <div>
      {/* Hero — shorter on mobile; static copy (no motion) for LCP */}
      <section className="relative flex min-h-[50vh] min-h-[380px] items-center justify-center overflow-hidden bg-gray-900 text-white md:min-h-[60vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src={CONTACT_US_HERO_LCP_URL}
            alt={CONTACT_US_HERO_ALT}
            fill
            className="object-cover object-center brightness-110 opacity-50"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/30 to-gray-900" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 pt-32 text-center md:pt-52">
          <h1 className="mb-4 px-4 text-3xl font-bold text-white drop-shadow-lg sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="px-4 text-lg font-semibold text-white drop-shadow-md sm:text-xl md:text-2xl">
            Let&apos;s discuss how we can make your event exceptional
          </p>
        </div>
      </section>

      <ContactForm />
    </div>
  );
}

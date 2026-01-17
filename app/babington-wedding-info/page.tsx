"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BlogImage from "@/components/BlogImage";
import { useEffect } from "react";

const allImages = [
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162621/Babington-House-in-Green_oms0ws.jpg", alt: "Babington House wedding venue exterior" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163328/Nigel-DJ-Babs-House-0021-1_xmxz8v.jpg", alt: "Professional DJ setup by DJ Nige at Babington House" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw", alt: "Fairy light tunnel at Babington House" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162522/Babington-House-Bar-with-DJ-Niges-setup_zdgqtq.jpg", alt: "Babington House bar with DJ Nige's setup" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162299/STYLISH-babs-july2016_ria-mishaal-photography_017_xsbk3l.jpg", alt: "Babington House front of house with bush lighting" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163408/Babington-House-Alfresco-dining-daytime_xk0vra.jpg", alt: "Babington House croquet lawn alfresco dining" },
];

export default function BabingtonWeddingInfo() {
  useEffect(() => {
    document.title = "Babington House Wedding Info | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Comprehensive guide to planning your Babington House wedding. DJ Nige shares insights on the bar, terrace, orangery, and other areas of this stunning venue."
      );
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162621/Babington-House-in-Green_oms0ws.jpg"
            alt="Babington House wedding venue exterior"
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
            Babington House Wedding Info
          </h1>
        </motion.div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              Congratulations on booking your Babington House wedding, you have chosen the best venue in the UK to get married – in my opinion. Since 2003 when I played my first DJ set at a Babington wedding, I have seen many things – some beautiful, some tear-jerking and some odd!
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              To assist you with your planning and understanding of how weddings generally flow at Babington, I have offered my thoughts below on the different areas of the site which I hope you find useful.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed font-semibold">
              DJ Nige
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Bar */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Bar</h2>
            <p className="text-white text-lg leading-relaxed mb-4">
              The Babington bar is an excellent space for a party and can hold more people than you think. On New Years Eve we have over 200 celebrating at midnight and it&apos;s an amazing atmosphere.
            </p>
            <p className="text-white text-lg leading-relaxed mb-4">
              If you are opting for a solo DJ with decks, sound-system and lighting, the small tables are removed along with the easy chairs to create a good-sized dance-floor.
            </p>
            <p className="text-white text-lg leading-relaxed mb-6">
              When a band and DJ are used you will lose some of the bar sofas. Once removed they do not go back into the bar until the following morning, which means, there are no comfy spaces to sit and watch the dancing or, for any after hours activity.
            </p>
            <div className="relative w-full overflow-hidden rounded-lg bg-gray-900 shadow-lg my-6">
              <BlogImage
                src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162522/Babington-House-Bar-with-DJ-Niges-setup_zdgqtq.jpg"
                alt="Babington House bar with DJ Nige's setup and atmospheric lighting"
                images={allImages}
                index={3}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bar Terrace */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Bar Terrace</h2>
            <p className="text-white text-lg leading-relaxed mb-4">
              The bar terrace is a great space for summer weddings, it&apos;s linked to the bar so you can hear and interact with the music but enjoy a cigar around a table with your friends and family.
            </p>
            <p className="text-white text-lg leading-relaxed mb-6">
              There is no lighting permanently installed and it can be very dark if there is no moon. You are allocated money for lighting from your wedding package and we can happily advise if you are undecided what will work for you. Below are some options that are tried and tested, we can also create bespoke lighting to your requirements and brief.
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-champagne-gold mb-2">Light and Shade</h3>
                <p className="text-gray-300 mb-4">
                  We call this Light and Shade Tree lighting and it&apos;s installed on the large pine tree on the bar terrace. Great for Insta shots. We have had it described as Iconic (not by us)!
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-champagne-gold mb-2">LED Spheres</h3>
                <p className="text-gray-300 mb-4">
                  Beautiful LED spheres hung in the Pine Tree. Practically invisible during the day, once dusk falls they really add drama to the already beautiful tree.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-champagne-gold mb-2">Chill Out Camp</h3>
                <p className="text-gray-300 mb-4">
                  Linking the Bar this lighting installation uses vintage Edison festoon lighting wrapped in fairy-lights. The Edison is dimmable so that the bar and bar terrace work in unison to create a magical atmosphere.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-champagne-gold mb-2">Free Standing Bar Terrace Canopy</h3>
                <p className="text-gray-300 mb-4">
                  Free standing lighting canopy with optional white shades.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-champagne-gold mb-2">Edison Vintage Tree Lighting</h3>
                <p className="text-gray-300">
                  Vintage Edison Bulbs for a beautiful, warm atmosphere.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Front of House */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Front of House</h2>
            <p className="text-white text-lg leading-relaxed mb-4">
              During the months where the bar terrace is unavailable (October – April generally) The front of the house plays a more important role. Any smokers in the group will gravitate outside on the main turning circle. The view is towards the church, drive and the front of house.
            </p>
            <p className="text-white text-lg leading-relaxed mb-6">
              We call these Fairies in the bushes and they help to illuminate the entrance and turning circle. Great for Insta shots.
            </p>
            <div className="relative w-full overflow-hidden rounded-lg bg-gray-900 shadow-lg my-6">
              <BlogImage
                src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162299/STYLISH-babs-july2016_ria-mishaal-photography_017_xsbk3l.jpg"
                alt="Babington House front of house with fairy lights in bushes and tree lighting"
                images={allImages}
                index={4}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Croquet Lawn */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Croquet Lawn</h2>
            <p className="text-white text-lg leading-relaxed mb-6">
              An underused space (in my opinion) but can be used for some fun for kids and kidults! If you are into Alfresco dining, it&apos;s a lovely experience for your family and friends.
            </p>
            <div className="relative w-full overflow-hidden rounded-lg bg-gray-900 shadow-lg my-6">
              <BlogImage
                src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163408/Babington-House-Alfresco-dining-daytime_xk0vra.jpg"
                alt="Babington House croquet lawn set up for alfresco dining with festoon lighting"
                images={allImages}
                index={5}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Orangery */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Orangery</h2>
            <p className="text-white text-lg leading-relaxed">
              One of the finest dining rooms in the whole world! The Orangery does not need much as it&apos;s already stunning but to make it more sparkly for a wedding we often install lighting for winter and autumn weddings.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Walled Garden */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Walled Garden</h2>
            <p className="text-white text-lg leading-relaxed mb-4">
              Often used for pre-wedding BBQ&apos;s on a Wednesday night, the walled garden is a delightful area during the summer. A well loved and tended garden with an abundance of flowers, vegetables & apple trees in a Soho House style. We offer a lighting canopy that covers the dining tables, BBQ and bar. In addition to lighting we often supply a PA with microphone for welcome speeches and music playback.
            </p>
            <p className="text-white text-lg leading-relaxed">
              This fairy light canopy can be created in any space using free standing supports. Stunning all times of the year.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Other */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Other</h2>
            <p className="text-white text-lg leading-relaxed">
              We work with a variety of musicians, from saxophone players who jam along with the DJ to pianists and singers for cocktail sets. We can also provide confetti cannons for first dances and create unique lighting installations tailored to your vision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-20 pb-8 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Questions About Your Babington House Wedding?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
                <Link href="/contact-us">Get in Touch</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-black transition-all duration-300">
                <Link href="/artists/djs">Visit DJ Nige&apos;s Page</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

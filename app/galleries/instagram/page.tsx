"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { Instagram } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Featured Instagram Posts - Add your image data here
interface InstagramPost {
  image: string;
  caption: string;
  instagramUrl: string;
}

const featuredPosts: InstagramPost[] = [
  // Add your Instagram post data here
  // Example structure:
  // {
  //   image: "https://res.cloudinary.com/drtwveoqo/image/upload/...",
  //   caption: "Beautiful wedding lighting installation",
  //   instagramUrl: "https://www.instagram.com/p/ABC123/",
  // },
];

export default function InstagramFeed() {
  useEffect(() => {
    document.title = "Instagram Feed | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Follow our latest work on Instagram. See behind-the-scenes photos, event highlights, and stunning venue transformations from Stylish Entertainment.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-50 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw"
            alt="Instagram feed showcasing our work"
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
          <div className="flex items-center justify-center gap-4 mb-4">
            <Instagram className="w-12 h-12 text-champagne-gold" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans text-white font-bold px-4 drop-shadow-lg">Instagram Feed</h1>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Follow our latest work and behind-the-scenes moments
          </p>
        </motion.div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-16 bg-gray-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              Get a glimpse into our latest events, venue transformations, and behind-the-scenes moments. 
              Follow us on Instagram to see our work in real-time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Instagram Posts Grid */}
      {featuredPosts.length > 0 ? (
        <section className="py-12 md:py-16 bg-gray-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-champagne-gold mb-4">
                Latest Posts
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {featuredPosts.map((post, index) => (
                <motion.a
                  key={index}
                  href={post.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="relative group aspect-square overflow-hidden rounded-xl cursor-pointer"
                >
                  <Image
                    src={post.image}
                    alt={post.caption}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-champagne-gold/0 group-hover:bg-champagne-gold/80 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                    {/* Instagram Icon */}
                    <Instagram className="w-12 h-12 md:w-16 md:h-16 text-white mb-4 drop-shadow-lg" />
                    
                    {/* Caption at bottom */}
                    {post.caption && (
                      <p className="absolute bottom-0 left-0 right-0 p-4 text-white text-sm md:text-base font-medium text-center bg-gradient-to-t from-black/80 via-black/60 to-transparent line-clamp-2">
                        {post.caption}
                      </p>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-12 md:py-16 bg-gray-900">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gray-400 text-lg mb-8">
                Instagram posts will appear here. Add posts to the featuredPosts array in the code.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <Link
              href="https://www.instagram.com/stylishentertainment/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white/5 backdrop-blur-md border border-champagne-gold/30 hover:border-champagne-gold/60 hover:bg-champagne-gold/10 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-champagne-gold/20"
            >
              <Instagram className="w-6 h-6 text-champagne-gold group-hover:scale-110 transition-transform duration-300" />
              <span className="text-white font-semibold text-lg group-hover:text-champagne-gold transition-colors duration-300">
                Follow @stylishentertainment
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
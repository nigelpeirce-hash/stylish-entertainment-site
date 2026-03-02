"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import LazyIframe from "@/components/LazyIframe";
import { Play } from "lucide-react";

const VIDEOS = [
  { id: "5VChJyJMIfs", title: "DJ performance and crowd energy" },
  { id: "EPq35ZF1Awc", title: "Wedding party dance floor excitement" },
  { id: "3TnzdP0IhTU", title: "Celebration moments and guest reactions" },
  { id: "iGCx-ZzMMtw", title: "Fun party atmosphere and music mixing" },
];

export default function DJsVideoGallery() {
  return (
    <section className="py-20 px-3 sm:px-4 bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
            <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">The Fun We Create</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-3 sm:mb-4 text-white font-bold px-4">
            See The <span className="text-gradient">Party In Action</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
            Real sets from weddings, parties and events—see the energy we bring to the room.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {VIDEOS.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <Card className="bg-gray-800/50 backdrop-blur-sm border-2 border-champagne-gold/30 shadow-xl overflow-hidden hover:border-champagne-gold/60 transition-all duration-300 hover:shadow-2xl h-full">
                <CardContent className="p-0">
                  <div className="relative w-full aspect-[9/16] rounded-t-lg overflow-hidden bg-gray-900">
                    <LazyIframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={`${video.title} - Stylish Entertainment DJ Services`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-champagne-gold/20 rounded-full blur-xl scale-150 group-hover:scale-175 transition-transform duration-300" />
                        <div className="relative bg-champagne-gold/95 backdrop-blur-sm rounded-full p-4 md:p-5 shadow-2xl border-2 border-white/30 group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-8 h-8 md:w-10 md:h-10 text-black ml-1" fill="currentColor" strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <Play className="w-4 h-4 text-champagne-gold" fill="currentColor" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

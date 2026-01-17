"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 400px
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none"
        >
          <Link 
            href="/contact-us/"
            className="pointer-events-auto flex items-center gap-3 bg-champagne-gold text-gray-900 px-8 py-4 rounded-full font-bold shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform active:scale-95 group"
          >
            <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Check Availability for Your Date</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

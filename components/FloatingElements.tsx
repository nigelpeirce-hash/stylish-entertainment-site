"use client";

import { motion } from "framer-motion";

export default function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute"
          initial={{
            x: `${(i * 16.66) % 100}%`,
            y: `${20 + (i * 15)}%`,
            opacity: 0.1,
          }}
          animate={{
            x: [`${(i * 16.66) % 100}%`, `${((i * 16.66) + 5) % 100}%`, `${(i * 16.66) % 100}%`],
            y: [`${20 + (i * 15)}%`, `${25 + (i * 15)}%`, `${20 + (i * 15)}%`],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8 + (i % 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          <div className="w-2 h-2 bg-champagne-gold/20 rounded-full blur-sm"></div>
        </motion.div>
      ))}
      
      {/* Slow floating circles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute"
          initial={{
            x: `${(i * 25) % 100}%`,
            y: `${30 + (i * 20)}%`,
          }}
          animate={{
            x: [`${(i * 25) % 100}%`, `${((i * 25) + 3) % 100}%`, `${(i * 25) % 100}%`],
            y: [`${30 + (i * 20)}%`, `${32 + (i * 20)}%`, `${30 + (i * 20)}%`],
          }}
          transition={{
            duration: 12 + (i % 4),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1,
          }}
        >
          <div className="w-32 h-32 bg-champagne-gold/5 rounded-full blur-2xl"></div>
        </motion.div>
      ))}
    </div>
  );
}

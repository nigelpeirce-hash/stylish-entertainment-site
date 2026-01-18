"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useClientStatus } from "@/hooks/useClientStatus";

const WelcomeBanner = () => {
  const { isReturning, clientName } = useClientStatus();

  if (!isReturning) return null;

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      className="bg-gray-950 border-b border-champagne-gold/30 py-2 px-4"
    >
      <div className="container mx-auto flex justify-center items-center gap-4 text-xs md:text-sm">
        <span className="text-gray-300">
          Welcome back{clientName ? `, ${clientName}` : ''}. We have provisionally held your date.
        </span>
        <Link 
          href="/dashboard/secure-booking" 
          className="text-champagne-gold font-bold hover:text-white underline decoration-champagne-gold/50 underline-offset-4 transition-colors"
        >
          Finalise Your Booking →
        </Link>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;

"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useClientStatus } from "@/hooks/useClientStatus";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * AuthButton without useClientStatus – avoids useSearchParams suspend.
 * Use in HeaderNew / demo routes where useSearchParams causes infinite loading.
 * Skips "Secure My Date" for returning clients; shows Enquire/Dashboard/Sign Out.
 */
export function AuthButtonSimple() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (status === "loading" || !mounted) {
    return (
      <Link href="/contact-us">
        <Button
          variant="outline"
          size="sm"
          className="border-champagne-gold/50 text-white hover:bg-champagne-gold/20"
        >
          Enquire
        </Button>
      </Link>
    );
  }

  if (session) {
    const isAdmin = (session.user as any)?.role === "admin";
    return (
      <div className="flex items-center gap-2">
        <Link href={isAdmin ? "/admin" : "/client/dashboard"}>
          <Button
            variant="outline"
            size="sm"
            className="border-champagne-gold/50 text-white hover:bg-champagne-gold/20"
          >
            <User className="w-4 h-4 mr-2" />
            {isAdmin ? "Admin" : "Dashboard"}
          </Button>
        </Link>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="outline"
          size="sm"
          className="border-champagne-gold/50 text-white hover:bg-champagne-gold/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Link href="/contact-us">
      <Button
        variant="outline"
        size="sm"
        className="border-champagne-gold/50 text-white hover:bg-champagne-gold/20"
      >
        Enquire
      </Button>
    </Link>
  );
}

export function AuthButton() {
  const { data: session, status } = useSession();
  const { isReturning } = useClientStatus();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only showing client-side state after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle loading and error states gracefully
  if (status === "loading" || !mounted) {
    // Return consistent UI during SSR and initial client render
    return (
      <Link href="/contact-us">
        <Button
          variant="outline"
          size="sm"
          className="border-champagne-gold/50 text-white hover:bg-champagne-gold/20"
        >
          Enquire
        </Button>
      </Link>
    );
  }

  if (session) {
    const isAdmin = (session.user as any)?.role === "admin";
    return (
      <div className="flex items-center gap-2">
        <Link href={isAdmin ? "/admin" : "/client/dashboard"}>
          <Button
            variant="outline"
            size="sm"
            className="border-champagne-gold/50 text-white hover:bg-champagne-gold/20"
          >
            <User className="w-4 h-4 mr-2" />
            {isAdmin ? "Admin" : "Dashboard"}
          </Button>
        </Link>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="outline"
          size="sm"
          className="border-champagne-gold/50 text-white hover:bg-champagne-gold/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  // Show "Secure My Date" for returning clients with pulse animation
  if (isReturning) {
    return (
      <div className="relative group">
        <Link href="/dashboard/secure-booking">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Button
              variant="outline"
              size="sm"
              className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/20 font-semibold relative"
              title="Welcome back! Your booking is ready to finalise."
            >
              <span className="absolute -top-1 -left-1 text-[10px] text-champagne-gold font-bold opacity-80">
                S
              </span>
              Secure My Date
            </Button>
          </motion.div>
        </Link>
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-gray-900 text-white text-xs py-1.5 px-3 rounded-md whitespace-nowrap shadow-lg border border-champagne-gold/30">
            Welcome back! Your booking is ready to finalise.
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
              <div className="border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href="/contact-us">
      <Button
        variant="outline"
        size="sm"
        className="border-champagne-gold/50 text-white hover:bg-champagne-gold/20"
      >
        Enquire
      </Button>
    </Link>
  );
}

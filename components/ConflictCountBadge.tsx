"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export function ConflictCountBadge() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Defer first fetch so main page data (bookings, threads) loads first
    const initialTimer = setTimeout(fetchConflictCount, 800);
    const interval = setInterval(fetchConflictCount, 300000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const fetchConflictCount = async () => {
    try {
      const response = await fetch("/api/admin/bookings/conflicts/count/", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setCount(data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching conflict count:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || count === 0) {
    return null;
  }

  return (
    <Link href="/admin/bookings?filter=conflicts">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
      >
        <div className="bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl p-4 flex items-center gap-3 min-w-[200px] border-2 border-red-400">
          <div className="relative">
            <AlertTriangle className="w-6 h-6" />
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-red-600"
              >
                {count > 9 ? "9+" : count}
              </motion.span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">Unresolved Conflicts</p>
            <p className="text-xs opacity-90">
              {count === 1 ? "1 conflict" : `${count} conflicts`}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

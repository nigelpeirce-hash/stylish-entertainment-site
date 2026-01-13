"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar } from "lucide-react";
import CountdownClock from "@/components/CountdownClock";

export default function DemoCountdownPage() {
  useEffect(() => {
    document.title = "Countdown Clock Demo | Stylish Entertainment";
  }, []);

  // Demo dates - one in the future, one soon, one today
  const longDate = new Date(Date.now() + 550 * 24 * 60 * 60 * 1000); // ~1.5 years from now
  const futureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days from now
  const soonDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const todayDate = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Old-School Digital Countdown Clock
          </h1>
          <p className="text-gray-400 text-lg mb-4">
            Retro LED-style countdown display for wedding dates
          </p>
          <Link 
            href="/client/dashboard" 
            className="text-champagne-gold hover:text-gold-light underline"
          >
            View in Client Dashboard (requires login)
          </Link>
        </motion.div>

        {/* Demo 1: 90 Days Away */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-champagne-gold" />
                Countdown to Wedding (90 Days Away)
              </CardTitle>
              <p className="text-gray-400 text-sm mt-2">
                Wedding Date: {futureDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </CardHeader>
            <CardContent>
              <CountdownClock targetDate={futureDate} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo 3: 7 Days Away */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gray-800 border-orange-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Calendar className="w-5 h-5 text-orange-400" />
                Countdown to Wedding (7 Days Away)
              </CardTitle>
              <p className="text-gray-400 text-sm mt-2">
                Wedding Date: {soonDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </CardHeader>
            <CardContent>
              <CountdownClock targetDate={soonDate} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo 4: 1 Hour Away */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <Card className="bg-gray-800 border-red-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Calendar className="w-5 h-5 text-red-400" />
                Countdown to Wedding (1 Hour Away)
              </CardTitle>
              <p className="text-gray-400 text-sm mt-2">
                Wedding Date: {todayDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at {todayDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </CardHeader>
            <CardContent>
              <CountdownClock targetDate={todayDate} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-champagne-gold mt-1">•</span>
                  <div>
                    <strong className="text-champagne-gold">Old-School Digital Display</strong>
                    <p className="text-sm text-gray-400">Green LED-style digits on black background with retro aesthetic</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-champagne-gold mt-1">•</span>
                  <div>
                    <strong className="text-champagne-gold">Real-Time Updates</strong>
                    <p className="text-sm text-gray-400">Updates every second with smooth animations</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-champagne-gold mt-1">•</span>
                  <div>
                    <strong className="text-champagne-gold">Multiple Time Units</strong>
                    <p className="text-sm text-gray-400">Shows days, hours, minutes, and seconds until the wedding</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-champagne-gold mt-1">•</span>
                  <div>
                    <strong className="text-champagne-gold">Visual Effects</strong>
                    <p className="text-sm text-gray-400">Glowing digits, blinking separators, and gold accents</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-champagne-gold mt-1">•</span>
                  <div>
                    <strong className="text-champagne-gold">Responsive Design</strong>
                    <p className="text-sm text-gray-400">Works perfectly on desktop, tablet, and mobile devices</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Link
            href="/demo-client-dashboard"
            className="text-champagne-gold hover:text-gold-light underline"
          >
            ← Back to Dashboard Demo
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

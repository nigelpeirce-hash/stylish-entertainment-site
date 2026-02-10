"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  PartyPopper, 
  Music, 
  Lightbulb, 
  Camera, 
  ArrowRight,
  Heart,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ThankYouPage() {
  const params = useParams();
  const token = params.token as string;
  const [coupleName, setCoupleName] = useState<string>("");

  // Fetch couple name for personalization
  useEffect(() => {
    async function fetchInfo() {
      try {
        const res = await fetch(`/api/guest-requests/${token}`);
        if (res.ok) {
          const data = await res.json();
          setCoupleName(data.coupleName || "");
        }
      } catch (err) {
        // Silent fail - not critical
      }
    }
    if (token) fetchInfo();
  }, [token]);

  const services = [
    {
      icon: Music,
      title: "Professional DJs",
      description: "Expert DJs who read the room and keep the dance floor packed all night.",
      href: "/artists/djs",
      color: "from-purple-500/20 to-purple-600/10",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
    },
    {
      icon: Lightbulb,
      title: "Lighting Design",
      description: "Transform any venue with stunning lighting that creates the perfect atmosphere.",
      href: "/services/lighting-design",
      color: "from-amber-500/20 to-amber-600/10",
      borderColor: "border-amber-500/30",
      iconColor: "text-amber-400",
    },
    {
      icon: Camera,
      title: "View Our Gallery",
      description: "See how we've helped couples create unforgettable celebrations.",
      href: "/galleries",
      color: "from-champagne-gold/20 to-champagne-gold/10",
      borderColor: "border-champagne-gold/30",
      iconColor: "text-champagne-gold",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Celebration Header */}
      <header className="pt-12 pb-8 px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-champagne-gold to-yellow-500 flex items-center justify-center"
        >
          <PartyPopper className="w-10 h-10 text-black" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Thank You!
          </h1>
          <p className="text-gray-300 text-lg max-w-md mx-auto">
            Your song requests have been added to {coupleName ? `${coupleName}'s` : "the"} playlist.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-2 text-champagne-gold"
        >
          <Heart className="w-4 h-4" />
          <span className="text-sm">We can&apos;t wait to play them!</span>
          <Heart className="w-4 h-4" />
        </motion.div>
      </header>

      {/* Divider */}
      <div className="max-w-xs mx-auto px-4">
        <div className="border-t border-gray-700 relative">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 px-4">
            <Sparkles className="w-5 h-5 text-champagne-gold" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <main className="max-w-lg mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-2">
            Planning Your Own Celebration?
          </h2>
          <p className="text-gray-400">
            We&apos;d love to help make it unforgettable.
          </p>
        </motion.div>

        <div className="space-y-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Link href={service.href}>
                <Card className={`bg-gradient-to-r ${service.color} ${service.borderColor} hover:scale-[1.02] transition-transform cursor-pointer`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gray-900/50 flex items-center justify-center flex-shrink-0`}>
                      <service.icon className={`w-6 h-6 ${service.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold">{service.title}</h3>
                      <p className="text-gray-400 text-sm">{service.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center"
        >
          <Link href="/contact-us/">
            <Button className="bg-champagne-gold text-black hover:bg-gold-light font-semibold px-8 py-6 text-lg">
              Get a Free Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <Link
            href={`/requests/${token}`}
            className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
          >
            ← Back to song requests
          </Link>
        </motion.div>
      </main>

      {/* Brand Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 mt-8">
        <div className="max-w-lg mx-auto text-center">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png"
              alt="Stylish Entertainment Ltd"
              width={180}
              height={56}
              className="mx-auto brightness-[1.2]"
            />
          </Link>
          <p className="text-gray-400 text-sm mb-2">
            Professional Wedding DJs, Lighting Design & Venue Styling
          </p>
          <p className="text-gray-500 text-xs">
            South West • London • UK-wide
          </p>
          <div className="mt-4 flex justify-center gap-4 text-xs text-gray-600">
            <Link href="/privacy-policy" className="hover:text-gray-400">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="hover:text-gray-400">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

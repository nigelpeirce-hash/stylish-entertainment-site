"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DemoBookingForm() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const demos = [
    {
      id: "public",
      title: "Public Booking Form",
      description: "The main booking form accessible to anyone. Includes DJ selection modal and upsell section.",
      url: "/book-dj",
      features: [
        "DJ Selection Modal (opens when DJs is selected)",
        "Upsell Section (appears after selecting services)",
        "Account creation option",
        "All booking fields"
      ]
    },
    {
      id: "client",
      title: "Client Dashboard Booking",
      description: "Booking form for logged-in clients. Same features as public form.",
      url: "/client/bookings/new",
      features: [
        "DJ Selection Modal",
        "Upsell Section",
        "Pre-filled with user info",
        "Linked to user account"
      ],
      requiresAuth: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/admin">
            <Button variant="outline" className="border-champagne-gold text-champagne-gold mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Booking Form Demo</h1>
          <p className="text-gray-400">
            Test the new booking form features: DJ selection modal and upsell section
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {demos.map((demo) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all h-full">
                <CardHeader>
                  <CardTitle className="text-2xl">{demo.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {demo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-champagne-gold mb-2">Features:</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {demo.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-champagne-gold mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {demo.requiresAuth && (
                    <p className="text-xs text-yellow-400 bg-yellow-900/20 p-2 rounded border border-yellow-500/30">
                      ⚠️ Requires login
                    </p>
                  )}
                  <Link href={demo.url} target="_blank">
                    <Button className="w-full bg-champagne-gold text-black hover:bg-gold-light">
                      Open {demo.title}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="text-xl">How to Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <div className="space-y-2">
                <h4 className="font-semibold text-white">1. DJ Selection Modal</h4>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-sm">
                  <li>Open the booking form</li>
                  <li>Check the "DJs" service checkbox</li>
                  <li>A modal will automatically open</li>
                  <li>Select a specific DJ or choose "Any DJ"</li>
                  <li>The selected DJ will appear next to the checkbox</li>
                </ol>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">2. Upsell Section</h4>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-sm">
                  <li>Select at least one main service (DJs, Musicians, etc.)</li>
                  <li>The upsell section will appear below</li>
                  <li>Browse categories: Lighting, Sound, Hire Items, etc.</li>
                  <li>Select multiple upsell items</li>
                  <li>See the count of selected items at the bottom</li>
                </ol>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">3. View in Admin</h4>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-sm">
                  <li>After submitting, go to Admin → Bookings</li>
                  <li>Click "View Details" on any booking</li>
                  <li>See the preferred DJ and upsell items listed</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

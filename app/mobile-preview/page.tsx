"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor, Maximize2, ExternalLink, Chrome, Command } from "lucide-react";
import Link from "next/link";

export default function MobilePreview() {
  useEffect(() => {
    document.title = "Mobile Preview Guide | Stylish Entertainment";
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-champagne-gold mb-4">
            Mobile Preview Guide
          </h1>
          <p className="text-gray-300 text-lg md:text-xl">
            Learn how to test your site on different mobile devices and screen sizes
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Browser Dev Tools Method */}
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <Chrome className="h-6 w-6 text-champagne-gold" />
                Method 1: Browser Dev Tools (Recommended)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-gray-300 space-y-4">
                <p className="text-lg">
                  This is the standard and most reliable way to test mobile views. All modern browsers have built-in mobile device emulation.
                </p>

                <div className="bg-gray-900 p-6 rounded-lg space-y-4">
                  <h3 className="text-xl font-bold text-champagne-gold">Step-by-Step Instructions:</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="bg-champagne-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-white mb-1">Open your site</p>
                        <p>Navigate to any page you want to test (e.g., homepage, contact, etc.)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-champagne-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-white mb-1">Open Dev Tools</p>
                        <p>Press <kbd className="bg-gray-700 px-2 py-1 rounded text-sm">F12</kbd> (Windows/Linux) or <kbd className="bg-gray-700 px-2 py-1 rounded text-sm">Cmd+Option+I</kbd> (Mac)</p>
                        <p className="text-sm text-gray-400 mt-1">Or right-click and select &quot;Inspect&quot;</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-champagne-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-white mb-1">Enable Device Toolbar</p>
                        <p>Press <kbd className="bg-gray-700 px-2 py-1 rounded text-sm">Ctrl+Shift+M</kbd> (Windows/Linux) or <kbd className="bg-gray-700 px-2 py-1 rounded text-sm">Cmd+Shift+M</kbd> (Mac)</p>
                        <p className="text-sm text-gray-400 mt-1">Or click the device toolbar icon in the dev tools</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-champagne-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                        4
                      </div>
                      <div>
                        <p className="font-semibold text-white mb-1">Select a Device</p>
                        <p>Choose from the dropdown menu at the top: iPhone, iPad, Samsung Galaxy, etc.</p>
                        <p className="text-sm text-gray-400 mt-1">You can also set custom dimensions</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-champagne-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                        5
                      </div>
                      <div>
                        <p className="font-semibold text-white mb-1">Test Responsiveness</p>
                        <p>Resize the viewport, test touch interactions, and check how your site adapts</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                  <p className="text-blue-200 font-semibold mb-2">💡 Pro Tip:</p>
                  <p className="text-blue-100">
                    Use the throttle network option to test how your site performs on slower connections, just like real mobile devices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <Smartphone className="h-6 w-6 text-champagne-gold" />
                Test These Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { href: "/", label: "Homepage" },
                  { href: "/weddings/wedding-entertainment", label: "Wedding Entertainment" },
                  { href: "/artists/djs", label: "DJs" },
                  { href: "/artists/musicians", label: "Musicians" },
                  { href: "/services/lighting-design", label: "Lighting Design" },
                  { href: "/services/venue-styling", label: "Venue Styling" },
                  { href: "/hire", label: "Hire Shop" },
                  { href: "/contact-us", label: "Contact Us" },
                  { href: "/about/blog", label: "Blog" },
                  { href: "/babington-wedding-info", label: "Babington House" },
                  { href: "/kin-house-wiltshire", label: "Kin House" },
                  { href: "/pennard-house-lighting", label: "Pennard House" },
                  { href: "/mells-barn-weddings", label: "Mells Barn" },
                ].map((page) => (
                  <Button
                    key={page.href}
                    asChild
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-champagne-gold hover:text-champagne-gold justify-start"
                  >
                    <Link href={page.href} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {page.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Common Device Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <h3 className="text-lg font-bold text-champagne-gold mb-3">Mobile Phones</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• iPhone 14 Pro: 390 × 844</li>
                    <li>• iPhone SE: 375 × 667</li>
                    <li>• Samsung Galaxy S21: 360 × 800</li>
                    <li>• Pixel 5: 393 × 851</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-champagne-gold mb-3">Tablets</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• iPad: 768 × 1024</li>
                    <li>• iPad Pro: 1024 × 1366</li>
                    <li>• Samsung Tablet: 800 × 1280</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

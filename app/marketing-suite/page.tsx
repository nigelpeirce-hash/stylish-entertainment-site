"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketingSuite() {
  const logoFiles = [
    {
      name: "Full Logo (Color)",
      file: "/logo-marketing-full.svg",
      description: "Complete logo with text and light rays. Perfect for posters, banners, and full-color printing.",
      useCase: "Posters, banners, business cards, letterheads, full-color printing",
      format: "SVG (scalable to any size)",
    },
    {
      name: "Logo Mark Only",
      file: "/logo-marketing-mark.svg",
      description: "Light rays pattern only (no text). Perfect for t-shirts, merchandise, and when space is limited.",
      useCase: "T-shirts, merchandise, social media avatars, watermarks",
      format: "SVG (scalable to any size)",
    },
    {
      name: "White/Reversed Version",
      file: "/logo-marketing-white.svg",
      description: "White and gold version for dark backgrounds. Perfect for dark t-shirts, black backgrounds, and night events.",
      useCase: "Dark t-shirts, black backgrounds, night event materials, dark website headers",
      format: "SVG (scalable to any size)",
    },
    {
      name: "Single Color Version",
      file: "/logo-marketing-single-color.svg",
      description: "Single color (gold) version for single-color printing. Perfect for cost-effective printing and embroidery.",
      useCase: "Single-color printing, embroidery, cost-effective materials, screen printing",
      format: "SVG (scalable to any size)",
    },
  ];

  const handleDownload = (filename: string) => {
    const link = document.createElement("a");
    link.href = filename;
    link.download = filename.split("/").pop() || "logo.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Marketing Suite
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            High-resolution logo files for print and digital marketing
          </p>
          <p className="text-sm text-gray-400">
            All files are SVG format - scalable to any size without quality loss
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {logoFiles.map((logo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-champagne-gold">
                    {logo.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">{logo.description}</p>
                  
                  {/* Preview on dark background */}
                  <div className="bg-gray-900 rounded-lg p-6 flex items-center justify-center min-h-[200px]">
                    <img
                      src={logo.file}
                      alt={logo.name}
                      className="max-w-full max-h-[180px] object-contain"
                    />
                  </div>
                  
                  {/* Download button */}
                  <Button
                    onClick={() => handleDownload(logo.file)}
                    className="w-full bg-champagne-gold hover:bg-gold-light text-black font-semibold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {logo.name}
                  </Button>
                  
                  {/* Use case and format info */}
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">
                      <strong className="text-champagne-gold">Format:</strong> {logo.format}
                    </p>
                    <p className="text-xs text-gray-400">
                      <strong className="text-champagne-gold">Best for:</strong> {logo.useCase}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 border-2 border-champagne-gold/30 rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold text-champagne-gold mb-4">
            Usage Guidelines & Print Specifications
          </h2>
          <div className="text-gray-300 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-champagne-gold mb-2">Print Specifications</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Resolution:</strong> SVG files are vector-based - they scale to any size without quality loss</li>
                <li><strong>For Print:</strong> Export SVG to PNG/PDF at 300 DPI (dots per inch) for print quality</li>
                <li><strong>Recommended Sizes:</strong> Export at 2x your intended print size (e.g., for 10" width, export at 20" @ 300 DPI)</li>
                <li><strong>Color Mode:</strong> RGB for digital, CMYK conversion needed for professional printing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-champagne-gold mb-2">Color Specifications</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Primary Gold:</strong> #D4AF37 (RGB: 212, 175, 55) / (CMYK: 0, 17, 74, 17)</li>
                <li><strong>Accent Gold:</strong> #F4D03F (RGB: 244, 208, 63) / (CMYK: 0, 15, 74, 4)</li>
                <li><strong>Background:</strong> Transparent (for logos), or #1A1A1A for dark backgrounds</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-champagne-gold mb-2">Export Instructions</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Download the SVG file</li>
                <li>Open in vector graphics software (Adobe Illustrator, Inkscape, or online tools)</li>
                <li>For print: Export as PNG or PDF at 300 DPI at your desired size</li>
                <li>For web: Use SVG directly or export as PNG at 2x resolution (e.g., 2000px wide)</li>
                <li>For t-shirts/merchandise: Provide SVG to your printer/manufacturer</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-champagne-gold mb-2">Recommended Uses</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Full Logo:</strong> Business cards, letterheads, posters, banners, presentations</li>
                <li><strong>Logo Mark:</strong> T-shirts, hats, merchandise, social media, favicons, app icons</li>
                <li><strong>White Version:</strong> Dark t-shirts, black backgrounds, night events, dark websites</li>
                <li><strong>Single Color:</strong> Single-color printing, embroidery, screen printing, cost-effective materials</li>
              </ul>
            </div>
            
            <div className="mt-4 p-4 bg-gray-900 rounded border border-champagne-gold/20">
              <p className="text-sm text-gray-300">
                <strong className="text-champagne-gold">Note:</strong> All logo files are provided in SVG format for maximum flexibility. 
                SVG files can be opened and edited in vector graphics software, and exported to any format (PNG, PDF, JPG, etc.) 
                at any size without quality loss. For best results with professional printing, consult with your printer about 
                color profiles and file format preferences.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

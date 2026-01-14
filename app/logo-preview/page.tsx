"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function LogoPreview() {
  const logos = [
    {
      name: "Option 1: Subtle Light Rays",
      file: "/logo-light-rays-1.svg",
      favicon: "/logo-light-rays-1.svg",
      description: "Subtle and elegant light rays with refined glow. Perfect for a sophisticated, understated brand.",
    },
    {
      name: "Option 2: Dramatic Light Rays",
      file: "/logo-light-rays-2.svg",
      favicon: "/logo-light-rays-2.svg",
      description: "Wider, more dramatic light rays with stronger glow effect. Creates a bold, eye-catching presence.",
    },
    {
      name: "Option 3: Converging Light Rays",
      file: "/logo-light-rays-3.svg",
      favicon: "/logo-light-rays-3.svg",
      description: "Light rays that converge toward the center of the text. Creates focus and draws attention to the typography.",
    },
    {
      name: "Option 4: Fan Pattern Light Rays",
      file: "/logo-light-rays-4.svg",
      favicon: "/logo-light-rays-4.svg",
      description: "Wide fan pattern with rays spreading outward. Creates a dynamic, energetic feel.",
    },
    {
      name: "Option 5: Soft Diffused Light Rays",
      file: "/logo-light-rays-5.svg",
      favicon: "/logo-light-rays-5.svg",
      description: "Softer, more diffused light rays with gentle glow. Elegant and refined with subtle impact.",
    },
    {
      name: "Option 6: Spotlight Effect",
      file: "/logo-light-rays-6.svg",
      favicon: "/logo-light-rays-6.svg",
      description: "Narrower spotlight effect with bright center. Creates a focused, premium lighting feel.",
    },
    {
      name: "Option 7: Diagonal from Corner",
      file: "/logo-light-rays-7.svg",
      favicon: "/logo-light-rays-7.svg",
      description: "Light rays emanating from top-left corner at a diagonal angle. Creates dynamic movement and energy.",
    },
    {
      name: "Option 8: Curved Sweeping Rays",
      file: "/logo-light-rays-8.svg",
      favicon: "/logo-light-rays-8.svg",
      description: "Curved, sweeping light rays that flow across the design. Elegant and fluid movement.",
    },
    {
      name: "Option 9: Radiating from Behind Text",
      file: "/logo-light-rays-9.svg",
      favicon: "/logo-light-rays-9.svg",
      description: "Light rays radiating outward from behind the text in all directions. Creates a halo effect.",
    },
    {
      name: "Option 10: Vertical Cascading Rays",
      file: "/logo-light-rays-10.svg",
      favicon: "/logo-light-rays-10.svg",
      description: "Vertical light rays cascading down from top. Creates a dramatic, stage-lighting effect.",
    },
    {
      name: "Option 11: Upward Angled Rays",
      file: "/logo-light-rays-11.svg",
      favicon: "/logo-light-rays-11.svg",
      description: "Light rays angled upward from bottom-left. Creates an uplifting, energetic feel.",
    },
    {
      name: "Option 11a: Upward Rays (More Dramatic)",
      file: "/logo-light-rays-11a.svg",
      favicon: "/logo-light-rays-11a.svg",
      description: "More dramatic upward angled rays with stronger glow. Bold and energetic.",
    },
    {
      name: "Option 11b: Upward Rays (Wider Spread)",
      file: "/logo-light-rays-11b.svg",
      favicon: "/logo-light-rays-11b.svg",
      description: "Upward rays with wider spread, converging slightly. Creates dynamic movement.",
    },
    {
      name: "Option 11c: Upward Rays (Fan Pattern)",
      file: "/logo-light-rays-11c.svg",
      favicon: "/logo-light-rays-11c.svg",
      description: "Upward rays fanning out from center-bottom. Creates an uplifting, expansive feel.",
    },
    {
      name: "Option 12: V-Shape Framing",
      file: "/logo-light-rays-12.svg",
      favicon: "/logo-light-rays-12.svg",
      description: "Light rays forming a V-shape that frames the text from both sides. Creates focus and elegance.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Logo Design Options
          </h1>
          <p className="text-xl text-gray-300">
            Preview and compare different light ray logo concepts for Stylish Entertainment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {logos.map((logo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800 border-2 border-champagne-gold/30 rounded-lg p-6 hover:border-champagne-gold/60 transition-all"
            >
              <h3 className="text-xl font-bold text-champagne-gold mb-2">
                {logo.name}
              </h3>
              <p className="text-gray-300 text-sm mb-4">{logo.description}</p>
              
              {/* Preview on dark background */}
              <div className="bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center min-h-[200px]">
                <img
                  src={logo.file}
                  alt={logo.name}
                  className="max-w-full max-h-[180px] object-contain"
                />
              </div>
              
              {/* Favicon preview - browser tab simulation */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Favicon Preview (Browser Tab):</p>
                <div className="bg-white rounded-t-lg p-2 flex items-center gap-2 border border-gray-300">
                  <div className="w-4 h-4 flex-shrink-0">
                    <img
                      src={logo.favicon}
                      alt={`${logo.name} favicon`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="h-3 bg-gray-200 rounded flex-1 max-w-[200px]"></div>
                </div>
              </div>
              
              {/* Preview on light background (for footer use) */}
              <div className="bg-champagne-gold rounded-lg p-6 flex items-center justify-center min-h-[150px]">
                <img
                  src={logo.file}
                  alt={logo.name}
                  className="max-w-full max-h-[130px] object-contain"
                  style={{
                    filter: 'brightness(0) saturate(100%)',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-800 border-2 border-champagne-gold/30 rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold text-champagne-gold mb-4">
            How to Use These Logos
          </h2>
          <div className="text-gray-300 space-y-3">
            <p>
              <strong className="text-champagne-gold">1. Choose Your Favorite:</strong> Review all options and select the one that best represents your brand.
            </p>
            <p>
              <strong className="text-champagne-gold">2. Replace Current Logo:</strong> The logo files are located in the <code className="bg-gray-900 px-2 py-1 rounded">/public</code> folder.
            </p>
            <p>
              <strong className="text-champagne-gold">3. Update Navigation:</strong> Edit <code className="bg-gray-900 px-2 py-1 rounded">components/Navigation.tsx</code> to use your chosen logo.
            </p>
            <p>
              <strong className="text-champagne-gold">4. Favicons:</strong> The logos can be used as favicons. For best results, create a simplified 32x32 version focusing on the light ray pattern.
            </p>
            <p className="mt-4 text-sm text-gray-400">
              Note: These are SVG files, so they&apos;ll scale perfectly at any size and can be edited with vector graphics software if you want to make changes.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

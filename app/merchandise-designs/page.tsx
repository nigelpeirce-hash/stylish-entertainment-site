"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MerchandiseDesigns() {
  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Merchandise Designs
          </h1>
          <p className="text-xl text-gray-300">
            Logo placement designs for t-shirts and aprons
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* T-Shirt Design - Front */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-800 border-champagne-gold/30 h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-champagne-gold">
                  T-Shirt - Front (Left Breast)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 bg-gray-900 rounded-lg">
                  <svg width="400" height="500" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
                    {/* Black T-shirt base */}
                    <defs>
                      <linearGradient id="tshirtShade" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0a0a0a" stopOpacity="1" />
                        <stop offset="100%" stopColor="#1a1a1a" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id="goldLogo" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity="1" />
                        <stop offset="50%" stopColor="#f4d03f" stopOpacity="1" />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id="rayGradT" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f4d03f" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                      </linearGradient>
                      <filter id="glowT">
                        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* T-shirt shape - more realistic male torso */}
                    <path d="M 110 60 Q 110 45 130 40 Q 160 35 200 38 Q 240 35 270 40 Q 290 45 290 60 
                             L 290 90 Q 295 110 290 140 
                             Q 285 180 280 220 
                             Q 275 260 270 280 
                             Q 265 320 270 360 
                             Q 275 400 270 440 
                             Q 265 470 250 480 
                             L 150 480 
                             Q 135 470 130 440 
                             Q 125 400 130 360 
                             Q 135 320 130 280 
                             Q 125 260 120 220 
                             Q 115 180 110 140 
                             Q 105 110 110 90 Z" 
                          fill="url(#tshirtShade)" stroke="#333" stroke-width="2"/>
                    
                    {/* Left sleeve - more realistic */}
                    <path d="M 110 60 Q 85 70 65 85 Q 45 105 40 135 Q 38 155 45 175 Q 55 185 70 180 Q 85 175 95 165 Q 100 150 105 135 Q 108 110 110 90" 
                          fill="url(#tshirtShade)" stroke="#333" stroke-width="2"/>
                    
                    {/* Right sleeve - more realistic */}
                    <path d="M 290 60 Q 315 70 335 85 Q 355 105 360 135 Q 362 155 355 175 Q 345 185 330 180 Q 315 175 305 165 Q 300 150 295 135 Q 292 110 290 90" 
                          fill="url(#tshirtShade)" stroke="#333" stroke-width="2"/>
                    
                    {/* Logo on left breast - small */}
                    <g transform="translate(125, 200) scale(0.35)">
                      {/* Upward angled rays */}
                      <g opacity="0.8">
                        <path d="M 20 180 L 120 40" stroke="url(#rayGradT)" stroke-width="3" fill="none" stroke-linecap="round" filter="url(#glowT)"/>
                        <path d="M 30 180 L 130 50" stroke="url(#rayGradT)" stroke-width="3.5" fill="none" stroke-linecap="round" filter="url(#glowT)"/>
                        <path d="M 40 180 L 140 60" stroke="url(#rayGradT)" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#glowT)"/>
                        <path d="M 50 180 L 150 70" stroke="url(#rayGradT)" stroke-width="4.5" fill="none" stroke-linecap="round" filter="url(#glowT)"/>
                        <path d="M 60 180 L 160 80" stroke="url(#rayGradT)" stroke-width="5" fill="none" stroke-linecap="round" filter="url(#glowT)"/>
                        <path d="M 70 180 L 170 90" stroke="url(#rayGradT)" stroke-width="4.5" fill="none" stroke-linecap="round" filter="url(#glowT)"/>
                        <path d="M 80 180 L 180 100" stroke="url(#rayGradT)" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#glowT)"/>
                      </g>
                      {/* Text */}
                      <g transform="translate(150, 0)">
                        <text x="0" y="50" font-family="'Raleway', sans-serif" font-size="48" font-weight="700" fill="url(#goldLogo)" text-anchor="start" letter-spacing="2">Stylish</text>
                        <text x="0" y="90" font-family="'Raleway', sans-serif" font-size="28" font-weight="400" fill="url(#goldLogo)" text-anchor="start" letter-spacing="4" opacity="0.9">ENTERTAINMENT</text>
                      </g>
                    </g>
                  </svg>
                </div>
                <p className="text-sm text-gray-400 mt-4 text-center">
                  Small logo positioned on left breast area
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* T-Shirt Design - Back */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-800 border-champagne-gold/30 h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-champagne-gold">
                  T-Shirt - Back (Centered)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 bg-gray-900 rounded-lg">
                  <svg width="400" height="500" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
                    {/* Black T-shirt base */}
                    <defs>
                      <linearGradient id="tshirtShade2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0a0a0a" stopOpacity="1" />
                        <stop offset="100%" stopColor="#1a1a1a" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id="goldLogo2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity="1" />
                        <stop offset="50%" stopColor="#f4d03f" stopOpacity="1" />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id="rayGradT2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f4d03f" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                      </linearGradient>
                      <filter id="glowT2">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* T-shirt shape - more realistic male torso */}
                    <path d="M 110 60 Q 110 45 130 40 Q 160 35 200 38 Q 240 35 270 40 Q 290 45 290 60 
                             L 290 90 Q 295 110 290 140 
                             Q 285 180 280 220 
                             Q 275 260 270 280 
                             Q 265 320 270 360 
                             Q 275 400 270 440 
                             Q 265 470 250 480 
                             L 150 480 
                             Q 135 470 130 440 
                             Q 125 400 130 360 
                             Q 135 320 130 280 
                             Q 125 260 120 220 
                             Q 115 180 110 140 
                             Q 105 110 110 90 Z" 
                          fill="url(#tshirtShade2)" stroke="#333" stroke-width="2"/>
                    
                    {/* Left sleeve - more realistic */}
                    <path d="M 110 60 Q 85 70 65 85 Q 45 105 40 135 Q 38 155 45 175 Q 55 185 70 180 Q 85 175 95 165 Q 100 150 105 135 Q 108 110 110 90" 
                          fill="url(#tshirtShade2)" stroke="#333" stroke-width="2"/>
                    
                    {/* Right sleeve - more realistic */}
                    <path d="M 290 60 Q 315 70 335 85 Q 355 105 360 135 Q 362 155 355 175 Q 345 185 330 180 Q 315 175 305 165 Q 300 150 295 135 Q 292 110 290 90" 
                          fill="url(#tshirtShade2)" stroke="#333" stroke-width="2"/>
                    
                    {/* Logo on back - larger, centered */}
                    <g transform="translate(50, 220) scale(0.75)">
                      {/* Upward angled rays */}
                      <g opacity="0.8">
                        <path d="M 20 180 L 120 40" stroke="url(#rayGradT2)" stroke-width="3" fill="none" stroke-linecap="round" filter="url(#glowT2)"/>
                        <path d="M 30 180 L 130 50" stroke="url(#rayGradT2)" stroke-width="3.5" fill="none" stroke-linecap="round" filter="url(#glowT2)"/>
                        <path d="M 40 180 L 140 60" stroke="url(#rayGradT2)" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#glowT2)"/>
                        <path d="M 50 180 L 150 70" stroke="url(#rayGradT2)" stroke-width="4.5" fill="none" stroke-linecap="round" filter="url(#glowT2)"/>
                        <path d="M 60 180 L 160 80" stroke="url(#rayGradT2)" stroke-width="5" fill="none" stroke-linecap="round" filter="url(#glowT2)"/>
                        <path d="M 70 180 L 170 90" stroke="url(#rayGradT2)" stroke-width="4.5" fill="none" stroke-linecap="round" filter="url(#glowT2)"/>
                        <path d="M 80 180 L 180 100" stroke="url(#rayGradT2)" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#glowT2)"/>
                      </g>
                      {/* Text */}
                      <g transform="translate(150, 0)">
                        <text x="0" y="50" font-family="'Raleway', sans-serif" font-size="48" font-weight="700" fill="url(#goldLogo2)" text-anchor="start" letter-spacing="2">Stylish</text>
                        <text x="0" y="90" font-family="'Raleway', sans-serif" font-size="28" font-weight="400" fill="url(#goldLogo2)" text-anchor="start" letter-spacing="4" opacity="0.9">ENTERTAINMENT</text>
                      </g>
                    </g>
                  </svg>
                </div>
                <p className="text-sm text-gray-400 mt-4 text-center">
                  Larger logo centered on back
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Pinny/Apron Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-champagne-gold">
                Pinny/Apron Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 bg-gray-900 rounded-lg">
                <svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
                  {/* Black apron/pinny base */}
                  <defs>
                    <linearGradient id="apronShade" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0a0a0a" stopOpacity="1" />
                      <stop offset="100%" stopColor="#1a1a1a" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="goldLogo3" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#d4af37" stopOpacity="1" />
                      <stop offset="50%" stopColor="#f4d03f" stopOpacity="1" />
                      <stop offset="100%" stopColor="#d4af37" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="rayGradA" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f4d03f" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glowA">
                      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Apron/pinny shape */}
                  <path d="M 150 80 Q 150 60 170 50 Q 200 40 230 50 Q 250 60 250 80 L 250 100 Q 250 120 270 140 L 300 500 Q 300 520 280 530 L 120 530 Q 100 520 100 500 L 130 140 Q 150 120 150 100 Z" 
                        fill="url(#apronShade)" stroke="#333" stroke-width="2"/>
                  
                  {/* Neck strap */}
                  <path d="M 150 80 Q 150 40 170 30 Q 200 20 230 30 Q 250 40 250 80" 
                        fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/>
                  
                  {/* Side straps */}
                  <path d="M 120 280 L 60 400 L 60 450 Q 60 460 70 460 Q 80 460 90 450 L 100 400 L 120 280" 
                        fill="url(#apronShade)" stroke="#333" stroke-width="2"/>
                  <path d="M 280 280 L 340 400 L 340 450 Q 340 460 330 460 Q 320 460 310 450 L 300 400 L 280 280" 
                        fill="url(#apronShade)" stroke="#333" stroke-width="2"/>
                  
                  {/* Logo on apron - centered upper area */}
                  <g transform="translate(80, 180) scale(0.6)">
                    {/* Upward angled rays */}
                    <g opacity="0.8">
                      <path d="M 20 180 L 120 40" stroke="url(#rayGradA)" stroke-width="3" fill="none" stroke-linecap="round" filter="url(#glowA)"/>
                      <path d="M 30 180 L 130 50" stroke="url(#rayGradA)" stroke-width="3.5" fill="none" stroke-linecap="round" filter="url(#glowA)"/>
                      <path d="M 40 180 L 140 60" stroke="url(#rayGradA)" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#glowA)"/>
                      <path d="M 50 180 L 150 70" stroke="url(#rayGradA)" stroke-width="4.5" fill="none" stroke-linecap="round" filter="url(#glowA)"/>
                      <path d="M 60 180 L 160 80" stroke="url(#rayGradA)" stroke-width="5" fill="none" stroke-linecap="round" filter="url(#glowA)"/>
                      <path d="M 70 180 L 170 90" stroke="url(#rayGradA)" stroke-width="4.5" fill="none" stroke-linecap="round" filter="url(#glowA)"/>
                      <path d="M 80 180 L 180 100" stroke="url(#rayGradA)" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#glowA)"/>
                    </g>
                    {/* Text */}
                    <g transform="translate(150, 0)">
                      <text x="0" y="50" font-family="'Raleway', sans-serif" font-size="48" font-weight="700" fill="url(#goldLogo3)" text-anchor="start" letter-spacing="2">Stylish</text>
                      <text x="0" y="90" font-family="'Raleway', sans-serif" font-size="28" font-weight="400" fill="url(#goldLogo3)" text-anchor="start" letter-spacing="4" opacity="0.9">ENTERTAINMENT</text>
                    </g>
                  </g>
                </svg>
              </div>
              <p className="text-sm text-gray-400 mt-4 text-center">
                Logo positioned on upper center area of apron/pinny
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gray-800 border-2 border-champagne-gold/30 rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold text-champagne-gold mb-4">
            Design Specifications
          </h2>
          <div className="text-gray-300 space-y-3 text-sm">
            <p>
              <strong className="text-champagne-gold">T-Shirt (Black Fabric):</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Front:</strong> Small logo (approximately 3-4 inches wide) on left breast area</li>
              <li><strong>Back:</strong> Larger logo (approximately 8-10 inches wide) centered on back</li>
              <li><strong>Color:</strong> Gold/white logo on black fabric</li>
              <li><strong>Print Method:</strong> Screen print, DTG (Direct to Garment), or vinyl transfer</li>
            </ul>
            
            <p className="mt-4">
              <strong className="text-champagne-gold">Pinny/Apron (Black Fabric):</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Placement:</strong> Logo centered on upper area (chest/bib area)</li>
              <li><strong>Size:</strong> Medium logo (approximately 6-7 inches wide)</li>
              <li><strong>Color:</strong> Gold/white logo on black fabric</li>
              <li><strong>Print Method:</strong> Screen print, embroidery, or vinyl transfer</li>
            </ul>
            
            <p className="mt-4 text-xs text-gray-400">
              <strong>Note:</strong> For actual production, provide your printer/manufacturer with the SVG logo files from the Marketing Suite. 
              They can scale and position the logo according to these specifications. The white/reversed logo version works best on black fabric.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

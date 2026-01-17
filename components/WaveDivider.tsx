"use client";

import React from "react";

export default function WaveDivider() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-8 md:h-12 lg:h-16 overflow-hidden pointer-events-none">
      {/* Wave Layer 1 - Always visible, slowest (20s) */}
      <svg
        className="absolute bottom-0 left-0 w-full h-full animate-wave-slide-1"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{
          willChange: 'transform',
          width: '200%'
        }}
      >
        <defs>
          <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(212, 175, 55, 0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 Q150,40 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z"
          fill="url(#wave-gradient-1)"
        />
        <path
          d="M1200,60 Q1350,40 1500,60 T1800,60 T2100,60 T2400,60 L2400,120 L1200,120 Z"
          fill="url(#wave-gradient-1)"
        />
      </svg>

      {/* Wave Layer 2 - Always visible, medium speed (15s) */}
      <svg
        className="absolute bottom-0 left-0 w-full h-full animate-wave-slide-2"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{
          willChange: 'transform',
          width: '200%'
        }}
      >
        <defs>
          <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(212, 175, 55, 0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M0,70 Q200,50 400,70 T800,70 T1200,70 L1200,120 L0,120 Z"
          fill="url(#wave-gradient-2)"
        />
        <path
          d="M1200,70 Q1400,50 1600,70 T2000,70 T2400,70 L2400,120 L1200,120 Z"
          fill="url(#wave-gradient-2)"
        />
      </svg>

      {/* Wave Layer 3 - Desktop only, fastest (25s) */}
      <svg
        className="absolute bottom-0 left-0 w-full h-full hidden md:block animate-wave-slide-3"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{
          willChange: 'transform',
          width: '200%'
        }}
      >
        <defs>
          <linearGradient id="wave-gradient-3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(212, 175, 55, 0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M0,50 Q100,30 200,50 T400,50 T600,50 T800,50 T1000,50 T1200,50 L1200,120 L0,120 Z"
          fill="url(#wave-gradient-3)"
        />
        <path
          d="M1200,50 Q1300,30 1400,50 T1600,50 T1800,50 T2000,50 T2200,50 T2400,50 L2400,120 L1200,120 Z"
          fill="url(#wave-gradient-3)"
        />
      </svg>
    </div>
  );
}
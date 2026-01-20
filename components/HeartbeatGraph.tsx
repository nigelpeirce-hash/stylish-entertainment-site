"use client";

import { useState, useEffect } from "react";

interface HeartbeatGraphProps {
  isActive?: boolean;
  stability?: "high" | "medium" | "low" | "offline";
  className?: string;
}

export function HeartbeatGraph({ 
  isActive = false, 
  stability = "high",
  className = "" 
}: HeartbeatGraphProps) {
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setWaveOffset((prev) => (prev + 5) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, [isActive]);

  const getColor = () => {
    switch (stability) {
      case "high":
        return "#10b981"; // green-500
      case "medium":
        return "#f59e0b"; // amber-500
      case "low":
        return "#ef4444"; // red-500
      default:
        return "#6b7280"; // gray-500
    }
  };

  // Generate waveform points (sine wave pattern)
  const generateWavePath = () => {
    const width = 80;
    const height = 20;
    const points: string[] = [];
    
    for (let x = 0; x <= width; x += 2) {
      const normalizedX = (x / width) * Math.PI * 4 + (waveOffset / 100) * Math.PI * 2;
      const y = height / 2 + (Math.sin(normalizedX) * height * 0.3);
      points.push(`${x},${y}`);
    }
    
    return `M ${points.join(" L ")}`;
  };

  if (!isActive) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg width="80" height="20" className="opacity-30">
          <line
            x1="0"
            y1="10"
            x2="80"
            y2="10"
            stroke={getColor()}
            strokeWidth="2"
            strokeDasharray="4,4"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg width="80" height="20" viewBox="0 0 80 20">
        <defs>
          <linearGradient id="heartbeat-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getColor()} stopOpacity="0.8" />
            <stop offset="50%" stopColor={getColor()} stopOpacity="1" />
            <stop offset="100%" stopColor={getColor()} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path
          d={generateWavePath()}
          fill="none"
          stroke="url(#heartbeat-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          className="transition-all duration-100"
        />
      </svg>
    </div>
  );
}

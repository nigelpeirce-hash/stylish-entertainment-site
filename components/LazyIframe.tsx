"use client";

import { useState, useRef, useEffect } from "react";

interface LazyIframeProps {
  src: string;
  title: string;
  className?: string;
  allow?: string;
  allowFullScreen?: boolean;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  frameBorder?: string | number;
  style?: React.CSSProperties;
  height?: string | number;
}

export default function LazyIframe({
  src,
  title,
  className = "",
  allow,
  allowFullScreen,
  referrerPolicy,
  frameBorder,
  style,
  height,
}: LazyIframeProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const iframeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before the iframe comes into view
      }
    );

    if (iframeRef.current) {
      observer.observe(iframeRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={iframeRef} className={className} style={style}>
      {shouldLoad ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow={allow}
          allowFullScreen={allowFullScreen}
          referrerPolicy={referrerPolicy}
          frameBorder={frameBorder?.toString()}
          loading="lazy"
        />
      ) : (
        <div
          className="w-full bg-gray-800/50 flex items-center justify-center text-gray-400"
          style={{ height: height || "100%" }}
        >
          <span className="text-sm">Loading...</span>
        </div>
      )}
    </div>
  );
}

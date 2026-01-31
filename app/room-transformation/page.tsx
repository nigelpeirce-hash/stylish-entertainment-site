"use client";

import { useEffect } from "react";
import BeforeAfter from "@/components/BeforeAfter";
import Link from "next/link";

const roomTransformation = {
  before: {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768753000/IMG_2530_njx41m.jpg",
    alt: "Room before transformation - empty space ready for styling and decorations",
  },
  after: {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768751155/IMG_3188_zviff5.jpg",
    alt: "Room after transformation - beautiful venue styling with professional decorations and lighting",
  },
};

export default function RoomTransformationPage() {
  useEffect(() => {
    document.title = "Room Transformation | Stylish Entertainment - Before & After";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "See the dramatic before and after of our room transformation. Professional venue styling and decorations by Stylish Entertainment."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans mb-4">
            Room Transformation
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Drag the slider to see the before and after of this space transformed
            with professional styling, lighting and decorations.
          </p>
        </div>
      </section>

      {/* Before/After */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <BeforeAfter before={roomTransformation.before} after={roomTransformation.after} />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-400 mb-6">
            Want a transformation like this for your event?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-champagne-gold text-gray-900 font-semibold hover:bg-champagne-gold/90 transition-colors"
          >
            Get in touch
          </Link>
          <p className="mt-6">
            <Link href="/galleries" className="text-champagne-gold hover:underline">
              View more before & after galleries →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

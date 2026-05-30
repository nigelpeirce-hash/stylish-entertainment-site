"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 bg-gray-900 text-white text-center">
      <h1 className="text-2xl font-bold text-champagne-gold mb-4">Something went wrong</h1>
      <p className="text-gray-300 max-w-md mb-8">
        The page could not load. Please try again, or contact us if the problem continues.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="button"
          onClick={() => reset()}
          className="bg-champagne-gold text-black hover:bg-champagne-gold/90"
        >
          Try again
        </Button>
        <Button asChild variant="outline" className="border-champagne-gold/50 text-champagne-gold">
          <Link href="/contact-us/">Contact us</Link>
        </Button>
      </div>
    </div>
  );
}

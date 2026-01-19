import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-champagne-gold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-champagne-gold text-black hover:bg-champagne-gold/90">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline" className="border-gray-700 text-white">
            <Link href="/contact-us">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

// Force dynamic rendering to prevent build-time prerendering issues
export const dynamic = 'force-dynamic';

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
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-champagne-gold text-black hover:bg-champagne-gold/90 font-semibold transition-colors"
          >
            Go Home
          </Link>
          <Link 
            href="/contact-us/" 
            className="inline-flex items-center justify-center rounded-md px-4 py-2 border border-gray-700 bg-transparent text-white hover:bg-gray-800 font-semibold transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

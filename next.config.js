/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable API routes for email and authentication
  // If you need static export for deployment, you'll need to use a different deployment strategy
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'collection.cloudinary.com',
        pathname: '/**',
      },
    ],
    // Cloudinary handles format/quality (f_auto,q_auto), Next.js handles responsive sizes
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  trailingSlash: true,
  async redirects() {
    return [
      // High priority redirects from stylishweddingdisco.co.uk
      {
        source: '/wedding-djs',
        destination: '/artists/djs',
        permanent: true, // 301 redirect
      },
      {
        source: '/wedding-djs/',
        destination: '/artists/djs',
        permanent: true,
      },
      // Blog redirects
      {
        source: '/blogs/mells-barn-wedding',
        destination: '/about/blog',
        permanent: true,
      },
      {
        source: '/blogs/mells-barn-wedding/',
        destination: '/about/blog',
        permanent: true,
      },
      {
        source: '/blogs/babington-house-weddings',
        destination: '/about/blog',
        permanent: true,
      },
      {
        source: '/blogs/babington-house-weddings/',
        destination: '/about/blog',
        permanent: true,
      },
      // Gallery redirects
      {
        source: '/galleries/venue-decoration',
        destination: '/what-we-do/venue-decoration',
        permanent: true,
      },
      {
        source: '/galleries/venue-decoration/',
        destination: '/what-we-do/venue-decoration',
        permanent: true,
      },
      // Service redirects
      {
        source: '/wedding-lighting-design',
        destination: '/services/lighting-design',
        permanent: true,
      },
      {
        source: '/wedding-lighting-design/',
        destination: '/services/lighting-design',
        permanent: true,
      },
      {
        source: '/what-we-do/fire-pit-hire',
        destination: '/services/fire-pit-hire',
        permanent: true,
      },
      {
        source: '/what-we-do/fire-pit-hire/',
        destination: '/services/fire-pit-hire',
        permanent: true,
      },
      {
        source: '/what-we-do/venue-styling',
        destination: '/services/venue-styling',
        permanent: true,
      },
      {
        source: '/what-we-do/venue-styling/',
        destination: '/services/venue-styling',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

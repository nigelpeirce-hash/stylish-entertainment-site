/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'collection.cloudinary.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  trailingSlash: true,
  async redirects() {
    return [
      // --- NEW ANALYTICS-DRIVEN REDIRECTS (Priority) ---
      {
        source: '/dj-nige',
        destination: '/artists/djs', // Or the specific profile if created
        permanent: true,
      },
      {
        source: '/artists/musicians-html',
        destination: '/artists/musicians',
        permanent: true,
      },
      {
        source: '/fire-pit-html',
        destination: '/services/fire-pit-hire',
        permanent: true,
      },
      {
        source: '/mells-barn-weddings',
        destination: '/venues/mells-barn',
        permanent: true,
      },
      {
        source: '/pennard-house-lighting',
        destination: '/venues/pennard-house',
        permanent: true,
      },
      {
        source: '/babington-wedding-info',
        destination: '/venues/babington-house',
        permanent: true,
      },
      // Cleanup old NextGEN Gallery Tags (SEO Power Consolidation)
      {
        source: '/ngg_tag/:path*',
        destination: '/services/lighting-design',
        permanent: true,
      },

      // --- EXISTING REDIRECTS ---
      {
        source: '/wedding-djs',
        destination: '/artists/djs',
        permanent: true,
      },
      {
        source: '/blogs/:path*',
        destination: '/about/blog',
        permanent: true,
      },
      {
        source: '/galleries/venue-decoration',
        destination: '/services/venue-styling',
        permanent: true,
      },
      {
        source: '/wedding-lighting-design',
        destination: '/services/lighting-design',
        permanent: true,
      },
      {
        source: '/what-we-do/fire-pit-hire',
        destination: '/services/fire-pit-hire',
        permanent: true,
      },
      {
        source: '/what-we-do/venue-styling',
        destination: '/services/venue-styling',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
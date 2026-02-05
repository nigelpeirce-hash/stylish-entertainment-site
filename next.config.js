/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // es6-promise (imap-simple dep) optionally requires 'vertx'; we don't use it in Node.
    config.resolve.fallback = { ...config.resolve.fallback, vertx: false };
    return config;
  },
  experimental: {
    // Disable server source maps to prevent minification crashes
    serverSourceMaps: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'collection.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      // Add specific S3 bucket domains here if needed, e.g.:
      // { protocol: 'https', hostname: 'stylish-ambience-app.s3.amazonaws.com', pathname: '/**' },
      // { protocol: 'https', hostname: 'stylish-ambience-app.s3.eu-west-1.amazonaws.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1360, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  trailingSlash: true,
  // Force HTTPS in production
  async headers() {
    return [
      // Allow demo/client-portal to be embedded in same-origin iframes (wedding-dj page)
      {
        source: '/demo/client-portal',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
      {
        source: '/demo/client-portal/',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'encrypted-media=(self "https://player-widget.mixcloud.com" "https://www.youtube.com" "https://youtube.com")',
          },
        ],
      },
      // Longer cache for static assets (helps PageSpeed "efficient cache lifetimes")
      {
        source: '/favicon.svg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:path*.svg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:path*.png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:path*.ico',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:path*.jpg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:path*.jpeg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:path*.webp',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  async redirects() {
    return [
      // --- STATIC DEMO PAGES ---
      { source: '/phone-demo.html', destination: '/iphone-demo.html', permanent: false },
      { source: '/terms-portal-flow-demo.html', destination: '/terms-portal-flow-demo', permanent: false },

      // --- GSC: Legacy / index / .html / -html ---
      { source: '/index.php', destination: '/', permanent: true },
      { source: '/index.php/', destination: '/', permanent: true },
      { source: '/artists/musicians.html', destination: '/artists/musicians/', permanent: true },
      { source: '/artists/musicians.html/', destination: '/artists/musicians/', permanent: true },
      { source: '/artists/musicians-html', destination: '/artists/musicians/', permanent: true },
      { source: '/artists/musicians-html/', destination: '/artists/musicians/', permanent: true },
      { source: '/fire-pit.html', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/fire-pit.html/', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/fire-pit-hire', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/fire-pit-hire/', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/fire-pit-html', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/fire-pit-html/', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/what-we-do/fire-pit-html', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/what-we-do/fire-pit-html/', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/what-we-do/fire-pit-hire', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/what-we-do/fire-pit-hire/', destination: '/services/fire-pit-hire/', permanent: true },

      // --- Parties / weddings / zoom-dj ---
      { source: '/parties/private', destination: '/parties/private-parties/', permanent: true },
      { source: '/parties/private/', destination: '/parties/private-parties/', permanent: true },
      { source: '/parties/weddings', destination: '/weddings/wedding-entertainment/', permanent: true },
      { source: '/parties/weddings/', destination: '/weddings/wedding-entertainment/', permanent: true },
      { source: '/zoom-dj', destination: '/artists/djs/', permanent: true },
      { source: '/zoom-dj/', destination: '/artists/djs/', permanent: true },

      // --- Venues / babington ---
      { source: '/babington-house', destination: '/venues/babington-house/', permanent: true },
      { source: '/babington-house/', destination: '/venues/babington-house/', permanent: true },
      { source: '/babington-wedding-info', destination: '/venues/babington-house/', permanent: true },
      { source: '/babington-wedding-info/', destination: '/venues/babington-house/', permanent: true },
      { source: '/babington-house-wedding-info', destination: '/venues/babington-house/', permanent: true },
      { source: '/babington-house-wedding-info/', destination: '/venues/babington-house/', permanent: true },
      { source: '/mells-barn-weddings', destination: '/venues/mells-barn/', permanent: true },
      { source: '/pennard-house-lighting', destination: '/venues/pennard-house/', permanent: true },
      { source: '/dj-nige', destination: '/artists/djs/', permanent: true },
      { source: '/dj-nige/', destination: '/artists/djs/', permanent: true },

      // --- Galleries / nggallery / category ---
      { source: '/galleries/venue-decoration', destination: '/services/venue-styling/', permanent: true },
      { source: '/galleries/venue-decoration/', destination: '/services/venue-styling/', permanent: true },
      { source: '/galleries/venue-decoration/nggallery/:path*', destination: '/services/venue-styling/', permanent: true },
      { source: '/galleries/images.html', destination: '/galleries/', permanent: true },
      { source: '/galleries/images.html/', destination: '/galleries/', permanent: true },
      { source: '/galleries/images/html/nggallery/:path*', destination: '/galleries/', permanent: true },
      { source: '/category/:path*/feed', destination: '/about/blog/', permanent: true },
      { source: '/category/:path*/feed/', destination: '/about/blog/', permanent: true },
      { source: '/category/blog', destination: '/about/blog/', permanent: true },
      { source: '/category/blog/', destination: '/about/blog/', permanent: true },
      { source: '/category/blog/:path*', destination: '/about/blog/', permanent: true },
      { source: '/ngg_tag/:path*', destination: '/services/lighting-design/', permanent: true },

      // --- Legacy (disco-dj, party-planning-production, slide-view, wp-content, etc.) ---
      { source: '/disco-dj', destination: '/artists/djs/', permanent: true },
      { source: '/disco-dj/', destination: '/artists/djs/', permanent: true },
      { source: '/disc-dj', destination: '/artists/djs/', permanent: true },
      { source: '/disc-dj/', destination: '/artists/djs/', permanent: true },
      { source: '/what-we-do/party-planning-production', destination: '/party-planning-and-organising/', permanent: true },
      { source: '/what-we-do/party-planning-production/', destination: '/party-planning-and-organising/', permanent: true },
      { source: '/slide-view/:path*', destination: '/testi/', permanent: true },
      { source: '/the/pdf.html', destination: '/', permanent: true },
      { source: '/the/pdf.html/', destination: '/', permanent: true },
      { source: '/horror/:path*', destination: '/parties/', permanent: true },
      { source: '/wp-content/:path*', destination: '/', permanent: true },

      // --- Attachment paths (GSC: discovered / crawled-not-indexed) ---
      { source: '/artists/musicians-html/attachment/:path*', destination: '/artists/musicians/', permanent: true },
      { source: '/testimonial-view/:path*', destination: '/testi/', permanent: true },
      { source: '/testi/page/:path*', destination: '/testi/', permanent: true },
      { source: '/party-lighting-hire/attachment/:path*', destination: '/parties/party-lighting/', permanent: true },
      { source: '/babington-house-wedding-info/attachment/:path*', destination: '/venues/babington-house/', permanent: true },
      { source: '/kin-house-wiltshire/attachment/:path*', destination: '/kin-house-wiltshire/', permanent: true },
      { source: '/blog/:path*/attachment/:path*', destination: '/about/blog/', permanent: true },
      { source: '/home/attachment/:path*', destination: '/', permanent: true },
      { source: '/what-we-do/venue-decoration/attachment/:path*', destination: '/services/venue-styling/', permanent: true },
      { source: '/what-we-do/venue-decoration', destination: '/services/venue-styling/', permanent: true },
      { source: '/what-we-do/venue-decoration/', destination: '/services/venue-styling/', permanent: true },

      // --- Feed URLs (GSC: excluded by noindex) ---
      { source: '/artists/musicians-html/feed', destination: '/artists/musicians/', permanent: true },
      { source: '/artists/musicians-html/feed/', destination: '/artists/musicians/', permanent: true },
      { source: '/fire-pit-html/feed', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/fire-pit-html/feed/', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/feed', destination: '/about/blog/', permanent: true },
      { source: '/feed/', destination: '/about/blog/', permanent: true },
      { source: '/parties/private/feed', destination: '/parties/private-parties/', permanent: true },
      { source: '/parties/private/feed/', destination: '/parties/private-parties/', permanent: true },
      { source: '/what-we-do/led-lighting-php', destination: '/services/lighting-design/', permanent: true },
      { source: '/what-we-do/led-lighting-php/', destination: '/services/lighting-design/', permanent: true },
      { source: '/what-we-do/led-lighting-php/feed', destination: '/services/lighting-design/', permanent: true },
      { source: '/what-we-do/led-lighting-php/feed/', destination: '/services/lighting-design/', permanent: true },

      // --- Optional legacy from HTTPS report ---
      { source: '/christmas', destination: '/parties/christmas/', permanent: true },
      { source: '/christmas/', destination: '/parties/christmas/', permanent: true },
      { source: '/lighting-hire', destination: '/parties/party-lighting/', permanent: true },
      { source: '/lighting-hire/', destination: '/parties/party-lighting/', permanent: true },
      { source: '/wedding-lighting', destination: '/weddings/wedding-lighting/', permanent: true },
      { source: '/wedding-lighting/', destination: '/weddings/wedding-lighting/', permanent: true },
      { source: '/what-we-do/hire', destination: '/hire/', permanent: true },
      { source: '/what-we-do/hire/', destination: '/hire/', permanent: true },

      // --- Old DJ booking / wedding-djs / blogs ---
      { source: '/dj-booking-confirmation', destination: '/book-dj/', permanent: true },
      { source: '/dj-booking-confirmation/', destination: '/book-dj/', permanent: true },
      { source: '/wedding-djs', destination: '/artists/djs/', permanent: true },
      { source: '/wedding-djs/', destination: '/artists/djs/', permanent: true },
      { source: '/blogs/:path*', destination: '/about/blog/', permanent: true },
      { source: '/wedding-lighting-design', destination: '/services/lighting-design/', permanent: true },
      { source: '/what-we-do/venue-styling', destination: '/services/venue-styling/', permanent: true },
    ]
  },
}

module.exports = nextConfig
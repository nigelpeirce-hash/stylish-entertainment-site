/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force Webpack and disable Turbopack for production
  webpack: (config, { isServer }) => {
    const webpack = require('webpack');
    
    // Fix for es6-promise trying to require 'vertx' which doesn't exist
    // This is needed because imap-simple uses es6-promise which has a vertx fallback
    // Ignore the vertx module completely
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^vertx$/,
      })
    );
    
    // Also add alias and fallback as backup
    config.resolve.alias = {
      ...config.resolve.alias,
      vertx: false,
    };
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      vertx: false,
    };
    
    return config;
  },
  experimental: {
    // Explicitly ensure turbo is disabled (Next.js 15 expects an object)
    turbo: {},
    // Disable webpack build worker to fix minification errors in Next.js 15
    webpackBuildWorker: false,
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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  trailingSlash: true,
  // Force HTTPS in production
  async headers() {
    return [
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
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
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
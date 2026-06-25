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
    // Tree-shake barrel imports (e.g. lucide-react) to reduce JS bundle
    optimizePackageImports: ['lucide-react'],
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
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      // Add specific S3 bucket domains here if needed, e.g.:
      // { protocol: 'https', hostname: 'stylish-ambience-app.s3.amazonaws.com', pathname: '/**' },
      // { protocol: 'https', hostname: 'stylish-ambience-app.s3.eu-west-1.amazonaws.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1360, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Dev: local /_next/image optimizer often times out on image-heavy pages (e.g. Babington).
    // Images load direct from Cloudinary in development; production keeps optimization.
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Canonical URLs end with `/`. Sitemap, redirect destinations, and SEO
  // canonical tags all assume trailing slash. Changing this from false caused
  // GSC "Page with redirect" issues because /about/ (sitemap) was being 308'd
  // to /about. NOTE: this also normalises /api/* requests; external webhooks
  // (e.g. WhatsApp Cloud API → /api/whatsapp/webhook) must be configured with
  // the trailing slash to avoid a 308 they may not follow.
  trailingSlash: true,
  // Let middleware handle trailing-slash redirects so legacy-domain cross-site
  // redirects run first (Vercel CDN trailingSlash fires before middleware otherwise).
  skipTrailingSlashRedirect: true,
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
            value: 'encrypted-media=(self "https://player-widget.mixcloud.com" "https://www.youtube.com" "https://youtube.com"), unload=(self)',
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
  // Redirects run top-to-bottom: put specific/wildcard rules before broader ones.
  // www → non-www: handled exclusively in Vercel Dashboard to avoid canonical loops.
  async redirects() {
    // ----------------------------------------------------------------
    // CROSS-DOMAIN CONSOLIDATION (May 2026)
    // stylishweddingdisco.co.uk (legacy WP Engine site) →
    // stylishentertainment.co.uk (this Next.js site).
    //
    // Each rule has a `has: [{ type: "host", value: ... }]` guard so it
    // ONLY fires for requests whose Host header matches the legacy
    // domain (apex or www). Destinations are absolute URLs so the
    // redirect crosses domains. Rules are DORMANT until DNS for
    // stylishweddingdisco.co.uk is pointed at Vercel and the domain is
    // added to this project — no impact on stylishentertainment.co.uk.
    //
    // Order within the legacy block: specific page maps → wildcard
    // families → final catch-all to homepage so nothing 404s.
    // ----------------------------------------------------------------
    const LEGACY_HOST = "(www\\.)?stylishweddingdisco\\.co\\.uk";
    const NEW = "https://www.stylishentertainment.co.uk";
    const fromLegacy = [{ type: "host", value: LEGACY_HOST }];
    const legacy = (source, dest) => ({
      source,
      has: fromLegacy,
      destination: dest.startsWith("http") ? dest : `${NEW}${dest}`,
      permanent: true,
    });

    return [
      // ============================================================
      // BEGIN cross-domain consolidation (stylishweddingdisco.co.uk)
      // ============================================================

      // --- Top traffic: 1:1 specific page maps (from GA4 2025 export) ---
      legacy("/wedding-djs", "/artists/djs/"),
      legacy("/wedding-djs/", "/artists/djs/"),
      legacy("/wedding-lighting-design", "/weddings/wedding-lighting/"),
      legacy("/wedding-lighting-design/", "/weddings/wedding-lighting/"),
      legacy("/what-we-do/venue-styling", "/services/venue-styling/"),
      legacy("/what-we-do/venue-styling/", "/services/venue-styling/"),
      legacy("/mells-barn-weddings", "/venues/mells-barn/"),
      legacy("/mells-barn-weddings/", "/venues/mells-barn/"),
      legacy("/contact-us", "/contact-us/"),
      legacy("/contact-us/", "/contact-us/"),
      legacy("/blogs/babington-house-weddings", "/venues/babington-house/"),
      legacy("/blogs/babington-house-weddings/", "/venues/babington-house/"),
      legacy("/blogs/mells-barn-wedding", "/venues/mells-barn/"),
      legacy("/blogs/mells-barn-wedding/", "/venues/mells-barn/"),
      legacy(
        "/blogs/five-ways-to-totally-transform-a-venue-decor-and-venue-styling",
        "/about/blog/five-ways-to-totally-transform-a-venue-2-decor/"
      ),
      legacy(
        "/blogs/five-ways-to-totally-transform-a-venue-decor-and-venue-styling/",
        "/about/blog/five-ways-to-totally-transform-a-venue-2-decor/"
      ),
      legacy("/what-we-do/fire-pit-hire", "/services/fire-pit-hire/"),
      legacy("/what-we-do/fire-pit-hire/", "/services/fire-pit-hire/"),
      legacy("/fire-pit-html", "/services/fire-pit-hire/"),
      legacy("/fire-pit-html/", "/services/fire-pit-hire/"),
      legacy("/artists/djs", "/artists/djs/"),
      legacy("/artists/djs/", "/artists/djs/"),
      legacy("/artists/musicians-html", "/artists/musicians/"),
      legacy("/artists/musicians-html/", "/artists/musicians/"),
      legacy("/about-stylish/faqs", "/about/faq/"),
      legacy("/about-stylish/faqs/", "/about/faq/"),
      legacy("/about-stylish/top-tips", "/about/blog/"),
      legacy("/about-stylish/top-tips/", "/about/blog/"),
      legacy("/about-stylish/who-are-we", "/about/"),
      legacy("/about-stylish/who-are-we/", "/about/"),
      legacy("/about-stylish", "/about/"),
      legacy("/about-stylish/", "/about/"),
      legacy("/what-we-do/hire", "/hire/"),
      legacy("/what-we-do/hire/", "/hire/"),
      legacy("/what-we-do/equipment-dj-band-sound-kit", "/services/kit-hire/"),
      legacy("/what-we-do/equipment-dj-band-sound-kit/", "/services/kit-hire/"),
      legacy("/what-we-do/led-lighting-php", "/services/lighting-design/"),
      legacy("/what-we-do/led-lighting-php/", "/services/lighting-design/"),
      legacy("/what-we-do/djs-discos", "/artists/djs/"),
      legacy("/what-we-do/djs-discos/", "/artists/djs/"),
      legacy(
        "/what-we-do/musicians-bands-entertainers",
        "/artists/musicians/"
      ),
      legacy(
        "/what-we-do/musicians-bands-entertainers/",
        "/artists/musicians/"
      ),
      legacy(
        "/what-we-do/party-planning-production",
        "/party-planning-and-organising/"
      ),
      legacy(
        "/what-we-do/party-planning-production/",
        "/party-planning-and-organising/"
      ),
      legacy("/what-we-do/venue-decoration", "/services/venue-styling/"),
      legacy("/what-we-do/venue-decoration/", "/services/venue-styling/"),
      legacy(
        "/what-we-do/selfie-mirror-photo-booth-hire",
        "/galleries/"
      ),
      legacy(
        "/what-we-do/selfie-mirror-photo-booth-hire/",
        "/galleries/"
      ),
      legacy("/wedding-styling", "/services/venue-styling/"),
      legacy("/wedding-styling/", "/services/venue-styling/"),
      legacy("/wedding-lighting", "/weddings/wedding-lighting/"),
      legacy("/wedding-lighting/", "/weddings/wedding-lighting/"),
      legacy("/babington-house", "/venues/babington-house/"),
      legacy("/babington-house/", "/venues/babington-house/"),
      legacy("/babington-wedding-info", "/venues/babington-house/"),
      legacy("/babington-wedding-info/", "/venues/babington-house/"),
      legacy(
        "/blogs/five-ways-to-totally-transform-a-venue-lighting",
        "/about/blog/five-ways-to-totally-transform-a-venue-1-lighting/"
      ),
      legacy(
        "/blogs/five-ways-to-totally-transform-a-venue-lighting/",
        "/about/blog/five-ways-to-totally-transform-a-venue-1-lighting/"
      ),
      legacy(
        "/blogs/why-you-should-use-an-experienced-professional-dj",
        "/about/blog/why-you-should-use-an-experienced-professional-dj/"
      ),
      legacy(
        "/blogs/why-you-should-use-an-experienced-professional-dj/",
        "/about/blog/why-you-should-use-an-experienced-professional-dj/"
      ),
      legacy("/what-we-do", "/what-we-do/"),
      legacy("/what-we-do/", "/what-we-do/"),
      legacy("/galleries/venue-decoration", "/services/venue-styling/"),
      legacy("/galleries/venue-decoration/", "/services/venue-styling/"),
      legacy("/galleries/image-gallery-new", "/galleries/"),
      legacy("/galleries/image-gallery-new/", "/galleries/"),
      legacy("/galleries/video", "/galleries/videos/"),
      legacy("/galleries/video/", "/galleries/videos/"),
      legacy("/galleries", "/galleries/"),
      legacy("/galleries/", "/galleries/"),
      legacy("/pennard-house-somerset", "/venues/pennard-house/"),
      legacy("/pennard-house-somerset/", "/venues/pennard-house/"),
      legacy("/testi", "/testi/"),
      legacy("/testi/", "/testi/"),
      legacy("/privacy-policy", "/privacy-policy/"),
      legacy("/privacy-policy/", "/privacy-policy/"),
      legacy("/artists", "/artists/djs/"),
      legacy("/artists/", "/artists/djs/"),

      // --- Wildcard families ---
      legacy("/testimonial-view/:path*", "/testi/"),
      legacy("/testi/page/:path*", "/testi/"),
      legacy("/team-view/nigel-peirce", "/artists/djs/dj-nige/"),
      legacy("/team-view/nigel-peirce/", "/artists/djs/dj-nige/"),
      legacy("/team-view/:path*", "/about/"),
      legacy("/category/babington-house", "/venues/babington-house/"),
      legacy("/category/babington-house/", "/venues/babington-house/"),
      legacy("/category/babington-house/:path*", "/venues/babington-house/"),
      legacy(
        "/category/venue-decoration-styling",
        "/services/venue-styling/"
      ),
      legacy(
        "/category/venue-decoration-styling/",
        "/services/venue-styling/"
      ),
      legacy(
        "/category/venue-decoration-styling/:path*",
        "/services/venue-styling/"
      ),
      legacy("/category/:path*", "/about/blog/"),
      legacy("/blogs/:path*", "/about/blog/"),
      legacy("/ngg_tag/:path*", "/services/lighting-design/"),
      legacy("/wp-content/:path*", "/"),
      legacy("/wp-admin/:path*", "/"),
      legacy("/wp-login.php", "/"),
      legacy("/feed", "/about/blog/"),
      legacy("/feed/", "/about/blog/"),
      legacy("/about-stylish/:path*", "/about/"),
      legacy("/what-we-do/:path*", "/what-we-do/"),

      // --- Homepage + ultimate catch-all (preserve path on new domain) ---
      legacy("/", "/"),
      legacy("/:path*", "/:path*"),

      // ============================================================
      // END cross-domain consolidation
      // ============================================================

      // --- Duplicate-content consolidation (May 2026) ---
      // /parties/corporate-events/ retired in favour of /parties/corporate/
      // (richer content; was the page header/nav linked to, but had no
      // self-canonical and a useEffect-set title which Google rarely sees).
      { source: '/parties/corporate-events', destination: '/parties/corporate/', permanent: true },
      { source: '/parties/corporate-events/', destination: '/parties/corporate/', permanent: true },
      // /lighting-hire-2/ retired in favour of /services/lighting-design/
      // (same H1 "Lighting Design", overlapping content; "-2" slug is legacy
      // WordPress duplicate). Consolidated May 2026.
      { source: '/lighting-hire-2', destination: '/services/lighting-design/', permanent: true },
      { source: '/lighting-hire-2/', destination: '/services/lighting-design/', permanent: true },

      // --- GSC 404 cleanup (May 2026) — bare prefixes Google still has indexed ---
      { source: '/blog', destination: '/about/blog/', permanent: true },
      { source: '/blog/', destination: '/about/blog/', permanent: true },
      { source: '/weddings', destination: '/weddings/wedding-entertainment/', permanent: true },
      { source: '/weddings/', destination: '/weddings/wedding-entertainment/', permanent: true },
      { source: '/venues/kin-house', destination: '/kin-house-wiltshire/', permanent: true },
      { source: '/venues/kin-house/', destination: '/kin-house-wiltshire/', permanent: true },
      { source: '/hannah-ross', destination: '/', permanent: true },
      { source: '/hannah-ross/', destination: '/', permanent: true },

      // --- Legacy WordPress .php / category (GSC 404/Redirect reports) → relevant canonical pages ---
      { source: '/party-planning.php', destination: '/party-planning-and-organising/', permanent: true },
      { source: '/party-planning.php/', destination: '/party-planning-and-organising/', permanent: true },
      { source: '/contact.php', destination: '/contact-us/', permanent: true },
      { source: '/contact.php/', destination: '/contact-us/', permanent: true },
      { source: '/category/party-planning', destination: '/party-planning-and-organising/', permanent: true },
      { source: '/category/party-planning/', destination: '/party-planning-and-organising/', permanent: true },
      { source: '/category/events', destination: '/party-planning-and-organising/', permanent: true },
      { source: '/category/events/', destination: '/party-planning-and-organising/', permanent: true },
      { source: '/category/lighting', destination: '/services/lighting-design/', permanent: true },
      { source: '/category/lighting/', destination: '/services/lighting-design/', permanent: true },
      { source: '/category/contact', destination: '/contact-us/', permanent: true },
      { source: '/category/contact/', destination: '/contact-us/', permanent: true },

      // --- STATIC DEMO PAGES ---
      { source: '/phone-demo.html', destination: '/iphone-demo.html', permanent: false },
      { source: '/terms-portal-flow-demo.html', destination: '/terms-portal-flow-demo/', permanent: false },
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
      { source: '/party-lighting', destination: '/parties/party-lighting/', permanent: true },
      { source: '/party-lighting/', destination: '/parties/party-lighting/', permanent: true },
      { source: '/parties/private', destination: '/parties/private-parties/', permanent: true },
      { source: '/parties/private/', destination: '/parties/private-parties/', permanent: true },
      { source: '/parties/weddings', destination: '/weddings/wedding-entertainment/', permanent: true },
      { source: '/parties/weddings/', destination: '/weddings/wedding-entertainment/', permanent: true },
      { source: '/zoom-dj', destination: '/artists/djs/', permanent: true },
      { source: '/zoom-dj/', destination: '/artists/djs/', permanent: true },

      // --- Analytics legacy: wildcards first (before any broader rules below) ---
      { source: '/team-view/nigel-peirce', destination: '/artists/djs/dj-nige/', permanent: true },
      { source: '/team-view/nigel-peirce/', destination: '/artists/djs/dj-nige/', permanent: true },
      { source: '/team-view/:path*', destination: '/about/', permanent: true },
      { source: '/blog/venue-decoration-styling/:path*', destination: '/about/blog/', permanent: true },
      { source: '/spring-ball/:path*', destination: '/about/blog/bristol-university-spring-ball/', permanent: true },
      { source: '/category/babington-house', destination: '/venues/babington-house/', permanent: true },
      { source: '/category/babington-house/', destination: '/venues/babington-house/', permanent: true },
      { source: '/category/babington-house/page/:path*', destination: '/venues/babington-house/', permanent: true },
      { source: '/2014/:path*', destination: '/about/blog/', permanent: true },

      // --- Consistency: plural→singular, singular→plural (avoids "did I type it right?" 404s) ---
      { source: '/faqs', destination: '/about/faq/', permanent: true },
      { source: '/faqs/', destination: '/about/faq/', permanent: true },
      { source: '/video', destination: '/galleries/videos/', permanent: true },
      { source: '/video/', destination: '/galleries/videos/', permanent: true },

      // --- Venues / babington ---
      { source: '/babington-house', destination: '/venues/babington-house/', permanent: true },
      { source: '/babington-house/', destination: '/venues/babington-house/', permanent: true },
      { source: '/babington-wedding-info', destination: '/venues/babington-house/', permanent: true },
      { source: '/babington-wedding-info/', destination: '/venues/babington-house/', permanent: true },
      { source: '/babington-house-wedding-info', destination: '/venues/babington-house/', permanent: true },
      { source: '/babington-house-wedding-info/', destination: '/venues/babington-house/', permanent: true },
      { source: '/mells-barn-weddings', destination: '/venues/mells-barn/', permanent: true },
      { source: '/pennard-house-lighting', destination: '/venues/pennard-house/', permanent: true },
      { source: '/pennard-house-lighting/', destination: '/venues/pennard-house/', permanent: true },
      { source: '/dj-nige', destination: '/artists/djs/dj-nige/', permanent: true },
      { source: '/dj-nige/', destination: '/artists/djs/dj-nige/', permanent: true },
      { source: '/babington-house/:path*', destination: '/venues/babington-house/', permanent: true },

      // --- Galleries / nggallery / category ---
      { source: '/galleries/venue-decoration', destination: '/services/venue-styling/', permanent: true },
      { source: '/galleries/venue-decoration/', destination: '/services/venue-styling/', permanent: true },
      { source: '/galleries/venue-decoration/nggallery/:path*', destination: '/services/venue-styling/', permanent: true },
      { source: '/galleries/images.html', destination: '/galleries/', permanent: true },
      { source: '/galleries/images.html/', destination: '/galleries/', permanent: true },
      { source: '/galleries/images-html', destination: '/galleries/', permanent: true },
      { source: '/galleries/images-html/', destination: '/galleries/', permanent: true },
      { source: '/galleries/images/html/nggallery/:path*', destination: '/galleries/', permanent: true },
      { source: '/galleries/video', destination: '/galleries/videos/', permanent: true },
      { source: '/galleries/video/', destination: '/galleries/videos/', permanent: true },
      { source: '/category/:path*/feed', destination: '/about/blog/', permanent: true },
      { source: '/category/:path*/feed/', destination: '/about/blog/', permanent: true },
      { source: '/category/blog', destination: '/about/blog/', permanent: true },
      { source: '/category/blog/', destination: '/about/blog/', permanent: true },
      { source: '/category/blog/:path*', destination: '/about/blog/', permanent: true },
      { source: '/category/spring-ball', destination: '/about/blog/bristol-university-spring-ball/', permanent: true },
      { source: '/category/spring-ball/', destination: '/about/blog/bristol-university-spring-ball/', permanent: true },
      { source: '/category/:path*', destination: '/about/blog/', permanent: true },
      { source: '/galleries/images', destination: '/galleries/', permanent: true },
      { source: '/galleries/images/', destination: '/galleries/', permanent: true },
      { source: '/galleries/images-html/nggallery/:path*', destination: '/galleries/', permanent: true },
      { source: '/ngg_tag/:path*', destination: '/services/lighting-design/', permanent: true },

      // --- Legacy (disco-dj, party-planning-production, slide-view, wp-content, etc.) ---
      { source: '/disco-dj', destination: '/artists/djs/', permanent: true },
      { source: '/disco-dj/', destination: '/artists/djs/', permanent: true },
      { source: '/disc-dj', destination: '/artists/djs/', permanent: true },
      { source: '/disc-dj/', destination: '/artists/djs/', permanent: true },
      { source: '/what-we-do/party-planning-production', destination: '/party-planning-and-organising/', permanent: true },
      { source: '/what-we-do/party-planning-production/', destination: '/party-planning-and-organising/', permanent: true },
      { source: '/slide-view/:path*', destination: '/testi/', permanent: true },
      { source: '/about/testi', destination: '/testi/', permanent: true },
      { source: '/about/testi/', destination: '/testi/', permanent: true },
      { source: '/author/:path*', destination: '/about/', permanent: true },
      { source: '/stylishweddingdisco_wp/:path*', destination: '/', permanent: true },
      { source: '/stylishweddingdisco.co.uk/:path*', destination: '/', permanent: true },
      { source: '/party-lighting-hire', destination: '/parties/party-lighting/', permanent: true },
      { source: '/party-lighting-hire/', destination: '/parties/party-lighting/', permanent: true },
      { source: '/the/pdf.html', destination: '/', permanent: true },
      { source: '/the/pdf.html/', destination: '/', permanent: true },
      { source: '/horror/:path*', destination: '/parties/', permanent: true },
      { source: '/wp-content/:path*', destination: '/', permanent: true },

      // --- Attachment paths (GSC: discovered / crawled-not-indexed) ---
      { source: '/what-we-do/attachment/:path*', destination: '/artists/djs/', permanent: true },
      { source: '/pennard-house-lighting/attachment/:path*', destination: '/venues/pennard-house/', permanent: true },
      { source: '/artists/musicians-html/attachment/:path*', destination: '/artists/musicians/', permanent: true },
      { source: '/artists/djs/attachment/:path*', destination: '/artists/djs/', permanent: true },
      { source: '/artists/partydjs', destination: '/artists/party-djs/', permanent: true },
      { source: '/artists/partydjs/', destination: '/artists/party-djs/', permanent: true },
      { source: '/artists/partydjs/attachment/:path*', destination: '/artists/party-djs/', permanent: true },
      { source: '/testimonial-view/:path*', destination: '/testi/', permanent: true },
      { source: '/testi/page/:path*', destination: '/testi/', permanent: true },
      { source: '/christmas/attachment/:path*', destination: '/parties/christmas/', permanent: true },
      { source: '/dj-nige/attachment/:path*', destination: '/artists/djs/dj-nige/', permanent: true },
      { source: '/fire-pit-html/attachment/:path*', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/lighting-hire/attachment/:path*', destination: '/parties/party-lighting/', permanent: true },
      { source: '/party-lighting/attachment/:path*', destination: '/parties/party-lighting/', permanent: true },
      { source: '/party-planning-and-organising/attachment/:path*', destination: '/party-planning-and-organising/', permanent: true },
      { source: '/parties/attachment/:path*', destination: '/parties/', permanent: true },
      { source: '/party-lighting-hire/attachment/:path*', destination: '/parties/party-lighting/', permanent: true },
      { source: '/babington-house-wedding-info/attachment/:path*', destination: '/venues/babington-house/', permanent: true },
      { source: '/kin-house-wiltshire/attachment/:path*', destination: '/kin-house-wiltshire/', permanent: true },
      { source: '/blog/:path*/attachment/:path*', destination: '/about/blog/', permanent: true },
      { source: '/home/attachment/:path*', destination: '/', permanent: true },
      { source: '/what-we-do/venue-decoration/attachment/:path*', destination: '/services/venue-styling/', permanent: true },
      { source: '/what-we-do/venue-decoration', destination: '/services/venue-styling/', permanent: true },
      { source: '/what-we-do/venue-decoration/', destination: '/services/venue-styling/', permanent: true },
      { source: '/what-we-do/djs-discos/attachment/:path*', destination: '/artists/djs/', permanent: true },
      { source: '/what-we-do/equipment-dj-band-sound-kit/attachment/:path*', destination: '/services/kit-hire/', permanent: true },
      { source: '/what-we-do/hire/attachment/:path*', destination: '/hire/', permanent: true },
      { source: '/what-we-do/musicians-bands-entertainers/attachment/:path*', destination: '/artists/musicians/', permanent: true },
      { source: '/what-we-do/party-planning-production/attachment/:path*', destination: '/party-planning-and-organising/', permanent: true },
      { source: '/what-we-do/selfie-mirror-photo-booth-hire', destination: '/galleries/', permanent: true },
      { source: '/what-we-do/selfie-mirror-photo-booth-hire/', destination: '/galleries/', permanent: true },
      { source: '/what-we-do/selfie-mirror-photo-booth-hire/attachment/:path*', destination: '/galleries/', permanent: true },
      { source: '/zoom-dj/attachment/:path*', destination: '/artists/djs/', permanent: true },

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
      { source: '/what-we-do/equipment-dj-band-sound-kit', destination: '/services/kit-hire/', permanent: true },
      { source: '/what-we-do/equipment-dj-band-sound-kit/', destination: '/services/kit-hire/', permanent: true },
      { source: '/what-we-do/musicians-bands-entertainers', destination: '/artists/musicians/', permanent: true },
      { source: '/what-we-do/musicians-bands-entertainers/', destination: '/artists/musicians/', permanent: true },
      { source: '/artist/djs', destination: '/artists/djs/', permanent: true },
      { source: '/artist/djs/', destination: '/artists/djs/', permanent: true },
      { source: '/equipment/fire-pit.html', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/equipment/fire-pit.html/', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/equipment/led-lighting.php', destination: '/services/lighting-design/', permanent: true },
      { source: '/equipment/led-lighting.php/', destination: '/services/lighting-design/', permanent: true },
      { source: '/equipment/led-lighting', destination: '/services/lighting-design/', permanent: true },
      { source: '/equipment/led-lighting/', destination: '/services/lighting-design/', permanent: true },

      // --- GSC Discovered–not-indexed: legacy paths (cart, shop, worksheets, galleries, tag, thanks, testimonials) ---
      { source: '/cart', destination: '/hire/', permanent: true },
      { source: '/cart/', destination: '/hire/', permanent: true },
      { source: '/shop', destination: '/hire/', permanent: true },
      { source: '/shop/', destination: '/hire/', permanent: true },
      { source: '/image-gallery', destination: '/galleries/', permanent: true },
      { source: '/image-gallery/', destination: '/galleries/', permanent: true },
      { source: '/image-gallery-2', destination: '/galleries/', permanent: true },
      { source: '/image-gallery-2/', destination: '/galleries/', permanent: true },
      { source: '/mirror-balls-anywhere', destination: '/services/lighting-design/', permanent: true },
      { source: '/mirror-balls-anywhere/', destination: '/services/lighting-design/', permanent: true },
      { source: '/mirror-balls-anywhere/attachment/:path*', destination: '/services/lighting-design/', permanent: true },
      { source: '/musicians-bands-worksheet', destination: '/artists/musicians/', permanent: true },
      { source: '/musicians-bands-worksheet/', destination: '/artists/musicians/', permanent: true },
      { source: '/tag/:path*', destination: '/about/blog/', permanent: true },
      { source: '/thanks', destination: '/thank-you/', permanent: true },
      { source: '/thanks/', destination: '/thank-you/', permanent: true },
      { source: '/testimonials', destination: '/testi/', permanent: true },
      { source: '/testimonials/', destination: '/testi/', permanent: true },
      { source: '/parties/christmas-parties', destination: '/parties/christmas/', permanent: true },
      { source: '/parties/christmas-parties/', destination: '/parties/christmas/', permanent: true },
      { source: '/zoom-dj-booking-form', destination: '/artists/djs/', permanent: true },
      { source: '/zoom-dj-booking-form/', destination: '/artists/djs/', permanent: true },
      { source: '/zoom-dj-final-details', destination: '/artists/djs/', permanent: true },
      { source: '/zoom-dj-final-details/', destination: '/artists/djs/', permanent: true },
      // NOTE: individual DJ slug pages now exist at app/artists/djs/[slug]/page.tsx
      // (dj-nige, dj-james, james-h, rich-s). Previous redirects to /artists/djs/
      // have been removed so each DJ has an indexable canonical URL. Legacy
      // /artists/djs/attachment/:path* and /dj-nige/attachment/:path* redirects
      // (defined elsewhere in this file) are kept for old WordPress attachments.

      // --- Old DJ booking / wedding-djs / blogs ---
      { source: '/dj-booking-confirmation', destination: '/book-dj/', permanent: true },
      { source: '/dj-booking-confirmation/', destination: '/book-dj/', permanent: true },
      { source: '/wedding-djs', destination: '/artists/djs/', permanent: true },
      { source: '/wedding-djs/', destination: '/artists/djs/', permanent: true },
      { source: '/blogs/:path*', destination: '/about/blog/', permanent: true },
      // Canonical wedding lighting URL (matches legacy-host map above; was wrongly → /services/lighting-design/)
      { source: '/wedding-lighting-design', destination: '/weddings/wedding-lighting/', permanent: true },
      { source: '/wedding-lighting-design/', destination: '/weddings/wedding-lighting/', permanent: true },
      { source: '/what-we-do/venue-styling', destination: '/services/venue-styling/', permanent: true },
      { source: '/wedding-styling', destination: '/services/venue-styling/', permanent: true },
      { source: '/wedding-styling/', destination: '/services/venue-styling/', permanent: true },

      // --- Analytics legacy (old site paths) – non-wildcard; wildcards moved to top ---
      { source: '/about/faqs', destination: '/about/faq/', permanent: true },
      { source: '/about/faqs/', destination: '/about/faq/', permanent: true },
      { source: '/what-we-do/djs-discos', destination: '/artists/djs/', permanent: true },
      { source: '/what-we-do/djs-discos/', destination: '/artists/djs/', permanent: true },
      { source: '/babington-house/the-orangery-at-babington-house', destination: '/venues/babington-house/', permanent: true },
      { source: '/babington-house/the-orangery-at-babington-house/', destination: '/venues/babington-house/', permanent: true },
      // /babington-dj-final-details is a real app route (client final-details form); do not redirect to venue.
      { source: '/work-for-us', destination: '/contact-us/', permanent: true },
      { source: '/work-for-us/', destination: '/contact-us/', permanent: true },
      { source: '/fire-pit-html/fire-pit-html', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/fire-pit-html/fire-pit-html/', destination: '/services/fire-pit-hire/', permanent: true },
      { source: '/my-account', destination: '/login/', permanent: true },
      { source: '/my-account/', destination: '/login/', permanent: true },

      // --- Attachment bloat (GSC): surgical redirects only; explicitly exclude / to prevent recursion ---
      { source: '/attachment', destination: '/', permanent: true },
      { source: '/attachment/', destination: '/', permanent: true },
      { source: '/attachment/:path*', destination: '/', permanent: true },
      { source: '/:path+/attachment', destination: '/', permanent: true },
      { source: '/:path+/attachment/', destination: '/', permanent: true },
      { source: '/:path+/attachment/:rest*', destination: '/', permanent: true },
    ]
  },
}

module.exports = nextConfig
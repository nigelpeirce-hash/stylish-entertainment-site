import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Disallow attachment URLs (GSC attachment bloat); redirects in next.config.js send them to /
        disallow: [
          '/admin/',
          '/api/',
          '/client/',
          '/demo-',
          '/demo/',
          '/login',
          '/register',
          '/attachment/',
          // Client-only forms (direct link; noindex on page metadata too)
          '/dj-worksheet',
          '/party-dj-worksheet',
          '/babington-dj-final-details',
        ],
      },
    ],
    sitemap: 'https://www.stylishentertainment.co.uk/sitemap.xml',
  }
}

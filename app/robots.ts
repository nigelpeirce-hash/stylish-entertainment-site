import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Disallow attachment URLs (GSC attachment bloat); redirects in next.config.js send them to /
        disallow: ['/admin/', '/api/', '/client/', '/demo-', '/demo/', '/login', '/register', '/attachment/'],
      },
    ],
    sitemap: 'https://www.stylishentertainment.co.uk/sitemap.xml',
  }
}

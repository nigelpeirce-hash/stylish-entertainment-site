import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/client/', '/demo-', '/login', '/register'],
      },
    ],
    sitemap: 'https://www.stylishentertainment.co.uk/sitemap.xml',
  }
}

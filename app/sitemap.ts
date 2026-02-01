import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

const baseUrl = 'https://www.stylishentertainment.co.uk';

function url(path: string, changeFrequency: 'weekly' | 'monthly' | 'yearly' = 'monthly', priority = 0.8) {
  const pathWithSlash = path.endsWith('/') ? path : `${path}/`;
  return { url: `${baseUrl}${pathWithSlash}`, lastModified: new Date(), changeFrequency, priority };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // --- Dynamic: DJs and hire items from DB ---
  // Use dynamic import so build doesn't fail when DATABASE_URL is missing/invalid (e.g. some Vercel build regions)
  let djUrls: MetadataRoute.Sitemap = [];
  let hireUrls: MetadataRoute.Sitemap = [];
  try {
    const { prisma } = await import('@/lib/prisma');
    const [djs, items] = await Promise.all([
      prisma.dJ.findMany({ where: { isActive: true }, select: { slug: true } }),
      prisma.hireItem.findMany({ where: { isActive: true }, select: { slug: true } }),
    ]);
    djUrls = (djs.filter((dj) => dj.slug) as { slug: string }[]).map((dj) =>
      url(`/artists/djs/${dj.slug}/`, 'monthly', 0.7)
    );
    hireUrls = (items.filter((item) => item.slug) as { slug: string }[]).map((item) =>
      url(`/hire/${item.slug}/`, 'monthly', 0.6)
    );
  } catch (error) {
    // DB unavailable during build (e.g. DATABASE_URL not set in Vercel) - return static-only sitemap
    console.warn('Sitemap: skipping DB (missing/invalid DATABASE_URL or connection failed):', (error as Error)?.message);
  }

  // --- Static: all public pages ---
  const staticPages: MetadataRoute.Sitemap = [
    url('/', 'weekly', 1),
    url('/about', 'monthly', 0.9),
    url('/about/faq', 'monthly', 0.8),
    url('/about/blog', 'monthly', 0.8),
    url('/about/blog/five-ways-to-totally-transform-a-venue-1-lighting', 'monthly', 0.7),
    url('/about/blog/five-ways-to-totally-transform-a-venue-2-decor', 'monthly', 0.7),
    url('/about/blog/bristol-university-spring-ball', 'monthly', 0.7),
    url('/about/blog/why-you-should-use-an-experienced-professional-dj', 'monthly', 0.7),
    url('/artists', 'monthly', 0.9),
    url('/artists/djs', 'monthly', 0.9),
    url('/artists/musicians', 'monthly', 0.9),
    url('/artists/party-djs', 'monthly', 0.9),
    url('/contact-us', 'monthly', 0.9),
    url('/contact', 'monthly', 0.8),
    url('/request-quote', 'monthly', 0.9),
    url('/galleries', 'monthly', 0.8),
    url('/galleries/instagram', 'monthly', 0.7),
    url('/galleries/videos', 'monthly', 0.7),
    url('/hire', 'monthly', 0.9),
    url('/parties', 'monthly', 0.9),
    url('/parties/party-lighting', 'monthly', 0.9),
    url('/parties/private-parties', 'monthly', 0.9),
    url('/parties/corporate', 'monthly', 0.8),
    url('/parties/corporate-events', 'monthly', 0.8),
    url('/parties/christmas', 'monthly', 0.8),
    url('/party-planning-and-organising', 'monthly', 0.9),
    url('/services', 'monthly', 0.9),
    url('/services/lighting-design', 'monthly', 0.9),
    url('/services/djs', 'monthly', 0.9),
    url('/services/venue-styling', 'monthly', 0.8),
    url('/services/fire-pit-hire', 'monthly', 0.8),
    url('/services/kit-hire', 'monthly', 0.8),
    url('/testi', 'monthly', 0.8),
    url('/weddings/wedding-entertainment', 'monthly', 0.9),
    url('/weddings/wedding-lighting', 'monthly', 0.9),
    url('/wedding-dj', 'monthly', 0.9),
    url('/what-we-do', 'monthly', 0.9),
    url('/what-we-do/lighting', 'monthly', 0.8),
    url('/what-we-do/venue-decoration', 'monthly', 0.8),
    url('/what-we-do/equipment-dj-band-sound-kit', 'monthly', 0.8),
    url('/venues', 'monthly', 0.9),
    url('/venues/babington-house', 'monthly', 0.8),
    url('/venues/mells-barn', 'monthly', 0.8),
    url('/venues/north-cadbury-court', 'monthly', 0.8),
    url('/venues/pennard-house', 'monthly', 0.8),
    url('/babington-wedding-info', 'monthly', 0.7),
    url('/kin-house-wiltshire', 'monthly', 0.7),
    url('/mells-barn-weddings', 'monthly', 0.7),
    url('/pennard-house-lighting', 'monthly', 0.7),
    url('/fire-pit-html', 'monthly', 0.7),
    url('/fire-pit-hire', 'monthly', 0.7),
    url('/lighting-hire-2', 'monthly', 0.6),
    url('/privacy-policy', 'yearly', 0.5),
    url('/terms-and-conditions', 'yearly', 0.5),
  ];

  return [...staticPages, ...djUrls, ...hireUrls];
}

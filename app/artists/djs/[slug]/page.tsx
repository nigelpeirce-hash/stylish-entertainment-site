import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createMetadata, generateCanonicalUrl } from "@/lib/metadata";
import { normalizeMixcloudEmbeds } from "@/lib/mixcloud-utils";
import { getDJExtras, type DJResidency } from "@/lib/dj-extras";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface DJData {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  fullBio: string | null;
  strapLine: string | null;
  imageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  mixcloudUrl: string | null;
  mixcloudEmbeds: unknown;
  youtubeEmbed: string | null;
}

type FetchResult =
  | { kind: "found"; dj: DJData }
  | { kind: "not-found" }
  | { kind: "db-error"; error: Error };

async function fetchDJBySlug(slug: string): Promise<FetchResult> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const dj = (await prisma.dJ.findFirst({
      where: { slug, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        bio: true,
        fullBio: true,
        strapLine: true,
        imageUrl: true,
        seoTitle: true,
        seoDescription: true,
        mixcloudUrl: true,
        mixcloudEmbeds: true,
        youtubeEmbed: true,
      },
    })) as DJData | null;
    return dj ? { kind: "found", dj } : { kind: "not-found" };
  } catch (error) {
    // Surface DB outage as 500, not 404 — Google retries 5xx but de-indexes 404s.
    console.error(`[DJ profile] DB error for slug "${slug}":`, (error as Error)?.message);
    return { kind: "db-error", error: error as Error };
  }
}

function stripToLength(content: string | null | undefined, max = 160): string {
  if (!content) return "";
  const text = content
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return text.substring(0, max - 1).replace(/\s+\S*$/, "") + "\u2026";
}

function normalizeYouTubeEmbed(input: string | null | undefined): string | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  let videoId: string | null = null;
  if (trimmed.includes("/embed/")) {
    videoId = trimmed.split("/embed/")[1]?.split("?")[0]?.split("&")[0] ?? null;
  } else if (trimmed.includes("youtube.com/watch?v=")) {
    videoId = trimmed.split("v=")[1]?.split("&")[0] ?? null;
  } else if (trimmed.includes("youtu.be/")) {
    videoId = trimmed.split("youtu.be/")[1]?.split("?")[0] ?? null;
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await fetchDJBySlug(slug);

  if (result.kind === "db-error") {
    // Don't lie to Google with a 200/404; render minimal metadata and let the
    // page itself throw so the response is 5xx.
    return { title: "DJ Profile" };
  }
  if (result.kind === "not-found") {
    return {
      title: "DJ Not Found",
      robots: { index: false, follow: false },
    };
  }
  const dj = result.dj;
  const extras = getDJExtras(slug);
  const title = dj.seoTitle?.trim() || `${dj.name} | Wedding & Event DJ`;
  const baseDescription =
    dj.seoDescription?.trim() ||
    dj.strapLine?.trim() ||
    stripToLength(dj.bio) ||
    `Book ${dj.name} for weddings, private parties and corporate events across the UK with STYLISH Entertainment.`;
  // Prepend long-term residency for trust signal + LLM-quotability. Strict
  // 160-char target for meta descriptions.
  const description = extras?.residency
    ? stripToLength(
        `Resident DJ at ${extras.residency.venue} since ${extras.residency.sinceYear} (${extras.residency.years}+ years). ${baseDescription}`,
        160
      )
    : baseDescription;

  // The DB imageUrl is a 400x400 face-cropped Cloudinary thumbnail (correct
  // for the listing card, too small for social cards). Re-derive a 1200x630
  // OG-sized URL from the same source by swapping the transformation segment
  // — works for every DJ without per-slug overrides. Uses `g_auto` instead of
  // `g_face` so the social card is content-aware rather than zoomed to face.
  const ogImageUrl = dj.imageUrl
    ? dj.imageUrl.replace(
        /\/upload\/[^/]+\//,
        "/upload/f_auto,q_85,dpr_1,w_1200,h_630,c_fill,g_auto/"
      )
    : null;

  return createMetadata({
    title,
    description,
    path: `artists/djs/${slug}`,
    openGraph: ogImageUrl
      ? {
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: `${dj.name} \u2014 professional DJ for weddings and events`,
            },
          ],
        }
      : undefined,
  });
}

function renderBioParagraphs(fullBio: string) {
  const beforeTestimonials = fullBio.split("---")[0] ?? "";
  return beforeTestimonials
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p && !p.includes("**Recent Testimonials**"))
    .map((paragraph, idx) => {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const nodes: ReactNode[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = linkRegex.exec(paragraph)) !== null) {
        if (match.index > lastIndex) {
          nodes.push(paragraph.substring(lastIndex, match.index));
        }
        nodes.push(
          <Link
            key={`l-${idx}-${match.index}`}
            href={match[2]}
            className="text-champagne-gold underline hover:text-champagne-gold/80"
          >
            {match[1]}
          </Link>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < paragraph.length) {
        nodes.push(paragraph.substring(lastIndex));
      }
      return (
        <p key={idx} className="text-base sm:text-lg leading-relaxed text-gray-200 mb-5">
          {nodes.length ? nodes : paragraph}
        </p>
      );
    });
}

export default async function DJProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await fetchDJBySlug(slug);

  if (result.kind === "db-error") {
    // Re-throw so Next.js renders the error boundary (HTTP 500). Google retries
    // 5xx responses; a 404 here would risk de-indexing a real DJ during a
    // transient DB outage.
    throw result.error;
  }
  if (result.kind === "not-found") {
    notFound();
  }
  const dj = result.dj;
  const extras = getDJExtras(slug);

  const canonical = generateCanonicalUrl(`artists/djs/${slug}`);
  const youtubeEmbed = normalizeYouTubeEmbed(dj.youtubeEmbed);
  const rawMixcloudInputs =
    Array.isArray(dj.mixcloudEmbeds) && (dj.mixcloudEmbeds as unknown[]).length > 0
      ? (dj.mixcloudEmbeds as (string | null | undefined)[])
      : dj.mixcloudUrl
      ? [dj.mixcloudUrl]
      : [];
  const mixcloudEmbeds = normalizeMixcloudEmbeds(rawMixcloudInputs);
  // Profile bio precedence: extras.profileBio (code-managed long-form) > DB fullBio > DB bio.
  // The listing modal continues to use DB fullBio so the modal is unaffected.
  const bioSource =
    extras?.profileBio?.trim() ||
    (dj.fullBio?.trim() ? dj.fullBio : dj.bio) ||
    "";

  const personDescription = extras?.residency
    ? `Resident DJ at ${extras.residency.venue} (Soho House Group) since ${extras.residency.sinceYear} — ${extras.residency.years}+ years of weddings, parties and events. ${stripToLength(dj.bio, 220)}`.trim()
    : stripToLength(dj.bio, 320) ||
      `Professional DJ with STYLISH Entertainment, performing for weddings and events across the UK.`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: dj.name,
    jobTitle: "DJ",
    url: canonical,
    ...(dj.imageUrl ? { image: dj.imageUrl } : {}),
    description: personDescription,
    worksFor: {
      "@type": "Organization",
      name: "Stylish Entertainment",
      url: "https://www.stylishentertainment.co.uk",
    },
    ...(extras?.residency
      ? {
          affiliation: {
            "@type": "Organization",
            name: extras.residency.venue,
            url: `https://www.stylishentertainment.co.uk${extras.residency.venueUrl}`,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <section className="relative min-h-[70vh] flex items-end justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Prefer the curated high-res hero image when set in dj-extras.ts.
            Falls back to the DB imageUrl (which is the 400px face-cropped
            thumbnail used by the listing card — blurry as a 1920px hero). */}
        {(extras?.heroImageUrl ?? dj.imageUrl) && (
          <>
            <div className="absolute inset-0">
              <Image
                src={(extras?.heroImageUrl ?? dj.imageUrl) as string}
                alt={`${dj.name} performing \u2014 professional DJ for weddings and events`}
                fill
                className="object-cover object-center brightness-110"
                style={{ objectPosition: "center 25%" }}
                priority
                fetchPriority="high"
                sizes="100vw"
              />
            </div>
            {/* Bottom-up gradient so the text overlay sits over a darker base
                without flattening the top half of the hero image. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </>
        )}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-32 pb-16 sm:pb-20 md:pb-24">
          <div className="inline-block mb-6 px-6 py-2 bg-champagne-gold/10 backdrop-blur-sm rounded-full border border-champagne-gold/30">
            <span className="text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase">
              Meet The DJ
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans mb-4 text-white font-bold drop-shadow-lg">
            {dj.name}
          </h1>
          {dj.strapLine?.trim() ? (
            <p className="text-lg sm:text-xl md:text-2xl text-champagne-gold font-semibold drop-shadow-md">
              {dj.strapLine}
            </p>
          ) : null}
        </div>
      </section>

      {extras?.residency ? (
        <ResidencyStrip residency={extras.residency} />
      ) : null}

      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-3xl">
          {bioSource ? (
            renderBioParagraphs(bioSource)
          ) : (
            <p className="text-base sm:text-lg leading-relaxed text-gray-200 mb-5">
              {dj.name} is one of our professional DJs available for weddings, private parties and corporate events across the UK.
            </p>
          )}

          {(youtubeEmbed || mixcloudEmbeds.length > 0) && (
            <div className="mt-12 space-y-8">
              {youtubeEmbed ? (
                <div>
                  <h2 className="text-xs font-semibold text-champagne-gold uppercase tracking-wider mb-3">
                    Watch
                  </h2>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/30 shadow-lg">
                    <iframe
                      src={youtubeEmbed}
                      title={`${dj.name} \u2014 video`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                </div>
              ) : null}

              {mixcloudEmbeds.length > 0 ? (
                <div>
                  <h2 className="text-xs font-semibold text-champagne-gold uppercase tracking-wider mb-3">
                    Listen
                  </h2>
                  <div className="space-y-3">
                    {mixcloudEmbeds.map((embed, idx) => (
                      <div
                        key={idx}
                        className="relative w-full rounded-lg overflow-hidden bg-black/30 shadow-lg"
                        style={{ height: "60px" }}
                      >
                        <iframe
                          src={embed}
                          title={`${dj.name} \u2014 mix ${idx + 1}`}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full"
                          allow="encrypted-media; fullscreen; autoplay; idle-detection; speaker-selection; web-share"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us/"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-champagne-gold text-black font-semibold min-h-[48px] hover:bg-champagne-gold/90 transition-colors"
            >
              Enquire about {dj.name}
            </Link>
            <Link
              href="/artists/djs/"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-champagne-gold text-champagne-gold font-semibold min-h-[48px] hover:bg-champagne-gold/10 transition-colors"
            >
              View all DJs
            </Link>
          </div>
        </div>
      </section>

      {extras?.testimonials && extras.testimonials.length > 0 ? (
        <TestimonialsSection
          heading={extras.testimonialsHeading ?? "What Couples Are Saying"}
          testimonials={extras.testimonials}
        />
      ) : null}
    </>
  );
}

function ResidencyStrip({ residency }: { residency: DJResidency }) {
  return (
    <aside
      aria-label={`Resident DJ at ${residency.venue}`}
      className="bg-gray-950 border-y border-champagne-gold/20 py-4 sm:py-5 px-4"
    >
      <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-center">
        <span
          aria-hidden="true"
          className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-champagne-gold/80"
        >
          Resident DJ
        </span>
        <span aria-hidden="true" className="hidden sm:inline text-champagne-gold/40">
          •
        </span>
        <p className="text-sm sm:text-base text-gray-200">
          <Link
            href={residency.venueUrl}
            className="text-champagne-gold font-semibold hover:text-champagne-gold/80"
          >
            {residency.venue}
          </Link>{" "}
          <span className="text-gray-400">
            since {residency.sinceYear} — over {residency.years} years
          </span>
        </p>
      </div>
    </aside>
  );
}

function TestimonialsSection({
  heading,
  testimonials,
}: {
  heading: string;
  testimonials: Array<{
    quote: string;
    author: string;
    venue: string;
    venueUrl?: string;
  }>;
}) {
  return (
    <section
      aria-label={heading}
      className="py-16 px-4 bg-gray-800 border-t border-champagne-gold/10"
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-3">
          {heading}
        </h2>
        <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto">
          A small selection of recent wedding feedback. Every quote is real, unedited and used with the couples&apos; permission.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <figure
              key={idx}
              className="flex flex-col h-full bg-gray-900/70 backdrop-blur-sm border border-champagne-gold/20 rounded-2xl p-6 sm:p-7 shadow-[0_0_24px_rgba(212,175,55,0.06)]"
            >
              <span
                aria-hidden="true"
                className="text-5xl text-champagne-gold/40 leading-none mb-3"
              >
                &ldquo;
              </span>
              <blockquote className="text-base leading-relaxed text-gray-200 flex-1">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 pt-5 border-t border-champagne-gold/10">
                <p className="text-white font-semibold">{t.author}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {t.venueUrl ? (
                    <a
                      href={t.venueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-champagne-gold/80 hover:text-champagne-gold"
                    >
                      {t.venue}
                    </a>
                  ) : (
                    t.venue
                  )}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

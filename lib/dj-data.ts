import { prisma } from "@/lib/prisma";
import { normalizeMixcloudUrl } from "@/lib/mixcloud-utils";

export interface DJCardData {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  strapLine: string | null;
  fullBio: string | null;
  imageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  mixcloudEmbeds: string[];
  youtubeEmbed: string | null;
}

/**
 * Server-only: fetch active DJs for the roster.
 * Mirrors /api/djs/route.ts so the on-page roster and the public API stay in
 * sync. Returns [] on DB error (so the page still renders).
 */
export async function fetchActiveDJsForRoster(): Promise<DJCardData[]> {
  try {
    const all = await prisma.dJ.findMany({
      where: { isActive: true },
      orderBy: [
        { displayOrder: "asc" },
        { name: "asc" },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        bio: true,
        strapLine: true,
        fullBio: true,
        imageUrl: true,
        seoTitle: true,
        seoDescription: true,
        mixcloudUrl: true,
        mixcloudEmbeds: true,
        youtubeEmbed: true,
      },
    });

    return all.map(({ mixcloudUrl, mixcloudEmbeds, ...dj }) => {
      const raw =
        Array.isArray(mixcloudEmbeds) && (mixcloudEmbeds as string[]).length > 0
          ? (mixcloudEmbeds as string[])
          : mixcloudUrl
          ? [mixcloudUrl]
          : [];
      const embeds = raw
        .map((u) => (u && typeof u === "string" ? normalizeMixcloudUrl(u) : null))
        .filter((u): u is string => Boolean(u));
      return { ...dj, mixcloudEmbeds: embeds };
    });
  } catch (error) {
    console.error(
      "[fetchActiveDJsForRoster] DB error:",
      (error as Error)?.message
    );
    return [];
  }
}

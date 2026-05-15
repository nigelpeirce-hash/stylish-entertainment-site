import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createMetadata, generateCanonicalUrl } from "@/lib/metadata";
import { sanitizeCloudinaryUrl } from "@/lib/cloudinary-utils";
import HireItemDetails from "./HireItemDetails";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

const LOCATIONS = "Somerset, Dorset, Wiltshire, Bristol, Bath, and Frome";

interface HireItemData {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  price: number;
  stockAvailable: number;
  imageUrl: string | null;
  category: string | null;
}

type FetchResult =
  | { kind: "found"; item: HireItemData }
  | { kind: "not-found" }
  | { kind: "db-error"; error: Error };

async function fetchHireItemBySlug(slug: string): Promise<FetchResult> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const item = (await prisma.hireItem.findFirst({
      where: { slug, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        seoTitle: true,
        seoDescription: true,
        price: true,
        stockAvailable: true,
        imageUrl: true,
        category: true,
      },
    })) as HireItemData | null;
    return item ? { kind: "found", item } : { kind: "not-found" };
  } catch (error) {
    // Surface DB outage as 5xx (Google retries) rather than 404 (de-index risk).
    console.error(
      `[Hire item] DB error for slug "${slug}":`,
      (error as Error)?.message,
    );
    return { kind: "db-error", error: error as Error };
  }
}

function buildDescription(item: HireItemData): string {
  return (
    item.seoDescription?.trim() ||
    `${item.description || item.name} hire available in ${LOCATIONS}. Professional wedding and event hire services in the South West and beyond.`
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await fetchHireItemBySlug(slug);

  if (result.kind === "db-error") {
    return { title: "Hire" };
  }
  if (result.kind === "not-found") {
    return {
      title: "Item Not Found",
      robots: { index: false, follow: false },
    };
  }

  const item = result.item;
  const title = item.seoTitle?.trim() || `${item.name} Hire | Stylish Entertainment`;
  const description = buildDescription(item);

  return createMetadata({
    title,
    description,
    path: `hire/${slug}`,
    openGraph: item.imageUrl
      ? {
          images: [
            {
              url: item.imageUrl,
              width: 1200,
              height: 630,
              alt: `${item.name} \u2014 available for hire from Stylish Entertainment`,
            },
          ],
        }
      : undefined,
  });
}

export default async function HireItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await fetchHireItemBySlug(slug);

  if (result.kind === "db-error") {
    throw result.error;
  }
  if (result.kind === "not-found") {
    notFound();
  }

  const item = result.item;
  const canonical = generateCanonicalUrl(`hire/${slug}`);
  const description = buildDescription(item);
  const imageSrc = item.imageUrl
    ? sanitizeCloudinaryUrl(item.imageUrl) || item.imageUrl
    : null;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description,
    url: canonical,
    ...(item.imageUrl ? { image: item.imageUrl } : {}),
    ...(item.category ? { category: item.category } : {}),
    offers: {
      "@type": "Offer",
      price: item.price,
      priceCurrency: "GBP",
      url: canonical,
      availability:
        item.stockAvailable > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    brand: {
      "@type": "Brand",
      name: "Stylish Entertainment",
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="container mx-auto px-4 py-12">
        <Link href="/hire/">
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hire Shop
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt={item.name}
                className="w-full h-96 object-cover rounded-lg"
                loading="eager"
              />
            ) : (
              <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                <Package className="w-32 h-32 text-gray-600" />
              </div>
            )}
          </div>

          <div>
            <HireItemDetails
              itemId={item.id}
              itemName={item.name}
              description={item.description}
              price={item.price}
              stockAvailable={item.stockAvailable}
              category={item.category}
            />
          </div>
        </div>

        <div className="mt-12 max-w-3xl">
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {item.name} Hire in the South West and beyond
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed mb-4">
                  {item.description ||
                    `${item.name} for ambient lighting. Perfect for creating a warm, romantic atmosphere at your event.`}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Professional wedding and event hire services in the South West
                  and beyond. Perfect for weddings, parties, and events.{" "}
                  <Link
                    href="/contact-us/"
                    className="text-champagne-gold underline hover:text-champagne-gold/80"
                  >
                    Contact us
                  </Link>{" "}
                  to discuss your requirements and book your items today.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

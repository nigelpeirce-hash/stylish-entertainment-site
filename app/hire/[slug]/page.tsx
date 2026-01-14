"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Plus } from "lucide-react";
import Link from "next/link";

interface HireItem {
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
  isActive: boolean;
}

const LOCATIONS = "Somerset, Dorset, Wiltshire, Bristol, Bath, and Frome";

export default function HireItemPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [item, setItem] = useState<HireItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItem();
  }, [slug]);

  useEffect(() => {
    if (item) {
      // Set page title
      const seoTitle = item.seoTitle || `${item.name} Hire | Stylish Entertainment`;
      document.title = seoTitle;

      // Set meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        const seoDesc = item.seoDescription || 
          `${item.description || item.name} hire available in ${LOCATIONS}. Professional wedding and event hire services.`;
        metaDescription.setAttribute("content", seoDesc);
      }

      // Set Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", seoTitle);

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        const seoDesc = item.seoDescription || 
          `${item.description || item.name} hire available in ${LOCATIONS}. Professional wedding and event hire services.`;
        ogDescription.setAttribute("content", seoDesc);
      }

      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage && item.imageUrl) {
        ogImage.setAttribute("content", item.imageUrl);
      }
    }
  }, [item]);

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/hire-items?slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        const items = data.items || [];
        const foundItem = items.find((i: HireItem) => i.slug === slug);
        
        if (foundItem && foundItem.isActive) {
          setItem(foundItem);
        } else {
          router.push("/hire");
        }
      }
    } catch (error) {
      console.error("Error fetching item:", error);
      router.push("/hire");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!item) return;
    
    try {
      const sessionId = localStorage.getItem("cartSessionId") || 
        `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cartSessionId", sessionId);

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hireItemId: item.id,
          quantity: 1,
          sessionId,
        }),
      });

      if (response.ok) {
        router.push("/hire");
      } else {
        alert("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  const seoDescription = item.seoDescription || 
    `${item.description || item.name} hire available in ${LOCATIONS}. Professional wedding and event hire services across the West Country.`;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": item.name,
            "description": seoDescription,
            "image": item.imageUrl || undefined,
            "offers": {
              "@type": "Offer",
              "price": item.price,
              "priceCurrency": "GBP",
              "availability": item.stockAvailable > 0 
                ? "https://schema.org/InStock" 
                : "https://schema.org/OutOfStock",
            },
            "brand": {
              "@type": "Brand",
              "name": "Stylish Entertainment",
            },
          }),
        }}
      />

      <div className="container mx-auto px-4 py-12">
        <Link href="/hire">
          <Button variant="ghost" className="text-gray-300 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hire Shop
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div>
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                <Package className="w-32 h-32 text-gray-600" />
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-champagne-gold">
                  £{item.price.toFixed(2)}
                </span>
                <span className="text-gray-400 ml-2">per hire</span>
              </div>

              {item.description && (
                <div className="mb-6">
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )}

              {/* SEO Location Text */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-blue-300">
                  <strong>Available for hire in:</strong> {LOCATIONS}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-gray-400 mb-2">
                  <strong>Stock Available:</strong> {item.stockAvailable}
                </p>
                {item.category && (
                  <p className="text-gray-400">
                    <strong>Category:</strong> {item.category}
                  </p>
                )}
              </div>

              <Button
                onClick={addToCart}
                disabled={item.stockAvailable === 0}
                size="lg"
                className="w-full bg-champagne-gold text-black hover:bg-gold-light"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add to Basket
              </Button>

              {item.stockAvailable === 0 && (
                <p className="text-red-400 mt-2 text-sm">
                  Currently out of stock
                </p>
              )}
            </motion.div>
          </div>
        </div>

        {/* Additional SEO Content */}
        <div className="mt-12 max-w-3xl">
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {item.name} Hire in {LOCATIONS}
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed mb-4">
                  {seoDescription}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Perfect for weddings, parties, and events across the West Country. 
                  Our {item.name.toLowerCase()} hire service is available throughout {LOCATIONS}. 
                  Contact us to discuss your requirements and book your items today.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

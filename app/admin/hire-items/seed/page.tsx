"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Package } from "lucide-react";
import Link from "next/link";

export default function SeedHireItems() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  const seedItems = async () => {
    setSeeding(true);
    setResult(null);
    setMessage("");

    try {
      const response = await fetch("/api/admin/hire-items/seed", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setResult("success");
        setMessage(data.message || "Items seeded successfully!");
        setTimeout(() => {
          router.push("/hire");
        }, 2000);
      } else {
        const error = await response.json();
        setResult("error");
        setMessage(error.error || "Failed to seed items");
      }
    } catch (error) {
      console.error("Error seeding items:", error);
      setResult("error");
      setMessage("An error occurred while seeding items");
    } finally {
      setSeeding(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session || (session?.user as any)?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardContent className="p-6 text-center space-y-4">
              <Package className="w-16 h-16 mx-auto mb-4 text-champagne-gold" />
              <h1 className="text-2xl font-bold">Seed Hire Items</h1>
              <p className="text-gray-400">
                This will create the initial hire items: Lanterns, Candlesticks, Mirroballs (40 available), and Vases (10 available).
              </p>

              {result === "success" && (
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <p className="text-green-400">{message}</p>
                  <p className="text-sm text-gray-400 mt-2">Redirecting to hire page...</p>
                </div>
              )}

              {result === "error" && (
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <XCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                  <p className="text-red-400">{message}</p>
                </div>
              )}

              {!result && (
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={seedItems}
                    disabled={seeding}
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    {seeding ? "Seeding..." : "Seed Hire Items"}
                  </Button>
                  <Link href="/admin">
                    <Button variant="outline" className="border-gray-600 text-gray-300">
                      Cancel
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

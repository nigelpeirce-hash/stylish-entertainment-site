"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "@/lib/motion";
import { CheckCircle, XCircle, Package } from "lucide-react";
import Link from "next/link";
import { isSuperAdmin } from "@/lib/admin-permissions";

export default function SeedHireItems() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check for dev bypass
    const devBypass = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
      sessionStorage.getItem("dev_admin_bypass") === "true";

    // Don't redirect while session is loading
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated" && !devBypass) {
      router.push("/login");
    } else if (status === "authenticated") {
      const userRole = (session?.user as any)?.role;
      const userEmail = session?.user?.email;
      
      if (userRole !== "admin") {
        router.push("/client/dashboard");
      } else if (!isSuperAdmin(userEmail) && !devBypass) {
        // Not SuperAdmin - redirect to dashboard
        router.push("/admin");
      }
    }
  }, [status, session, router]);

  const clearSeededItems = async () => {
    setClearing(true);
    setResult(null);
    setMessage("");
    try {
      const response = await fetch("/api/admin/hire-items/seed/", {
        method: "DELETE",
      });
      if (response.ok) {
        const data = await response.json();
        setResult("success");
        setMessage(data.message || "Seeded items removed. Shop Closed sign will show.");
        setTimeout(() => router.push("/hire"), 2000);
      } else {
        const error = await response.json();
        setResult("error");
        setMessage(error.error || "Failed to remove items");
      }
    } catch (error) {
      setResult("error");
      setMessage("An error occurred while clearing items");
    } finally {
      setClearing(false);
    }
  };

  const seedItems = async () => {
    setSeeding(true);
    setResult(null);
    setMessage("");

    try {
      const response = await fetch("/api/admin/hire-items/seed/", {
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
              <p className="text-sm text-gray-500">
                To show the &quot;Shop Closed&quot; sign again, remove the seeded items below.
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
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button
                    onClick={seedItems}
                    disabled={seeding}
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    {seeding ? "Seeding..." : "Seed Hire Items"}
                  </Button>
                  <Button
                    onClick={clearSeededItems}
                    disabled={clearing}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-900/30 hover:border-red-500"
                  >
                    {clearing ? "Removing..." : "Remove Seeded Items"}
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

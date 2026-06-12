"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, Shield, ArrowRight } from "lucide-react";

/**
 * DEVELOPMENT ONLY - Temporary entry point to admin dashboard
 * This bypasses authentication for development purposes
 * Remove or secure this route before production deployment
 */
export default function DevAdminEntry() {
  const router = useRouter();
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Only allow in development mode
    setIsDev(process.env.NODE_ENV === "development" || window.location.hostname === "localhost");
  }, []);

  const handleDevLogin = () => {
    // Store dev flag in sessionStorage to bypass auth checks
    sessionStorage.setItem("dev_admin_bypass", "true");
    sessionStorage.setItem("dev_admin_role", "admin");
    sessionStorage.setItem("dev_admin_name", "Dev Admin");
    
    // Redirect to admin dashboard
    router.push("/admin/");
  };

  if (!isDev) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
        <Card className="bg-gray-800 border-red-500 max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <Shield className="w-5 h-5" />
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              This development entry point is only available in development mode.
            </p>
            <Link href="/login/" className="block mt-4">
              <Button variant="outline" className="w-full border-champagne-gold text-champagne-gold">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <Card className="bg-gray-800 border-yellow-500/50 max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <AlertCircle className="w-5 h-5" />
            Development Entry Point
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-md p-3">
            <p className="text-sm text-yellow-300">
              ⚠️ <strong>Development Mode Only</strong>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              This bypasses authentication. Only use this in development. Remove before production.
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-300 text-sm">
              Click the button below to access the admin dashboard without authentication.
            </p>
            
            <Button
              onClick={handleDevLogin}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold"
            >
              Enter Admin Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 mb-2">
              Or use the standard login:
            </p>
            <Link href="/login/">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                Go to Login Page
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

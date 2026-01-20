"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isSuperAdmin } from "@/lib/admin-permissions";

export default function DevBypassToggle() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Check for dev bypass
    const devBypass = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
      sessionStorage.getItem("dev_admin_bypass") === "true";

    // Don't redirect while session is loading
    if (status === "loading") {
      return;
    }

    if (status === "authenticated") {
      const userRole = (session?.user as any)?.role;
      const userEmail = session?.user?.email;
      
      if (userRole !== "admin") {
        router.push("/client/dashboard");
        return;
      } else if (!isSuperAdmin(userEmail) && !devBypass) {
        // Not SuperAdmin - redirect to dashboard
        router.push("/admin");
        return;
      }
    } else if (status === "unauthenticated" && !devBypass) {
      router.push("/login");
      return;
    }

    if (typeof window !== "undefined") {
      const enabled = sessionStorage.getItem("dev_admin_bypass") === "true";
      setIsEnabled(enabled);
      
      const isDevelopment = 
        process.env.NODE_ENV === "development" || 
        window.location.hostname === "localhost" || 
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.startsWith("192.168.") ||
        window.location.hostname.startsWith("10.");
      setIsDev(isDevelopment);
    }
  }, [status, session, router]);

  const toggleBypass = () => {
    if (typeof window !== "undefined") {
      if (isEnabled) {
        sessionStorage.removeItem("dev_admin_bypass");
        setIsEnabled(false);
      } else {
        sessionStorage.setItem("dev_admin_bypass", "true");
        setIsEnabled(true);
      }
    }
  };

  if (!isDev) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <Card className="bg-gray-800 border-yellow-500/50 max-w-md">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Development Mode Only
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Dev bypass is only available in development mode (localhost).
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Current environment: <strong>{process.env.NODE_ENV || "production"}</strong>
            </p>
            <Link href="/admin">
              <Button variant="outline" className="w-full">
                Back to Admin
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-gray-800 border-champagne-gold/30">
          <CardHeader>
            <CardTitle className="text-2xl">Development Admin Bypass</CardTitle>
            <p className="text-sm text-gray-400 mt-2">
              Toggle authentication bypass for development
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                {isEnabled ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-500" />
                )}
                <div>
                  <p className="font-semibold">
                    {isEnabled ? "Bypass Enabled" : "Bypass Disabled"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {isEnabled 
                      ? "You can access admin pages without authentication"
                      : "Normal authentication required"}
                  </p>
                </div>
              </div>
            </div>

            {/* Toggle Button */}
            <Button
              onClick={toggleBypass}
              className={`w-full ${
                isEnabled
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              size="lg"
            >
              {isEnabled ? "Disable Bypass" : "Enable Bypass"}
            </Button>

            {/* Instructions */}
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-300 font-semibold mb-2">How it works:</p>
              <ul className="text-sm text-blue-200 space-y-1 list-disc list-inside">
                <li>Only works in development mode (localhost)</li>
                <li>Stored in sessionStorage (clears when tab closes)</li>
                <li>Bypasses both page and API authentication</li>
                <li>Refresh the page after toggling for changes to take effect</li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="flex gap-3">
              <Link href="/admin" className="flex-1">
                <Button variant="outline" className="w-full">
                  Admin Dashboard
                </Button>
              </Link>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex-1"
              >
                Refresh Page
              </Button>
            </div>

            {/* Console Command */}
            <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
              <p className="text-xs text-gray-400 mb-2">Or use browser console:</p>
              <code className="block p-2 bg-gray-900 rounded text-sm text-green-400 font-mono">
                {isEnabled 
                  ? 'sessionStorage.removeItem("dev_admin_bypass");'
                  : 'sessionStorage.setItem("dev_admin_bypass", "true");'}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

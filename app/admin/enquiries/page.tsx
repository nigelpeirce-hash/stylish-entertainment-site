"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { EnquiryDashboard } from "@/components/EnquiryDashboard";
import { motion } from "@/lib/motion";

function EnquiriesContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Auto-enable dev bypass on localhost (development only)
    const isLocalhost = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" || 
       window.location.hostname === "127.0.0.1" ||
       window.location.hostname.startsWith("192.168.") ||
       window.location.hostname.startsWith("10."));

    if (isLocalhost) {
      sessionStorage.setItem("dev_admin_bypass", "true");
      sessionStorage.setItem("dev_admin_role", "admin");
      sessionStorage.setItem("dev_admin_name", "Local Admin");
      return;
    }

    const devBypass = typeof window !== "undefined" && 
      sessionStorage.getItem("dev_admin_bypass") === "true";

    if (status === "unauthenticated" && !devBypass) {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin" && !devBypass) {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  const isLocalhost = typeof window !== "undefined" && 
    (process.env.NODE_ENV === "development" || 
     window.location.hostname === "localhost" || 
     window.location.hostname === "127.0.0.1" ||
     window.location.hostname.startsWith("192.168.") ||
     window.location.hostname.startsWith("10."));

  const devBypass = typeof window !== "undefined" && 
    sessionStorage.getItem("dev_admin_bypass") === "true";

  const isAdmin = session && (session?.user as any)?.role === "admin";
  const hasAccess = isAdmin || devBypass || isLocalhost;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <EnquiryDashboard />
    </div>
  );
}

export default function EnquiriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <EnquiriesContent />
    </Suspense>
  );
}

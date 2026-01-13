"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Artists() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Artists | Stylish Entertainment";
    // Redirect to DJs page as default
    router.push("/artists/djs");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center text-white">
        <p>Redirecting...</p>
      </div>
    </div>
  );
}

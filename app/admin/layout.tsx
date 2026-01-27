"use client";

import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Add admin class to body for CSS targeting
    document.body.classList.add("admin-page");
    
    return () => {
      // Clean up on unmount (though this shouldn't happen in practice)
      document.body.classList.remove("admin-page");
    };
  }, []);

  return <>{children}</>;
}

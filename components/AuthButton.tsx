"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

export function AuthButton() {
  const { data: session, status } = useSession();

  // Handle loading and error states gracefully
  if (status === "loading") {
    return null;
  }

  if (session) {
    const isAdmin = (session.user as any)?.role === "admin";
    return (
      <div className="flex items-center gap-2">
        <Link href={isAdmin ? "/admin" : "/client/dashboard"}>
          <Button
            variant="outline"
            size="sm"
            className="border-champagne-gold/50 text-white hover:bg-champagne-gold/20"
          >
            <User className="w-4 h-4 mr-2" />
            {isAdmin ? "Admin" : "Dashboard"}
          </Button>
        </Link>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="outline"
          size="sm"
          className="border-champagne-gold/50 text-white hover:bg-champagne-gold/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Link href="/login">
      <Button
        variant="outline"
        size="sm"
        className="border-champagne-gold/50 text-white hover:bg-champagne-gold/20"
      >
        <User className="w-4 h-4 mr-2" />
        Login
      </Button>
    </Link>
  );
}

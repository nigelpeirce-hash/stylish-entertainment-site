"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSetup() {
  const { data: session } = useSession();
  const [email, setEmail] = useState(session?.user?.email || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const makeAdmin = async () => {
    if (!email) {
      setResult("Please enter an email address");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/make-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`Success! ${email} is now an admin. Please log out and log back in.`);
      } else {
        setResult(`Error: ${data.error || "Failed to make user admin"}`);
      }
    } catch (error) {
      setResult("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-gray-800 border-champagne-gold/30">
          <CardHeader>
            <CardTitle>Make User Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>

            <Button
              onClick={makeAdmin}
              disabled={loading || !email}
              className="w-full bg-champagne-gold text-black hover:bg-gold-light"
            >
              {loading ? "Processing..." : "Make Admin"}
            </Button>

            {result && (
              <div
                className={`p-4 rounded ${
                  result.includes("Success")
                    ? "bg-green-900/20 border border-green-500/30 text-green-400"
                    : "bg-red-900/20 border border-red-500/30 text-red-400"
                }`}
              >
                {result}
              </div>
            )}

            <div className="text-sm text-gray-400 mt-4">
              <p>Current user: {session?.user?.email}</p>
              <p>Current role: {(session?.user as any)?.role || "client"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function DepositPaidThankYouContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (error === "missing" || error === "invalid" || error === "notfound") {
    return (
      <Card className="bg-gray-800 border-amber-500/30 max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-white">Link invalid or expired</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-300">
            This link may have been used already or is no longer valid. If you have paid your deposit, we will confirm once we have checked our bank.
          </p>
          <Link href="/">
            <Button variant="outline" className="border-amber-500 text-amber-400 hover:bg-amber-500/10">
              <Home className="w-4 h-4 mr-2" />
              Return to homepage
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (error === "server") {
    return (
      <Card className="bg-gray-800 border-amber-500/30 max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-white">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-300">
            We could not record your payment right now. If you have paid, we will confirm once we have checked our bank. You can also reply to your booking email to let us know.
          </p>
          <Link href="/">
            <Button variant="outline" className="border-amber-500 text-amber-400 hover:bg-amber-500/10">
              <Home className="w-4 h-4 mr-2" />
              Return to homepage
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-emerald-500/40 max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-emerald-900/40 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
        </div>
        <CardTitle className="text-2xl text-white">Payment reported</CardTitle>
        <p className="text-emerald-400/90 text-sm font-medium mt-1">Pending until we confirm</p>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-gray-300">
          We&apos;ve noted that you&apos;ve paid. We&apos;ll confirm once it has cleared, then send you a receipt and a link to your portal to add music requests and more.
        </p>
        <p className="text-gray-400 text-sm">
          If you have any questions, just reply to your booking email or contact us.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button className="bg-emerald-600 text-white hover:bg-emerald-500 border-0">
              <Home className="w-4 h-4 mr-2" />
              Return to homepage
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DepositPaidThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 flex items-center justify-center">
      <div className="container mx-auto">
        <Suspense fallback={<div className="text-center text-gray-400">Loading…</div>}>
          <DepositPaidThankYouContent />
        </Suspense>
      </div>
    </div>
  );
}

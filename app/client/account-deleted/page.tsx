"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home } from "lucide-react";
import Link from "next/link";

export default function AccountDeletedPage() {
  const router = useRouter();

  useEffect(() => {
    // Sign out the user since their account is deleted
    signOut({ redirect: false });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 flex items-center justify-center">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-900/30 rounded-full">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-3xl text-white mb-2">
                Account Scheduled for Deletion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-gray-300 text-lg">
                Your account has been successfully deleted. All personal data has been removed from our system.
              </p>
              
              <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Note:</strong> Your account deletion request has been logged with:
                </p>
                <ul className="text-xs text-gray-500 space-y-1 text-left max-w-md mx-auto">
                  <li>• Timestamp of deletion request</li>
                  <li>• IP address for audit purposes</li>
                </ul>
              </div>

              <p className="text-gray-400 text-sm">
                If you have any questions or need assistance, please don't hesitate to contact Nigel or Ali.
              </p>

              <div className="pt-4">
                <Link href="/">
                  <Button className="bg-champagne-gold text-black hover:bg-gold-light w-full sm:w-auto">
                    <Home className="w-4 h-4 mr-2" />
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

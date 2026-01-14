"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function CreateDefaultTemplate() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  const createDefaultTemplate = async () => {
    setCreating(true);
    setResult(null);

    const defaultTemplate = {
      name: "DJ Inquiry Response",
      category: "inquiry",
      subject: "Re: Your inquiry for {{eventDate}}",
      bodyHtml: `Any questions? Thank you very much for your enquiry and congratulations on your forthcoming {{eventType}} at {{venueName}}, a stunning space to get married.

We have three DJs available on {{eventDate}} who may be a great fit for your celebration. Details and fees are below.

__________________________________________________________________________________________________________________________________


About Our DJs

All of our DJs are professional, reliable and highly experienced, specialising in stylish weddings and private events.

Seamless mixing and beat-matching
Bespoke playlists based on your likes and dislikes
No microphones, no crowd hype, no cheesy group dances
Fully insured with PAT-tested equipment
Experienced in stately homes, private houses and marquee weddings
Fees are based on a maximum five-hour set and include DJ, sound system, dance floor lighting, travel and booking fee.

__________________________________________________________________________________________________________________________________


DJs Available

Rich S – {{djFee}}
Rich is an adaptable and accomplished wedding DJ with a deep knowledge of music past and present. He has played extensively across Oxford and London and is also a radio presenter on JACK FM.
Rich is known for keeping dance floors full across all age groups, creating energetic but well-judged sets tailored to each couple.
Selected venues include: Babington House, Brympton, Cripps Barn, Orchardleigh, Coombe Lodge, North Cadbury Court and many more.
Listen to Rich in the Mix on Mixcloud

Watch Rich S in action


Brett – {{djFee}}
Our youngest DJ, Brett is an energetic and versatile performer who started his career in Mallorca. He can adapt to any style, from Motown to Deep House. Selected venues include: Brympton House, Priston Mill, Tall Johns and many more.

Listen to Brett in the mix

James H – {{djFee}}
James is a highly sought-after Dj and presenter with a career spanning from Chiltern FM and Heart FM to being the face of Topshop TV. He has performed alongside major names like Judge Jules and Chase & Status, James is a regular choice for high-end brands like Reiss and Jack Wills. With over five decades of music knowledge, James is an expert at packing dance floors across any genre - from House and Kisstory  to Chart and Indie. His extensive venue credits include Heaven, Embassy, Chilfest, The Royal Yacht Club and North Cadbury Court.

Watch James in action here
Listen to James in the mix


____________________________________________________________________________________________________________________________________________________



What Our Couples Say

"All killer, no filler. The dance floor was full all night."
Vicky & Oli – Hotel du Vin, Poole

"Rich was incredible. The dance floor was alive all evening."
Alex & Matt – Birtsmorton Court

"Our photographers said they'd never seen a dance floor so full for so long."
Alina & Dan – Babington House

"Nigel absolutely nailed the mood – the music was the highlight of our day."
Sarah & George – Babington House


Optional Early Setup – £120

If your evening entertainment is in the same space as your wedding breakfast, we can set up earlier in the day to avoid disruption.
This includes a microphone for speeches and music playback during the reception. The DJ returns in the evening to perform.

____________________________________________________________________________________________________________________________________________________


Booking

To secure your chosen DJ, we take an initial booking fee, with the balance payable two weeks before your wedding.
Bookings are allocated on a first-come, first-served basis.

We also offer DJ-led live options, including saxophone and percussion, as well as jazz trios.

If you'd like to discuss your plans or ask any questions, please feel free to reply to this email or give me a call.

Kind regards,`,
      bodyText: "",
      isActive: true,
    };

    try {
      const response = await fetch("/api/admin/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultTemplate),
      });

      if (response.ok) {
        setResult("success");
        setTimeout(() => {
          router.push("/admin/email-templates");
        }, 2000);
      } else {
        setResult("error");
      }
    } catch (error) {
      console.error("Error creating template:", error);
      setResult("error");
    } finally {
      setCreating(false);
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
              <h1 className="text-2xl font-bold">Create Default DJ Inquiry Template</h1>
              <p className="text-gray-400">
                This will create a template based on your current email format with variables for DJ fee, event date, and timings.
              </p>

              {result === "success" && (
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <p className="text-green-400">Template created successfully! Redirecting...</p>
                </div>
              )}

              {result === "error" && (
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <XCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                  <p className="text-red-400">Failed to create template. It may already exist.</p>
                </div>
              )}

              {!result && (
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={createDefaultTemplate}
                    disabled={creating}
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    {creating ? "Creating..." : "Create Default Template"}
                  </Button>
                  <Link href="/admin/email-templates">
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

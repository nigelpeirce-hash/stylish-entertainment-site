import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WEDDING_DJ_HERO_ALT, WEDDING_DJ_HERO_LCP_URL } from "@/lib/wedding-dj-hero";

/** Server-rendered hero so LCP image is in initial HTML (no client hydration wait). */
export default function WeddingDjHero() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gray-950 text-white md:min-h-[85vh]">
      <div className="absolute inset-0">
        <Image
          src={WEDDING_DJ_HERO_LCP_URL}
          alt={WEDDING_DJ_HERO_ALT}
          fill
          className="object-cover object-center brightness-90"
          priority
          fetchPriority="high"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-gray-950" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 pt-32 text-center md:pt-40">
        <h1 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
          You&apos;re Terrified of a Cheesy DJ.
          <br />
          <span className="text-champagne-gold">We&apos;re the Antidote.</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-white/95 md:text-xl">
          High-quality, modern wedding entertainment for couples who hate &quot;wedding music.&quot;
          We&apos;re professional, and we promise: no cringe, no cheesy chat, and absolutely no
          &quot;YMCA.&quot;
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/contact-us/"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-champagne-gold px-8 py-6 text-lg font-semibold text-black hover:bg-gold-light"
            )}
          >
            Check Your Date
          </Link>
        </div>
      </div>
    </section>
  );
}

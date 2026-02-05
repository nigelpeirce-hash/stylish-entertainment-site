"use client";

/**
 * Header design reference page.
 * Same header as production; kept for design reference / sandbox.
 */
export default function HeaderPreviewPage() {
  return (
    <div className="min-h-screen">
      <div className="absolute top-0 left-0 right-0 z-[60] py-2 px-4 bg-amber-500/20 border-b border-amber-500/40 text-center safe-area-x">
        <span className="text-amber-200 text-sm font-medium">
          Header reference
        </span>
      </div>

      {/* Sample content so you can see the header in context */}
      <div className="pt-16 px-4 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="rounded-xl bg-black/40 border border-white/10 p-8">
            <h1 className="text-2xl md:text-3xl font-serif text-white mb-4">
              Sample hero section
            </h1>
            <p className="text-white/80">
              This is placeholder content so you can see how the new header looks
              above a typical page. The header includes the SE icon, wordmark,
              centre strapline (on desktop), Enquire button, Gallery dropdown,
              AuthButton, and burger menu with the full navigation.
            </p>
          </section>

          <section className="rounded-xl bg-black/40 border border-white/10 p-8">
            <h2 className="text-xl font-serif text-white mb-3">
              Responsive behaviour
            </h2>
            <ul className="text-white/80 space-y-2 list-disc list-inside">
              <li>Strapline hides on tablet and mobile</li>
              <li>Enquire stays visible on mobile; strapline hides</li>
              <li>AuthButton visible on sm and up</li>
              <li>Burger opens the full nav with all sections</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

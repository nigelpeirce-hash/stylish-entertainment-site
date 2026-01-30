"use client";

/**
 * Minimal admin footer: thin line and optional "Last updated" from booking.updatedAt.
 * Used on booking detail (with updatedAt) and in admin layout (thin line only).
 */

export interface AdminFooterProps {
  /** ISO date string; when provided, show "Last updated: [formatted date]" */
  updatedAt?: string | null;
}

function formatLastUpdated(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function AdminFooter({ updatedAt }: AdminFooterProps) {
  return (
    <footer className="relative z-10 border-t border-gray-200 py-3 mt-auto">
      <div className="container mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 text-center">
        {updatedAt ? (
          <p className="text-xs text-gray-500">
            Last updated {formatLastUpdated(updatedAt)}
          </p>
        ) : (
          <p className="text-xs text-gray-400">&nbsp;</p>
        )}
      </div>
    </footer>
  );
}

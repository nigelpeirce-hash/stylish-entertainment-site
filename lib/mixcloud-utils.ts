/**
 * Extract and normalize Mixcloud URLs for embedding.
 * Handles: iframe embed code, Mixcloud page URLs, and direct widget URLs.
 */

/**
 * Extract URL from iframe embed code.
 * e.g. <iframe src="https://player-widget.mixcloud.com/..."></iframe> → https://...
 */
function extractFromIframe(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  // Match src="..." or src='...'
  const srcMatch = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
  return srcMatch ? srcMatch[1].trim() : null;
}

/**
 * Convert Mixcloud page URL to widget embed URL.
 * e.g. https://www.mixcloud.com/username/show-name/ → https://player-widget.mixcloud.com/widget/iframe/?feed=%2Fusername%2Fshow-name%2F
 */
function pageUrlToWidgetUrl(pageUrl: string): string | null {
  try {
    const url = new URL(pageUrl);
    // Path is e.g. /username/show-name/ or /username/show-name; root URL cannot be embedded
    const path = url.pathname.replace(/^\/+|\/+$/g, "");
    if (!path) return null;
    const feed = "%2F" + path.split("/").join("%2F") + "%2F";
    return `https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=${feed}`;
  } catch {
    return null;
  }
}

/**
 * Normalize a single Mixcloud input (iframe HTML, page URL, or widget URL) to a valid embed URL.
 */
export function normalizeMixcloudUrl(input: string | null | undefined): string | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: string | null = null;

  if (trimmed.toLowerCase().includes("<iframe") || trimmed.includes("src=")) {
    url = extractFromIframe(trimmed);
  } else if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    url = trimmed;
  } else if (trimmed.includes("mixcloud.com")) {
    url = "https://" + trimmed.replace(/^https?:\/\//i, "");
  }

  if (!url) return null;

  // Ensure https
  url = url.replace(/^http:\/\//i, "https://");

  // Convert page URL to widget URL if needed (www.mixcloud.com can't be iframed – X-Frame-Options)
  if (url.includes("www.mixcloud.com/") && !url.includes("player-widget.mixcloud.com")) {
    const widgetUrl = pageUrlToWidgetUrl(url);
    if (!widgetUrl) return null;
    url = widgetUrl;
  }

  return url.startsWith("https://") ? url : null;
}

/**
 * Normalize an array of Mixcloud inputs to valid embed URLs.
 * Filters out empty/invalid entries.
 */
export function normalizeMixcloudEmbeds(inputs: (string | null | undefined)[]): string[] {
  const result: string[] = [];
  for (const input of inputs) {
    const url = normalizeMixcloudUrl(input);
    if (url && !result.includes(url)) {
      result.push(url);
    }
  }
  return result;
}

/**
 * Sanitize email HTML before rendering it inside the authenticated client portal.
 *
 * Inbound email bodies are user-controlled content (replies, third-party emails,
 * potentially spoofed). Rendering them via React's `dangerouslySetInnerHTML`
 * without sanitization is an XSS surface inside the same origin as the
 * portal session cookie. This helper strips scripts, event handlers, and
 * other dangerous constructs while preserving the formatting that makes
 * email content readable (links, lists, paragraphs, inline styles, images).
 *
 * Returns:
 *   { ok: true,  html: <safe html string> }  on success
 *   { ok: false, html: "" }                  if sanitization throws — callers
 *                                            should fall back to plain text
 *                                            (textContent / bodyText).
 */
import DOMPurify from "isomorphic-dompurify";

export interface SanitizedEmailHtml {
  ok: boolean;
  html: string;
}

export function sanitizeEmailHtml(input: string | null | undefined): SanitizedEmailHtml {
  if (!input || typeof input !== "string") return { ok: true, html: "" };

  try {
    const clean = DOMPurify.sanitize(input, {
      // Use the default safe-HTML profile (no SVG/MathML, no script).
      USE_PROFILES: { html: true },
      // Explicitly forbid risky/embedded surfaces even if a future profile
      // change ever permits them.
      FORBID_TAGS: [
        "script",
        "style",
        "iframe",
        "object",
        "embed",
        "form",
        "input",
        "button",
        "textarea",
        "select",
        "option",
        "meta",
        "link",
        "base",
      ],
      FORBID_ATTR: [
        // All inline event handlers — DOMPurify already strips these,
        // but listing the most common ones is defensive belt-and-braces.
        "onerror",
        "onload",
        "onclick",
        "onmouseover",
        "onfocus",
        "onblur",
        "onsubmit",
        "formaction",
      ],
      // Keep target/rel on <a> usable; we'll re-apply rel below.
      ALLOW_DATA_ATTR: false,
    });

    // Force every link to open in a new tab with safe rel — emails often
    // omit rel="noopener" and we don't want to open windows that can navigate
    // the portal via window.opener.
    const safeHtml = clean.replace(
      /<a\s+([^>]*?)>/gi,
      (match: string, attrs: string) => {
        const hasHref = /\bhref\s*=/.test(attrs);
        if (!hasHref) return match;
        const withoutTargetRel = attrs
          .replace(/\s+target\s*=\s*("[^"]*"|'[^']*'|\S+)/gi, "")
          .replace(/\s+rel\s*=\s*("[^"]*"|'[^']*'|\S+)/gi, "");
        return `<a ${withoutTargetRel.trim()} target="_blank" rel="noopener noreferrer nofollow ugc">`;
      }
    );

    return { ok: true, html: safeHtml };
  } catch {
    return { ok: false, html: "" };
  }
}

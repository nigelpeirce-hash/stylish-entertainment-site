/**
 * Extract Cloudinary public_id from a full URL.
 * Use when you have stored URLs but need publicId for @cloudinary/react.
 *
 * Examples:
 *   .../upload/v123/folder/file.jpg     → v123/folder/file or folder/file
 *   .../upload/f_auto,q_auto/v123/file  → v123/file
 */
export function extractCloudinaryPublicId(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) return null;
  const i = url.indexOf("/upload/");
  if (i === -1) return null;
  const after = url.slice(i + "/upload/".length);
  const parts = after.split("/");
  const nonTransforms: string[] = [];
  for (const p of parts) {
    if (!p) continue;
    const looksLikeTransform =
      p.includes(",") && (p.includes("f_") || p.includes("w_") || p.includes("h_") || p.includes("q_") || p.includes("c_") || p.includes("g_") || p.includes("dpr_"));
    if (!looksLikeTransform) nonTransforms.push(p);
  }
  if (nonTransforms.length === 0) return null;
  return nonTransforms.join("/");
}

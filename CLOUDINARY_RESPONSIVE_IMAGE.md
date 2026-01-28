# Cloudinary ResponsiveImage (AdvancedImage)

Cloudinary images are rendered via `@cloudinary/react` + `@cloudinary/url-gen` using a shared **ResponsiveImage** component.

## Setup

- **Packages:** `@cloudinary/react`, `@cloudinary/url-gen` (see `package.json`).
- **Config:** `lib/cloudinary-cld.ts` – Cloudinary instance with `cloudName: "drtwveoqo"`.
- **Component:** `components/cloudinary/ResponsiveImage.tsx` – uses `AdvancedImage`, `fill` resize, `quality("auto")`, `format("auto")`, `dpr("auto")`.

## Usage

```tsx
import { ResponsiveImage } from "@/components/cloudinary";

<ResponsiveImage
  publicId="stylish-entertainment/djs/James-F-DJ_wgijk1"  // or full Cloudinary URL
  alt="James H DJ"
  className="w-full h-full object-cover"
  width={400}
  height={400}
/>
```

- **publicId:** Cloudinary `public_id` (e.g. `folder/file`) or full Cloudinary URL; `public_id` is extracted from URLs automatically.
- **width / height:** Used for `fill` resize; defaults 800×800.

## Migrated components

- **Admin DJs:** `app/admin/djs/DJCard.tsx`, `app/admin/djs/DJForm.tsx` – Cloudinary images use `ResponsiveImage`; non-Cloudinary still use `next/image`.
- **Multi-artist reply:** `components/MultiArtistReply.tsx` – artist avatars use `ResponsiveImage` when the URL is Cloudinary.

## Extending

To migrate more pages (e.g. `app/artists/djs`, galleries): import `ResponsiveImage`, pass `publicId` (or Cloudinary URL), and optional `width`/`height`/`className`. Use `next/image` or plain `img` for non-Cloudinary URLs.

## Helpers

- **`lib/cloudinary-public-id.ts`** – `extractCloudinaryPublicId(url)` extracts `public_id` from a full Cloudinary URL.
- **`lib/cloudinary-utils.ts`** – legacy URL helpers (`fixCloudinaryUrl`, etc.); still used for emails, API routes, and scripts.

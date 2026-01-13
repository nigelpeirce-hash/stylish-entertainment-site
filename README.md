# Stylish Entertainment Website

A high-end, sophisticated entertainment website built with Next.js, Tailwind CSS, and modern web technologies.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Components**: Custom UI components (Shadcn/UI style)
- **Animations**: Framer Motion
- **Form Validation**: Zod + React Hook Form
- **Gallery**: react-photo-album + yet-another-react-lightbox
- **Deployment**: Optimized for Azure Static Web Apps

## Design Identity

- **Tone**: Sophisticated, minimalist, "Anti-Cheesy"
- **Colors**: 
  - Deep Charcoal (#1A1A1A)
  - Champagne Gold (#D4AF37)
  - Soft Ivory (#F5F5F0)
- **Typography**: 
  - Serif (Playfair Display) for headings
  - Sans-serif (Inter) for body text

## Features

### Pages

1. **Home** - Hero section, service grid, testimonials slider, featured venues
2. **Artists** - DJ profiles with slider, YouTube/Mixcloud embeds, skills tags
3. **Services** - Detailed service breakdowns with gallery triggers
4. **Galleries** - Lightbox-style photo galleries
5. **Contact** - Form with Zod validation

### SEO Optimization

- London-focused keywords in meta titles
- Semantic HTML structure (h1-h3 hierarchy)
- Descriptive alt text for all images
- Open Graph meta tags

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

This generates a static export in the `out` directory, ready for Azure Static Web Apps deployment.

## Project Structure

```
├── app/
│   ├── page.tsx          # Home page
│   ├── artists/          # Artists/DJs page
│   ├── services/         # Services page
│   ├── galleries/        # Galleries page
│   ├── contact/          # Contact form page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # Reusable UI components
│   ├── Navigation.tsx    # Site navigation
│   ├── Footer.tsx        # Site footer
│   └── Gallery.tsx       # Photo gallery component
└── lib/
    └── utils.ts          # Utility functions
```

## Customization

### Images

Replace placeholder Unsplash images with your actual photos:
- Update image URLs in page components
- Ensure all images have descriptive alt text for SEO

### Content

- Update DJ profiles in `app/artists/page.tsx`
- Modify services in `app/services/page.tsx`
- Add real testimonials in `app/page.tsx`
- Update featured venues list

### Form Submission

The contact form currently logs to console. To enable actual form submission:
1. Set up an API endpoint or form service (e.g., Formspree, SendGrid)
2. Update the `onSubmit` handler in `app/contact/page.tsx`

## Deployment to Azure Static Web Apps

1. Build the project: `npm run build`
2. Deploy the `out` directory to Azure Static Web Apps
3. Configure custom domain if needed

## Notes

- All pages use client components for interactivity
- SEO meta tags are set via `useEffect` hooks (consider using Next.js metadata API for server components if needed)
- Images are currently using Unsplash placeholders - replace with actual photos
- Form submission is simulated - integrate with your backend/email service

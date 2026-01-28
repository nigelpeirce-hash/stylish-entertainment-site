#!/bin/bash

# Blog Post Scaffolder Script
# Usage: ./scripts/scaffold-blog.sh "My New Post"
# Example: ./scripts/scaffold-blog.sh "Summer Wedding Tips"

if [ -z "$1" ]; then
  echo "❌ Error: Please provide a blog post name"
  echo "Usage: ./scripts/scaffold-blog.sh \"My New Post\""
  exit 1
fi

NAME="$1"
SLUG=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -d "'" | tr -d '"')
COMP_NAME=$(echo "$NAME" | sed 's/[^a-zA-Z0-9]//g')
WRAPPER_NAME="${COMP_NAME}Wrapper"
CONTENT_NAME="${COMP_NAME}Content"

echo "📝 Scaffolding blog post: ${NAME}"
echo "   Slug: ${SLUG}"
echo "   Components: ${WRAPPER_NAME}, ${CONTENT_NAME}"

# 1. Create the Wrapper Component (Client Component)
echo "   Creating wrapper component..."
cat <<EOF > "components/blog/${WRAPPER_NAME}.tsx"
"use client";

import dynamic from "next/dynamic";

// Dynamically import the content component to prevent SSR/prerendering issues
const ${CONTENT_NAME} = dynamic(
  () => import("@/app/about/blog/${SLUG}/${CONTENT_NAME}"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    ),
  }
);

export default function ${WRAPPER_NAME}() {
  return <${CONTENT_NAME} />;
}
EOF

# 2. Create the page directory and page.tsx (Server Component)
echo "   Creating page component..."
mkdir -p "app/about/blog/${SLUG}"
cat <<EOF > "app/about/blog/${SLUG}/page.tsx"
// Force dynamic rendering - this page cannot be statically generated
// This must be at the very top to prevent build-time prerendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import ${WRAPPER_NAME} from "@/components/blog/${WRAPPER_NAME}";

// Additional route segment config to ensure no static generation
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// Skip static generation entirely - build on-demand when users visit
export async function generateStaticParams() {
  return [];
}

export default async function BlogPost${COMP_NAME}() {
  return <${WRAPPER_NAME} />;
}
EOF

# 3. Create the Content Component (Client Component)
echo "   Creating content component..."
cat <<EOF > "app/about/blog/${SLUG}/${CONTENT_NAME}.tsx"
"use client";

import { motion } from "framer-motion";

export default function ${CONTENT_NAME}() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-white"
    >
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">${NAME}</h1>
        
        {/* Add your blog content here */}
        <div className="prose prose-invert max-w-none">
          <p>Start writing your blog post content here...</p>
        </div>
      </div>
    </motion.div>
  );
}
EOF

echo ""
echo "✅ Blog post scaffolded successfully!"
echo ""
echo "📁 Files created:"
echo "   - components/blog/${WRAPPER_NAME}.tsx"
echo "   - app/about/blog/${SLUG}/page.tsx"
echo "   - app/about/blog/${SLUG}/${CONTENT_NAME}.tsx"
echo ""
echo "🔗 Your blog post will be available at: /about/blog/${SLUG}"
echo ""
echo "📝 Next steps:"
echo "   1. Edit app/about/blog/${SLUG}/${CONTENT_NAME}.tsx to add your content"
echo "   2. Add images, components, or other content as needed"
echo "   3. Test locally: npm run dev"
echo "   4. Deploy: git add . && git commit -m \"Add blog: ${NAME}\" && git push"

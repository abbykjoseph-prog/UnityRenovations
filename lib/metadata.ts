import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Builds per-page metadata. Next.js replaces (rather than merges) a parent's
 * `openGraph` object, so every page gets the full set of Open Graph fields here.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const ogTitle = path === "/" ? title : `${title} | ${site.name}`;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_CA",
      siteName: site.name,
      url: path,
      title: ogTitle,
      description,
      images: [{ url: `${site.url}/og-image.jpg`, width: 1200, height: 630, alt: `${site.name}: renovation and construction` }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [`${site.url}/og-image.jpg`],
    },
  };
}

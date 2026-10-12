import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { PRIVACY_LAST_UPDATED, TERMS_LAST_UPDATED } from "@/lib/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes: { path: string; priority: number; changeFrequency: "monthly" | "yearly"; lastModified?: Date }[] = [
    { path: "", priority: 1, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/projects", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly", lastModified: new Date(PRIVACY_LAST_UPDATED) },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly", lastModified: new Date(TERMS_LAST_UPDATED) },
  ];
  return routes.map((r) => ({
    url: `${site.url}${r.path}`,
    lastModified: r.lastModified ?? lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

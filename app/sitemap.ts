import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes: { path: string; priority: number; changeFrequency: "monthly" | "yearly" }[] = [
    { path: "", priority: 1, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/projects", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
  ];
  return routes.map((r) => ({ url: `${site.url}${r.path}`, lastModified, changeFrequency: r.changeFrequency, priority: r.priority }));
}

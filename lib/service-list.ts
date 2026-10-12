// Lightweight list of service names, safe to import from client code (no images).
// Full service content lives in lib/services.ts.

export const serviceList = [
  { slug: "basement-renovations", title: "Basement renovations & finishing", shortTitle: "Basement renovations" },
  { slug: "kitchen-remodels", title: "Kitchen remodels", shortTitle: "Kitchen remodels" },
  { slug: "bathroom-remodels", title: "Bathroom remodels", shortTitle: "Bathroom remodels" },
  { slug: "whole-home-renovations", title: "Whole-home renovations", shortTitle: "Whole-home renovations" },
  { slug: "additions", title: "Additions & extensions", shortTitle: "Additions & extensions" },
  { slug: "rebuilds", title: "Rebuilds", shortTitle: "Rebuilds" },
  { slug: "custom-homes", title: "Custom home builds: from the foundation up", shortTitle: "Custom home builds" },
] as const;

export type ServiceSlug = (typeof serviceList)[number]["slug"];

export function serviceInfo(slug: ServiceSlug) {
  return serviceList.find((s) => s.slug === slug)!;
}

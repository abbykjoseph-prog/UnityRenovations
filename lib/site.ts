/**
 * Single source of truth for Unity Renovations' business details.
 *
 * Details come from the previous site (unityrenovations.ca) and from the owner.
 */

export const site = {
  name: "Unity Renovations",
  legalName: "Unity Renovations Inc.",
  tagline: "Construction · Renovation · Remodelling",
  // Used for metadataBase, canonical links, sitemap, robots and structured data.
  // The site lives on the www host. Email addresses (and Resend) use the bare
  // unityrenovations.ca domain, which is separate from this. NEXT_PUBLIC_SITE_URL overrides it.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.unityrenovations.ca",
  description:
    "Renovation and construction company serving the GTA: Toronto, Mississauga, Brampton & Hamilton. From basement finishing and kitchen remodels to rebuilds and custom homes built from the foundation up, delivered on time and on budget.",

  founder: "Nick Joseph",
  founderLine: "Founded and Operated by Nick Joseph",
  foundedYear: 2018,

  phone: "905-510-5929",
  phoneHref: "tel:+19055105929",
  email: "info@unityrenovations.ca",

  // Service-area business: there is no office, so no street address is published anywhere.
  serviceRegion: "GTA",
  serviceCities: ["Toronto", "Mississauga", "Brampton", "Hamilton"],
  serviceAreaLine: "Serving the GTA: Toronto, Mississauga, Brampton & Hamilton",
  // From the old site footer
  serviceHighlights: ["Free Estimates", "Competitive Rates", "Quality Workmanship"],

  hours: [
    { days: "Monday – Friday", time: "7:30 am – 7:30 pm" },
    { days: "Saturday", time: "9 am – 5 pm" },
    { days: "Sunday", time: "Closed" },
  ],

  instagram: {
    handle: "@unityrenovations",
    href: "https://www.instagram.com/unityrenovations/",
  },
} as const;

/**
 * Whole years since the company was founded. Never hardcode this number:
 * use <YearsInBusiness /> in components so it stays current without a rebuild.
 */
export function getYearsInBusiness(date: Date = new Date()): number {
  return date.getFullYear() - site.foundedYear;
}

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

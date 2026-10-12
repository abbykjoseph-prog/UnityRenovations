/**
 * Single source of truth for Unity Renovations' business details.
 *
 * Details come from the previous site (unityrenovations.ca) and from the owner.
 * Anything still unknown is marked with "[ADD: ...]".
 * Search this file for "[ADD:" to find every value that still needs to be filled in.
 */

export const PLACEHOLDER_PREFIX = "[ADD:";

export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || value.trim().startsWith(PLACEHOLDER_PREFIX);
}

export const site = {
  name: "Unity Renovations",
  legalName: "Unity Renovations Inc.",
  tagline: "Construction · Renovation · Remodelling",
  url: "https://unityrenovations.ca",
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

  licensing: "[ADD: licences, insurance and WSIB coverage]",
  warranty: "[ADD: workmanship warranty terms]",

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

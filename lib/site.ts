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

export type Testimonial = {
  quote: string;
  name: string;
  location?: string;
  project?: string;
};

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
    { days: "Monday – Friday", time: "[ADD: weekday hours]" },
    { days: "Saturday", time: "[ADD: Saturday hours]" },
    { days: "Sunday", time: "[ADD: Sunday hours]" },
  ],

  instagram: {
    handle: "@unityrenovations",
    href: "https://www.instagram.com/unityrenovations/",
  },

  yearsInBusiness: "[ADD: years in business]",
  licensing: "[ADD: licences, insurance and WSIB coverage]",
  warranty: "[ADD: workmanship warranty terms]",

  // No testimonials were published on the old site. The testimonials section on the
  // home page stays hidden until at least one real testimonial is added here.
  testimonials: [] as Testimonial[],
} as const;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

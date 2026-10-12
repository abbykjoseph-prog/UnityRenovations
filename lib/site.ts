/**
 * Single source of truth for Unity Renovations' business details.
 *
 * Everything here was taken from the previous site (unityrenovations.ca) or the
 * business cards published on it, unless it is marked with "[ADD: ...]".
 * Search this file for "[ADD:" to find every value that still needs to be filled in.
 */

export const PLACEHOLDER_PREFIX = "[ADD:";

export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || value.trim().startsWith(PLACEHOLDER_PREFIX);
}

export type Contact = {
  name: string;
  phone: string; // display format
  phoneHref: string; // tel: link in E.164
};

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
    "Unity Renovations is a Greater Toronto Area renovation and construction company. From basement finishing and kitchen remodels to rebuilds and custom homes built from the foundation up, delivered on time and on budget.",

  // Primary line (shown on the old site's Contact page)
  phone: "905-510-5929",
  phoneHref: "tel:+19055105929",
  email: "info@unityrenovations.ca",

  // Both contacts appear on the business cards published on the old site.
  contacts: [
    { name: "Nick Joseph", phone: "905-510-5929", phoneHref: "tel:+19055105929" },
    { name: "Jordan Precaj", phone: "647-568-5123", phoneHref: "tel:+16475685123" },
  ] satisfies Contact[],

  serviceArea: "Greater Toronto Area",
  serviceAreaShort: "the GTA",
  // From the old site footer
  serviceHighlights: ["Free Estimates", "Competitive Rates", "Quality Workmanship"],

  address: {
    street: "[ADD: street address, or remove if you work from a service area only]",
    city: "[ADD: city]",
    region: "ON",
    postalCode: "[ADD: postal code]",
    country: "CA",
  },

  hours: [
    { days: "Monday – Friday", time: "[ADD: weekday hours]" },
    { days: "Saturday", time: "[ADD: Saturday hours]" },
    { days: "Sunday", time: "[ADD: Sunday hours]" },
  ],

  // Leave empty to hide the social icons. Example: { label: "Instagram", href: "https://instagram.com/..." }
  social: [] as { label: "Instagram" | "Facebook" | "Houzz" | "LinkedIn"; href: string }[],

  yearsInBusiness: "[ADD: years in business]",
  foundedYear: "[ADD: year founded]",
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

export type Testimonial = {
  quote: string;
  firstName: string;
  /** Single letter, without a period, e.g. "M" */
  lastInitial: string;
  city: string;
};

/**
 * Real client reviews only. The testimonials section on the home page stays
 * hidden while this array is empty.
 *
 * Example entry:
 * { quote: "…", firstName: "Sarah", lastInitial: "M", city: "Mississauga" },
 */
export const testimonials: Testimonial[] = [];

/** "— FirstName L., City" */
export function formatAttribution(t: Testimonial): string {
  return `— ${t.firstName} ${t.lastInitial.replace(/\.$/, "")}., ${t.city}`;
}

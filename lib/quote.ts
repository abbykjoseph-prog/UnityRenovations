// Quote request form: options and validation shared by the client form and the API route.
import { serviceList } from "@/lib/service-list";

export const projectTypes = [
  ...serviceList.map((s) => ({ value: s.slug, label: s.title })),
  { value: "other", label: "Something else" },
] as const;

export const budgetRanges = [
  { value: "under-25k", label: "Under $25,000" },
  { value: "25k-50k", label: "$25,000 – $50,000" },
  { value: "50k-100k", label: "$50,000 – $100,000" },
  { value: "100k-250k", label: "$100,000 – $250,000" },
  { value: "250k-500k", label: "$250,000 – $500,000" },
  { value: "500k-plus", label: "$500,000+" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const timelines = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3-months", label: "Within 1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "6-12-months", label: "6–12 months" },
  { value: "12-plus-months", label: "More than a year out" },
  { value: "exploring", label: "Just exploring" },
] as const;

export type QuoteRequest = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
};

export type QuoteField = keyof QuoteRequest;
export type QuoteErrors = Partial<Record<QuoteField, string>>;

/** Name of the hidden honeypot input. Real visitors never fill it in. */
export const HONEYPOT_FIELD = "company_website";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const oneOf = (list: readonly { value: string }[], v: string) => list.some((o) => o.value === v);

export function labelFor(list: readonly { value: string; label: string }[], value: string) {
  return list.find((o) => o.value === value)?.label ?? value;
}

export function validateQuote(input: Record<string, unknown>): { data: QuoteRequest; errors: QuoteErrors } {
  const data: QuoteRequest = {
    name: str(input.name),
    email: str(input.email),
    phone: str(input.phone),
    projectType: str(input.projectType),
    budget: str(input.budget),
    timeline: str(input.timeline),
    message: str(input.message),
  };

  const errors: QuoteErrors = {};

  if (data.name.length < 2) errors.name = "Please enter your name.";
  else if (data.name.length > 100) errors.name = "Please keep your name under 100 characters.";

  if (!data.email) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(data.email) || data.email.length > 254) errors.email = "Please enter a valid email address.";

  const digits = data.phone.replace(/\D/g, "");
  if (!data.phone) errors.phone = "Please enter a phone number so we can reach you.";
  else if (digits.length < 10 || digits.length > 15 || /[^\d\s()+.\-x]/i.test(data.phone))
    errors.phone = "Please enter a valid phone number, including area code.";

  if (!oneOf(projectTypes, data.projectType)) errors.projectType = "Please choose a project type.";
  if (!oneOf(budgetRanges, data.budget)) errors.budget = "Please choose an approximate budget.";
  if (!oneOf(timelines, data.timeline)) errors.timeline = "Please choose a timeline.";

  if (data.message.length < 10) errors.message = "Please tell us a little about your project (at least 10 characters).";
  else if (data.message.length > 5000) errors.message = "Please keep your message under 5,000 characters.";

  return { data, errors };
}

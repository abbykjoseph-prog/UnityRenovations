// Step-by-step contact module: options, state shape, step sequence and validation.
// Client-safe (no zod). The server schema in lib/inquiry-schema.ts reuses these rules.

export const projectTypes = [
  { value: "basement", label: "Basement" },
  { value: "bathroom", label: "Bathroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "addition", label: "Extension / Addition" },
  { value: "decking", label: "Decking" },
  { value: "outdoor", label: "Outdoor" },
  { value: "whole-home", label: "Whole-Home Renovation" },
  { value: "custom-home", label: "Custom Home Build" },
  { value: "not-sure", label: "I'm not sure yet" },
] as const;

export const budgetRanges = [
  { value: "under-10k", label: "Under $10,000" },
  { value: "10k-25k", label: "$10,000–$25,000" },
  { value: "25k-50k", label: "$25,000–$50,000" },
  { value: "50k-100k", label: "$50,000–$100,000" },
  { value: "100k-250k", label: "$100,000–$250,000" },
  { value: "250k-500k", label: "$250,000–$500,000" },
  { value: "500k-plus", label: "$500,000+" },
] as const;

export const timelines = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3-months", label: "Within 1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "6-12-months", label: "6–12 months" },
  { value: "12-plus-months", label: "More than a year out" },
  { value: "exploring", label: "I'm just exploring" },
] as const;

export type InquiryPath = "contact" | "project";
export type ProjectType = (typeof projectTypes)[number]["value"];
export type BudgetRange = (typeof budgetRanges)[number]["value"];
export type Timeline = (typeof timelines)[number]["value"];
export type ContactMethod = "email" | "phone";

/** Everything the visitor has answered, in one object. */
export type InquiryData = {
  path: InquiryPath | null;
  projectType: ProjectType | null;
  hasBudget: boolean | null;
  budgetRange: BudgetRange | null;
  timeline: Timeline | null;
  name: string;
  contactMethod: ContactMethod | null;
  email: string;
  phone: string;
  message: string;
};

export const emptyInquiry: InquiryData = {
  path: null,
  projectType: null,
  hasBudget: null,
  budgetRange: null,
  timeline: null,
  name: "",
  contactMethod: null,
  email: "",
  phone: "",
  message: "",
};

export type StepId =
  | "path"
  | "projectType"
  | "hasBudget"
  | "budget"
  | "timeline"
  | "name"
  | "method"
  | "contactValue"
  | "message"
  | "review";

/** The ordered steps for the visitor's current answers (the budget step only appears after "Yes"). */
export function stepSequence(data: InquiryData): StepId[] {
  const contactSteps: StepId[] = ["name", "method", "contactValue", "message", "review"];
  if (data.path === "contact") return ["path", ...contactSteps];
  if (data.path === "project") {
    const budget: StepId[] = data.hasBudget === false ? [] : ["budget"];
    return ["path", "projectType", "hasBudget", ...budget, "timeline", ...contactSteps];
  }
  return ["path"];
}

export const labelFor = <T extends string>(list: readonly { value: T; label: string }[], value: T | null) =>
  list.find((o) => o.value === value)?.label ?? "";

/* ---------- Field rules (shared with the server schema) ---------- */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const NAME_MAX = 100;
export const MESSAGE_MAX = 5000;
export const CONTACT_MESSAGE_MIN = 5;

/** Digits only, without a leading North American country code. */
export function phoneDigits(value: string): string {
  const d = value.replace(/\D/g, "");
  return d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
}

/** Canadian / North American (NANP) number: area code and exchange can't start with 0 or 1. */
export function isValidPhone(value: string): boolean {
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(phoneDigits(value));
}

/** Formats as the visitor types: 416 → (416) 555 → (416) 555-1234 */
export function formatPhone(value: string): string {
  const d = phoneDigits(value).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function nameError(name: string): string | null {
  const n = name.trim();
  if (n.length < 2) return "Please enter your name.";
  if (n.length > NAME_MAX) return `Please keep your name under ${NAME_MAX} characters.`;
  return null;
}

export function emailError(email: string): string | null {
  const e = email.trim();
  if (!e) return "Please enter your email address.";
  if (!EMAIL_RE.test(e) || e.length > 254) return "Please enter a valid email address, like name@example.com.";
  return null;
}

export function phoneError(phone: string): string | null {
  if (!phone.trim()) return "Please enter your phone number.";
  if (!isValidPhone(phone)) return "Please enter a valid 10-digit phone number, like (416) 555-1234.";
  return null;
}

export function messageError(message: string, path: InquiryPath | null): string | null {
  const m = message.trim();
  if (m.length > MESSAGE_MAX) return `Please keep your message under ${MESSAGE_MAX.toLocaleString("en-CA")} characters.`;
  if (path === "contact" && m.length < CONTACT_MESSAGE_MIN) return "Please add a short message so we know how we can help.";
  return null;
}

export type StepErrors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

/** Validation for the text-entry steps. Option steps are complete once an option is chosen. */
export function validateStep(step: StepId, data: InquiryData): StepErrors {
  switch (step) {
    case "name": {
      const e = nameError(data.name);
      return e ? { name: e } : {};
    }
    case "contactValue": {
      if (data.contactMethod === "email") {
        const e = emailError(data.email);
        return e ? { email: e } : {};
      }
      const e = phoneError(data.phone);
      return e ? { phone: e } : {};
    }
    case "message": {
      const e = messageError(data.message, data.path);
      return e ? { message: e } : {};
    }
    default:
      return {};
  }
}

export function isStepComplete(step: StepId, data: InquiryData): boolean {
  switch (step) {
    case "path":
      return data.path !== null;
    case "projectType":
      return data.projectType !== null;
    case "hasBudget":
      return data.hasBudget !== null;
    case "budget":
      return data.budgetRange !== null;
    case "timeline":
      return data.timeline !== null;
    case "method":
      return data.contactMethod !== null;
    case "name":
    case "contactValue":
    case "message":
      return Object.keys(validateStep(step, data)).length === 0;
    case "review":
      return false;
  }
}

/** Only the fields that apply to the chosen path, ready to POST. */
export function toPayload(data: InquiryData) {
  const contact =
    data.contactMethod === "email"
      ? { contactMethod: "email" as const, email: data.email.trim() }
      : { contactMethod: "phone" as const, phone: formatPhone(data.phone) };
  const base = { name: data.name.trim(), ...contact, message: data.message.trim() };
  if (data.path === "contact") return { path: "contact" as const, ...base };
  return {
    path: "project" as const,
    projectType: data.projectType,
    hasBudget: data.hasBudget,
    ...(data.hasBudget ? { budgetRange: data.budgetRange } : {}),
    timeline: data.timeline,
    ...base,
  };
}

/** Maps service page slugs to a preselected project type for /contact?path=project&type=... */
export const serviceToProjectType: Record<string, ProjectType> = {
  "basement-renovations": "basement",
  "kitchen-remodels": "kitchen",
  "bathroom-remodels": "bathroom",
  "whole-home-renovations": "whole-home",
  additions: "addition",
  "custom-homes": "custom-home",
};

export const QUOTE_HREF = "/contact?path=project";

/** Hidden spam-trap input. Real visitors never fill it in. */
export const HONEYPOT_FIELD = "company_website";

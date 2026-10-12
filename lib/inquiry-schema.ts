import "server-only";
import { z } from "zod";
import {
  budgetRanges,
  CONTACT_MESSAGE_MIN,
  EMAIL_RE,
  formatPhone,
  isValidPhone,
  labelFor,
  MESSAGE_MAX,
  NAME_MAX,
  projectTypes,
  timelines,
} from "@/lib/inquiry";

const values = <T extends string>(list: readonly { value: T }[]) => list.map((o) => o.value) as [T, ...T[]];

const name = z
  .string({ error: "Please enter your name." })
  .trim()
  .min(2, "Please enter your name.")
  .max(NAME_MAX, `Please keep your name under ${NAME_MAX} characters.`);

// Contact details: the field that matches the chosen method is required and validated.
const contactDetails = z.discriminatedUnion(
  "contactMethod",
  [
    z.object({
      contactMethod: z.literal("email"),
      email: z
        .string({ error: "Please enter your email address." })
        .trim()
        .max(254)
        .regex(EMAIL_RE, "Please enter a valid email address."),
    }),
    z.object({
      contactMethod: z.literal("phone"),
      phone: z
        .string({ error: "Please enter your phone number." })
        .trim()
        .refine(isValidPhone, "Please enter a valid 10-digit phone number.")
        .transform(formatPhone),
    }),
  ],
  { error: "Please choose email or phone." },
);

const contactRequest = z
  .object({
    path: z.literal("contact"),
    name,
    message: z
      .string({ error: "Please add a short message so we know how we can help." })
      .trim()
      .min(CONTACT_MESSAGE_MIN, "Please add a short message so we know how we can help.")
      .max(MESSAGE_MAX),
  })
  .and(contactDetails);

const projectRequest = z
  .object({
    path: z.literal("project"),
    projectType: z.enum(values(projectTypes), { message: "Please choose a project type." }),
    hasBudget: z.boolean({ message: "Please tell us whether you have a budget in mind." }),
    budgetRange: z.enum(values(budgetRanges)).optional(),
    timeline: z.enum(values(timelines), { message: "Please choose a timeline." }),
    name,
    message: z.string().trim().max(MESSAGE_MAX).default(""),
  })
  .refine((d) => !d.hasBudget || d.budgetRange !== undefined, {
    message: "Please choose a budget range.",
    path: ["budgetRange"],
  })
  .and(contactDetails);

export const inquirySchema = z.union([contactRequest, projectRequest]);
export type Inquiry = z.infer<typeof inquirySchema>;

/** Validates against the schema for the path the visitor chose, so errors are specific to that path. */
export function parseInquiry(body: unknown) {
  const path = (body as { path?: unknown } | null)?.path;
  const schema = path === "project" ? projectRequest : contactRequest;
  const result = schema.safeParse(body);
  if (result.success) return { ok: true as const, data: result.data as Inquiry };
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return { ok: false as const, errors };
}

/** A clear subject line and a plain-text body that reads well in any inbox. */
export function formatInquiryEmail(inquiry: Inquiry, receivedAt = new Date()) {
  const contactLine =
    inquiry.contactMethod === "email" ? `Email: ${inquiry.email}` : `Phone: ${inquiry.phone}`;
  const when = receivedAt.toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    dateStyle: "medium",
    timeStyle: "short",
  });

  if (inquiry.path === "contact") {
    const subject = `New contact request from ${inquiry.name}`;
    const text = [
      subject,
      "",
      `Name: ${inquiry.name}`,
      `Prefers: ${inquiry.contactMethod === "email" ? "Email" : "Phone"}`,
      contactLine,
      "",
      "Message:",
      inquiry.message,
      "",
      `Received: ${when} (Toronto time)`,
    ].join("\n");
    return { subject, text };
  }

  const type = labelFor(projectTypes, inquiry.projectType);
  const budget = inquiry.hasBudget && inquiry.budgetRange ? labelFor(budgetRanges, inquiry.budgetRange) : "No budget set";
  const timeline = labelFor(timelines, inquiry.timeline);
  const subject = `New project inquiry: ${type} — ${budget} — ${timeline}`;
  const text = [
    "New project inquiry",
    "",
    `Project type: ${type}`,
    `Budget: ${inquiry.hasBudget ? budget : "No budget in mind yet"}`,
    `Timeline: ${timeline}`,
    "",
    `Name: ${inquiry.name}`,
    `Prefers: ${inquiry.contactMethod === "email" ? "Email" : "Phone"}`,
    contactLine,
    "",
    "Message:",
    inquiry.message || "(none)",
    "",
    `Received: ${when} (Toronto time)`,
  ].join("\n");
  return { subject, text };
}

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

export const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/**
 * Subject line plus a clean HTML email and a plain-text fallback, listing every answer.
 * When the visitor chose phone, the number is shown prominently at the top.
 */
export function formatInquiryEmail(inquiry: Inquiry, receivedAt = new Date()) {
  const when = receivedAt.toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const prefers = inquiry.contactMethod === "email" ? "Email" : "Phone";
  const contactValue = inquiry.contactMethod === "email" ? inquiry.email : inquiry.phone;

  let subject: string;
  let heading: string;
  const rows: [string, string][] = [];

  if (inquiry.path === "contact") {
    subject = `New contact request from ${inquiry.name}`;
    heading = "New contact request";
    rows.push(["Reason", "I need to reach you"]);
  } else {
    const type = labelFor(projectTypes, inquiry.projectType);
    const budget = inquiry.hasBudget && inquiry.budgetRange ? labelFor(budgetRanges, inquiry.budgetRange) : "No budget set";
    const timeline = labelFor(timelines, inquiry.timeline);
    subject = `New project inquiry: ${type} — ${budget} — ${timeline}`;
    heading = "New project inquiry";
    rows.push(
      ["Reason", "I have a project in mind"],
      ["Project type", type],
      ["Budget", inquiry.hasBudget ? budget : "No budget in mind yet"],
      ["Timeline", timeline],
    );
  }
  rows.push(["Name", inquiry.name], ["Prefers", prefers], [prefers, contactValue]);
  const message = inquiry.message || "(none)";

  const text = [
    heading,
    "",
    ...(inquiry.contactMethod === "phone" ? [`CALL BACK: ${inquiry.phone}`, ""] : []),
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    message,
    "",
    `Received: ${when} (Toronto time)`,
  ].join("\n");

  const callout =
    inquiry.contactMethod === "phone"
      ? `<tr><td style="padding:0 32px 24px"><div style="background:#0077B6;border-radius:4px;padding:16px 20px;color:#ffffff">
          <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.85">Prefers a phone call</div>
          <a href="tel:+1${inquiry.phone.replace(/\D/g, "")}" style="display:block;margin-top:4px;font-size:26px;font-weight:700;color:#ffffff;text-decoration:none">${escapeHtml(inquiry.phone)}</a>
        </div></td></tr>`
      : "";

  const rowHtml = rows
    .map(([label, value]) => {
      const shown =
        label === "Email"
          ? `<a href="mailto:${escapeHtml(value)}" style="color:#00699F">${escapeHtml(value)}</a>`
          : label === "Phone"
            ? `<a href="tel:+1${value.replace(/\D/g, "")}" style="color:#00699F">${escapeHtml(value)}</a>`
            : escapeHtml(value);
      return `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #EEE9E1;width:140px;vertical-align:top;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5A5E66">${escapeHtml(label)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #EEE9E1;font-size:16px;color:#14161B">${shown}</td>
      </tr>`;
    })
    .join("");

  const html = `<!doctype html>
<html lang="en-CA"><body style="margin:0;padding:24px 12px;background:#F6F3EE;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:6px;border:1px solid #EEE9E1">
    <tr><td style="padding:28px 32px 20px">
      <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#00699F">Unity Renovations website</div>
      <h1 style="margin:6px 0 0;font-family:Georgia,serif;font-size:24px;font-weight:normal;color:#14161B">${escapeHtml(heading)}</h1>
    </td></tr>
    ${callout}
    <tr><td style="padding:0 32px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowHtml}</table>
    </td></tr>
    <tr><td style="padding:20px 32px 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5A5E66">Message</td></tr>
    <tr><td style="padding:0 32px 24px;font-size:16px;line-height:1.5;color:#14161B;white-space:pre-wrap">${escapeHtml(message)}</td></tr>
    <tr><td style="padding:16px 32px 24px;border-top:1px solid #EEE9E1;font-size:12px;color:#5A5E66">Received ${escapeHtml(when)} (Toronto time) via the contact form on www.unityrenovations.ca</td></tr>
  </table>
</body></html>`;

  return { subject, text, html };
}

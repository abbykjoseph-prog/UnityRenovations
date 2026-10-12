import "server-only";
import { Resend } from "resend";

// Sends contact form emails through Resend. Server-only: reads RESEND_API_KEY.

export type SendResult =
  | { ok: true; id: string | undefined }
  | { ok: false; reason: "not-configured"; missing: string[] }
  | { ok: false; reason: "send-failed"; detail: string };

type Content = { subject: string; text: string; html: string };

const addressList = (value: string) =>
  value
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

/** Removes anything that looks like an email address, so error text can be logged without personal details. */
export const redactEmails = (text: string) => text.replace(/[^\s@<>"'`]+@[^\s@<>"'`]+/g, "[email]");

function readConfig(required: ("RESEND_API_KEY" | "FROM_EMAIL" | "CONTACT_TO_EMAIL")[]) {
  const values = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FROM_EMAIL: process.env.FROM_EMAIL,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  };
  // Report missing variables by name only, never their values
  const missing = required.filter((name) => !values[name]);
  return { values, missing };
}

async function send(apiKey: string, message: Content & { from: string; to: string[]; replyTo?: string | string[] }): Promise<SendResult> {
  try {
    const { data, error } = await new Resend(apiKey).emails.send(message);
    if (error) return { ok: false, reason: "send-failed", detail: redactEmails(`${error.name}: ${error.message}`) };
    return { ok: true, id: data?.id };
  } catch (err) {
    return { ok: false, reason: "send-failed", detail: redactEmails(err instanceof Error ? err.message : "Unknown error") };
  }
}

/** The inquiry itself, sent to the business (CONTACT_TO_EMAIL). */
export async function sendInquiryEmail({ replyTo, ...content }: Content & { replyTo?: string }): Promise<SendResult> {
  const { values, missing } = readConfig(["RESEND_API_KEY", "FROM_EMAIL", "CONTACT_TO_EMAIL"]);
  if (missing.length > 0) return { ok: false, reason: "not-configured", missing };
  return send(values.RESEND_API_KEY!, {
    ...content,
    from: values.FROM_EMAIL!,
    to: addressList(values.CONTACT_TO_EMAIL!),
    ...(replyTo ? { replyTo } : {}),
  });
}

/** Confirmation to the visitor. Replies go to the business inbox (CONTACT_TO_EMAIL). */
export async function sendConfirmationEmail(to: string, content: Content): Promise<SendResult> {
  const { values, missing } = readConfig(["RESEND_API_KEY", "FROM_EMAIL", "CONTACT_TO_EMAIL"]);
  if (missing.length > 0) return { ok: false, reason: "not-configured", missing };
  return send(values.RESEND_API_KEY!, {
    ...content,
    from: values.FROM_EMAIL!,
    to: [to],
    replyTo: addressList(values.CONTACT_TO_EMAIL!),
  });
}

import "server-only";
import { Resend } from "resend";

// Sends contact form submissions through Resend. Server-only: reads RESEND_API_KEY.

export type SendResult =
  | { ok: true; id: string | undefined }
  | { ok: false; reason: "not-configured"; missing: string[] }
  | { ok: false; reason: "send-failed"; detail: string };

type Message = { subject: string; text: string; html: string; replyTo?: string };

export async function sendInquiryEmail({ subject, text, html, replyTo }: Message): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  // Report which variables are missing by name only, never their values
  const missing = [
    ["RESEND_API_KEY", apiKey],
    ["FROM_EMAIL", from],
    ["CONTACT_TO_EMAIL", to],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name as string);
  if (missing.length > 0) return { ok: false, reason: "not-configured", missing };

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: from!,
      to: to!.split(",").map((address) => address.trim()),
      subject,
      text,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) return { ok: false, reason: "send-failed", detail: `${error.name}: ${error.message}` };
    return { ok: true, id: data?.id };
  } catch (err) {
    return { ok: false, reason: "send-failed", detail: err instanceof Error ? err.message : "Unknown error" };
  }
}

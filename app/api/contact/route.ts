import { NextResponse } from "next/server";
import { budgetRanges, HONEYPOT_FIELD, labelFor, projectTypes, timelines, validateQuote } from "@/lib/quote";

const MAX_BODY_BYTES = 20_000;
// Submissions faster than this are almost certainly bots
const MIN_FILL_TIME_MS = 3_000;

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Request too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid body");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Spam checks: pretend success so bots don't learn anything.
  const honeypot = typeof body[HONEYPOT_FIELD] === "string" && (body[HONEYPOT_FIELD] as string).trim() !== "";
  const startedAt = Number(body.startedAt);
  const tooFast = Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_TIME_MS;
  if (honeypot || tooFast) {
    console.warn("[contact] Discarded likely spam submission", { honeypot, tooFast });
    return NextResponse.json({ ok: true });
  }

  const { data, errors } = validateQuote(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const submission = {
    ...data,
    projectTypeLabel: labelFor(projectTypes, data.projectType),
    budgetLabel: labelFor(budgetRanges, data.budget),
    timelineLabel: labelFor(timelines, data.timeline),
    receivedAt: new Date().toISOString(),
  };

  // For now, submissions are logged (visible in the Vercel function logs).
  console.info("[contact] New quote request", JSON.stringify(submission));

  // TODO(email): Send the submission with Resend.
  //   1. npm install resend
  //   2. Add RESEND_API_KEY (and optionally CONTACT_TO_EMAIL) in Vercel → Project → Settings → Environment Variables
  //   3. Verify the unityrenovations.ca domain in Resend so mail can be sent from it
  //   4. Replace this comment with something like:
  //
  //   import { Resend } from "resend";
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   const { error } = await resend.emails.send({
  //     from: "Unity Renovations Website <quotes@unityrenovations.ca>",
  //     to: process.env.CONTACT_TO_EMAIL ?? site.email,
  //     replyTo: data.email,
  //     subject: `Quote request: ${submission.projectTypeLabel} – ${data.name}`,
  //     text: [
  //       `Name: ${data.name}`, `Email: ${data.email}`, `Phone: ${data.phone}`,
  //       `Project: ${submission.projectTypeLabel}`, `Budget: ${submission.budgetLabel}`,
  //       `Timeline: ${submission.timelineLabel}`, "", data.message,
  //     ].join("\n"),
  //   });
  //   if (error) {
  //     console.error("[contact] Resend error", error);
  //     return NextResponse.json({ ok: false, error: "We couldn't send your request." }, { status: 502 });
  //   }

  return NextResponse.json({ ok: true });
}

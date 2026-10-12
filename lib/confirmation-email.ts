import "server-only";
import { budgetRanges, labelFor, projectTypes, timelines } from "@/lib/inquiry";
import { escapeHtml, type Inquiry } from "@/lib/inquiry-schema";
import { site } from "@/lib/site";

export const CONFIRMATION_SUBJECT = "Thanks for reaching out to Unity Renovations";

/**
 * Confirmation sent to visitors who chose email. Deliberately leaves out their free-text
 * message so the form can't be used to send arbitrary content to any address.
 */
export function formatConfirmationEmail(inquiry: Inquiry) {
  const firstName = inquiry.name.trim().split(/\s+/)[0] || "there";
  const intro = "thanks for getting in touch! We've received your message and will get back to you within 1 business day.";

  // Project inquiries get a short summary of their selections
  const summary: [string, string][] = [];
  if (inquiry.path === "project") {
    summary.push(["Project type", labelFor(projectTypes, inquiry.projectType)]);
    if (inquiry.hasBudget && inquiry.budgetRange) summary.push(["Budget range", labelFor(budgetRanges, inquiry.budgetRange)]);
    summary.push(["Timeline", labelFor(timelines, inquiry.timeline)]);
  }

  const websiteHost = new URL(site.url).host;
  const cities = site.serviceCities;
  const servingLine = `Serving ${cities.slice(0, -1).join(", ")} & ${cities.at(-1)}`;
  const footerLines = [
    `Phone: ${site.phone}`,
    `Website: ${site.url}`,
    `Instagram: ${site.instagram.handle} (${site.instagram.href})`,
    servingLine,
  ];

  const text = [
    `Hi ${firstName}, ${intro}`,
    ...(summary.length ? ["", "Your project details:", ...summary.map(([label, value]) => `- ${label}: ${value}`)] : []),
    "",
    "If anything changes in the meantime, just reply to this email.",
    "",
    "— Unity Renovations",
    "",
    ...footerLines,
  ].join("\n");

  const summaryHtml = summary.length
    ? `<tr><td style="padding:0 32px 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#5A5E66">Your project details</td></tr>
       <tr><td style="padding:0 32px 24px">
         <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F3EE;border-radius:4px">
           ${summary
             .map(
               ([label, value]) => `<tr>
             <td style="padding:10px 16px;width:130px;font-size:13px;color:#5A5E66">${escapeHtml(label)}</td>
             <td style="padding:10px 16px;font-size:15px;color:#14161B">${escapeHtml(value)}</td>
           </tr>`,
             )
             .join("")}
         </table>
       </td></tr>`
    : "";

  const link = "color:#00699F;text-decoration:underline";
  const html = `<!doctype html>
<html lang="en-CA"><body style="margin:0;padding:24px 12px;background:#F6F3EE;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:6px;border:1px solid #EEE9E1">
    <tr><td style="padding:28px 32px 8px">
      <a href="${site.url}"><img src="${site.url}/images/logo.png" width="200" height="58" alt="${escapeHtml(site.legalName)}" style="display:block;border:0;width:200px;height:auto"></a>
    </td></tr>
    <tr><td style="padding:16px 32px 0">
      <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;font-weight:normal;color:#14161B">Hi ${escapeHtml(firstName)},</h1>
      <p style="margin:12px 0 24px;font-size:16px;line-height:1.55;color:#14161B">${escapeHtml(intro.charAt(0).toUpperCase() + intro.slice(1))}</p>
    </td></tr>
    ${summaryHtml}
    <tr><td style="padding:0 32px 28px;font-size:15px;line-height:1.55;color:#14161B">
      If anything changes in the meantime, just reply to this email.<br><br>— Unity Renovations
    </td></tr>
    <tr><td style="padding:20px 32px 24px;background:#14161B;border-radius:0 0 6px 6px;font-size:13px;line-height:1.7;color:#A9ADB5">
      <a href="${site.phoneHref}" style="color:#ffffff;text-decoration:none;font-weight:bold">${escapeHtml(site.phone)}</a><br>
      <a href="${site.url}" style="color:#5CB8EA;text-decoration:underline">${escapeHtml(websiteHost)}</a>
      &nbsp;·&nbsp;
      <a href="${site.instagram.href}" style="color:#5CB8EA;text-decoration:underline">Instagram ${escapeHtml(site.instagram.handle)}</a><br>
      ${escapeHtml(servingLine)}
    </td></tr>
  </table>
  <p style="max-width:600px;margin:12px auto 0;text-align:center;font-size:11px;color:#5A5E66">You're receiving this because you contacted ${escapeHtml(site.legalName)} through <a href="${site.url}" style="${link}">${escapeHtml(websiteHost)}</a>.</p>
</body></html>`;

  return { subject: CONFIRMATION_SUBJECT, text, html };
}

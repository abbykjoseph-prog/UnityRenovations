import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { TERMS_LAST_UPDATED } from "@/lib/legal";
import { site } from "@/lib/site";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  description: `The terms that apply when you use the ${site.name} website.`,
  path: "/terms",
});

const Email = () => <a href={`mailto:${site.email}`}>{site.email}</a>;

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Using this website",
    content: (
      <p>
        By using this website, you agree to these terms. If you don&rsquo;t agree, please don&rsquo;t use the site.
        These terms cover the website only. They aren&rsquo;t the terms of any renovation or construction work.
      </p>
    ),
  },
  {
    id: "general-information",
    title: "General information only",
    content: (
      <p>
        The content on this site is general information about our company and services. The project photos show our
        past work. Every home and project is different, so results, costs and timelines will vary from project to
        project.
      </p>
    ),
  },
  {
    id: "pricing-not-binding",
    title: "Pricing, budgets and timelines",
    content: (
      <>
        <p>
          Any pricing, budget ranges or timelines mentioned on this site, or discussed through it, are estimates only
          and aren&rsquo;t binding.
        </p>
        <p>
          <strong>All work is governed by a separate written agreement or contract signed with each client.</strong>{" "}
          If anything on this website conflicts with your signed agreement, the agreement applies.
        </p>
      </>
    ),
  },
  {
    id: "inquiries",
    title: "Sending us an inquiry",
    content: (
      <p>
        Sending us a message or project details through this site doesn&rsquo;t create a contract between us, and
        doesn&rsquo;t guarantee that we&rsquo;re available to take on your project. We&rsquo;ll get back to you to talk
        about next steps. How we handle the information you send is explained in our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "Our content",
    content: (
      <p>
        All content on this website, including text, photos, the logo and other branding, belongs to {site.legalName}{" "}
        or is used with permission. Please don&rsquo;t copy, reuse or republish any of it without our written
        permission.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>When using this site, please don&rsquo;t:</p>
        <ul>
          <li>use it for anything unlawful, misleading or harmful</li>
          <li>send spam, or submit false or automated inquiries</li>
          <li>try to interfere with the site, its security or how it works</li>
        </ul>
      </>
    ),
  },
  {
    id: "third-party-links",
    title: "Links to other sites",
    content: (
      <p>
        This site links to other websites, such as our{" "}
        <a href={site.instagram.href} target="_blank" rel="noopener noreferrer">
          Instagram ({site.instagram.handle})
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        . We don&rsquo;t control those sites and aren&rsquo;t responsible for their content, policies or practices.
      </p>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer and limitation of liability",
    content: (
      <>
        <p>
          We work to keep this website accurate and available, but it&rsquo;s provided &ldquo;as is&rdquo; and
          &ldquo;as available,&rdquo; without warranties of any kind. We don&rsquo;t promise that the site will always
          be error-free, up to date or uninterrupted.
        </p>
        <p>
          To the extent permitted by law, {site.legalName} isn&rsquo;t liable for any loss or damage arising from your
          use of, or inability to use, this website or the information on it. Nothing in these terms limits any rights
          you have that can&rsquo;t be limited by law.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    content: (
      <p>
        These terms are governed by the laws of the Province of Ontario and the federal laws of Canada that apply
        there.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes and contact",
    content: (
      <>
        <p>
          We may update these terms from time to time. When we do, we&rsquo;ll change the &ldquo;Last updated&rdquo;
          date at the top of this page. Continuing to use the site means you accept the updated terms.
        </p>
        <p>
          Questions? Email <Email /> or call <a href={site.phoneHref}>{site.phone}</a>.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      lastUpdated={TERMS_LAST_UPDATED}
      intro={
        <p>
          These terms explain the rules for using the {site.name} website. They&rsquo;re written in plain language and
          apply to the website only. Your renovation or construction work is covered by a separate written agreement.
        </p>
      }
      sections={sections}
    />
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { PRIVACY_LAST_UPDATED } from "@/lib/legal";
import { site } from "@/lib/site";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects the personal information you share with us, in line with Canada's PIPEDA.`,
  path: "/privacy",
});

const cities = site.serviceCities.slice(0, -1).join(", ") + " & " + site.serviceCities.at(-1);
const Email = () => <a href={`mailto:${site.email}`}>{site.email}</a>;

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <>
        <p>
          {site.legalName} (&ldquo;{site.name},&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) is a renovation and
          construction company founded and operated by {site.founder}, serving {cities}.
        </p>
        <p>
          We&rsquo;re responsible for the personal information you share with us. If you have any questions about this
          policy or your information, email us at <Email /> or call <a href={site.phoneHref}>{site.phone}</a>.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    content: (
      <>
        <p>We only collect what you choose to send us through the contact form on this website:</p>
        <ul>
          <li>your name</li>
          <li>your email address and/or phone number</li>
          <li>your project type, budget range and timeline, if you tell us about a project</li>
          <li>any message you write to us</li>
        </ul>
        <p>
          <strong>We don&rsquo;t use tracking cookies, analytics tools or advertising pixels.</strong> We don&rsquo;t
          build profiles of visitors or follow you around the web.
        </p>
      </>
    ),
  },
  {
    id: "why-we-collect-it",
    title: "Why we collect it",
    content: (
      <>
        <p>We use your information only to:</p>
        <ul>
          <li>respond to your inquiry</li>
          <li>prepare estimates and quotes</li>
          <li>communicate with you about your project</li>
        </ul>
        <p>
          <strong>We never sell or rent your information, and we never share it with anyone for marketing.</strong>
        </p>
      </>
    ),
  },
  {
    id: "service-providers",
    title: "Who processes it for us",
    content: (
      <>
        <p>We use two trusted service providers to run this website:</p>
        <ul>
          <li>
            <strong>Vercel</strong> hosts the website. Like any web host, it processes basic technical information
            (such as your IP address and browser type) to deliver pages and keep the site secure.
          </li>
          <li>
            <strong>Resend</strong> delivers contact form submissions to our inbox by email.
          </li>
        </ul>
        <p>
          These providers may store or process information <strong>outside Canada, including in the United States</strong>
          . While it&rsquo;s there, it may be subject to the laws of that country, including laws that allow government
          authorities to access it. We only use providers that commit to protecting the information they handle.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    content: (
      <p>
        We keep inquiry information only for as long as we need it to respond to you and to keep reasonable business
        records. After that, we delete it.
      </p>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    content: (
      <p>
        We use reasonable safeguards to protect your information, including encrypted (HTTPS) connections to this
        website. That said, no method of sending or storing information over the internet is 100% secure, so we
        can&rsquo;t guarantee absolute security.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    content: (
      <>
        <p>You can ask us at any time to:</p>
        <ul>
          <li>tell you what personal information we hold about you and give you access to it</li>
          <li>correct information that&rsquo;s inaccurate or incomplete</li>
          <li>delete your information</li>
          <li>withdraw your consent to us using it (this may mean we can&rsquo;t continue helping with your project)</li>
        </ul>
        <p>
          Just email <Email />. We&rsquo;ll respond within 30 days.
        </p>
        <p>
          If you&rsquo;re not satisfied with how we&rsquo;ve handled your information, you have the right to complain to
          the{" "}
          <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer">
            Office of the Privacy Commissioner of Canada
            <span className="sr-only"> (opens in a new tab)</span>
          </a>{" "}
          (priv.gc.ca).
        </p>
      </>
    ),
  },
  {
    id: "browser-storage",
    title: "Cookies and browser storage",
    content: (
      <p>
        This site doesn&rsquo;t set tracking or advertising cookies. The only thing we store is a small preference in
        your browser&rsquo;s local storage that remembers you&rsquo;ve dismissed our cookie notice, so it doesn&rsquo;t
        keep appearing. It contains no personal information, and you can clear it at any time in your browser settings.
      </p>
    ),
  },
  {
    id: "third-party-links",
    title: "Links to other sites",
    content: (
      <p>
        Our website links to other sites, such as our{" "}
        <a href={site.instagram.href} target="_blank" rel="noopener noreferrer">
          Instagram ({site.instagram.handle})
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        . Those sites have their own privacy policies, and we&rsquo;re not responsible for how they handle your
        information.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this policy from time to time. When we do, we&rsquo;ll change the &ldquo;Last updated&rdquo; date
        at the top of this page. If you have questions about any changes, email us at <Email />.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      lastUpdated={PRIVACY_LAST_UPDATED}
      intro={
        <p>
          Your privacy matters to us. This policy explains, in plain language, what information we collect when you
          contact us, how we use it and the choices you have. It&rsquo;s written to align with Canada&rsquo;s{" "}
          <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA). See also our{" "}
          <Link href="/terms">Terms &amp; Conditions</Link>.
        </p>
      }
      sections={sections}
    />
  );
}

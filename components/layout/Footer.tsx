import Image from "next/image";
import Link from "next/link";
import logoLight from "@/public/images/logo-light.png";
import { nav, site } from "@/lib/site";
import { services } from "@/lib/services";
import { Container } from "@/components/ui/Container";
import { InstagramLink } from "@/components/InstagramLink";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark bg-ink text-paper">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Image src={logoLight} alt={site.legalName} sizes="240px" className="h-12 w-auto" />
          {/* Line from the old site footer */}
          <p className="mt-6 max-w-sm leading-relaxed text-muted-dark">Working hard to make your space beautiful.</p>
          <p className="mt-3 text-sm text-muted-dark">{site.serviceHighlights.join(" · ")}</p>
          <p className="mt-6 font-display text-lg text-paper">{site.founderLine}</p>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Company</h2>
          <ul className="mt-5 space-y-3">
            <li>
              <Link href="/" className="text-paper/85 hover:text-white">
                Home
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper/85 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Services</h2>
          <ul className="mt-5 space-y-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services#${s.slug}`} className="text-paper/85 hover:text-white">
                  {s.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Get in touch</h2>
          <ul className="mt-5 space-y-4">
            <li>
              <a href={site.phoneHref} className="flex items-start gap-3 text-paper/85 hover:text-white">
                <PhoneIcon className="mt-1 shrink-0 text-accent-light" />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-start gap-3 break-all text-paper/85 hover:text-white">
                <MailIcon className="mt-1 shrink-0 text-accent-light" />
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-3 text-paper/85">
              <PinIcon className="mt-1 shrink-0 text-accent-light" />
              <span>{site.serviceAreaLine}</span>
            </li>
            <li>
              <InstagramLink
                showHandle
                className="items-start text-paper/85 hover:text-white"
                iconClassName="mt-1 shrink-0 text-accent-light"
              />
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-sm text-muted-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName} All rights reserved.
          </p>
          <p>{site.tagline}</p>
        </Container>
      </div>
    </footer>
  );
}

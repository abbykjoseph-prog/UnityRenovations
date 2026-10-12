import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { heroPhotos } from "@/lib/photos";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { Suspense } from "react";
import { InquiryStepper } from "@/components/contact/InquiryStepper";
import { Container } from "@/components/ui/Container";
import { ClockIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description: `Get in touch with ${site.name} or tell us about your project for a free estimate. Call ${site.phone}. ${site.serviceAreaLine}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s talk about your project"
        intro="A few quick questions and we’ll be in touch within 1 business day. Estimates are always free."
        image={heroPhotos.kitchenNavyIsland.src}
      />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {/* useSearchParams (for ?path=project) needs a Suspense boundary on a static page */}
            <Suspense
              fallback={
                <div className="rounded-sm bg-paper-100 p-6 ring-1 ring-ink/10 sm:p-10">
                  <p className="text-3xl font-medium sm:text-4xl">How can we help?</p>
                  <p className="mt-4 text-muted">
                    Loading… You can also call us at{" "}
                    <a href={site.phoneHref} className="font-semibold text-ink underline">
                      {site.phone}
                    </a>
                    .
                  </p>
                </div>
              }
            >
              <InquiryStepper />
            </Suspense>
          </div>

          <aside aria-labelledby="contact-details-heading" className="lg:col-span-5">
            <div className="on-dark rounded-sm bg-ink p-8 text-paper sm:p-10 lg:sticky lg:top-28">
              <h2 id="contact-details-heading" className="text-2xl font-medium">
                Prefer to talk?
              </h2>
              <p className="mt-2 text-muted-dark">Call or email us directly. {site.founderLine}.</p>

              <ul className="mt-8 space-y-6">
                <li className="flex gap-4">
                  <PhoneIcon className="mt-1 shrink-0 text-xl text-accent-light" />
                  <div>
                    <p className="text-sm text-muted-dark">Phone ({site.founder})</p>
                    <a href={site.phoneHref} className="text-lg font-semibold hover:underline">
                      {site.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <MailIcon className="mt-1 shrink-0 text-xl text-accent-light" />
                  <div className="min-w-0">
                    <p className="text-sm text-muted-dark">Email</p>
                    <a href={`mailto:${site.email}`} className="break-all text-lg font-semibold hover:underline">
                      {site.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <PinIcon className="mt-1 shrink-0 text-xl text-accent-light" />
                  <div>
                    <p className="text-sm text-muted-dark">Service area</p>
                    <p className="text-lg font-semibold">{site.serviceAreaLine}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <InstagramIcon className="mt-1 shrink-0 text-xl text-accent-light" />
                  <div>
                    <p className="text-sm text-muted-dark">Instagram</p>
                    <a
                      href={site.instagram.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold hover:underline"
                    >
                      {site.instagram.handle}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <ClockIcon className="mt-1 shrink-0 text-xl text-accent-light" />
                  <div>
                    <p className="text-sm text-muted-dark">Hours</p>
                    <dl className="mt-1 space-y-1">
                      {site.hours.map((h) => (
                        <div key={h.days} className="flex flex-wrap gap-x-3">
                          <dt className="font-semibold">{h.days}</dt>
                          <dd className="text-paper/85">{h.time}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              </ul>

              <p className="mt-8 border-t border-white/10 pt-6 text-sm text-muted-dark">
                {site.serviceHighlights.join(" · ")}
              </p>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}

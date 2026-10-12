import type { Metadata } from "next";
import { heroPhotos } from "@/lib/photos";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/contact/QuoteForm";
import { Container } from "@/components/ui/Container";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Contact Us for a Free Quote",
  description: `Request a free renovation or construction estimate from ${site.name}. Call ${site.phone} or send us the details of your project. Serving the ${site.serviceArea}.`,
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: `Contact | ${site.name}` },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s talk about your project"
        intro="Tell us what you have in mind and we’ll get back to you to arrange a consultation. Estimates are always free."
        image={heroPhotos.kitchenNavyIsland.src}
      />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">Request a free quote</h2>
            <div className="mt-8">
              <QuoteForm />
            </div>
          </div>

          <aside aria-labelledby="contact-details-heading" className="lg:col-span-5">
            <div className="on-dark rounded-sm bg-ink p-8 text-paper sm:p-10 lg:sticky lg:top-28">
              <h2 id="contact-details-heading" className="text-2xl font-medium">
                Prefer to talk?
              </h2>
              <p className="mt-2 text-muted-dark">Call or email us directly.</p>

              <ul className="mt-8 space-y-6">
                {site.contacts.map((c) => (
                  <li key={c.name} className="flex gap-4">
                    <PhoneIcon className="mt-1 shrink-0 text-xl text-accent-light" />
                    <div>
                      <p className="text-sm text-muted-dark">{c.name}</p>
                      <a href={c.phoneHref} className="text-lg font-semibold hover:underline">
                        {c.phone}
                      </a>
                    </div>
                  </li>
                ))}
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
                    <p className="text-lg font-semibold">{site.serviceArea}</p>
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

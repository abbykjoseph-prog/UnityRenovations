import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/services";
import { heroPhotos } from "@/lib/photos";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { ServiceSection } from "@/components/services/ServiceSection";
import { ProcessSteps } from "@/components/ProcessSteps";
import { CtaBand } from "@/components/CtaBand";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CalendarIcon, LedgerIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Renovation & Construction Services",
  description: `Basement finishing, kitchen and bathroom remodels, whole-home renovations, additions, rebuilds and custom homes built from the foundation up, across the ${site.serviceArea}.`,
  alternates: { canonical: "/services" },
  openGraph: { url: "/services", title: `Services | ${site.name}` },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Every scale of project, one standard of quality"
        intro="From finishing a basement to building a custom home from the foundation up, every project gets the same care: quality materials, a schedule we keep and a budget we respect."
        image={heroPhotos.interiorFraming.src}
      >
        <nav aria-label="Services on this page" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`#${s.slug}`}
                  className="inline-block rounded-full border border-white/30 px-4 py-2 text-sm text-white/90 transition-colors hover:border-white hover:bg-white hover:text-ink"
                >
                  {s.shortTitle}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="#process"
                className="inline-block rounded-full border border-accent-light/60 px-4 py-2 text-sm text-accent-light transition-colors hover:bg-accent-light hover:text-ink"
              >
                Our process
              </Link>
            </li>
          </ul>
        </nav>
      </PageHero>

      {services.map((service, i) => (
        <ServiceSection key={service.slug} service={service} index={i} />
      ))}

      <section id="process" aria-labelledby="process-heading" className="border-t border-ink/10 py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Our process"
              title={<span id="process-heading">Transparent pricing. Fixed timelines.</span>}
              intro="Renovations go wrong when expectations are vague. Our process is built so you know what you’re paying, when the work will be done and what’s happening at every step."
            />
          </Reveal>
          <ProcessSteps />

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <Reveal className="rounded-sm bg-ink p-8 text-paper sm:p-10">
              <LedgerIcon className="text-3xl text-accent-light" />
              <h3 className="mt-5 text-2xl font-medium">Transparent pricing</h3>
              <p className="mt-3 leading-relaxed text-muted-dark">
                Your quote is detailed and itemized, so you can see exactly where your money goes. Your budget is
                respected and maintained from start to finish, with no surprise costs at the end.
              </p>
            </Reveal>
            <Reveal delay={100} className="rounded-sm bg-ink p-8 text-paper sm:p-10">
              <CalendarIcon className="text-3xl text-accent-light" />
              <h3 className="mt-5 text-2xl font-medium">Fixed timelines</h3>
              <p className="mt-3 leading-relaxed text-muted-dark">
                You get a realistic schedule before work begins, and we deliver on it. Materials are planned and
                ordered ahead so your project isn&rsquo;t left waiting, and you&rsquo;re kept up to date along the way.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaBand title="Let’s plan your project" />
    </>
  );
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Image from "next/image";
import { heroPhotos } from "@/lib/photos";
import { promises } from "@/lib/content";
import { site } from "@/lib/site";
import subfloor from "@/public/images/projects/subfloor-glued-and-screwed.jpg";
import floorProtection from "@/public/images/projects/dust-floor-protection-staircase.jpg";
import wainscotingDetail from "@/public/images/projects/wainscoting-light-switch-detail.jpg";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description: `${site.legalName} is a renovation and construction company founded in ${site.foundedYear} and operated by ${site.founder}. ${site.serviceAreaLine}.`,
  path: "/about",
});

const facts = [
  { label: "Founded", value: String(site.foundedYear) },
  { label: "Service area", value: site.serviceAreaLine },
  { label: "Estimates", value: "Free" },
  { label: "In business", value: site.yearsInBusiness },
  { label: "Licensing & insurance", value: site.licensing },
];

const details = [
  { src: subfloor, caption: "Subfloor glued and screwed for strength and squeak prevention" },
  { src: floorProtection, caption: "Dust and floor protection in place before work begins" },
  { src: wainscotingDetail, caption: "Wainscoting detail fitted around a light switch" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Built on quality. Run on respect."
        intro={`${site.legalName} handles construction, renovation and remodelling across Toronto, Mississauga, Brampton and Hamilton, from small functional changes to homes built from the foundation up.`}
        image={heroPhotos.loftTimberBeamsSkylights.src}
      />

      <section aria-labelledby="story-heading" className="py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <SectionHeading eyebrow="Our story" title={<span id="story-heading">A different approach to renovating</span>} />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
              <p>
                Unity Renovations was founded in {site.foundedYear} and is run by its founder, {site.founder}. Our company
                takes a different approach to rebuilding, remodelling and reconstruction. Whether it&rsquo;s a
                small functional change or a dramatic cosmetic transformation, complete transparency through every stage
                of the work is essential to us.
              </p>
              <p>
                Keeping clients informed and comfortable creates a healthy working relationship, one where you can share
                your opinions and concerns at any moment, so we reach the right outcome together.
              </p>
              <p className="rounded-sm border border-dashed border-accent/60 bg-paper-100 p-4 text-base text-ink">
                [ADD: optional, a few lines on why Nick started Unity Renovations and any notable projects or
                milestones]
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <dl className="divide-y divide-ink/10 border-y border-ink/10">
              {facts.map((f) => (
                <div key={f.label} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{f.label}</dt>
                  <dd className="font-display text-xl sm:text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="on-dark mt-8 rounded-sm bg-ink p-6 text-paper">
              <p className="font-display text-2xl">{site.founderLine}</p>
              <p className="mt-2 text-muted-dark">
                Call Nick directly at{" "}
                <a href={site.phoneHref} className="font-semibold text-white underline underline-offset-4">
                  {site.phone}
                </a>
                .
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="values-heading" className="on-dark bg-ink py-20 text-paper sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              tone="dark"
              eyebrow="Our values"
              title={<span id="values-heading">What every client can count on</span>}
            />
          </Reveal>
          <ol className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {promises.map((p, i) => (
              <Reveal as="li" key={p.key} delay={(i % 3) * 90} className="border-t border-white/15 pt-6">
                <p className="font-display text-sm text-accent-light">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-2xl font-medium">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-dark">{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="quality-heading" className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Commitment to quality"
              title={<span id="quality-heading">Quality you can see, and quality you can&rsquo;t</span>}
              intro="The finish is what everyone notices. What makes it last is the work underneath: proper structure, careful preparation and a protected home. We never sacrifice quality for the bottom line or a time crunch."
            />
          </Reveal>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {details.map((d, i) => (
              <Reveal as="li" key={d.caption} delay={i * 90}>
                <figure>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                    <Image
                      src={d.src}
                      alt={d.caption}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm leading-relaxed text-muted">{d.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}

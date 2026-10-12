import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import { promises, type PromiseKey } from "@/lib/content";
import { heroPhotos } from "@/lib/photos";
import { site } from "@/lib/site";
import { YearsInBusiness } from "@/components/YearsInBusiness";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CalendarIcon, ChatIcon, HomeIcon, LayersIcon, LedgerIcon, LevelIcon } from "@/components/ui/Icons";

const icons: Record<PromiseKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  quality: LevelIcon,
  materials: LayersIcon,
  time: CalendarIcon,
  budget: LedgerIcon,
  respect: HomeIcon,
  communication: ChatIcon,
};

export function WhyUnity() {
  return (
    <section aria-labelledby="why-heading" className="on-dark relative overflow-hidden bg-ink py-20 text-paper sm:py-28">
      <div className="absolute inset-y-0 right-0 hidden w-[38%] lg:block" aria-hidden="true">
        <Image src={heroPhotos.cedarSecondStoreyAddition.src} alt="" fill sizes="38vw" className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-ink/10" />
      </div>
      <Container className="relative">
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="Why Unity"
            title={<span id="why-heading">Our promise on every project</span>}
            intro="Quality is never traded for the bottom line or a deadline. Here’s what you can count on, whether we’re finishing a basement or building a home from the ground up."
          />
        </Reveal>
        <Reveal>
          <dl className="mt-12 grid max-w-3xl gap-8 border-y border-white/15 py-8 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-dark">Founded</dt>
              <dd className="mt-2 font-display text-4xl">{site.foundedYear}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-dark">Years in business</dt>
              <dd className="mt-2 font-display text-4xl">
                <YearsInBusiness />+
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-dark">Serving</dt>
              <dd className="mt-2 text-lg leading-snug">{site.serviceCities.join(" · ")}</dd>
            </div>
          </dl>
        </Reveal>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-sm bg-white/10 sm:grid-cols-2 lg:mr-[22%] lg:grid-cols-3">
          {promises.map((p, i) => {
            const Icon = icons[p.key];
            return (
              <Reveal as="li" key={p.key} delay={(i % 3) * 90} className="bg-ink/95 p-7 sm:p-8">
                <Icon className="text-3xl text-accent-light" />
                <h3 className="mt-5 text-xl font-medium">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-dark">{p.body}</p>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

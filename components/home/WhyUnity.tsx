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
    <section aria-labelledby="why-heading" className="on-dark bg-ink py-20 text-paper sm:py-28">
      {/* Heading, stats and feature grid share one container, so everything starts at the same left edge */}
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
          <Reveal className="lg:col-span-7">
            <SectionHeading
              tone="dark"
              eyebrow="Why Unity"
              title={<span id="why-heading">Our promise on every project</span>}
              intro="Quality is never traded for the bottom line or a deadline. Here’s what you can count on, whether we’re finishing a basement or building a home from the ground up."
            />
            <dl className="mt-10 grid gap-8 border-y border-white/15 py-8 sm:grid-cols-3">
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
          <Reveal delay={120} className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src={heroPhotos.cedarSecondStoreyAddition.src}
                alt={heroPhotos.cedarSecondStoreyAddition.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-x-12 gap-y-12 text-left sm:grid-cols-2 lg:grid-cols-3">
          {promises.map((p, i) => {
            const Icon = icons[p.key];
            return (
              <Reveal as="li" key={p.key} delay={(i % 3) * 90} className="border-t border-white/15 pt-8">
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

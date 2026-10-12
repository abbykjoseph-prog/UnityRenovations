import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { WhyUnity } from "@/components/home/WhyUnity";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Testimonials } from "@/components/home/Testimonials";
import { ProcessSteps } from "@/components/ProcessSteps";
import { CtaBand } from "@/components/CtaBand";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} | Renovations & Custom Builds in the ${site.serviceArea}`,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <WhyUnity />
      <ServicesPreview />
      <FeaturedProjects />
      <section aria-labelledby="process-heading" className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How we work"
              title={<span id="process-heading">A clear process, start to finish</span>}
              intro="Transparent pricing, a fixed timeline and regular updates, so you always know where your project stands."
            />
          </Reveal>
          <ProcessSteps />
          <ButtonLink href="/services#process" variant="outline" className="mt-12">
            More about our process <ArrowRightIcon />
          </ButtonLink>
        </Container>
      </section>
      <Testimonials />
      <CtaBand />
    </>
  );
}

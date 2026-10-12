import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { heroPhotos, projectPhotos } from "@/lib/photos";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { Gallery } from "@/components/projects/Gallery";
import { CtaBand } from "@/components/CtaBand";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description: `Photos of kitchens, bathrooms, additions, finish carpentry, exterior and commercial work by ${site.name}. ${site.serviceAreaLine}.`,
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Our work, start to finish"
        intro="Finished spaces, plus the work behind them: protected floors, structural changes and the finish carpentry that makes the difference. Select any photo to view it larger."
        image={heroPhotos.rearDeckGlassRailing.src}
      />
      <section aria-label="Project gallery" className="py-16 sm:py-24">
        <Container>
          <Gallery photos={projectPhotos} />
        </Container>
      </section>
      <CtaBand title="Have a project like these in mind?" />
    </>
  );
}

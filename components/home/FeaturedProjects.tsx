import Image from "next/image";
import { heroPhotos, type Photo } from "@/lib/photos";
import kitchenIslandAfter from "@/public/images/projects/kitchen-island-after.jpg";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";

const tiles: { photo: Pick<Photo, "src" | "alt">; className: string; sizes: string }[] = [
  {
    photo: heroPhotos.rearDeckGlassRailing,
    className: "col-span-2 row-span-2 aspect-square sm:aspect-auto",
    sizes: "(min-width: 1024px) 50vw, 100vw",
  },
  { photo: heroPhotos.loftTimberBeamsSkylights, className: "aspect-square", sizes: "(min-width: 1024px) 25vw, 50vw" },
  {
    photo: { src: kitchenIslandAfter, alt: "Finished kitchen with a white quartz island and pendant lights" },
    className: "aspect-square",
    sizes: "(min-width: 1024px) 25vw, 50vw",
  },
  { photo: heroPhotos.cedarGableCanopy, className: "col-span-2 aspect-[2/1]", sizes: "(min-width: 1024px) 50vw, 100vw" },
];

export function FeaturedProjects() {
  return (
    <section aria-labelledby="projects-heading" className="bg-paper-200 py-20 sm:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="Recent work"
              title={<span id="projects-heading">Craftsmanship you can see</span>}
              intro="A look at finished spaces and work in progress from our recent projects."
            />
          </Reveal>
          <ButtonLink href="/projects" variant="outline" className="self-start lg:self-auto">
            View all projects <ArrowRightIcon />
          </ButtonLink>
        </div>
        <Reveal className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {tiles.map(({ photo, className, sizes }) => (
            <div key={photo.src.src} className={`relative overflow-hidden rounded-sm ${className}`}>
              <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes={sizes} className="object-cover" />
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

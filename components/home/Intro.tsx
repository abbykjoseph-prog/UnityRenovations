import Image from "next/image";
import { heroPhotos } from "@/lib/photos";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { YearsInBusiness } from "@/components/YearsInBusiness";
import { site } from "@/lib/site";

export function Intro() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <SectionHeading
            eyebrow="Unity Renovations"
            title="It all starts with you."
            intro={
              <>
                <p>
                  Share your ideas with us during the meeting and planning phase, and we&rsquo;ll turn them into a space
                  you&rsquo;re proud of. Large or small, your project is important and deserves to be done with care
                  and quality, on time and on budget.
                </p>
                <p className="mt-4">
                  Whether it&rsquo;s a small functional change or a dramatic transformation, complete transparency is
                  how we work. You&rsquo;re kept informed and comfortable throughout, and you can raise a question or
                  concern at any point. That&rsquo;s how we reach the right result.
                </p>
              </>
            }
          />
          <p className="mt-8 border-l-2 border-accent pl-4 font-display text-xl text-ink">
            Founded in {site.foundedYear} — <YearsInBusiness />+ years of building it right.
          </p>
          <ButtonLink href="/about" variant="outline" className="mt-9">
            About our approach <ArrowRightIcon />
          </ButtonLink>
        </Reveal>

        <Reveal className="relative lg:col-span-6" delay={120}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src={heroPhotos.cofferedCeiling.src}
              alt={heroPhotos.cofferedCeiling.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-10 -left-4 hidden w-2/5 overflow-hidden rounded-sm border-[6px] border-paper shadow-xl sm:block lg:-left-10">
            <div className="relative aspect-[4/3]">
              <Image
                src={heroPhotos.finishedLivingSpace.src}
                alt={heroPhotos.finishedLivingSpace.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 18vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

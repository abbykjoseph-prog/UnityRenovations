import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/services";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function ServicesPreview() {
  const featured = services.find((s) => s.slug === "custom-homes")!;
  const rest = services.filter((s) => s !== featured);

  return (
    <section aria-labelledby="services-heading" className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="What we do"
              title={<span id="services-heading">From basements to the foundation up</span>}
              intro="One team for every scale of project, held to the same standard."
            />
          </Reveal>
          <ButtonLink href="/services" variant="outline" className="self-start lg:self-auto">
            All services <ArrowRightIcon />
          </ButtonLink>
        </div>

        <Reveal className="mt-12">
          <Link
            href={`/services#${featured.slug}`}
            className="group grid overflow-hidden rounded-sm bg-ink text-paper md:grid-cols-2"
          >
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px]">
              <Image
                src={featured.image.src}
                alt={featured.image.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-light">Our full scope</p>
              <h3 className="mt-4 text-3xl font-medium sm:text-4xl">{featured.title}</h3>
              <p className="mt-4 text-lg leading-relaxed text-muted-dark">{featured.summary}</p>
              <span className="mt-8 inline-flex items-center gap-2 font-semibold text-accent-light">
                Learn more <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </Reveal>

        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 3) * 90}>
              <Link href={`/services#${s.slug}`} className="group block h-full overflow-hidden rounded-sm bg-paper-100 ring-1 ring-ink/5">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={s.image.src}
                    alt={s.image.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="flex items-center justify-between gap-4 text-xl font-medium">
                    {s.shortTitle}
                    <ArrowRightIcon className="shrink-0 text-accent-dark transition-transform group-hover:translate-x-1" />
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">{s.summary}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

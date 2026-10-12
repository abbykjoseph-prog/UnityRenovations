import Image from "next/image";
import type { Service } from "@/lib/services";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/Icons";

export function ServiceSection({ service, index }: { service: Service; index: number }) {
  const flip = index % 2 === 1;
  const headingId = `${service.slug}-heading`;

  return (
    <section
      id={service.slug}
      aria-labelledby={headingId}
      className={`py-16 sm:py-24 ${flip ? "bg-paper-200" : ""}`}
    >
      <Container className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className={`lg:sticky lg:top-28 ${flip ? "lg:order-2" : ""}`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src={service.image.src}
              alt={service.image.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="font-display text-sm font-medium text-accent-dark">{String(index + 1).padStart(2, "0")}</p>
          <h2 id={headingId} className="mt-2 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            {service.title}
          </h2>
          <p className="mt-4 text-xl leading-relaxed text-ink/90">{service.summary}</p>
          {service.description.map((para) => (
            <p key={para.slice(0, 24)} className="mt-4 leading-relaxed text-muted">
              {para}
            </p>
          ))}

          <h3 className="mt-8 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ink">What&rsquo;s included</h3>
          <ul className="mt-4 grid gap-3">
            {service.includes.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed">
                <CheckIcon className="mt-1 shrink-0 text-lg text-accent-dark" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <ButtonLink href={`/contact?service=${service.slug}`} className="mt-9">
            Get a quote for {service.shortTitle.toLowerCase()} <ArrowRightIcon />
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}

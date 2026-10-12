import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type Props = {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  image: StaticImageData;
  children?: ReactNode;
};

/** Dark banner used at the top of every inner page. */
export function PageHero({ eyebrow, title, intro, image, children }: Props) {
  return (
    <section className="on-dark relative overflow-hidden bg-ink text-white">
      <Image
        src={image}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover opacity-60"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/75 to-ink/25" aria-hidden="true" />
      <Container className="relative py-20 sm:py-28 lg:py-32">
        <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-light">
          <span aria-hidden="true" className="h-px w-8 bg-accent-light" />
          {eyebrow}
        </p>
        <h1 className="max-w-3xl text-[2.5rem] font-medium leading-[1.05] tracking-tight sm:text-6xl">{title}</h1>
        {intro && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">{intro}</div>}
        {children}
      </Container>
    </section>
  );
}

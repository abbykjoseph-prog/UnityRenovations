import Image from "next/image";
import { heroPhotos } from "@/lib/photos";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/Icons";

type Props = { title?: string; body?: string };

export function CtaBand({
  title = "Ready to talk about your project?",
  body = "Tell us what you have in mind. Estimates are free, and you’ll get a clear, detailed quote with no surprises.",
}: Props) {
  return (
    <section className="on-dark relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <Image
        src={heroPhotos.finishedLivingSpace.src}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-30"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/50" aria-hidden="true" />
      <Container className="relative">
        <Reveal className="max-w-2xl">
          <h2 className="text-4xl font-medium leading-tight tracking-tight sm:text-5xl">{title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-white/85">{body}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <ButtonLink href="/contact" size="lg">
              Get a Free Quote
            </ButtonLink>
            <a href={site.phoneHref} className="inline-flex items-center gap-2 px-1 py-2 text-lg font-semibold hover:underline">
              <PhoneIcon className="text-accent-light" /> {site.phone}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

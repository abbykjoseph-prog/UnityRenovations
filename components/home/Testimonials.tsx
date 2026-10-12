import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Renders nothing until real testimonials are added to lib/site.ts. */
export function Testimonials() {
  const items = site.testimonials;
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="testimonials-heading" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Client stories"
            title={<span id="testimonials-heading">In our clients&rsquo; words</span>}
          />
        </Reveal>
        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal as="li" key={`${t.name}-${i}`} delay={(i % 3) * 90}>
              <figure className="flex h-full flex-col rounded-sm bg-paper-100 p-8 ring-1 ring-ink/5">
                <span aria-hidden="true" className="font-display text-5xl leading-none text-accent">
                  &ldquo;
                </span>
                <blockquote className="mt-2 flex-1 text-lg leading-relaxed">{t.quote}</blockquote>
                <figcaption className="mt-6 border-t border-ink/10 pt-4 text-sm">
                  <span className="font-semibold">{t.name}</span>
                  {(t.location || t.project) && (
                    <span className="text-muted"> · {[t.project, t.location].filter(Boolean).join(", ")}</span>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

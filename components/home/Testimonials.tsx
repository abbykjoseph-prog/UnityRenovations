import { formatAttribution, testimonials } from "@/lib/testimonials";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Masonry layout (CSS columns) so short and long quotes sit together without gaps.
 * Renders nothing at all until real testimonials are added to lib/testimonials.ts.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

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
        <ul className="mt-14 gap-6 sm:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <li key={`${t.firstName}-${t.lastInitial}-${i}`} className="mb-6 break-inside-avoid">
              <Reveal delay={(i % 3) * 90}>
                <figure className="rounded-sm bg-paper-100 p-8 ring-1 ring-ink/5">
                  <span aria-hidden="true" className="block font-display text-5xl leading-none text-accent">
                    &ldquo;
                  </span>
                  <blockquote className="mt-2 whitespace-pre-line break-words text-lg leading-relaxed">{t.quote}</blockquote>
                  <figcaption className="mt-6 border-t border-ink/10 pt-4 text-sm font-semibold">
                    {formatAttribution(t)}
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

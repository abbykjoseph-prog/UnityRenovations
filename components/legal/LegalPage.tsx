import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export type LegalSection = { id: string; title: string; content: ReactNode };

type Props = {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: ReactNode;
  sections: LegalSection[];
};

/** Readable long-form layout shared by the Privacy Policy and Terms pages. */
export function LegalPage({ eyebrow, title, lastUpdated, intro, sections }: Props) {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <header className="max-w-[68ch]">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            {eyebrow}
          </p>
          <h1 className="text-4xl font-medium leading-tight tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-muted">
            Last updated: <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
          </p>
          <div className="legal-prose mt-8">{intro}</div>
        </header>

        <nav aria-labelledby="toc-heading" className="mt-10 max-w-[68ch] rounded-sm bg-paper-200 p-6 sm:p-8">
          <h2 id="toc-heading" className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ink">
            On this page
          </h2>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-x-8">
            {sections.map((s, i) => (
              <li key={s.id} className="flex gap-3">
                <span className="w-5 shrink-0 text-right tabular-nums text-muted">{i + 1}.</span>
                <a href={`#${s.id}`} className="text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-accent">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-14 max-w-[68ch] space-y-12">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-heading`} className="scroll-mt-28">
              <h2 id={`${s.id}-heading`} className="text-2xl font-medium tracking-tight sm:text-3xl">
                <span className="mr-2 text-accent-dark">{i + 1}.</span>
                {s.title}
              </h2>
              <div className="legal-prose mt-4">{s.content}</div>
            </section>
          ))}
        </div>
      </Container>
    </article>
  );
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}

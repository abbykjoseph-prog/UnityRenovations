import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark">404</p>
        <h1 className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">We couldn&rsquo;t find that page</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          It may have moved when we rebuilt our website. Try one of these instead, or call us at{" "}
          <a href={site.phoneHref} className="font-semibold text-ink underline underline-offset-4">
            {site.phone}
          </a>
          .
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/projects" variant="outline">
            See our projects
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

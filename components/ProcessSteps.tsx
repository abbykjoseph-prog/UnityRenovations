import { processSteps } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function ProcessSteps() {
  return (
    <ol className="mt-14 grid gap-0 lg:grid-cols-5 lg:gap-6">
      {processSteps.map((step, i) => (
        <Reveal
          as="li"
          key={step.title}
          delay={i * 90}
          className="relative border-l border-ink/15 pb-10 pl-8 last:pb-0 lg:border-l-0 lg:border-t lg:pb-0 lg:pl-0 lg:pt-8"
        >
          <span
            aria-hidden="true"
            className="absolute -left-[7px] top-1 h-3.5 w-3.5 rotate-45 border-2 border-accent bg-paper lg:-top-[7px] lg:left-0"
          />
          <p className="font-display text-sm font-medium text-accent-dark">Step {String(i + 1).padStart(2, "0")}</p>
          <h3 className="mt-2 text-2xl font-medium">{step.title}</h3>
          <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}

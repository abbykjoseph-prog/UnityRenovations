import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({ eyebrow, title, intro, align = "left", tone = "light", as: Tag = "h2", className = "" }: Props) {
  const dark = tone === "dark";
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && (
        <p
          className={`mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] ${
            align === "center" ? "justify-center" : ""
          } ${dark ? "text-accent-light" : "text-accent-dark"}`}
        >
          <span aria-hidden="true" className={`h-px w-8 ${dark ? "bg-accent-light" : "bg-accent"}`} />
          {eyebrow}
        </p>
      )}
      <Tag
        className={`text-[2rem] font-medium leading-[1.1] tracking-tight sm:text-5xl ${dark ? "text-paper" : "text-ink"}`}
      >
        {title}
      </Tag>
      {intro && (
        <div className={`mt-5 text-lg leading-relaxed text-pretty ${dark ? "text-muted-dark" : "text-muted"}`}>{intro}</div>
      )}
    </div>
  );
}

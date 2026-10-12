import type { ReactNode } from "react";

/** One shared max-width and horizontal padding, so every section (and the header) has the same left edge. */
export const containerClasses = "mx-auto w-full max-w-site px-5 sm:px-8 lg:px-12 xl:px-16";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${containerClasses} ${className}`}>{children}</div>;
}

"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { nav, site } from "@/lib/site";
import { MailIcon, PhoneIcon } from "@/components/ui/Icons";
import { InstagramLink } from "@/components/InstagramLink";
import { QUOTE_HREF } from "@/lib/inquiry";

type Props = { open: boolean; onClose: () => void; pathname: string };

export function MobileMenu({ open, onClose, pathname }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const opener = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button") ?? []).filter((el) => !el.hasAttribute("disabled"));

    focusables()[0]?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      // Keep Tab focus inside the menu and the header's toggle button
      if (e.key === "Tab") {
        const items = [...focusables(), document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]')].filter(
          Boolean,
        ) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      hidden={!open}
      className="on-dark fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-ink text-paper lg:hidden"
    >
      <nav aria-label="Mobile" className="px-5 pb-10 pt-6 sm:px-8">
        <ul className="divide-y divide-white/10 border-b border-white/10">
          <li>
            <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className="block py-4 font-display text-3xl">
              Home
            </Link>
          </li>
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                className="block py-4 font-display text-3xl aria-[current=page]:text-accent-light"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 space-y-4 text-lg">
          <a href={site.phoneHref} className="flex items-center gap-3">
            <PhoneIcon className="text-accent-light" /> {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="flex items-center gap-3 break-all">
            <MailIcon className="shrink-0 text-accent-light" /> {site.email}
          </a>
          <InstagramLink showHandle iconClassName="shrink-0 text-accent-light" />
        </div>
        <Link
          href={QUOTE_HREF}
          className="mt-10 flex w-full items-center justify-center rounded-sm bg-accent px-6 py-4 font-semibold text-white"
        >
          Get a Free Quote
        </Link>
      </nav>
    </div>
  );
}

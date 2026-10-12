"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import logo from "@/public/images/logo.png";
import logoLight from "@/public/images/logo-light.png";
import { nav, site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { MenuIcon, CloseIcon, PhoneIcon } from "@/components/ui/Icons";
import { MobileMenu } from "./MobileMenu";
import { InstagramLink } from "@/components/InstagramLink";

export function Header() {
  const pathname = usePathname();
  const overlay = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const transparent = overlay && !scrolled && !menuOpen;

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,color] duration-300 ${
        transparent
          ? "on-dark bg-gradient-to-b from-ink/60 to-transparent text-white"
          : menuOpen
            ? // No backdrop-filter here: it would become the containing block for the fixed menu panel
              "on-dark bg-ink text-white"
            : "bg-paper/95 text-ink shadow-[0_1px_0_rgba(20,22,27,0.08)] backdrop-blur supports-[backdrop-filter]:bg-paper/85"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-site items-center gap-3 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="mr-auto shrink-0" aria-label={`${site.name} home`}>
          <Image
            src={transparent || menuOpen ? logoLight : logo}
            alt={site.legalName}
            priority
            sizes="180px"
            className="h-8 w-auto sm:h-9 lg:h-11"
          />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative px-3 py-2 text-[0.95rem] font-medium transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-current after:transition-transform ${
                      active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <InstagramLink
          className="hidden h-10 w-10 justify-center rounded-full text-xl transition-opacity hover:opacity-70 lg:ml-2 lg:inline-flex"
        />

        <a
          href={site.phoneHref}
          className="hidden items-center gap-2 px-3 text-[0.95rem] font-semibold lg:inline-flex"
        >
          <PhoneIcon className="text-lg" />
          {site.phone}
        </a>

        {/* Mobile: click-to-call */}
        <a
          href={site.phoneHref}
          aria-label={`Call ${site.name} at ${site.phone}`}
          className={`grid h-10 w-10 place-items-center rounded-full border text-lg lg:hidden ${
            transparent || menuOpen ? "border-white/50" : "border-ink/20"
          }`}
        >
          <PhoneIcon />
        </a>

        <ButtonLink href="/contact" size="md" className="!px-3.5 !py-2.5 sm:!px-5 sm:!py-3">
          Get a Quote
        </ButtonLink>

        <button
          type="button"
          className="-mr-2 grid h-10 w-10 place-items-center text-2xl lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </header>
  );
}

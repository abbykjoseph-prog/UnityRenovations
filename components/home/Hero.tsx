"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { heroPhotos, type Photo } from "@/lib/photos";
import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { containerClasses } from "@/components/ui/Container";
import { PauseIcon, PlayIcon } from "@/components/ui/Icons";
import { QUOTE_HREF } from "@/lib/inquiry";

const slides: Photo[] = [
  heroPhotos.livingRoomPanelMoulding,
  heroPhotos.kitchenNavyIsland,
  heroPhotos.rearDeckGlassRailing,
  heroPhotos.loftTimberBeamsSkylights,
  heroPhotos.cedarGableCanopy,
];

const INTERVAL = 7000;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  // Only the first photo loads up front; the rest mount once it has painted.
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  const go = useCallback((next: number) => {
    setIndex((current) => {
      if (current === next) return current;
      setPrev(current);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!ready || !playing) return;
    const id = window.setInterval(() => go((index + 1) % slides.length), INTERVAL);
    return () => window.clearInterval(id);
  }, [ready, playing, index, go]);

  return (
    <section aria-labelledby="hero-heading" className="on-dark relative -mt-16 overflow-hidden bg-ink text-white lg:-mt-20">
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((photo, i) => {
          if (i > 0 && !ready) return null;
          const active = i === index;
          const animating = active || i === prev;
          return (
            <div
              key={photo.src.src}
              className={`absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${active ? "opacity-100" : "opacity-0"}`}
            >
              <div className={`absolute inset-0 ${animating && playing ? "animate-kenburns" : ""}`}>
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  priority={i === 0}
                  placeholder={i === 0 ? "blur" : "empty"}
                  sizes="100vw"
                  quality={72}
                  className="object-cover"
                  onLoad={i === 0 ? () => window.setTimeout(() => setReady(true), 1200) : undefined}
                />
              </div>
            </div>
          );
        })}
        {/*
          Readability scrims, max 50% opacity, only behind the text.
          Desktop: dark on the left, fully transparent by about the middle.
          Mobile: the text spans the full width, so the scrim rises from the bottom instead.
          Text also carries a dark halo (text-shadow). With both, every hero photo was checked
          to meet WCAG AA: 3:1 for the headline, 4.5:1 for smaller text.
        */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(20,22,27,0.5)_0%,rgba(20,22,27,0.47)_36%,rgba(20,22,27,0.22)_48%,rgba(20,22,27,0)_56%)] lg:block" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(20,22,27,0.5)_0%,rgba(20,22,27,0.48)_70%,rgba(20,22,27,0.35)_88%,rgba(20,22,27,0.2)_100%)] lg:hidden" />
      </div>

      <div className={`${containerClasses} relative flex min-h-[640px] flex-col justify-end pb-14 pt-32 sm:pb-16 lg:min-h-[clamp(720px,100svh,980px)] lg:pb-20 lg:pt-36`}>
        <div className="max-w-3xl [text-shadow:0_0_3px_rgba(0,0,0,0.85),0_0_6px_rgba(0,0,0,0.6),0_0_18px_rgba(0,0,0,0.4)] lg:max-w-[min(40rem,42vw)]">
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-white">
            <span aria-hidden="true" className="h-px w-8 bg-accent-light" />
            {site.serviceAreaLine}
          </p>
          <h1
            id="hero-heading"
            className="text-[2.6rem] font-medium leading-[1.04] tracking-tight sm:text-6xl lg:text-[3.5rem] xl:text-[4rem]"
          >
            Remodels and rebuilds, crafted without compromise.
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white sm:text-xl lg:max-w-[30rem] lg:text-lg xl:text-xl">
            From basement finishing to custom homes built from the foundation up. Flawless workmanship, quality materials,
            and a schedule and budget we stand behind.
          </p>
          <div data-cookie-avoid className="mt-9 flex flex-col gap-3 [text-shadow:none] sm:flex-row sm:items-center">
            <ButtonLink href={QUOTE_HREF} size="lg">
              Get a Free Quote
            </ButtonLink>
            <ButtonLink href="/services" size="lg" variant="outline-light" className="bg-ink/30 backdrop-blur-[2px]">
              View Our Services
            </ButtonLink>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-white/20 pt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white lg:max-w-[min(40rem,42vw)] [text-shadow:0_0_3px_rgba(0,0,0,0.85),0_0_6px_rgba(0,0,0,0.6),0_0_18px_rgba(0,0,0,0.4)]">
            {site.serviceHighlights.map((h) => (
              <li key={h} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-accent-light" />
                {h}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 rounded-full bg-ink/40 py-1 pl-3 pr-1 backdrop-blur-sm">
            <ul className="flex items-center gap-1.5" aria-label="Hero photos">
              {slides.map((photo, i) => (
                <li key={photo.src.src}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    disabled={i > 0 && !ready}
                    aria-label={`Show photo ${i + 1} of ${slides.length}: ${photo.alt}`}
                    aria-pressed={i === index}
                    className="group grid h-8 w-8 place-items-center"
                  >
                    <span
                      className={`block h-0.5 w-6 transition-colors ${
                        i === index ? "bg-white" : "bg-white/35 group-hover:bg-white/70"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause background photos" : "Play background photos"}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/40 text-base hover:border-white"
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

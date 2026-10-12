"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { heroPhotos, type Photo } from "@/lib/photos";
import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { PauseIcon, PlayIcon } from "@/components/ui/Icons";

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
        {/* Readability scrims */}
        <div className="absolute inset-0 bg-ink/45 lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[640px] max-w-site flex-col justify-end px-4 pb-16 pt-32 sm:px-6 sm:pb-20 lg:h-[100svh] lg:max-h-[980px] lg:min-h-[720px] lg:px-8 lg:pb-24">
        <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-light">
          <span aria-hidden="true" className="h-px w-8 bg-accent-light" />
          Renovation &amp; construction · {site.serviceArea}
        </p>
        <h1
          id="hero-heading"
          className="max-w-4xl text-[2.6rem] font-medium leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl"
        >
          Remodels and rebuilds, crafted without compromise.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
          From basement finishing to custom homes built from the foundation up. Flawless workmanship, quality materials,
          and a schedule and budget we stand behind.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink href="/contact" size="lg">
            Get a Free Quote
          </ButtonLink>
          <ButtonLink href="/services" size="lg" variant="outline-light">
            View Our Services
          </ButtonLink>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-white/20 pt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            {site.serviceHighlights.map((h) => (
              <li key={h} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-accent-light" />
                {h}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
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

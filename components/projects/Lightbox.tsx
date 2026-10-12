"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Photo } from "@/lib/photos";
import { categoryLabels } from "@/lib/photos";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@/components/ui/Icons";

type Props = {
  photos: Photo[];
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
};

export function Lightbox({ photos, index, onChange, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);
  const open = index !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      const opener = document.activeElement as HTMLElement | null;
      dialog.showModal();
      document.body.style.overflow = "hidden";
      const restore = () => {
        document.body.style.overflow = "";
        opener?.focus();
      };
      dialog.addEventListener("close", restore, { once: true });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (photos.length === 0) return null;
  const current = index !== null ? photos[index] : null;
  const prev = () => index !== null && onChange((index - 1 + photos.length) % photos.length);
  const next = () => index !== null && onChange((index + 1) % photos.length);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Project photo viewer"
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }}
      onClick={(e) => {
        // Clicking the backdrop (the dialog element itself) closes it
        if (e.target === e.currentTarget) dialogRef.current?.close();
      }}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
        touchStartX.current = null;
      }}
      className="on-dark m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-white backdrop:bg-ink/95"
    >
      {current && (
        <div className="flex h-full flex-col" onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}>
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <p className="text-sm text-white/70" aria-live="polite">
              {index! + 1} / {photos.length}
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              className="grid h-11 w-11 place-items-center rounded-full text-2xl hover:bg-white/10"
              aria-label="Close photo viewer"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20">
            <figure className="flex h-full max-h-full flex-col items-center justify-center">
              <Image
                key={current.src.src}
                src={current.src}
                alt={current.alt}
                placeholder="blur"
                sizes="100vw"
                className="h-auto max-h-[calc(100svh-10rem)] w-auto max-w-full object-contain"
              />
              <figcaption className="mt-4 max-w-2xl px-4 text-center">
                <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">
                  {categoryLabels[current.category]}
                </span>
                <span className="mt-1 block text-white/90">{current.alt}</span>
              </figcaption>
            </figure>

            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl hover:bg-white/20 sm:grid"
            >
              <ArrowLeftIcon />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl hover:bg-white/20 sm:grid"
            >
              <ArrowRightIcon />
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex justify-center gap-4 pb-6 pt-2 sm:hidden">
            <button type="button" onClick={prev} aria-label="Previous photo" className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-2xl">
              <ArrowLeftIcon />
            </button>
            <button type="button" onClick={next} aria-label="Next photo" className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-2xl">
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

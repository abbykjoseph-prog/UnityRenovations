"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { categoryLabels, type Photo, type ProjectCategory } from "@/lib/photos";
import { Lightbox } from "./Lightbox";

type Filter = "all" | ProjectCategory;

export function Gallery({ photos }: { photos: Photo[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = useMemo(
    () => (Object.keys(categoryLabels) as ProjectCategory[]).filter((c) => photos.some((p) => p.category === c)),
    [photos],
  );
  const visible = useMemo(() => (filter === "all" ? photos : photos.filter((p) => p.category === filter)), [photos, filter]);

  const filterButton = (value: Filter, label: string, count: number) => (
    <li key={value}>
      <button
        type="button"
        aria-pressed={filter === value}
        onClick={() => setFilter(value)}
        className="rounded-full border border-ink/20 px-4 py-2 text-sm font-medium transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
      >
        {label} <span className="opacity-60">({count})</span>
      </button>
    </li>
  );

  return (
    <>
      <ul className="flex flex-wrap gap-2" aria-label="Filter projects by type">
        {filterButton("all", "All work", photos.length)}
        {categories.map((c) => filterButton(c, categoryLabels[c], photos.filter((p) => p.category === c).length))}
      </ul>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} photos
      </p>

      <ul className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((photo, i) => (
          <li key={photo.src.src} className={photo.featured && filter === "all" && i === 0 ? "col-span-2 row-span-2" : ""}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative block aspect-square w-full overflow-hidden rounded-sm bg-paper-300"
              aria-label={`View larger: ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                placeholder="blur"
                sizes={
                  photo.featured && filter === "all" && i === 0
                    ? "(min-width: 1024px) 50vw, (min-width: 768px) 66vw, 100vw"
                    : "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                }
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 pt-10 text-left text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {photo.alt}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox photos={visible} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </>
  );
}

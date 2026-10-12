"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { COOKIE_NOTICE_KEY } from "@/lib/legal";

function readDismissed(): boolean {
  try {
    return window.localStorage.getItem(COOKIE_NOTICE_KEY) === "1";
  } catch {
    return false;
  }
}

function saveDismissed() {
  try {
    window.localStorage.setItem(COOKIE_NOTICE_KEY, "1");
  } catch {
    // Storage unavailable (private mode, blocked): the notice just stays hidden for this visit
  }
}

/**
 * Small notice fixed to the bottom of the screen on a first visit.
 * It steps out of the way of anything marked `data-cookie-avoid` (e.g. the hero buttons)
 * and slides back in once that content has scrolled clear.
 */
export function CookieNotice() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [entered, setEntered] = useState(false);
  const [overlapping, setOverlapping] = useState(false);
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setDismissed(readDismissed());
  }, []);

  // Slide in on the frame after first paint
  useEffect(() => {
    if (!mounted || dismissed) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    return () => cancelAnimationFrame(id);
  }, [mounted, dismissed]);

  const checkOverlap = useCallback(() => {
    const outer = outerRef.current;
    if (!outer) return;
    // Measure where the card sits (the wrapper's padding is transparent), ignoring the slide transform
    const rect = outer.getBoundingClientRect();
    const pad = getComputedStyle(outer);
    const zone = {
      top: rect.top + parseFloat(pad.paddingTop),
      bottom: rect.bottom - parseFloat(pad.paddingBottom),
      left: rect.left + parseFloat(pad.paddingLeft),
      right: rect.right - parseFloat(pad.paddingRight),
    };
    const hit = Array.from(document.querySelectorAll("[data-cookie-avoid]")).some((el) => {
      const r = el.getBoundingClientRect();
      return r.bottom > zone.top && r.top < zone.bottom && r.right > zone.left && r.left < zone.right;
    });
    setOverlapping(hit);
  }, []);

  useEffect(() => {
    if (!mounted || dismissed) return;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(checkOverlap);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [mounted, dismissed, checkOverlap]);

  const dismiss = () => {
    // Don't leave keyboard focus on a button that's about to disappear
    if (outerRef.current?.contains(document.activeElement)) {
      document.getElementById("main")?.focus({ preventScroll: true });
    }
    saveDismissed();
    setDismissed(true);
  };

  if (!mounted || dismissed) return null;

  const visible = entered && !overlapping;

  return (
    <div
      ref={outerRef}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 p-2 sm:left-auto sm:max-w-md sm:p-5"
    >
      <section
        aria-label="Cookie notice"
        aria-hidden={!visible}
        data-state={visible ? "shown" : "hidden"}
        className="cookie-notice on-dark pointer-events-auto flex items-center gap-3 rounded-sm bg-ink p-3 text-[0.8125rem] leading-snug text-paper shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 sm:gap-5 sm:p-5 sm:text-sm sm:leading-relaxed"
      >
        <p className="flex-1">
          We don&rsquo;t use tracking or advertising cookies. This site only uses what&rsquo;s needed for it to work.
          See our{" "}
          <Link href="/privacy" className="font-semibold text-white underline underline-offset-4 hover:text-accent-light">
            Privacy Policy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          tabIndex={visible ? undefined : -1}
          className="shrink-0 rounded-sm bg-accent px-4 py-2.5 font-semibold text-white transition-colors hover:bg-accent-dark sm:px-5"
        >
          Got it
        </button>
      </section>
    </div>
  );
}

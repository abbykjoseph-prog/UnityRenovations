"use client";

import { useEffect, useState } from "react";
import { getYearsInBusiness } from "@/lib/site";

/**
 * Starts from the value rendered on the server (at build time for static pages),
 * then recalculates from the visitor's own date so it never goes stale.
 */
export function YearsInBusinessClient({ initial }: { initial: number }) {
  const [years, setYears] = useState(initial);

  useEffect(() => {
    setYears(getYearsInBusiness(new Date()));
  }, []);

  return <>{years}</>;
}

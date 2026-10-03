"use client";

import { useEffect, useState } from "react";

/** The current time, refreshed every `ms` — for live tracking and relative timestamps. */
export function useNow(ms = 5000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

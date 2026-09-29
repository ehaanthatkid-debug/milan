"use client";

import { useEffect, useState } from "react";

/**
 * Shows a brief loading state whenever `key` changes — the pause a real
 * product has while it fetches filtered results from the server.
 */
export function useSimulatedLoading(key: string, ms = 380) {
  const [settledKey, setSettledKey] = useState(key);

  useEffect(() => {
    const t = setTimeout(() => setSettledKey(key), ms);
    return () => clearTimeout(t);
  }, [key, ms]);

  return settledKey !== key;
}

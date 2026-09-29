"use client";

import { useSyncExternalStore } from "react";
import { toISODate } from "./utils";

const noopSubscribe = () => () => {};

/**
 * Today's date as YYYY-MM-DD in the visitor's timezone. During server
 * rendering it uses `serverToday`, then switches to the real date in the
 * browser — so "this week" is always current, even on a statically built page.
 */
export function useToday(serverToday: string) {
  return useSyncExternalStore(noopSubscribe, () => toISODate(new Date()), () => serverToday);
}

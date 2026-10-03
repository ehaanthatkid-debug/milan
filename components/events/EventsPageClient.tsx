"use client";

import { useSearchParams } from "next/navigation";
import { EventsExplorer } from "./EventsExplorer";

/** Reads ?q=, ?category=, ?city= and ?age= from links like the home-page search. */
export function EventsPageClient({ serverToday }: { serverToday: string }) {
  const sp = useSearchParams();
  const initial = {
    q: sp.get("q") ?? undefined,
    category: sp.get("category") ?? undefined,
    city: sp.get("city") ?? undefined,
    age: sp.get("age") ?? undefined,
  };
  return <EventsExplorer key={sp.toString()} serverToday={serverToday} initial={initial} />;
}

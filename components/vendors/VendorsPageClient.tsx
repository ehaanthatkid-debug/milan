"use client";

import { useSearchParams } from "next/navigation";
import { VendorsExplorer } from "./VendorsExplorer";

/** Reads ?category= from links like "Mehndi artists" on the home page. */
export function VendorsPageClient() {
  const sp = useSearchParams();
  return <VendorsExplorer key={sp.toString()} initialCategory={sp.get("category") ?? undefined} />;
}

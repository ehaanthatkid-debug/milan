"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/States";

export type { MapPin } from "./LeafletMap";

/** Leaflet needs the browser's `window`, so the map loads only on the client. */
export const MapView = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <Skeleton className="size-full rounded-none" />,
});

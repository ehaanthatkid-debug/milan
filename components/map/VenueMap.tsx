"use client";

import { MapView } from "./Map";

export function VenueMap({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  return <MapView pins={[{ id: "venue", lat, lng, label, title: label }]} activeId="venue" zoom={15} />;
}

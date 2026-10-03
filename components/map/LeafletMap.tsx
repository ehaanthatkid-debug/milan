"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import Link from "next/link";
import { useEffect, useMemo } from "react";

export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  title: string;
  subtitle?: string;
  href?: string;
};

function pinIcon(label: string, active: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="milan-pin${active ? " is-active" : ""}"><span>${label}</span></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -40],
  });
}

function FitBounds({ pins, zoom }: { pins: MapPin[]; zoom: number }) {
  const map = useMap();
  const key = pins.map((p) => p.id).join(",");
  useEffect(() => {
    if (pins.length === 0) return;
    if (pins.length === 1) {
      map.setView([pins[0].lat, pins[0].lng], zoom, { animate: true });
      return;
    }
    map.fitBounds(L.latLngBounds(pins.map((p) => [p.lat, p.lng])), { padding: [56, 56], maxZoom: 13, animate: true });
    // Only refit when the set of pins changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map, zoom]);
  return null;
}

export default function LeafletMap({
  pins,
  activeId,
  zoom = 14,
  interactive = true,
}: {
  pins: MapPin[];
  activeId?: string | null;
  zoom?: number;
  interactive?: boolean;
}) {
  const center = useMemo<[number, number]>(
    () => (pins[0] ? [pins[0].lat, pins[0].lng] : [47.62, -122.2]),
    [pins],
  );

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      dragging={interactive}
      zoomControl={interactive}
      className="size-full"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds pins={pins} zoom={zoom} />
      {pins.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={pinIcon(p.label, p.id === activeId)}
          zIndexOffset={p.id === activeId ? 1000 : 0}
        >
          <Popup>
            <div className="min-w-44">
              <p className="font-display text-base leading-snug text-ink">{p.title}</p>
              {p.subtitle && <p className="mt-1 text-xs text-ink-soft">{p.subtitle}</p>}
              {p.href && (
                <Link href={p.href} className="mt-2 inline-block text-xs font-semibold text-maroon">
                  View details →
                </Link>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

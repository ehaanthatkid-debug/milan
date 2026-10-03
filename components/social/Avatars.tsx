"use client";

import Image from "next/image";
import { UserRound } from "lucide-react";
import type { Person } from "@/data/people";
import type { MyProfile } from "@/lib/social";
import { cn } from "@/lib/utils";

export function PersonAvatar({ person, size = 40, className }: { person: Person; size?: number; className?: string }) {
  return (
    <span className={cn("relative inline-block shrink-0 overflow-hidden rounded-full bg-ivory-200", className)} style={{ width: size, height: size }}>
      <Image src={person.avatar} alt={person.name} fill sizes={`${size * 2}px`} className="object-cover" />
    </span>
  );
}

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** The visitor's own avatar: their uploaded photo, or initials. */
export function MeAvatar({ me, size = 40, className }: { me: MyProfile | null; size?: number; className?: string }) {
  if (me?.photo) {
    return (
      // A small data-URL photo stored on this device, so the image optimizer doesn't apply.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={me.photo}
        alt={me.name}
        className={cn("shrink-0 rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  if (!me) {
    return (
      <span
        className={cn("grid shrink-0 place-items-center rounded-full bg-maroon-soft text-maroon", className)}
        style={{ width: size, height: size }}
        aria-label="You"
      >
        <UserRound style={{ width: size * 0.5, height: size * 0.5 }} />
      </span>
    );
  }
  return (
    <span
      className={cn("font-display grid shrink-0 place-items-center rounded-full bg-maroon font-semibold text-ivory", className)}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-label={me.name}
    >
      {initialsOf(me.name)}
    </span>
  );
}

export function FaceStack({
  people,
  size = 28,
  max = 4,
  ringClass = "ring-ivory",
  className,
}: {
  people: Person[];
  size?: number;
  max?: number;
  ringClass?: string;
  className?: string;
}) {
  const shown = people.slice(0, max);
  return (
    <span className={cn("flex items-center", className)}>
      {shown.map((p, i) => (
        <span key={p.id} className={cn("-ml-2 rounded-full ring-2 first:ml-0", ringClass)} style={{ zIndex: shown.length - i }}>
          <PersonAvatar person={p} size={size} />
        </span>
      ))}
    </span>
  );
}

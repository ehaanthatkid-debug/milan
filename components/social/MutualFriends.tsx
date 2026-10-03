"use client";

import Link from "next/link";
import { people, type Person } from "@/data/people";
import { isFriend, useSocial } from "@/lib/social";
import { FaceStack } from "./Avatars";

/** Your friends who share events with this person. */
export function MutualFriends({ person }: { person: Person }) {
  const s = useSocial();
  const mutual = people.filter((p) => p.id !== person.id && isFriend(s, p) && p.going.some((g) => person.going.includes(g)));
  if (mutual.length === 0) return null;
  return (
    <div className="rounded-2xl bg-ivory-100 p-4 ring-1 ring-sand/70">
      <p className="text-sm font-semibold text-ink">Friends in common</p>
      <div className="mt-2.5 flex items-center gap-3">
        <FaceStack people={mutual} size={32} max={4} ringClass="ring-ivory-100" />
        <p className="text-sm text-ink-soft">
          {mutual.slice(0, 2).map((m, i) => (
            <span key={m.id}>
              {i > 0 && " and "}
              <Link href={`/people/${m.id}`} className="font-medium text-ink hover:text-maroon">
                {m.name.split(" ")[0]}
              </Link>
            </span>
          ))}
          {mutual.length > 2 && ` + ${mutual.length - 2} more`}
        </p>
      </div>
    </div>
  );
}

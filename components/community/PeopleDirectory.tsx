"use client";

import Link from "next/link";
import { Search, UsersRound } from "lucide-react";
import { useState } from "react";
import { people } from "@/data/people";
import { connectionStatus, useSocial } from "@/lib/social";
import { SegmentedControl } from "@/components/ui/Filters";
import { EmptyState } from "@/components/ui/States";
import { PersonAvatar } from "@/components/social/Avatars";
import { ConnectButton, MessageButton } from "@/components/social/PeopleActions";

type Scope = "all" | "friends" | "suggested";

export function PeopleDirectory() {
  const s = useSocial();
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<Scope>("all");
  const needle = q.trim().toLowerCase();

  const list = people
    .filter((p) => {
      const status = connectionStatus(s, p);
      if (scope === "friends" && status !== "connected") return false;
      if (scope === "suggested" && status === "connected") return false;
      if (!needle) return true;
      return [p.name, p.handle, p.city, ...p.interests, ...p.languages].join(" ").toLowerCase().includes(needle);
    })
    .sort((a, b) => b.mutuals - a.mutuals);

  const friendCount = people.filter((p) => connectionStatus(s, p) === "connected").length;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative flex h-11 w-full items-center rounded-full border border-sand bg-white/70 pr-2 pl-4 focus-within:border-maroon/40 sm:max-w-sm">
          <Search className="size-4 shrink-0 text-ink-mute" />
          <span className="sr-only">Search people</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, city, interest, or language"
            className="w-full bg-transparent px-3 text-[0.95rem] text-ink placeholder:text-ink-mute focus:outline-none"
          />
        </label>
        <SegmentedControl
          value={scope}
          onChange={setScope}
          layoutGroup="people-scope"
          className="self-start"
          options={[
            { value: "all", label: "Everyone" },
            { value: "friends", label: `Friends · ${friendCount}` },
            { value: "suggested", label: "Suggested" },
          ]}
        />
      </div>

      {list.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={<UsersRound className="size-7" strokeWidth={1.6} />} title="No one matches that search" description="Try a city like Redmond, an interest like Qawwali, or a language like Bengali." />
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => (
            <li key={p.id} className="flex flex-col rounded-[1.5rem] border border-sand/80 bg-white/70 p-5 transition-shadow hover:shadow-card">
              <Link href={`/people/${p.id}`} className="group flex items-center gap-3">
                <PersonAvatar person={p} size={56} />
                <span className="min-w-0">
                  <span className="font-display block truncate text-xl text-ink group-hover:text-maroon">{p.name}</span>
                  <span className="block truncate text-sm text-ink-mute">
                    @{p.handle} · {p.city}
                  </span>
                </span>
              </Link>
              <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-soft">{p.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.interests.slice(0, 3).map((i) => (
                  <span key={i} className="rounded-full bg-ivory-200 px-2.5 py-1 text-xs text-ink-soft">
                    {i}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-ink-mute">
                {p.mutuals} mutual friends · Going to {p.going.length} events
              </p>
              <div className="mt-4 flex gap-2">
                <ConnectButton person={p} size="sm" className="flex-1" />
                <MessageButton person={p} size="sm" className="flex-1" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

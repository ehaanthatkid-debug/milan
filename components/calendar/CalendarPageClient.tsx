"use client";

import { CalendarPlus, CalendarHeart } from "lucide-react";
import { useMemo, useState } from "react";
import { EVENT_CATEGORIES, events } from "@/data/events";
import { people } from "@/data/people";
import { downloadCalendarFileMulti } from "@/lib/calendar";
import { useOrders } from "@/lib/orders";
import { isFriend, useSocial } from "@/lib/social";
import { useToday } from "@/lib/use-today";
import { parseLocalDate } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { FilterChip, SegmentedControl } from "@/components/ui/Filters";
import { EmptyState } from "@/components/ui/States";
import { EventsCalendar, type Mark } from "./EventsCalendar";

type Scope = "all" | "mine" | "friends";

export function CalendarPageClient({ serverToday }: { serverToday: string }) {
  const today = useToday(serverToday);
  const s = useSocial();
  const orders = useOrders();
  const [scope, setScope] = useState<Scope>("all");
  const [category, setCategory] = useState<string>("All");

  const marks = useMemo(() => {
    const m: Record<string, Mark> = {};
    for (const [slug, status] of Object.entries(s.rsvps)) m[slug] = status;
    for (const o of orders) if (o.kind === "event") m[o.slug] = "ticket";
    return m;
  }, [s.rsvps, orders]);

  const friendSlugs = useMemo(() => new Set(people.filter((p) => isFriend(s, p)).flatMap((p) => p.going)), [s]);

  const list = events.filter((e) => {
    if (category !== "All" && e.category !== category) return false;
    if (scope === "mine") return !!marks[e.slug];
    if (scope === "friends") return friendSlugs.has(e.slug);
    return true;
  });

  const mine = events.filter((e) => marks[e.slug] === "going" || marks[e.slug] === "ticket");

  function exportMine() {
    downloadCalendarFileMulti(
      mine.map((e) => {
        const start = parseLocalDate(e.date, e.startTime);
        const end = parseLocalDate(e.date, e.endTime);
        if (end <= start) end.setDate(end.getDate() + 1);
        return { uid: e.slug, title: e.title, start, end, location: `${e.venue.name}, ${e.venue.address}` };
      }),
      "my-milan-events.ics",
    );
  }

  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SegmentedControl
          value={scope}
          onChange={setScope}
          layoutGroup="cal-scope"
          className="self-start"
          options={[
            { value: "all", label: "All events" },
            { value: "mine", label: "My events" },
            { value: "friends", label: "Friends going" },
          ]}
        />
        <button
          type="button"
          onClick={exportMine}
          disabled={mine.length === 0}
          className="inline-flex h-10 items-center gap-2 self-start rounded-full border border-sand bg-white/60 px-4 text-sm font-medium text-ink transition-colors hover:border-maroon/30 hover:text-maroon disabled:opacity-40"
        >
          <CalendarPlus className="size-4" /> {mine.length === 1 ? "Add my event to my calendar" : `Add my ${mine.length || ""} events to my calendar`.replace("  ", " ")}
        </button>
      </div>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        {(["All", ...EVENT_CATEGORIES] as const).map((c) => (
          <FilterChip key={c} active={category === c} onClick={() => setCategory(c)} layoutGroup="cal-cat">
            {c}
          </FilterChip>
        ))}
      </div>

      <div className="mt-6">
        {scope === "mine" && list.length === 0 ? (
          <EmptyState
            icon={<CalendarHeart className="size-7" strokeWidth={1.6} />}
            title="Nothing on your calendar yet"
            description="Tap “Going?” on any event and it shows up here — along with any tickets you buy."
            action={<ButtonLink href="/events">Find events</ButtonLink>}
          />
        ) : (
          <EventsCalendar key={`${scope}-${category}`} events={list} today={today} marks={marks} />
        )}
      </div>
    </section>
  );
}

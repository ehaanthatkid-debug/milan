"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarX2, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { EVENT_CATEGORIES, type EventCategory, type EventItem } from "@/data/events";
import { EventRow } from "@/components/events/EventRow";
import { GoingPill } from "@/components/social/Rsvp";
import { cn, formatLongDate, formatTime, parseLocalDate, toISODate } from "@/lib/utils";

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  Garba: "#E8B15B",
  Diwali: "#C89B3C",
  Eid: "#2F6B4F",
  Holi: "#D9467A",
  Vaisakhi: "#E07A1F",
  "Music & Arts": "#2E7D7A",
  Wedding: "#7A1230",
  Collegiate: "#5B463B",
};

export type Mark = "going" | "interested" | "ticket";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function monthOf(iso: string) {
  const d = parseLocalDate(iso);
  return { y: d.getFullYear(), m: d.getMonth() };
}

/** Month view of events with a day agenda. Your own RSVPs and tickets are highlighted. */
export function EventsCalendar({
  events,
  today,
  marks = {},
}: {
  events: EventItem[];
  today: string;
  marks?: Record<string, Mark>;
}) {
  const sorted = useMemo(() => [...events].sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)), [events]);
  const firstUpcoming = sorted.find((e) => e.date >= today)?.date ?? today;
  const [view, setView] = useState(() => monthOf(firstUpcoming));
  const [selected, setSelected] = useState<string>(firstUpcoming);
  const [dir, setDir] = useState(0);

  const byDay = useMemo(() => {
    const map: Record<string, EventItem[]> = {};
    for (const e of sorted) (map[e.date] ??= []).push(e);
    return map;
  }, [sorted]);

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const days = new Date(view.y, view.m + 1, 0).getDate();
    const out: (string | null)[] = Array.from({ length: first.getDay() }, () => null);
    for (let d = 1; d <= days; d++) out.push(toISODate(new Date(view.y, view.m, d)));
    while (out.length % 7) out.push(null);
    return out;
  }, [view]);

  const monthEvents = sorted.filter((e) => {
    const d = parseLocalDate(e.date);
    return d.getFullYear() === view.y && d.getMonth() === view.m;
  });

  function shift(delta: number) {
    setDir(delta);
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
    const first = sorted.find((e) => {
      const ed = parseLocalDate(e.date);
      return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth();
    });
    setSelected(first?.date ?? toISODate(d));
  }

  function goToday() {
    setDir(0);
    setView(monthOf(today));
    setSelected(today);
  }

  const dayEvents = byDay[selected] ?? [];
  const label = new Date(view.y, view.m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="overflow-hidden rounded-[1.75rem] border border-sand/80 bg-white/70 shadow-card">
        <div className="flex items-center justify-between gap-3 border-b border-sand/80 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Previous month" onClick={() => shift(-1)} className="grid size-9 place-items-center rounded-full hover:bg-ink/5">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" aria-label="Next month" onClick={() => shift(1)} className="grid size-9 place-items-center rounded-full hover:bg-ink/5">
              <ChevronRight className="size-5" />
            </button>
            <p className="font-display ml-2 text-xl text-ink sm:text-2xl" aria-live="polite">
              {label}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-mute sm:inline">
              {monthEvents.length} {monthEvents.length === 1 ? "event" : "events"}
            </span>
            <button type="button" onClick={goToday} className="h-9 rounded-full border border-sand px-3.5 text-sm font-medium text-ink hover:border-maroon/30">
              Today
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-sand/60 bg-ivory-100/60 text-center text-[0.7rem] font-semibold tracking-wider text-ink-mute uppercase">
          {WEEKDAYS.map((d) => (
            <span key={d} className="py-2">
              <span className="sm:hidden">{d[0]}</span>
              <span className="hidden sm:inline">{d}</span>
            </span>
          ))}
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`${view.y}-${view.m}`}
            initial={{ opacity: 0, x: dir * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -30 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-7"
          >
            {cells.map((iso, i) => {
              if (!iso) return <div key={`b${i}`} className="min-h-14 border-r border-b border-sand/50 bg-ivory-100/40 sm:min-h-28" />;
              const list = byDay[iso] ?? [];
              const isToday = iso === today;
              const isSelected = iso === selected;
              const past = iso < today;
              return (
                <div
                  key={iso}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(iso)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(iso)}
                  aria-label={`${formatLongDate(iso)}, ${list.length} events`}
                  aria-pressed={isSelected}
                  className={cn(
                    "relative min-h-14 cursor-pointer border-r border-b border-sand/50 p-1 text-left transition-colors sm:min-h-28 sm:p-1.5",
                    isSelected ? "bg-maroon-soft/60" : "hover:bg-ivory-100",
                    (i + 1) % 7 === 0 && "border-r-0",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-7 place-items-center rounded-full text-sm",
                      isToday ? "bg-maroon font-semibold text-ivory" : past ? "text-ink-mute/60" : "text-ink",
                    )}
                  >
                    {Number(iso.slice(8))}
                  </span>
                  {/* Phones: colored dots. Larger screens: event chips. */}
                  <span className="mt-1 flex flex-wrap gap-0.5 px-1 sm:hidden">
                    {list.slice(0, 3).map((e) => (
                      <span key={e.slug} className="size-1.5 rounded-full" style={{ background: CATEGORY_COLORS[e.category] }} />
                    ))}
                  </span>
                  <span className="mt-1 hidden space-y-1 sm:block">
                    {list.slice(0, 2).map((e) => {
                      const mark = marks[e.slug];
                      return (
                        <Link
                          key={e.slug}
                          href={`/events/${e.slug}`}
                          onClick={(ev) => ev.stopPropagation()}
                          className={cn(
                            "flex items-center gap-1.5 truncate rounded-md px-1.5 py-1 text-[0.7rem] leading-tight transition-colors",
                            mark === "going" || mark === "ticket"
                              ? "bg-maroon text-ivory hover:bg-maroon-deep"
                              : mark === "interested"
                                ? "bg-saffron-soft text-maroon-ink ring-1 ring-saffron"
                                : "bg-white text-ink ring-1 ring-sand/70 hover:ring-maroon/30",
                            past && !mark && "opacity-60",
                          )}
                          title={e.title}
                        >
                          <span className="size-1.5 shrink-0 rounded-full" style={{ background: CATEGORY_COLORS[e.category] }} />
                          <span className="truncate">
                            <span className="font-semibold">{formatTime(e.startTime).replace(":00", "")}</span> {e.title}
                          </span>
                        </Link>
                      );
                    })}
                    {list.length > 2 && <span className="block px-1.5 text-[0.68rem] font-medium text-maroon">+{list.length - 2} more</span>}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-4 py-3 text-xs text-ink-mute sm:px-5">
          {EVENT_CATEGORIES.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: CATEGORY_COLORS[c] }} /> {c}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-sm bg-maroon" /> You&apos;re going
          </span>
        </div>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="text-xs font-semibold tracking-[0.18em] text-gold-deep uppercase">{selected === today ? "Today" : "Selected day"}</p>
        <h3 className="font-display mt-1 text-2xl text-ink">{formatLongDate(selected)}</h3>
        <div className="mt-4 space-y-3">
          {dayEvents.length === 0 ? (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-sand-deep/70 bg-ivory-100/50 px-5 py-10 text-center">
              <CalendarX2 className="size-7 text-ink-mute" strokeWidth={1.6} />
              <p className="mt-3 font-medium text-ink">Nothing on this day</p>
              <p className="mt-1 text-sm text-ink-mute">Pick a highlighted day, or jump to another month.</p>
            </div>
          ) : (
            dayEvents.map((e) => (
              <div key={e.slug} className="space-y-2">
                <EventRow event={e} compact />
                <div className="flex justify-end">
                  <GoingPill event={e} />
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}

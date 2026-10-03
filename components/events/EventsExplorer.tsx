"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CalendarRange, CircleDollarSign, LayoutGrid, List, Map as MapIcon, MapPin, Search, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AGE_GROUPS, AGE_GROUP_LABELS, EVENT_CATEGORIES, events, fromPrice, isFree, type AgeGroup, type EventItem } from "@/data/events";
import { CITIES } from "@/data/shared";
import { EventCard } from "@/components/cards/EventCard";
import { EventRow } from "./EventRow";
import { MapView, type MapPin as Pin } from "@/components/map/Map";
import { EventsCalendar } from "@/components/calendar/EventsCalendar";
import { useSocial } from "@/lib/social";
import { Button } from "@/components/ui/Button";
import { FilterChip, SegmentedControl, SelectPill } from "@/components/ui/Filters";
import { CardSkeleton, EmptyState, ListRowSkeleton } from "@/components/ui/States";
import { useSimulatedLoading } from "@/lib/use-simulated-loading";
import { useToday } from "@/lib/use-today";
import { daysBetween, monthShort, dayOfMonth, parseLocalDate } from "@/lib/utils";

type View = "grid" | "list" | "map" | "calendar";
type DateFilter = "any" | "week" | "weekend" | "month" | "later";
type PriceFilter = "any" | "free" | "under25" | "25to75" | "over75";
type AgeFilter = "any" | AgeGroup;

const CATEGORY_OPTIONS = ["All", ...EVENT_CATEGORIES, "Free"] as const;

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "any", label: "Any date" },
  { value: "week", label: "This week" },
  { value: "weekend", label: "This weekend" },
  { value: "month", label: "Next 30 days" },
  { value: "later", label: "Later this season" },
];

const PRICE_OPTIONS: { value: PriceFilter; label: string }[] = [
  { value: "any", label: "Any price" },
  { value: "free", label: "Free" },
  { value: "under25", label: "Under $25" },
  { value: "25to75", label: "$25 – $75" },
  { value: "over75", label: "$75+" },
];

const CITY_OPTIONS = [{ value: "", label: "All cities" }, ...CITIES.map((c) => ({ value: c, label: c }))];

const AGE_OPTIONS: { value: AgeFilter; label: string }[] = [
  { value: "any", label: "Any age" },
  ...AGE_GROUPS.map((g) => ({ value: g, label: AGE_GROUP_LABELS[g] })),
];

function matchesDate(e: EventItem, filter: DateFilter, today: string) {
  const now = parseLocalDate(today);
  const diff = daysBetween(now, parseLocalDate(e.date));
  if (diff < 0) return filter === "any";
  switch (filter) {
    case "any":
      return true;
    case "week":
      return diff <= 7;
    case "month":
      return diff <= 30;
    case "later":
      return diff > 30;
    case "weekend": {
      const dow = now.getDay();
      const start = dow === 0 || dow >= 5 ? 0 : 5 - dow;
      const end = dow === 0 ? 0 : start + (7 - Math.max(dow, 5));
      return diff >= start && diff <= end;
    }
  }
}

function matchesPrice(e: EventItem, filter: PriceFilter) {
  const free = isFree(e);
  const p = fromPrice(e);
  switch (filter) {
    case "any":
      return true;
    case "free":
      return free;
    case "under25":
      return !free && p < 25;
    case "25to75":
      return !free && p >= 25 && p <= 75;
    case "over75":
      return p > 75;
  }
}

export function EventsExplorer({
  serverToday,
  initial,
}: {
  serverToday: string;
  initial: { q?: string; category?: string; city?: string; age?: string };
}) {
  const today = useToday(serverToday);
  const [q, setQ] = useState(initial.q ?? "");
  const [category, setCategory] = useState<string>(
    CATEGORY_OPTIONS.includes(initial.category as (typeof CATEGORY_OPTIONS)[number]) ? initial.category! : "All",
  );
  const [city, setCity] = useState(CITIES.includes(initial.city as (typeof CITIES)[number]) ? initial.city! : "");
  const [date, setDate] = useState<DateFilter>("any");
  const [price, setPrice] = useState<PriceFilter>("any");
  const [age, setAge] = useState<AgeFilter>(
    AGE_GROUPS.includes(initial.age as AgeGroup) ? (initial.age as AgeGroup) : "any",
  );
  const [view, setView] = useState<View>("grid");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const social = useSocial();

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...events]
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
      .filter((e) => {
        if (category === "Free" ? !isFree(e) : category !== "All" && e.category !== category) return false;
        if (city && e.city !== city) return false;
        if (age !== "any" && e.ages.group !== age) return false;
        if (!matchesDate(e, date, today) || !matchesPrice(e, price)) return false;
        if (needle) {
          const hay = [e.title, e.tagline, e.category, e.city, e.neighborhood, e.venue.name, e.organizer.name, e.ages.label]
            .join(" ")
            .toLowerCase();
          return needle.split(/\s+/).every((w) => hay.includes(w));
        }
        return true;
      });
  }, [q, category, city, date, price, age, today]);

  const filterKey = [q.trim(), category, city, date, price, age].join("|");
  const loading = useSimulatedLoading(filterKey);
  const hasFilters =
    q.trim() !== "" || category !== "All" || city !== "" || date !== "any" || price !== "any" || age !== "any";

  function clearAll() {
    setQ("");
    setCategory("All");
    setCity("");
    setDate("any");
    setPrice("any");
    setAge("any");
  }

  const pins: Pin[] = results.map((e) => ({
    id: e.slug,
    lat: e.venue.lat,
    lng: e.venue.lng,
    label: `${monthShort(e.date)} ${dayOfMonth(e.date)}`,
    title: e.title,
    subtitle: `${e.venue.name.split(" — ")[0]}, ${e.city}`,
    href: `/events/${e.slug}`,
  }));

  return (
    <>
      <div className="sticky top-16 z-30 mt-8 border-y border-sand/70 bg-ivory/90 backdrop-blur-xl lg:top-20">
        <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative flex h-11 flex-1 items-center rounded-full border border-sand bg-white/70 pr-2 pl-4 transition-colors focus-within:border-maroon/40 focus-within:bg-white lg:max-w-xs">
              <Search className="size-4 shrink-0 text-ink-mute" />
              <span className="sr-only">Search events</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search events, venues, organizers"
                className="w-full bg-transparent px-3 text-[0.95rem] text-ink placeholder:text-ink-mute focus:outline-none"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  aria-label="Clear search"
                  className="grid size-7 place-items-center rounded-full text-ink-mute hover:bg-ink/5"
                >
                  <X className="size-4" />
                </button>
              )}
            </label>
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-1 lg:px-0">
              {CATEGORY_OPTIONS.map((c) => (
                <FilterChip key={c} active={category === c} onClick={() => setCategory(c)} layoutGroup="event-cat">
                  {c}
                </FilterChip>
              ))}
            </div>
          </div>
          <div className="no-scrollbar -mx-4 mt-3 flex items-center gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            <SelectPill
              label="Date"
              value={date}
              onChange={(v) => setDate(v as DateFilter)}
              options={DATE_OPTIONS}
              icon={<CalendarDays className="pointer-events-none size-4" />}
            />
            <SelectPill
              label="Price"
              value={price}
              onChange={(v) => setPrice(v as PriceFilter)}
              options={PRICE_OPTIONS}
              icon={<CircleDollarSign className="pointer-events-none size-4" />}
            />
            <SelectPill
              label="Ages"
              value={age}
              onChange={(v) => setAge(v as AgeFilter)}
              options={AGE_OPTIONS}
              icon={<Users className="pointer-events-none size-4" />}
            />
            <SelectPill
              label="City"
              value={city}
              onChange={setCity}
              options={CITY_OPTIONS}
              icon={<MapPin className="pointer-events-none size-4" />}
            />
            <AnimatePresence>
              {hasFilters && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={clearAll}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-maroon hover:bg-maroon-soft"
                >
                  <X className="size-4" /> Clear all
                </motion.button>
              )}
            </AnimatePresence>
            <div className="ml-auto hidden sm:block">
              <ViewToggle view={view} setView={setView} />
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-ink-soft" aria-live="polite">
            {loading ? (
              "Finding events…"
            ) : (
              <>
                <span className="font-semibold text-ink">{results.length}</span>{" "}
                {results.length === 1 ? "event" : "events"}
                {city ? ` in ${city}` : " across Seattle & the Eastside"}
              </>
            )}
          </p>
          <div className="sm:hidden">
            <ViewToggle view={view} setView={setView} compact />
          </div>
        </div>

        {!loading && results.length === 0 ? (
          <EmptyState
            title="No events match those filters"
            description="Try a different date or city — or clear your filters to see everything happening this season."
            action={<Button onClick={clearAll}>Clear all filters</Button>}
          />
        ) : view === "calendar" ? (
          loading ? (
            <div className="skeleton h-[32rem] rounded-[1.75rem]" />
          ) : (
            <EventsCalendar key={filterKey} events={results} today={today} marks={social.rsvps} />
          )
        ) : view === "map" ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
            <div className="order-2 space-y-3 lg:order-1 lg:max-h-[calc(100vh-15rem)] lg:overflow-y-auto lg:pr-2">
              {loading
                ? Array.from({ length: 4 }, (_, i) => <ListRowSkeleton key={i} />)
                : results.map((e) => (
                    <EventRow key={e.slug} event={e} compact active={activeSlug === e.slug} onHover={setActiveSlug} />
                  ))}
            </div>
            <div className="relative order-1 h-[55vh] overflow-hidden rounded-[1.75rem] shadow-card ring-1 ring-sand lg:sticky lg:top-60 lg:order-2 lg:h-[calc(100vh-15rem)]">
              <MapView pins={pins} activeId={activeSlug} zoom={13} />
            </div>
          </div>
        ) : view === "list" ? (
          <div className="space-y-3">
            {loading
              ? Array.from({ length: 4 }, (_, i) => <ListRowSkeleton key={i} />)
              : results.map((e, i) => (
                  <motion.div
                    key={e.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
                  >
                    <EventRow event={e} />
                  </motion.div>
                ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6">
            {loading
              ? Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)
              : results.map((e, i) => (
                  <motion.div
                    key={e.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.35), ease: [0.22, 1, 0.36, 1] }}
                  >
                    <EventCard event={e} sizes="(min-width: 1024px) 440px, (min-width: 640px) 50vw, 100vw" />
                  </motion.div>
                ))}
          </div>
        )}
      </section>
    </>
  );
}

function ViewToggle({ view, setView, compact }: { view: View; setView: (v: View) => void; compact?: boolean }) {
  return (
    <SegmentedControl
      value={view}
      onChange={setView}
      layoutGroup={compact ? "event-view-m" : "event-view"}
      options={[
        { value: "grid", label: compact ? "" : "Grid", icon: <LayoutGrid className="size-4" /> },
        { value: "list", label: compact ? "" : "List", icon: <List className="size-4" /> },
        { value: "map", label: compact ? "" : "Map", icon: <MapIcon className="size-4" /> },
        { value: "calendar", label: compact ? "" : "Calendar", icon: <CalendarRange className="size-4" /> },
      ]}
    />
  );
}

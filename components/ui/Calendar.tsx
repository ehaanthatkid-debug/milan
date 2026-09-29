"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { cn, parseLocalDate, toISODate } from "@/lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function addDays(iso: string, n: number) {
  const d = parseLocalDate(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

/**
 * Month calendar for picking a single date or a fixed-length range
 * (e.g. a 4-day rental). Past dates and already-booked dates are disabled.
 */
export function Calendar({
  today,
  booked,
  selected,
  onSelect,
  rangeDays = 1,
  initialMonth,
}: {
  today: string;
  booked: string[];
  selected: string | null;
  onSelect: (date: string) => void;
  rangeDays?: number;
  initialMonth?: string;
}) {
  const [view, setView] = useState(() => {
    const base = parseLocalDate(initialMonth ?? selected ?? today);
    // Near the end of a month, open on the next one so there are real dates to pick.
    const daysLeft = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate() - base.getDate();
    const d = !initialMonth && !selected && daysLeft < 7 ? new Date(base.getFullYear(), base.getMonth() + 1, 1) : base;
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [dir, setDir] = useState(0);
  const bookedSet = useMemo(() => new Set(booked), [booked]);

  const todayDate = parseLocalDate(today);
  const canGoBack = view.y > todayDate.getFullYear() || (view.y === todayDate.getFullYear() && view.m > todayDate.getMonth());

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const out: (string | null)[] = Array.from({ length: first.getDay() }, () => null);
    for (let d = 1; d <= daysInMonth; d++) out.push(toISODate(new Date(view.y, view.m, d)));
    while (out.length % 7) out.push(null);
    return out;
  }, [view]);

  const rangeSet = useMemo(() => {
    if (!selected) return new Set<string>();
    return new Set(Array.from({ length: rangeDays }, (_, i) => addDays(selected, i)));
  }, [selected, rangeDays]);

  function isUnavailable(iso: string) {
    if (iso < today) return true;
    for (let i = 0; i < rangeDays; i++) if (bookedSet.has(addDays(iso, i))) return true;
    return false;
  }

  function shift(delta: number) {
    setDir(delta);
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }

  const monthLabel = new Date(view.y, view.m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="select-none">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={!canGoBack}
          aria-label="Previous month"
          className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 disabled:opacity-30"
        >
          <ChevronLeft className="size-5" />
        </button>
        <p className="font-display text-lg text-ink" aria-live="polite">
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() => shift(1)}
          aria-label="Next month"
          className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 text-center text-[0.7rem] font-semibold tracking-wider text-ink-mute">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="py-1">
            {d}
          </span>
        ))}
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={`${view.y}-${view.m}`}
            custom={dir}
            initial={{ opacity: 0, x: dir * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-7 gap-y-1"
          >
            {cells.map((iso, i) => {
              if (!iso) return <span key={i} />;
              const day = Number(iso.slice(8));
              const isBooked = bookedSet.has(iso);
              const disabled = isUnavailable(iso);
              const inRange = rangeSet.has(iso);
              const isStart = iso === selected;
              const isEnd = rangeDays > 1 && selected !== null && iso === addDays(selected, rangeDays - 1);
              return (
                <div
                  key={iso}
                  className={cn(
                    "flex justify-center",
                    inRange && rangeDays > 1 && "bg-maroon-soft",
                    isStart && rangeDays > 1 && "rounded-l-full",
                    isEnd && "rounded-r-full",
                  )}
                >
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelect(iso)}
                    aria-pressed={isStart}
                    aria-label={`${parseLocalDate(iso).toDateString()}${isBooked ? ", booked" : disabled ? ", unavailable" : ""}`}
                    className={cn(
                      "relative grid size-10 place-items-center rounded-full text-sm transition-colors",
                      isStart || isEnd
                        ? "bg-maroon font-semibold text-ivory"
                        : inRange
                          ? "font-medium text-maroon"
                          : disabled
                            ? "text-ink-mute/45"
                            : "text-ink hover:bg-maroon-soft hover:text-maroon",
                      iso === today && !isStart && "ring-1 ring-gold",
                      isBooked && "line-through decoration-ink-mute/60",
                    )}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-mute">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-maroon" /> Selected
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-ink-mute/60 line-through">12</span> Booked
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full ring-1 ring-gold" /> Today
        </span>
      </div>
    </div>
  );
}

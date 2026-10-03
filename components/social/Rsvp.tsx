"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Star, X } from "lucide-react";
import type { MouseEvent } from "react";
import { people } from "@/data/people";
import type { EventItem } from "@/data/events";
import { friendsGoing, setRsvp, useSocial, type RsvpStatus } from "@/lib/social";
import { cn, formatCount } from "@/lib/utils";
import { FaceStack } from "./Avatars";

function stop(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
}

/** Attendee count including the visitor, plus the faces to show beside it. */
export function useGoing(event: EventItem) {
  const s = useSocial();
  const status = s.rsvps[event.slug] ?? null;
  const friends = friendsGoing(s, event.slug);
  const others = people.filter((p) => p.going.includes(event.slug) && !friends.includes(p));
  return { status, friends, faces: [...friends, ...others], count: event.attending + (status === "going" ? 1 : 0) };
}

/** Compact "Going?" toggle for event cards. Safe to place inside a link. */
export function GoingPill({ event, className }: { event: EventItem; className?: string }) {
  const { status } = useGoing(event);
  const going = status === "going";
  return (
    <button
      type="button"
      aria-pressed={going}
      onClick={(e) => {
        stop(e);
        setRsvp(event.slug, going ? null : "going");
      }}
      className={cn(
        "relative inline-flex h-8 shrink-0 items-center gap-1.5 overflow-hidden rounded-full px-3 text-xs font-semibold transition-colors active:scale-95",
        going ? "bg-maroon text-ivory" : "border border-sand bg-white text-ink hover:border-maroon/40 hover:text-maroon",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={going ? "y" : "n"}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          className="inline-flex items-center gap-1"
        >
          {going ? <Check className="size-3.5" strokeWidth={3} /> : null}
          {going ? "Going" : "Going?"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/** Faces + "1.9k going" line, with friends called out. */
export function GoingSummary({ event, tone = "dark", className }: { event: EventItem; tone?: "dark" | "light"; className?: string }) {
  const { faces, count, friends, status } = useGoing(event);
  const label =
    status === "going"
      ? `You + ${formatCount(count - 1)} going`
      : friends.length
        ? `${friends[0].name.split(" ")[0]}${friends.length > 1 ? ` + ${friends.length - 1} friend${friends.length > 2 ? "s" : ""}` : ""} going`
        : `${formatCount(count)} going`;
  return (
    <span className={cn("flex min-w-0 items-center gap-2", className)}>
      {faces.length > 0 && <FaceStack people={faces} size={22} max={3} ringClass={tone === "light" ? "ring-maroon-ink/60" : "ring-white"} />}
      <span className={cn("truncate text-sm", tone === "light" ? "text-ivory/80" : "text-ink-mute")}>{label}</span>
    </span>
  );
}

/** Going / Interested / Can't go control for the event page. */
export function RsvpPanel({ event }: { event: EventItem }) {
  const { status, friends, faces, count } = useGoing(event);
  const options: { value: RsvpStatus | null; label: string; icon: typeof Check }[] = [
    { value: "going", label: "Going", icon: Check },
    { value: "interested", label: "Interested", icon: Star },
    { value: null, label: "Can't go", icon: X },
  ];
  const names = friends.slice(0, 2).map((f) => f.name.split(" ")[0]);
  return (
    <div className="flex flex-col gap-4 rounded-[1.5rem] border border-sand/80 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <FaceStack people={faces} size={36} max={4} ringClass="ring-white" />
        <div className="min-w-0">
          <p className="font-semibold text-ink">
            {status === "going" ? "You're going!" : status === "interested" ? "You're interested" : "Are you going?"}
          </p>
          <p className="truncate text-sm text-ink-mute">
            {names.length
              ? `${names.join(", ")}${friends.length > 2 ? ` and ${friends.length - 2} more friends` : ""} + ${formatCount(count - friends.length)} others`
              : `${formatCount(count)} people going`}
            {" · "}
            <a href="#whos-going" className="font-medium text-maroon hover:underline">
              See who
            </a>
          </p>
        </div>
      </div>
      <div className="flex gap-2" role="radiogroup" aria-label="Your RSVP">
        {options.map(({ value, label, icon: Icon }) => {
          const active = value === null ? status === null : status === value;
          return (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setRsvp(event.slug, value)}
              className={cn(
                "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-all active:scale-95",
                active && value !== null ? "bg-maroon text-ivory" : active ? "bg-ink/10 text-ink" : "border border-sand bg-white text-ink-soft hover:border-maroon/30",
              )}
            >
              <Icon className="size-4" /> {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** RSVP control for the dark featured card in the home hero. */
export function SpotlightRsvp({ event }: { event: EventItem }) {
  const { status } = useGoing(event);
  const going = status === "going";
  return (
    <div className="flex items-center justify-between gap-3">
      <GoingSummary event={event} tone="light" />
      <button
        type="button"
        aria-pressed={going}
        onClick={() => setRsvp(event.slug, going ? null : "going")}
        className={cn(
          "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-all active:scale-95",
          going ? "bg-saffron text-maroon-ink" : "bg-ivory text-maroon hover:bg-white",
        )}
      >
        {going ? <Check className="size-4" strokeWidth={3} /> : null}
        {going ? "Going" : "I'm going"}
      </button>
    </div>
  );
}

export function SeeWhosGoingLink({ slug }: { slug: string }) {
  return (
    <Link href={`/events/${slug}#whos-going`} className="text-sm font-medium text-maroon hover:underline">
      See who&apos;s going
    </Link>
  );
}

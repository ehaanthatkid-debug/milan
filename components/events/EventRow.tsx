import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import type { EventItem } from "@/data/events";
import { DateBadge, PriceLabel } from "@/components/cards/EventCard";
import { cn, formatCount, formatShortDate, formatTime } from "@/lib/utils";

/** Horizontal event row used in list view and next to the map. */
export function EventRow({
  event,
  compact = false,
  active = false,
  onHover,
}: {
  event: EventItem;
  compact?: boolean;
  active?: boolean;
  onHover?: (slug: string | null) => void;
}) {
  return (
    <Link
      href={`/events/${event.slug}`}
      onMouseEnter={() => onHover?.(event.slug)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(event.slug)}
      className={cn(
        "group flex gap-4 rounded-3xl border bg-white/55 p-3 transition-all duration-300 hover:border-maroon/25 hover:bg-white hover:shadow-card sm:gap-5",
        active ? "border-maroon/40 bg-white shadow-card" : "border-sand/80",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-2xl bg-ivory-200",
          compact ? "aspect-square w-24 sm:w-28" : "aspect-[4/3] w-32 sm:w-56",
        )}
      >
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(min-width: 640px) 224px, 128px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {!compact && <DateBadge date={event.date} className="absolute top-2 left-2 hidden scale-90 sm:flex" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col py-1">
        <p className="text-[0.7rem] font-semibold tracking-[0.12em] text-gold-deep uppercase">
          {event.category} · {formatShortDate(event.date)}
        </p>
        <h3
          className={cn(
            "font-display mt-1 leading-snug text-ink transition-colors group-hover:text-maroon",
            compact ? "line-clamp-2 text-lg" : "text-lg sm:text-2xl",
          )}
        >
          {event.title}
        </h3>
        {!compact && <p className="mt-1 hidden text-sm text-ink-soft sm:block">{event.tagline}</p>}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-ink-mute" />
            {formatTime(event.startTime)}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0 text-ink-mute" />
            <span className="truncate">{compact ? event.city : `${event.venue.name.split(" — ")[0]}, ${event.city}`}</span>
          </span>
        </div>
      </div>
      {!compact && (
        <div className="hidden shrink-0 flex-col items-end justify-between py-1 pr-2 md:flex">
          <PriceLabel event={event} className="text-base" />
          <span className="text-sm text-ink-mute">{formatCount(event.attending)} going</span>
          <span className="grid size-10 place-items-center rounded-full border border-sand text-ink transition-all group-hover:border-maroon group-hover:bg-maroon group-hover:text-ivory">
            <ArrowRight className="size-4" />
          </span>
        </div>
      )}
    </Link>
  );
}

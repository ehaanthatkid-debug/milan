import Image from "next/image";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { fromPrice, isFree, type EventItem } from "@/data/events";
import { SaveButton } from "@/components/ui/SaveButton";
import { cn, dayOfMonth, formatCount, formatPrice, formatShortDate, formatTime, monthShort, weekdayShort } from "@/lib/utils";

export function DateBadge({ date, className }: { date: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex w-14 flex-col items-center rounded-2xl bg-ivory/95 py-1.5 text-center shadow-sm backdrop-blur",
        className,
      )}
    >
      <span className="text-[0.62rem] font-semibold tracking-[0.18em] text-maroon uppercase">{monthShort(date)}</span>
      <span className="font-display text-2xl leading-none font-semibold text-ink">{dayOfMonth(date)}</span>
      <span className="text-[0.62rem] font-medium tracking-wider text-ink-mute uppercase">{weekdayShort(date)}</span>
    </div>
  );
}

export function PriceLabel({ event, className }: { event: EventItem; className?: string }) {
  if (isFree(event)) {
    return <span className={cn("font-semibold text-leaf", className)}>Free</span>;
  }
  return (
    <span className={cn("text-ink-soft", className)}>
      From <span className="font-semibold text-ink">{formatPrice(fromPrice(event))}</span>
    </span>
  );
}

export function EventCard({
  event,
  className,
  sizes = "(min-width: 1024px) 380px, 80vw",
}: {
  event: EventItem;
  className?: string;
  sizes?: string;
}) {
  return (
    <Link href={`/events/${event.slug}`} className={cn("group block", className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ivory-200 shadow-card transition-shadow duration-500 group-hover:shadow-lift">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-ink/55 via-transparent to-transparent" />
        <DateBadge date={event.date} className="absolute top-3 left-3" />
        <SaveButton label={event.title} className="absolute top-3 right-3" />
        <span className="absolute bottom-3 left-3 rounded-full bg-maroon-ink/45 px-3 py-1 text-xs font-medium tracking-wide text-ivory backdrop-blur-md">
          {event.category}
        </span>
      </div>
      <div className="px-1 pt-4">
        <p className="text-xs font-semibold tracking-[0.12em] text-gold-deep uppercase">
          {formatShortDate(event.date)} · {formatTime(event.startTime)}
        </p>
        <h3 className="font-display mt-1.5 line-clamp-2 text-[1.3rem] leading-snug text-ink transition-colors group-hover:text-maroon">
          {event.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-soft">
          <MapPin className="size-3.5 shrink-0 text-ink-mute" />
          <span className="truncate">
            {event.venue.name.split(" — ")[0]} · {event.city}
          </span>
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-sand/80 pt-3 text-sm">
          <PriceLabel event={event} />
          <span className="flex items-center gap-1.5 text-ink-mute">
            <Users className="size-3.5" />
            {formatCount(event.attending)} going
          </span>
        </div>
      </div>
    </Link>
  );
}

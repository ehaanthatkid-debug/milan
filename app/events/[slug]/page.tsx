import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, Check, Clock, Navigation, MapPin, Users } from "lucide-react";
import { events, getEvent } from "@/data/events";
import { EventCard, PriceLabel } from "@/components/cards/EventCard";
import { BackLink, FollowButton, ShareButton } from "@/components/detail/DetailBits";
import { PhotoMosaic } from "@/components/detail/PhotoMosaic";
import { TicketPicker } from "@/components/events/TicketPicker";
import { VenueMap } from "@/components/map/VenueMap";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { Rail } from "@/components/ui/Rail";
import { Reveal } from "@/components/ui/Reveal";
import { SaveButton } from "@/components/ui/SaveButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatCount, formatLongDate, formatTime } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const event = getEvent((await params).slug);
  return event ? { title: event.title, description: event.tagline } : {};
}

export default async function EventDetailPage({ params }: PageProps<"/events/[slug]">) {
  const event = getEvent((await params).slug);
  if (!event) notFound();

  const related = events
    .filter((e) => e.slug !== event.slug)
    .sort((a, b) => Number(b.category === event.category) - Number(a.category === event.category))
    .slice(0, 6);
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.venue.address)}`;

  return (
    <article className="mx-auto max-w-[1400px] px-4 pt-4 sm:px-6 lg:px-8 lg:pt-8">
      <BackLink href="/events">All events</BackLink>

      <header className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-maroon px-3 py-1 text-xs font-semibold tracking-wide text-ivory">{event.category}</span>
            {event.featured && (
              <span className="rounded-full bg-saffron-soft px-3 py-1 text-xs font-semibold text-gold-deep">Featured</span>
            )}
            <span className="rounded-full border border-sand px-3 py-1 text-xs font-medium text-ink-soft">
              <PriceLabel event={event} />
            </span>
          </div>
          <h1 className="font-display mt-4 text-[2.4rem] leading-[1.02] text-balance text-ink sm:text-5xl lg:text-[4rem]">
            {event.title}
          </h1>
          <p className="mt-3 text-lg text-ink-soft sm:text-xl">{event.tagline}</p>
        </div>
        <div className="flex items-center gap-2">
          <ShareButton title={event.title} />
          <SaveButton label={event.title} className="size-10 border border-sand bg-white/60" />
        </div>
      </header>

      <div className="mt-7">
        <PhotoMosaic images={[event.image, ...event.gallery]} alt={event.title} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
        <div className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-3">
            <Fact icon={<CalendarDays className="size-5" />} label="Date" value={formatLongDate(event.date)} />
            <Fact
              icon={<Clock className="size-5" />}
              label="Time"
              value={`${formatTime(event.startTime)} – ${formatTime(event.endTime)}`}
            />
            <Fact icon={<MapPin className="size-5" />} label={event.city} value={event.venue.name.split(" — ")[0]} />
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-ivory-100 px-4 py-3 ring-1 ring-sand/70">
            <Users className="size-4 text-maroon" />
            <p className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">{formatCount(event.attending)} people</span> are going.
            </p>
            <AvatarStack count={event.attending} tone="dark" className="ml-auto hidden [&>span:last-child]:hidden sm:flex" />
          </div>

          <Reveal>
            <section className="mt-12">
              <h2 className="font-display text-3xl text-ink">About this event</h2>
              <div className="mt-4 space-y-4 text-[1.05rem] leading-relaxed text-ink-soft">
                {event.description.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {event.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3 rounded-2xl border border-sand/70 bg-white/50 px-4 py-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-saffron-soft text-gold-deep">
                      <Check className="size-4" strokeWidth={2.4} />
                    </span>
                    <span className="text-sm font-medium text-ink">{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal>
            <section className="mt-12">
              <h2 className="font-display text-3xl text-ink">Venue</h2>
              <div className="mt-4 overflow-hidden rounded-[1.75rem] border border-sand/80 bg-white/60">
                <div className="h-64 sm:h-80">
                  <VenueMap lat={event.venue.lat} lng={event.venue.lng} label={event.venue.name.split(" — ")[0]} />
                </div>
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-ink">{event.venue.name}</p>
                    <p className="mt-0.5 text-sm text-ink-soft">{event.venue.address}</p>
                    <p className="mt-0.5 text-sm text-ink-mute">{event.neighborhood}</p>
                  </div>
                  <a
                    href={directions}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-sand px-4 text-sm font-medium text-ink transition-colors hover:border-maroon/30 hover:text-maroon"
                  >
                    <Navigation className="size-4" /> Get directions
                  </a>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="mt-12">
              <h2 className="font-display text-3xl text-ink">Organizer</h2>
              <div className="mt-4 rounded-[1.75rem] border border-sand/80 bg-white/60 p-6">
                <div className="flex items-start gap-4">
                  <span className="font-display grid size-14 shrink-0 place-items-center rounded-2xl bg-maroon text-lg font-semibold text-ivory">
                    {event.organizer.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display flex items-center gap-1.5 text-xl text-ink">
                      {event.organizer.name}
                      {event.organizer.verified && <BadgeCheck className="size-5 text-gold" aria-label="Verified organizer" />}
                    </p>
                    <p className="mt-0.5 text-sm text-ink-mute">
                      {event.organizer.eventsHosted} events hosted · Hosting since {event.organizer.since}
                    </p>
                  </div>
                </div>
                <p className="mt-4 leading-relaxed text-ink-soft">{event.organizer.bio}</p>
                <div className="mt-5">
                  <FollowButton followers={event.organizer.followers} />
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ["Refunds", "Full refund up to 7 days before. Transfers to a friend anytime."],
                ["Accessibility", "Step-free entry, accessible restrooms, and seating on request."],
                ["Getting there", "Paid parking on site. Light rail and bus routes within a short walk."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl bg-ivory-100 p-5 ring-1 ring-sand/70">
                  <p className="font-semibold text-ink">{t}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{d}</p>
                </div>
              ))}
            </section>
          </Reveal>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <TicketPicker event={event} />
        </aside>
      </div>

      <section className="mt-20 lg:mt-28">
        <Reveal>
          <SectionHeading
            eyebrow="Keep exploring"
            title={
              <>
                More events <em>you&apos;ll love</em>
              </>
            }
          />
        </Reveal>
        <Rail label="Related events" className="mt-10" itemClassName="w-[82vw] sm:w-[360px] lg:w-[380px]">
          {related.map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </Rail>
      </section>
    </article>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-sand/80 bg-white/60 p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-maroon-soft text-maroon">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wider text-ink-mute uppercase">{label}</p>
        <p className="mt-0.5 font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}

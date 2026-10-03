import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Languages, MapPin, Sparkles } from "lucide-react";
import { events } from "@/data/events";
import { getPerson, people } from "@/data/people";
import { EventCard } from "@/components/cards/EventCard";
import { BackLink } from "@/components/detail/DetailBits";
import { PersonAvatar } from "@/components/social/Avatars";
import { ConnectButton, MessageButton } from "@/components/social/PeopleActions";
import { MutualFriends } from "@/components/social/MutualFriends";

export const dynamicParams = false;

export function generateStaticParams() {
  return people.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/people/[id]">): Promise<Metadata> {
  const p = getPerson((await params).id);
  return p ? { title: p.name, description: p.bio } : {};
}

export default async function PersonPage({ params }: PageProps<"/people/[id]">) {
  const person = getPerson((await params).id);
  if (!person) notFound();
  const going = events.filter((e) => person.going.includes(e.slug)).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <article className="mx-auto max-w-[1400px] px-4 pt-4 sm:px-6 lg:px-8 lg:pt-8">
      <BackLink href="/community?tab=people">Community</BackLink>

      <div className="relative mt-5 h-44 overflow-hidden rounded-[2rem] sm:h-60">
        <Image src={person.cover} alt="" fill preload sizes="(min-width: 1400px) 1400px, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-ink/60 to-transparent" />
      </div>

      <div className="relative flex flex-col gap-4 px-2 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="flex items-end gap-4">
          <span className="-mt-14 rounded-full ring-4 ring-ivory sm:-mt-16">
            <PersonAvatar person={person} size={120} />
          </span>
          <div className="pb-1">
            <h1 className="font-display text-3xl text-ink sm:text-4xl">{person.name}</h1>
            <p className="text-ink-mute">@{person.handle}</p>
          </div>
        </div>
        <div className="flex gap-2 pb-2">
          <ConnectButton person={person} />
          <MessageButton person={person} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14">
        <aside className="space-y-5">
          <p className="text-lg leading-relaxed text-ink-soft">{person.bio}</p>
          <ul className="space-y-2.5 text-sm text-ink-soft">
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 text-maroon" /> {person.city}, WA
            </li>
            <li className="flex items-center gap-2.5">
              <Languages className="size-4 text-maroon" /> {person.languages.join(", ")}
            </li>
            <li className="flex items-center gap-2.5">
              <CalendarDays className="size-4 text-maroon" /> {person.eventsAttended} events attended · On Milan since {person.joined}
            </li>
          </ul>
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-gold-deep uppercase">
              <Sparkles className="size-3.5" /> Interests
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {person.interests.map((i) => (
                <span key={i} className="rounded-full bg-ivory-200 px-3 py-1.5 text-sm text-ink-soft">
                  {i}
                </span>
              ))}
            </div>
          </div>
          <MutualFriends person={person} />
        </aside>

        <section>
          <h2 className="font-display text-3xl text-ink">Going to</h2>
          <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2">
            {going.map((e) => (
              <EventCard key={e.slug} event={e} sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" />
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

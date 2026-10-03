"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Heart, MessageCircle, Send, Star, Tag } from "lucide-react";
import { useState, type FormEvent } from "react";
import { feed, relativeTime, type FeedItem } from "@/data/community";
import { events, getEvent } from "@/data/events";
import { getOutfit } from "@/data/closet";
import { getVendor } from "@/data/vendors";
import { getPerson, people } from "@/data/people";
import { addPost, friendsGoing, isFriend, threadKeyFor, toggleLike, useSocial, type SocialState } from "@/lib/social";
import { useNow } from "@/lib/use-now";
import { useToday } from "@/lib/use-today";
import { cn, formatPrice, formatShortDate } from "@/lib/utils";
import { FaceStack, MeAvatar, PersonAvatar } from "@/components/social/Avatars";
import { ConnectButton } from "@/components/social/PeopleActions";
import { GoingPill } from "@/components/social/Rsvp";

type Entry = { key: string; minutesAgo: number; item: FeedItem | { type: "mine"; id: string; text: string; eventSlug?: string } };

export function Feed({ serverToday }: { serverToday: string }) {
  const s = useSocial();
  const today = useToday(serverToday);
  const now = useNow(30_000);

  const entries: Entry[] = [
    ...s.posts.map((p) => ({
      key: p.id,
      minutesAgo: Math.max(0, (now - new Date(p.at).getTime()) / 60_000),
      item: { type: "mine" as const, id: p.id, text: p.text, eventSlug: p.eventSlug },
    })),
    ...feed.map((f) => ({ key: f.id, minutesAgo: f.minutesAgo, item: f })),
  ].sort((a, b) => a.minutesAgo - b.minutesAgo);

  const upcomingWithFriends = events
    .filter((e) => e.date >= today && friendsGoing(s, e.slug).length > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);
  const suggestions = people.filter((p) => !isFriend(s, p)).sort((a, b) => b.mutuals - a.mutuals).slice(0, 4);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-4">
        <Composer state={s} today={today} />
        <AnimatePresence initial={false}>
          {entries.map((e) => (
            <motion.div key={e.key} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <FeedCard entry={e} state={s} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[1.5rem] border border-sand/80 bg-white/60 p-5">
          <p className="font-display text-xl text-ink">Your friends are going</p>
          <ul className="mt-4 space-y-4">
            {upcomingWithFriends.map((e) => {
              const f = friendsGoing(s, e.slug);
              return (
                <li key={e.slug}>
                  <Link href={`/events/${e.slug}`} className="group flex gap-3">
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                      <Image src={e.image} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink group-hover:text-maroon">{e.title}</span>
                      <span className="block text-xs text-ink-mute">{formatShortDate(e.date)}</span>
                      <span className="mt-1 flex items-center gap-1.5">
                        <FaceStack people={f} size={18} max={3} ringClass="ring-white" />
                        <span className="text-xs text-ink-soft">
                          {f[0].name.split(" ")[0]}
                          {f.length > 1 ? ` + ${f.length - 1}` : ""}
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="rounded-[1.5rem] border border-sand/80 bg-white/60 p-5">
          <p className="font-display text-xl text-ink">People you may know</p>
          <ul className="mt-4 space-y-3.5">
            {suggestions.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <Link href={`/people/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <PersonAvatar person={p} size={40} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">{p.name}</span>
                    <span className="block truncate text-xs text-ink-mute">{p.mutuals} mutual friends</span>
                  </span>
                </Link>
                <ConnectButton person={p} size="sm" />
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function Composer({ state, today }: { state: SocialState; today: string }) {
  const [text, setText] = useState("");
  const [eventSlug, setEventSlug] = useState("");
  const upcoming = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    addPost(text.trim(), eventSlug || undefined);
    setText("");
    setEventSlug("");
  }

  return (
    <form onSubmit={submit} className="rounded-[1.5rem] border border-sand/80 bg-white/70 p-4 shadow-card sm:p-5">
      <div className="flex gap-3">
        <MeAvatar me={state.me} size={44} />
        <label className="flex-1">
          <span className="sr-only">Share something</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder={state.me ? `What's happening, ${state.me.name.split(" ")[0]}?` : "Share something with the community…"}
            className="w-full resize-none rounded-2xl bg-ivory-100/80 px-4 py-3 text-[0.95rem] text-ink placeholder:text-ink-mute focus:ring-2 focus:ring-maroon/20 focus:outline-none"
          />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pl-14">
        <label className="relative inline-flex h-9 items-center gap-2 rounded-full border border-sand bg-white pr-3 pl-3 text-sm text-ink-soft">
          <Tag className="size-4" />
          <span className="sr-only">Tag an event</span>
          <select value={eventSlug} onChange={(e) => setEventSlug(e.target.value)} className="max-w-52 cursor-pointer appearance-none truncate bg-transparent focus:outline-none">
            <option value="">Tag an event</option>
            {upcoming.map((e) => (
              <option key={e.slug} value={e.slug}>
                {e.title}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-3">
          {!state.me && (
            <Link href="/profile" className="text-xs text-ink-mute hover:text-maroon">
              Posting as “You” — create a profile
            </Link>
          )}
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-maroon px-5 text-sm font-semibold text-ivory transition-all hover:bg-maroon-deep active:scale-95 disabled:opacity-40"
          >
            <Send className="size-4" /> Post
          </button>
        </div>
      </div>
    </form>
  );
}

function FeedCard({ entry, state }: { entry: Entry; state: SocialState }) {
  const it = entry.item;
  const mine = it.type === "mine";
  const person = !mine ? getPerson((it as FeedItem).personId) : undefined;
  const liked = !!state.likes[it.id];
  const baseLikes = mine ? 0 : (it as FeedItem).likes;
  const comments = it.type === "post" ? it.comments : 0;

  const action =
    it.type === "going" ? "is going to" : it.type === "rented" ? "rented from the Festive Closet" : it.type === "review" ? "left a review" : it.type === "post" || mine ? "posted" : "";

  return (
    <article className="rounded-[1.5rem] border border-sand/80 bg-white/70 p-4 sm:p-5">
      <header className="flex items-center gap-3">
        {mine ? (
          <MeAvatar me={state.me} size={44} />
        ) : person ? (
          <Link href={`/people/${person.id}`}>
            <PersonAvatar person={person} size={44} />
          </Link>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.95rem] text-ink-soft">
            {mine ? (
              <span className="font-semibold text-ink">{state.me?.name ?? "You"}</span>
            ) : (
              person && (
                <Link href={`/people/${person.id}`} className="font-semibold text-ink hover:text-maroon">
                  {person.name}
                </Link>
              )
            )}{" "}
            {action}
          </p>
          <p className="text-xs text-ink-mute">
            {relativeTime(entry.minutesAgo)} · {mine ? state.me?.city ?? "Seattle area" : person?.city}
            {person && isFriend(state, person) ? " · Friend" : ""}
          </p>
        </div>
      </header>

      {(it.type === "post" || mine) && <p className="mt-3 text-[0.98rem] leading-relaxed whitespace-pre-line text-ink">{it.text}</p>}
      {it.type === "review" && (
        <div className="mt-3">
          <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={cn("size-4", i < it.rating ? "fill-gold text-gold" : "text-sand-deep")} />
            ))}
          </span>
          <p className="mt-2 text-[0.98rem] leading-relaxed text-ink">{it.text}</p>
        </div>
      )}

      {(it.type === "going" || ((it.type === "post" || mine) && it.eventSlug)) && <EventAttachment slug={(it as { eventSlug: string }).eventSlug} />}
      {it.type === "rented" && <OutfitAttachment slug={it.outfitSlug} />}
      {it.type === "review" && <VendorAttachment slug={it.vendorSlug} />}

      <footer className="mt-4 flex items-center gap-1 border-t border-sand/70 pt-3 text-sm text-ink-mute">
        <button
          type="button"
          onClick={() => toggleLike(it.id)}
          aria-pressed={liked}
          className={cn("inline-flex h-9 items-center gap-1.5 rounded-full px-3 transition-colors hover:bg-maroon-soft/60", liked && "text-maroon")}
        >
          <Heart className={cn("size-4", liked && "fill-maroon")} /> {baseLikes + (liked ? 1 : 0)}
        </button>
        {comments > 0 && (
          <span className="inline-flex h-9 items-center gap-1.5 px-3">
            <MessageCircle className="size-4" /> {comments}
          </span>
        )}
        {person && (
          <Link
            href={`/community?tab=messages&thread=${threadKeyFor("dm", person.id)}`}
            className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-full px-3 font-medium text-ink-soft transition-colors hover:bg-ink/5 hover:text-maroon"
          >
            <Send className="size-4" /> Message
          </Link>
        )}
      </footer>
    </article>
  );
}

function EventAttachment({ slug }: { slug: string }) {
  const e = getEvent(slug);
  if (!e) return null;
  return (
    <Link href={`/events/${e.slug}`} className="group mt-3 flex items-center gap-3 overflow-hidden rounded-2xl border border-sand/80 bg-ivory-100/60 p-2.5 pr-3">
      <span className="relative size-16 shrink-0 overflow-hidden rounded-xl sm:size-20">
        <Image src={e.image} alt="" fill sizes="80px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gold-deep uppercase">
          <CalendarDays className="size-3.5" /> {formatShortDate(e.date)}
        </span>
        <span className="font-display mt-0.5 block truncate text-lg text-ink group-hover:text-maroon">{e.title}</span>
        <span className="block truncate text-xs text-ink-mute">
          {e.venue.name.split(" — ")[0]}, {e.city}
        </span>
      </span>
      <GoingPill event={e} />
    </Link>
  );
}

function OutfitAttachment({ slug }: { slug: string }) {
  const o = getOutfit(slug);
  if (!o) return null;
  return (
    <Link href={`/closet/${o.slug}`} className="group mt-3 flex items-center gap-3 overflow-hidden rounded-2xl border border-sand/80 bg-ivory-100/60 p-2.5 pr-3">
      <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl">
        <Image src={o.images[0]} alt="" fill sizes="64px" className="object-cover object-top" />
      </span>
      <span className="min-w-0">
        <span className="text-xs font-semibold tracking-wide text-gold-deep uppercase">{o.type}</span>
        <span className="font-display block truncate text-lg text-ink group-hover:text-maroon">{o.name}</span>
        <span className="block text-xs text-ink-mute">
          {o.rentPrice ? `Rent ${formatPrice(o.rentPrice)}` : ""}
          {o.rentPrice && o.buyPrice ? " · " : ""}
          {o.buyPrice ? `Buy ${formatPrice(o.buyPrice)}` : ""} · {o.owner.name}
        </span>
      </span>
    </Link>
  );
}

function VendorAttachment({ slug }: { slug: string }) {
  const v = getVendor(slug);
  if (!v) return null;
  return (
    <Link href={`/vendors/${v.slug}`} className="group mt-3 flex items-center gap-3 overflow-hidden rounded-2xl border border-sand/80 bg-ivory-100/60 p-2.5 pr-3">
      <span className="relative size-16 shrink-0 overflow-hidden rounded-xl">
        <Image src={v.image} alt="" fill sizes="64px" className="object-cover" />
      </span>
      <span className="min-w-0">
        <span className="text-xs font-semibold tracking-wide text-gold-deep uppercase">{v.category}</span>
        <span className="font-display block truncate text-lg text-ink group-hover:text-maroon">{v.name}</span>
        <span className="flex items-center gap-1 text-xs text-ink-mute">
          <Star className="size-3.5 fill-gold text-gold" /> {v.rating.toFixed(1)} · {v.city}
        </span>
      </span>
    </Link>
  );
}

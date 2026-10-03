"use client";

import Link from "next/link";
import { MessagesSquare, Users } from "lucide-react";
import { people } from "@/data/people";
import type { EventItem } from "@/data/events";
import { isFriend, joinChat, threadKeyFor, useSocial } from "@/lib/social";
import { formatCount } from "@/lib/utils";
import { MeAvatar, PersonAvatar } from "./Avatars";
import { ChatThread } from "./ChatThread";
import { ConnectButton, MessageButton } from "./PeopleActions";
import { useGoing } from "./Rsvp";

/** "Who's going" list for the event page: friends first, with connect and message actions. */
export function WhosGoing({ event }: { event: EventItem }) {
  const s = useSocial();
  const { status, count } = useGoing(event);
  const goers = people
    .filter((p) => p.going.includes(event.slug))
    .sort((a, b) => Number(isFriend(s, b)) - Number(isFriend(s, a)));
  const others = count - goers.length - (status === "going" ? 1 : 0);

  return (
    <section id="whos-going" className="mt-12 scroll-mt-28">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl text-ink">Who&apos;s going</h2>
        <p className="flex items-center gap-1.5 text-sm text-ink-mute">
          <Users className="size-4" /> {formatCount(count)} going
        </p>
      </div>
      <ul className="mt-5 divide-y divide-sand/70 overflow-hidden rounded-[1.75rem] border border-sand/80 bg-white/60">
        {status === "going" && (
          <li className="flex items-center gap-3 p-4">
            <MeAvatar me={s.me} size={44} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{s.me?.name ?? "You"}</p>
              <p className="text-sm text-ink-mute">That&apos;s you!</p>
            </div>
          </li>
        )}
        {goers.map((p) => {
          const friend = isFriend(s, p);
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-3 p-4">
              <Link href={`/people/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                <PersonAvatar person={p} size={44} />
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-ink hover:text-maroon">{p.name}</span>
                  <span className="block truncate text-sm text-ink-mute">
                    {friend ? "Friend" : `${p.mutuals} mutual friends`} · {p.city}
                  </span>
                </span>
              </Link>
              <div className="flex gap-2">
                {!friend && <ConnectButton person={p} size="sm" />}
                <MessageButton person={p} size="sm" />
              </div>
            </li>
          );
        })}
        {others > 0 && (
          <li className="p-4 text-center text-sm text-ink-mute">
            + {formatCount(others)} others from Seattle and the Eastside
          </li>
        )}
      </ul>
    </section>
  );
}

/** The event's group chat. Anyone can join to ask questions or find a carpool. */
export function EventChat({ event }: { event: EventItem }) {
  const s = useSocial();
  const key = threadKeyFor("event", event.slug);
  const joined = s.joinedChats.includes(event.slug);

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl text-ink">Event chat</h2>
        {joined && (
          <Link href={`/community?tab=messages&thread=${key}`} className="text-sm font-medium text-maroon hover:underline">
            Open in Messages
          </Link>
        )}
      </div>
      <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-sand/80 bg-ivory-100/70">
        {joined ? (
          <ChatThread threadKey={key} group placeholder="Ask about parking, carpools, what to wear…" heightClass="h-80" />
        ) : (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-maroon-soft text-maroon">
              <MessagesSquare className="size-6" />
            </span>
            <p className="font-display mt-4 text-2xl text-ink">Talk with people who are going</p>
            <p className="mt-1.5 max-w-sm text-sm text-ink-soft">Find a carpool, ask what to wear, or meet up at the door.</p>
            <button
              type="button"
              onClick={() => joinChat(event.slug)}
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-maroon px-6 font-medium text-ivory transition-all hover:bg-maroon-deep active:scale-95"
            >
              <MessagesSquare className="size-4" /> Join the chat
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

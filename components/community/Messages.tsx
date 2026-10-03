"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessagesSquare, PenSquare, Users } from "lucide-react";
import { useState } from "react";
import { getEvent } from "@/data/events";
import { getPerson, people } from "@/data/people";
import { relativeTime } from "@/data/community";
import { isFriend, messageTime, threadKeyFor, threadList, useSocial } from "@/lib/social";
import { useNow } from "@/lib/use-now";
import { cn, formatCount, formatShortDate } from "@/lib/utils";
import { PersonAvatar } from "@/components/social/Avatars";
import { ChatThread } from "@/components/social/ChatThread";

export function Messages({ thread, onSelect }: { thread: string | null; onSelect: (key: string | null) => void }) {
  const s = useSocial();
  const [picking, setPicking] = useState(false);
  const now = useNow(30_000);
  const threads = threadList(s);
  // A thread opened from a "Message" button may not have any messages yet.
  const list = thread && !threads.some((t) => t.key === thread) ? [{ key: thread, kind: thread.split(":")[0] as "dm" | "event", id: thread.split(":")[1], last: null, unread: false }, ...threads] : threads;
  const friends = people.filter((p) => isFriend(s, p));

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-[1.75rem] border border-sand/80 bg-white/70 shadow-card md:h-[38rem] md:grid-cols-[320px_minmax(0,1fr)]">
      <div className={cn("flex min-h-0 flex-col border-sand/80 md:border-r", thread && "hidden md:flex")}>
        <div className="flex items-center justify-between border-b border-sand/80 px-4 py-3">
          <p className="font-display text-xl text-ink">Messages</p>
          <button
            type="button"
            onClick={() => setPicking((v) => !v)}
            aria-expanded={picking}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-maroon hover:bg-maroon-soft"
          >
            <PenSquare className="size-4" /> New
          </button>
        </div>
        {picking && (
          <div className="border-b border-sand/80 bg-ivory-100/60 p-3">
            <p className="px-1 text-xs font-semibold tracking-wider text-ink-mute uppercase">Message a friend</p>
            <div className="no-scrollbar mt-2 flex gap-3 overflow-x-auto pb-1">
              {friends.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onSelect(threadKeyFor("dm", p.id));
                    setPicking(false);
                  }}
                  className="flex w-16 shrink-0 flex-col items-center gap-1 text-center"
                >
                  <PersonAvatar person={p} size={44} />
                  <span className="w-full truncate text-xs text-ink-soft">{p.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {list.length === 0 && (
            <li className="px-6 py-12 text-center text-sm text-ink-mute">No conversations yet. Join an event chat or message a friend.</li>
          )}
          {list.map((t) => {
            const person = t.kind === "dm" ? getPerson(t.id) : undefined;
            const event = t.kind === "event" ? getEvent(t.id) : undefined;
            const name = person?.name ?? event?.title ?? "Conversation";
            const from = t.last && t.last.from !== "me" ? getPerson(t.last.from) : undefined;
            const preview = t.last ? `${t.last.from === "me" ? "You: " : t.kind === "event" && from ? `${from.name.split(" ")[0]}: ` : ""}${t.last.text}` : "Start the conversation";
            const minutes = t.last ? (now - messageTime(t.last)) / 60_000 : 0;
            return (
              <li key={t.key}>
                <button
                  type="button"
                  onClick={() => onSelect(t.key)}
                  className={cn("flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-ivory-100", thread === t.key && "bg-maroon-soft/50")}
                >
                  {person ? (
                    <PersonAvatar person={person} size={44} />
                  ) : event ? (
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-xl">
                      <Image src={event.image} alt="" fill sizes="44px" className="object-cover" />
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={cn("truncate text-sm text-ink", t.unread ? "font-bold" : "font-semibold")}>{name}</span>
                      {t.last && <span className="shrink-0 text-[0.68rem] text-ink-mute">{relativeTime(minutes)}</span>}
                    </span>
                    <span className={cn("block truncate text-sm", t.unread ? "font-medium text-ink" : "text-ink-mute")}>{preview}</span>
                  </span>
                  {t.unread && <span className="size-2.5 shrink-0 rounded-full bg-maroon" aria-label="Unread" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={cn("flex min-h-0 flex-col", !thread && "hidden md:flex")}>
        {thread ? <ThreadPane key={thread} threadKey={thread} onBack={() => onSelect(null)} /> : (
          <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-maroon-soft text-maroon">
              <MessagesSquare className="size-6" />
            </span>
            <p className="font-display mt-4 text-2xl text-ink">Your conversations</p>
            <p className="mt-1.5 max-w-xs text-sm text-ink-mute">Pick a chat on the left, or start a new one with a friend.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ThreadPane({ threadKey, onBack }: { threadKey: string; onBack: () => void }) {
  const [kind, id] = threadKey.split(":");
  const person = kind === "dm" ? getPerson(id) : undefined;
  const event = kind === "event" ? getEvent(id) : undefined;
  const s = useSocial();
  const notConnected = person && !isFriend(s, person);

  return (
    <>
      <div className="flex items-center gap-3 border-b border-sand/80 px-4 py-3">
        <button type="button" onClick={onBack} aria-label="Back to conversations" className="grid size-9 place-items-center rounded-full hover:bg-ink/5 md:hidden">
          <ArrowLeft className="size-5" />
        </button>
        {person && (
          <Link href={`/people/${person.id}`} className="flex min-w-0 items-center gap-3">
            <PersonAvatar person={person} size={40} />
            <span className="min-w-0">
              <span className="block truncate font-semibold text-ink hover:text-maroon">{person.name}</span>
              <span className="block truncate text-xs text-ink-mute">
                @{person.handle} · {person.city}
              </span>
            </span>
          </Link>
        )}
        {event && (
          <Link href={`/events/${event.slug}`} className="flex min-w-0 items-center gap-3">
            <span className="relative size-10 shrink-0 overflow-hidden rounded-xl">
              <Image src={event.image} alt="" fill sizes="40px" className="object-cover" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold text-ink hover:text-maroon">{event.title}</span>
              <span className="flex items-center gap-1 text-xs text-ink-mute">
                <Users className="size-3" /> Event chat · {formatCount(event.attending)} going · {formatShortDate(event.date)}
              </span>
            </span>
          </Link>
        )}
      </div>
      {notConnected && (
        <p className="border-b border-sand/60 bg-saffron-soft/60 px-4 py-2 text-xs text-gold-deep">
          You&apos;re not connected with {person.name.split(" ")[0]} yet — your message will arrive as a request.
        </p>
      )}
      <ChatThread threadKey={threadKey} group={kind === "event"} className="min-h-0 flex-1" heightClass="h-[26rem] md:h-auto md:min-h-0" />
    </>
  );
}

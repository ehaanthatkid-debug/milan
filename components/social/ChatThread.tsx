"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { getPerson } from "@/data/people";
import { relativeTime, type ChatMessage } from "@/data/community";
import { markRead, sendMessage, threadMessages, useSocial } from "@/lib/social";
import { cn } from "@/lib/utils";
import { MeAvatar, PersonAvatar } from "./Avatars";

function stamp(m: ChatMessage) {
  if (m.at) return new Date(m.at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return relativeTime(m.minutesAgo ?? 0);
}

/** A message thread with a composer. Group threads show each sender's name. */
export function ChatThread({
  threadKey,
  group = false,
  placeholder = "Write a message…",
  className,
  heightClass = "h-[22rem]",
}: {
  threadKey: string;
  group?: boolean;
  placeholder?: string;
  className?: string;
  heightClass?: string;
}) {
  const s = useSocial();
  const messages = threadMessages(s, threadKey);
  const typingId = s.typing[threadKey];
  const typingPerson = typingId ? getPerson(typingId) : undefined;
  const [text, setText] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
    markRead(threadKey);
  }, [messages.length, typingId, threadKey]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    sendMessage(threadKey, t);
    setText("");
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div ref={scroller} className={cn("flex-1 space-y-3 overflow-y-auto px-4 py-4", heightClass)} aria-live="polite">
        {messages.length === 0 && <p className="py-10 text-center text-sm text-ink-mute">No messages yet — say hello!</p>}
        {messages.map((m, i) => {
          const mine = m.from === "me";
          const person = mine ? undefined : getPerson(m.from);
          const showName = group && !mine && messages[i - 1]?.from !== m.from;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex items-end gap-2", mine && "flex-row-reverse")}
            >
              {mine ? (
                <MeAvatar me={s.me} size={28} />
              ) : person ? (
                <Link href={`/people/${person.id}`} aria-label={person.name}>
                  <PersonAvatar person={person} size={28} />
                </Link>
              ) : null}
              <div className={cn("max-w-[78%]", mine && "text-right")}>
                {showName && person && <p className="mb-0.5 px-1 text-xs font-medium text-ink-mute">{person.name}</p>}
                <p
                  className={cn(
                    "inline-block rounded-2xl px-3.5 py-2 text-left text-[0.92rem] leading-relaxed",
                    mine ? "rounded-br-md bg-maroon text-ivory" : "rounded-bl-md bg-white text-ink ring-1 ring-sand/70",
                  )}
                >
                  {m.text}
                </p>
                <p className="mt-0.5 px-1 text-[0.68rem] text-ink-mute">{stamp(m)}</p>
              </div>
            </motion.div>
          );
        })}
        <AnimatePresence>
          {typingPerson && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-end gap-2">
              <PersonAvatar person={typingPerson} size={28} />
              <span className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-3.5 py-3 ring-1 ring-sand/70" aria-label={`${typingPerson.name} is typing`}>
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="size-1.5 rounded-full bg-ink-mute"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                  />
                ))}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-sand/80 bg-white/70 p-3">
        <label className="flex-1">
          <span className="sr-only">Message</span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="h-11 w-full rounded-full border border-sand bg-white px-4 text-[0.95rem] text-ink placeholder:text-ink-mute focus:border-maroon/40 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Send"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-maroon text-ivory transition-all hover:bg-maroon-deep active:scale-95 disabled:opacity-40"
        >
          <SendHorizontal className="size-5" />
        </button>
      </form>
    </div>
  );
}

"use client";

import { useSyncExternalStore } from "react";
import { people, getPerson, type Person } from "@/data/people";
import { dmSeeds, eventChatSeed, EVENT_CHAT_REPLIES, type ChatMessage } from "@/data/community";
import type { City } from "@/data/shared";

/**
 * The visitor's social activity — RSVPs, connections, messages, likes, posts,
 * and saved items — kept in this browser's localStorage. Other members'
 * activity is seeded sample data; replies to your messages are simulated.
 * In production this would be a real-time backend.
 */

export type RsvpStatus = "going" | "interested";
export type SavedKind = "event" | "outfit" | "vendor";

export type MyProfile = {
  name: string;
  handle: string;
  city: City;
  bio: string;
  interests: string[];
  /** A small data-URL photo, or null to show initials. */
  photo: string | null;
  createdAt: string;
};

export type UserPost = { id: string; text: string; eventSlug?: string; at: string };

export type SocialState = {
  me: MyProfile | null;
  rsvps: Record<string, RsvpStatus>;
  connections: Record<string, "pending" | "connected" | "removed">;
  messages: Record<string, ChatMessage[]>;
  readAt: Record<string, string>;
  joinedChats: string[];
  likes: Record<string, boolean>;
  posts: UserPost[];
  saved: Record<SavedKind, string[]>;
  /** Not saved: who is currently "typing" in each thread. */
  typing: Record<string, string>;
};

const KEY = "milan.social.v1";
const CHANGE = "milan-social-change";

const DEFAULT: SocialState = {
  me: null,
  rsvps: {},
  connections: {},
  messages: {},
  readAt: {},
  joinedChats: [],
  likes: {},
  posts: [],
  saved: { event: [], outfit: [], vendor: [] },
  typing: {},
};

let state: SocialState | null = null;

function load(): SocialState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT, ...(JSON.parse(raw) as Partial<SocialState>), typing: {} };
  } catch {
    // Storage unavailable or corrupted — start fresh.
  }
  return DEFAULT;
}

function getSnapshot() {
  if (!state) state = load();
  return state;
}

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = load();
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE, onChange);
  };
}

function update(fn: (s: SocialState) => SocialState) {
  state = fn(getSnapshot());
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { typing, ...persist } = state;
    window.localStorage.setItem(KEY, JSON.stringify(persist));
  } catch {
    // Keep working in memory if storage is blocked.
  }
  window.dispatchEvent(new Event(CHANGE));
}

export function useSocial() {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT);
}

/* ---------- Selectors ---------- */

export function connectionStatus(s: SocialState, p: Person): "connected" | "pending" | "none" {
  const c = s.connections[p.id];
  if (c === "connected" || c === "pending") return c;
  if (c === "removed") return "none";
  return p.connected ? "connected" : "none";
}

export const isFriend = (s: SocialState, p: Person) => connectionStatus(s, p) === "connected";

export function friendsGoing(s: SocialState, slug: string) {
  return people.filter((p) => p.going.includes(slug) && isFriend(s, p));
}

export function threadKeyFor(kind: "dm" | "event", id: string) {
  return `${kind}:${id}`;
}

export function threadMessages(s: SocialState, key: string): ChatMessage[] {
  const [kind, id] = key.split(":");
  const seed = kind === "dm" ? (dmSeeds[id] ?? []) : eventChatSeed(id);
  return [...seed, ...(s.messages[key] ?? [])];
}

export type ThreadSummary = { key: string; kind: "dm" | "event"; id: string; last: ChatMessage | null; unread: boolean };

export function threadList(s: SocialState): ThreadSummary[] {
  const keys = new Set<string>();
  Object.keys(dmSeeds).forEach((id) => {
    const p = getPerson(id);
    if (p && isFriend(s, p)) keys.add(threadKeyFor("dm", id));
  });
  Object.keys(s.messages).forEach((k) => keys.add(k));
  s.joinedChats.forEach((slug) => keys.add(threadKeyFor("event", slug)));
  return [...keys]
    .map((key) => {
      const [kind, id] = key.split(":") as ["dm" | "event", string];
      const msgs = threadMessages(s, key);
      const last = msgs[msgs.length - 1] ?? null;
      const read = s.readAt[key];
      const unread = !!last && last.from !== "me" && (!read || (last.at ? last.at > read : false));
      return { key, kind, id, last, unread };
    })
    .sort((a, b) => messageTime(b.last) - messageTime(a.last));
}

export function messageTime(m: ChatMessage | null) {
  if (!m) return 0;
  if (m.at) return new Date(m.at).getTime();
  return Date.now() - (m.minutesAgo ?? 0) * 60_000;
}

export function unreadCount(s: SocialState) {
  return threadList(s).filter((t) => t.unread).length;
}

export function isSaved(s: SocialState, kind: SavedKind, id: string) {
  return s.saved[kind].includes(id);
}

export function myName(s: SocialState) {
  return s.me?.name ?? "You";
}

/* ---------- Actions ---------- */

export function setRsvp(slug: string, status: RsvpStatus | null) {
  update((s) => {
    const rsvps = { ...s.rsvps };
    if (status) rsvps[slug] = status;
    else delete rsvps[slug];
    return { ...s, rsvps };
  });
}

/** Sends a connection request; the demo accepts it after a moment. */
export function connect(personId: string) {
  update((s) => ({ ...s, connections: { ...s.connections, [personId]: "pending" } }));
  setTimeout(() => {
    if (getSnapshot().connections[personId] === "pending") {
      update((s) => ({ ...s, connections: { ...s.connections, [personId]: "connected" } }));
    }
  }, 2200);
}

export function removeConnection(personId: string) {
  update((s) => ({ ...s, connections: { ...s.connections, [personId]: "removed" } }));
}

function setTyping(key: string, who: string | null) {
  update((s) => {
    const typing = { ...s.typing };
    if (who) typing[key] = who;
    else delete typing[key];
    return { ...s, typing };
  });
}

function appendMessage(key: string, msg: ChatMessage) {
  update((s) => ({ ...s, messages: { ...s.messages, [key]: [...(s.messages[key] ?? []), msg] } }));
}

/** Sends your message, then simulates the other person typing and replying. */
export function sendMessage(key: string, text: string) {
  const at = new Date().toISOString();
  appendMessage(key, { id: `m-${Date.now()}`, from: "me", text, at });
  update((s) => ({ ...s, readAt: { ...s.readAt, [key]: at } }));

  const [kind, id] = key.split(":");
  const existing = getSnapshot().messages[key] ?? [];
  let replier: string | undefined;
  let reply: string | undefined;
  if (kind === "dm") {
    const person = getPerson(id);
    if (!person) return;
    const n = existing.filter((m) => m.from === id).length;
    replier = id;
    reply = person.replies[n % person.replies.length];
  } else {
    const goers = people.filter((p) => p.going.includes(id));
    if (!goers.length) return;
    const n = existing.filter((m) => m.from !== "me").length;
    replier = goers[n % goers.length].id;
    reply = EVENT_CHAT_REPLIES[n % EVENT_CHAT_REPLIES.length];
  }
  setTimeout(() => setTyping(key, replier!), 700);
  setTimeout(() => {
    setTyping(key, null);
    appendMessage(key, { id: `m-${Date.now()}`, from: replier!, text: reply!, at: new Date().toISOString() });
  }, 2300);
}

export function markRead(key: string) {
  update((s) => ({ ...s, readAt: { ...s.readAt, [key]: new Date().toISOString() } }));
}

export function joinChat(slug: string) {
  update((s) => (s.joinedChats.includes(slug) ? s : { ...s, joinedChats: [...s.joinedChats, slug] }));
}

export function toggleLike(itemId: string) {
  update((s) => ({ ...s, likes: { ...s.likes, [itemId]: !s.likes[itemId] } }));
}

export function addPost(text: string, eventSlug?: string) {
  update((s) => ({ ...s, posts: [{ id: `p-${Date.now()}`, text, eventSlug, at: new Date().toISOString() }, ...s.posts] }));
}

export function toggleSaved(kind: SavedKind, id: string) {
  update((s) => {
    const list = s.saved[kind];
    return { ...s, saved: { ...s.saved, [kind]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] } };
  });
}

export function saveMyProfile(me: MyProfile) {
  update((s) => ({ ...s, me }));
}

export function resetSocial() {
  update(() => DEFAULT);
}

import { getEvent } from "./events";
import { people } from "./people";
import { formatTime } from "@/lib/utils";

export type FeedItem =
  | { id: string; type: "going"; personId: string; eventSlug: string; minutesAgo: number; likes: number }
  | { id: string; type: "post"; personId: string; text: string; eventSlug?: string; minutesAgo: number; likes: number; comments: number }
  | { id: string; type: "rented"; personId: string; outfitSlug: string; minutesAgo: number; likes: number }
  | { id: string; type: "review"; personId: string; vendorSlug: string; rating: number; text: string; minutesAgo: number; likes: number };

/** Seeded community activity shown on the Community page. */
export const feed: FeedItem[] = [
  { id: "f1", type: "going", personId: "priya-sharma", eventSlug: "eastside-navratri-garba-raas", minutesAgo: 12, likes: 24 },
  {
    id: "f2",
    type: "post",
    personId: "sana-malik",
    text: "Who else got tickets for the qawwali night in Kirkland? Thinking of doing dinner downtown before — Bulleh Shah live is going to be something else.",
    eventSlug: "qawwali-night-kirkland",
    minutesAgo: 38,
    likes: 41,
    comments: 9,
  },
  { id: "f3", type: "rented", personId: "rohan-desai", outfitSlug: "kutchi-mirror-chaniya-choli", minutesAgo: 75, likes: 12 },
  {
    id: "f4",
    type: "review",
    personId: "dev-parikh",
    vendorSlug: "marigold-and-mandap",
    rating: 5,
    text: "Rhea's team built our client's mandap in under three hours and it looked exactly like the render. Booking them again for spring.",
    minutesAgo: 140,
    likes: 33,
  },
  {
    id: "f5",
    type: "post",
    personId: "rohan-desai",
    text: "New to Seattle (moved from Mumbai last month). Going to my first garba here on Saturday — any tips for a first-timer? Happy to meet people!",
    eventSlug: "raas-rave-seattle",
    minutesAgo: 190,
    likes: 58,
    comments: 23,
  },
  { id: "f6", type: "going", personId: "harpreet-gill", eventSlug: "emerald-city-bhangra-invitational", minutesAgo: 260, likes: 17 },
  {
    id: "f7",
    type: "post",
    personId: "farhan-siddiqui",
    text: "Planning for the Eid al-Fitr Festival is officially underway. We're looking for 40 volunteers for the kids' carnival and food hall — message me if you can help for a few hours.",
    eventSlug: "eid-al-fitr-festival",
    minutesAgo: 420,
    likes: 86,
    comments: 14,
  },
  { id: "f8", type: "going", personId: "ananya-ghosh", eventSlug: "seattle-center-diwali-mela", minutesAgo: 600, likes: 9 },
  {
    id: "f9",
    type: "review",
    personId: "nadia-chaudhry",
    vendorSlug: "henna-by-noor",
    rating: 5,
    text: "Third year getting Chand Raat mehndi from Noor. Darkest stain every time and she remembered my design from last year.",
    minutesAgo: 900,
    likes: 27,
  },
  { id: "f10", type: "rented", personId: "zara-hussain", outfitSlug: "rani-pink-gharara-set", minutesAgo: 1300, likes: 31 },
  {
    id: "f11",
    type: "post",
    personId: "gurdeep-singh",
    text: "Langar planning for Vaisakhi has started — last year we served 2,000 people by the lake. Everyone is welcome to eat, and everyone is welcome to help cook.",
    eventSlug: "vaisakhi-mela",
    minutesAgo: 2000,
    likes: 64,
    comments: 11,
  },
  { id: "f12", type: "going", personId: "nikhil-joseph", eventSlug: "kerala-christmas-carol-night", minutesAgo: 2600, likes: 8 },
];

export type ChatMessage = {
  id: string;
  /** A person id, or "me" for the visitor. */
  from: string;
  text: string;
  /** ISO time for messages sent in the demo; seeded messages use minutesAgo instead. */
  at?: string;
  minutesAgo?: number;
};

/** Conversations that already exist with your connections when the demo opens. */
export const dmSeeds: Record<string, ChatMessage[]> = {
  "priya-sharma": [
    { id: "d1", from: "priya-sharma", text: "Are you coming to the Navratri night at Meydenbauer on the 17th?", minutesAgo: 95 },
    { id: "d2", from: "priya-sharma", text: "A bunch of us are going — we'd love to have you.", minutesAgo: 94 },
  ],
  "arjun-mehta": [
    { id: "d3", from: "me", text: "Did you end up getting bhangra comp tickets?", minutesAgo: 1500 },
    { id: "d4", from: "arjun-mehta", text: "Front orchestra! UW's team is supposedly bringing a whole new set.", minutesAgo: 1490 },
  ],
};

const CHAT_LINES = [
  (e: string) => `Anyone carpooling to ${e}? I can take three from the Eastside.`,
  () => "First time going — what should I wear?",
  (_e: string, time: string) => `Doors open around ${time}. See you all there!`,
  (_e: string, _t: string, venue: string) => `Is parking easy at ${venue}, or should we take the bus?`,
  () => "Bringing my parents this year, they're so excited.",
  () => "Does anyone know if there's a coat check?",
];

/** Seeded group chat for an event, posted by people who are going. */
export function eventChatSeed(slug: string): ChatMessage[] {
  const event = getEvent(slug);
  if (!event) return [];
  const goers = people.filter((p) => p.going.includes(slug)).slice(0, 4);
  const offset = slug.length % CHAT_LINES.length;
  const venue = event.venue.name.split(" — ")[0];
  return goers.map((p, i) => ({
    id: `${slug}-seed-${i}`,
    from: p.id,
    text: CHAT_LINES[(offset + i) % CHAT_LINES.length](event.title, formatTime(event.startTime), venue),
    minutesAgo: 600 - i * 130,
  }));
}

export const EVENT_CHAT_REPLIES = [
  "Same here! Let's find each other there.",
  "Good question — I'd get there early, it fills up fast.",
  "Ooh I'm in. Which entrance?",
  "Last year was amazing, you'll love it.",
];

export function relativeTime(minutes: number) {
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${Math.round(minutes)}m`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h`;
  const days = Math.round(minutes / (60 * 24));
  return days === 1 ? "Yesterday" : `${days}d`;
}

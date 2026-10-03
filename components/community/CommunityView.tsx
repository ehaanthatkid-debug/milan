"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MessageCircle, Newspaper, UsersRound } from "lucide-react";
import { unreadCount, useSocial } from "@/lib/social";
import { cn } from "@/lib/utils";
import { Feed } from "./Feed";
import { Messages } from "./Messages";
import { PeopleDirectory } from "./PeopleDirectory";

type Tab = "feed" | "people" | "messages";

export function CommunityView({ serverToday }: { serverToday: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const s = useSocial();
  const tab: Tab = sp.get("tab") === "people" ? "people" : sp.get("tab") === "messages" ? "messages" : "feed";
  const thread = sp.get("thread");
  const unread = unreadCount(s);

  function go(next: Tab, nextThread?: string | null) {
    const params = new URLSearchParams();
    if (next !== "feed") params.set("tab", next);
    if (nextThread) params.set("thread", nextThread);
    router.replace(`/community${params.size ? `?${params}` : ""}`, { scroll: false });
  }

  const tabs: { id: Tab; label: string; icon: typeof Newspaper; badge?: number }[] = [
    { id: "feed", label: "Feed", icon: Newspaper },
    { id: "people", label: "People", icon: UsersRound },
    { id: "messages", label: "Messages", icon: MessageCircle, badge: unread },
  ];

  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
      <div className="sticky top-16 z-30 -mx-4 mb-6 border-b border-sand/70 bg-ivory/90 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:top-20 lg:-mx-8 lg:px-8">
        <nav className="flex gap-1" aria-label="Community sections">
          {tabs.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              type="button"
              onClick={() => go(id)}
              aria-current={tab === id ? "page" : undefined}
              className={cn("relative inline-flex h-12 items-center gap-2 px-4 text-sm font-medium transition-colors", tab === id ? "text-maroon" : "text-ink-soft hover:text-ink")}
            >
              <Icon className="size-4" /> {label}
              {!!badge && <span className="grid min-w-5 place-items-center rounded-full bg-maroon px-1 text-[0.65rem] leading-5 font-bold text-ivory">{badge}</span>}
              {tab === id && <motion.span layoutId="community-tab" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-maroon" />}
            </button>
          ))}
        </nav>
      </div>

      {tab === "feed" && <Feed serverToday={serverToday} />}
      {tab === "people" && <PeopleDirectory />}
      {tab === "messages" && <Messages thread={thread} onSelect={(key) => go("messages", key)} />}
    </section>
  );
}

"use client";

import Link from "next/link";
import { Clock, MessageCircle, UserCheck, UserPlus } from "lucide-react";
import type { Person } from "@/data/people";
import { connect, connectionStatus, threadKeyFor, useSocial } from "@/lib/social";
import { cn } from "@/lib/utils";

export function ConnectButton({ person, size = "md", className }: { person: Person; size?: "sm" | "md"; className?: string }) {
  const s = useSocial();
  const status = connectionStatus(s, person);
  const base = cn(
    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full font-medium transition-all active:scale-95",
    size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm",
    className,
  );
  if (status === "connected") {
    return (
      <span className={cn(base, "bg-leaf-soft text-leaf")}>
        <UserCheck className="size-4" /> Connected
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className={cn(base, "border border-sand bg-white text-ink-mute")}>
        <Clock className="size-4" /> Requested
      </span>
    );
  }
  return (
    <button type="button" onClick={() => connect(person.id)} className={cn(base, "bg-ink text-ivory hover:bg-maroon-ink")}>
      <UserPlus className="size-4" /> Connect
    </button>
  );
}

export function MessageButton({ person, size = "md", className }: { person: Person; size?: "sm" | "md"; className?: string }) {
  return (
    <Link
      href={`/community?tab=messages&thread=${threadKeyFor("dm", person.id)}`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-sand bg-white font-medium text-ink transition-all hover:border-maroon/30 hover:text-maroon active:scale-95",
        size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm",
        className,
      )}
    >
      <MessageCircle className="size-4" /> Message
    </Link>
  );
}

"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Plus, Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-maroon"
    >
      <span className="grid size-8 place-items-center rounded-full border border-sand transition-all group-hover:-translate-x-0.5 group-hover:border-maroon/30">
        <ArrowLeft className="size-4" />
      </span>
      {children}
    </Link>
  );
}

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Fall through to copying the link if the share sheet is dismissed or unavailable.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard can be blocked; the confirmation still reassures in a demo.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={share}
      className="relative inline-flex h-10 items-center gap-2 rounded-full border border-sand bg-white/60 px-4 text-sm font-medium text-ink transition-colors hover:border-maroon/30 hover:bg-white active:scale-[0.97]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="c" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center gap-2 text-leaf">
            <Check className="size-4" /> Link copied
          </motion.span>
        ) : (
          <motion.span key="s" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center gap-2">
            <Share2 className="size-4" /> Share
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function FollowButton({ followers }: { followers: number }) {
  const [following, setFollowing] = useState(false);
  const count = followers + (following ? 1 : 0);
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setFollowing((f) => !f)}
        aria-pressed={following}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-all active:scale-[0.97]",
          following ? "border border-sand bg-white text-ink" : "bg-ink text-ivory hover:bg-maroon-ink",
        )}
      >
        {following ? <Check className="size-4" /> : <Plus className="size-4" />}
        {following ? "Following" : "Follow"}
      </button>
      <span className="text-sm text-ink-mute">{count.toLocaleString()} followers</span>
    </div>
  );
}

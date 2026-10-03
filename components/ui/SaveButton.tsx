"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { isSaved, toggleSaved, useSocial, type SavedKind } from "@/lib/social";
import { cn } from "@/lib/utils";

/** Heart button that saves an event, outfit, or vendor to your profile. Safe to place inside a link. */
export function SaveButton({ label, item, className }: { label: string; item: { kind: SavedKind; id: string }; className?: string }) {
  const s = useSocial();
  const saved = isSaved(s, item.kind, item.id);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${label} from saved` : `Save ${label}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(item.kind, item.id);
      }}
      className={cn(
        "relative grid size-10 place-items-center rounded-full bg-ivory/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-white active:scale-90",
        className,
      )}
    >
      <motion.span
        key={saved ? "on" : "off"}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <Heart className={cn("size-[18px]", saved ? "fill-maroon text-maroon" : "text-ink")} strokeWidth={1.8} />
      </motion.span>
      <AnimatePresence>
        {saved && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-maroon/40"
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 1.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </button>
  );
}

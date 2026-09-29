"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Main photo with thumbnails; swipe or use arrows to move between photos. */
export function Gallery({
  images,
  alt,
  aspect = "aspect-[4/5]",
  sizes = "(min-width: 1024px) 640px, 100vw",
}: {
  images: string[];
  alt: string;
  aspect?: string;
  sizes?: string;
}) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  function go(next: number) {
    setDir(next > index ? 1 : -1);
    setIndex((next + images.length) % images.length);
  }

  return (
    <div>
      <div className={cn("relative overflow-hidden rounded-[1.75rem] bg-ivory-200 shadow-card", aspect)}>
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04, x: dir * 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -30 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            drag={images.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(index + 1);
              else if (info.offset.x > 60) go(index - 1);
            }}
          >
            <Image
              src={images[index]}
              alt={`${alt} — photo ${index + 1} of ${images.length}`}
              fill
              preload={index === 0}
              sizes={sizes}
              className="pointer-events-none object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(index - 1)}
              className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-ink shadow-sm backdrop-blur transition hover:bg-white active:scale-95"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(index + 1)}
              className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-ink shadow-sm backdrop-blur transition hover:bg-white active:scale-95"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="absolute right-3 bottom-3 rounded-full bg-maroon-ink/55 px-3 py-1 text-xs font-medium text-ivory backdrop-blur">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "relative aspect-square w-16 overflow-hidden rounded-2xl transition-all sm:w-20",
                i === index ? "ring-2 ring-maroon ring-offset-2 ring-offset-ivory" : "opacity-70 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

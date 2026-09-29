"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Horizontal, snap-scrolling row of cards. Swipe on touch screens;
 * arrow buttons appear on larger screens.
 */
export function Rail({
  children,
  className,
  itemClassName,
  label,
}: {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, children.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-6 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:gap-6 lg:scroll-px-8 lg:px-8"
      >
        {children.map((child, i) => (
          <div key={i} className={cn("shrink-0 snap-start", itemClassName)}>
            {child}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute -top-16 right-0 hidden gap-2 md:flex">
        <RailButton label="Scroll left" disabled={atStart} onClick={() => scrollBy(-1)}>
          <ChevronLeft className="size-5" />
        </RailButton>
        <RailButton label="Scroll right" disabled={atEnd} onClick={() => scrollBy(1)}>
          <ChevronRight className="size-5" />
        </RailButton>
      </div>
    </div>
  );
}

function RailButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: ReactNode;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="pointer-events-auto grid size-11 place-items-center rounded-full border border-ink/10 bg-white/70 text-ink shadow-sm backdrop-blur transition-all duration-300 hover:border-maroon/30 hover:bg-white hover:text-maroon active:scale-95 disabled:cursor-default disabled:opacity-35 disabled:hover:border-ink/10 disabled:hover:text-ink"
    >
      {children}
    </button>
  );
}

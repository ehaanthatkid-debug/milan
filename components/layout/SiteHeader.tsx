"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Search, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { useOrders } from "@/lib/orders";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isActive } from "./nav-items";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const orderCount = useOrders().length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500 print:hidden",
        scrolled ? "border-b border-sand/70 bg-ivory/85 backdrop-blur-xl" : "border-b border-transparent bg-ivory",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.filter((i) => i.href !== "/").map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors",
                  active ? "text-maroon" : "text-ink-soft hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-maroon-soft"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-sand px-3 py-1.5 text-sm text-ink-soft xl:inline-flex">
            <MapPin className="size-3.5 text-maroon" />
            Seattle &amp; Eastside
          </span>
          <Link
            href="/events"
            aria-label="Search events"
            className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
          >
            <Search className="size-5" />
          </Link>
          <Link
            href="/bookings"
            aria-label={orderCount ? `My bookings (${orderCount})` : "My bookings"}
            className={cn(
              "relative grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5",
              isActive(pathname, "/bookings") && "bg-maroon-soft text-maroon",
            )}
          >
            <Ticket className="size-5" />
            {orderCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-maroon px-1 text-[0.65rem] leading-5 font-bold text-ivory ring-2 ring-ivory">
                {orderCount}
              </span>
            )}
          </Link>
          <ButtonLink href="/about#partners" size="sm" className="hidden lg:inline-flex">
            List with Milan
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

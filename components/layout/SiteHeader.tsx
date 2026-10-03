"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Menu, MessageCircle, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { MeAvatar } from "@/components/social/Avatars";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND } from "@/lib/brand";
import { unreadCount, useSocial } from "@/lib/social";
import { cn } from "@/lib/utils";
import { DESKTOP_NAV, MENU_NAV, isActive } from "./nav-items";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const s = useSocial();
  const unread = unreadCount(s);

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
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {DESKTOP_NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors xl:px-4",
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

        <div className="flex items-center gap-1.5">
          <span className="hidden items-center gap-1.5 rounded-full border border-sand px-3 py-1.5 text-sm text-ink-soft 2xl:inline-flex">
            <MapPin className="size-3.5 text-maroon" />
            Seattle &amp; Eastside
          </span>
          <Link href="/events" aria-label="Search events" className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5">
            <Search className="size-5" />
          </Link>
          <Link
            href="/community?tab=messages"
            aria-label={unread ? `Messages (${unread} unread)` : "Messages"}
            className="relative hidden size-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 sm:grid"
          >
            <MessageCircle className="size-5" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-maroon px-1 text-[0.65rem] leading-5 font-bold text-ivory ring-2 ring-ivory">
                {unread}
              </span>
            )}
          </Link>
          <Link
            href="/profile"
            aria-label="Your profile and orders"
            className={cn(
              "hidden rounded-full ring-2 ring-transparent transition-all hover:ring-maroon/30 lg:block",
              isActive(pathname, "/profile") && "ring-maroon",
            )}
          >
            <MeAvatar me={s.me} size={36} />
          </Link>
          <ButtonLink href="/about#partners" size="sm" className="ml-1.5 hidden xl:inline-flex">
            List with {BRAND.name}
          </ButtonLink>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="grid size-10 place-items-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.nav
              aria-label="Menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-y-0 right-0 flex w-[min(20rem,85vw)] flex-col bg-ivory p-5 shadow-float"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="grid size-10 place-items-center rounded-full hover:bg-ink/5">
                  <X className="size-5" />
                </button>
              </div>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="mt-6 flex items-center gap-3 rounded-2xl bg-white/70 p-3 ring-1 ring-sand/70"
              >
                <MeAvatar me={s.me} size={44} />
                <span>
                  <span className="block font-semibold text-ink">{s.me?.name ?? "Create your profile"}</span>
                  <span className="block text-sm text-ink-mute">Orders, tickets & saved</span>
                </span>
              </Link>
              <ul className="mt-4 space-y-1">
                {MENU_NAV.filter((i) => i.href !== "/profile").map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex h-12 items-center gap-3 rounded-xl px-3 font-medium transition-colors",
                        isActive(pathname, href) ? "bg-maroon-soft text-maroon" : "text-ink hover:bg-ink/5",
                      )}
                    >
                      <Icon className="size-5" /> {label}
                      {href === "/community" && unread > 0 && (
                        <span className="ml-auto grid min-w-5 place-items-center rounded-full bg-maroon px-1.5 text-xs leading-5 font-bold text-ivory">{unread}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              <ButtonLink href="/about#partners" className="mt-auto" onClick={() => setMenuOpen(false)}>
                List with {BRAND.name}
              </ButtonLink>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

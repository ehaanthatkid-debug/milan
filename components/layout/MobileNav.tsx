"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MeAvatar } from "@/components/social/Avatars";
import { unreadCount, useSocial } from "@/lib/social";
import { cn } from "@/lib/utils";
import { MOBILE_NAV, isActive } from "./nav-items";

export function MobileNav() {
  const pathname = usePathname();
  const s = useSocial();
  const unread = unreadCount(s);
  // Checkout and detail pages show their own sticky action bar instead.
  if (pathname.startsWith("/checkout") || /^\/(events|closet|vendors)\/[^/]+\/?$/.test(pathname)) return null;

  return (
    <nav aria-label="Primary" className="pb-safe fixed inset-x-0 bottom-0 z-50 px-3 pt-2 lg:hidden print:hidden">
      <div className="mx-auto mb-3 flex max-w-md items-center justify-between rounded-full border border-sand/80 bg-ivory/90 p-1.5 shadow-[0_12px_40px_-12px_rgb(54_9_20/0.35)] backdrop-blur-xl">
        {MOBILE_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 active:scale-95"
            >
              {active && (
                <motion.span
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 rounded-full bg-maroon"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">
                {item.href === "/profile" && s.me ? (
                  <MeAvatar me={s.me} size={20} className={cn(active && "ring-2 ring-ivory")} />
                ) : (
                  <Icon className={cn("size-5 transition-colors", active ? "text-ivory" : "text-ink-soft")} strokeWidth={active ? 2.2 : 1.8} />
                )}
                {item.href === "/community" && unread > 0 && (
                  <span className="absolute -top-1 -right-2 grid min-w-4 place-items-center rounded-full bg-maroon px-1 text-[0.6rem] leading-4 font-bold text-ivory ring-2 ring-ivory">
                    {unread}
                  </span>
                )}
              </span>
              <span className={cn("relative text-[0.66rem] font-medium tracking-wide transition-colors", active ? "text-ivory" : "text-ink-mute")}>
                {item.short}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

import { House, Info, Shirt, Store, Ticket, type LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; short: string; icon: LucideIcon };

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", short: "Home", icon: House },
  { href: "/events", label: "Events", short: "Events", icon: Ticket },
  { href: "/closet", label: "Festive Closet", short: "Closet", icon: Shirt },
  { href: "/vendors", label: "Vendors", short: "Vendors", icon: Store },
  { href: "/about", label: "About", short: "About", icon: Info },
];

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

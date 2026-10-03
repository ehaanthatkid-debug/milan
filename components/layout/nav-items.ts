import { CalendarDays, House, Info, MessageCircle, Shirt, Store, Ticket, UserRound, type LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; short: string; icon: LucideIcon };

/** Top navigation on desktop. */
export const DESKTOP_NAV: NavItem[] = [
  { href: "/events", label: "Events", short: "Events", icon: Ticket },
  { href: "/calendar", label: "Calendar", short: "Calendar", icon: CalendarDays },
  { href: "/closet", label: "Festive Closet", short: "Closet", icon: Shirt },
  { href: "/vendors", label: "Vendors", short: "Vendors", icon: Store },
  { href: "/community", label: "Community", short: "Community", icon: MessageCircle },
];

/** Bottom tab bar on phones. */
export const MOBILE_NAV: NavItem[] = [
  { href: "/", label: "Home", short: "Home", icon: House },
  { href: "/events", label: "Events", short: "Events", icon: Ticket },
  { href: "/community", label: "Community", short: "Community", icon: MessageCircle },
  { href: "/closet", label: "Festive Closet", short: "Closet", icon: Shirt },
  { href: "/profile", label: "Profile", short: "Profile", icon: UserRound },
];

/** Everything, for the phone menu sheet. */
export const MENU_NAV: NavItem[] = [
  ...DESKTOP_NAV,
  { href: "/profile", label: "Your profile & orders", short: "Profile", icon: UserRound },
  { href: "/about", label: "About Milan", short: "About", icon: Info },
];

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

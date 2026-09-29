import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { DiyaMark } from "@/components/brand/Logo";
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/brand/SocialIcons";
import { OrnamentDivider } from "@/components/ui/Ornament";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Events", href: "/events" },
      { label: "Festive Closet", href: "/closet" },
      { label: "Vendors", href: "/vendors" },
      { label: "Free this week", href: "/events?category=Free" },
    ],
  },
  {
    title: "Utsav",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Community partners", href: "/about#community" },
      { label: "List with Utsav", href: "/about#partners" },
      { label: "Careers", href: "/about#team" },
    ],
  },
  {
    title: "Cities",
    links: [
      { label: "Seattle", href: "/events?city=Seattle" },
      { label: "Bellevue", href: "/events?city=Bellevue" },
      { label: "Redmond", href: "/events?city=Redmond" },
      { label: "Sammamish & Kirkland", href: "/events?city=Sammamish" },
    ],
  },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "TikTok", href: "https://tiktok.com", Icon: TikTokIcon },
  { label: "YouTube", href: "https://youtube.com", Icon: YouTubeIcon },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-maroon-ink text-ivory">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-maroon/60 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1400px] px-4 pt-16 pb-32 sm:px-6 lg:px-8 lg:pt-20 lg:pb-12">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="flex items-center gap-3 text-saffron">
              <DiyaMark className="size-11 text-ivory" />
              <span className="font-display text-5xl font-semibold text-ivory">Utsav</span>
            </div>
            <p className="font-display display-italic mt-5 max-w-sm text-2xl leading-snug text-ivory/85">
              Every festival, every fitting, every family — celebrated together.
            </p>
            <div className="mt-8 space-y-3 text-sm text-ivory/70">
              <p className="flex items-center gap-3">
                <MapPin className="size-4 text-saffron" /> Downtown Bellevue, Washington
              </p>
              <a href="mailto:hello@utsavseattle.com" className="flex items-center gap-3 transition-colors hover:text-ivory">
                <Mail className="size-4 text-saffron" /> hello@utsavseattle.com
              </a>
              <a href="tel:+14255550142" className="flex items-center gap-3 transition-colors hover:text-ivory">
                <Phone className="size-4 text-saffron" /> (425) 555-0142
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold tracking-[0.2em] text-saffron uppercase">{col.title}</h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-[0.95rem] text-ivory/75 transition-colors hover:text-ivory">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <OrnamentDivider className="mt-14 text-gold/70" />

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-6 text-sm text-ivory/55 sm:flex-row sm:items-center">
          <p>© 2026 Utsav Technologies, Inc. Made with love in Bellevue.</p>
          <div className="flex items-center gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={`Utsav on ${label}`}
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-items-center rounded-full border border-ivory/15 text-ivory/80 transition-all hover:-translate-y-0.5 hover:border-saffron hover:text-saffron"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

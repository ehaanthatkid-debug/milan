import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone, Shirt, Store, Ticket } from "lucide-react";
import { photos } from "@/data/images";
import { events } from "@/data/events";
import { SERVICE_FEE_RATE } from "@/data/shared";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Ornament } from "@/components/ui/Ornament";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description: `${BRAND.name} is where people in the Seattle area find South Asian events, book vendors, and rent festive wear.`,
};

const feePercent = Math.round(SERVICE_FEE_RATE * 100);

const offerings = [
  {
    icon: Ticket,
    title: "Events",
    text: "Find events across the region, filter by date, age, price, and city, and buy tickets or RSVP in under a minute.",
    href: "/events",
  },
  {
    icon: Store,
    title: "Vendors",
    text: "Compare DJs, caterers, mehndi artists, decorators, and photographers with listed prices, reviews, and open dates.",
    href: "/vendors",
  },
  {
    icon: Shirt,
    title: "Festive Closet",
    text: "Rent an outfit for four days or buy a pre-loved piece from local boutiques and neighbors.",
    href: "/closet",
  },
];

const calendar = [
  { months: "Jan", items: ["Lohri", "Pongal", "Makar Sankranti"] },
  { months: "Feb – Mar", items: ["Ramadan", "Eid al-Fitr", "Holi"] },
  { months: "Apr", items: ["Vaisakhi", "Pohela Boishakh", "Puthandu"] },
  { months: "May – Jun", items: ["Eid al-Adha", "Buddha Purnima"] },
  { months: "Aug – Sep", items: ["Independence Days", "Raksha Bandhan", "Onam"] },
  { months: "Oct", items: ["Navratri", "Durga Puja", "Dussehra"] },
  { months: "Nov", items: ["Diwali", "Bandi Chhor Divas", "Gurpurab"] },
  { months: "Dec", items: ["Christmas", "Wedding season"] },
];

const cities = [
  { name: "Seattle", text: "Campus shows in the U-District and festivals at Seattle Center." },
  { name: "Bellevue", text: "The largest Navratri nights, night markets, and bridal boutiques." },
  { name: "Redmond", text: "Holi at Marymoor, Chand Raat, and many of our vendors." },
  { name: "Sammamish", text: "Family festivals, libraries, and weekend bazaars." },
  { name: "Kirkland", text: "Vaisakhi by the lake and concerts downtown." },
];

const partnerTypes = [
  {
    icon: Ticket,
    title: "Event organizers",
    text: "Sell tickets and manage RSVPs. Free events and registered nonprofits pay nothing.",
    subject: `Listing an event on ${BRAND.name}`,
  },
  {
    icon: Store,
    title: "Vendors",
    text: "Show your prices and open dates, and get paid after each event.",
    subject: `Joining ${BRAND.name} as a vendor`,
  },
  {
    icon: Shirt,
    title: "Boutiques & closets",
    text: "Rent or resell festive wear. We handle payments, deposits, and damage protection.",
    subject: "Listing outfits in the Festive Closet",
  },
];

export default function AboutPage() {
  const partners = Array.from(new Set(events.map((e) => e.organizer.name))).filter((n) => !n.startsWith(BRAND.name));

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <Eyebrow>About {BRAND.name}</Eyebrow>
            <h1 className="font-display mt-4 text-[2.7rem] leading-[1.02] text-balance text-ink sm:text-6xl lg:text-[4.2rem]">
              One place for South Asian celebrations in <em className="text-maroon">Seattle.</em>
            </h1>
            <p className="mt-5 text-lg text-ink-mute" lang="mul">
              {BRAND.scripts.join(" · ")} <span className="text-ink-soft">— “coming together”</span>
            </p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              {BRAND.name} is where people in the Seattle area find South Asian events, book the vendors behind them, and rent
              or buy festive clothes. It&apos;s for every tradition in the community — Hindu, Muslim, Sikh, Christian, Jain,
              Buddhist, and secular — and every part of the diaspora, from India and Pakistan to Bangladesh, Sri Lanka, and
              Nepal.
            </p>
          </div>
          <div className="relative">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-lift lg:rounded-[2.5rem]">
              <Image
                src={photos.seattleRainier}
                alt="The Seattle skyline and Space Needle with Mount Rainier at sunset"
                fill
                preload
                sizes="(min-width: 1024px) 700px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl bg-ivory px-4 py-3 shadow-float ring-1 ring-sand sm:left-8">
              <span className="grid size-10 place-items-center rounded-full bg-maroon text-ivory">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Based in Bellevue, WA</p>
                <p className="text-xs text-ink-mute">Seattle · Bellevue · Redmond · Sammamish · Kirkland</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <Reveal>
          <SectionHeading eyebrow="What we do" title={<>Events, vendors, and <em>festive wear</em></>} />
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:gap-6">
          {offerings.map(({ icon: Icon, title, text, href }, i) => (
            <Reveal key={title} delay={i * 0.07}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-3xl border border-sand/80 bg-white/60 p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift lg:p-7"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-maroon-soft text-maroon">
                  <Icon className="size-5" />
                </span>
                <p className="font-display mt-5 text-2xl text-ink">{title}</p>
                <p className="mt-2 flex-1 leading-relaxed text-ink-soft">{text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon">
                  Browse {title.toLowerCase()} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal>
            <Eyebrow>Why it exists</Eyebrow>
            <h2 className="font-display mt-3 text-4xl leading-[1.05] text-ink sm:text-5xl">
              Good events are <em className="text-maroon">too easy to miss.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-[1.05rem] leading-relaxed text-ink-soft">
              <p>
                South Asian events in the Seattle area are spread across WhatsApp forwards, Instagram stories, and flyers at
                community centers. If you&apos;re new to the area — or not in the right group chat — you often hear about a
                festival after it&apos;s over.
              </p>
              <p>
                Booking vendors is slow for the same reason. Prices usually aren&apos;t listed, checking a date takes a phone
                call, and reviews live in other people&apos;s chats.
              </p>
              <p>
                And most festive outfits are worn once or twice. Renting and resale make them cheaper to wear and keep them in
                use.
              </p>
              <p className="font-medium text-ink">
                {BRAND.name} puts events, vendors, and outfits in one place, with clear prices, dates, and reviews.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <Reveal>
          <SectionHeading
            eyebrow="Every tradition"
            title={<>Something to celebrate <em>almost every month</em></>}
            description="The calendar isn't just Diwali season. These are the festivals and occasions our community celebrates through the year."
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          {calendar.map((c, i) => (
            <Reveal key={c.months} delay={i * 0.04}>
              <div className="h-full rounded-2xl border border-sand/80 bg-white/55 p-4 sm:p-5">
                <p className="text-xs font-semibold tracking-[0.16em] text-gold-deep uppercase">{c.months}</p>
                <ul className="mt-2.5 space-y-1">
                  {c.items.map((item) => (
                    <li key={item} className="font-display text-lg leading-snug text-ink">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="community" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <div className="relative overflow-hidden rounded-[2rem] bg-maroon-ink text-ivory lg:rounded-[2.5rem]">
          <Image src={photos.seattleNight} alt="" fill sizes="(min-width: 1400px) 1400px, 100vw" className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-br from-maroon-ink via-maroon-ink/85 to-maroon/60" />
          <div className="relative px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
            <SectionHeading
              tone="light"
              eyebrow="Where we are"
              title={<>Five cities, <em>one community</em></>}
              description="The Puget Sound region is home to one of the largest South Asian communities on the West Coast. We started on the Eastside and cover the whole area."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {cities.map((c, i) => (
                <Reveal key={c.name} delay={i * 0.06}>
                  <div className="h-full rounded-2xl bg-ivory/[0.07] p-5 ring-1 ring-ivory/15 backdrop-blur-sm">
                    <p className="font-display flex items-center gap-2 text-2xl">
                      <Ornament className="size-3 text-saffron" /> {c.name}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ivory/70">{c.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-14 border-t border-ivory/15 pt-10">
              <p className="text-xs font-semibold tracking-[0.2em] text-saffron uppercase">Organizers on {BRAND.name}</p>
              <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
                {partners.map((p) => (
                  <li key={p} className="font-display text-lg text-ivory/85 sm:text-xl">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="partners" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <div className="grid gap-10 rounded-[2rem] bg-ivory-100 p-6 ring-1 ring-sand/70 sm:p-10 lg:grid-cols-[1fr_1.6fr] lg:gap-14 lg:rounded-[2.5rem] lg:p-16">
          <Reveal>
            <Eyebrow>List with {BRAND.name}</Eyebrow>
            <h2 className="font-display mt-3 text-4xl leading-[1.05] text-ink sm:text-5xl">
              Free to list. <em className="text-maroon">{feePercent}% when you get paid.</em>
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Listing an event, service, or outfit costs nothing. On paid orders, buyers pay a {feePercent}% service fee shown
              at checkout; it covers payment processing and refunds when plans fall through. Free events and registered
              nonprofits pay no fees.
            </p>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {partnerTypes.map(({ icon: Icon, title, text, subject }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <a
                  href={`mailto:${BRAND.partnersEmail}?subject=${encodeURIComponent(subject)}`}
                  className="group flex h-full flex-col rounded-3xl border border-sand/80 bg-white/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-maroon/30 hover:shadow-lift"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-maroon text-ivory">
                    <Icon className="size-5" />
                  </span>
                  <p className="font-display mt-5 text-2xl text-ink">{title}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{text}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon">
                    Apply to list{" "}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <Reveal>
          <div className="flex flex-col gap-8 border-t border-sand pt-12 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow>Contact</Eyebrow>
              <h2 className="font-display mt-3 text-4xl text-ink sm:text-5xl">Questions or ideas? Write to us.</h2>
            </div>
            <div className="flex flex-col gap-3 text-ink-soft sm:flex-row sm:gap-8">
              <a href={`mailto:${BRAND.email}`} className="inline-flex items-center gap-2 hover:text-maroon">
                <Mail className="size-4 text-maroon" /> {BRAND.email}
              </a>
              <a href={BRAND.phoneHref} className="inline-flex items-center gap-2 hover:text-maroon">
                <Phone className="size-4 text-maroon" /> {BRAND.phone}
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-maroon" /> Bellevue, WA
              </span>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

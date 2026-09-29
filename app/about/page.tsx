import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Briefcase, HandHeart, Leaf, MapPin, Shirt, Sparkles, Store, Ticket, Users } from "lucide-react";
import { photos } from "@/data/images";
import { events } from "@/data/events";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Ornament, OrnamentDivider } from "@/components/ui/Ornament";

export const metadata: Metadata = {
  title: "About",
  description: "Utsav is the home for South Asian celebrations in Seattle and the Eastside — events, vendors, and festive wear in one place.",
};

const timeline = [
  { year: "2023", title: "A shared spreadsheet", text: "Eastside garba nights, listed in one place. 4,000 people opened it in a single Navratri." },
  { year: "2024", title: "The vendor directory", text: "Forty mehndi artists, DJs, and caterers — with real reviews from families who booked them." },
  { year: "2025", title: "The Festive Closet", text: "Three Bellevue boutiques started renting lehengas and sherwanis. Neighbors followed." },
  { year: "2026", title: "Tickets & bookings", text: "Checkout for events, rentals, and vendors across five cities — one account for every celebration." },
];

const cities = [
  { name: "Seattle", text: "Campus shows in the U-District, melas at Seattle Center, and SoDo garba raves." },
  { name: "Bellevue", text: "The Eastside's biggest Navratri nights, galas, and bridal boutiques." },
  { name: "Redmond", text: "Holi at Marymoor, Diwali pujas, and a deep bench of vendors." },
  { name: "Sammamish", text: "Family festivals, language schools, and weekend bazaars." },
  { name: "Kirkland", text: "Lakeside Diwali lights and studio mehndi artists." },
];

const values = [
  { icon: Sparkles, title: "Culture first", text: "We design for aarti timings, family WhatsApp groups, and the auntie who needs large text." },
  { icon: MapPin, title: "Local by default", text: "Every vendor and boutique on Utsav is based in Washington. Money stays in the community." },
  { icon: Users, title: "Everyone's invited", text: "Gujarati or Tamil, Punjabi or Bengali, first garba or fiftieth — there's a place for you." },
  { icon: Leaf, title: "Celebrate sustainably", text: "A lehenga worn once shouldn't live in a closet. Renting and resale keep it dancing." },
];

const partnerTypes = [
  {
    icon: Ticket,
    title: "Event organizers",
    text: "Sell tickets, manage RSVPs, and reach 12,000 local subscribers. Free for community nonprofits.",
    subject: "Listing an event on Utsav",
  },
  {
    icon: Store,
    title: "Vendors",
    text: "Get booked by families who've already read your reviews. Payments held securely until after the event.",
    subject: "Joining Utsav as a vendor",
  },
  {
    icon: Shirt,
    title: "Boutiques & closets",
    text: "Rent or resell festive wear. We handle payments, deposits, and damage protection.",
    subject: "Listing outfits in the Festive Closet",
  },
];

const roles = [
  { title: "Founding engineer", place: "Bellevue · Hybrid" },
  { title: "Community partnerships lead", place: "Seattle · Hybrid" },
  { title: "Vendor success associate", place: "Eastside · Part-time" },
];

export default function AboutPage() {
  const partners = Array.from(new Set(events.map((e) => e.organizer.name))).filter((n) => n !== "Utsav Presents");

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <Eyebrow>Our story</Eyebrow>
            <h1 className="font-display mt-4 text-[2.8rem] leading-[1] text-balance text-ink sm:text-6xl lg:text-[4.6rem]">
              Built by the community, for <em className="text-maroon">every celebration.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              <span className="font-display display-italic text-ink">Utsav</span> means celebration. We&apos;re building the home
              for South Asian life in Seattle and the Eastside — where you find the garba night, book the mehndi artist, and borrow
              the lehenga, all in one place.
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
                <p className="text-sm font-semibold text-ink">Made in Bellevue, WA</p>
                <p className="text-xs text-ink-mute">Serving 5 cities across the Puget Sound</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-24 text-center sm:px-6 lg:pt-32">
        <Reveal>
          <OrnamentDivider className="mx-auto max-w-xs" />
          <p className="font-display mt-8 text-[1.9rem] leading-[1.2] text-balance text-ink sm:text-5xl sm:leading-[1.15]">
            Our mission is to make every celebration <em className="text-maroon">easier to find</em>, easier to plan, and{" "}
            <em className="text-maroon">open to everyone</em> who wants to join in.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <Eyebrow>How it started</Eyebrow>
            <h2 className="font-display mt-3 text-4xl leading-[1.05] text-ink sm:text-5xl">
              It began with a <em className="text-maroon">group chat.</em>
            </h2>
            <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed text-ink-soft">
              <p>
                Every fall, the same questions flood our phones. Where&apos;s the best garba this weekend? Who does bridal mehndi in
                Redmond? Does anyone have a sherwani in a 40 I can borrow for Saturday?
              </p>
              <p>
                The answers lived in forwarded flyers, temple bulletin boards, and a cousin&apos;s friend&apos;s Instagram. Newcomers to
                the area missed out entirely. Small vendors spent their evenings answering the same texts.
              </p>
              <p>
                So we started collecting it all in one place — and the community kept adding to it. Today Utsav helps families,
                students, and new arrivals find their people, their plans, and their outfit for every festival of the year.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ol className="relative space-y-8 before:absolute before:top-3 before:bottom-3 before:left-[2.1rem] before:w-px before:bg-gradient-to-b before:from-gold/60 before:to-sand">
              {timeline.map((t) => (
                <li key={t.year} className="relative flex gap-5">
                  <span className="font-display relative z-10 grid h-11 w-[4.2rem] shrink-0 place-items-center rounded-full bg-maroon text-sm font-semibold text-ivory ring-4 ring-ivory">
                    {t.year}
                  </span>
                  <div className="rounded-2xl border border-sand/80 bg-white/60 p-5">
                    <p className="font-display text-xl text-ink">{t.title}</p>
                    <p className="mt-1.5 leading-relaxed text-ink-soft">{t.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section id="community" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <div className="relative overflow-hidden rounded-[2rem] bg-maroon-ink text-ivory lg:rounded-[2.5rem]">
          <Image src={photos.seattleNight} alt="" fill sizes="(min-width: 1400px) 1400px, 100vw" className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-br from-maroon-ink via-maroon-ink/85 to-maroon/60" />
          <div className="relative px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
            <SectionHeading
              tone="light"
              eyebrow="Our community"
              title={
                <>
                  Rooted in the <em>Puget Sound</em>
                </>
              }
              description="The Seattle area is home to one of the fastest-growing South Asian communities in the country — engineers and aunties, students and small-business owners, families here for generations and families here for six months."
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
              <p className="text-xs font-semibold tracking-[0.2em] text-saffron uppercase">Community partners</p>
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

      <section className="mx-auto max-w-[1400px] px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <Reveal>
          <SectionHeading
            eyebrow="What we believe"
            title={
              <>
                Values we <em>celebrate by</em>
              </>
            }
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {values.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.07}>
              <div className="h-full rounded-3xl border border-sand/80 bg-white/60 p-6 shadow-card">
                <span className="grid size-12 place-items-center rounded-2xl bg-maroon-soft text-maroon">
                  <Icon className="size-5" />
                </span>
                <p className="font-display mt-5 text-2xl text-ink">{title}</p>
                <p className="mt-2 leading-relaxed text-ink-soft">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="partners" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <div className="grid gap-10 rounded-[2rem] bg-ivory-100 p-6 ring-1 ring-sand/70 sm:p-10 lg:grid-cols-[1fr_1.6fr] lg:gap-14 lg:rounded-[2.5rem] lg:p-16">
          <Reveal>
            <Eyebrow>List with Utsav</Eyebrow>
            <h2 className="font-display mt-3 text-4xl leading-[1.05] text-ink sm:text-5xl">
              Grow with the <em className="text-maroon">community.</em>
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Organizers, vendors, and boutiques use Utsav to reach families across Seattle and the Eastside. Listing is free —
              we only earn a small fee when you get paid.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-ink-soft">
              <HandHeart className="size-5 text-maroon" /> 0% fees for registered community nonprofits
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {partnerTypes.map(({ icon: Icon, title, text, subject }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <a
                  href={`mailto:partners@utsavseattle.com?subject=${encodeURIComponent(subject)}`}
                  className="group flex h-full flex-col rounded-3xl border border-sand/80 bg-white/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-maroon/30 hover:shadow-lift"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-maroon text-ivory">
                    <Icon className="size-5" />
                  </span>
                  <p className="font-display mt-5 text-2xl text-ink">{title}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{text}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon">
                    Apply to list <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
            <div>
              <Eyebrow>Careers</Eyebrow>
              <h2 className="font-display mt-3 text-4xl leading-[1.05] text-ink sm:text-5xl">
                Help us build the <em className="text-maroon">next chapter.</em>
              </h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                A small team in Bellevue, obsessed with details and fluent in both product roadmaps and wedding timelines.
              </p>
            </div>
            <ul className="divide-y divide-sand/80 rounded-3xl border border-sand/80 bg-white/60">
              {roles.map((r) => (
                <li key={r.title}>
                  <a
                    href={`mailto:careers@utsavseattle.com?subject=${encodeURIComponent(r.title)}`}
                    className="group flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-white"
                  >
                    <span className="flex items-center gap-4">
                      <span className="grid size-10 place-items-center rounded-xl bg-ivory-200 text-maroon">
                        <Briefcase className="size-4" />
                      </span>
                      <span>
                        <span className="block font-semibold text-ink">{r.title}</span>
                        <span className="block text-sm text-ink-mute">{r.place}</span>
                      </span>
                    </span>
                    <ArrowUpRight className="size-5 text-ink-mute transition-all group-hover:text-maroon" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </>
  );
}

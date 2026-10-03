import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, Clock, Globe2, Languages, MapPin, Medal, Quote } from "lucide-react";
import { getVendor, vendors } from "@/data/vendors";
import { VendorCard } from "@/components/cards/VendorCard";
import { BackLink, ShareButton } from "@/components/detail/DetailBits";
import { PhotoMosaic } from "@/components/detail/PhotoMosaic";
import { BookingCard } from "@/components/vendors/BookingCard";
import { CATEGORY_ICONS } from "@/components/vendors/category-icons";
import { Stars } from "@/components/ui/Rating";
import { Rail } from "@/components/ui/Rail";
import { Reveal } from "@/components/ui/Reveal";
import { SaveButton } from "@/components/ui/SaveButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice, parseLocalDate, toISODate } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return vendors.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/vendors/[slug]">): Promise<Metadata> {
  const vendor = getVendor((await params).slug);
  return vendor ? { title: vendor.name, description: vendor.tagline } : {};
}

/** A plausible star distribution for the summary bars, derived from the average. */
function distribution(rating: number) {
  const five = Math.min(96, Math.round((rating - 4) * 85 + 10));
  const four = Math.round((100 - five) * 0.72);
  const three = Math.round((100 - five - four) * 0.6);
  const two = Math.round((100 - five - four - three) * 0.6);
  return [five, four, three, two, Math.max(0, 100 - five - four - three - two)];
}

export default async function VendorPage({ params }: PageProps<"/vendors/[slug]">) {
  const vendor = getVendor((await params).slug);
  if (!vendor) notFound();

  const Icon = CATEGORY_ICONS[vendor.category];
  const dist = distribution(vendor.rating);
  const related = vendors.filter((v) => v.slug !== vendor.slug && v.category !== vendor.category).slice(0, 6);

  const facts = [
    { icon: Medal, label: "Experience", value: `${vendor.yearsActive} years` },
    { icon: Clock, label: "Response", value: vendor.responseTime.replace("Usually replies ", "Replies ") },
    { icon: Languages, label: "Languages", value: vendor.languages.join(", ") },
    { icon: Globe2, label: "Travels to", value: vendor.serviceArea },
  ];

  return (
    <article className="mx-auto max-w-[1400px] px-4 pt-4 sm:px-6 lg:px-8 lg:pt-8">
      <BackLink href="/vendors">All vendors</BackLink>

      <header className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-maroon px-3 py-1 text-xs font-semibold tracking-wide text-ivory">
              <Icon className="size-3.5" /> {vendor.category}
            </span>
            {vendor.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-saffron-soft px-3 py-1 text-xs font-semibold text-gold-deep">
                <BadgeCheck className="size-3.5" /> Milan verified
              </span>
            )}
            <span className="rounded-full border border-sand px-3 py-1 text-xs font-medium text-ink-soft">{vendor.priceRange}</span>
          </div>
          <h1 className="font-display mt-4 text-[2.4rem] leading-[1.02] text-balance text-ink sm:text-5xl lg:text-[4rem]">{vendor.name}</h1>
          <p className="mt-3 text-lg text-ink-soft sm:text-xl">{vendor.tagline}</p>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <Stars value={vendor.rating} />
              <span className="font-semibold text-ink">{vendor.rating.toFixed(1)}</span>
              <a href="#reviews" className="underline decoration-sand-deep underline-offset-4 hover:text-maroon">
                {vendor.reviewCount} reviews
              </a>
            </span>
            <span aria-hidden="true" className="text-sand-deep">
              ·
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" /> {vendor.city}, WA
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShareButton title={vendor.name} />
          <SaveButton label={vendor.name} className="size-10 border border-sand bg-white/60" />
        </div>
      </header>

      <div className="mt-7">
        <PhotoMosaic images={[vendor.image, ...vendor.gallery]} alt={vendor.name} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
        <div className="min-w-0">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {facts.map(({ icon: FactIcon, label, value }) => (
              <div key={label} className="rounded-2xl border border-sand/80 bg-white/60 p-4">
                <FactIcon className="size-5 text-maroon" />
                <p className="mt-3 text-xs font-semibold tracking-wider text-ink-mute uppercase">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
              </div>
            ))}
          </div>

          <Reveal>
            <section className="mt-12">
              <h2 className="font-display text-3xl text-ink">About {vendor.name}</h2>
              <div className="mt-4 space-y-4 text-[1.05rem] leading-relaxed text-ink-soft">
                {vendor.bio.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="mt-12">
              <h2 className="font-display text-3xl text-ink">Services &amp; pricing</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {vendor.services.map((s) => (
                  <div key={s.name} className="flex flex-col rounded-2xl border border-sand/80 bg-white/60 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-ink">{s.name}</p>
                      <p className="font-display shrink-0 text-xl text-maroon">{formatPrice(s.price)}</p>
                    </div>
                    <p className="mt-0.5 text-xs font-medium tracking-wide text-gold-deep uppercase">{s.unit}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section id="reviews" className="mt-12 scroll-mt-28">
              <h2 className="font-display text-3xl text-ink">Reviews</h2>
              <div className="mt-5 grid gap-6 rounded-[1.75rem] bg-ivory-100 p-6 ring-1 ring-sand/70 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10">
                <div className="text-center sm:text-left">
                  <p className="font-display text-6xl text-ink">{vendor.rating.toFixed(1)}</p>
                  <Stars value={vendor.rating} size={16} className="mt-1" />
                  <p className="mt-1.5 text-sm text-ink-mute">{vendor.reviewCount} verified reviews</p>
                </div>
                <div className="space-y-1.5">
                  {dist.map((pct, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="w-3 text-ink-soft">{5 - i}</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-sand/70">
                        <span className="block h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="w-9 text-right text-ink-mute tabular-nums">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {vendor.reviews.map((r) => (
                  <figure key={r.name + r.date} className="rounded-2xl border border-sand/80 bg-white/60 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-display grid size-10 place-items-center rounded-full bg-maroon-soft text-sm font-semibold text-maroon">
                          {r.name
                            .split(/[\s&]+/)
                            .filter(Boolean)
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                        <div>
                          <p className="font-semibold text-ink">{r.name}</p>
                          <p className="text-xs text-ink-mute">
                            {r.occasion} ·{" "}
                            {parseLocalDate(r.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <Stars value={r.rating} size={13} />
                    </div>
                    <blockquote className="mt-3 flex gap-2 leading-relaxed text-ink-soft">
                      <Quote className="mt-1 size-4 shrink-0 text-gold" />
                      {r.text}
                    </blockquote>
                  </figure>
                ))}
              </div>
            </section>
          </Reveal>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <BookingCard vendor={vendor} serverToday={toISODate(new Date())} />
        </aside>
      </div>

      <section className="mt-20 lg:mt-28">
        <Reveal>
          <SectionHeading
            eyebrow="Build your team"
            title={
              <>
                Pairs well <em>with</em>
              </>
            }
          />
        </Reveal>
        <Rail label="Other vendors" className="mt-10" itemClassName="w-[74vw] sm:w-[300px] lg:w-[316px]">
          {related.map((v) => (
            <VendorCard key={v.slug} vendor={v} tall />
          ))}
        </Rail>
      </section>
    </article>
  );
}

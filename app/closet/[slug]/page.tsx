import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, Clock, Sparkles } from "lucide-react";
import { closet, getOutfit } from "@/data/closet";
import { OutfitCard } from "@/components/cards/OutfitCard";
import { OutfitPurchase } from "@/components/closet/OutfitPurchase";
import { BackLink, ShareButton } from "@/components/detail/DetailBits";
import { Gallery } from "@/components/ui/Gallery";
import { Stars } from "@/components/ui/Rating";
import { Rail } from "@/components/ui/Rail";
import { Reveal } from "@/components/ui/Reveal";
import { SaveButton } from "@/components/ui/SaveButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { toISODate } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return closet.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: PageProps<"/closet/[slug]">): Promise<Metadata> {
  const outfit = getOutfit((await params).slug);
  return outfit ? { title: outfit.name, description: outfit.description } : {};
}

export default async function OutfitPage({ params }: PageProps<"/closet/[slug]">) {
  const outfit = getOutfit((await params).slug);
  if (!outfit) notFound();

  const related = closet
    .filter((o) => o.slug !== outfit.slug)
    .sort((a, b) => Number(b.type === outfit.type) - Number(a.type === outfit.type))
    .slice(0, 8);

  const details: [string, string][] = [
    ["Designer", outfit.designer],
    ["Color", outfit.color],
    ["Fabric", outfit.fabric],
    ["Fit", outfit.fit],
  ];

  return (
    <article className="mx-auto max-w-[1400px] px-4 pt-4 sm:px-6 lg:px-8 lg:pt-8">
      <div className="flex items-center justify-between">
        <BackLink href="/closet">Festive Closet</BackLink>
        <div className="flex items-center gap-2">
          <ShareButton title={outfit.name} />
          <SaveButton label={outfit.name} item={{ kind: "outfit", id: outfit.slug }} className="size-10 border border-sand bg-white/60" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Gallery images={outfit.images} alt={outfit.name} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-maroon px-3 py-1 text-xs font-semibold tracking-wide text-ivory">{outfit.type}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-leaf-soft px-3 py-1 text-xs font-semibold text-leaf">
              <Sparkles className="size-3" /> {outfit.condition}
            </span>
            <span className="rounded-full border border-sand px-3 py-1 text-xs font-medium text-ink-soft">Size {outfit.size}</span>
          </div>
          <h1 className="font-display mt-4 text-[2.3rem] leading-[1.04] text-balance text-ink sm:text-5xl">{outfit.name}</h1>

          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-sand/80 bg-white/60 p-3.5">
            <span className="font-display grid size-12 shrink-0 place-items-center rounded-xl bg-maroon font-semibold text-ivory">
              {outfit.owner.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 font-semibold text-ink">
                {outfit.owner.name}
                {outfit.owner.verified && <BadgeCheck className="size-4 text-gold" aria-label="Verified" />}
                <span className="rounded-full bg-ivory-200 px-2 py-0.5 text-[0.68rem] font-semibold text-ink-soft">
                  {outfit.owner.kind}
                </span>
              </p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-ink-mute">
                <Stars value={outfit.owner.rating} size={13} />
                {outfit.owner.rating.toFixed(1)} ({outfit.owner.reviewCount}) · {outfit.city}
              </p>
            </div>
            <span className="hidden items-center gap-1.5 text-xs text-ink-mute sm:flex">
              <Clock className="size-3.5" /> {outfit.owner.responseTime}
            </span>
          </div>

          <div className="mt-7">
            <OutfitPurchase outfit={outfit} serverToday={toISODate(new Date())} />
          </div>

          <Reveal>
            <section className="mt-10 border-t border-sand/80 pt-8">
              <h2 className="font-display text-2xl text-ink">The details</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{outfit.description}</p>
              <dl className="mt-6 divide-y divide-sand/70 rounded-2xl border border-sand/80 bg-white/50">
                {details.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[7rem_1fr] gap-3 px-4 py-3 text-sm">
                    <dt className="text-ink-mute">{k}</dt>
                    <dd className="text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-ivory-100 p-5 ring-1 ring-sand/70">
                  <p className="font-semibold text-ink">What&apos;s included</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
                    {outfit.includes.map((i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" /> {i}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-ivory-100 p-5 ring-1 ring-sand/70">
                  <p className="font-semibold text-ink">Condition: {outfit.condition}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{outfit.conditionNote}</p>
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </div>

      <section className="mt-20 lg:mt-28">
        <Reveal>
          <SectionHeading
            eyebrow="Complete the look"
            title={
              <>
                More from <em>the closet</em>
              </>
            }
          />
        </Reveal>
        <Rail label="More outfits" className="mt-10" itemClassName="w-[60vw] sm:w-[260px] lg:w-[280px]">
          {related.map((o) => (
            <OutfitCard key={o.slug} outfit={o} />
          ))}
        </Rail>
      </section>
    </article>
  );
}

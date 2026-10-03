"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShieldCheck, Ticket } from "lucide-react";
import { useState } from "react";
import type { EventItem } from "@/data/events";
import { SERVICE_FEE_RATE } from "@/data/shared";
import { checkoutHref } from "@/lib/checkout";
import { ticketsBought, useOrders } from "@/lib/orders";
import { cn, formatMoney, formatPrice, formatShortDate } from "@/lib/utils";

export function TicketPicker({ event }: { event: EventItem }) {
  const orders = useOrders();
  // Limited tiers count down as this visitor buys tickets.
  const tiers = event.tiers.map((t, i) => {
    const left = t.remaining === undefined ? undefined : t.remaining - ticketsBought(orders, event.slug, i);
    return { ...t, remaining: left, soldOut: t.soldOut || (left !== undefined && left <= 0) };
  });
  // Skip free add-on tiers for kids or parents when picking the default — they need a paying ticket alongside.
  const isAddOn = (t: (typeof tiers)[number]) => t.price === 0 && /kid|child|parent|guardian/i.test(t.name);
  const preferred = tiers.findIndex((t) => !t.soldOut && !isAddOn(t));
  const firstAvailable = preferred >= 0 ? preferred : Math.max(0, tiers.findIndex((t) => !t.soldOut));
  const [tierChoice, setTierIndex] = useState(firstAvailable);
  const tierIndex = tiers[tierChoice]?.soldOut ? firstAvailable : tierChoice;
  const [qty, setQty] = useState(1);
  const tier = tiers[tierIndex];
  const maxQty = Math.min(10, tier.remaining ?? 10);
  const count = Math.min(qty, maxQty);
  const subtotal = tier.price * count;
  const free = subtotal === 0;
  const href = checkoutHref({ type: "event", slug: event.slug, tier: tierIndex, qty: count });
  const cta = free ? "Reserve free spot" : "Get tickets";

  return (
    <>
      <div id="tickets" className="scroll-mt-28 rounded-[1.75rem] border border-sand/80 bg-white/80 p-5 shadow-card backdrop-blur sm:p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-ink">{free && event.tiers.every((t) => t.price === 0) ? "RSVP" : "Tickets"}</h2>
          <p className="text-xs text-ink-mute">Sales end {formatShortDate(event.date)}</p>
        </div>

        <div className="mt-4 space-y-2.5" role="radiogroup" aria-label="Ticket type">
          {tiers.map((t, i) => {
            const selected = i === tierIndex;
            return (
              <button
                key={t.name}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={t.soldOut}
                onClick={() => setTierIndex(i)}
                className={cn(
                  "relative flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                  selected ? "border-maroon bg-maroon-soft/50" : "border-sand hover:border-maroon/30",
                  t.soldOut && "cursor-not-allowed opacity-55 hover:border-sand",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
                    selected ? "border-maroon" : "border-sand-deep",
                  )}
                >
                  <AnimatePresence>
                    {selected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="size-2.5 rounded-full bg-maroon"
                      />
                    )}
                  </AnimatePresence>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{t.name}</span>
                    {t.soldOut && (
                      <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[0.68rem] font-semibold text-ink-soft uppercase">Sold out</span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-mute">{t.description}</span>
                  {t.remaining && !t.soldOut && (
                    <span className="mt-1.5 inline-block rounded-full bg-saffron-soft px-2 py-0.5 text-xs font-semibold text-gold-deep">
                      Only {t.remaining} left
                    </span>
                  )}
                </span>
                <span className={cn("font-display shrink-0 text-lg", t.soldOut ? "text-ink-mute line-through" : "text-ink")}>
                  {t.price === 0 ? "Free" : formatPrice(t.price)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-medium text-ink">{free ? "Spots" : "Quantity"}</span>
          <Stepper value={count} onChange={setQty} min={1} max={maxQty} />
        </div>

        <div className="mt-5 border-t border-sand/80 pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-ink-soft">
              {count} × {tier.price === 0 ? "Free" : formatPrice(tier.price)}
            </span>
            <span className="font-display text-2xl text-ink">{free ? "Free" : formatPrice(subtotal)}</span>
          </div>
          {!free && (
            <p className="mt-1 text-right text-xs text-ink-mute">
              + {formatMoney(subtotal * SERVICE_FEE_RATE)} Milan fee ({Math.round(SERVICE_FEE_RATE * 100)}%) at checkout
            </p>
          )}
        </div>

        <Link
          href={href}
          className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-maroon text-base font-semibold text-ivory shadow-[0_12px_28px_-12px_rgb(122_18_48/0.9)] transition-all hover:bg-maroon-deep active:scale-[0.98]"
        >
          <Ticket className="size-5" /> {cta}
        </Link>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-mute">
          <ShieldCheck className="size-3.5 text-leaf" /> Full refund up to 7 days before the event
        </p>
      </div>

      {/* Mobile: a sticky purchase bar in place of the bottom navigation. */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-sand/80 bg-ivory/95 px-4 pt-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto mb-3 flex max-w-md items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display text-xl leading-tight text-ink">{free ? "Free" : formatPrice(subtotal)}</p>
            <a href="#tickets" className="truncate text-xs text-ink-mute underline-offset-2 hover:underline">
              {count} × {tier.name} · change
            </a>
          </div>
          <Link
            href={href}
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-maroon px-6 font-semibold text-ivory active:scale-[0.97]"
          >
            <Ticket className="size-4" /> {cta}
          </Link>
        </div>
      </div>
    </>
  );
}

export function Stepper({
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-sand bg-white">
      <button
        type="button"
        aria-label="Decrease"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - step))}
        className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 disabled:opacity-30"
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-8 px-1 text-center font-semibold text-ink tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
        className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 disabled:opacity-30"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

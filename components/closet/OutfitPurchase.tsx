"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarDays, PackageCheck, Store, Truck } from "lucide-react";
import { useState } from "react";
import { RENTAL_DAYS, type Outfit } from "@/data/closet";
import { Calendar, addDays } from "@/components/ui/Calendar";
import { SegmentedControl } from "@/components/ui/Filters";
import { DELIVERY_FEE, checkoutHref } from "@/lib/checkout";
import { blockedDates, useOrders } from "@/lib/orders";
import { useToday } from "@/lib/use-today";
import { cn, formatPrice, formatShortDate } from "@/lib/utils";

type Mode = "rent" | "buy";
type Delivery = "pickup" | "delivery";

export function OutfitPurchase({ outfit, serverToday }: { outfit: Outfit; serverToday: string }) {
  const today = useToday(serverToday);
  const orders = useOrders();
  const booked = [...outfit.bookedDates, ...blockedDates(orders, "rent", outfit.slug)];
  const [mode, setMode] = useState<Mode>(outfit.rentPrice ? "rent" : "buy");
  const [start, setStart] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<Delivery>("pickup");

  const price = mode === "rent" ? outfit.rentPrice! : outfit.buyPrice!;
  const ready = mode === "buy" || start !== null;
  const href = ready
    ? mode === "rent"
      ? checkoutHref({ type: "rent", slug: outfit.slug, start: start!, delivery })
      : checkoutHref({ type: "buy", slug: outfit.slug, delivery })
    : "#dates";
  const cta = mode === "rent" ? (ready ? `Rent now · ${formatPrice(price)}` : "Choose your dates") : `Buy now · ${formatPrice(price)}`;
  const savings = Math.round((1 - price / outfit.retailPrice) * 100);

  return (
    <div className="space-y-6">
      {outfit.rentPrice && outfit.buyPrice && (
        <SegmentedControl
          value={mode}
          onChange={setMode}
          layoutGroup="outfit-mode"
          options={[
            { value: "rent", label: `Rent · ${formatPrice(outfit.rentPrice)}` },
            { value: "buy", label: `Buy · ${formatPrice(outfit.buyPrice)}` },
          ]}
        />
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-4xl text-ink">{formatPrice(price)}</span>
            <span className="text-ink-soft">{mode === "rent" ? `for ${RENTAL_DAYS} days` : outfit.condition.toLowerCase()}</span>
            <span className="text-sm text-ink-mute line-through">Retail {formatPrice(outfit.retailPrice)}</span>
            <span className="rounded-full bg-saffron-soft px-2.5 py-0.5 text-xs font-semibold text-gold-deep">Save {savings}%</span>
          </div>
          {mode === "rent" && (
            <p className="mt-1.5 text-sm text-ink-mute">
              Plus a {formatPrice(outfit.deposit)} refundable deposit, returned within 48 hours.
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {mode === "rent" && (
        <div id="dates" className="scroll-mt-28 rounded-[1.5rem] border border-sand/80 bg-white/70 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <CalendarDays className="size-4 text-maroon" /> Rental dates
            </p>
            <p className="text-xs text-ink-mute">Tap your pickup day</p>
          </div>
          <Calendar today={today} booked={booked} selected={start} onSelect={setStart} rangeDays={RENTAL_DAYS} />
          <AnimatePresence>
            {start && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-maroon-soft/60 p-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-maroon/70 uppercase">Pickup</p>
                    <p className="font-semibold text-maroon-ink">{formatShortDate(start)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-maroon/70 uppercase">Return by</p>
                    <p className="font-semibold text-maroon-ink">{formatShortDate(addDays(start, RENTAL_DAYS))}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div>
        <p className="mb-2.5 font-semibold text-ink">How you&apos;ll get it</p>
        <div className="grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label="Delivery method">
          <DeliveryOption
            active={delivery === "pickup"}
            onClick={() => setDelivery("pickup")}
            icon={<Store className="size-5" />}
            title={`Pick up in ${outfit.city}`}
            note="Free · ready by 10 AM"
          />
          <DeliveryOption
            active={delivery === "delivery"}
            onClick={() => setDelivery("delivery")}
            icon={<Truck className="size-5" />}
            title="Eastside delivery"
            note={`${formatPrice(DELIVERY_FEE)} · garment-bagged`}
          />
        </div>
      </div>

      <Link
        href={href}
        aria-disabled={!ready}
        className={cn(
          "hidden h-14 w-full items-center justify-center gap-2 rounded-full text-base font-semibold transition-all active:scale-[0.98] lg:flex",
          ready
            ? "bg-maroon text-ivory shadow-[0_12px_28px_-12px_rgb(122_18_48/0.9)] hover:bg-maroon-deep"
            : "border border-maroon/30 bg-maroon-soft text-maroon hover:bg-maroon-soft/70",
        )}
      >
        {cta} <ArrowRight className="size-5" />
      </Link>

      <ul className="grid gap-2 text-sm text-ink-soft sm:grid-cols-3">
        {["Dry-cleaned & steamed", "Free fit exchange", "Damage protection"].map((t) => (
          <li key={t} className="flex items-center gap-2">
            <PackageCheck className="size-4 shrink-0 text-leaf" /> {t}
          </li>
        ))}
      </ul>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-sand/80 bg-ivory/95 px-4 pt-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto mb-3 flex max-w-md items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display text-xl leading-tight text-ink">
              {formatPrice(price)}
              <span className="font-sans text-sm text-ink-mute"> {mode === "rent" ? `/ ${RENTAL_DAYS} days` : ""}</span>
            </p>
            <p className="truncate text-xs text-ink-mute">
              {mode === "rent" ? (start ? `${formatShortDate(start)} pickup` : "Select dates to continue") : `Size ${outfit.size}`}
            </p>
          </div>
          <Link
            href={href}
            className={cn(
              "inline-flex h-12 shrink-0 items-center gap-2 rounded-full px-6 font-semibold active:scale-[0.97]",
              ready ? "bg-maroon text-ivory" : "bg-maroon-soft text-maroon",
            )}
          >
            {mode === "rent" ? (ready ? "Rent now" : "Pick dates") : "Buy now"}
          </Link>
        </div>
      </div>
    </div>
  );
}

function DeliveryOption({
  active,
  onClick,
  icon,
  title,
  note,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  note: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all",
        active ? "border-maroon bg-maroon-soft/50" : "border-sand bg-white/50 hover:border-maroon/30",
      )}
    >
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", active ? "bg-maroon text-ivory" : "bg-ivory-200 text-ink-soft")}>
        {icon}
      </span>
      <span>
        <span className="block text-sm font-semibold text-ink">{title}</span>
        <span className="block text-xs text-ink-mute">{note}</span>
      </span>
    </button>
  );
}

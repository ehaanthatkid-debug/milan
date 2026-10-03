"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { Vendor } from "@/data/vendors";
import { SERVICE_FEE_RATE } from "@/data/shared";
import { Calendar } from "@/components/ui/Calendar";
import { Stepper } from "@/components/events/TicketPicker";
import { checkoutHref } from "@/lib/checkout";
import { blockedDates, useOrders } from "@/lib/orders";
import { useToday } from "@/lib/use-today";
import { cn, formatMoney, formatPrice, formatShortDate } from "@/lib/utils";

export function BookingCard({ vendor, serverToday }: { vendor: Vendor; serverToday: string }) {
  const today = useToday(serverToday);
  const orders = useOrders();
  const booked = [...vendor.bookedDates, ...blockedDates(orders, "booking", vendor.slug)];
  const [serviceIndex, setServiceIndex] = useState(0);
  const [date, setDate] = useState<string | null>(null);
  const [guests, setGuests] = useState(150);
  const service = vendor.services[serviceIndex];
  const perGuest = service.unit.includes("guest");
  const subtotal = service.price * (perGuest ? guests : 1);
  const href = date ? checkoutHref({ type: "booking", slug: vendor.slug, service: serviceIndex, date, guests: perGuest ? guests : undefined }) : "#availability";

  return (
    <>
      <div className="rounded-[1.75rem] border border-sand/80 bg-white/80 p-5 shadow-card backdrop-blur sm:p-6">
        <p className="text-sm text-ink-mute">Starting at</p>
        <p className="font-display text-3xl text-ink">
          {formatPrice(vendor.startingPrice)}
          <span className="font-sans text-base text-ink-mute"> / {vendor.priceUnit}</span>
        </p>

        <div className="mt-5">
          <p className="text-sm font-semibold text-ink">Service</p>
          <div className="mt-2 space-y-2" role="radiogroup" aria-label="Service">
            {vendor.services.map((s, i) => (
              <button
                key={s.name}
                type="button"
                role="radio"
                aria-checked={i === serviceIndex}
                onClick={() => setServiceIndex(i)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 text-left text-sm transition-all",
                  i === serviceIndex ? "border-maroon bg-maroon-soft/50" : "border-sand hover:border-maroon/30",
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{s.name}</span>
                  <span className="block text-xs text-ink-mute">{s.unit}</span>
                </span>
                <span className="shrink-0 font-semibold text-ink">{formatPrice(s.price)}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {perGuest && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">Guests</span>
                <Stepper value={guests} onChange={setGuests} min={25} max={1500} step={25} />
              </div>
              <p className="mt-1 text-right text-xs text-ink-mute">Adjusts in steps of 25</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div id="availability" className="mt-5 scroll-mt-28 border-t border-sand/80 pt-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            <CalendarCheck className="size-4 text-maroon" /> Check availability
          </p>
          <Calendar today={today} booked={booked} selected={date} onSelect={setDate} />
        </div>

        <div className="mt-5 border-t border-sand/80 pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-ink-soft">{date ? formatShortDate(date) : "Select a date"}</span>
            <span className="font-display text-2xl text-ink">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-1 text-right text-xs text-ink-mute">
            + {formatMoney(subtotal * SERVICE_FEE_RATE)} Milan fee ({Math.round(SERVICE_FEE_RATE * 100)}%) at checkout
          </p>
        </div>

        <Link
          href={href}
          className={cn(
            "mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-full text-base font-semibold transition-all active:scale-[0.98]",
            date
              ? "bg-maroon text-ivory shadow-[0_12px_28px_-12px_rgb(122_18_48/0.9)] hover:bg-maroon-deep"
              : "border border-maroon/30 bg-maroon-soft text-maroon",
          )}
        >
          {date ? "Request booking" : "Pick a date to continue"}
        </Link>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-mute">
          <ShieldCheck className="size-3.5 text-leaf" /> Payment held until after your event
        </p>
      </div>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-sand/80 bg-ivory/95 px-4 pt-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto mb-3 flex max-w-md items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display text-xl leading-tight text-ink">{formatPrice(subtotal)}</p>
            <p className="truncate text-xs text-ink-mute">{date ? `${service.name} · ${formatShortDate(date)}` : "Pick a date to continue"}</p>
          </div>
          <Link
            href={href}
            className={cn(
              "inline-flex h-12 shrink-0 items-center rounded-full px-6 font-semibold active:scale-[0.97]",
              date ? "bg-maroon text-ivory" : "bg-maroon-soft text-maroon",
            )}
          >
            {date ? "Request booking" : "Check dates"}
          </Link>
        </div>
      </div>
    </>
  );
}

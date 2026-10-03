"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarPlus, ChevronDown, Ticket, Trash2 } from "lucide-react";
import { useState } from "react";
import { clearOrders, forgetProfile, useOrders, type StoredOrder } from "@/lib/orders";
import { downloadCalendarFile } from "@/lib/calendar";
import { useToday } from "@/lib/use-today";
import { cn, formatMoney, formatShortDate } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { Receipt } from "@/components/checkout/Receipt";
import { TicketStub } from "@/components/checkout/TicketStub";

const STATUS: Record<StoredOrder["kind"], { label: string; className: string }> = {
  event: { label: "Confirmed", className: "bg-leaf-soft text-leaf" },
  rent: { label: "Reserved", className: "bg-leaf-soft text-leaf" },
  buy: { label: "Preparing", className: "bg-saffron-soft text-gold-deep" },
  booking: { label: "Request sent", className: "bg-saffron-soft text-gold-deep" },
};

const DETAIL_PATH: Record<StoredOrder["kind"], string> = { event: "events", rent: "closet", buy: "closet", booking: "vendors" };

export function BookingsView({ serverToday }: { serverToday: string }) {
  const orders = useOrders();
  const today = useToday(serverToday);

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:px-8">
        <EmptyState
          icon={<Ticket className="size-7" strokeWidth={1.6} />}
          title="No bookings yet"
          description="Tickets, rentals, and vendor bookings you check out with will show up here — with QR codes ready for the door."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink href="/events">Find an event</ButtonLink>
              <ButtonLink href="/closet" variant="outline">
                Rent an outfit
              </ButtonLink>
            </div>
          }
        />
      </div>
    );
  }

  const upcoming = orders.filter((o) => !o.date || o.date >= today);
  const past = orders.filter((o) => o.date && o.date < today);

  return (
    <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl text-ink sm:text-6xl">My bookings</h1>
          <p className="mt-2 text-ink-soft">
            {orders.length} {orders.length === 1 ? "order" : "orders"} · saved on this device
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Remove all demo orders and saved details from this device?")) {
              clearOrders();
              forgetProfile();
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-mute transition-colors hover:bg-danger/5 hover:text-danger"
        >
          <Trash2 className="size-4" /> Clear demo data
        </button>
      </div>

      <Group title="Upcoming" orders={upcoming} defaultOpen={upcoming[0]?.number} />
      {past.length > 0 && <Group title="Past" orders={past} />}
    </div>
  );
}

function Group({ title, orders, defaultOpen }: { title: string; orders: StoredOrder[]; defaultOpen?: string }) {
  if (orders.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="text-xs font-semibold tracking-[0.2em] text-gold-deep uppercase">{title}</h2>
      <div className="mt-4 space-y-4">
        {orders.map((o) => (
          <BookingCard key={o.number} order={o} defaultOpen={o.number === defaultOpen} />
        ))}
      </div>
    </section>
  );
}

function BookingCard({ order, defaultOpen }: { order: StoredOrder; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const status = STATUS[order.kind];
  const keyFact = order.facts.find((f) => /date/i.test(f.label)) ?? order.facts[0];

  return (
    <div id={order.number} className="overflow-hidden rounded-[1.75rem] border border-sand/80 bg-white/70 shadow-card">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center gap-4 p-4 text-left sm:p-5">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl sm:size-20">
          <Image src={order.image} alt="" fill sizes="80px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[0.7rem] font-semibold tracking-[0.12em] text-gold-deep uppercase">{order.eyebrow}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-[0.68rem] font-semibold", status.className)}>{status.label}</span>
          </div>
          <p className="font-display mt-1 truncate text-lg text-ink sm:text-xl">{order.title}</p>
          <p className="mt-0.5 text-sm text-ink-mute">
            {keyFact?.value}
            {order.tickets ? ` · ${order.tickets.codes.length} ${order.tickets.codes.length === 1 ? "ticket" : "tickets"}` : ""}
          </p>
        </div>
        <div className="hidden shrink-0 text-right sm:block">
          <p className="font-display text-xl text-ink">{order.total === 0 ? "Free" : formatMoney(order.paidToday)}</p>
          <p className="text-xs text-ink-mute">{order.number}</p>
        </div>
        <ChevronDown className={cn("size-5 shrink-0 text-ink-mute transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-5 border-t border-sand/80 bg-ivory/50 p-4 sm:p-6">
              {order.tickets && order.tickets.codes.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {order.tickets.codes.map((code, i) => (
                    <TicketStub
                      key={code}
                      code={code}
                      index={i}
                      count={order.tickets!.codes.length}
                      title={order.title}
                      date={order.facts.find((f) => f.label === "Date")?.value ?? ""}
                      tier={order.tickets!.tierName}
                      holder={i === 0 ? order.name : `Guest of ${order.name.split(" ")[0]}`}
                    />
                  ))}
                </div>
              )}
              {order.schedule.length > 0 && (
                <p className="rounded-2xl bg-saffron-soft px-4 py-3 text-sm text-gold-deep">
                  Next payment: {formatMoney(order.schedule[0].amount)}
                  {order.schedule[0].date ? ` on ${formatShortDate(order.schedule[0].date)}` : ""}
                </p>
              )}
              <Receipt order={order} />
              <div className="flex flex-wrap gap-2">
                {order.calendar && (
                  <button
                    type="button"
                    onClick={() => downloadCalendarFile(order.calendar!, order.number)}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-sm font-medium text-ink hover:border-maroon/40 hover:text-maroon"
                  >
                    <CalendarPlus className="size-4" /> Add to calendar
                  </button>
                )}
                <Link
                  href={`/${DETAIL_PATH[order.kind]}/${order.slug}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-sm font-medium text-ink hover:border-maroon/40 hover:text-maroon"
                >
                  View listing <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

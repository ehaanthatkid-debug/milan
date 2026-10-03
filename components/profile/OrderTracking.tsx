"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Truck } from "lucide-react";
import { useState } from "react";
import type { StoredOrder } from "@/lib/orders";
import { trackOrder } from "@/lib/tracking";
import { cn, formatMoney } from "@/lib/utils";
import { Receipt } from "@/components/checkout/Receipt";
import { TicketStub } from "@/components/checkout/TicketStub";

const DETAIL_PATH: Record<StoredOrder["kind"], string> = { event: "events", rent: "closet", buy: "closet", booking: "vendors" };

/** One order with live tracking, receipt, and tickets. */
export function OrderTrackingCard({ order, now, defaultOpen = false }: { order: StoredOrder; now: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const t = trackOrder(order, now);

  return (
    <div id={order.number} className="overflow-hidden rounded-[1.75rem] border border-sand/80 bg-white/70 shadow-card">
      <div className="flex gap-4 p-4 sm:p-5">
        <Link href={`/${DETAIL_PATH[order.kind]}/${order.slug}`} className="relative size-16 shrink-0 overflow-hidden rounded-2xl sm:size-20">
          <Image src={order.image} alt="" fill sizes="80px" className="object-cover" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[0.7rem] font-semibold tracking-[0.12em] text-gold-deep uppercase">{order.eyebrow}</p>
              <p className="font-display truncate text-lg text-ink sm:text-xl">{order.title}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-lg text-ink">{order.total === 0 ? "Free" : formatMoney(order.paidToday)}</p>
              <p className="text-xs text-ink-mute">{order.number}</p>
            </div>
          </div>
          <p className={cn("mt-2 flex items-center gap-2 text-sm font-medium", t.tone === "done" ? "text-leaf" : "text-maroon")}>
            <span className={cn("relative size-2 rounded-full", t.tone === "done" ? "bg-leaf" : "bg-maroon")}>
              {t.tone !== "done" && <span className="absolute inset-0 animate-ping rounded-full bg-maroon/60" />}
            </span>
            {t.headline}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand/70">
            <motion.div className={cn("h-full rounded-full", t.tone === "done" ? "bg-leaf" : "bg-maroon")} animate={{ width: `${Math.max(6, t.progress * 100)}%` }} transition={{ duration: 0.8 }} />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between border-t border-sand/70 px-5 py-3 text-sm font-medium text-ink-soft hover:bg-ivory-100"
      >
        <span className="flex items-center gap-2">
          <Truck className="size-4" /> {order.tickets ? "Tickets, tracking & receipt" : "Tracking & receipt"}
        </span>
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="grid grid-cols-1 gap-6 border-t border-sand/70 bg-ivory/50 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <ol className="relative space-y-5 self-start before:absolute before:top-2 before:bottom-2 before:left-[0.8rem] before:w-px before:bg-sand-deep/70">
                {t.steps.map((step, i) => {
                  const current = !step.done && (i === 0 || t.steps[i - 1].done);
                  return (
                    <li key={step.label} className="relative flex gap-3">
                      <span
                        className={cn(
                          "relative z-10 grid size-[1.6rem] shrink-0 place-items-center rounded-full ring-4 ring-ivory",
                          step.done ? "bg-leaf text-ivory" : current ? "bg-maroon text-ivory" : "bg-sand text-ink-mute",
                        )}
                      >
                        {step.done ? <Check className="size-3.5" strokeWidth={3} /> : <span className="size-1.5 rounded-full bg-current" />}
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className={cn("text-sm font-semibold", step.done || current ? "text-ink" : "text-ink-mute")}>{step.label}</p>
                        {(step.detail || step.when) && (
                          <p className="text-xs text-ink-mute">
                            {step.when}
                            {step.when && step.detail ? " · " : ""}
                            {step.detail}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
              <div className="space-y-4">
                {order.tickets && order.tickets.codes.length > 0 && (
                  <div className="grid gap-3">
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
                <Receipt order={order} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

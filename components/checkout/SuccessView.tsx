"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarPlus, Mail, Printer, Ticket } from "lucide-react";
import type { Order } from "@/lib/checkout";
import { downloadCalendarFile } from "@/lib/calendar";
import type { StoredOrder } from "@/lib/orders";
import { ButtonLink } from "@/components/ui/Button";
import { Receipt } from "./Receipt";
import { TicketStub } from "./TicketStub";

const ease = [0.22, 1, 0.36, 1] as const;

export function SuccessView({ order, stored }: { order: Order; stored: StoredOrder }) {
  const tickets = stored.tickets;
  const eventDate = order.facts.find((f) => f.label === "Date")?.value ?? "";

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 pb-10 sm:px-6 lg:pt-12">
      <div className="text-center">
        <Burst />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease }}
          className="mt-6 text-xs font-semibold tracking-[0.2em] text-gold-deep uppercase"
        >
          Order {stored.number}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease }}
          className="font-display mt-2 text-5xl text-ink sm:text-6xl"
        >
          {order.successTitle}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="mx-auto mt-3 max-w-md text-lg text-ink-soft"
        >
          {order.successMessage}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-leaf-soft px-4 py-1.5 text-sm text-leaf"
        >
          <Mail className="size-4" /> Receipt sent to {stored.email}
        </motion.p>
      </div>

      {tickets && tickets.codes.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7, ease }}
          className="mt-10"
        >
          <h2 className="font-display flex items-center gap-2 text-2xl text-ink">
            <Ticket className="size-5 text-maroon" /> Your {tickets.codes.length === 1 ? "ticket" : `${tickets.codes.length} tickets`}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {tickets.codes.map((code, i) => (
              <TicketStub
                key={code}
                code={code}
                index={i}
                count={tickets.codes.length}
                title={stored.title}
                date={eventDate}
                tier={tickets.tierName}
                holder={i === 0 ? stored.name : `Guest of ${stored.name.split(" ")[0]}`}
              />
            ))}
          </div>
        </motion.section>
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7, ease }}
        className="mt-10"
      >
        <Receipt order={stored} />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.7, ease }}
        className="mt-10 print:hidden"
      >
        <h2 className="font-display text-3xl text-ink">What happens next</h2>
        <ol className="relative mt-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[1.1rem] before:w-px before:bg-sand-deep/70">
          {order.nextSteps.map((s, i) => (
            <li key={s.title} className="relative flex gap-4">
              <span className="font-display relative z-10 grid size-9 shrink-0 place-items-center rounded-full bg-maroon text-sm font-semibold text-ivory ring-4 ring-ivory">
                {i + 1}
              </span>
              <div className="pt-1">
                <p className="font-semibold text-ink">{s.title}</p>
                <p className="mt-1 leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-10 flex flex-col flex-wrap gap-3 sm:flex-row print:hidden"
      >
        <ButtonLink href="/bookings" size="lg" className="h-12">
          <Ticket className="size-4" /> View in My bookings
        </ButtonLink>
        {stored.calendar && (
          <button
            type="button"
            onClick={() => downloadCalendarFile(stored.calendar!, stored.number)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink/15 px-6 font-medium text-ink transition-all hover:border-maroon/40 hover:bg-maroon-soft/60 hover:text-maroon active:scale-[0.97]"
          >
            <CalendarPlus className="size-4" /> Add to calendar
          </button>
        )}
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink/15 px-6 font-medium text-ink transition-all hover:border-maroon/40 hover:bg-maroon-soft/60 hover:text-maroon active:scale-[0.97]"
        >
          <Printer className="size-4" /> Print receipt
        </button>
        <Link href={order.continueHref} className="inline-flex h-12 items-center justify-center gap-1.5 px-4 text-sm font-medium text-ink-soft hover:text-maroon">
          {order.continueLabel} <ArrowRight className="size-4" />
        </Link>
      </motion.div>
    </div>
  );
}

/** Animated check mark with a small burst of gold and saffron sparks. */
function Burst() {
  const sparks = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    return { x: Math.cos(angle) * 78, y: Math.sin(angle) * 78, color: i % 3 === 0 ? "#7A1230" : i % 2 ? "#E8B15B" : "#C89B3C" };
  });
  return (
    <div className="relative mx-auto grid size-24 place-items-center print:hidden">
      {sparks.map((s, i) => (
        <motion.span
          key={i}
          className="absolute size-2 rounded-full"
          style={{ background: s.color }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{ x: s.x, y: s.y, opacity: [0, 1, 0], scale: [0.4, 1, 0.6] }}
          transition={{ delay: 0.35, duration: 0.9, ease: "easeOut" }}
        />
      ))}
      <motion.span
        className="absolute inset-0 rounded-full bg-maroon-soft"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: [0.4, 1.25, 1], opacity: 1 }}
        transition={{ duration: 0.6, ease }}
      />
      <motion.span
        className="relative grid size-16 place-items-center rounded-full bg-maroon shadow-float"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
      >
        <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="#FBF6EE" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.35, duration: 0.45, ease: "easeOut" }}
          />
        </svg>
      </motion.span>
    </div>
  );
}

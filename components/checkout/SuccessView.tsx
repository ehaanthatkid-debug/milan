"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarPlus, Mail } from "lucide-react";
import type { Order } from "@/lib/checkout";
import { ButtonLink } from "@/components/ui/Button";
import { formatMoney } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

function icsDate(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}

function downloadCalendar(order: Order, orderNumber: string) {
  if (!order.calendar) return;
  const c = order.calendar;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Utsav//Celebrations//EN",
    "BEGIN:VEVENT",
    `UID:${orderNumber}@utsav`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(c.start)}`,
    `DTEND:${icsDate(c.end)}`,
    `SUMMARY:${c.title}`,
    `LOCATION:${c.location.replace(/,/g, "\\,")}`,
    `DESCRIPTION:Utsav order ${orderNumber}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${c.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export function SuccessView({
  order,
  orderNumber,
  email,
  cardLast4,
  cardBrand,
}: {
  order: Order;
  orderNumber: string;
  email: string;
  cardLast4?: string;
  cardBrand?: string | null;
}) {
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
          Order {orderNumber}
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
          <Mail className="size-4" /> Confirmation sent to {email}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7, ease }}
        className="mt-10 overflow-hidden rounded-[1.75rem] border border-sand/80 bg-white/80 shadow-card"
      >
        <div className="flex gap-4 border-b border-sand/80 p-5 sm:p-6">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl sm:size-24">
            <Image src={order.image} alt="" fill sizes="96px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-gold-deep uppercase">{order.eyebrow}</p>
            <p className="font-display mt-1 text-xl leading-snug text-ink sm:text-2xl">{order.title}</p>
            <p className="mt-1 text-sm text-ink-mute">
              {order.total === 0
                ? "No payment needed"
                : `Paid ${formatMoney(order.total)}${cardLast4 ? ` · ${cardBrand ?? "Card"} ending ${cardLast4}` : ""}`}
            </p>
          </div>
        </div>
        <dl className="grid gap-4 p-5 text-sm sm:grid-cols-3 sm:p-6">
          {order.facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs font-semibold tracking-wider text-ink-mute uppercase">{f.label}</dt>
              <dd className="mt-1 font-medium text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.7, ease }}
        className="mt-10"
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
        className="mt-10 flex flex-col gap-3 sm:flex-row"
      >
        {order.calendar && (
          <button
            type="button"
            onClick={() => downloadCalendar(order, orderNumber)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-maroon px-6 font-medium text-ivory transition-all hover:bg-maroon-deep active:scale-[0.97]"
          >
            <CalendarPlus className="size-4" /> Add to calendar
          </button>
        )}
        <ButtonLink href={order.continueHref} variant={order.calendar ? "outline" : "primary"} size="lg" className="h-12">
          {order.continueLabel} <ArrowRight className="size-4" />
        </ButtonLink>
        <Link href="/" className="inline-flex h-12 items-center justify-center px-4 text-sm font-medium text-ink-soft hover:text-maroon">
          Back to home
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
    <div className="relative mx-auto grid size-24 place-items-center">
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

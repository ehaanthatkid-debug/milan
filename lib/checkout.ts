import { getEvent } from "@/data/events";
import { getOutfit, RENTAL_DAYS } from "@/data/closet";
import { getVendor } from "@/data/vendors";
import { SERVICE_FEE_RATE } from "@/data/shared";
import { BRAND } from "./brand";
import type { Promo } from "./promo";
import { formatLongDate, formatShortDate, formatTime, parseLocalDate, toISODate } from "./utils";

export const DELIVERY_FEE = 15;
/** How long tickets and rental dates are held while you check out. */
export const HOLD_MINUTES = 10;
/** Share of a vendor booking paid up front on the deposit plan. */
export const BOOKING_DEPOSIT_RATE = 0.25;

export type CheckoutRequest =
  | { type: "event"; slug: string; tier: number; qty: number }
  | { type: "rent"; slug: string; start: string; delivery: "pickup" | "delivery" }
  | { type: "buy"; slug: string; delivery: "pickup" | "delivery" }
  | { type: "booking"; slug: string; service: number; date: string; guests?: number };

export type OrderKind = CheckoutRequest["type"];

export function checkoutHref(req: CheckoutRequest) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(req)) if (v !== undefined) params.set(k, String(v));
  return `/checkout?${params}`;
}

export type OrderLine = { label: string; detail?: string; amount: number };

export type Order = {
  kind: OrderKind;
  slug: string;
  backHref: string;
  eyebrow: string;
  title: string;
  image: string;
  facts: { label: string; value: string }[];
  lines: OrderLine[];
  subtotal: number;
  /** Refundable security deposit (rentals). */
  deposit: number;
  /** The date that matters for this order — event day, rental pickup, or booking date. */
  date?: string;
  /** Dates this order takes off the calendar (rental window or booking day). */
  blockDates: string[];
  tickets?: { tierIndex: number; tierName: string; qty: number };
  needsAddress: boolean;
  needsEventDetails: boolean;
  holdsInventory: boolean;
  successTitle: string;
  successMessage: string;
  nextSteps: { title: string; text: string }[];
  calendar?: { title: string; start: Date; end: Date; location: string };
  continueHref: string;
  continueLabel: string;
};

export const round = (n: number) => Math.round(n * 100) / 100;

export function addDaysISO(iso: string, n: number) {
  const d = parseLocalDate(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

/** Turns checkout URL parameters into an order, or null if they're invalid. */
export function buildOrder(sp: URLSearchParams): Order | null {
  const type = sp.get("type");
  const slug = sp.get("slug") ?? "";

  if (type === "event") {
    const event = getEvent(slug);
    const tierIndex = Number(sp.get("tier") ?? 0);
    const tier = event?.tiers[tierIndex];
    if (!event || !tier || tier.soldOut) return null;
    const qty = Math.min(10, Math.max(1, Number(sp.get("qty") ?? 1) || 1));
    const subtotal = round(tier.price * qty);
    const start = parseLocalDate(event.date, event.startTime);
    const end = parseLocalDate(event.date, event.endTime);
    if (end <= start) end.setDate(end.getDate() + 1);
    const free = subtotal === 0;
    return {
      kind: "event",
      slug,
      backHref: `/events/${slug}`,
      eyebrow: free ? "RSVP" : "Event tickets",
      title: event.title,
      image: event.image,
      facts: [
        { label: "Date", value: formatLongDate(event.date) },
        { label: "Time", value: `${formatTime(event.startTime)} – ${formatTime(event.endTime)}` },
        { label: "Venue", value: `${event.venue.name}, ${event.city}` },
        { label: "Ages", value: event.ages.label },
      ],
      lines: [{ label: tier.name, detail: `${qty} × ${free ? "Free" : `$${tier.price}`}`, amount: subtotal }],
      subtotal,
      deposit: 0,
      date: event.date,
      blockDates: [],
      tickets: { tierIndex, tierName: tier.name, qty },
      needsAddress: false,
      needsEventDetails: false,
      holdsInventory: true,
      successTitle: free ? "You're on the list!" : "You're going!",
      successMessage: `${qty} ${qty === 1 ? "spot" : "spots"} for ${event.title} on ${formatShortDate(event.date)}.`,
      nextSteps: [
        { title: "Your tickets are ready", text: "Show these QR codes at the door — they're also saved in My bookings on this device." },
        { title: "Reminder the day before", text: `We'll email you the day before with parking tips. Doors open around ${formatTime(event.startTime)}.` },
        { title: "Plans changed?", text: "Transfer tickets to a friend anytime, or get a full refund up to 7 days before." },
      ],
      calendar: { title: event.title, start, end, location: `${event.venue.name}, ${event.venue.address}` },
      continueHref: "/events",
      continueLabel: "Explore more events",
    };
  }

  if (type === "rent" || type === "buy") {
    const outfit = getOutfit(slug);
    if (!outfit) return null;
    const delivery = sp.get("delivery") === "delivery" ? "delivery" : "pickup";
    const deliveryLine: OrderLine[] =
      delivery === "delivery" ? [{ label: "Eastside delivery", detail: "Delivered in a garment bag", amount: DELIVERY_FEE }] : [];

    if (type === "rent") {
      const start = sp.get("start");
      if (!outfit.rentPrice || !start || !/^\d{4}-\d{2}-\d{2}$/.test(start)) return null;
      const end = addDaysISO(start, RENTAL_DAYS - 1);
      const lines: OrderLine[] = [
        { label: `${RENTAL_DAYS}-day rental`, detail: `${formatShortDate(start)} – ${formatShortDate(end)}`, amount: outfit.rentPrice },
        ...deliveryLine,
      ];
      return {
        kind: "rent",
        slug,
        backHref: `/closet/${slug}`,
        eyebrow: "Festive Closet rental",
        title: outfit.name,
        image: outfit.images[0],
        facts: [
          { label: "Size", value: outfit.size },
          { label: "Rental dates", value: `${formatShortDate(start)} – ${formatShortDate(end)}` },
          {
            label: delivery === "delivery" ? "Delivery" : "Pickup",
            value: delivery === "delivery" ? `Delivered ${formatShortDate(start)}` : `${outfit.owner.name}, ${outfit.city}`,
          },
        ],
        lines,
        subtotal: round(lines.reduce((s, l) => s + l.amount, 0)),
        deposit: outfit.deposit,
        date: start,
        blockDates: Array.from({ length: RENTAL_DAYS }, (_, i) => addDaysISO(start, i)),
        needsAddress: delivery === "delivery",
        needsEventDetails: false,
        holdsInventory: true,
        successTitle: "Your outfit is reserved",
        successMessage: `${outfit.name} is held for you from ${formatShortDate(start)} to ${formatShortDate(end)}.`,
        nextSteps: [
          { title: `${outfit.owner.name} confirms`, text: `${outfit.owner.responseTime.replace("Replies", "They'll confirm")} and send fitting notes.` },
          {
            title: delivery === "delivery" ? `Delivered ${formatShortDate(start)}` : `Pick up ${formatShortDate(start)}`,
            text: "Steamed, in a garment bag, with a prepaid return label and a mini sewing kit.",
          },
          {
            title: `Return by ${formatShortDate(addDaysISO(end, 1))}`,
            text: `Your $${outfit.deposit} deposit is refunded within 48 hours of the return check.`,
          },
        ],
        calendar: {
          title: `Pick up: ${outfit.name}`,
          start: parseLocalDate(start, "10:00"),
          end: parseLocalDate(start, "10:30"),
          location: delivery === "delivery" ? "Delivery to your address" : `${outfit.owner.name}, ${outfit.city}, WA`,
        },
        continueHref: "/closet",
        continueLabel: "Keep browsing the closet",
      };
    }

    if (!outfit.buyPrice) return null;
    const lines: OrderLine[] = [{ label: "Purchase", detail: `Size ${outfit.size} · ${outfit.condition}`, amount: outfit.buyPrice }, ...deliveryLine];
    return {
      kind: "buy",
      slug,
      backHref: `/closet/${slug}`,
      eyebrow: "Festive Closet purchase",
      title: outfit.name,
      image: outfit.images[0],
      facts: [
        { label: "Size", value: outfit.size },
        { label: "Condition", value: outfit.condition },
        {
          label: delivery === "delivery" ? "Delivery" : "Pickup",
          value: delivery === "delivery" ? "Eastside delivery in 2–3 days" : `${outfit.owner.name}, ${outfit.city}`,
        },
      ],
      lines,
      subtotal: round(lines.reduce((s, l) => s + l.amount, 0)),
      deposit: 0,
      blockDates: [],
      needsAddress: delivery === "delivery",
      needsEventDetails: false,
      holdsInventory: false,
      successTitle: "It's yours!",
      successMessage: `${outfit.name} is officially joining your closet.`,
      nextSteps: [
        { title: `${outfit.owner.name} prepares your order`, text: "Freshly steamed and packed within two days." },
        { title: delivery === "delivery" ? "Delivered to your door" : "Pick up in person", text: "We'll text you a time window and a tracking link." },
        { title: "7-day fit promise", text: `If it doesn't fit, list it back on ${BRAND.name} for free — or return it within a week.` },
      ],
      continueHref: "/closet",
      continueLabel: "Keep browsing the closet",
    };
  }

  if (type === "booking") {
    const vendor = getVendor(slug);
    const service = vendor?.services[Number(sp.get("service") ?? 0)];
    const date = sp.get("date");
    if (!vendor || !service || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
    const perGuest = service.unit.includes("guest");
    const guests = perGuest ? Math.min(1500, Math.max(25, Number(sp.get("guests") ?? 100) || 100)) : 1;
    const subtotal = round(service.price * guests);
    return {
      kind: "booking",
      slug,
      backHref: `/vendors/${slug}`,
      eyebrow: `${vendor.category} booking`,
      title: vendor.name,
      image: vendor.image,
      facts: [
        { label: "Service", value: service.name },
        { label: "Event date", value: formatLongDate(date) },
        ...(perGuest ? [{ label: "Guests", value: String(guests) }] : [{ label: "Includes", value: service.unit }]),
      ],
      lines: [{ label: service.name, detail: perGuest ? `${guests} guests × $${service.price}` : service.unit, amount: subtotal }],
      subtotal,
      deposit: 0,
      date,
      blockDates: [date],
      needsAddress: false,
      needsEventDetails: true,
      holdsInventory: false,
      successTitle: "Booking requested",
      successMessage: `${vendor.name} has your request for ${formatShortDate(date)}.`,
      nextSteps: [
        { title: `${vendor.name} confirms`, text: `${vendor.responseTime}. If they can't make your date, you're refunded in full automatically.` },
        { title: "Planning call", text: "Pick a time for a 20-minute call to finalize timing, music, menu, or design details." },
        { title: "Payment held until your event", text: `${BRAND.name} holds your payment and releases it to the vendor after your celebration.` },
      ],
      calendar: {
        title: `${service.name} — ${vendor.name}`,
        start: parseLocalDate(date, "17:00"),
        end: parseLocalDate(date, "22:00"),
        location: `${vendor.city}, WA`,
      },
      continueHref: "/vendors",
      continueLabel: "Browse more vendors",
    };
  }

  return null;
}

/* ---------- Pricing: promo codes, service fee, and payment plans ---------- */

export type PlanId = "full" | "deposit" | "split4";

export type PaymentPlan = { id: PlanId; title: string; description: string };

export function availablePlans(order: Order, total: number): PaymentPlan[] {
  const plans: PaymentPlan[] = [{ id: "full", title: "Pay in full", description: "One payment today" }];
  if (total <= 0) return plans;
  if (order.kind === "booking") {
    plans.push({
      id: "deposit",
      title: `Reserve with ${Math.round(BOOKING_DEPOSIT_RATE * 100)}% today`,
      description: "The rest is due 14 days before your event",
    });
  } else if (order.kind !== "rent" && total >= 100) {
    plans.push({ id: "split4", title: "Split into 4 payments", description: "Interest-free, every two weeks" });
  }
  return plans;
}

export type ScheduledPayment = { label: string; amount: number; date?: string };

export type Pricing = {
  subtotal: number;
  discount: number;
  serviceFee: number;
  feeWaived: boolean;
  deposit: number;
  total: number;
  dueToday: number;
  schedule: ScheduledPayment[];
};

export function priceOrder(order: Order, promo: Promo | null, plan: PlanId, today: string): Pricing {
  const subtotal = order.subtotal;
  let discount = 0;
  let feeWaived = false;
  if (promo && subtotal > 0) {
    if (promo.kind === "percent") discount = round(subtotal * promo.value);
    if (promo.kind === "amount") discount = Math.min(promo.value, subtotal);
    if (promo.kind === "fee") feeWaived = true;
  }
  const serviceFee = feeWaived ? 0 : round((subtotal - discount) * SERVICE_FEE_RATE);
  const total = round(subtotal - discount + serviceFee + order.deposit);

  let dueToday = total;
  const schedule: ScheduledPayment[] = [];
  if (plan === "deposit" && order.kind === "booking" && order.date) {
    dueToday = round(total * BOOKING_DEPOSIT_RATE);
    let due = addDaysISO(order.date, -14);
    if (due <= today) due = addDaysISO(today, 1);
    schedule.push({ label: "Remaining balance", amount: round(total - dueToday), date: due });
  } else if (plan === "split4") {
    const part = round(total / 4);
    dueToday = part;
    for (let i = 1; i < 4; i++) {
      schedule.push({
        label: `Payment ${i + 1} of 4`,
        amount: i === 3 ? round(total - part * 3) : part,
        date: addDaysISO(today, 14 * i),
      });
    }
  }
  return { subtotal, discount, serviceFee, feeWaived, deposit: order.deposit, total, dueToday, schedule };
}

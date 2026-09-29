import { getEvent } from "@/data/events";
import { getOutfit, RENTAL_DAYS } from "@/data/closet";
import { getVendor } from "@/data/vendors";
import { SERVICE_FEE_RATE } from "@/data/shared";
import { formatLongDate, formatShortDate, formatTime, parseLocalDate, toISODate } from "./utils";

export const DELIVERY_FEE = 15;

export type CheckoutRequest =
  | { type: "event"; slug: string; tier: number; qty: number }
  | { type: "rent"; slug: string; start: string; delivery: "pickup" | "delivery" }
  | { type: "buy"; slug: string; delivery: "pickup" | "delivery" }
  | { type: "booking"; slug: string; service: number; date: string; guests?: number };

export function checkoutHref(req: CheckoutRequest) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(req)) if (v !== undefined) params.set(k, String(v));
  return `/checkout?${params}`;
}

export type OrderLine = { label: string; detail?: string; amount: number };

export type Order = {
  kind: CheckoutRequest["type"];
  eyebrow: string;
  title: string;
  image: string;
  facts: { label: string; value: string }[];
  lines: OrderLine[];
  subtotal: number;
  serviceFee: number;
  deposit: number;
  total: number;
  payLabel: string;
  successTitle: string;
  successMessage: string;
  nextSteps: { title: string; text: string }[];
  calendar?: { title: string; start: Date; end: Date; location: string };
  continueHref: string;
  continueLabel: string;
};

const round = (n: number) => Math.round(n * 100) / 100;

function addDaysISO(iso: string, n: number) {
  const d = parseLocalDate(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

/** Turns checkout URL parameters into a fully priced order, or null if they're invalid. */
export function buildOrder(sp: URLSearchParams): Order | null {
  const type = sp.get("type");
  const slug = sp.get("slug") ?? "";

  if (type === "event") {
    const event = getEvent(slug);
    const tier = event?.tiers[Number(sp.get("tier") ?? 0)];
    if (!event || !tier || tier.soldOut) return null;
    const qty = Math.min(10, Math.max(1, Number(sp.get("qty") ?? 1) || 1));
    const subtotal = round(tier.price * qty);
    const serviceFee = round(subtotal * SERVICE_FEE_RATE);
    const start = parseLocalDate(event.date, event.startTime);
    const end = parseLocalDate(event.date, event.endTime);
    if (end <= start) end.setDate(end.getDate() + 1);
    const free = subtotal === 0;
    return {
      kind: "event",
      eyebrow: free ? "RSVP" : "Event tickets",
      title: event.title,
      image: event.image,
      facts: [
        { label: "Date", value: `${formatLongDate(event.date)}` },
        { label: "Time", value: `${formatTime(event.startTime)} – ${formatTime(event.endTime)}` },
        { label: "Venue", value: `${event.venue.name}, ${event.city}` },
      ],
      lines: [{ label: `${tier.name}`, detail: `${qty} × ${free ? "Free" : `$${tier.price}`}`, amount: subtotal }],
      subtotal,
      serviceFee,
      deposit: 0,
      total: round(subtotal + serviceFee),
      payLabel: free ? "Confirm RSVP" : "Pay",
      successTitle: free ? "You're on the list!" : "You're going!",
      successMessage: `${qty} ${qty === 1 ? "spot" : "spots"} for ${event.title} on ${formatShortDate(event.date)}.`,
      nextSteps: [
        { title: "Tickets sent to your email", text: "Your QR-code tickets arrive in the next few minutes — they're also saved in your Utsav account." },
        { title: "Add it to your calendar", text: `Doors open around ${formatTime(event.startTime)}. We'll send a reminder the day before with parking tips.` },
        { title: "Show your QR code at the door", text: `${event.organizer.name} will scan you in at ${event.venue.name.split(" — ")[0]}.` },
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
      const subtotal = round(lines.reduce((s, l) => s + l.amount, 0));
      const serviceFee = round(subtotal * SERVICE_FEE_RATE);
      return {
        kind: "rent",
        eyebrow: "Festive Closet rental",
        title: outfit.name,
        image: outfit.images[0],
        facts: [
          { label: "Size", value: outfit.size },
          { label: "Rental dates", value: `${formatShortDate(start)} – ${formatShortDate(end)}` },
          { label: delivery === "delivery" ? "Delivery" : "Pickup", value: delivery === "delivery" ? `Delivered ${formatShortDate(start)}` : `${outfit.owner.name}, ${outfit.city}` },
        ],
        lines,
        subtotal,
        serviceFee,
        deposit: outfit.deposit,
        total: round(subtotal + serviceFee + outfit.deposit),
        payLabel: "Pay",
        successTitle: "Your outfit is reserved",
        successMessage: `${outfit.name} is held for you from ${formatShortDate(start)} to ${formatShortDate(end)}.`,
        nextSteps: [
          { title: `${outfit.owner.name} confirms`, text: `${outfit.owner.responseTime.replace("Replies", "They'll confirm")} and send fitting notes.` },
          {
            title: delivery === "delivery" ? `Delivered ${formatShortDate(start)}` : `Pick up ${formatShortDate(start)}`,
            text: "Steamed, in a garment bag, with a pre-paid return label and a mini sewing kit.",
          },
          { title: `Return by ${formatShortDate(addDaysISO(end, 1))}`, text: `Your $${outfit.deposit} deposit is refunded within 48 hours of the return check.` },
        ],
        continueHref: "/closet",
        continueLabel: "Keep browsing the closet",
      };
    }

    if (!outfit.buyPrice) return null;
    const lines: OrderLine[] = [{ label: "Purchase", detail: `Size ${outfit.size} · ${outfit.condition}`, amount: outfit.buyPrice }, ...deliveryLine];
    const subtotal = round(lines.reduce((s, l) => s + l.amount, 0));
    const serviceFee = round(subtotal * SERVICE_FEE_RATE);
    return {
      kind: "buy",
      eyebrow: "Festive Closet purchase",
      title: outfit.name,
      image: outfit.images[0],
      facts: [
        { label: "Size", value: outfit.size },
        { label: "Condition", value: outfit.condition },
        { label: delivery === "delivery" ? "Delivery" : "Pickup", value: delivery === "delivery" ? "Eastside delivery in 2–3 days" : `${outfit.owner.name}, ${outfit.city}` },
      ],
      lines,
      subtotal,
      serviceFee,
      deposit: 0,
      total: round(subtotal + serviceFee),
      payLabel: "Pay",
      successTitle: "It's yours!",
      successMessage: `${outfit.name} is officially joining your closet.`,
      nextSteps: [
        { title: `${outfit.owner.name} prepares your order`, text: "Freshly steamed and packed within two days." },
        { title: delivery === "delivery" ? "Delivered to your door" : "Pick up in person", text: "We'll text you a time window and a tracking link." },
        { title: "7-day fit promise", text: "If it doesn't fit, list it back on Utsav for free — or return it within a week." },
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
    const serviceFee = round(subtotal * SERVICE_FEE_RATE);
    return {
      kind: "booking",
      eyebrow: `${vendor.category} booking`,
      title: vendor.name,
      image: vendor.image,
      facts: [
        { label: "Service", value: service.name },
        { label: "Event date", value: formatLongDate(date) },
        ...(perGuest ? [{ label: "Guests", value: String(guests) }] : [{ label: "Includes", value: service.unit }]),
      ],
      lines: [
        {
          label: service.name,
          detail: perGuest ? `${guests} guests × $${service.price}` : service.unit,
          amount: subtotal,
        },
      ],
      subtotal,
      serviceFee,
      deposit: 0,
      total: round(subtotal + serviceFee),
      payLabel: "Pay & request booking",
      successTitle: "Booking requested",
      successMessage: `${vendor.name} has your request for ${formatShortDate(date)}.`,
      nextSteps: [
        { title: `${vendor.name} confirms`, text: `${vendor.responseTime}. If they can't make your date, you're refunded in full automatically.` },
        { title: "Planning call", text: "Pick a time for a 20-minute call to finalize timing, music, menu, or design details." },
        { title: "Payment held until your event", text: "Utsav holds your payment and releases it to the vendor after your celebration." },
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

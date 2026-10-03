import type { StoredOrder } from "./orders";
import { addDaysISO } from "./checkout";
import { formatShortDate, parseLocalDate } from "./utils";

/**
 * Order tracking for the demo. Early steps (confirmed, packed, out for
 * delivery) advance on a sped-up clock so you can watch an order progress
 * during a demo; date-based steps (pickup day, event day) follow the calendar.
 */
const MIN = 60_000;
const DEMO = { confirmed: 0.4 * MIN, packed: 1.5 * MIN, outForDelivery: 3 * MIN, delivered: 6 * MIN };

export type TrackingStep = { label: string; detail?: string; done: boolean; when?: string };
export type Tracking = { headline: string; tone: "progress" | "done" | "upcoming"; steps: TrackingStep[]; progress: number };

const clock = (t: number) => new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

function fulfillmentOf(o: StoredOrder) {
  if (o.fulfillment) return o.fulfillment;
  return o.facts.some((f) => /deliver/i.test(f.label)) ? "delivery" : "pickup";
}

function build(steps: TrackingStep[], headline: string): Tracking {
  const done = steps.filter((s) => s.done).length;
  return {
    headline,
    steps,
    progress: done / steps.length,
    tone: done === steps.length ? "done" : done <= 1 ? "upcoming" : "progress",
  };
}

export function trackOrder(o: StoredOrder, now: number): Tracking {
  const created = new Date(o.createdAt).getTime();
  const elapsed = now - created;
  const today = new Date(now);
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const seller = o.facts.find((f) => /pickup/i.test(f.label))?.value.split(",")[0];

  if (o.kind === "buy") {
    const delivery = fulfillmentOf(o) === "delivery";
    const steps: TrackingStep[] = [
      { label: "Order placed", when: clock(created), done: true },
      { label: "Confirmed by the seller", when: clock(created + DEMO.confirmed), done: elapsed >= DEMO.confirmed },
      { label: "Steamed & packed", when: clock(created + DEMO.packed), done: elapsed >= DEMO.packed },
      delivery
        ? { label: "Out for delivery", detail: "Ravi from Milan Delivery is on the way", when: clock(created + DEMO.outForDelivery), done: elapsed >= DEMO.outForDelivery }
        : { label: "Ready for pickup", detail: `Show order ${o.number} at the counter`, when: clock(created + DEMO.outForDelivery), done: elapsed >= DEMO.outForDelivery },
      delivery
        ? { label: "Delivered", when: clock(created + DEMO.delivered), done: elapsed >= DEMO.delivered }
        : { label: "Picked up", detail: "Pick up anytime in the next 7 days", done: false },
    ];
    const etaMin = Math.max(1, Math.ceil((DEMO.delivered - elapsed) / MIN));
    const headline =
      elapsed >= DEMO.delivered && delivery
        ? `Delivered at ${clock(created + DEMO.delivered)}`
        : elapsed >= DEMO.outForDelivery
          ? delivery
            ? `Out for delivery — arriving in about ${etaMin} min`
            : `Ready for pickup${seller ? ` at ${seller}` : ""}`
          : elapsed >= DEMO.packed
            ? "Packed and ready to go"
            : elapsed >= DEMO.confirmed
              ? "Confirmed — the seller is preparing it"
              : "Order placed — waiting for the seller to confirm";
    return build(steps.map((s) => ({ ...s, when: s.done ? s.when : undefined })), headline);
  }

  if (o.kind === "rent" && o.date) {
    const delivery = fulfillmentOf(o) === "delivery";
    const start = o.date;
    const returnBy = addDaysISO(start, o.blockDates.length || 4);
    const refund = addDaysISO(returnBy, 2);
    const steps: TrackingStep[] = [
      { label: "Rental reserved", when: clock(created), done: true },
      { label: "Confirmed by the boutique", when: clock(created + DEMO.confirmed), done: elapsed >= DEMO.confirmed },
      { label: "Steamed & packed", detail: "Includes a mini sewing kit and return label", done: elapsed >= DEMO.packed },
      { label: delivery ? "Delivered to you" : "Picked up", when: formatShortDate(start), done: todayISO >= start },
      { label: "Return by", when: formatShortDate(returnBy), done: todayISO > returnBy },
      { label: "Deposit refunded", when: formatShortDate(refund), done: todayISO >= refund },
    ];
    const headline =
      todayISO >= refund
        ? "Returned — deposit refunded"
        : todayISO >= start
          ? `With you — return by ${formatShortDate(returnBy)}`
          : elapsed >= DEMO.confirmed
            ? `${delivery ? "Arrives" : "Ready for pickup"} ${formatShortDate(start)}`
            : "Reserved — waiting for the boutique to confirm";
    return build(steps, headline);
  }

  if (o.kind === "event" && o.date) {
    const reminder = addDaysISO(o.date, -1);
    const steps: TrackingStep[] = [
      { label: o.total === 0 ? "RSVP confirmed" : "Tickets issued", when: clock(created), done: true },
      { label: "Reminder with parking tips", when: formatShortDate(reminder), done: todayISO >= reminder },
      { label: "Event day", when: formatShortDate(o.date), done: todayISO >= o.date },
    ];
    const days = Math.round((parseLocalDate(o.date).getTime() - parseLocalDate(todayISO).getTime()) / 86_400_000);
    const headline =
      days < 0 ? "Hope you had a great time!" : days === 0 ? "It's today — have fun!" : days === 1 ? "Tomorrow!" : `In ${days} days`;
    return build(steps, headline);
  }

  if (o.kind === "booking" && o.date) {
    const call = addDaysISO(o.createdAt.slice(0, 10), 3);
    const release = addDaysISO(o.date, 1);
    const confirmAt = 0.75 * MIN;
    const steps: TrackingStep[] = [
      { label: "Request sent", when: clock(created), done: true },
      { label: "Vendor confirmed your date", when: clock(created + confirmAt), done: elapsed >= confirmAt },
      { label: "Planning call", when: formatShortDate(call), done: todayISO >= call },
      { label: "Event day", when: formatShortDate(o.date), done: todayISO >= o.date },
      { label: "Payment released to vendor", when: formatShortDate(release), done: todayISO >= release },
    ];
    const headline =
      todayISO >= release
        ? "Complete — payment released"
        : elapsed >= confirmAt
          ? `Confirmed for ${formatShortDate(o.date)}`
          : "Waiting for the vendor to confirm";
    return build(steps, headline);
  }

  return build([{ label: "Order placed", when: clock(created), done: true }], "Order placed");
}

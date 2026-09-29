"use client";

import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, FlaskConical, Loader2, Lock, ShieldCheck, ShoppingBag } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { buildOrder } from "@/lib/checkout";
import { ButtonLink } from "@/components/ui/Button";
import { BackLink } from "@/components/detail/DetailBits";
import { EmptyState } from "@/components/ui/States";
import { formatMoney } from "@/lib/utils";
import { OrderSummary } from "./OrderSummary";
import { CardFields, EMPTY_FIELDS, Field, TextInput, cardBrand, validate, type FieldErrors, type PaymentFields } from "./PaymentForm";
import { SuccessView } from "./SuccessView";

type Stage = "form" | "processing" | "success";

export function CheckoutView() {
  const sp = useSearchParams();
  const order = useMemo(() => buildOrder(new URLSearchParams(sp.toString())), [sp]);
  const [fields, setFields] = useState<PaymentFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [stage, setStage] = useState<Stage>("form");
  const [orderNumber, setOrderNumber] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <EmptyState
          icon={<ShoppingBag className="size-7" strokeWidth={1.6} />}
          title="Your bag is empty"
          description="Pick an event, an outfit, or a vendor and you'll land back here to check out."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink href="/events">Browse events</ButtonLink>
              <ButtonLink href="/closet" variant="outline">
                Festive Closet
              </ButtonLink>
            </div>
          }
        />
      </div>
    );
  }

  const needsPayment = order.total > 0;
  const backHref = `/${order.kind === "event" ? "events" : order.kind === "booking" ? "vendors" : "closet"}/${sp.get("slug")}`;

  if (stage === "success") {
    return (
      <SuccessView
        order={order}
        orderNumber={orderNumber}
        email={fields.email}
        cardLast4={needsPayment ? fields.card.replace(/\D/g, "").slice(-4) : undefined}
        cardBrand={cardBrand(fields.card)}
      />
    );
  }

  function set<K extends keyof PaymentFields>(k: K, v: PaymentFields[K]) {
    setFields((f) => ({ ...f, [k]: v }));
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));
  }

  function fillTest() {
    setFields((f) => ({
      ...f,
      email: f.email || "priya.sharma@example.com",
      name: f.name || "Priya Sharma",
      card: "4242 4242 4242 4242",
      expiry: "12 / 29",
      cvc: "123",
      cardName: f.cardName || f.name || "Priya Sharma",
      zip: "98004",
    }));
    setErrors({});
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const found = validate(fields, needsPayment);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setStage("processing");
    setOrderNumber(`UTS-${Math.floor(100000 + Math.random() * 900000)}`);
    setTimeout(() => {
      setStage("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1800);
  }

  const processing = stage === "processing";
  const payText = needsPayment ? `${order.payLabel} ${formatMoney(order.total)}` : order.payLabel;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:px-8 lg:pt-8">
      <div className="flex items-center justify-between gap-4">
        <BackLink href={backHref}>Back</BackLink>
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-saffron-soft px-3 py-1 text-xs font-semibold tracking-wide text-gold-deep uppercase ring-1 ring-saffron/50"
          title="This is a demo checkout. No card is charged and nothing you type is sent anywhere."
        >
          <FlaskConical className="size-3.5" /> Test mode
        </span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-14">
        <div className="lg:order-2">
          <button
            type="button"
            onClick={() => setSummaryOpen((o) => !o)}
            aria-expanded={summaryOpen}
            className="flex w-full items-center justify-between rounded-2xl border border-sand/80 bg-white/70 px-4 py-3.5 lg:hidden"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-maroon">
              <ShoppingBag className="size-4" /> {summaryOpen ? "Hide" : "Show"} order summary
              <ChevronDown className={`size-4 transition-transform ${summaryOpen ? "rotate-180" : ""}`} />
            </span>
            <span className="font-display text-xl text-ink">{needsPayment ? formatMoney(order.total) : "Free"}</span>
          </button>
          <AnimatePresence initial={false}>
            {summaryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden lg:hidden"
              >
                <div className="pt-3">
                  <OrderSummary order={order} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="hidden lg:sticky lg:top-28 lg:block">
            <OrderSummary order={order} />
            <p className="mt-4 flex items-start gap-2 px-2 text-xs leading-relaxed text-ink-mute">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-leaf" />
              Protected by the Utsav Promise: if your booking falls through, you&apos;re refunded in full.
            </p>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="lg:order-1">
          <h1 className="font-display text-4xl text-ink sm:text-5xl">{needsPayment ? "Checkout" : "Confirm your RSVP"}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-ink-mute">
            <Lock className="size-3.5" /> Demo checkout — no real card is charged.
          </p>

          <fieldset disabled={processing} className="mt-8 space-y-4">
            <legend className="font-display mb-4 text-2xl text-ink">Contact</legend>
            <Field label="Email" error={errors.email}>
              <TextInput
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={fields.email}
                error={!!errors.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.name}>
                <TextInput autoComplete="name" placeholder="Your name" value={fields.name} error={!!errors.name} onChange={(e) => set("name", e.target.value)} />
              </Field>
              <Field label="Phone (optional)">
                <TextInput
                  type="tel"
                  autoComplete="tel"
                  placeholder="(425) 555-0100"
                  value={fields.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </Field>
            </div>
          </fieldset>

          {needsPayment && (
            <fieldset disabled={processing} className="mt-10">
              <legend className="font-display mb-4 text-2xl text-ink">Payment</legend>
              <CardFields fields={fields} errors={errors} set={set} onFillTest={fillTest} />
            </fieldset>
          )}

          <button
            type="submit"
            disabled={processing}
            className="relative mt-8 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-maroon text-base font-semibold text-ivory shadow-[0_12px_28px_-12px_rgb(122_18_48/0.9)] transition-all hover:bg-maroon-deep active:scale-[0.99] disabled:cursor-wait"
          >
            <AnimatePresence mode="wait" initial={false}>
              {processing ? (
                <motion.span key="p" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Loader2 className="size-5 animate-spin" /> Processing…
                </motion.span>
              ) : (
                <motion.span key="r" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Lock className="size-4" /> {payText}
                </motion.span>
              )}
            </AnimatePresence>
            {processing && (
              <motion.span
                className="absolute inset-y-0 left-0 bg-ivory/15"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            )}
          </button>
          <p className="mt-4 text-center text-xs leading-relaxed text-ink-mute">
            By continuing you agree to Utsav&apos;s Terms and the {order.kind === "event" ? "organizer" : "seller"}&apos;s
            cancellation policy.
            {needsPayment && " Test card: 4242 4242 4242 4242, any future date, any CVC."}
          </p>
        </form>
      </div>
    </div>
  );
}

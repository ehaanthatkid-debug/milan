"use client";

import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ChevronDown, CreditCard, FlaskConical, Loader2, Lock, RotateCcw, ShieldCheck, ShoppingBag, UserRound } from "lucide-react";
import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { HOLD_MINUTES, availablePlans, buildOrder, priceOrder, type PlanId } from "@/lib/checkout";
import { BRAND } from "@/lib/brand";
import { DECLINE_MESSAGES, newOrderNumber, simulateCharge, type ChargeOutcome } from "@/lib/payments";
import { findPromo, type Promo } from "@/lib/promo";
import { blockedDates, saveOrder, saveProfile, useOrders, useSavedProfile, type PaymentInfo, type StoredOrder } from "@/lib/orders";
import { useToday } from "@/lib/use-today";
import { cn, formatMoney } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { BackLink } from "@/components/detail/DetailBits";
import { EmptyState } from "@/components/ui/States";
import { CITIES } from "@/data/shared";
import { OrderSummary } from "./OrderSummary";
import { ExpressCheckout, HoldTimer, PlanPicker, PromoField, ThreeDSModal, type WalletMethod } from "./CheckoutParts";
import {
  CardFields,
  CardHeader,
  EMPTY_FIELDS,
  Field,
  TextInput,
  cardBrand,
  formatPhone,
  validate,
  type FieldErrors,
  type FieldKey,
  type FormFields,
} from "./PaymentForm";
import { SuccessView } from "./SuccessView";

type Stage = "form" | "processing" | "verify" | "success";

export function CheckoutView({ serverToday }: { serverToday: string }) {
  const sp = useSearchParams();
  const order = useMemo(() => buildOrder(new URLSearchParams(sp.toString())), [sp]);
  const today = useToday(serverToday);
  const profile = useSavedProfile();
  const orders = useOrders();

  const [fields, setFields] = useState<FormFields>(EMPTY_FIELDS);
  const [touched, setTouched] = useState<Set<FieldKey>>(() => new Set());
  const [submitted, setSubmitted] = useState(false);
  const [stage, setStage] = useState<Stage>("form");
  const [progress, setProgress] = useState("");
  const [payError, setPayError] = useState<string | null>(null);
  const [promo, setPromo] = useState<Promo | null>(null);
  const [promoError, setPromoError] = useState<string>();
  const [planChoice, setPlanChoice] = useState<PlanId>("full");
  const [cardChoice, setCardChoice] = useState<"saved" | "new">("saved");
  const [walletBusy, setWalletBusy] = useState<WalletMethod | null>(null);
  const [saveInfo, setSaveInfo] = useState(true);
  const [holdExpired, setHoldExpired] = useState(false);
  const [holdKey, setHoldKey] = useState(0);
  const [stored, setStored] = useState<StoredOrder | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const pendingPayment = useRef<PaymentInfo | null>(null);

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

  if (stage === "success" && stored) {
    return <SuccessView order={order} stored={stored} />;
  }

  const plans = availablePlans(order, priceOrder(order, promo, "full", today).total);
  const plan: PlanId = plans.some((p) => p.id === planChoice) ? planChoice : "full";
  const pricing = priceOrder(order, promo, plan, today);
  const needsPayment = pricing.dueToday > 0;
  const savedCard = profile?.card;
  const useSaved = !!savedCard && cardChoice === "saved";
  const needsCard = needsPayment && !useSaved;
  const busy = stage === "processing" || stage === "verify" || walletBusy !== null;
  const conflict =
    (order.kind === "rent" || order.kind === "booking") &&
    order.blockDates.some((d) => blockedDates(orders, order.kind as "rent" | "booking", order.slug).includes(d));

  const allErrors = validate(fields, { needsAddress: order.needsAddress, needsEventDetails: order.needsEventDetails, needsCard });
  const errors: FieldErrors = Object.fromEntries(
    Object.entries(allErrors).filter(([k]) => submitted || touched.has(k as FieldKey)),
  ) as FieldErrors;

  function set(k: FieldKey, v: string) {
    setFields((f) => ({ ...f, [k]: v }));
    if (k === "card") setPayError(null);
  }
  function touch(k: FieldKey) {
    setTouched((t) => (t.has(k) ? t : new Set(t).add(k)));
  }
  function useSavedDetails() {
    if (!profile) return;
    setFields((f) => ({ ...f, email: profile.email, name: profile.name, phone: profile.phone }));
  }
  function fillTestCard(number = "4242 4242 4242 4242") {
    setFields((f) => ({
      ...f,
      email: f.email || "priya.sharma@example.com",
      name: f.name || "Priya Sharma",
      card: number,
      expiry: "12 / 29",
      cvc: number.replace(/\s/g, "").startsWith("3") ? "1234" : "123",
      cardName: f.cardName || f.name || "Priya Sharma",
      zip: f.zip || "98004",
      address1: order!.needsAddress ? f.address1 || "10500 NE 8th St, Apt 1204" : f.address1,
      addrCity: order!.needsAddress ? f.addrCity || "Bellevue" : f.addrCity,
      addrZip: order!.needsAddress ? f.addrZip || "98004" : f.addrZip,
      venue: order!.needsEventDetails ? f.venue || "Our home in Sammamish (backyard tent)" : f.venue,
    }));
    setPayError(null);
  }
  function applyPromo(code: string) {
    const { promo: found, error } = findPromo(code, order!.subtotal);
    setPromo(found);
    setPromoError(error);
  }

  function focusFirstError(found: FieldErrors) {
    const first = Object.keys(found)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>("[aria-invalid='true']");
      el?.focus();
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }

  function finalize(payment: PaymentInfo) {
    const number = newOrderNumber(BRAND.orderPrefix);
    const o = order!;
    const facts = [...o.facts];
    if (o.needsAddress) {
      facts.push({
        label: "Deliver to",
        value: `${fields.address1}${fields.address2 ? `, ${fields.address2}` : ""}, ${fields.addrCity} ${fields.addrZip}`,
      });
    }
    if (o.needsEventDetails) {
      facts.push({ label: "Venue", value: `${fields.venue}${fields.startTime ? ` · starts ${fields.startTime}` : ""}` });
    }
    const record: StoredOrder = {
      number,
      createdAt: new Date().toISOString(),
      kind: o.kind,
      slug: o.slug,
      eyebrow: o.eyebrow,
      title: o.title,
      image: o.image,
      facts,
      lines: o.lines,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      promoCode: promo?.code,
      serviceFee: pricing.serviceFee,
      deposit: pricing.deposit,
      total: pricing.total,
      paidToday: pricing.dueToday,
      plan,
      schedule: pricing.schedule,
      date: o.date,
      blockDates: o.blockDates,
      tickets: o.tickets
        ? {
            tierIndex: o.tickets.tierIndex,
            tierName: o.tickets.tierName,
            codes: Array.from({ length: o.tickets.qty }, (_, i) => `${number}-${String(i + 1).padStart(2, "0")}`),
          }
        : undefined,
      email: fields.email,
      name: fields.name,
      payment,
      calendar: o.calendar
        ? { title: o.calendar.title, start: o.calendar.start.toISOString(), end: o.calendar.end.toISOString(), location: o.calendar.location }
        : undefined,
    };
    saveOrder(record);
    if (saveInfo) {
      saveProfile({
        email: fields.email,
        name: fields.name,
        phone: fields.phone,
        card:
          payment.method === "card" && !useSaved && payment.last4
            ? { brand: payment.brand ?? "Card", last4: payment.last4, expiry: fields.expiry }
            : savedCard,
      });
    }
    setStored(record);
    setStage("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function process(outcome: ChargeOutcome, payment: PaymentInfo) {
    pendingPayment.current = payment;
    setStage("processing");
    setProgress("Contacting your bank…");
    setTimeout(() => setProgress("Confirming payment…"), 750);
    setTimeout(() => {
      if (outcome === "success") finalize(payment);
      else if (outcome === "requires_authentication") setStage("verify");
      else {
        setStage("form");
        setPayError(DECLINE_MESSAGES[outcome]);
      }
    }, 1500);
  }

  function preflight(withCard: boolean) {
    setSubmitted(true);
    setPayError(null);
    if (holdExpired || conflict) return false;
    const found = validate(fields, {
      needsAddress: order!.needsAddress,
      needsEventDetails: order!.needsEventDetails,
      needsCard: withCard,
    });
    if (Object.keys(found).length) {
      focusFirstError(found);
      return false;
    }
    return true;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!preflight(needsCard)) return;
    if (!needsPayment) {
      setStage("processing");
      setProgress("Saving your spot…");
      setTimeout(() => finalize({ method: "none" }), 900);
      return;
    }
    if (useSaved && savedCard) {
      process("success", { method: "card", brand: savedCard.brand, last4: savedCard.last4 });
      return;
    }
    const digits = fields.card.replace(/\D/g, "");
    process(simulateCharge(fields.card), { method: "card", brand: cardBrand(fields.card) ?? "Card", last4: digits.slice(-4) });
  }

  function payWithWallet(m: WalletMethod) {
    if (!preflight(false)) return;
    setWalletBusy(m);
    setTimeout(() => {
      setWalletBusy(null);
      process("success", { method: m });
    }, 1000);
  }

  const submitLabel = !needsPayment
    ? order.kind === "event"
      ? "Confirm RSVP"
      : "Confirm"
    : `${order.kind === "booking" ? "Pay & request booking" : "Pay"} ${formatMoney(pricing.dueToday)}${plan !== "full" ? " today" : ""}`;

  const holdLabel = order.kind === "event" ? "Tickets held" : "Dates held";
  const promoField =
    order.subtotal > 0 ? (
      <PromoField
        applied={promo}
        error={promoError}
        onApply={applyPromo}
        onRemove={() => {
          setPromo(null);
          setPromoError(undefined);
        }}
      />
    ) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:px-8 lg:pt-8">
      <div className="flex items-center justify-between gap-4">
        <BackLink href={order.backHref}>Back</BackLink>
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
              <ChevronDown className={cn("size-4 transition-transform", summaryOpen && "rotate-180")} />
            </span>
            <span className="font-display text-xl text-ink">{pricing.total > 0 ? formatMoney(pricing.dueToday) : "Free"}</span>
          </button>
          {order.holdsInventory && !holdExpired && (
            <div className="mt-3 lg:hidden">
              <HoldTimer key={`m-${holdKey}`} minutes={HOLD_MINUTES} label={holdLabel} onExpire={() => setHoldExpired(true)} />
            </div>
          )}
          <AnimatePresence initial={false}>
            {summaryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden lg:hidden"
              >
                <div className="pt-3">
                  <OrderSummary order={order} pricing={pricing} plan={plan} promo={promo}>
                    {promoField}
                  </OrderSummary>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="hidden lg:sticky lg:top-28 lg:block">
            <OrderSummary order={order} pricing={pricing} plan={plan} promo={promo}>
              {order.holdsInventory && !holdExpired && (
                <HoldTimer key={holdKey} minutes={HOLD_MINUTES} label={holdLabel} onExpire={() => setHoldExpired(true)} />
              )}
              {promoField}
            </OrderSummary>
            <p className="mt-4 flex items-start gap-2 px-2 text-xs leading-relaxed text-ink-mute">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-leaf" />
              If an event is canceled or a vendor can&apos;t make your date, you&apos;re refunded in full automatically.
            </p>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="lg:order-1">
          <h1 className="font-display text-4xl text-ink sm:text-5xl">{needsPayment || pricing.total > 0 ? "Checkout" : "Confirm your RSVP"}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-ink-mute">
            <Lock className="size-3.5" /> Demo checkout — no real card is charged.
          </p>

          <AnimatePresence>
            {(holdExpired || conflict) && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3.5 text-sm text-danger"
                role="alert"
              >
                <span className="flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  {conflict
                    ? "You already have these dates booked. Go back and pick different dates."
                    : "Your hold expired, so these may no longer be available."}
                </span>
                {!conflict && (
                  <button
                    type="button"
                    onClick={() => {
                      setHoldExpired(false);
                      setHoldKey((k) => k + 1);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-medium text-ink shadow-sm"
                  >
                    <RotateCcw className="size-3.5" /> Hold again
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {profile && !fields.email && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ivory-100 px-4 py-3.5 text-sm ring-1 ring-sand/70">
              <span className="flex items-center gap-2 text-ink-soft">
                <UserRound className="size-4 text-maroon" /> Welcome back, {profile.name.split(" ")[0]}.
              </span>
              <button type="button" onClick={useSavedDetails} className="font-semibold text-maroon hover:underline">
                Use my saved details
              </button>
            </div>
          )}

          <fieldset disabled={busy} className="contents">
            <Section step={1} title="Contact">
              <Field label="Email" error={errors.email} htmlFor="email">
                <TextInput
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={fields.email}
                  error={!!errors.email}
                  valid={touched.has("email") && !allErrors.email}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={() => touch("email")}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.name} htmlFor="name">
                  <TextInput
                    id="name"
                    autoComplete="name"
                    placeholder="Your name"
                    value={fields.name}
                    error={!!errors.name}
                    valid={touched.has("name") && !allErrors.name}
                    onChange={(e) => set("name", e.target.value)}
                    onBlur={() => touch("name")}
                  />
                </Field>
                <Field label="Phone (optional)" error={errors.phone} htmlFor="phone">
                  <TextInput
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(425) 555-0100"
                    value={fields.phone}
                    error={!!errors.phone}
                    onChange={(e) => set("phone", formatPhone(e.target.value))}
                    onBlur={() => touch("phone")}
                  />
                </Field>
              </div>
            </Section>

            {order.needsAddress && (
              <Section step={2} title="Delivery address">
                <Field label="Street address" error={errors.address1} htmlFor="address1">
                  <TextInput
                    id="address1"
                    autoComplete="address-line1"
                    placeholder="123 Main St"
                    value={fields.address1}
                    error={!!errors.address1}
                    onChange={(e) => set("address1", e.target.value)}
                    onBlur={() => touch("address1")}
                  />
                </Field>
                <Field label="Apartment, suite (optional)" htmlFor="address2">
                  <TextInput
                    id="address2"
                    autoComplete="address-line2"
                    value={fields.address2}
                    onChange={(e) => set("address2", e.target.value)}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
                  <Field label="City" error={errors.addrCity} htmlFor="addrCity">
                    <TextInput
                      id="addrCity"
                      autoComplete="address-level2"
                      list="delivery-cities"
                      value={fields.addrCity}
                      error={!!errors.addrCity}
                      onChange={(e) => set("addrCity", e.target.value)}
                      onBlur={() => touch("addrCity")}
                    />
                    <datalist id="delivery-cities">
                      {CITIES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </Field>
                  <Field label="ZIP" error={errors.addrZip} htmlFor="addrZip">
                    <TextInput
                      id="addrZip"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      value={fields.addrZip}
                      error={!!errors.addrZip}
                      onChange={(e) => set("addrZip", e.target.value.replace(/\D/g, "").slice(0, 5))}
                      onBlur={() => touch("addrZip")}
                    />
                  </Field>
                </div>
                <p className="text-xs text-ink-mute">We deliver across Seattle and the Eastside, usually by 6 PM the day before your rental starts.</p>
              </Section>
            )}

            {order.needsEventDetails && (
              <Section step={2} title="Event details">
                <Field label="Where is the event?" error={errors.venue} htmlFor="venue">
                  <TextInput
                    id="venue"
                    placeholder="Venue name or address"
                    value={fields.venue}
                    error={!!errors.venue}
                    onChange={(e) => set("venue", e.target.value)}
                    onBlur={() => touch("venue")}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
                  <Field label="Start time (optional)" htmlFor="startTime">
                    <TextInput id="startTime" type="time" value={fields.startTime} onChange={(e) => set("startTime", e.target.value)} />
                  </Field>
                  <Field label="Notes for the vendor (optional)" htmlFor="notes">
                    <TextInput
                      id="notes"
                      placeholder="Dietary needs, song requests, design ideas…"
                      value={fields.notes}
                      onChange={(e) => set("notes", e.target.value)}
                    />
                  </Field>
                </div>
              </Section>
            )}

            {pricing.total > 0 && plans.length > 1 && (
              <Section step={order.needsAddress || order.needsEventDetails ? 3 : 2} title="How would you like to pay?">
                <PlanPicker plans={plans} value={plan} onChange={setPlanChoice} dueToday={pricing.dueToday} schedule={pricing.schedule} />
              </Section>
            )}

            {needsPayment && (
              <Section
                step={1 + Number(order.needsAddress || order.needsEventDetails) + Number(plans.length > 1) + 1}
                title="Payment"
              >
                <AnimatePresence>
                  {payError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2 rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
                      role="alert"
                    >
                      <AlertCircle className="mt-0.5 size-4 shrink-0" /> {payError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <ExpressCheckout onPay={payWithWallet} busy={walletBusy} disabled={busy || holdExpired || conflict} />

                {savedCard && (
                  <div className="space-y-2" role="radiogroup" aria-label="Card">
                    {(
                      [
                        { id: "saved", label: `${savedCard.brand} ending ${savedCard.last4}`, note: `Saved · expires ${savedCard.expiry.replace(/\s/g, "")}` },
                        { id: "new", label: "Use a different card", note: "Visa, Mastercard, Amex, Discover" },
                      ] as const
                    ).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        role="radio"
                        aria-checked={cardChoice === c.id}
                        onClick={() => setCardChoice(c.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all",
                          cardChoice === c.id ? "border-maroon bg-maroon-soft/50" : "border-sand bg-white/60 hover:border-maroon/30",
                        )}
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-ivory">
                          <CreditCard className="size-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-ink">{c.label}</span>
                          <span className="block text-xs text-ink-mute">{c.note}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {!useSaved && (
                  <>
                    <CardHeader onFillTest={() => fillTestCard()} onPickCard={(n) => fillTestCard(n)} />
                    <CardFields fields={fields} errors={errors} set={set} touch={touch} disabled={busy} />
                  </>
                )}
              </Section>
            )}

            <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
                className="mt-0.5 size-4 accent-maroon"
              />
              <span>
                Save my details on this device for faster checkout
                <span className="block text-xs text-ink-mute">Only your card&apos;s brand and last four digits are stored.</span>
              </span>
            </label>
          </fieldset>

          <button
            type="submit"
            disabled={busy || holdExpired || conflict}
            className="relative mt-8 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-maroon text-base font-semibold text-ivory shadow-[0_12px_28px_-12px_rgb(122_18_48/0.9)] transition-all hover:bg-maroon-deep active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <AnimatePresence mode="wait" initial={false}>
              {stage === "processing" || stage === "verify" ? (
                <motion.span key={progress} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Loader2 className="size-5 animate-spin" /> {stage === "verify" ? "Waiting for verification…" : progress}
                </motion.span>
              ) : (
                <motion.span key="ready" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Lock className="size-4" /> {submitLabel}
                </motion.span>
              )}
            </AnimatePresence>
            {stage === "processing" && (
              <motion.span
                className="absolute inset-y-0 left-0 bg-ivory/15"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )}
          </button>
          <p className="mt-4 text-center text-xs leading-relaxed text-ink-mute">
            By continuing you agree to {BRAND.name}&apos;s Terms and the{" "}
            {order.kind === "event" ? "organizer" : order.kind === "booking" ? "vendor" : "seller"}&apos;s cancellation policy.
          </p>
        </form>
      </div>

      <ThreeDSModal
        open={stage === "verify"}
        amount={pricing.dueToday}
        onComplete={() => {
          setStage("processing");
          setProgress("Verified — finishing up…");
          setTimeout(() => finalize(pendingPayment.current ?? { method: "card" }), 900);
        }}
        onFail={() => {
          setStage("form");
          setPayError("We couldn't verify this payment with your bank. Try again or use a different card.");
        }}
      />
    </div>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display mb-4 flex items-center gap-3 text-2xl text-ink">
        <span className="grid size-7 place-items-center rounded-full bg-ink text-xs font-semibold text-ivory">{step}</span>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

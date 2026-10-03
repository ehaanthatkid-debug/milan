/**
 * Simulated card processing that mirrors Stripe's test mode, so demos can show
 * every outcome a real checkout handles. No card data ever leaves the browser.
 *
 * To take real payments, replace `simulateCharge` with a call to a server that
 * creates a Stripe PaymentIntent (see README → "Taking real payments").
 */
export type ChargeOutcome = "success" | "requires_authentication" | "declined" | "insufficient_funds";

export const TEST_CARDS: { number: string; outcome: ChargeOutcome; label: string }[] = [
  { number: "4242 4242 4242 4242", outcome: "success", label: "Payment succeeds" },
  { number: "4000 0025 0000 3155", outcome: "requires_authentication", label: "Asks for bank verification" },
  { number: "4000 0000 0000 0002", outcome: "declined", label: "Card is declined" },
  { number: "4000 0000 0000 9995", outcome: "insufficient_funds", label: "Insufficient funds" },
];

export const DECLINE_MESSAGES: Record<Exclude<ChargeOutcome, "success" | "requires_authentication">, string> = {
  declined: "Your card was declined. Try a different card or payment method.",
  insufficient_funds: "Your card has insufficient funds. Try a different card or payment method.",
};

export function simulateCharge(cardNumber: string): ChargeOutcome {
  const digits = cardNumber.replace(/\D/g, "");
  return TEST_CARDS.find((c) => c.number.replace(/\s/g, "") === digits)?.outcome ?? "success";
}

export function newOrderNumber(prefix: string) {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
}

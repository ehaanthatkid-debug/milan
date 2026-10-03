# Milan

A high-fidelity demo of **Milan** (मिलन · ملن · ਮਿਲਨ · মিলন — "coming together"): a hub for South Asian events, vendors, and festive-wear rental and resale across Seattle and the Eastside (Bellevue, Redmond, Sammamish, Kirkland), for every tradition in the community.

All listings are illustrative sample data, and checkout runs in test mode: no card is charged and nothing typed into the payment form leaves the browser.

Live demo: https://ehaanthatkid-debug.github.io/milan/

## Run it on your computer

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Edit the content

| File | What's in it |
| --- | --- |
| `data/events.ts` | Events: dates, venues (with map coordinates), age groups, ticket tiers, organizers |
| `data/vendors.ts` | Vendors: services and prices, reviews, booked dates |
| `data/closet.ts` | Festive Closet outfits: rent/buy prices, sizes, owners, booked dates |
| `data/images.ts` | Every photo URL, by name — swap in your own photography here |
| `data/shared.ts` | Cities and the service fee percentage |
| `lib/brand.ts` | Brand name, contact email and phone |
| `lib/promo.ts` | Promo codes |

## How checkout works in the demo

- Tickets, rentals, purchases, and vendor bookings share one checkout with a full price breakdown (6% service fee, refundable rental deposits, promo codes).
- Payment plans: vendor bookings can reserve with a 25% deposit; larger purchases can split into four payments.
- Test cards behave like Stripe's test mode:
  - `4242 4242 4242 4242` — succeeds
  - `4000 0025 0000 3155` — asks for bank verification (3-D Secure)
  - `4000 0000 0000 0002` — declined
  - `4000 0000 0000 9995` — insufficient funds
- Apple Pay and Google Pay buttons simulate a wallet payment.
- Completed orders appear in **My bookings** with scannable QR tickets. They're saved in the visitor's browser (localStorage), and booked dates are blocked on the calendars.

## Taking real payments

GitHub Pages only serves static files, so it can't process real cards. To go live:

1. Create a Stripe account and use **Stripe Connect**, so payments are split between Milan (the service fee) and organizers, vendors, and boutiques — and vendor payouts can be held until after the event.
2. Move hosting to a platform with server functions (for example Vercel), and add an endpoint that creates a Stripe PaymentIntent for the order total.
3. Replace `simulateCharge` in `lib/payments.ts` with Stripe's Payment Element, which also provides real Apple Pay, Google Pay, and 3-D Secure.
4. Store orders in a database instead of localStorage.

## Publish changes

The site is hosted on GitHub Pages. Every push to `main` rebuilds and republishes it automatically (see `.github/workflows/deploy.yml`) — the update is live about two minutes later.

## Built with

Next.js (App Router, static export) · TypeScript · Tailwind CSS · Framer Motion · Lucide icons · Leaflet with OpenStreetMap · Photos from [Unsplash](https://unsplash.com/license)

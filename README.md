# Utsav

A high-fidelity demo of **Utsav** — a hub for South Asian cultural events, vendors, and festive-wear rental and resale across Seattle and the Eastside (Bellevue, Redmond, Sammamish, Kirkland).

All listings are illustrative sample data, and checkout is a mock: no card is charged and nothing typed into the payment form is sent anywhere.

## Run it on your computer

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Edit the content

Everything shown on the site lives in `/data`:

| File | What's in it |
| --- | --- |
| `data/events.ts` | Events: dates, venues (with map coordinates), ticket tiers, organizers |
| `data/vendors.ts` | Vendors: services and prices, reviews, booked dates |
| `data/closet.ts` | Festive Closet outfits: rent/buy prices, sizes, owners, booked dates |
| `data/images.ts` | Every photo URL, by name — swap in your own photography here |
| `data/shared.ts` | Cities and the Utsav service fee percentage |

## Publish changes

The site is hosted on GitHub Pages. Every push to `main` rebuilds and republishes it automatically (see `.github/workflows/deploy.yml`) — the update is live about two minutes later.

## Built with

Next.js (App Router, static export) · TypeScript · Tailwind CSS · Framer Motion · Lucide icons · Leaflet with OpenStreetMap · Photos from [Unsplash](https://unsplash.com/license)

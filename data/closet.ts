import { photos } from "./images";
import type { City } from "./shared";

export const GARMENT_TYPES = ["Lehenga", "Saree", "Sherwani", "Kurta", "Anarkali", "Chaniya choli", "Kids"] as const;
export type GarmentType = (typeof GARMENT_TYPES)[number];

/** Rentals are priced per 4-day window: pick up the day before, return two days after. */
export const RENTAL_DAYS = 4;

export type ClosetOwner = {
  name: string;
  kind: "Boutique" | "Closet";
  initials: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  verified: boolean;
};

export type Outfit = {
  slug: string;
  name: string;
  type: GarmentType;
  /** Price for one 4-day rental. Omit if the item is sale-only. */
  rentPrice?: number;
  /** Omit if the item is rental-only. */
  buyPrice?: number;
  retailPrice: number;
  /** Refundable security deposit, charged with rentals. */
  deposit: number;
  size: string;
  fit: string;
  color: string;
  fabric: string;
  designer: string;
  condition: "New with tags" | "Like new" | "Excellent" | "Very good";
  conditionNote: string;
  city: City;
  owner: ClosetOwner;
  images: string[];
  description: string;
  includes: string[];
  /** Dates already rented out, YYYY-MM-DD. */
  bookedDates: string[];
  featured?: boolean;
};

/** A zoomed-in crop of the same photo — used for embroidery and detail shots. */
const detail = (src: string, x: number, y: number, zoom: number) =>
  `${src}?crop=focalpoint&fp-x=${x}&fp-y=${y}&fp-z=${zoom}&ar=3:4`;

const owners = {
  lehengaLoft: {
    name: "The Lehenga Loft",
    kind: "Boutique",
    initials: "LL",
    rating: 4.9,
    reviewCount: 212,
    responseTime: "Replies within an hour",
    verified: true,
  },
  rajaRani: {
    name: "Raja Rani Menswear",
    kind: "Boutique",
    initials: "RR",
    rating: 4.8,
    reviewCount: 134,
    responseTime: "Replies within 2 hours",
    verified: true,
  },
  silkRoute: {
    name: "Silk Route Sarees",
    kind: "Boutique",
    initials: "SR",
    rating: 4.9,
    reviewCount: 88,
    responseTime: "Replies within 3 hours",
    verified: true,
  },
  garbaGhar: {
    name: "Garba Ghar",
    kind: "Boutique",
    initials: "GG",
    rating: 4.7,
    reviewCount: 156,
    responseTime: "Replies within an hour",
    verified: true,
  },
  kaveri: {
    name: "Kaveri Studio",
    kind: "Boutique",
    initials: "KS",
    rating: 4.8,
    reviewCount: 61,
    responseTime: "Replies within 4 hours",
    verified: true,
  },
  aditi: {
    name: "Aditi M.",
    kind: "Closet",
    initials: "AM",
    rating: 5.0,
    reviewCount: 23,
    responseTime: "Replies within 5 hours",
    verified: true,
  },
  dev: {
    name: "Dev P.",
    kind: "Closet",
    initials: "DP",
    rating: 4.8,
    reviewCount: 12,
    responseTime: "Replies within a day",
    verified: false,
  },
  lakshmi: {
    name: "Lakshmi R.",
    kind: "Closet",
    initials: "LR",
    rating: 4.9,
    reviewCount: 31,
    responseTime: "Replies within 3 hours",
    verified: true,
  },
} satisfies Record<string, ClosetOwner>;

export const closet: Outfit[] = [
  {
    slug: "crimson-zardozi-bridal-lehenga",
    name: "Crimson Zardozi Bridal Lehenga",
    type: "Lehenga",
    rentPrice: 180,
    buyPrice: 1450,
    retailPrice: 3200,
    deposit: 300,
    size: "M",
    fit: "Bust 36\" · Waist 30\" · Length 42\" — blouse can be let out 1\"",
    color: "Crimson & antique gold",
    fabric: "Raw silk with zardozi and dabka hand embroidery",
    designer: "House of Kesari",
    condition: "Excellent",
    conditionNote: "Worn once for a 2025 wedding. Professionally dry-cleaned and steamed.",
    city: "Bellevue",
    owner: owners.lehengaLoft,
    images: [
      photos.lehengaBridalRed,
      photos.lehengaRedDetail,
      photos.lehengaRedEmbroidery,
      photos.lehengaRedHem,
    ],
    description:
      "A true heirloom-style bridal lehenga: 24 kalis of crimson raw silk, each hand-worked with antique-gold zardozi florals and a scalloped dabka border that catches every light in the mandap.",
    includes: ["Lehenga skirt with can-can", "Padded blouse", "Double-border net dupatta", "Garment bag"],
    bookedDates: ["2026-10-09", "2026-10-10", "2026-10-11", "2026-10-12", "2026-11-05", "2026-11-06", "2026-11-07", "2026-11-08"],
    featured: true,
  },
  {
    slug: "blush-rose-mirror-lehenga",
    name: "Blush Rose Mirror-Work Lehenga",
    type: "Lehenga",
    rentPrice: 150,
    retailPrice: 2100,
    deposit: 250,
    size: "S",
    fit: "Bust 34\" · Waist 27\" · Length 41\"",
    color: "Blush pink & gold",
    fabric: "Georgette with mirror, sequin, and resham work",
    designer: "Noorani Couture",
    condition: "Like new",
    conditionNote: "Worn for a two-hour reception. No alterations.",
    city: "Bellevue",
    owner: owners.lehengaLoft,
    images: [
      photos.lehengaBlush,
      detail(photos.lehengaBlush, 0.5, 0.62, 2.2),
      detail(photos.lehengaBlush, 0.5, 0.3, 2.4),
    ],
    description:
      "Soft blush georgette scattered with hand-set mirrors, made for receptions and sangeets where you'll be dancing all night. Lightweight enough to twirl in for hours.",
    includes: ["Lehenga skirt", "Blouse", "Sheer dupatta with mirror border"],
    bookedDates: ["2026-10-16", "2026-10-17", "2026-10-18", "2026-10-19"],
  },
  {
    slug: "marigold-maroon-gota-lehenga",
    name: "Marigold & Maroon Gota Lehenga",
    type: "Lehenga",
    rentPrice: 95,
    buyPrice: 620,
    retailPrice: 1400,
    deposit: 150,
    size: "M",
    fit: "Bust 36\" · Waist 30\" · Length 42\"",
    color: "Marigold, maroon & silver",
    fabric: "Silk with gota patti, paisley applique, and tassels",
    designer: "Rangrez Jaipur",
    condition: "Excellent",
    conditionNote: "Worn twice. Tiny pull on the inner lining, not visible when worn.",
    city: "Redmond",
    owner: owners.aditi,
    images: [
      photos.lehengaMustard,
      detail(photos.lehengaMustard, 0.5, 0.62, 2.4),
      detail(photos.lehengaMustard, 0.45, 0.22, 2.6),
    ],
    description:
      "Sunny marigold silk with maroon bandhani dupatta and hand-applied paisleys — perfect for a haldi, mehndi, or Diwali party where you want to glow in every photo.",
    includes: ["Lehenga skirt", "Blouse", "Bandhani dupatta", "Matching potli bag"],
    bookedDates: ["2026-10-23", "2026-10-24", "2026-10-25", "2026-10-26"],
  },
  {
    slug: "garnet-flared-anarkali",
    name: "Garnet Flared Anarkali Gown",
    type: "Anarkali",
    rentPrice: 70,
    buyPrice: 320,
    retailPrice: 780,
    deposit: 100,
    size: "M",
    fit: "Bust 36\" · Waist 31\" · Length 54\"",
    color: "Garnet red & gold",
    fabric: "Silk georgette with gold threadwork yoke",
    designer: "Kaveri Studio",
    condition: "Like new",
    conditionNote: "Worn once for a Diwali party. Freshly steamed.",
    city: "Seattle",
    owner: owners.kaveri,
    images: [
      photos.gownGarnet,
      detail(photos.gownGarnet, 0.5, 0.3, 2.4),
      detail(photos.gownGarnet, 0.5, 0.75, 2),
    ],
    description:
      "A floor-length anarkali with a 5-meter flare that moves beautifully on the dance floor. Elegant enough for a gala, comfortable enough for a full night of garba.",
    includes: ["Anarkali gown", "Churidar", "Chiffon dupatta"],
    bookedDates: ["2026-11-06", "2026-11-07", "2026-11-08", "2026-11-09"],
  },
  {
    slug: "rani-pink-kanjeevaram-saree",
    name: "Rani Pink Kanjeevaram Silk Saree",
    type: "Saree",
    rentPrice: 75,
    buyPrice: 460,
    retailPrice: 950,
    deposit: 120,
    size: "Free size",
    fit: "6.3 m drape · stitched blouse, bust 36\" (can be let out to 38\")",
    color: "Rani pink, tangerine & gold zari",
    fabric: "Pure Kanjeevaram silk with gold zari border",
    designer: "Handwoven in Kanchipuram",
    condition: "Excellent",
    conditionNote: "Worn once. Zari is bright with no tarnish.",
    city: "Sammamish",
    owner: owners.silkRoute,
    images: [
      photos.sareeRaniPink,
      detail(photos.sareeRaniPink, 0.5, 0.55, 2.2),
      detail(photos.sareeRaniPink, 0.5, 0.3, 2.4),
    ],
    description:
      "A classic Kanjeevaram in rani pink with a contrasting tangerine pallu and temple-motif zari border. The saree every South Indian wedding guest dreams of borrowing.",
    includes: ["Saree with fall and pico done", "Stitched blouse", "Silk saree bag"],
    bookedDates: ["2026-10-30", "2026-10-31", "2026-11-01", "2026-11-02"],
    featured: true,
  },
  {
    slug: "ivory-gold-tissue-saree",
    name: "Ivory & Gold Tissue Organza Saree",
    type: "Saree",
    buyPrice: 240,
    retailPrice: 520,
    deposit: 0,
    size: "Free size",
    fit: "5.5 m drape · unstitched blouse fabric included",
    color: "Ivory & soft gold",
    fabric: "Tissue organza with gota and pearl border",
    designer: "Silk Route Sarees",
    condition: "New with tags",
    conditionNote: "Never worn — bought for an event that was rescheduled.",
    city: "Redmond",
    owner: owners.silkRoute,
    images: [
      photos.sareeIvoryGold,
      detail(photos.sareeIvoryGold, 0.5, 0.55, 2.2),
      detail(photos.sareeIvoryGold, 0.55, 0.35, 2.6),
    ],
    description:
      "Understated and luminous — an ivory tissue organza that photographs like candlelight. Ideal for pujas, receptions, and anyone who prefers quiet elegance.",
    includes: ["Saree", "Unstitched blouse piece", "Original packaging"],
    bookedDates: [],
  },
  {
    slug: "kutchi-mirror-chaniya-choli",
    name: "Kutchi Mirror-Work Chaniya Choli",
    type: "Chaniya choli",
    rentPrice: 45,
    buyPrice: 190,
    retailPrice: 380,
    deposit: 60,
    size: "M",
    fit: "Adjustable tie-back choli fits bust 34\"–38\" · Waist 28\"–32\"",
    color: "Multicolor with black and emerald",
    fabric: "Cotton with Kutchi mirror work and patchwork panels",
    designer: "Handcrafted in Bhuj",
    condition: "Very good",
    conditionNote: "A Navratri veteran — three seasons of garba. Mirrors all intact.",
    city: "Bellevue",
    owner: owners.garbaGhar,
    images: [
      photos.garbaTwirl,
      detail(photos.garbaTwirl, 0.5, 0.72, 2.2),
      detail(photos.garbaTwirl, 0.5, 0.35, 2.6),
    ],
    description:
      "Eight meters of flare, hand-stitched Kutchi mirrors, and patchwork panels in every color of Navratri. Made to spin — and to survive nine nights of garba.",
    includes: ["Chaniya (skirt)", "Tie-back choli", "Mirror-work odhni", "Oxidized jhumkas"],
    bookedDates: ["2026-10-10", "2026-10-11", "2026-10-12", "2026-10-13", "2026-10-17", "2026-10-18"],
    featured: true,
  },
  {
    slug: "ivory-resham-sherwani-red-safa",
    name: "Ivory Resham Sherwani with Red Safa",
    type: "Sherwani",
    rentPrice: 120,
    buyPrice: 780,
    retailPrice: 1650,
    deposit: 200,
    size: "40",
    fit: "Chest 40\" · Shoulder 18\" · Length 44\" · Trouser waist 34\"",
    color: "Ivory with red accents",
    fabric: "Raw silk with resham embroidery",
    designer: "Raja Rani Menswear",
    condition: "Excellent",
    conditionNote: "Worn once by the groom. Safa is freshly re-tied.",
    city: "Bellevue",
    owner: owners.rajaRani,
    images: [
      photos.sherwaniIvoryRed,
      detail(photos.sherwaniIvoryRed, 0.5, 0.45, 2.2),
      detail(photos.sherwaniIvoryRed, 0.45, 0.12, 2.4),
    ],
    description:
      "The classic groom's look: ivory raw silk with tone-on-tone resham embroidery, a pre-tied red safa, and a matching dupatta. Just add a kalgi and your nerves.",
    includes: ["Sherwani", "Churidar", "Pre-tied safa", "Red dupatta", "Mala"],
    bookedDates: ["2026-10-24", "2026-10-25", "2026-10-26", "2026-10-27"],
    featured: true,
  },
  {
    slug: "champagne-threadwork-sherwani",
    name: "Champagne Threadwork Sherwani",
    type: "Sherwani",
    rentPrice: 110,
    retailPrice: 1400,
    deposit: 180,
    size: "42",
    fit: "Chest 42\" · Shoulder 18.5\" · Length 45\" · Trouser waist 36\"",
    color: "Champagne & cream",
    fabric: "Jacquard silk with self-thread embroidery",
    designer: "Raja Rani Menswear",
    condition: "Like new",
    conditionNote: "Worn for a sangeet. No alterations.",
    city: "Redmond",
    owner: owners.rajaRani,
    images: [
      photos.sherwaniCreamDoor,
      photos.sherwaniCreamDoorAlt,
      detail(photos.sherwaniCreamDoor, 0.5, 0.45, 2.4),
    ],
    description:
      "A quietly luxurious champagne sherwani with self-thread embroidery that shows up beautifully in photos. Works for grooms, brothers of the bride, and reception guests.",
    includes: ["Sherwani", "Kurta", "Churidar", "Stole"],
    bookedDates: ["2026-11-13", "2026-11-14", "2026-11-15", "2026-11-16"],
  },
  {
    slug: "mint-chikankari-kurta-set",
    name: "Mint Chikankari Kurta Set",
    type: "Kurta",
    rentPrice: 35,
    buyPrice: 140,
    retailPrice: 260,
    deposit: 40,
    size: "L",
    fit: "Chest 42\" · Length 40\" · Pajama waist 34\"–38\"",
    color: "Mint green & white",
    fabric: "Cotton with Lucknowi chikankari",
    designer: "Handcrafted in Lucknow",
    condition: "Excellent",
    conditionNote: "Worn twice for Diwali pujas.",
    city: "Kirkland",
    owner: owners.dev,
    images: [
      photos.kurtaMint,
      detail(photos.kurtaMint, 0.5, 0.45, 2.4),
      detail(photos.kurtaMint, 0.5, 0.25, 2.6),
    ],
    description:
      "Breezy mint cotton with delicate Lucknowi chikankari — the perfect pick for pujas, mehndis, and daytime festivals when a full sherwani is too much.",
    includes: ["Kurta", "Pajama"],
    bookedDates: [],
  },
  {
    slug: "girls-navy-gold-pavadai",
    name: "Girls' Navy & Gold Pavadai Set",
    type: "Kids",
    rentPrice: 28,
    buyPrice: 95,
    retailPrice: 180,
    deposit: 30,
    size: "Kids 5–6",
    fit: "Adjustable waist · Length 26\"",
    color: "Navy, gold & ivory",
    fabric: "Silk-cotton with zari border",
    designer: "Handwoven in Coimbatore",
    condition: "Excellent",
    conditionNote: "Outgrown after one Diwali — ready for the next little one.",
    city: "Sammamish",
    owner: owners.lakshmi,
    images: [photos.kidsNavyLehenga, photos.kidsNavyLehengaAlt, detail(photos.kidsNavyLehenga, 0.5, 0.65, 2)],
    description:
      "A traditional pattu pavadai in navy and gold with an ivory skirt — sized for five- and six-year-olds who want to spin at every festival.",
    includes: ["Pavadai skirt", "Silk blouse", "Hair flowers"],
    bookedDates: ["2026-11-06", "2026-11-07", "2026-11-08", "2026-11-09"],
  },
  {
    slug: "girls-ruby-garba-lehenga",
    name: "Girls' Ruby Garba Lehenga",
    type: "Kids",
    rentPrice: 25,
    buyPrice: 85,
    retailPrice: 160,
    deposit: 25,
    size: "Kids 8–9",
    fit: "Elastic waist · Length 30\"",
    color: "Ruby red & gold",
    fabric: "Cotton silk with mirror and sequin work",
    designer: "Garba Ghar",
    condition: "Very good",
    conditionNote: "Two Navratri seasons. Dandiya sticks included.",
    city: "Bellevue",
    owner: owners.garbaGhar,
    images: [photos.dandiyaGirlRed, detail(photos.dandiyaGirlRed, 0.5, 0.7, 2), detail(photos.dandiyaGirlRed, 0.5, 0.35, 2.2)],
    description:
      "A twirl-ready ruby lehenga for young garba stars, with a matching pair of painted dandiya sticks so they're ready from the first beat.",
    includes: ["Lehenga skirt", "Choli", "Dupatta", "Painted dandiya sticks"],
    bookedDates: ["2026-10-10", "2026-10-11", "2026-10-12", "2026-10-13"],
  },
];

export function getOutfit(slug: string) {
  return closet.find((o) => o.slug === slug);
}

export const CLOSET_SIZES = Array.from(new Set(closet.map((o) => o.size)));

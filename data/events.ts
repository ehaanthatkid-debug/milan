import { photos } from "./images";
import type { City } from "./shared";

export const EVENT_CATEGORIES = ["Garba", "Diwali", "Holi", "Wedding", "Collegiate"] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export type PriceTier = {
  name: string;
  price: number;
  description: string;
  /** Show "Only N left" when set. */
  remaining?: number;
  soldOut?: boolean;
};

export type Organizer = {
  name: string;
  initials: string;
  bio: string;
  eventsHosted: number;
  followers: number;
  since: number;
  verified: boolean;
};

export type EventItem = {
  slug: string;
  title: string;
  tagline: string;
  category: EventCategory;
  /** YYYY-MM-DD, local Seattle time */
  date: string;
  /** 24-hour HH:MM */
  startTime: string;
  endTime: string;
  city: City;
  neighborhood: string;
  venue: { name: string; address: string; lat: number; lng: number };
  image: string;
  gallery: string[];
  description: string[];
  highlights: string[];
  organizer: Organizer;
  tiers: PriceTier[];
  attending: number;
  featured?: boolean;
};

const organizers = {
  eastsideGarba: {
    name: "Eastside Garba Collective",
    initials: "EG",
    bio: "A volunteer-run group hosting garba and dandiya nights across Bellevue and Redmond since 2014.",
    eventsHosted: 38,
    followers: 4200,
    since: 2014,
    verified: true,
  },
  rangmanch: {
    name: "Rangmanch Seattle",
    initials: "RS",
    bio: "Seattle's South Asian nightlife collective, known for Bollywood and garba parties that sell out in hours.",
    eventsHosted: 64,
    followers: 12800,
    since: 2017,
    verified: true,
  },
  pnwDance: {
    name: "PNW Collegiate Dance Alliance",
    initials: "PD",
    bio: "A student-run nonprofit connecting South Asian dance teams across Washington, Oregon, and British Columbia.",
    eventsHosted: 12,
    followers: 3100,
    since: 2019,
    verified: true,
  },
  sammamishParivar: {
    name: "Sammamish Sanskriti Parivar",
    initials: "SP",
    bio: "A family-run cultural association hosting festivals, language classes, and youth programs in Sammamish.",
    eventsHosted: 21,
    followers: 2600,
    since: 2016,
    verified: true,
  },
  kirklandDiwali: {
    name: "Kirkland Diwali Committee",
    initials: "KD",
    bio: "Neighbors bringing Diwali to downtown Kirkland since 2018, in partnership with local businesses.",
    eventsHosted: 9,
    followers: 1900,
    since: 2018,
    verified: true,
  },
  desiArts: {
    name: "Seattle Desi Arts Circle",
    initials: "SD",
    bio: "A nonprofit presenting South Asian arts and culture at Seattle Center since 2009.",
    eventsHosted: 57,
    followers: 9400,
    since: 2009,
    verified: true,
  },
  lotusFoundation: {
    name: "Lotus Foundation of Washington",
    initials: "LF",
    bio: "A community foundation funding South Asian arts education for Eastside youth.",
    eventsHosted: 14,
    followers: 2200,
    since: 2012,
    verified: true,
  },
  utsav: {
    name: "Utsav Presents",
    initials: "U",
    bio: "Events produced by the Utsav team together with our local vendor partners.",
    eventsHosted: 18,
    followers: 15600,
    since: 2023,
    verified: true,
  },
  nachle: {
    name: "Nachle Dance Studio",
    initials: "ND",
    bio: "Bollywood and bhangra classes for kids and adults in Redmond and Bellevue.",
    eventsHosted: 31,
    followers: 3800,
    since: 2015,
    verified: false,
  },
  uwCollective: {
    name: "UW South Asian Student Collective",
    initials: "UW",
    bio: "Undergraduate and graduate students celebrating South Asian culture at the University of Washington.",
    eventsHosted: 26,
    followers: 5300,
    since: 2011,
    verified: true,
  },
} satisfies Record<string, Organizer>;

export const events: EventItem[] = [
  {
    slug: "dandiya-basics-workshop",
    title: "Dandiya Basics: Free Community Workshop",
    tagline: "Learn the steps before Navratri — sticks provided.",
    category: "Garba",
    date: "2026-10-02",
    startTime: "18:30",
    endTime: "20:00",
    city: "Bellevue",
    neighborhood: "Crossroads",
    venue: {
      name: "Crossroads Bellevue — Market Stage",
      address: "15600 NE 8th St, Bellevue, WA 98008",
      lat: 47.6181,
      lng: -122.131,
    },
    image: photos.dandiyaGirls,
    gallery: [photos.dandiyaGirlRed, photos.garbaTwirl],
    description: [
      "Never played dandiya — or haven't since you were twelve? This relaxed, all-ages session covers the core two-step, the three-clap garba, and the basic dandiya raas pattern, so you can walk into any Navratri night with confidence.",
      "Instructors from the Eastside Garba Collective break the steps down slowly, then pick up the tempo with live dhol for the final half hour. Sticks are provided, and you're welcome to bring your own.",
      "Free and open to everyone. Wear comfortable shoes — or go barefoot like the regulars.",
    ],
    highlights: ["Beginner friendly, all ages", "Dandiya sticks provided", "Live dhol finale", "Stroller & wheelchair accessible"],
    organizer: organizers.eastsideGarba,
    tiers: [{ name: "General admission", price: 0, description: "Free — RSVP to hold a spot on the floor" }],
    attending: 186,
  },
  {
    slug: "raas-rave-seattle",
    title: "Raas Rave: Pre-Navratri Garba Night",
    tagline: "Garba classics meet club remixes in SoDo.",
    category: "Garba",
    date: "2026-10-03",
    startTime: "20:00",
    endTime: "01:00",
    city: "Seattle",
    neighborhood: "SoDo",
    venue: {
      name: "Showbox SoDo",
      address: "1700 1st Ave S, Seattle, WA 98134",
      lat: 47.5881,
      lng: -122.3346,
    },
    image: photos.garbaSelfie,
    gallery: [photos.garbaDiyasAlt, photos.garbaNightGathering, photos.djCrowdSmoke],
    description: [
      "Seattle's favorite garba party is back for a one-night warm-up before Navratri. DJ Kabir Nights spins Gujarati folk, Falguni Pathak classics, and Bollywood remixes across two circles — one fast, one for everyone else.",
      "Expect a live dhol set at midnight, a chaniya choli best-dressed walk, and late-night dabeli and cutting chai from Masala Monsoon Kitchen. Traditional attire strongly encouraged.",
      "21+ after 10 PM. Doors open at 7:30 PM.",
    ],
    highlights: ["Two garba circles", "Live dhol at midnight", "Best-dressed walk", "Late-night food stalls"],
    organizer: organizers.rangmanch,
    tiers: [
      { name: "Early bird", price: 22, description: "General admission, first 300 tickets", soldOut: true },
      { name: "General admission", price: 28, description: "Dance floor access all night" },
      { name: "VIP mezzanine", price: 45, description: "Mezzanine lounge, one drink ticket, express entry", remaining: 18 },
    ],
    attending: 742,
  },
  {
    slug: "emerald-city-bhangra-invitational",
    title: "Emerald City Bhangra Invitational",
    tagline: "Eight college teams. One trophy. Zero chill.",
    category: "Collegiate",
    date: "2026-10-03",
    startTime: "18:00",
    endTime: "21:30",
    city: "Seattle",
    neighborhood: "University District",
    venue: {
      name: "Meany Hall, University of Washington",
      address: "4040 George Washington Ln NE, Seattle, WA 98195",
      lat: 47.6556,
      lng: -122.3104,
    },
    image: photos.stagePerformance,
    gallery: [photos.folkDrumDance, photos.dholProcession],
    description: [
      "The Pacific Northwest's biggest collegiate bhangra competition returns to Meany Hall. Teams from UW, Washington State, Oregon, UBC, and more bring eight-minute sets packed with dhol, saaps, and formations that make the whole balcony gasp.",
      "Between sets, alumni teams perform exhibition pieces, and the night closes with an open bhangra floor for everyone. Proceeds support South Asian student scholarships at participating universities.",
    ],
    highlights: ["8 competing teams", "Alumni exhibition sets", "Open floor after awards", "Proceeds fund scholarships"],
    organizer: organizers.pnwDance,
    tiers: [
      { name: "Student", price: 12, description: "Valid student ID required at the door" },
      { name: "General admission", price: 18, description: "Balcony and rear orchestra seating" },
      { name: "Front orchestra", price: 30, description: "First ten rows, closest to the stage", remaining: 24 },
    ],
    attending: 1120,
  },
  {
    slug: "sammamish-diwali-bazaar",
    title: "Sammamish Diwali Bazaar",
    tagline: "Shop diyas, jewelry, and festive wear from 40 local makers.",
    category: "Diwali",
    date: "2026-10-04",
    startTime: "11:00",
    endTime: "17:00",
    city: "Sammamish",
    neighborhood: "Sammamish Commons",
    venue: {
      name: "Sammamish Commons Plaza",
      address: "801 228th Ave SE, Sammamish, WA 98075",
      lat: 47.6093,
      lng: -122.0355,
    },
    image: photos.garlandMarket,
    gallery: [photos.diyaTray, photos.mithaiCase, photos.lotusGarlands],
    description: [
      "Get a head start on Diwali shopping without the drive to Kent or Lynnwood. More than 40 Eastside makers and small businesses set up across the plaza and community hall.",
      "Browse hand-painted diyas, rangoli kits, jewelry, mithai boxes, and festive wear — plus a henna booth from Mehndi Moments and a kids' corner making paper lanterns.",
      "Free entry. Parking is available in the City Hall garage.",
    ],
    highlights: ["40+ local makers", "Kids' lantern workshop", "Henna booth", "Free entry"],
    organizer: organizers.sammamishParivar,
    tiers: [{ name: "Free entry", price: 0, description: "No ticket needed — RSVP for reminders" }],
    attending: 530,
  },
  {
    slug: "eastside-navratri-garba-raas",
    title: "Eastside Navratri Garba Raas",
    tagline: "The Eastside's biggest garba night, with a live band.",
    category: "Garba",
    date: "2026-10-17",
    startTime: "19:30",
    endTime: "00:30",
    city: "Bellevue",
    neighborhood: "Downtown Bellevue",
    venue: {
      name: "Meydenbauer Center",
      address: "11100 NE 6th St, Bellevue, WA 98004",
      lat: 47.615,
      lng: -122.1932,
    },
    image: photos.garbaDiyasAlt,
    gallery: [photos.garbaTwirl, photos.garbaSelfie, photos.garbaNightGathering],
    description: [
      "Two thousand dancers, a live band from Ahmedabad, and the full exhibition hall at Meydenbauer Center — this is the Eastside's flagship Navratri night.",
      "The evening opens with aarti at 7:30 PM, followed by traditional garba, dandiya raas, and a fast-circle hour for the experienced. The food court from Saffron Table Catering serves Gujarati thali, fafda-jalebi, and masala chai until midnight.",
      "Traditional attire required on the dance floor. Dandiya sticks available at the door.",
    ],
    highlights: ["Live band from Ahmedabad", "Aarti at 7:30 PM", "Gujarati food court", "Dandiya sticks at the door"],
    organizer: organizers.eastsideGarba,
    tiers: [
      { name: "Early bird", price: 30, description: "General admission", soldOut: true },
      { name: "General admission", price: 35, description: "Dance floor access all night" },
      { name: "Family 4-pack", price: 110, description: "Four general admission tickets" },
      { name: "VIP", price: 75, description: "Reserved seating, dinner thali, express entry", remaining: 40 },
    ],
    attending: 1860,
    featured: true,
  },
  {
    slug: "diwali-on-the-waterfront",
    title: "Diwali on the Waterfront",
    tagline: "A thousand diyas along Lake Washington.",
    category: "Diwali",
    date: "2026-11-01",
    startTime: "17:00",
    endTime: "20:00",
    city: "Kirkland",
    neighborhood: "Downtown Kirkland",
    venue: {
      name: "Marina Park",
      address: "25 Lakeshore Plaza, Kirkland, WA 98033",
      lat: 47.6757,
      lng: -122.2085,
    },
    image: photos.diyaTray,
    gallery: [photos.diyasWarm, photos.sparklers, photos.diyaRangoli],
    description: [
      "Kirkland's free Diwali celebration lights up Marina Park with a thousand clay diyas along the water's edge. Bring the family for a community rangoli, classical dance performances, and a lantern walk along the pier at dusk.",
      "Local restaurants serve chaat and sweets, and the evening closes with a group aarti and a sparkler moment on the shore — sparklers provided, safety crew on site.",
    ],
    highlights: ["1,000 diyas along the water", "Community rangoli", "Lantern walk at dusk", "Free for everyone"],
    organizer: organizers.kirklandDiwali,
    tiers: [{ name: "Free entry", price: 0, description: "RSVP so we can plan diyas and sweets" }],
    attending: 940,
  },
  {
    slug: "seattle-center-diwali-mela",
    title: "Diwali Mela at Seattle Center",
    tagline: "Dance, food, and a night market in the Armory.",
    category: "Diwali",
    date: "2026-11-07",
    startTime: "12:00",
    endTime: "21:00",
    city: "Seattle",
    neighborhood: "Lower Queen Anne",
    venue: {
      name: "Seattle Center Armory",
      address: "305 Harrison St, Seattle, WA 98109",
      lat: 47.6215,
      lng: -122.3509,
    },
    image: photos.festivalCanopy,
    gallery: [photos.feastSpread, photos.classicalDancers, photos.mithaiCase],
    description: [
      "Seattle's all-day Diwali mela fills the Armory with performances from 20 dance schools, a night market of 60 vendors, and a food hall of regional favorites — from Kolkata kathi rolls to Hyderabadi biryani.",
      "Kids get a dedicated activity zone with Ramayana storytelling, rangoli, and face painting. The evening headliner is a live Bollywood set on the main stage at 7 PM.",
    ],
    highlights: ["20 dance schools on stage", "60-vendor night market", "Kids' activity zone", "Bollywood live set at 7 PM"],
    organizer: organizers.desiArts,
    tiers: [
      { name: "Kids under 12", price: 0, description: "Free with a paying adult" },
      { name: "General admission", price: 12, description: "All-day entry to the mela" },
      { name: "Family pass", price: 35, description: "Two adults and up to three kids" },
    ],
    attending: 2300,
    featured: true,
  },
  {
    slug: "night-of-lights-diwali-gala",
    title: "Night of Lights: Diwali Gala",
    tagline: "Black tie, live ghazals, and a five-course dinner.",
    category: "Diwali",
    date: "2026-11-07",
    startTime: "18:30",
    endTime: "23:30",
    city: "Bellevue",
    neighborhood: "Downtown Bellevue",
    venue: {
      name: "Hyatt Regency Bellevue — Grand Ballroom",
      address: "900 Bellevue Way NE, Bellevue, WA 98004",
      lat: 47.6178,
      lng: -122.2006,
    },
    image: photos.mandapBallroom,
    gallery: [photos.diyasTrio, photos.feastSpread],
    description: [
      "The Eastside's most elegant Diwali evening returns to the Hyatt Regency Grand Ballroom. Arrive to a lamp-lit reception with live santoor, then settle in for a five-course dinner by Saffron Table Catering and an evening of ghazals and Bollywood classics.",
      "The gala benefits Eastside youth arts scholarships. Festive formal or black tie. Valet parking included with VIP tables.",
    ],
    highlights: ["Five-course dinner", "Live ghazal & santoor", "Benefits youth arts", "Festive formal"],
    organizer: organizers.lotusFoundation,
    tiers: [
      { name: "Individual", price: 125, description: "Reception, dinner, and program" },
      { name: "VIP", price: 220, description: "Front tables, valet parking, champagne toast", remaining: 12 },
      { name: "Table of 8", price: 900, description: "Reserved table with your name on the placard", remaining: 3 },
    ],
    attending: 410,
  },
  {
    slug: "eastside-wedding-showcase",
    title: "Eastside South Asian Wedding Showcase",
    tagline: "Meet 70 wedding vendors in one afternoon.",
    category: "Wedding",
    date: "2027-01-17",
    startTime: "11:00",
    endTime: "17:00",
    city: "Bellevue",
    neighborhood: "Downtown Bellevue",
    venue: {
      name: "The Westin Bellevue",
      address: "600 Bellevue Way NE, Bellevue, WA 98004",
      lat: 47.6163,
      lng: -122.2013,
    },
    image: photos.mandapOutdoor,
    gallery: [photos.marigoldGarlands, photos.coupleGoldenLights, photos.mehndiBridal],
    description: [
      "Planning a wedding? Meet more than 70 of the region's best South Asian wedding vendors under one roof — decorators, caterers, mehndi artists, photographers, DJs, and bridal boutiques — with live mandap installations and a runway show at 2 PM.",
      "Book a free 15-minute planning consult, sample tasting menus, and unlock showcase-only discounts from participating vendors.",
    ],
    highlights: ["70+ vendors", "Bridal runway at 2 PM", "Tasting stations", "Showcase-only discounts"],
    organizer: organizers.utsav,
    tiers: [
      { name: "General admission", price: 15, description: "Full-day entry" },
      { name: "Couple pass", price: 25, description: "Entry for two" },
      { name: "VIP", price: 45, description: "Reserved runway seating and a gift bag", remaining: 60 },
    ],
    attending: 860,
    featured: true,
  },
  {
    slug: "sangeet-choreography-bootcamp",
    title: "Sangeet Choreography Bootcamp",
    tagline: "Learn a full sangeet routine in one evening.",
    category: "Wedding",
    date: "2027-02-13",
    startTime: "17:00",
    endTime: "20:00",
    city: "Redmond",
    neighborhood: "Education Hill",
    venue: {
      name: "Old Redmond Schoolhouse Community Center",
      address: "16600 NE 80th St, Redmond, WA 98052",
      lat: 47.6723,
      lng: -122.1177,
    },
    image: photos.dancersFestiveLights,
    gallery: [photos.sangeetGathering, photos.sangeetMehndiParty],
    description: [
      "Bride's squad, groom's cousins, or just want to own the floor at the next family wedding? Our instructors teach a crowd-pleasing four-song sangeet medley that works for every age and skill level.",
      "You'll leave with the full routine on video, a counts cheat sheet, and the confidence to lead it. Groups of six or more get their own practice corner.",
    ],
    highlights: ["4-song medley", "Routine video to keep", "All skill levels", "Group pricing"],
    organizer: organizers.nachle,
    tiers: [
      { name: "Single", price: 40, description: "One dancer" },
      { name: "Pair", price: 70, description: "Two dancers" },
      { name: "Group of 6", price: 190, description: "Six dancers with a private practice corner" },
    ],
    attending: 96,
  },
  {
    slug: "holi-hai-marymoor",
    title: "Holi Hai at Marymoor Park",
    tagline: "Colors, dhol, and thandai under Cascade skies.",
    category: "Holi",
    date: "2027-03-20",
    startTime: "11:00",
    endTime: "16:00",
    city: "Redmond",
    neighborhood: "Marymoor",
    venue: {
      name: "Marymoor Park — Event Meadow",
      address: "6046 W Lake Sammamish Pkwy NE, Redmond, WA 98052",
      lat: 47.6617,
      lng: -122.1214,
    },
    image: photos.holiCrowd,
    gallery: [photos.holiBurst, photos.holiHands, photos.holiPortrait],
    description: [
      "The Eastside's biggest festival of colors takes over the Marymoor Event Meadow. Every ticket includes organic, skin-safe color packs, with hourly color throws synced to live dhol and a DJ stage.",
      "Refuel with thandai, pakoras, and chaat from local food trucks. Wear white, bring sunglasses, and plan for a little Seattle drizzle — it only makes the colors brighter.",
    ],
    highlights: ["Organic, skin-safe colors", "Hourly color throws", "Live dhol + DJ stage", "Food trucks"],
    organizer: organizers.rangmanch,
    tiers: [
      { name: "Kids (4–12)", price: 10, description: "Includes two color packs" },
      { name: "General admission", price: 20, description: "Includes five color packs" },
      { name: "Color Crew VIP", price: 35, description: "Stage-side access, t-shirt, ten color packs", remaining: 80 },
    ],
    attending: 3100,
    featured: true,
  },
  {
    slug: "husky-holi-on-the-quad",
    title: "Husky Holi on the Quad",
    tagline: "UW's spring color celebration — free for all.",
    category: "Collegiate",
    date: "2027-03-27",
    startTime: "12:00",
    endTime: "15:00",
    city: "Seattle",
    neighborhood: "University District",
    venue: {
      name: "The Quad, University of Washington",
      address: "Liberal Arts Quadrangle, Seattle, WA 98195",
      lat: 47.6576,
      lng: -122.3074,
    },
    image: photos.holiSkyCrowd,
    gallery: [photos.holiPalms, photos.holiBurst],
    description: [
      "Hosted by UW's South Asian student community, Husky Holi turns the Quad into a canvas of color just as the cherry blossoms peak. Free color, free chai, and a student DJ lineup all afternoon.",
      "Open to students, alumni, and the whole community. Wear clothes you're happy to retire afterward.",
    ],
    highlights: ["Under the cherry blossoms", "Free color & chai", "Student DJ lineup", "Open to the community"],
    organizer: organizers.uwCollective,
    tiers: [{ name: "Free entry", price: 0, description: "RSVP for color-pack pickup" }],
    attending: 1600,
  },
];

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

/** Lowest available ticket price above $0, or 0 when every tier is free. */
export function fromPrice(e: EventItem) {
  const paid = e.tiers.filter((t) => t.price > 0 && !t.soldOut).map((t) => t.price);
  return paid.length ? Math.min(...paid) : 0;
}

export function isFree(e: EventItem) {
  return e.tiers.every((t) => t.price === 0);
}

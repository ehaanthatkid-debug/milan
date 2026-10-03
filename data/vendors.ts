import { photos } from "./images";
import type { City } from "./shared";

export const VENDOR_CATEGORIES = [
  "DJs",
  "Dhol players",
  "Mehndi artists",
  "Caterers",
  "Decor",
  "Photographers",
] as const;
export type VendorCategory = (typeof VENDOR_CATEGORIES)[number];

export type VendorService = {
  name: string;
  price: number;
  unit: string;
  description: string;
};

export type VendorReview = {
  name: string;
  rating: number;
  /** YYYY-MM-DD */
  date: string;
  occasion: string;
  text: string;
};

export type Vendor = {
  slug: string;
  name: string;
  category: VendorCategory;
  city: City;
  tagline: string;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  startingPrice: number;
  priceUnit: string;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  bio: string[];
  services: VendorService[];
  reviews: VendorReview[];
  /** Dates already booked, YYYY-MM-DD — shown as unavailable on the calendar. */
  bookedDates: string[];
  responseTime: string;
  yearsActive: number;
  languages: string[];
  serviceArea: string;
  verified: boolean;
  featured?: boolean;
};

export const vendors: Vendor[] = [
  {
    slug: "dj-kabir-nights",
    name: "DJ Kabir Nights",
    category: "DJs",
    city: "Seattle",
    tagline: "Bollywood, bhangra, and garba sets that keep every auntie on the floor.",
    priceRange: "$$$",
    startingPrice: 1200,
    priceUnit: "event",
    rating: 4.9,
    reviewCount: 212,
    image: photos.djCrowdSmoke,
    gallery: [photos.djBooth, photos.djLaptop, photos.djRedLight],
    bio: [
      "Kabir has been reading South Asian dance floors across the Pacific Northwest for eleven years — from 80-person backyard mehndis to 2,000-dancer Navratri nights at Meydenbauer Center.",
      "Every booking starts with a planning call to build your must-play and do-not-play lists, family entrance cues, and the exact moment the dhol should drop. Sets blend Bollywood, Punjabi, Gujarati folk, Tamil kuthu, and Top 40.",
    ],
    services: [
      { name: "Sangeet or reception", price: 1800, unit: "5 hours", description: "DJ + MC, full sound system, dance-floor lighting, and wireless mics for speeches." },
      { name: "Garba or Navratri night", price: 1200, unit: "4 hours", description: "Traditional garba and dandiya sets with fast-circle segments." },
      { name: "Baraat mobile DJ", price: 650, unit: "1 hour", description: "Battery-powered speaker cart that walks with the procession." },
      { name: "Uplighting add-on", price: 350, unit: "per event", description: "Twenty wireless uplights color-matched to your decor." },
    ],
    reviews: [
      { name: "Ananya R.", rating: 5, date: "2026-08-22", occasion: "Wedding reception, Bellevue", text: "Kabir read the room perfectly — he knew exactly when to switch from Bollywood to Punjabi to keep both families dancing. Our dance floor was never empty." },
      { name: "Rohan & Meera", rating: 5, date: "2026-07-11", occasion: "Sangeet, Redmond", text: "He coordinated every family performance cue without a single miss. Planning call was so thorough." },
      { name: "Sarah K.", rating: 5, date: "2026-06-02", occasion: "Corporate Diwali party", text: "Our team had never been to a Diwali party before, and Kabir had everyone doing garba by 9 PM." },
      { name: "Vikram P.", rating: 4, date: "2026-04-19", occasion: "Birthday, Seattle", text: "Great music and energy. Setup ran about fifteen minutes long, but he played past time to make up for it." },
    ],
    bookedDates: ["2026-10-03", "2026-10-10", "2026-10-17", "2026-10-24", "2026-10-31", "2026-11-07", "2026-11-14"],
    responseTime: "Usually replies within 2 hours",
    yearsActive: 11,
    languages: ["English", "Hindi", "Punjabi", "Gujarati"],
    serviceArea: "Seattle, Eastside & up to 60 miles",
    verified: true,
    featured: true,
  },
  {
    slug: "soundsutra-entertainment",
    name: "SoundSutra Entertainment",
    category: "DJs",
    city: "Redmond",
    tagline: "Full-service DJ, MC, and lighting for weddings of 100 to 1,000.",
    priceRange: "$$$$",
    startingPrice: 2500,
    priceUnit: "event",
    rating: 4.8,
    reviewCount: 147,
    image: photos.djPurple,
    gallery: [photos.djDecks, photos.djHands, photos.mandapBallroom],
    bio: [
      "SoundSutra is a five-person team handling multi-day South Asian weddings end to end: ceremony audio, sangeet production, reception MC, and cold sparks for the grand entrance.",
      "Two DJs rotate on every booking, so the music never stops for a break, and a dedicated coordinator runs your timeline with the venue and planner.",
    ],
    services: [
      { name: "Wedding weekend package", price: 6800, unit: "3 events", description: "Mehndi, sangeet, and reception with two DJs and full production." },
      { name: "Reception production", price: 2500, unit: "6 hours", description: "DJ, MC, line-array sound, dance-floor lighting, and a haze machine." },
      { name: "Ceremony audio", price: 700, unit: "per ceremony", description: "Lapel mic for the pandit, speakers for guests, and processional music." },
      { name: "Cold spark entrance", price: 900, unit: "per event", description: "Four indoor-safe spark fountains for the couple's entrance." },
    ],
    reviews: [
      { name: "Priyanka D.", rating: 5, date: "2026-09-06", occasion: "Wedding weekend, Woodinville", text: "Three events, three completely different vibes, zero stress. The cold sparks entrance made the whole room scream." },
      { name: "Harpreet G.", rating: 5, date: "2026-08-15", occasion: "Reception, Bellevue", text: "Their coordinator handled everything with the hotel. We didn't lift a finger." },
      { name: "Jason L.", rating: 4, date: "2026-05-30", occasion: "Wedding reception, Seattle", text: "Excellent production quality. A little pricey, but you get a lot of team for it." },
    ],
    bookedDates: ["2026-10-10", "2026-10-11", "2026-10-24", "2026-11-07", "2026-11-08", "2026-11-21"],
    responseTime: "Usually replies within 4 hours",
    yearsActive: 8,
    languages: ["English", "Hindi", "Telugu"],
    serviceArea: "Washington & Oregon",
    verified: true,
  },
  {
    slug: "baraat-beats-dhol",
    name: "Baraat Beats Dhol",
    category: "Dhol players",
    city: "Bellevue",
    tagline: "Punjabi dhol for baraats, sangeets, and surprise entrances.",
    priceRange: "$$",
    startingPrice: 450,
    priceUnit: "hour",
    rating: 5.0,
    reviewCount: 98,
    image: photos.dholSolo,
    gallery: [photos.dholProcession, photos.dholPlayer, photos.dholDuo],
    bio: [
      "Gurpreet and his brother Aman trained in Ludhiana and have been playing Eastside baraats since 2015. Nothing gets a groom's side moving like a live dhol at full volume.",
      "They'll march with the baraat, play the couple's entrance, and hand off seamlessly to your DJ for a dhol-plus-DJ mashup set.",
    ],
    services: [
      { name: "Baraat procession", price: 450, unit: "1 hour", description: "One dhol player for the groom's procession." },
      { name: "Double dhol", price: 750, unit: "1 hour", description: "Two players for bigger baraats and grand entrances." },
      { name: "Dhol + DJ set", price: 300, unit: "30 minutes", description: "Live dhol layered over your DJ's bhangra set." },
    ],
    reviews: [
      { name: "Manpreet S.", rating: 5, date: "2026-08-29", occasion: "Baraat, Bellevue", text: "Absolute legends. Our baraat went twenty minutes over because nobody wanted to stop dancing." },
      { name: "Neha & Arjun", rating: 5, date: "2026-07-25", occasion: "Sangeet, Kirkland", text: "The surprise dhol entrance for the bride's family gave everyone goosebumps." },
      { name: "Karthik V.", rating: 5, date: "2026-06-13", occasion: "Wedding, Redmond", text: "On time, professional, and so much energy. Worked perfectly with our DJ." },
    ],
    bookedDates: ["2026-10-10", "2026-10-17", "2026-10-18", "2026-11-07", "2026-11-28"],
    responseTime: "Usually replies within 1 hour",
    yearsActive: 11,
    languages: ["English", "Punjabi", "Hindi"],
    serviceArea: "Seattle & Eastside",
    verified: true,
    featured: true,
  },
  {
    slug: "dhol-nation-seattle",
    name: "Dhol Nation Seattle",
    category: "Dhol players",
    city: "Seattle",
    tagline: "A twelve-drummer ensemble for festivals, parades, and grand entrances.",
    priceRange: "$$$",
    startingPrice: 900,
    priceUnit: "event",
    rating: 4.8,
    reviewCount: 64,
    image: photos.dholParade,
    gallery: [photos.dholStreet, photos.dholWoman, photos.dholWomenGroup],
    bio: [
      "Dhol Nation is a community ensemble of twelve drummers — Marathi dhol-tasha, Punjabi dhol, and nashik beats — who play Ganpati processions, Diwali melas, and corporate stages across Seattle.",
      "Book the full troupe for a festival-scale entrance, or a four-drummer squad for weddings and campus events.",
    ],
    services: [
      { name: "Four-drummer squad", price: 900, unit: "45 minutes", description: "Wedding entrances, campus events, and private parties." },
      { name: "Full ensemble", price: 2400, unit: "1 hour", description: "Twelve drummers with tasha and flag bearers." },
      { name: "Parade or procession", price: 1800, unit: "per route", description: "Moving performance for festivals and street events." },
    ],
    reviews: [
      { name: "Tanvi B.", rating: 5, date: "2026-09-13", occasion: "Ganpati procession, Seattle", text: "The whole block came out to watch. Incredibly tight and powerful." },
      { name: "Michael & Ria", rating: 5, date: "2026-08-08", occasion: "Wedding entrance, Seattle", text: "My Irish family is still talking about it. Worth every penny." },
      { name: "Deepa N.", rating: 4, date: "2026-05-16", occasion: "Company event, South Lake Union", text: "Amazing performance. Needed a bit more space than we planned for, so measure your venue." },
    ],
    bookedDates: ["2026-10-04", "2026-10-17", "2026-11-01", "2026-11-07"],
    responseTime: "Usually replies within 6 hours",
    yearsActive: 7,
    languages: ["English", "Marathi", "Hindi"],
    serviceArea: "Greater Seattle",
    verified: true,
  },
  {
    slug: "henna-by-noor",
    name: "Henna by Noor",
    category: "Mehndi artists",
    city: "Kirkland",
    tagline: "Intricate bridal mehndi with organic, hand-mixed henna.",
    priceRange: "$$$",
    startingPrice: 350,
    priceUnit: "bride",
    rating: 4.9,
    reviewCount: 231,
    image: photos.mehndiBridal,
    gallery: [photos.mehndiHand, photos.mehndiBangles, photos.mehndiFeet],
    bio: [
      "Noor mixes every batch of henna by hand from Rajasthani leaf powder, lemon, and eucalyptus oil — no chemicals, no black henna, and a deep cranberry stain within 48 hours.",
      "Her bridal designs weave in your story: initials hidden in the palm, your first home's skyline, even the Space Needle. Trial sessions are available in her Kirkland studio.",
    ],
    services: [
      { name: "Bridal full hands & feet", price: 550, unit: "per bride", description: "Elbow-length hands and ankle-length feet, about six hours." },
      { name: "Bridal hands only", price: 350, unit: "per bride", description: "Front and back of both hands to the wrist or forearm." },
      { name: "Guest henna", price: 120, unit: "per hour", description: "Simple, elegant designs — about eight guests per hour." },
      { name: "Bridal trial", price: 75, unit: "per session", description: "One-hand trial in the studio, credited toward your booking." },
    ],
    reviews: [
      { name: "Fatima S.", rating: 5, date: "2026-09-05", occasion: "Bridal mehndi, Kirkland", text: "My stain was the darkest I've ever seen. Noor hid our initials so well my husband took twenty minutes to find them." },
      { name: "Aisha K.", rating: 5, date: "2026-08-01", occasion: "Eid gathering, Bellevue", text: "She did fifteen guests in two hours and every design was gorgeous." },
      { name: "Ananya R.", rating: 5, date: "2026-07-18", occasion: "Bridal mehndi, Sammamish", text: "Calm, kind, and an absolute artist. The six hours flew by." },
      { name: "Sana M.", rating: 4, date: "2026-06-21", occasion: "Sangeet, Redmond", text: "Beautiful work. Book early — she fills up months ahead in wedding season." },
    ],
    bookedDates: ["2026-10-09", "2026-10-15", "2026-10-16", "2026-10-30", "2026-11-05", "2026-11-06"],
    responseTime: "Usually replies within 3 hours",
    yearsActive: 9,
    languages: ["English", "Urdu", "Hindi"],
    serviceArea: "Eastside & Seattle",
    verified: true,
    featured: true,
  },
  {
    slug: "mehndi-moments-by-priya",
    name: "Mehndi Moments by Priya",
    category: "Mehndi artists",
    city: "Sammamish",
    tagline: "Party henna for guests, festivals, and Eid — fast and beautiful.",
    priceRange: "$$",
    startingPrice: 120,
    priceUnit: "hour",
    rating: 4.8,
    reviewCount: 176,
    image: photos.mehndiParty,
    gallery: [photos.mehndiHands, photos.mehndiBrideGreen, photos.mehndiBrideFlowers],
    bio: [
      "Priya leads a team of three henna artists who specialize in mehndi parties — keeping the line moving so every guest leaves with something beautiful.",
      "Find them at Eastside festivals most weekends, or book a team for your mehndi night, baby shower, or Eid celebration.",
    ],
    services: [
      { name: "Guest henna, one artist", price: 120, unit: "per hour", description: "Around eight guests per hour, two-hour minimum." },
      { name: "Mehndi party team", price: 420, unit: "per hour", description: "Three artists for large gatherings, two-hour minimum." },
      { name: "Bridal hands", price: 280, unit: "per bride", description: "Contemporary bridal design, front and back to the wrist." },
    ],
    reviews: [
      { name: "Tanvi B.", rating: 5, date: "2026-08-23", occasion: "Mehndi night, Sammamish", text: "Sixty guests and not one long wait. The team was so organized." },
      { name: "Harpreet G.", rating: 5, date: "2026-07-04", occasion: "Baby shower, Issaquah", text: "Priya was lovely with the kids and the designs were stunning." },
      { name: "Sarah K.", rating: 4, date: "2026-05-09", occasion: "Eid party, Redmond", text: "Great value and fast. My design was simpler than I hoped, but still beautiful." },
    ],
    bookedDates: ["2026-10-04", "2026-10-11", "2026-10-25", "2026-11-01"],
    responseTime: "Usually replies within 2 hours",
    yearsActive: 6,
    languages: ["English", "Hindi", "Tamil"],
    serviceArea: "Eastside",
    verified: true,
  },
  {
    slug: "saffron-table-catering",
    name: "Saffron Table Catering",
    category: "Caterers",
    city: "Redmond",
    tagline: "Regional Indian menus for 50 to 1,500 guests, cooked fresh on site.",
    priceRange: "$$$",
    startingPrice: 28,
    priceUnit: "guest",
    rating: 4.9,
    reviewCount: 318,
    image: photos.feastSpread,
    gallery: [photos.feastTopDown, photos.curriesRice, photos.samosas],
    bio: [
      "Chef Meenakshi Iyer's kitchen cooks the food of six regions — Gujarati, Punjabi, Hyderabadi, Chettinad, Bengali, and Goan — and brings live tandoors and dosa stations to your venue.",
      "Every menu starts with a tasting for up to six family members, and dietary needs are handled with separate Jain, vegan, and nut-free prep lines.",
    ],
    services: [
      { name: "Wedding buffet", price: 42, unit: "per guest", description: "Three appetizers, four mains, breads, rice, dessert, and full service staff." },
      { name: "Festival thali", price: 28, unit: "per guest", description: "Regional thali service for melas, garba nights, and pujas." },
      { name: "Live dosa or chaat station", price: 1200, unit: "per station", description: "Chef-attended station for up to 200 guests." },
      { name: "Private tasting", price: 150, unit: "per tasting", description: "Up to six people, credited toward your booking." },
    ],
    reviews: [
      { name: "Rohan & Meera", rating: 5, date: "2026-08-30", occasion: "Wedding, Redmond", text: "Our guests are still texting us about the Hyderabadi biryani. Service was flawless for 450 people." },
      { name: "Karthik V.", rating: 5, date: "2026-07-26", occasion: "Upanayanam, Bellevue", text: "The Chettinad menu tasted like my grandmother's kitchen. Separate Jain line was a huge help." },
      { name: "Michael & Ria", rating: 5, date: "2026-06-27", occasion: "Fusion wedding, Seattle", text: "They made a fusion menu that pleased both sides of the family. Incredible." },
      { name: "Deepa N.", rating: 4, date: "2026-05-02", occasion: "Graduation party, Kirkland", text: "Delicious food. Setup started late, but the team caught up quickly." },
    ],
    bookedDates: ["2026-10-03", "2026-10-10", "2026-10-17", "2026-11-07", "2026-11-08", "2026-11-14"],
    responseTime: "Usually replies within 3 hours",
    yearsActive: 14,
    languages: ["English", "Tamil", "Hindi", "Gujarati"],
    serviceArea: "Puget Sound region",
    verified: true,
    featured: true,
  },
  {
    slug: "masala-monsoon-kitchen",
    name: "Masala Monsoon Kitchen",
    category: "Caterers",
    city: "Seattle",
    tagline: "Street-food stations: chaat, dosa, pav bhaji, and late-night bites.",
    priceRange: "$$",
    startingPrice: 18,
    priceUnit: "guest",
    rating: 4.7,
    reviewCount: 142,
    image: photos.dosaThali,
    gallery: [photos.dosaLeaf, photos.bananaLeafMeal, photos.jalebi],
    bio: [
      "Born as a Capitol Hill pop-up, Masala Monsoon brings Mumbai and Chennai street food to weddings, office parties, and garba nights — cooked to order in front of your guests.",
      "Our late-night menu (vada pav, maggi, cutting chai) is the most-requested add-on for sangeets that run past midnight.",
    ],
    services: [
      { name: "Chaat bar", price: 18, unit: "per guest", description: "Pani puri, sev puri, dahi puri, and papdi chaat, made to order." },
      { name: "Dosa station", price: 22, unit: "per guest", description: "Masala, mysore, and cheese dosas with sambar and three chutneys." },
      { name: "Late-night menu", price: 14, unit: "per guest", description: "Vada pav, masala maggi, and cutting chai after 11 PM." },
    ],
    reviews: [
      { name: "Neha & Arjun", rating: 5, date: "2026-09-12", occasion: "Sangeet, Seattle", text: "The late-night vada pav was the best decision of our entire wedding." },
      { name: "Jason L.", rating: 4, date: "2026-07-17", occasion: "Office Diwali lunch", text: "Our team loved the chaat bar. The line got long, so add a second station for 100+." },
      { name: "Aisha K.", rating: 5, date: "2026-06-06", occasion: "Birthday party, Capitol Hill", text: "Fresh, fun, and so flavorful. The dosa guy was a total showman." },
    ],
    bookedDates: ["2026-10-03", "2026-10-09", "2026-10-24", "2026-11-07"],
    responseTime: "Usually replies within 5 hours",
    yearsActive: 5,
    languages: ["English", "Marathi", "Tamil"],
    serviceArea: "Seattle & Eastside",
    verified: true,
  },
  {
    slug: "marigold-and-mandap",
    name: "Marigold & Mandap",
    category: "Decor",
    city: "Bellevue",
    tagline: "Floral mandaps, stage design, and haldi setups with a modern eye.",
    priceRange: "$$$$",
    startingPrice: 3500,
    priceUnit: "event",
    rating: 4.9,
    reviewCount: 87,
    image: photos.mandapOutdoor,
    gallery: [photos.mandapBallroom, photos.mandapAisle, photos.mandapGarden],
    bio: [
      "Designer Rhea Kapoor builds mandaps and stages that feel both traditional and completely yours — fresh florals, custom carved panels, and lighting designed around your photographer's golden hour.",
      "Every project includes a 3D render of your ceremony space and a full install and teardown crew, so your family never touches a zip tie.",
    ],
    services: [
      { name: "Signature floral mandap", price: 3500, unit: "per ceremony", description: "Four-pillar mandap with fresh florals, drapery, and seating for the couple and family." },
      { name: "Sangeet stage & dance floor", price: 2800, unit: "per event", description: "Backdrop, LED dance floor, lounge furniture, and uplighting." },
      { name: "Haldi & mehndi setup", price: 1600, unit: "per event", description: "Marigold backdrop, floor seating, swings, and floral props." },
      { name: "Full wedding weekend", price: 9500, unit: "3 events", description: "Design, install, and teardown for all three events." },
    ],
    reviews: [
      { name: "Priyanka D.", rating: 5, date: "2026-09-06", occasion: "Wedding, Woodinville", text: "The mandap looked exactly like the 3D render — actually better. People thought we flew in a team from Jaipur." },
      { name: "Fatima S.", rating: 5, date: "2026-07-31", occasion: "Walima, Bellevue", text: "Rhea took our vague Pinterest board and made it elegant and personal." },
      { name: "Vikram P.", rating: 4, date: "2026-06-20", occasion: "Reception, Seattle", text: "Stunning work. Budget planning took a few rounds, but they were transparent the whole way." },
    ],
    bookedDates: ["2026-10-10", "2026-10-11", "2026-10-24", "2026-10-25", "2026-11-14"],
    responseTime: "Usually replies within 1 day",
    yearsActive: 10,
    languages: ["English", "Hindi"],
    serviceArea: "Washington State",
    verified: true,
    featured: true,
  },
  {
    slug: "genda-phool-studio",
    name: "Genda Phool Studio",
    category: "Decor",
    city: "Kirkland",
    tagline: "Marigold walls, diya installs, and intimate at-home puja decor.",
    priceRange: "$$",
    startingPrice: 650,
    priceUnit: "event",
    rating: 4.8,
    reviewCount: 73,
    image: photos.marigoldGarlands,
    gallery: [photos.lotusGarlands, photos.diyaTableDecor, photos.diyaRangoli],
    bio: [
      "Genda Phool (\"marigold\" in Hindi) does small-scale magic: living-room pujas, Diwali parties, griha pravesh ceremonies, and baby showers that look like a magazine spread.",
      "We source marigolds weekly from a Skagit Valley grower and bring every diya, garland, and brass urli ourselves.",
    ],
    services: [
      { name: "Home puja setup", price: 650, unit: "per event", description: "Marigold backdrop, altar styling, floor rangoli, and diyas." },
      { name: "Diwali party package", price: 1200, unit: "per event", description: "Entryway garlands, 100 diyas, table styling, and photo corner." },
      { name: "Marigold photo wall", price: 480, unit: "per wall", description: "Eight-foot fresh marigold and jasmine strand wall." },
    ],
    reviews: [
      { name: "Sana M.", rating: 5, date: "2026-08-16", occasion: "Griha pravesh, Kirkland", text: "Our new home felt blessed and beautiful. The team was respectful of every ritual." },
      { name: "Deepa N.", rating: 5, date: "2026-06-14", occasion: "Baby shower, Bothell", text: "The marigold wall was the star of every photo." },
      { name: "Manpreet S.", rating: 4, date: "2026-04-25", occasion: "Birthday puja, Redmond", text: "Lovely work and fair pricing. Arrived a little late, but finished on time." },
    ],
    bookedDates: ["2026-10-17", "2026-10-31", "2026-11-06", "2026-11-07", "2026-11-08"],
    responseTime: "Usually replies within 3 hours",
    yearsActive: 4,
    languages: ["English", "Hindi", "Bengali"],
    serviceArea: "Eastside",
    verified: false,
  },
  {
    slug: "kesar-films",
    name: "Kesar Films & Photo",
    category: "Photographers",
    city: "Seattle",
    tagline: "Cinematic wedding films and candid photography across multi-day celebrations.",
    priceRange: "$$$$",
    startingPrice: 4200,
    priceUnit: "event",
    rating: 5.0,
    reviewCount: 126,
    image: photos.coupleGoldenLights,
    gallery: [photos.coupleGoldenLightsAlt, photos.mehndiHandsHeld, photos.coupleGarlands],
    bio: [
      "Kesar is a husband-and-wife team (Dev and Ishani) who have photographed more than 300 South Asian weddings — from Snoqualmie Falls elopements to 900-guest Bellevue receptions.",
      "They shoot documentary-style with a small crew so your family forgets they're there, then deliver a cinematic highlight film within four weeks.",
    ],
    services: [
      { name: "Wedding day photo + film", price: 4200, unit: "10 hours", description: "Two photographers, one cinematographer, highlight film, and full gallery." },
      { name: "Wedding weekend", price: 9800, unit: "3 events", description: "Mehndi, sangeet, and wedding day with drone coverage." },
      { name: "Pre-wedding shoot", price: 950, unit: "2 hours", description: "Engagement session anywhere in Washington, with outfit changes." },
    ],
    reviews: [
      { name: "Rohan & Meera", rating: 5, date: "2026-09-01", occasion: "Wedding weekend, Redmond", text: "Our highlight film made both of our dads cry. We rewatch it every month." },
      { name: "Ananya R.", rating: 5, date: "2026-07-20", occasion: "Wedding, Bellevue", text: "They captured moments we didn't even know happened. Unreal eye for light." },
      { name: "Neha & Arjun", rating: 5, date: "2026-06-08", occasion: "Pre-wedding shoot, Snoqualmie", text: "Dev and Ishani made us feel totally natural in front of the camera." },
    ],
    bookedDates: ["2026-10-03", "2026-10-10", "2026-10-11", "2026-10-17", "2026-10-24", "2026-11-07"],
    responseTime: "Usually replies within 1 day",
    yearsActive: 12,
    languages: ["English", "Hindi", "Gujarati"],
    serviceArea: "Worldwide — based in Seattle",
    verified: true,
    featured: true,
  },
  {
    slug: "golden-hour-studio",
    name: "Golden Hour Studio",
    category: "Photographers",
    city: "Redmond",
    tagline: "Natural-light portraits, engagement shoots, and family festival sessions.",
    priceRange: "$$",
    startingPrice: 450,
    priceUnit: "session",
    rating: 4.8,
    reviewCount: 91,
    image: photos.coupleRiver,
    gallery: [photos.coupleForestPath, photos.coupleCourtyard, photos.groomPortrait],
    bio: [
      "Anika Rao photographs families and couples in the best light the Pacific Northwest has to offer — Snoqualmie riverbanks, Kubota Garden, and the tulip fields of Skagit Valley.",
      "Her Diwali and Navratri mini-sessions sell out every fall, so book early for festival portraits in your finest.",
    ],
    services: [
      { name: "Engagement session", price: 650, unit: "90 minutes", description: "Two locations, two outfits, 75+ edited images." },
      { name: "Festival family portraits", price: 450, unit: "45 minutes", description: "Diwali, Navratri, or Eid portraits for up to eight people." },
      { name: "Small event coverage", price: 300, unit: "per hour", description: "Pujas, birthdays, and baby showers — two-hour minimum." },
    ],
    reviews: [
      { name: "Karthik V.", rating: 5, date: "2026-09-19", occasion: "Engagement shoot, Snoqualmie", text: "Anika found light in places we would never have looked. Gorgeous gallery." },
      { name: "Sana M.", rating: 5, date: "2026-08-09", occasion: "Family portraits, Kirkland", text: "She got our toddler to smile in every single shot. Magic." },
      { name: "Jason L.", rating: 4, date: "2026-05-23", occasion: "Anniversary shoot, Seattle", text: "Beautiful images. Delivery took about a week longer than quoted." },
    ],
    bookedDates: ["2026-10-04", "2026-10-11", "2026-10-18", "2026-11-01", "2026-11-08"],
    responseTime: "Usually replies within 4 hours",
    yearsActive: 6,
    languages: ["English", "Kannada", "Hindi"],
    serviceArea: "Seattle & Eastside",
    verified: true,
  },
  {
    slug: "zaiqa-halal-kitchen",
    name: "Zaiqa Halal Kitchen",
    category: "Caterers",
    city: "Bellevue",
    tagline: "Halal-certified Pakistani and Hyderabadi catering for weddings, dawats, and Eid.",
    priceRange: "$$",
    startingPrice: 24,
    priceUnit: "guest",
    rating: 4.9,
    reviewCount: 203,
    image: photos.iftarSpread,
    gallery: [photos.biryaniPlatter, photos.biryaniBowl, photos.teaPour],
    bio: [
      "Zaiqa started as a family kitchen cooking for Eid dawats and grew into one of the Eastside's busiest halal caterers. Every ingredient is sourced from certified halal suppliers, and the kitchen is alcohol-free.",
      "Known for dum biryani cooked in copper degs on site, nihari that simmers overnight, and a live chaat counter. Iftar boxes are available throughout Ramadan.",
    ],
    services: [
      { name: "Wedding or walima buffet", price: 38, unit: "per guest", description: "Two appetizers, three mains, biryani, naan, raita, and dessert with service staff." },
      { name: "Dawat menu", price: 24, unit: "per guest", description: "Home-style menu for 30 to 150 guests, delivered and set up." },
      { name: "Live dum biryani", price: 950, unit: "per deg", description: "Cooked and opened in front of your guests — serves about 60." },
      { name: "Ramadan iftar boxes", price: 18, unit: "per box", description: "Dates, pakoras, fruit chaat, a main, and a drink. Minimum 20." },
    ],
    reviews: [
      { name: "Fatima S.", rating: 5, date: "2026-08-30", occasion: "Walima, Bellevue", text: "The biryani deg opening was a moment — 300 guests cheering for rice. Every plate came back empty." },
      { name: "Imran & Sadia", rating: 5, date: "2026-06-21", occasion: "Nikkah dinner, Redmond", text: "Truly halal, beautifully presented, and the staff were so respectful with our elders." },
      { name: "Aisha K.", rating: 5, date: "2026-03-28", occasion: "Ramadan iftar, Sammamish", text: "We ordered 80 iftar boxes for our masjid community and they arrived hot, on time, and right at maghrib." },
      { name: "Jason L.", rating: 4, date: "2026-02-14", occasion: "Office lunch, Bellevue", text: "Fantastic nihari. Spice level ran hot for some of my team, so ask for a mild version." },
    ],
    bookedDates: ["2026-10-10", "2026-10-17", "2026-11-07", "2026-11-21"],
    responseTime: "Usually replies within 2 hours",
    yearsActive: 9,
    languages: ["English", "Urdu", "Hindi", "Telugu"],
    serviceArea: "Seattle & Eastside",
    verified: true,
    featured: true,
  },
];

export function getVendor(slug: string) {
  return vendors.find((v) => v.slug === slug);
}

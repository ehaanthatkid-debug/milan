import { Camera, Disc3, Drum, Flower2, Hand, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { VendorCategory } from "@/data/vendors";

export const CATEGORY_ICONS: Record<VendorCategory, LucideIcon> = {
  DJs: Disc3,
  "Dhol players": Drum,
  "Mehndi artists": Hand,
  Caterers: UtensilsCrossed,
  Decor: Flower2,
  Photographers: Camera,
};

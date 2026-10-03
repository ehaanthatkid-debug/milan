import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MotionProvider } from "@/components/layout/MotionProvider";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Milan — South Asian events, vendors & festive wear in Seattle",
    template: "%s · Milan",
  },
  description:
    "Discover garba nights, Diwali melas, and wedding vendors across Seattle, Bellevue, Redmond, Sammamish, and Kirkland — and rent the outfit to match.",
};

export const viewport: Viewport = {
  themeColor: "#FBF6EE",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <MotionProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <MobileNav />
        </MotionProvider>
      </body>
    </html>
  );
}

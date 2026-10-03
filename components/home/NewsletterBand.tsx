"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CircleCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { photos } from "@/data/images";
import { Eyebrow } from "@/components/ui/SectionHeading";

export function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (email.includes("@")) setDone(true);
  }

  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
      <div className="relative overflow-hidden rounded-[2rem] bg-maroon text-ivory lg:rounded-[2.5rem]">
        <Image
          src={photos.bokehLights}
          alt=""
          fill
          sizes="(min-width: 1400px) 1400px, 100vw"
          className="object-cover opacity-30 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon via-maroon/90 to-maroon/40" />
        <div className="relative grid gap-8 px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:px-16 lg:py-20">
          <div>
            <Eyebrow tone="light">The Thursday Letter</Eyebrow>
            <h2 className="font-display mt-3 text-[2.1rem] leading-[1.05] sm:text-5xl">
              Never miss a <em className="text-saffron">celebration</em> again.
            </h2>
            <p className="mt-4 max-w-md text-ivory/75 sm:text-lg">
              One email every Thursday with the weekend&apos;s events, new closet arrivals, and vendor openings across Seattle
              and the Eastside.
            </p>
          </div>
          <div className="min-h-[7.5rem]">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 rounded-3xl bg-ivory/10 p-5 ring-1 ring-ivory/20 backdrop-blur"
                >
                  <CircleCheck className="mt-0.5 size-6 shrink-0 text-saffron" />
                  <div>
                    <p className="font-semibold">You&apos;re on the list.</p>
                    <p className="mt-1 text-sm text-ivory/75">Your first email arrives Thursday morning.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={onSubmit}
                  className="flex flex-col gap-2 rounded-[1.75rem] bg-ivory p-2 sm:flex-row sm:rounded-full"
                >
                  <label className="flex-1">
                    <span className="sr-only">Email address</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-full bg-transparent px-5 text-ink placeholder:text-ink-mute focus:outline-none"
                    />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-maroon px-6 font-medium text-ivory transition-all hover:bg-maroon-deep active:scale-[0.97]"
                  >
                    Subscribe <ArrowRight className="size-4" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
            {!done && <p className="mt-3 px-2 text-sm text-ivory/60">12,400 neighbors already subscribe. Unsubscribe anytime.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
